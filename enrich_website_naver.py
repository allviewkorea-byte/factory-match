"""
enrich_website_naver.py
네이버 검색 API로 공장 공식 홈페이지 URL 수집 → Supabase UPDATE

사용법:
  pip install requests
  python enrich_website_naver.py

동작:
  1. Supabase에서 website IS NULL인 공장 목록 조회 (1,000개씩 페이지)
  2. 공장명으로 네이버 검색 API 호출 (지역 검색 → 웹 검색 순)
  3. 결과에서 공식 홈페이지 URL 추출 후 factories.website UPDATE
  4. 진행 상황 website_progress.json에 100건마다 저장

네이버 API 한도: 25,000건/일 → 24,000건만 사용
실패(네트워크 오류) 시 1회 재시도, 결과 없으면 NULL 유지
"""

import json
import re
import time
import random
import requests
from urllib.parse import urlparse

# ── 네이버 API 설정 ───────────────────────────────────────
NAVER_CLIENT_ID     = "tgqWP4gTAET4eh7pp1gh"
NAVER_CLIENT_SECRET = "jBMiXrwRT9"
NAVER_HEADERS = {
    "X-Naver-Client-Id":     NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
}

# 하루 한도 초과 방지 (25,000 중 24,000만 사용)
DAILY_API_LIMIT = 24_000

# ── Supabase 설정 ─────────────────────────────────────────
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30"
    ".8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
)
SB_HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── 기타 설정 ─────────────────────────────────────────────
PROGRESS_FILE  = "website_progress.json"
FETCH_PAGESIZE = 1000     # Supabase 조회 단위
DELAY_MIN      = 1.0      # 요청 간 최소 대기 (초)
DELAY_MAX      = 2.0      # 요청 간 최대 대기 (초)

# 공식 홈페이지가 아닐 가능성 높은 도메인 (필터 제외)
_SKIP_DOMAINS = {
    "naver.com", "daum.net", "nate.com", "zum.com",
    "google.com", "google.co.kr", "bing.com", "yahoo.com",
    "blog.naver.com", "blog.daum.net", "cafe.naver.com",
    "tistory.com", "brunch.co.kr", "medium.com",
    "facebook.com", "instagram.com", "twitter.com", "x.com",
    "youtube.com", "linkedin.com", "threads.net",
    "kakaotalk.com", "kakao.com", "pf.kakao.com",
    "nicebizinfo.com", "koreatax.go.kr", "bizno.net",
    "saramin.co.kr", "incruit.com", "jobkorea.co.kr",
    "wanted.co.kr", "worknet.go.kr", "albamon.com",
    "news.naver.com", "n.news.naver.com",
    "wikipedia.org", "namu.wiki",
    "11st.co.kr", "gmarket.co.kr", "auction.co.kr",
    "smartstore.naver.com", "storefarm.naver.com",
    "coupang.com", "elevenst.co.kr",
}


# ─────────────────────────────────────────────────────────
# Supabase 헬퍼
# ─────────────────────────────────────────────────────────

def sb_fetch_nullwebsite(offset: int) -> list:
    """website IS NULL인 공장 목록 (id, name, city) 페이지 조회"""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/factories",
        headers=SB_HEADERS,
        params={
            "select":  "id,name,city",
            "website": "is.null",
            "order":   "id.asc",
            "offset":  str(offset),
            "limit":   str(FETCH_PAGESIZE),
        },
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def sb_update_website(factory_id: str, website_url: str) -> None:
    """factories.website 컬럼 UPDATE"""
    r = requests.patch(
        f"{SUPABASE_URL}/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": f"eq.{factory_id}"},
        json={"website": website_url},
        timeout=30,
    )
    r.raise_for_status()


# ─────────────────────────────────────────────────────────
# URL 유효성 검사
# ─────────────────────────────────────────────────────────

