# enrich_geocode.py
# 주소 → 위도/경도 변환 (Google Geocoding API)
# 대상: lat/lng 없는 공장 (DB 기반 캐싱 - 최초 1회만 과금)

import requests
import json
import time
import os

GOOGLE_API_KEY = os.environ.get("GOOGLE_GEOCODING_KEY", "AIzaSyC1WBx03zr2C0tDIdlsN8noB1Ue5dXpe1Y")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yezxwlzyiqgewpkkyget.supabase.co")
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"

# ⚠️ 비용 제어: 일일 최대 500건 (Google Geocoding $2/1000건 기준 $1/일)
DAILY_LIMIT = int(os.environ.get("DAILY_LIMIT", "500"))
DELAY = 0.1   # API 부하 방지 (0.05 → 0.1으로 증가)
BATCH_SIZE = 200
MAX_PATCH_RETRY = 3  # PATCH 실패 시 재시도 횟수

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

def get_factories_without_coords(limit):
    """lat/lng가 없는 공장만 조회 (DB 기반 캐싱 핵심 쿼리)"""
    res = requests.get(
        f"{SUPABASE_URL}/rest/v1/factories",
        headers=HEADERS,
        params={
            "select": "id,name,address,city,region",
            "lat": "is.null",          # lat 없는 것만
            "address": "not.is.null",  # 주소 있는 것만
            "limit": limit,
        },
        timeout=30
    )
    if res.status_code != 200:
        print(f"❌ DB 조회 실패: {res.status_code} {res.text[:200]}")
        return []
    data = res.json()
    if isinstance(data, dict):  # 에러 응답
        print(f"❌ DB 조회 오류: {data}")
        return []
    return data

def geocode(address):
    """주소 → 위도/경도 변환"""
    res = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        params={"address": address, "key": GOOGLE_API_KEY, "language": "ko"},
        timeout=10
    )
    data = res.json()
    if data.get("status") == "OK" and data.get("results"):
        loc = data["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]
    return None, None

def supabase_patch_with_retry(factory_id, lat, lng):
    """
    PATCH 요청 + 재시도 로직
    반환: True(성공) / False(최종 실패)
    
    [버그 수정] 기존 코드는 PATCH 결과를 무시해서
    실패해도 성공으로 처리 → lat이 DB에 저장 안 됨
    → 다음 실행 때 동일 공장 재조회 → 반복 과금
    """
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
            else:
                print(f"  ⚠️  PATCH 실패 (시도 {attempt}/{MAX_PATCH_RETRY}): "
                      f"HTTP {res.status_code} | {res.text[:100]}")
                if attempt < MAX_PATCH_RETRY:
                    time.sleep(1 * attempt)  # 재시도 전 대기
        except Exception as e:
            print(f"  ⚠️  PATCH 예외 (시도 {attempt}/{MAX_PATCH_RETRY}): {e}")
            if attempt < MAX_PATCH_RETRY:
                time.sleep(1 * attempt)
    return False

def main():
    print("=" * 55)
    print("주소 → 좌표 변환 시작 (enrich_geocode.py v2)")
    print(f"일일 한도: {DAILY_LIMIT}건 | PATCH 재시도: {MAX_PATCH_RETRY}회")
    print("=" * 55)

    # 처리 전 미완료 건수 확인
    remaining = get_factories_without_coords(1)
    if not remaining:
        print("✅ 처리할 공장 없음 (모든 공장에 좌표 존재)")
        return

    processed = 0
    success = 0
    patch_fail = 0
    geo_fail = 0
    skipped = 0

    while processed < DAILY_LIMIT:
        # 남은 한도만큼 가져오기
        fetch_count = min(BATCH_SIZE, DAILY_LIMIT - processed)
        factories = get_factories_without_coords(fetch_count)

        if not factories:
            print("✅ 처리할 공장이 없습니다.")
            break

        for f in factories:
            if processed >= DAILY_LIMIT:
                print(f"\n⚠️  일일 한도 {DAILY_LIMIT}건 도달. 내일 재실행하세요.")
                break

            fid = f["id"]
            address = (f.get("address") or
                       f"{f.get('city', '')} {f.get('region', '')}".strip())

            if not address:
                skipped += 1
                continue

            # Google Geocoding API 호출
            lat, lng = geocode(address)
            time.sleep(DELAY)
            processed += 1

            if lat and lng:
                # ✅ PATCH 성공 여부를 반드시 확인
                ok = supabase_patch_with_retry(fid, lat, lng)
                if ok:
                    success += 1
                    print(f"✅ [{processed:>4}] {f.get('name','?')[:20]} | "
                          f"{lat:.4f}, {lng:.4f}")
                else:
                    patch_fail += 1
                    print(f"❌ [{processed:>4}] {f.get('name','?')[:20]} | "
                          f"PATCH 최종 실패 → 다음 실행 때 재시도됨")
            else:
                geo_fail += 1
                print(f"⚠️  [{processed:>4}] {f.get('name','?')[:20]} | "
                      f"좌표 변환 실패: {address[:30]}")

        # 한 배치 완료 후 짧은 대기
        if len(factories) == BATCH_SIZE:
            time.sleep(0.5)

    print("\n" + "=" * 55)
    print(f"오늘 처리: {processed}건")
    print(f"  ✅ 좌표 저장 성공: {success}건")
    print(f"  ❌ Geocoding 실패: {geo_fail}건 (주소 문제)")
    print(f"  ❌ DB 저장 실패:   {patch_fail}건 (다음 실행 때 재시도)")
    print(f"  ⏭️  주소 없어 스킵: {skipped}건")
    print("=" * 55)

    if patch_fail > 0:
        print(f"\n⚠️  DB 저장 실패 {patch_fail}건은 lat이 null로 남아 있어")
        print("   다음 실행 때 자동으로 재시도됩니다. (정상 동작)")

if __name__ == "__main__":
    main()
