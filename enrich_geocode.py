# enrich_geocode.py
# 주소 → 위도/경도 변환 (Google Geocoding API)
# 대상: lat/lng 없는 공장

import requests
import json
import time
import os

GOOGLE_API_KEY = os.environ.get("GOOGLE_GEOCODING_KEY", "AIzaSyC1WBx03zr2C0tDIdlsN8noB1Ue5dXpe1Y")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yezxwlzyiqgewpkkyget.supabase.co")
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
PROGRESS_FILE = "geocode_progress.json"
DAILY_LIMIT = int(os.environ.get("DAILY_LIMIT", "5000"))
DELAY = 0.05
BATCH_SIZE = 200

def supabase_get(params):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    res = requests.get(
        f"{SUPABASE_URL}/rest/v1/factories",
        headers=headers, params=params, timeout=30
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
        headers=headers, json=data, timeout=30
    )
    return res.status_code

def geocode(address):
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

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r") as f:
            data = json.load(f)
            return {
                "done_ids": data.get("done_ids", []),
                "total_processed": data.get("total_processed", 0)
            }
    return {"done_ids": [], "total_processed": 0}

def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f)

def main():
    print("=" * 50)
    print("주소 → 좌표 변환 시작 (enrich_geocode.py)")
    print("=" * 50)

    progress = load_progress()
    done_ids = set(progress["done_ids"])
    total_processed = progress["total_processed"]
    processed_today = 0
    success = 0
    offset = 0

    while processed_today < DAILY_LIMIT:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        }
        res = requests.get(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=headers,
            params={
                "select": "id,name,address,city,region",
                "lat": "is.null",
                "address": "not.is.null",
                "limit": BATCH_SIZE,
            },
            timeout=30
        )
        factories = res.json()

        if not factories or isinstance(factories, dict):
            print("처리할 공장이 없습니다.")
            break

        new_factories = [f for f in factories if f["id"] not in done_ids]
        if not new_factories:
            offset += BATCH_SIZE
            continue

        for f in new_factories:
            if processed_today >= DAILY_LIMIT:
                break

            fid = f["id"]
            address = f.get("address") or f"{f.get('city', '')} {f.get('region', '')}"

            lat, lng = geocode(address)
            time.sleep(DELAY)

            if lat and lng:
                supabase_patch(fid, {"lat": lat, "lng": lng})
                success += 1
                print(f"✅ {f['name']} | {lat:.4f}, {lng:.4f}")
            else:
                print(f"⚠️  {f['name']} | 좌표 없음")

            done_ids.add(fid)
            processed_today += 1
            total_processed += 1

        offset += BATCH_SIZE
        progress["done_ids"] = list(done_ids)
        progress["total_processed"] = total_processed
        save_progress(progress)

    print("=" * 50)
    print(f"오늘 처리: {processed_today}개 | 성공: {success}개")
    print(f"누적 처리: {total_processed}개")
    print("=" * 50)

if __name__ == "__main__":
    main()