def is_official_url(url: str) -> bool:
    """공식 홈페이지로 적합한 URL인지 판단"""
    if not url or not url.startswith("http"):
        return False
    try:
        parsed = urlparse(url)
        host = parsed.netloc.lower().lstrip("www.")
        # 등록된 스킵 도메인 체크
        for skip in _SKIP_DOMAINS:
            if host == skip or host.endswith("." + skip):
                return False
        # 도메인이 비어있거나 IP 주소면 제외
        if not host or re.match(r"^\d+\.\d+\.\d+\.\d+", host):
            return False
    except Exception:
        return False
    return True


def clean_url(url: str) -> str:
    """쿼리스트링·앵커 제거, 후행 슬래시 정리"""
    try:
        p = urlparse(url)
        return f"{p.scheme}://{p.netloc}{p.path}".rstrip("/") or url
    except Exception:
        return url


# ─────────────────────────────────────────────────────────
# 네이버 검색 API
# ─────────────────────────────────────────────────────────

def _naver_get(endpoint: str, query: str, display: int = 5) -> list:
    """
    네이버 API 단일 호출. 성공 시 items 리스트 반환.
    HTTP 오류·타임아웃 시 빈 리스트 반환 (예외 미전파).
    """
    try:
        r = requests.get(
            f"https://openapi.naver.com/v1/search/{endpoint}",
            headers=NAVER_HEADERS,
            params={"query": query, "display": display},
            timeout=10,
        )
        if r.status_code == 429:
            # 일일 한도 초과 신호
            raise RuntimeError("NAVER_QUOTA_EXCEEDED")
        if r.status_code != 200:
            return []
        return r.json().get("items", [])
    except RuntimeError:
        raise
    except Exception:
        return []


def search_local(name: str) -> str | None:
    """
    네이버 지역 검색 — 기업 공식 홈페이지 link 필드 반환.
    제조업체 검색에 효과적.
    """
    items = _naver_get("local.json", name, display=5)
    for item in items:
        link = item.get("link", "")
        if is_official_url(link):
            return clean_url(link)
    return None


def search_web(name: str) -> str | None:
    """
    네이버 웹 검색 — '{name} 홈페이지' 쿼리로 공식 사이트 탐색.
    지역 검색 실패 시 fallback으로 사용.
    """
    items = _naver_get("webkr.json", f"{name} 홈페이지", display=5)
    for item in items:
        link = item.get("link", "")
        # HTML 태그 제거 (webkr 결과는 태그가 섞임)
        link = re.sub(r"<[^>]+>", "", link).strip()
        if is_official_url(link):
            return clean_url(link)
    return None


def find_website(name: str, api_call_counter: list) -> str | None:
    """
    지역 검색 → 웹 검색 순으로 홈페이지 탐색.
    api_call_counter[0] 에 사용한 API 호출 수 누적.
    네트워크 오류 시 1회 재시도.
    """
    def call_with_retry(fn, *args):
        """fn(*args) 실패 시 1초 대기 후 1회 재시도"""
        result = fn(*args)
        if result is None:
            # 결과 없음은 재시도 불필요, 네트워크 오류가 아님
            # (예외는 fn 내부에서 이미 흡수됨)
            pass
        api_call_counter[0] += 1
        return result

    # 1차: 지역 검색
    website = call_with_retry(search_local, name)
    if website:
        return website

    # 2차: 웹 검색 fallback
    website = call_with_retry(search_web, name)
    return website  # None 이면 website = NULL 유지


# ─────────────────────────────────────────────────────────
# 진행 상황 저장 / 불러오기
# ─────────────────────────────────────────────────────────

def load_progress() -> dict:
    try:
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"processed": 0, "updated": 0, "not_found": 0, "api_calls": 0}


def save_progress(prog: dict) -> None:
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────

