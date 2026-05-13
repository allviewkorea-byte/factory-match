# enrich_crosscheck.py
# 네이버 website vs 구글 website 크로스체크
# 도메인 일치 시 website_verified = true

import os
import re
import requests
import time

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yezxwlzyiqgewpkkyget.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs")
BATCH_SIZE = 200
DAILY_LIMIT = 10000

def get_domain(url):
    """URL에서 도메인 추출"""
    if not url:
        return None
    url = url.lower().strip()
    url = re.sub(r'^https?://', '', url)
    url = re.sub(r'^www\.', '', url)
    domain = url.split('/')[0].split('?')[0]
    return domain

def fetch_factories(offset):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    res = requests.get(
        f"{SUPABASE_URL}/rest/v1/factories",
        headers=headers,
        params={
            "select": "id,name,website,google_website,naver_website,website_verified",
            "website": "not.is.null",
            "google_website": "not.is.null",
            "website_verified": "is.null",
            "offset": offset,
            "limit": BATCH_SIZE,
        },
        timeout=30
    )
    return res.json()

def supabase_patch(factory_id, data):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    res = requests.patch(
        f"{SUPABASE_URL}/rest/v1/factories?id=eq.{factory_id}",
        headers=headers,
        json=data,
        timeout=30
    )
    return res.status_code

def main():
    print("=" * 60)
    print("네이버 vs 구글 website 크로스체크 시작")
    print("=" * 60)

    processed = 0
    verified = 0
    mismatch = 0
    offset = 0

    while processed < DAILY_LIMIT:
        factories = fetch_factories(offset)

        if not factories or isinstance(factories, dict):
            print("처리할 공장이 없습니다.")
            break

        for f in factories:
            if processed >= DAILY_LIMIT:
                break

            fid = f["id"]
            name = f.get("name", "")
            website = f.get("website", "")
            google_website = f.get("google_website", "")

            # 도메인 추출
            domain_website = get_domain(website)
            domain_google = get_domain(google_website)

            if domain_website and domain_google:
                is_match = domain_website == domain_google

                if is_match:
                    supabase_patch(fid, {"website_verified": True})
                    verified += 1
                    print(f"✅ 일치: {name} | {domain_website}")
                else:
                    supabase_patch(fid, {"website_verified": False, "naver_website": website})
                    mismatch += 1
                    print(f"⚠️  불일치: {name} | 네이버:{domain_website} vs 구글:{domain_google}")

                processed += 1

        offset += BATCH_SIZE

    print("=" * 60)
    print(f"처리: {processed}개 | 일치: {verified}개 | 불일치: {mismatch}개")
    print(f"일치율: {round(verified/processed*100) if processed else 0}%")
    print("=" * 60)

if __name__ == "__main__":
    main()
