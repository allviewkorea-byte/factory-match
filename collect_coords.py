"""
한국산업단지공단 공장등록필지정보 API → factories 테이블 coord_x/coord_y UPDATE

사용법:
  pip install requests pandas
  python collect_coords.py

동작:
  1. API에서 전체 공장 위도/경도 수집 (numOfRows=1000으로 페이징)
  2. 회사명 기준으로 DB의 kicox_ 레코드와 매칭
  3. 위도/경도 → SVG 0-100 좌표 변환 후 PATCH

진행 상태는 coords_progress.json에 저장 (중단 후 재시작 가능)
"""

import json
import math
import time
import os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# ── API 설정 ──────────────────────────────────────────────────
API_BASE    = "https://apis.data.go.kr/B550624/fctryRegistLndpclInfo"
API_OP      = "getFctryLndpclService"
SERVICE_KEY = "2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7"
NUM_OF_ROWS = 1000          # 요청당 최대 행 수 (실패 시 100으로 줄여볼 것)
DAILY_LIMIT = 1000          # 일일 API 호출 한도

# ── Supabase 설정 ─────────────────────────────────────────────
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
# ⚠️  401/403 오류 시 service_role key로 교체 (Dashboard > Settings > API)
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"

SB_HEADERS = {
    "apikey":        API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

MAX_WORKERS    = 20     # 동시 PATCH 요청 수
PROGRESS_FILE  = "coords_progress.json"

# ── 좌표 변환 ─────────────────────────────────────────────────
def lat_lng_to_svg(lat, lng):
    """실제 위경도 → SVG 0-100 좌표 (한국 범위 기준)"""
    x = (lng - 124.0) / (130.5 - 124.0) * 100
    y = (38.6 - lat)  / (38.6  - 33.0)  * 100
    return round(max(0.0, min(100.0, x)), 2), round(max(0.0, min(100.0, y)), 2)

# ── 진행 상태 저장/로드 ───────────────────────────────────────
def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"last_page": 0, "total_pages": None, "total_count": None, "updated_ids": []}

def save_progress(p):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(p, f, ensure_ascii=False, indent=2)

# ── API 호출 ──────────────────────────────────────────────────
def fetch_page(session, page_no):
    """단일 페이지 호출. (items, totalCount) 반환"""
    params = {
        "serviceKey": SERVICE_KEY,
        "numOfRows":  NUM_OF_ROWS,
        "pageNo":     page_no,
        "resultType": "json",
    }
    resp = session.get(f"{API_BASE}/{API_OP}", params=params, timeout=30)
    resp.raise_for_status()
    body = resp.json()

    # 응답 구조 파싱 (공공데이터 표준 구조)
    try:
        res = body["response"]
        header = res["header"]
        if header["resultCode"] not in ("00", "0000"):
            raise ValueError(f"API 오류: {header['resultCode']} {header.get('resultMsg', '')}")
        items_raw = res["body"]["items"]
        total     = int(res["body"]["totalCount"])
        # items가 dict(단일) 또는 list일 수 있음
        if isinstance(items_raw, dict):
            items = items_raw.get("item", [])
            if isinstance(items, dict):
                items = [items]
        else:
            items = items_raw or []
        return items, total
    except (KeyError, TypeError) as e:
        print(f"  ⚠️  응답 파싱 오류: {e}")
        print(f"  응답 앞 500자: {str(body)[:500]}")
        return [], 0

# ── Supabase 기존 kicox_ 레코드 로딩 ─────────────────────────
def fetch_all_kicox(session):
    """DB의 모든 kicox_ 레코드 (id, name) 페이지네이션으로 가져오기"""
    records, offset, page_size = [], 0, 1000
    while True:
        resp = session.get(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params={"select": "id,name", "id": "like.kicox_%",
                    "limit": page_size, "offset": offset},
        )
        resp.raise_for_status()
        chunk = resp.json()
        if not chunk:
            break
        records.extend(chunk)
        print(f"    {len(records):,}개 로드 중...", end="\r")
        if len(chunk) < page_size:
            break
        offset += page_size
    print()
    return records

# ── Supabase PATCH ────────────────────────────────────────────
def patch_coord(session, factory_id, coord_x, coord_y):
    try:
        resp = session.patch(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params={"id": f"eq.{factory_id}"},
            json={"coord_x": coord_x, "coord_y": coord_y},
            timeout=15,
        )
        ok = resp.status_code in (200, 204)
        return factory_id, ok, None if ok else f"{resp.status_code} {resp.text[:100]}"
    except Exception as e:
        return factory_id, False, str(e)