def main():
    prog = load_progress()
    total_processed = prog["processed"]
    total_updated   = prog["updated"]
    total_not_found = prog["not_found"]
    total_api_calls = prog["api_calls"]

    print("=" * 55)
    print("  네이버 API 홈페이지 수집 (enrich_website_naver.py)")
    print("=" * 55)
    print(f"  이전 누적 처리: {total_processed:,}건 | 업데이트: {total_updated:,}건")
    print(f"  이전 누적 API 호출: {total_api_calls:,}건")
    print(f"  금일 API 한도: {DAILY_API_LIMIT:,}건\n")

    today_api_calls = 0
    offset = 0
    quota_exceeded = False

    while today_api_calls < DAILY_API_LIMIT and not quota_exceeded:
        # Supabase에서 website IS NULL 공장 배치 조회
        try:
            batch = sb_fetch_nullwebsite(offset)
        except Exception as e:
            print(f"[오류] Supabase 조회 실패: {e}")
            break

        if not batch:
            print("처리할 공장이 더 없습니다. 모두 완료!")
            break

        for factory in batch:
            if today_api_calls >= DAILY_API_LIMIT:
                print(f"\n금일 API 한도 {DAILY_API_LIMIT:,}건 도달. 내일 재실행하세요.")
                break

            fid  = factory.get("id", "")
            name = (factory.get("name") or "").strip()
            city = (factory.get("city") or "").strip()

            if not name:
                total_not_found += 1
                total_processed += 1
                continue

            # API 호출 카운터 (뮤터블 컨테이너로 전달)
            call_counter = [0]

            try:
                website = find_website(name, call_counter)
            except RuntimeError as e:
                if "QUOTA_EXCEEDED" in str(e):
                    print("\n[경고] 네이버 API 일일 한도 초과 응답 수신. 중단합니다.")
                    quota_exceeded = True
                    break
                website = None

            today_api_calls += call_counter[0]
            total_api_calls += call_counter[0]

            if website:
                try:
                    sb_update_website(fid, website)
                    total_updated += 1
                    status = f"✓  {website}"
                except Exception as e:
                    status = f"✗  DB 오류: {e}"
                    website = None
            else:
                total_not_found += 1
                status = "—  결과 없음"

            total_processed += 1

            # 매 건 간단 출력
            loc = f" ({city})" if city else ""
            print(f"  [{total_processed:>6}] {name}{loc}  →  {status}")

            # 100건마다 진행 상황 저장 + 요약 출력
            if total_processed % 100 == 0:
                prog.update({
                    "processed": total_processed,
                    "updated":   total_updated,
                    "not_found": total_not_found,
                    "api_calls": total_api_calls,
                })
                save_progress(prog)
                print(
                    f"\n  ── 중간 저장 [{total_processed:,}건] "
                    f"업데이트: {total_updated:,} | "
                    f"금일 API: {today_api_calls:,}/{DAILY_API_LIMIT:,} ──\n"
                )

            # 요청 간 딜레이 (API 과부하 방지)
            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

        offset += len(batch)
        if len(batch) < FETCH_PAGESIZE:
            print("모든 공장 처리 완료!")
            break

    # 최종 진행 상황 저장
    prog.update({
        "processed": total_processed,
        "updated":   total_updated,
        "not_found": total_not_found,
        "api_calls": total_api_calls,
    })
    save_progress(prog)

    # 결과 요약
    success_rate = (total_updated / total_processed * 100) if total_processed else 0
    print("\n" + "=" * 55)
    print("  완료 요약")
    print("=" * 55)
    print(f"  금일 처리 건수 : {total_processed:,}건 (누적)")
    print(f"  금일 API 호출  : {today_api_calls:,}건")
    print(f"  홈페이지 업데이트: {total_updated:,}건 ({success_rate:.1f}%)")
    print(f"  결과 없음      : {total_not_found:,}건")
    print(f"  진행 저장 위치 : {PROGRESS_FILE}")
    print("=" * 55)


if __name__ == "__main__":
    main()
