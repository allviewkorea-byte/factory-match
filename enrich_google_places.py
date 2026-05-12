# enrich_google_places.py
# Google Places API (New)로 별점/리뷰/사진/전화/영업시간/홈페이지/좌표 수집
# 대상: website + ai_summary 둘 다 있는 검증된 공장만

import requests
import json
import time
import os

GOOGLE_API_KEY = "AIzaSyAzqW_ONJjW-ccC2A_n2fKUzyzfTbE5YWo"
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzOTU1NjEsImV4cCI6MjA1ODk3MTU2MX0.HbcDuDGJ6B1M3G2TbcqULEFMgjuBwGilNe8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
PROGRESS_FILE = "google_places_progress.json"
BATCH_SIZE = 100
DAILY_LIMIT = 10  # 테스트
DELAY = 0.3  # API 호출 간격 (초)

def supabase_get(path, params=None):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    res = requests.get(f"{SUPABASE_URL}/rest/v1/{path}", headers=headers, params=params, timeout=30)
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

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r") as f:
            return json.load(f)
    return {"done_ids": [], "total_processed": 0}

def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f)

def find_place(name, address, city):
    """Places API로 장소 검색"""
    query = f"{name} {address or city}"
    url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    params = {
        "input": query,
        "inputtype": "textquery",
        "fields": "place_id,name",
        "key": GOOGLE_API_KEY,
        "language": "ko",
    }
    res = requests.get(url, params=params, timeout=10)
    data = res.json()
    if data.get("status") == "OK" and data.get("candidates"):
        return data["candidates"][0].get("place_id")
    return None

def get_place_details(place_id):
    """Place ID로 상세 정보 수집"""
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "name,rating,user_ratings_total,photos,formatted_phone_number,opening_hours,website,geometry,formatted_address",
        "key": GOOGLE_API_KEY,
        "language": "ko",
    }
    res = requests.get(url, params=params, timeout=10)
    data = res.json()
    if data.get("status") == "OK":
        return data.get("result", {})
    return None

def get_photo_url(photo_reference, max_width=800):
    """photo_reference로 실제 이미지 URL 생성"""
    return f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photo_reference={photo_reference}&key={GOOGLE_API_KEY}"

def fetch_factories(offset, limit):
    """website + ai_summary 있는 공장만 조회"""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    url = f"{SUPABASE_URL}/rest/v1/factories"
    params = {
        "select": "id,name,city,region,address,phone,website,lat",
        "website": "not.is.null",
        "ai_summary": "not.is.null",
        "google_place_id": "is.null",
        "offset": offset,
        "limit": limit,
        "order": "completeness_score.desc",
    }
    res = requests.get(url, headers=headers, params=params, timeout=30)
    return res.json()

def main():
    print("=" * 60)
    print("Google Places 정보 수집 시작")
    print("대상: website + ai_summary 있는 공장")
    print("=" * 60)

    progress = load_progress()
    done_ids = set(progress["done_ids"])
    total_processed = progress["total_processed"]

    processed_today = 0
    success = 0
    no_result = 0
    offset = 0

    while processed_today < DAILY_LIMIT:
        factories = fetch_factories(offset, BATCH_SIZE)
        if not factories:
            print("수집 완료! 더 이상 처리할 공장이 없어요.")
            break

        for f in factories:
            if processed_today >= DAILY_LIMIT:
                break

            fid = f["id"]
            if fid in done_ids:
                continue

            name = f.get("name", "")
            address = f.get("address", "")
            city = f.get("city", "")

            # 1단계: place_id 검색
            place_id = find_place(name, address, city)
            time.sleep(DELAY)

            if not place_id:
                no_result += 1
                done_ids.add(fid)
                processed_today += 1
                # 못찾은 것도 표시 (재시도 방지)
                supabase_patch(fid, {"google_place_id": "NOT_FOUND"})
                continue

            # 2단계: 상세 정보 수집
            details = get_place_details(place_id)
            time.sleep(DELAY)

            if not details:
                no_result += 1
                done_ids.add(fid)
                processed_today += 1
                continue

            # 사진 URL 목록 생성 (최대 5장)
            photos = []
            for ph in details.get("photos", [])[:5]:
                ref = ph.get("photo_reference")
                if ref:
                    photos.append(get_photo_url(ref))

            # 영업시간
            hours = None
            oh = details.get("opening_hours")
            if oh:
                hours = oh.get("weekday_text", [])

            # 좌표
            geo = details.get("geometry", {}).get("location", {})
            lat = geo.get("lat")
            lng = geo.get("lng")

            # DB 업데이트 데이터
            update_data = {
                "google_place_id": place_id,
                "google_rating": details.get("rating"),
                "google_reviews": details.get("user_ratings_total"),
                "google_photos": photos if photos else None,
                "google_hours": hours if hours else None,
            }

            # 전화번호 없는 경우 구글 것으로 보완
            phone = details.get("formatted_phone_number")
            if phone and not f.get("phone"):
                update_data["phone"] = phone

            # 웹사이트 없는 경우 구글 것으로 보완
            website = details.get("website")
            if website and not f.get("website"):
                update_data["website"] = website

            # 좌표 없는 경우 구글 것으로 보완
            if lat and lng and not f.get("lat"):
                update_data["lat"] = lat
                update_data["lng"] = lng

            status = supabase_patch(fid, update_data)
            done_ids.add(fid)
            processed_today += 1
            total_processed += 1

            if photos:
                success += 1
                print(f"✅ {name} | 사진{len(photos)}장 | 별점{details.get('rating','-')} | 리뷰{details.get('user_ratings_total',0)}개")
            else:
                print(f"⚠️  {name} | 사진없음 | 별점{details.get('rating','-')} | 리뷰{details.get('user_ratings_total',0)}개")

        offset += BATCH_SIZE

        # 진행 상황 저장
        progress["done_ids"] = list(done_ids)
        progress["total_processed"] = total_processed
        save_progress(progress)

    print("\n" + "=" * 60)
    print(f"오늘 처리: {processed_today}개")
    print(f"사진 수집: {success}개")
    print(f"사진 없음: {no_result}개")
    print(f"누적 처리: {total_processed}개")
    print("=" * 60)

if __name__ == "__main__":
    main()
