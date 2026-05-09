"""
enrich_website_naver.py
네이버 검색 API로 공장 공식 홈페이지 URL 및 전화번호 수집 → Supabase UPDATE

사용법:
  pip install requests
  python enrich_website_naver.py

동작:
  [홈페이지 수집]
  1. Supabase에서 website IS NULL인 공장 목록 조회 (ID 커서 방식, 1,000개씩)
  2. 공장명으로 네이버 API 호출 (지역 검색 → 웹 검색 순)
  3. 결과에서 공식 홈페이지 URL 추출 후 factories.website UPDATE
  4. 진행 상황 website_progress.json에 100건마다 저장

  [전화번호 수집]
  1. Supabase에서 phone IS NULL인 공장 목록 조회 (ID 커서 방식, 1,000개씩)
  2. 공장명으로 네이버 지역 검색 API 호출
  3. 결과의 telephone 필드 추출 후 factories.phone UPDATE (NULL인 경우만)
  4. 진행 상황 phone_progress.json에 100건마다 저장

네이버 API 한도: 25,000건/일 → 24,000건만 사용
실패(네트워크 오류) 시 1회 재시도, 결과 없으면 NULL 유지
"""

import sys
print("Python " + sys.version)
print("시작...")

import json
import re
import time
import random
from typing import Optional
from urllib.parse import urlparse

import requests

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
PROGRESS_FILE       = "website_progress.json"
PHONE_PROGRESS_FILE = "phone_progress.json"
FETCH_PAGESIZE = 1000   # Supabase 조회 단위
DELAY_MIN      = 1.0    # 요청 간 최소 대기 (초)
DELAY_MAX      = 2.0    # 요청 간 최대 대기 (초)

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
    "coupang.com",
    # 공장 디렉토리 / 전화번호부 / 관공서 포털 (공식 홈페이지 아님)
    "myfactory.co.kr", "114.co.kr", "ok114.co.kr", "ksm114.co.kr",
    "goodtel070.co.kr", "weseb.com", "38.co.kr",
    "bizok.incheon.go.kr", "kpi.or.kr", "findcompany.kr",
    "atfis.or.kr", "swadpia.co.kr", "kicrex.kr",
    # 추가: 무관 사이트 / 관공서 / 공공기관
    "moneypin.biz", "tradesupport.gwd.go.kr", "grandculture.net",
    "kwwa.or.kr", "life114.co.kr", "cwip.or.kr", "namyangi.com",
    "kosre.or.kr", "waterkorea.kr", "k-seafoodtrade.kr",
    "okgoodfood.com", "wonju.go.kr", "mma.go.kr", "sen.es.kr",
    "g2b.go.kr", "dh.go.kr",
    "happycampus.com", "sankun.com", "jobplanet.co.kr",
}


# ─────────────────────────────────────────────────────────
# Supabase 헬퍼
# ─────────────────────────────────────────────────────────

def sb_fetch_nullwebsite(last_id):
    # type: (Optional[str]) -> list
    """
    website IS NULL이고 id > last_id 인 공장 조회 (ID 커서 페이지네이션).
    last_id=None 이면 전체 처음부터 조회.
    UPDATE된 행은 자동으로 결과셋에서 빠지므로 커서가 안전하게 전진함.
    """
    params = {
        "select":  "id,name,city",
        "website": "is.null",
        "order":   "id.asc",
        "limit":   str(FETCH_PAGESIZE),
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


def sb_update_website(factory_id, website_url):
    # type: (str, str) -> None
    """factories.website 컬럼 UPDATE"""
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": "eq." + str(factory_id)},
        json={"website": website_url},
        timeout=30,
    )
    r.raise_for_status()


def sb_fetch_nullphone(last_id):
    # type: (Optional[str]) -> list
    """phone IS NULL이고 id > last_id 인 공장 조회 (ID 커서 페이지네이션)."""
    params = {
        "select": "id,name,city",
        "phone":  "is.null",
        "order":  "id.asc",
        "limit":  str(FETCH_PAGESIZE),
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


def sb_update_phone(factory_id, phone):
    # type: (str, str) -> None
    """factories.phone 컬럼 UPDATE — phone IS NULL인 행만 갱신."""
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": "eq." + str(factory_id), "phone": "is.null"},
        json={"phone": phone},
        timeout=30,
    )
    r.raise_for_status()


