import requests

GOOGLE_API_KEY = "AIzaSyAzqW_ONJjW-ccC2A_n2fKUzyzfTbE5YWo"

TEST = [
    {"name": "한국정밀기계", "address": "경기도 안산시"},
    {"name": "대성금속", "address": "인천광역시 남동구"},
    {"name": "우진플라임", "address": "경기도 화성시"},
    {"name": "삼익THK", "address": "경기도 안산시"},
    {"name": "동아금속", "address": "경상남도 창원시"},
    {"name": "한일금속", "address": "경기도 시흥시"},
    {"name": "신영금속공업", "address": "인천광역시 부평구"},
    {"name": "대한정밀", "address": "경기도 안양시"},
]

def search(name, address):
    res = requests.get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
        params={"input": f"{name} {address}", "inputtype": "textquery",
                "fields": "name,photos,rating,user_ratings_total", "key": GOOGLE_API_KEY},
        timeout=10
    )
    return res.json()

has, no, notfound = 0, 0, 0
for f in TEST:
    r = search(f["name"], f["address"])
    candidates = r.get("candidates", [])
    if not candidates:
        print(f"❌ 못찾음: {f['name']}")
        notfound += 1
        continue
    p = candidates[0]
    photos = p.get("photos", [])
    rating = p.get("rating", "-")
    reviews = p.get("user_ratings_total", 0)
    found = p.get("name", "")
    if photos:
        print(f"✅ 사진있음: {found} | {len(photos)}장 | 별점{rating} | 리뷰{reviews}개")
        has += 1
    else:
        print(f"⚠️  사진없음: {found} | 별점{rating} | 리뷰{reviews}개")
        no += 1

total = has + no + notfound
print(f"\n결과: 사진있음 {has} / 사진없음 {no} / 못찾음 {notfound}")
print(f"사진 보유율: {round(has/total*100)}%")
