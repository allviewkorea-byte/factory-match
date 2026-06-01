# enrich_geocode.py
# 주소 → 위도/경도 변환 (카카오 Local API)
# - 일 30만건 무료 (Google 대비 비용 $0)
# - DB 기반 캐싱: lat 있는 공장은 API 호출 없음 (최초 1회만 과금)

import requests
import time
import os

KAKAO_REST_API_KEY = os.environ.get("KAKAO_REST_API_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yezxwlzyiqgewpkkyget.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs")

DAILY_LIMIT = int(os.environ.get("DAILY_LIMIT", "3000"))  # 카카오 무료라 여유있게
BATCH_SIZE = 200
DELAY = 0.05  # 카카오 API 여유있음
MAX_PATCH_RETRY = 3

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

def get_factories_without_coords(limit):
    """lat/lng 없는 공장만 조회 (DB 기반 캐싱)"""
    res = requests.get(
        f"{SUPABASE_URL}/rest/v1/factories",
        headers=HEADERS,
        params={
            "select": "id,name,address,city,region",
            "lat": "is.null",
            "address": "not.is.null",
            "limit": limit,
        },
        timeout=30
    )
    if res.status_code != 200:
        print(f"❌ DB 조회 실패: {res.status_code} {res.text[:200]}")
        return []
    data = res.json()
    if isinstance(data, dict):
        print(f"❌ DB 조회 오류: {data}")
        return []
    return data

def kakao_geocode(address):
    """카카오 Local API로 주소 → 위도/경도 변환 (무료)"""
    if not KAKAO_REST_API_KEY:
        print("❌ KAKAO_REST_API_KEY 환경변수가 없습니다.")
        return None, None
    try:
        res = requests.get(
            "https://dapi.kakao.com/v2/local/search/address.json",
            headers={"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"},
            params={"query": address, "analyze_type": "similar"},
            timeout=10
        )
        if res.status_code == 200:
            docs = res.json().get("documents", [])
            if docs:
                lat = float(docs[0]["y"])
                lng = float(docs[0]["x"])
                # 한국 좌표 범위 검증
                if 33.0 <= lat <= 39.0 and 124.0 <= lng <= 132.0:
                    return lat, lng
        elif res.status_code == 401:
            print("❌ 카카오 API 키가 잘못되었습니다. KAKAO_REST_API_KEY 확인하세요.")
    except Exception as e:
        print(f"  ⚠️  카카오 API 오류: {e}")
    return None, None

def supabase_patch_with_retry(factory_id, lat, lng):
    """PATCH 요청 + 재시도 (실패 시 lat null 유지 → 다음 실행 때 재시도)"""
    for attempt in range(1, MAX_PATCH_RETRY + 1):
        try:
            res = requests.patch(
                f"{SUPABASE_URL}/rest/v1/factories?id=eq.{factory_id}",
                headers=HEADERS,
                json={"lat": lat, "lng": lng},
                timeout=30
            )
            if res.status_code in (200, 204):
                return True
            print(f"  ⚠️  PATCH 실패 (시도 {attempt}/{MAX_PATCH_RETRY}): HTTP {res.status_code}")
            if attempt < MAX_PATCH_RETRY:
                time.sleep(1 * attempt)
        except Exception as e:
            print(f"  ⚠️  PATCH 예외 (시도 {attempt}/{MAX_PATCH_RETRY}): {e}")
            if attempt < MAX_PATCH_RETRY:
                time.sleep(1 * attempt)
    return False

def main():
    print("=" * 55)
    print("주소 → 좌표 변환 (카카오 Local API - 무료)")
    print(f"일일 한도: {DAILY_LIMIT}건")
    print("=" * 55)

    if not KAKAO_REST_API_KEY:
        print("❌ KAKAO_REST_API_KEY 환경변수를 설정하세요.")
        print("   GitHub Secrets에 KAKAO_REST_API_KEY 추가 필요")
        return

    processed = 0
    success = 0
    geo_fail = 0
    patch_fail = 0

    while processed < DAILY_LIMIT:
        fetch_count = min(BATCH_SIZE, DAILY_LIMIT - processed)
        factories = get_factories_without_coords(fetch_count)

        if not factories:
            print("✅ 처리할 공장 없음 (모든 공장에 좌표 존재)")
            break

        for f in factories:
            if processed >= DAILY_LIMIT:
                print(f"\n⚠️  일일 한도 {DAILY_LIMIT}건 도달.")
                break

            fid = f["id"]
            address = (f.get("address") or
                       f"{f.get('city', '')} {f.get('region', '')}".strip())

            if not address:
                continue

            lat, lng = kakao_geocode(address)
            time.sleep(DELAY)
            processed += 1

            if lat and lng:
                ok = supabase_patch_with_retry(fid, lat, lng)
                if ok:
                    success += 1
                    if success % 100 == 0:
                        print(f"✅ {success}건 완료 중... ({processed}/{DAILY_LIMIT})")
                else:
                    patch_fail += 1
            else:
                geo_fail += 1

        if len(factories) < BATCH_SIZE:
            break

    print("\n" + "=" * 55)
    print(f"처리: {processed}건 | 성공: {success}건 | "
          f"주소오류: {geo_fail}건 | DB저장실패: {patch_fail}건")
    remaining = get_factories_without_coords(1)
    if not remaining:
        print("🎉 전체 좌표 변환 완료!")
    print("=" * 55)

if __name__ == "__main__":
    main()