# ─────────────────────────────────────────────────────────
# URL 유효성 검사
# ─────────────────────────────────────────────────────────

def is_official_url(url):
    # type: (str) -> bool
    """공식 홈페이지로 적합한 URL인지 판단"""
    if not url or not url.startswith("http"):
        return False
    try:
        parsed = urlparse(url)
        host = parsed.netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        for skip in _SKIP_DOMAINS:
            if host == skip or host.endswith("." + skip):
                return False
        if not host or re.match(r"^\d+\.\d+\.\d+\.\d+", host):
            return False
    except Exception:
        return False
    return True


def clean_url(url):
    # type: (str) -> str
    """쿼리스트링·앵커 제거, 후행 슬래시 정리"""
    try:
        p = urlparse(url)
        result = p.scheme + "://" + p.netloc + p.path
        return result.rstrip("/") or url
    except Exception:
        return url


# ─────────────────────────────────────────────────────────
# 네이버 검색 API
# ─────────────────────────────────────────────────────────

def _naver_get(endpoint, query, display=5):
    # type: (str, str, int) -> list
    """
    네이버 API 단일 호출. 성공 시 items 리스트 반환.
    HTTP 오류·타임아웃 시 빈 리스트 반환.
    429(한도 초과) 시 RuntimeError 발생.
    """
    try:
        r = requests.get(
            "https://openapi.naver.com/v1/search/" + endpoint,
            headers=NAVER_HEADERS,
            params={"query": query, "display": display},
            timeout=10,
        )
        if r.status_code == 429:
            raise RuntimeError("NAVER_QUOTA_EXCEEDED")
        if r.status_code != 200:
            return []
        return r.json().get("items", [])
    except RuntimeError:
        raise
    except Exception:
        return []


def _naver_get_with_retry(endpoint, query, display=5):
    # type: (str, str, int) -> list
    """_naver_get 래퍼 — 네트워크 오류 시 1회 재시도 (1초 대기)"""
    try:
        return _naver_get(endpoint, query, display)
    except RuntimeError:
        raise
    except Exception:
        time.sleep(1)
        try:
            return _naver_get(endpoint, query, display)
        except RuntimeError:
            raise
        except Exception:
            return []


def search_local(name):
    # type: (str) -> Optional[str]
    """네이버 지역 검색 — link 필드에서 공식 홈페이지 반환"""
    items = _naver_get_with_retry("local.json", name, display=5)
    for item in items:
        link = item.get("link", "")
        if is_official_url(link):
            return clean_url(link)
    return None


def search_local_phone(name):
    # type: (str) -> Optional[str]
    """네이버 지역 검색 — telephone 필드에서 전화번호 반환"""
    items = _naver_get_with_retry("local.json", name, display=5)
    for item in items:
        tel = item.get("telephone", "").strip()
        if tel:
            return tel
    return None


def search_web(name):
    # type: (str) -> Optional[str]
    """네이버 웹 검색 — '{name} 홈페이지' 쿼리로 공식 사이트 탐색"""
    items = _naver_get_with_retry("webkr.json", name + " 홈페이지", display=5)
    for item in items:
        link = re.sub(r"<[^>]+>", "", item.get("link", "")).strip()
        if is_official_url(link):
            return clean_url(link)
    return None


def find_website(name, api_counter):
    # type: (str, list) -> Optional[str]
    """
    지역 검색(1 call) → 웹 검색 fallback(1 call) 순으로 탐색.
    api_counter[0] 에 사용한 API 호출 수를 누적.
    """
    # 1차: 지역 검색
    result = search_local(name)
    api_counter[0] += 1
    if result:
        return result

    # 2차: 웹 검색 fallback
    result = search_web(name)
    api_counter[0] += 1
    return result  # None 이면 website = NULL 유지


def find_phone(name, api_counter):
    # type: (str, list) -> Optional[str]
    """지역 검색(1 call)으로 전화번호 탐색. api_counter[0]에 호출 수 누적."""
    result = search_local_phone(name)
    api_counter[0] += 1
    return result  # None 이면 phone = NULL 유지


# ─────────────────────────────────────────────────────────
# 진행 상황 저장 / 불러오기
# ─────────────────────────────────────────────────────────

def load_progress():
    # type: () -> dict
    try:
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (IOError, ValueError):
        return {
            "processed": 0,
            "updated":   0,
            "not_found": 0,
            "api_calls": 0,
            "last_id":   None,
        }


