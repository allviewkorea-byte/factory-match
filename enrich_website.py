"""
회사 홈페이지 탐색 → factories.website, has_website, enriched_score 업데이트 (3단계)

사용법:  python enrich_website.py
진행상황: website_progress.json (중단 후 재실행 시 이어서 진행)
필요:    pip install requests googlesearch-python

주의:
  - Google 검색 스크래핑은 너무 빠르면 429 차단 발생
  - 기본 딜레이 3초. 차단 시 SEARCH_DELAY = 5~8 로 늘리세요.
  - 하루 500~1,000건 정도가 안정적
"""
import json, time, requests
from pathlib import Path
from urllib.parse import urlparse

try:
    from googlesearch import search as _google_search
    SEARCH_OK = True
except ImportError:
    SEARCH_OK = False

SB_URL      = "https://yezxwlzyiqgewpkkyget.supabase.co"
SB_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
PROGRESS    = Path("website_progress.json")
PAGE_SIZE   = 1000
SEARCH_DELAY = 3.0   # 검색 사이 대기 시간(초) — 차단 시 늘리세요
SAVE_EVERY  = 50     # N건마다 진행상황 저장

SB_HEADERS = {
    "apikey":        SB_KEY,
    "Authorization": f"Bearer {SB_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# 공식 홈페이지가 아닐 가능성이 높은 도메인
EXCLUDE_DOMAINS = {
    "naver.com", "daum.net", "google.com", "google.co.kr",
    "facebook.com", "instagram.com", "youtube.com",
    "blog.naver.com", "cafe.naver.com", "tistory.com",
    "twitter.com", "x.com", "linkedin.com", "wikipedia.org",
    "kicox.or.kr", "gov.kr", "go.kr",
    "jobkorea.co.kr", "saramin.co.kr", "wanted.co.kr",
    "catch.co.kr", "incruit.com", "albamon.com",
    "bizinfo.go.kr", "dart.fss.or.kr", "nicebizinfo.com",
}


# ── 진행상황 ──────────────────────────────────────────────────────────────────
def load_progress():
    if PROGRESS.exists():
        return json.loads(PROGRESS.read_text("utf-8"))
    return {"done_ids": [], "found_ids": [], "no_result_ids": [], "error_ids": []}

def save_progress(p):
    PROGRESS.write_text(json.dumps(p, ensure_ascii=False, indent=2), "utf-8")


# ── Supabase ──────────────────────────────────────────────────────────────────
def fetch_no_website(session):
    """website가 없는 kicox_ 공장 목록"""
    records, offset = [], 0
    while True:
        resp = session.get(f"{SB_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params=[
                ("select",  "id,name,address,phone,employees,founded,summary,industries"),
                ("id",      "like.kicox_%"),
                ("or",      "(website.is.null,website.eq.)"),
                ("limit",   PAGE_SIZE),
                ("offset",  offset),
            ])
        chunk = resp.json()
        if not chunk:
            break
        records.extend(chunk)
        print(f"    {len(records):,}개 로드 중...", end="\r")
        if len(chunk) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    print()
    return records

def calc_score(row):
    s = 0
    if row.get("address"):                                  s += 20
    if row.get("phone"):                                    s += 15
    emp = row.get("employees")
    if emp is not None and emp not in (0, ""):              s += 10
    fnd = row.get("founded")
    if fnd is not None and fnd not in (0, ""):              s += 10
    if row.get("summary"):                                  s += 15
    if row.get("website"):                                  s += 20
    ind = row.get("industries")
    if ind and len(ind) > 0:                                s += 10
    return s

def patch_website(session, factory_id, url, row):
    row_updated = {**row, "website": url}
    payload = {
        "website":        url,
        "has_website":    bool(url),
        "enriched_score": calc_score(row_updated),
    }
    resp = session.patch(
        f"{SB_URL}/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": f"eq.{factory_id}"},
        json=payload,
        timeout=15,
    )
    return resp.status_code in (200, 204)


