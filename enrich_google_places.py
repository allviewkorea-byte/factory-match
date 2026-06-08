# enrich_google_places.py
# Google Places API (New)로 별점/리뷰/사진/전화/영업시간/홈페이지/좌표 수집
# 대상: website + ai_summary 둘 다 있는 검증된 공장만

import requests
import json
import time
import os

GOOGLE_API_KEY = os.environ.get("GOOGLE_PLACES_KEY", "AIzaSyBA8NVjmUKCSbMtqbz0o6nuGECFmjbGGJY")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yezxwlzyiqgewpkkyget.supabase.co")
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
PROGRESS_FILE = "google_places_progress.json"
BATCH_SIZE = 100
DAILY_LIMIT = int(os.environ.get("DAILY_LIMIT", "3500"))  # $60 예산 기준 (~3,500건)
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
        "fields": "place_id,name,formatted_address",
        "key": GOOGLE_API_KEY,
        "language": "ko",
    }
    res = requests.get(url, params=params, timeout=10)
    data = res.json()
    if data.get("status") == "OK" and data.get("candidates"):
        candidate = data["candidates"][0]
        return candidate.get("place_id"), candidate.get("formatted_address", "")
    return None, ""

def verify_address(db_region, db_city, db_address, google_address):
    """구글 주소와 DB 주소 일치 여부 검증 (시/군/구 레벨)"""
    if not google_address:
        return False

    # DB에서 비교할 키워드 추출
    keywords = []
    if db_city:
        # 시/군/구 앞 2~3글자 추출 (예: "남양주시" → "남양주")
        keywords.append(db_city[:3])
    if db_region:
        # 도/광역시 앞 2글자 (예: "경기도" → "경기")
        keywords.append(db_region[:2])
    if db_address:
        # 주소에서 동/읍/면 추출
        parts = db_address.split()
        for p in parts:
            if any(p.endswith(x) for x in ['동', '읍', '면', '구', '시', '군']):
                keywords.append(p[:3])

    if not keywords:
        return False

    # 구글 주소에 키워드 중 하나라도 포함되면 일치로 판단
    google_lower = google_address
    match_count = sum(1 for kw in keywords if kw in google_lower)

    # 키워드 2개 이상 일치해야 통과
    return match_count >= 2

def get_place_details(place_id):
    """Place ID로 상세 정보 수집"""
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "name,rating,user_ratings_total,photos,formatted_phone_number,opening_hours,website,geometry,formatted_address,reviews",
        "key": GOOGLE_API_KEY,
        "language": "ko",
    }
    res = requests.get(url, params=params, timeout=10)
    data = res.json()
    status = data.get("status")
    if status == "OK":
        result = data.get("result", {})
        photos = result.get("photos", [])
        print(f"  📍 Place Details OK | 사진:{len(photos)}장 | 리뷰:{len(result.get('reviews',[]))}개")
        return result
    else:
        print(f"  ❌ Place Details 실패: {status} | {data.get('error_message','')}")
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
        "select": "id,name,city,region,address,phone,website",
        "google_place_id": "not.is.null",
        "google_photos": "is.null",
        "offset": offset,
        "limit": limit,
        "order": "completeness_score.desc",
    }
    res = requests.get(url, headers=headers, params=params, timeout=30)
    return res.json()

def main():
    print("=" * 60)
    print("Google Places 정보 수집 시작")
    print(f"API 키: ...{GOOGLE_API_KEY[-10:]}")
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
            existing_place_id = f.get("google_place_id", "")

            # 이미 place_id가 있으면 바로 상세 정보 수집 (사진 + 리뷰)
            if existing_place_id and existing_place_id not in ("NOT_FOUND", "ADDR_MISMATCH", "EXCLUDED"):
                place_id = existing_place_id
                details = get_place_details(place_id)
                time.sleep(DELAY)
                if not details:
                    done_ids.add(fid)
                    processed_today += 1
                    continue
                # 사진 수집
                photos = []
                for ph in details.get("photos", [])[:5]:
                    ref = ph.get("photo_reference")
                    if ref:
                        photos.append(get_photo_url(ref))
                # 리뷰 수집
                review_texts = []
                for rv in details.get("reviews", [])[:5]:
                    review_texts.append({
                        "author": rv.get("author_name", ""),
                        "rating": rv.get("rating", 0),
                        "text": rv.get("text", ""),
                        "time": rv.get("relative_time_description", ""),
                    })
                update_data = {
                    "google_review_texts": json.dumps(review_texts) if review_texts else "[]",
                }
                if photos:
                    update_data["google_photos"] = json.dumps(photos)
                    success += 1
                    print(f"✅ 사진+리뷰: {name} | 사진 {len(photos)}장 리뷰 {len(review_texts)}개")
                else:
                    print(f"📝 리뷰만: {name} | 리뷰 {len(review_texts)}개")
                update_data = {k: v for k, v in update_data.items() if v != "KEEP_EXISTING"}
                supabase_patch(fid, update_data)
                done_ids.add(fid)
                processed_today += 1
                total_processed += 1
                continue

            # 1단계: place_id 검색
            place_id, google_address = find_place(name, address, city)
            time.sleep(DELAY)

            if not place_id:
                no_result += 1
                done_ids.add(fid)
                processed_today += 1
                supabase_patch(fid, {"google_place_id": "NOT_FOUND"})
                continue

            # 2단계: 주소 일치 검증
            region = f.get("region", "")
            is_match = verify_address(region, city, address, google_address)
            if not is_match:
                print(f"⛔ 주소 불일치: {name} | DB:{city} | 구글:{google_address[:30]}")
                no_result += 1
                done_ids.add(fid)
                processed_today += 1
                supabase_patch(fid, {"google_place_id": "ADDR_MISMATCH", "hidden": True})
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

            # 리뷰 텍스트 수집 (최대 5개)
            review_texts = []
            for rv in details.get("reviews", [])[:5]:
                review_texts.append({
                    "author": rv.get("author_name", ""),
                    "rating": rv.get("rating", 0),
                    "text": rv.get("text", ""),
                    "time": rv.get("relative_time_description", ""),
                })

            # DB 업데이트 데이터
            update_data = {
                "google_place_id": place_id,
                "google_rating": details.get("rating"),
                "google_reviews": details.get("user_ratings_total"),
                "google_photos": json.dumps(photos) if photos else "KEEP_EXISTING",
                "google_hours": json.dumps(hours) if hours else None,
                "google_review_texts": json.dumps(review_texts) if review_texts else None,
                "google_address": details.get("formatted_address") or google_address or None,
            }

            # 구글 website 저장 (크로스체크용)
            website = details.get("website")
            if website:
                update_data["google_website"] = website
                # website 없는 경우 구글 것으로 보완
                if not f.get("website"):
                    update_data["website"] = website

            # 전화번호 없는 경우 구글 것으로 보완
            phone = details.get("formatted_phone_number")
            if phone and not f.get("phone"):
                update_data["phone"] = phone

            # 좌표 없는 경우 구글 것으로 보완
            if lat and lng:
                update_data["lat"] = lat
                update_data["lng"] = lng

            # 기존 데이터 보호: 새로 수집 못한 필드는 업데이트에서 제외
            update_data = {k: v for k, v in update_data.items() if v != "KEEP_EXISTING"}
            status = supabase_patch(fid, update_data)
            done_ids.add(fid)
            processed_today += 1
            total_processed += 1

            if status not in [200, 204]:
                print(f"  ⚠️ DB 저장 실패 (status={status}): {name}")
                continue

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