def save_progress(prog):
    # type: (dict) -> None
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)


def load_phone_progress():
    # type: () -> dict
    try:
        with open(PHONE_PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (IOError, ValueError):
        return {
            "processed": 0,
            "updated":   0,
            "not_found": 0,
            "api_calls": 0,
            "last_id":   None,
        }


def save_phone_progress(prog):
    # type: (dict) -> None
    with open(PHONE_PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────

def main():
    prog = load_progress()
    total_processed = prog.get("processed", 0)
    total_updated   = prog.get("updated",   0)
    total_not_found = prog.get("not_found", 0)
    total_api_calls = prog.get("api_calls", 0)
    last_id         = prog.get("last_id",   None)

    print("=" * 55)
    print("  네이버 API 홈페이지 수집 (enrich_website_naver.py)")
    print("=" * 55)
    print("  이전 누적 처리: {0:,}건 | 업데이트: {1:,}건".format(
        total_processed, total_updated))
    print("  이전 누적 API 호출: {0:,}건".format(total_api_calls))
    print("  금일 API 한도: {0:,}건".format(DAILY_API_LIMIT))
    if last_id is not None:
        print("  커서 재개 위치: id > {0}".format(last_id))
    print("")

    today_api_calls = 0
    quota_exceeded  = False

    while today_api_calls < DAILY_API_LIMIT and not quota_exceeded:
        try:
            batch = sb_fetch_nullwebsite(last_id)
        except Exception as e:
            print("[오류] Supabase 조회 실패: {0}".format(e))
            break

        if not batch:
            print("처리할 공장이 더 없습니다. 모두 완료!")
            break

        for factory in batch:
            if today_api_calls >= DAILY_API_LIMIT:
                print("\n금일 API 한도 {0:,}건 도달. 내일 재실행하세요.".format(
                    DAILY_API_LIMIT))
                quota_exceeded = True
                break

            fid     = factory.get("id", "")
            name    = (factory.get("name") or "").strip()
            city    = (factory.get("city") or "").strip()
            last_id = fid

            if not name:
                total_not_found += 1
                total_processed += 1
                continue

            api_counter = [0]

            try:
                website = find_website(name, api_counter)
            except RuntimeError as exc:
                if "QUOTA_EXCEEDED" in str(exc):
                    print("\n[경고] 네이버 API 일일 한도 초과. 중단합니다.")
                    quota_exceeded = True
                    break
                website = None

            today_api_calls += api_counter[0]
            total_api_calls += api_counter[0]

            if website:
                try:
                    sb_update_website(fid, website)
                    total_updated += 1
                    status = "O  " + website
                except Exception as e:
                    status = "X  DB 오류: " + str(e)
                    website = None
            else:
                total_not_found += 1
                status = "-  결과 없음"

            total_processed += 1

            loc = " ({0})".format(city) if city else ""
            print("  [{0:>6}] {1}{2}  ->  {3}".format(
                total_processed, name, loc, status))

            if total_processed % 100 == 0:
                prog.update({
                    "processed": total_processed,
                    "updated":   total_updated,
                    "not_found": total_not_found,
                    "api_calls": total_api_calls,
                    "last_id":   last_id,
                })
                save_progress(prog)
                print(
                    "\n  -- 중간 저장 [{0:,}건] 업데이트: {1:,} | "
                    "금일 API: {2:,}/{3:,} --\n".format(
                        total_processed, total_updated,
                        today_api_calls, DAILY_API_LIMIT)
                )

            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

    prog.update({
        "processed": total_processed,
        "updated":   total_updated,
        "not_found": total_not_found,
        "api_calls": total_api_calls,
        "last_id":   last_id,
    })
    save_progress(prog)

    success_rate = (total_updated / total_processed * 100) if total_processed else 0.0
    print("\n" + "=" * 55)
    print("  완료 요약")
    print("=" * 55)
    print("  금일 처리 건수    : {0:,}건".format(total_processed))
    print("  금일 API 호출     : {0:,}건".format(today_api_calls))
    print("  홈페이지 업데이트 : {0:,}건 ({1:.1f}%)".format(
        total_updated, success_rate))
    print("  결과 없음         : {0:,}건".format(total_not_found))
    print("  진행 저장 위치    : {0}".format(PROGRESS_FILE))
    print("=" * 55)


def main_phone():
    prog = load_phone_progress()
    total_processed = prog.get("processed", 0)
    total_updated   = prog.get("updated",   0)
    total_not_found = prog.get("not_found", 0)
    total_api_calls = prog.get("api_calls", 0)
    last_id         = prog.get("last_id",   None)

    print("=" * 55)
    print("  네이버 API 전화번호 수집 (enrich_website_naver.py)")
    print("=" * 55)
    print("  이전 누적 처리: {0:,}건 | 업데이트: {1:,}건".format(
        total_processed, total_updated))
    print("  이전 누적 API 호출: {0:,}건".format(total_api_calls))
    print("  금일 API 한도: {0:,}건".format(DAILY_API_LIMIT))
    if last_id is not None:
        print("  커서 재개 위치: id > {0}".format(last_id))
    print("")

    today_api_calls = 0
    quota_exceeded  = False

    while today_api_calls < DAILY_API_LIMIT and not quota_exceeded:
        try:
            batch = sb_fetch_nullphone(last_id)
        except Exception as e:
            print("[오류] Supabase 조회 실패: {0}".format(e))
            break

        if not batch:
            print("처리할 공장이 더 없습니다. 모두 완료!")
            break

        for factory in batch:
            if today_api_calls >= DAILY_API_LIMIT:
                print("\n금일 API 한도 {0:,}건 도달. 내일 재실행하세요.".format(
                    DAILY_API_LIMIT))
                quota_exceeded = True
                break

            fid     = factory.get("id", "")
            name    = (factory.get("name") or "").strip()
            city    = (factory.get("city") or "").strip()
            last_id = fid

            if not name:
                total_not_found += 1
                total_processed += 1
                continue

            api_counter = [0]

            try:
                phone = find_phone(name, api_counter)
            except RuntimeError as exc:
                if "QUOTA_EXCEEDED" in str(exc):
                    print("\n[경고] 네이버 API 일일 한도 초과. 중단합니다.")
                    quota_exceeded = True
                    break
                phone = None

            today_api_calls += api_counter[0]
            total_api_calls += api_counter[0]

            if phone:
                try:
                    sb_update_phone(fid, phone)
                    total_updated += 1
                    status = "O  " + phone
                except Exception as e:
                    status = "X  DB 오류: " + str(e)
                    phone = None
            else:
                total_not_found += 1
                status = "-  결과 없음"

            total_processed += 1

            loc = " ({0})".format(city) if city else ""
            print("  [{0:>6}] {1}{2}  ->  {3}".format(
                total_processed, name, loc, status))

            if total_processed % 100 == 0:
                prog.update({
                    "processed": total_processed,
                    "updated":   total_updated,
                    "not_found": total_not_found,
                    "api_calls": total_api_calls,
                    "last_id":   last_id,
                })
                save_phone_progress(prog)
                print(
                    "\n  -- 중간 저장 [{0:,}건] 업데이트: {1:,} | "
                    "금일 API: {2:,}/{3:,} --\n".format(
                        total_processed, total_updated,
                        today_api_calls, DAILY_API_LIMIT)
                )

            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

    prog.update({
        "processed": total_processed,
        "updated":   total_updated,
        "not_found": total_not_found,
        "api_calls": total_api_calls,
        "last_id":   last_id,
    })
    save_phone_progress(prog)

    success_rate = (total_updated / total_processed * 100) if total_processed else 0.0
    print("\n" + "=" * 55)
    print("  전화번호 수집 완료 요약")
    print("=" * 55)
    print("  금일 처리 건수    : {0:,}건".format(total_processed))
    print("  금일 API 호출     : {0:,}건".format(today_api_calls))
    print("  전화번호 업데이트 : {0:,}건 ({1:.1f}%)".format(
        total_updated, success_rate))
    print("  결과 없음         : {0:,}건".format(total_not_found))
    print("  진행 저장 위치    : {0}".format(PHONE_PROGRESS_FILE))
    print("=" * 55)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="네이버 API 수집 스크립트")
    parser.add_argument(
        "--mode",
        choices=["website", "phone", "all"],
        default="all",
        help="수집 모드: website(홈페이지), phone(전화번호), all(둘 다, 기본값)",
    )
    args = parser.parse_args()

    try:
        if args.mode in ("website", "all"):
            main()
        if args.mode in ("phone", "all"):
            main_phone()
    except Exception as e:
        import traceback
        print("\n[오류 발생]")
        traceback.print_exc()
        input("\nEnter 키를 누르면 종료합니다...")
