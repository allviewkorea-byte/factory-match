"""
enrich_ai_summary.py
website 있는 공장 홈페이지를 Claude API로 분석 → ai_summary 컬럼에 저장

사용법:
  pip install requests
  export ANTHROPIC_API_KEY=sk-ant-...
  python enrich_ai_summary.py

동작:
  1. Supabase factories 테이블에서 website IS NOT NULL AND ai_summary IS NULL 조회
     (ID 커서 방식, 1,000개씩)
  2. 각 공장 website에 HTTP 접속 시도
     - 실패 (4xx/5xx, 타임아웃, 연결 오류): website 컬럼 NULL 처리 + website_invalid.json 기록
     - 성공: HTML에서 텍스트 추출 → Claude API 분석
  3. Claude가 JSON 형식으로 공장 요약 반환 → ai_summary 컬럼에 저장
  4. 하루 500건 제한 (비용 관리)
  5. 100건마다 ai_summary_progress.json에 진행상황 저장
"""

import sys
print("Python " + sys.version)
print("시작...")

import os
import re
import json
import time
import random
from typing import Optional, Tuple, List

import requests

# ── Claude API 설정 ───────────────────────────────────────
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
MODEL             = "claude-haiku-4-5-20251001"
DAILY_LIMIT       = 500

# ── Supabase 설정 ─────────────────────────────────────────
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30"
    ".8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
)
SB_HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── 기타 설정 ─────────────────────────────────────────────
PROGRESS_FILE   = "ai_summary_progress.json"
INVALID_FILE    = "website_invalid.json"
FETCH_PAGESIZE  = 1_000
DELAY_MIN       = 1.5
DELAY_MAX       = 3.0
WEBSITE_TIMEOUT = (10, 20)   # (connect, read)초
CLAUDE_TIMEOUT  = (10, 60)
MAX_HTML_CHARS  = 4_000      # Claude에 넘길 HTML 텍스트 최대 길이

SYSTEM_PROMPT = """당신은 한국 B2B 제조업 공장 정보를 수집하는 AI입니다.
주어진 공장 홈페이지 내용을 분석하여 바이어에게 유용한 정보를 추출하세요.

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이 순수 JSON):
{
  "intro": "바이어에게 보여줄 2~3문장 소개글 (홈페이지 내용 기반, 없으면 공장명·위치·업종으로 생성)",
  "products": ["주요 제품1", "주요 제품2"],
  "equipment": ["보유 장비1", "보유 장비2"],
  "clients": ["납품처1", "납품처2"],
  "certifications": ["인증1", "인증2"],
  "strengths": ["강점1", "강점2"]
}

지침:
- intro는 반드시 바이어 관점의 자연스러운 한국어 2~3문장으로 작성
- 홈페이지 내용이 공장과 무관한 사이트(주차 페이지, 광고 등)면 DB 정보(공장명, 위치, 업종)만으로 작성
- 확인되지 않은 정보는 절대 생성하지 말 것
- 없는 정보는 빈 배열 [] 처리
- JSON만 반환 (마크다운 코드블록 없이)"""

WEBSITE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
}


# ─────────────────────────────────────────────────────────
# HTML 텍스트 추출
# ─────────────────────────────────────────────────────────

def _strip_html(html):
    # type: (str) -> str
    """HTML에서 스크립트·스타일 제거 후 가시 텍스트 추출"""
    html = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>',  ' ', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<!--.*?-->',               ' ', html, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>',                 ' ', html)
    text = re.sub(r'&[a-zA-Z#0-9]+;',         ' ', text)  # HTML 엔티티 제거
    text = re.sub(r'\s+',                      ' ', text).strip()
    return text[:MAX_HTML_CHARS]


# ─────────────────────────────────────────────────────────
# Supabase 헬퍼
# ─────────────────────────────────────────────────────────

def sb_fetch_batch(last_id):
    # type: (Optional[str]) -> list
    """website 있고 ai_summary 없는 공장 조회 (ID 커서 페이지네이션)"""
    params = {
        "select":     "id,name,city,website,industries",
        "website":    "not.is.null",
        "ai_summary": "is.null",
        "order":      "id.asc",
        "limit":      str(FETCH_PAGESIZE),
    }
    if last_id is not None:
        params["id"] = "gt." + str(last_id)
    r = requests.get(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params=params,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def sb_update_ai_summary(factory_id, summary_dict):
    # type: (str, dict) -> None
    """ai_summary가 NULL인 경우에만 UPDATE"""
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": "eq." + str(factory_id), "ai_summary": "is.null"},
        json={"ai_summary": json.dumps(summary_dict, ensure_ascii=False)},
        timeout=30,
    )
    r.raise_for_status()


def sb_nullify_website(factory_id):
    # type: (str) -> None
    """유효하지 않은 website URL을 NULL로 업데이트"""
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": "eq." + str(factory_id)},
        json={"website": None},
        timeout=30,
    )
    r.raise_for_status()


# ─────────────────────────────────────────────────────────
# 웹사이트 접속
# ─────────────────────────────────────────────────────────