# ── 필드명 자동 감지 ──────────────────────────────────────────
LAT_CANDIDATES  = ["latitude", "la", "lcLa", "lat", "위도", "y좌표"]
LNG_CANDIDATES  = ["longitude", "lo", "lcLo", "lng", "경도", "x좌표"]
NAME_CANDIDATES = ["fctryNm", "bsnNm", "entrpsNm", "cmpnyNm", "회사명", "업체명", "공장명"]

def detect_field(item, candidates):
    for c in candidates:
        if c in item and item[c] not in (None, "", "null"):
            return c
    return None

def str_val(v):
    if v is None:
        return None
    s = str(v).strip()
    return s if s and s.lower() not in ("null", "nan", "") else None

# ── 메인 ─────────────────────────────────────────────────────
def main():
    progress = load_progress()
    session  = requests.Session()

    # ── 1. 첫 페이지로 응답 구조 확인 ───────────────────────
    if not progress["total_count"]:
        print("\n[1] API 응답 구조 확인 중 (numOfRows=1000 지원 여부)...")
        try:
            items, total = fetch_page(session, 1)
        except Exception as e:
            print(f"❌ API 호출 실패: {e}")
            print("\n[대안 안내]")
            print_alternatives()
            return

        if not items:
            print("❌ 응답 데이터 없음. API 키 또는 엔드포인트를 확인하세요.")
            return

        # 필드 자동 감지
        sample = items[0]
        lat_f  = detect_field(sample, LAT_CANDIDATES)
        lng_f  = detect_field(sample, LNG_CANDIDATES)
        name_f = detect_field(sample, NAME_CANDIDATES)

        print(f"    응답 샘플 키: {list(sample.keys())}")
        print(f"    위도 필드: '{lat_f}', 경도 필드: '{lng_f}', 이름 필드: '{name_f}'")
        print(f"    전체 건수: {total:,}")
        print(f"    이번 페이지 수신: {len(items)}건 (numOfRows={NUM_OF_ROWS})")

        total_pages = math.ceil(total / NUM_OF_ROWS)
        needed_calls = total_pages
        print(f"\n    필요 API 호출 수: {needed_calls:,} (일일 한도: {DAILY_LIMIT})")

        if needed_calls <= DAILY_LIMIT:
            print("    ✅ 일일 한도 이내 → 하루에 전체 수집 가능!")
        else:
            print(f"    ⚠️  일일 한도 초과 → {math.ceil(needed_calls / DAILY_LIMIT)}일 소요")
            print("       → numOfRows를 늘리거나 아래 [대안]을 참고하세요.")

        progress["total_count"] = total
        progress["total_pages"] = total_pages
        progress["lat_field"]   = lat_f
        progress["lng_field"]   = lng_f
        progress["name_field"]  = name_f
        save_progress(progress)
    else:
        total_pages = progress["total_pages"]
        lat_f  = progress.get("lat_field")
        lng_f  = progress.get("lng_field")
        name_f = progress.get("name_field")
        print(f"\n[1] 진행 상태 복원: 페이지 {progress['last_page']}/{total_pages} 완료")

    if not lat_f or not lng_f or not name_f:
        print("❌ 위도/경도/이름 필드를 감지 못했습니다. API 응답 구조를 확인하세요.")
        return

    # ── 2. DB의 kicox_ 레코드 로딩 ──────────────────────────
    print("\n[2] DB에서 kicox_ 레코드 로딩...")
    try:
        db_records = fetch_all_kicox(session)
    except Exception as e:
        print(f"❌ DB 조회 실패: {e}")
        return
    name_to_id = {r["name"].strip(): r["id"] for r in db_records}
    print(f"    kicox_ 레코드: {name_to_id.__len__():,}개")

    already_updated = set(progress.get("updated_ids", []))

    # ── 3. 페이지별 API 수집 + 좌표 추출 ────────────────────
    print(f"\n[3] API 수집 시작 (페이지 {progress['last_page']+1} ~ {total_pages})...")
    all_updates = []   # [(factory_id, coord_x, coord_y), ...]
    t0 = time.time()
    call_count = 0

    for page in range(progress["last_page"] + 1, total_pages + 1):
        if call_count >= DAILY_LIMIT:
            print(f"\n⚠️  일일 호출 한도({DAILY_LIMIT}) 도달. 내일 재실행하세요.")
            print(f"   진행 상태 저장됨: {PROGRESS_FILE}")
            save_progress(progress)
            break

        try:
            items, _ = fetch_page(session, page)
            call_count += 1
        except Exception as e:
            print(f"  페이지 {page} 오류: {e}. 재시도 중...")
            time.sleep(2)
            try:
                items, _ = fetch_page(session, page)
                call_count += 1
            except Exception as e2:
                print(f"  페이지 {page} 재시도 실패: {e2}. 건너뜀.")
                continue

        for item in items:
            name = str_val(item.get(name_f))
            if not name:
                continue
            factory_id = name_to_id.get(name)
            if not factory_id or factory_id in already_updated:
                continue
            try:
                lat = float(item.get(lat_f, "") or 0)
                lng = float(item.get(lng_f, "") or 0)
                if 33.0 <= lat <= 39.0 and 124.0 <= lng <= 132.0:
                    cx, cy = lat_lng_to_svg(lat, lng)
                    all_updates.append((factory_id, cx, cy))
            except (ValueError, TypeError):
                continue

        progress["last_page"] = page
        save_progress(progress)

        if page % 10 == 0 or page == total_pages:
            elapsed = time.time() - t0
            pct = page / total_pages * 100
            print(f"  수집 {pct:.1f}% | {page}/{total_pages}p | "
                  f"API {call_count}회 | 매칭 {len(all_updates):,}건 | {elapsed:.0f}s")

        time.sleep(0.1)   # API 서버 부하 방지

    print(f"\n    총 업데이트 대상: {len(all_updates):,}건")

    if not all_updates:
        print("⚠️  업데이트할 항목 없음.")
        return

    # ── 4. 병렬 PATCH ────────────────────────────────────────
    print(f"\n[4] DB 업데이트 중 (동시 {MAX_WORKERS}개)...")
    total_u = len(all_updates)
    success, errors, done = 0, [], 0
    t1 = time.time()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(patch_coord, session, fid, cx, cy): fid
            for fid, cx, cy in all_updates
        }
        for future in as_completed(futures):
            fid, ok, err = future.result()
            done += 1
            if ok:
                success += 1
                already_updated.add(fid)
            else:
                errors.append((fid, err))
                if len(errors) <= 3:
                    print(f"  ⚠️  {fid}: {err}")
            if done % 500 == 0 or done == total_u:
                elapsed = time.time() - t1
                rps = done / elapsed if elapsed > 0 else 0
                eta = (total_u - done) / rps if rps > 0 else 0
                print(f"  {done/total_u*100:5.1f}% | {done:,}/{total_u:,} | "
                      f"{rps:.0f}건/s | 남은 {eta:.0f}s")

    progress["updated_ids"] = list(already_updated)
    save_progress(progress)

    elapsed = time.time() - t1
    print(f"\n✅ 완료: {elapsed:.1f}s")
    print(f"   성공: {success:,}개 | 실패: {len(errors)}개")
    if errors:
        print(f"   → 첫 오류: {errors[0][1]}")
        print("   → 401/403이면 service_role key로 교체 후 재실행")

    if progress["last_page"] >= total_pages:
        if os.path.exists(PROGRESS_FILE):
            os.remove(PROGRESS_FILE)
        print("   진행 파일 삭제 완료 (전체 수집 종료)")


def print_alternatives():
    print("""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[대안 1] numOfRows 최대값 확인
  - data.go.kr 명세서에서 numOfRows 최대값 확인
  - 1000이면: 218 API 호출로 전체 수집 가능 (일일 한도 이내)

[대안 2] 한도 증설 신청
  - data.go.kr → 해당 API 활용신청 페이지
  - '한도 증설 요청' 또는 고객센터(02-2100-3201) 문의

[대안 3] 카카오 주소 → 좌표 변환 (추천)
  - address 컬럼에 주소 이미 있음 → 좌표로 변환 가능
  - Kakao Local API: 일일 30만 건 무료
  - https://developers.kakao.com/docs/latest/ko/local/dev-guide
  - 키 발급: kakao developers → 내 애플리케이션 → REST API 키

[대안 4] Naver Geocoding
  - 일일 10만 건 무료
  - https://www.ncloud.com/product/applicationService/maps

[대안 5] 파일 데이터 활용 (15105482)
  - data.go.kr에서 전체 CSV 한번에 다운로드
  - 위도/경도 컬럼 포함 여부 재확인
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")


if __name__ == "__main__":
    main()
    print_alternatives()
