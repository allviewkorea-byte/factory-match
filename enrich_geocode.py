"""
Google Geocoding API → factories.coord_x (경도), coord_y (위도) 업데이트 (2단계)

사용법:  python enrich_geocode.py
진행상황: geocode_progress.json (날짜 자동 감지, 매일 재실행)
무료한도: 월 $200 크레딧 ≈ 40,000건 / 안전하게 하루 2,500건씩 처리
필요:    pip install requests
"""
import json, time, datetime, requests
from pathlib import Path

# ── 설정 ─────────────────────────────────────────────────────────────────────
GOOGLE_KEY  = "AIzaSyBA8NVjmUKCSbMtqbz0o6nuGECFmjbGGJY"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

SB_URL      = "https://yezxwlzyiqgewpkkyget.supabase.co"
SB_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
PROGRESS    = Path("geocode_progress.json")
DAILY_LIMIT = 2500
PAGE_SIZE   = 1000

SB_HEADERS = {
    "apikey":        SB_KEY,
    "Authorization": f"Bearer {SB_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}


# ── 진행상황 ──────────────────────────────────────────────────────────────────
def load_progress():
    if PROGRESS.exists():
        return json.loads(PROGRESS.read_text("utf-8"))
    return {"date": "", "today_count": 0, "done_ids": [], "failed_ids": []}

def save_progress(p):
    PROGRESS.write_text(json.dumps(p, ensure_ascii=False, indent=2), "utf-8")

def reset_daily_if_needed(p):
    today = datetime.date.today().isoformat()
    if p.get("date") != today:
        p["date"]        = today
        p["today_count"] = 0
        print(f"  새 날짜 ({today}): 일일 카운터 초기화")
    return p


# ── Supabase ──────────────────────────────────────────────────────────────────
def fetch_ungeocoded(session):
    """address 있고 coord_x IS NULL인 공장"""
    records, offset = [], 0
    while True:
        resp = session.get(f"{SB_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params=[
                ("select",  "id,name,address,phone,employees,founded,summary,website,industries"),
                ("address", "not.is.null"),
                ("coord_x", "is.null"),
                ("limit",   PAGE_SIZE),
                ("offset",  offset),
            ])
        chunk = resp.json()
        if not chunk:
            break
        # 빈 address 제거
        chunk = [r for r in chunk if (r.get("address") or "").strip()]
        records.extend(chunk)
        print(f"    {len(records):,}개 로드 중...", end="\r")
        if len(chunk) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    print()
    return records

def calc_score(row):
    s = 0
    if row.get("address"):                                  s += 20
    if row.get("phone"):                                    s += 15
    emp = row.get("employees")
    if emp is not None and emp not in (0, ""):              s += 10
    fnd = row.get("founded")
    if fnd is not None and fnd not in (0, ""):              s += 10
    if row.get("summary"):                                  s += 15
    if row.get("website"):                                  s += 20
    ind = row.get("industries")
    if ind and len(ind) > 0:                                s += 10
    return s

def patch_coords(session, factory_id, lat, lng, score):
    resp = session.patch(
        f"{SB_URL}/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": f"eq.{factory_id}"},
        json={"coord_y": lat, "coord_x": lng, "enriched_score": score},
        timeout=15,
    )
    return resp.status_code in (200, 204)


# ── 지오코딩 ──────────────────────────────────────────────────────────────────
def geocode_address(session, address):
    """(위도, 경도) 반환. 실패 또는 한도초과 시 (None, None, stop)"""
    try:
        resp = session.get(GEOCODE_URL, params={
            "address":  address,
            "key":      GOOGLE_KEY,
            "language": "ko",
            "region":   "kr",
        }, timeout=10)
        data   = resp.json()
        status = data.get("status")

        if status == "OK" and data.get("results"):
            loc = data["results"][0]["geometry"]["location"]
            return float(loc["lat"]), float(loc["lng"]), False

        if status in ("OVER_DAILY_LIMIT", "OVER_QUERY_LIMIT"):
            print(f"\n⚠️  Google API 한도 초과 ({status}). 내일 재실행하세요.")
            return None, None, True  # stop=True

        if status == "REQUEST_DENIED":
            msg = data.get("error_message", "")
            print(f"\n❌ Google API 키 오류: {msg}")
            return None, None, True

        return None, None, False  # ZERO_RESULTS 등

    except Exception as e:
        print(f"\n  요청 오류: {e}")
        return None, None, False


# ── 메인 ──────────────────────────────────────────────────────────────────────
def main():
    p       = load_progress()
    p       = reset_daily_if_needed(p)
    session = requests.Session()

    remaining = DAILY_LIMIT - p["today_count"]
    if remaining <= 0:
        print(f"⚠️  오늘 한도({DAILY_LIMIT}건) 소진.")
        print(f"   누적 처리: {len(p['done_ids']):,}개 / 내일 재실행하세요.")
        return

    print("[1] 미지오코딩 공장 조회...")
    factories = fetch_ungeocoded(session)
    done_set  = set(p["done_ids"]) | set(p["failed_ids"])
    todo      = [f for f in factories if f["id"] not in done_set]
    print(f"    미처리: {len(todo):,}개 | 오늘 처리 가능: {remaining:,}건")

    batch = todo[:remaining]
    if not batch:
        print("✅ 처리할 항목이 없습니다.")
        return

    print(f"\n[2] 지오코딩 시작 ({len(batch):,}건)...")
    success = 0
    t0      = time.time()

    for i, factory in enumerate(batch, 1):
        lat, lng, stop = geocode_address(session, factory["address"])

        if stop:
            save_progress(p)
            return

        if lat is not None:
            score = calc_score({**factory, "coord_x": lng, "coord_y": lat})
            ok    = patch_coords(session, factory["id"], lat, lng, score)
            if ok:
                success += 1
                p["done_ids"].append(factory["id"])
            else:
                p["failed_ids"].append(factory["id"])
        else:
            p["failed_ids"].append(factory["id"])

        p["today_count"] += 1

        if i % 100 == 0 or i == len(batch):
            save_progress(p)
            elapsed = time.time() - t0
            rps     = i / elapsed if elapsed > 0 else 0
            eta     = (len(batch) - i) / rps if rps > 0 else 0
            print(f"  {i:,}/{len(batch):,} | {rps:.1f}건/s | ETA {eta:.0f}s | 성공 {success:,}")

        time.sleep(0.04)  # ~25 req/s

    save_progress(p)
    remaining_total = len(todo) - len(batch)
    print(f"\n✅ 완료: 성공 {success:,}개 / 실패 {len(p['failed_ids']):,}개")
    print(f"   누적: {len(p['done_ids']):,}개")
    if remaining_total > 0:
        print(f"   잔여: {remaining_total:,}개 → 내일 재실행하세요.")


if __name__ == "__main__":
    main()