def fetch_website(url):
    # type: (str) -> Tuple[Optional[str], bool]
    """
    홈페이지 접속 후 텍스트 추출.
    반환: (텍스트 또는 None, 성공여부)
    """
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    try:
        r = requests.get(
            url,
            headers=WEBSITE_HEADERS,
            timeout=WEBSITE_TIMEOUT,
            allow_redirects=True,
        )
        if r.status_code >= 400:
            print("    [WEB] HTTP {0} → 무효".format(r.status_code))
            return None, False
        text = _strip_html(r.text)
        print("    [WEB] OK ({0}자 추출)".format(len(text)))
        return text, True
    except requests.exceptions.Timeout:
        print("    [WEB] 타임아웃 → 무효")
        return None, False
    except Exception as e:
        print("    [WEB] 오류: {0} → 무효".format(e))
        return None, False


# ─────────────────────────────────────────────────────────
# Claude API 호출
# ─────────────────────────────────────────────────────────

def _build_user_content(factory, html_text):
    # type: (dict, Optional[str]) -> str
    ind = factory.get("industries", "")
    if isinstance(ind, list):
        ind = ", ".join(str(i) for i in ind if i)
    elif not ind:
        ind = ""

    if html_text:
        return (
            "공장명: {name}\n위치: {city}\n업종: {ind}\n홈페이지: {website}\n\n"
            "=== 홈페이지 내용 (발췌) ===\n{html}\n\n"
            "위 정보를 바탕으로 JSON 형식으로만 반환하세요."
        ).format(
            name=factory.get("name", ""),
            city=factory.get("city", ""),
            ind=ind,
            website=factory.get("website", ""),
            html=html_text,
        )
    else:
        return (
            "공장명: {name}\n위치: {city}\n업종: {ind}\n홈페이지: {website}\n\n"
            "홈페이지 내용을 가져오지 못했습니다. "
            "위 DB 정보만으로 JSON 형식으로만 반환하세요."
        ).format(
            name=factory.get("name", ""),
            city=factory.get("city", ""),
            ind=ind,
            website=factory.get("website", ""),
        )


def _call_claude_once(api_key, user_content):
    # type: (str, str) -> Tuple[Optional[dict], bool]
    """Claude API 단일 호출. 반환: (결과 dict, 오류여부)"""
    try:
        r = requests.post(
            ANTHROPIC_API_URL,
            headers={
                "x-api-key":         api_key,
                "anthropic-version": "2023-06-01",
                "content-type":      "application/json",
            },
            json={
                "model":      MODEL,
                "max_tokens": 1024,
                "system":     SYSTEM_PROMPT,
                "messages":   [{"role": "user", "content": user_content}],
            },
            timeout=CLAUDE_TIMEOUT,
        )
        if r.status_code == 401:
            raise RuntimeError("ANTHROPIC_API_KEY가 유효하지 않습니다 (HTTP 401)")
        if r.status_code != 200:
            print("    [AI] HTTP {0}".format(r.status_code))
            return None, True

        data  = r.json()
        raw   = (data.get("content") or [{}])[0].get("text", "")
        # 마크다운 코드블록 제거
        raw   = re.sub(r'^```(?:json)?\s*', '', raw.strip(), flags=re.IGNORECASE)
        raw   = re.sub(r'\s*```$', '',        raw.strip())
        result = json.loads(raw)
        return result, False

    except (json.JSONDecodeError, ValueError) as e:
        print("    [AI] JSON 파싱 실패: {0}".format(e))
        return None, True
    except RuntimeError:
        raise
    except Exception as e:
        print("    [AI] 오류: {0}".format(e))
        return None, True


def call_claude(api_key, factory, html_text):
    # type: (str, dict, Optional[str]) -> Tuple[Optional[dict], bool]
    """Claude API 호출 (오류 시 1회 재시도). 반환: (결과 dict, 오류여부)"""
    user_content = _build_user_content(factory, html_text)
    print("    [AI] 호출 중 (시도 1)")
    result, error = _call_claude_once(api_key, user_content)
    if error:
        time.sleep(3)
        print("    [AI] 호출 중 (시도 2 – 재시도)")
        result, error = _call_claude_once(api_key, user_content)
    return result, error


# ─────────────────────────────────────────────────────────
# 무효 URL 기록
# ─────────────────────────────────────────────────────────

