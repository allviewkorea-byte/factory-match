import requests
import json

GOOGLE_API_KEY = "AIzaSyBA8NVjmUKCSbMtqbz0o6nuGECFmjbGGJY"

# 1단계: API 자체가 작동하는지 확인 (유명한 곳으로)
TEST_FACTORIES = [
    {"name": "스타벅스 강남점", "address": "서울 강남구"},
    {"name": "삼성전자 수원사업장", "address": "경기도 수원시"},
    {"name": "현대자동차 울산공장", "address": "울산광역시"},
    {"name": "LG전자 창원공장", "address": "경상남도 창원시"},
    {"name": "포스코 포항제철소", "address": "경상북도 포항시"},
]

def search_place(name, address):
    url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    params = {
        "input": f"{name} {address}",
        "inputtype": "textquery",
        "fields": "name,place_id,photos,formatted_address,rating,user_ratings_total",
        "key": GOOGLE_API_KEY,
        "language": "ko",
    }
    res = requests.get(url, params=params, timeout=10)
    data = res.json()
    print(f"  [API 상태] {data.get('status')} / 결과수: {len(data.get('candidates', []))}")
    return data

print("=" * 60)
print("Google Places API 테스트 (유명 장소로 확인)")
print("=" * 60)

has_photo = 0
no_photo = 0
not_found = 0

for f in TEST_FACTORIES:
    try:
        print(f"\n🔍 검색: {f['name']}")
        result = search_place(f["name"], f["address"])
        candidates = result.get("candidates", [])
        
        if not candidates:
            print(f"  ❌ 못찾음")
            not_found += 1
            continue
        
        place = candidates[0]
        photos = place.get("photos", [])
        rating = place.get("rating", "-")
        reviews = place.get("user_ratings_total", 0)
        found_name = place.get("name", "")
        
        if photos:
            print(f"  ✅ 사진있음: {found_name} | 사진 {len(photos)}장 | 별점 {rating} | 리뷰 {reviews}개")
            has_photo += 1
        else:
            print(f"  ⚠️  사진없음: {found_name} | 별점 {rating} | 리뷰 {reviews}개")
            no_photo += 1
    except Exception as e:
        print(f"  ❌ 오류: {e}")
        not_found += 1

print("\n" + "=" * 60)
print(f"결과: 사진있음 {has_photo}개 / 사진없음 {no_photo}개 / 못찾음 {not_found}개")
