"""
enrich_email_only.py
이미 ai_summary가 있는 공장(검증 완료)에서 이메일만 수집

동작:
  1. website IS NOT NULL AND ai_summary IS NOT NULL AND email IS NULL 조회
  2. 메인 페이지 mailto: 링크 우선 추출
  3. 없으면 /contact, /about 등 서브페이지 크롤링
  4. email 컬럼에 저장
  5. Claude API 호출 없음 → 비용 0원

사용법:
  py enrich_email_only.py
"""

import sys
print("Python " + sys.version)
print("시작...")

import os
import re
import json
import time
import random
from urllib.parse import urljoin

import requests

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

# ── 설정 ──────────────────────────────────────────────────
PROGRESS_FILE  = "email_only_progress.json"
FETCH_PAGESIZE = 1000
DAILY_LIMIT    = 5000   # Claude API 없으니 많이 처리 가능
DELAY_MIN      = 0.5
DELAY_MAX      = 1.5
WEBSITE_TIMEOUT = (8, 15)

WEBSITE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
}

# 시스템 도메인 제외
SYSTEM_DOMAINS = [
    "w3.org", "schema.org", "sentry.io", "example.com",
    "test.com", "localhost", "temp.com",
]

# 크롤링할 서브페이지 경로
SUBPAGES = [
    "/contact", "/contact-us", "/contactus",
    "/about", "/about-us", "/company",
    "/inquiry", "/support",
    "/문의", "/연락처", "/회사소개", "/contact.html",
    "/introduce", "/info", "/greeting",
    "/sub/contact", "/sub/about", "/page/contact",
    "/회사안내", "/오시는길", "/고객문의",
]


# ─────────────────────────────────────────────────────────
# 이메일 추출
# ─────────────────────────────────────────────────────────

def _extract_mailto(html):
    # type: (str) -> str
    """HTML에서 mailto: 링크 추출"""
    pattern = r'href=["\']mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})["\']'
    matches = re.findall(pattern, html, re.IGNORECASE)

    seen = set()
    valid = []
    for em in matches:
        em_lower = em.lower()
        if em_lower in seen:
            continue
        seen.add(em_lower)
        domain = em_lower.split("@")[-1]
        if any(ex in domain for ex in SYSTEM_DOMAINS):
            continue
        if len(em) > 80:
            continue
        valid.append(em)

    return valid[0] if valid else ""


def _fetch_page(url):
    # type: (str) -> str
    """페이지 HTML 가져오기"""
    try:
        r = requests.get(
            url,
            headers=WEBSITE_HEADERS,
            timeout=WEBSITE_TIMEOUT,
            allow_redirects=True,
        )
        if r.status_code == 200:
            return r.text
    except Exception:
        pass
    return ""


def extract_email(website):
    # type: (str) -> str
    """
    웹사이트에서 이메일 추출
    1. 메인 페이지 mailto: 링크
    2. 서브페이지 mailto: 링크
    """
    if not website.startswith(("http://", "https://")):
        website = "https://" + website

    # 1단계: 메인 페이지
    main_html = _fetch_page(website)
    if main_html:
        email = _extract_mailto(main_html)
        if email:
            return email

    # 2단계: 서브페이지
    for path in SUBPAGES:
        sub_url = urljoin(website, path)
        sub_html = _fetch_page(sub_url)
        if not sub_html:
            continue
        email = _extract_mailto(sub_html)
        if email:
            print("    [서브페이지] {0} → {1}".format(path, email))
            return email

    return ""


# ─────────────────────────────────────────────────────────
# Supabase 헬퍼
# ─────────────────────────────────────────────────────────

def sb_fetch_batch(last_id):
    # type: (object) -> list
    params = {
        "select":     "id,name,website",
        "website":    "not.is.null",
        "ai_summary": "not.is.null",
        "email":      "is.null",
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


def sb_save_email(factory_id, email):
    # type: (str, str) -> None
    requests.patch(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": "eq." + str(factory_id)},
        json={"email": email},
        timeout=15,
    ).raise_for_status()


# ─────────────────────────────────────────────────────────
# 진행상황
# ─────────────────────────────────────────────────────────

def load_progress():
    try:
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"processed": 0, "found": 0, "not_found": 0, "last_id": None}


def save_progress(prog):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────

def main():
    prog        = load_progress()
    total       = prog.get("processed", 0)
    found       = prog.get("found", 0)
    not_found   = prog.get("not_found", 0)
    last_id     = prog.get("last_id", None)
    today_count = 0

    print("")
    print("=" * 58)
    print("  이메일 수집 (enrich_email_only.py)")
    print("  Claude API 호출 없음 - 비용 0원")
    print("=" * 58)
    print("  이전 누적: {0:,}건 처리 | 이메일 찾음: {1:,}건".format(total, found))
    print("  오늘 한도: {0:,}건".format(DAILY_LIMIT))
    if last_id:
        print("  커서 재개: id > {0}".format(last_id))
    print("")

    while today_count < DAILY_LIMIT:
        try:
            batch = sb_fetch_batch(last_id)
        except Exception as e:
            print("[오류] Supabase 조회 실패: {0}".format(e))
            break

        if not batch:
            print("처리할 공장이 더 없습니다. 완료!")
            break

        for factory in batch:
            if today_count >= DAILY_LIMIT:
                print("\n오늘 한도 {0:,}건 도달.".format(DAILY_LIMIT))
                break

            fid     = factory.get("id", "")
            name    = (factory.get("name") or "").strip()
            website = (factory.get("website") or "").strip()
            last_id = fid

            print("  [{0:>6}] {1:<30} | {2}".format(
                total + 1, name[:30], website[:40]))

            if not website:
                total += 1
                continue

            # 이메일 추출
            email = extract_email(website)

            if email:
                try:
                    sb_save_email(fid, email)
                    found += 1
                    print("    ✓ 이메일 저장: {0}".format(email))
                except Exception as e:
                    print("    ✗ 저장 실패: {0}".format(e))
            else:
                not_found += 1
                print("    - 이메일 없음")

            total += 1
            today_count += 1

            # 100건마다 저장
            if total % 100 == 0:
                prog.update({"processed": total, "found": found,
                             "not_found": not_found, "last_id": last_id})
                save_progress(prog)
                rate = (found / total * 100) if total else 0
                print("\n  -- 중간저장 [{0:,}건] 이메일 발견율: {1:.1f}% --\n".format(total, rate))

            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

    # 최종 저장
    prog.update({"processed": total, "found": found,
                 "not_found": not_found, "last_id": last_id})
    save_progress(prog)

    rate = (found / total * 100) if total else 0
    print("\n" + "=" * 58)
    print("  완료 요약")
    print("=" * 58)
    print("  처리 건수    : {0:,}건".format(total))
    print("  이메일 발견  : {0:,}건 ({1:.1f}%)".format(found, rate))
    print("  이메일 없음  : {0:,}건".format(not_found))
    print("  오늘 처리    : {0:,}건".format(today_count))
    print("=" * 58)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        traceback.print_exc()
        input("\nEnter 키를 누르면 종료합니다...")