def load_invalid():
    # type: () -> list
    try:
        with open(INVALID_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (IOError, ValueError):
        return []


def append_invalid(record, invalid_list):
    # type: (dict, list) -> None
    invalid_list.append(record)
    with open(INVALID_FILE, "w", encoding="utf-8") as f:
        json.dump(invalid_list, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────
# 진행상황 저장 / 불러오기
# ─────────────────────────────────────────────────────────

def load_progress():
    # type: () -> dict
    try:
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (IOError, ValueError):
        return {
            "processed":  0,
            "updated":    0,
            "invalid":    0,
            "ai_error":   0,
            "api_calls":  0,
            "last_id":    None,
        }


def save_progress(prog):
    # type: (dict) -> None
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────

def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print("[오류] ANTHROPIC_API_KEY 환경변수가 없습니다.")
        print("  export ANTHROPIC_API_KEY=sk-ant-...")
        return

    prog           = load_progress()
    total_processed = prog.get("processed", 0)
    total_updated   = prog.get("updated",   0)
    total_invalid   = prog.get("invalid",   0)
    total_ai_error  = prog.get("ai_error",  0)
    total_api_calls = prog.get("api_calls", 0)
    last_id         = prog.get("last_id",   None)
    invalid_list    = load_invalid()

    print("")
    print("=" * 58)
    print("  AI 요약 생성 (enrich_ai_summary.py)")
    print("=" * 58)
    print("  이전 누적 처리: {0:,}건 | 업데이트: {1:,}건".format(total_processed, total_updated))
    print("  이전 누적 API 호출: {0:,}건".format(total_api_calls))
    print("  금일 한도: {0:,}건 | 모델: {1}".format(DAILY_LIMIT, MODEL))
    if last_id is not None:
        print("  커서 재개 위치: id > {0}".format(last_id))
    print("")

    today_api_calls = 0
    quota_exceeded  = False

    while today_api_calls < DAILY_LIMIT and not quota_exceeded:
        try:
            batch = sb_fetch_batch(last_id)
        except Exception as e:
            print("[오류] Supabase 조회 실패: {0}".format(e))
            break

        if not batch:
            print("처리할 공장이 더 없습니다. 완료!")
            break

        for factory in batch:
            if today_api_calls >= DAILY_LIMIT:
                print("\n금일 한도 {0:,}건 도달. 내일 재실행하세요.".format(DAILY_LIMIT))
                quota_exceeded = True
                break

            fid     = factory.get("id", "")
            name    = (factory.get("name") or "").strip()
            website = (factory.get("website") or "").strip()
            last_id = fid

            print("  [{0:>6}] {1:<30} | {2}".format(
                total_processed + 1, name[:30], website[:40]))

            if not name or not website:
                total_processed += 1
                continue

            # 1단계: 홈페이지 접속
            html_text, web_ok = fetch_website(website)

            if not web_ok:
                # 무효 URL → website NULL 처리
                try:
                    sb_nullify_website(fid)
                except Exception as e:
                    print("    [DB] website NULL 처리 실패: {0}".format(e))
                append_invalid({"id": fid, "name": name, "website": website}, invalid_list)
                total_invalid += 1
                total_processed += 1
                print("    → 무효 URL 기록 완료")
                time.sleep(random.uniform(0.3, 0.8))
                continue

            # 2단계: Claude API 분석
            try:
                summary, ai_err = call_claude(api_key, factory, html_text)
            except RuntimeError as e:
                print("[치명적 오류] {0}".format(e))
                return

            today_api_calls += 1
            total_api_calls += 1

            if ai_err or summary is None:
                total_ai_error += 1
                total_processed += 1
                print("    → AI 분석 실패 (스킵)")
                time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))
                continue

            print("    [AI] 완료: intro={0!r}…".format(str(summary.get("intro", ""))[:40]))

            # 3단계: Supabase 저장
            try:
                sb_update_ai_summary(fid, summary)
                total_updated += 1
                print("    → 저장 완료")
            except Exception as e:
                print("    → DB 저장 실패: {0}".format(e))

            total_processed += 1

            # 100건마다 중간 저장
            if total_processed % 100 == 0:
                prog.update({
                    "processed": total_processed,
                    "updated":   total_updated,
                    "invalid":   total_invalid,
                    "ai_error":  total_ai_error,
                    "api_calls": total_api_calls,
                    "last_id":   last_id,
                })
                save_progress(prog)
                print(
                    "\n  -- 중간 저장 [{0:,}건] 업데이트: {1:,} | "
                    "금일 API: {2:,}/{3:,} --\n".format(
                        total_processed, total_updated,
                        today_api_calls, DAILY_LIMIT)
                )

            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

    # 최종 저장
    prog.update({
        "processed": total_processed,
        "updated":   total_updated,
        "invalid":   total_invalid,
        "ai_error":  total_ai_error,
        "api_calls": total_api_calls,
        "last_id":   last_id,
    })
    save_progress(prog)

    pct = (total_updated / total_processed * 100) if total_processed else 0.0
    print("\n" + "=" * 58)
    print("  완료 요약")
    print("=" * 58)
    print("  처리 건수     : {0:,}건".format(total_processed))
    print("  저장 성공     : {0:,}건 ({1:.1f}%)".format(total_updated, pct))
    print("  무효 URL      : {0:,}건  (→ {1})".format(total_invalid, INVALID_FILE))
    print("  AI 오류       : {0:,}건".format(total_ai_error))
    print("  금일 API 호출 : {0:,}건".format(today_api_calls))
    print("  진행 저장     : {0}".format(PROGRESS_FILE))
    print("=" * 58)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print("\n[오류 발생]")
        traceback.print_exc()
        input("\nEnter 키를 누르면 종료합니다...")