# ── 검색 & 검증 ───────────────────────────────────────────────────────────────
def is_excluded(url):
    try:
        host = urlparse(url).netloc.lower().lstrip("www.")
        return any(host == d or host.endswith("." + d) for d in EXCLUDE_DOMAINS)
    except Exception:
        return True

def verify_url(url, timeout=8):
    """URL 접속 가능 여부 확인 (HEAD → GET 순서)"""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    try:
        r = requests.head(url, timeout=timeout, allow_redirects=True, headers=headers)
        if r.status_code < 400:
            return True
    except Exception:
        pass
    try:
        r = requests.get(url, timeout=timeout, allow_redirects=True,
                         headers=headers, stream=True)
        return r.status_code < 400
    except Exception:
        return False

def google_search(query, num_results=5):
    """googlesearch-python 버전 차이를 흡수하는 래퍼"""
    try:
        return list(_google_search(query, num_results=num_results, lang="ko"))
    except TypeError:
        # 구버전 API (num, stop, pause)
        return list(_google_search(query, num=num_results, stop=num_results, pause=1, lang="ko"))

def find_website(name):
    """회사명으로 공식 홈페이지 URL 탐색. 없으면 None 반환."""
    query = f"{name} 공식 홈페이지"
    try:
        urls = google_search(query, num_results=5)
    except Exception as e:
        raise RuntimeError(f"검색 실패: {e}")

    for url in urls:
        if not is_excluded(url) and verify_url(url):
            return url
    return None


# ── 메인 ──────────────────────────────────────────────────────────────────────
def main():
    if not SEARCH_OK:
        print("❌ googlesearch-python이 필요합니다.")
        print("   pip install googlesearch-python")
        return

    p       = load_progress()
    session = requests.Session()

    print("[1] 홈페이지 없는 공장 조회...")
    factories = fetch_no_website(session)
    done_set  = set(p["done_ids"]) | set(p["found_ids"]) | set(p["no_result_ids"]) | set(p["error_ids"])
    todo      = [f for f in factories if f["id"] not in done_set]
    print(f"    전체: {len(factories):,}개 | 미처리: {len(todo):,}개")

    if not todo:
        print("✅ 처리할 항목이 없습니다.")
        return

    found = 0
    consecutive_errors = 0
    print(f"\n[2] 홈페이지 탐색 시작 (딜레이 {SEARCH_DELAY}s/건)...")

    for i, factory in enumerate(todo, 1):
        name = (factory.get("name") or "").strip()
        if not name:
            p["no_result_ids"].append(factory["id"])
            p["done_ids"].append(factory["id"])
            continue

        url = None
        try:
            url = find_website(name)
            consecutive_errors = 0
        except RuntimeError as e:
            consecutive_errors += 1
            print(f"  [{i:,}] ⚠️  {name[:20]} | {e}")
            p["error_ids"].append(factory["id"])
            p["done_ids"].append(factory["id"])

            if consecutive_errors >= 5:
                print("\n❌ 연속 오류 5회 — Google 차단 가능성. SEARCH_DELAY를 늘리고 재실행하세요.")
                save_progress(p)
                return

            time.sleep(SEARCH_DELAY * 3)
            continue

        if url:
            ok = patch_website(session, factory["id"], url, factory)
            if ok:
                found += 1
                p["found_ids"].append(factory["id"])
                print(f"  [{i:,}] ✓ {name[:18]:18s} → {url[:55]}")
            else:
                p["error_ids"].append(factory["id"])
        else:
            p["no_result_ids"].append(factory["id"])

        p["done_ids"].append(factory["id"])

        if i % SAVE_EVERY == 0:
            save_progress(p)
            print(f"\n  --- 진행: {i:,}/{len(todo):,} | 발견: {found:,}개 ---\n")

        time.sleep(SEARCH_DELAY)

    save_progress(p)
    print(f"\n✅ 완료: {len(todo):,}건 처리")
    print(f"   홈페이지 발견: {found:,}개")
    print(f"   결과 없음:    {len(p['no_result_ids']):,}개")
    print(f"   오류:         {len(p['error_ids']):,}개")


if __name__ == "__main__":
    main()
