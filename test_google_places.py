import requests
import json

GOOGLE_API_KEY = "AIzaSyBA8NVjmUKCSbMtqbz0o6nuGECFmjbGGJY"

# 테스트용 공장 샘플 (실제 중소 제조업체로)
TEST_FACTORIES = [
    {"name": "한국정밀기계", "address": "경기도 안산시"},
    {"name": "대성금속", "address": "인천광역시 남동구"},
    {"name": "우진플라임", "address": "경기도 화성시"},
    {"name": "삼익THK", "address": "경기도 안산시"},
    {"name": "동아금속", "address": "경상남도 창원시"},
    {"name": "한일금속", "address": "경기도 시흥시"},
    {"name": "신영금속공업", "address": "인천광역시 부평구"},
    {"name": "대한정밀", "address": "경기도 안양시"},
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
    return res.json()

print("=" * 60)
print("Google Places API 사진 보유 여부 테스트")
print("=" * 60)

has_photo = 0
no_photo = 0
not_found = 0

for f in TEST_FACTORIES:
    try:
        result = search_place(f["name"], f["address"])
        candidates = result.get("candidates", [])
        
        if not candidates:
            print(f"❌ 못찾음: {f['name']}")
            not_found += 1
            continue
        
        place = candidates[0]
        photos = place.get("photos", [])
        rating = place.get("rating", "-")
        reviews = place.get("user_ratings_total", 0)
        found_name = place.get("name", "")
        
        if photos:
            print(f"✅ 사진있음: {found_name} | 사진 {len(photos)}장 | 별점 {rating} | 리뷰 {reviews}개")
            has_photo += 1
        else:
            print(f"⚠️  사진없음: {found_name} | 별점 {rating} | 리뷰 {reviews}개")
            no_photo += 1
    except Exception as e:
        print(f"❌ 오류: {f['name']} - {e}")
        not_found += 1

print("=" * 60)
print(f"결과 요약: 사진있음 {has_photo}개 / 사진없음 {no_photo}개 / 못찾음 {not_found}개")
print(f"사진 보유율: {round(has_photo/(has_photo+no_photo+not_found)*100)}%")
