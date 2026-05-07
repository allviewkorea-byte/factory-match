"""
한국산업단지공단 공장등록필지정보 API → factories 테이블 UPDATE

수집 필드:
  cmpnyNm   → 회사명 (매칭 키)
  rnAdres   → address 컬럼
  irsttNm   → summary에 [단지명] 추가

사용법:
  pip install requests
  python collect_kicox_lndpcl.py          # 처음 실행 또는 이어서 실행

진행 상태: lndpcl_progress.json 에 저장 → 중단 후 재실행하면 이어서 진행
"""

import json, math, os, time, requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# ── API ────────────────────────────────────────────────────────────────────
API_URL     = "http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService"
SERVICE_KEY = "2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7"
NUM_OF_ROWS = 1000          # 요청당 행 수 (최대값 시도; 안 되면 100으로 줄일 것)
DAILY_LIMIT = 1000          # 일일 API 호출 한도

# ── Supabase ───────────────────────────────────────────────────────────────
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
ANON_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
# ⚠️  PATCH 시 401/403 → Dashboard > Settings > API > service_role key 로 교체
SB_HEADERS   = {
    "apikey":        ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

MAX_PATCH_WORKERS = 20
PROGRESS_FILE     = "lndpcl_progress.json"


# ─────────────────────────────────────────────────────────────────────────
# 유틸
# ─────────────────────────────────────────────────────────────────────────

def sv(v):
    """None / 빈값 / 'null' → None, 나머지 → strip 문자열"""
    if v is None:
        return None
    s = str(v).strip()
    return s if s and s.lower() not in ("null", "nan", "") else None


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {
        "last_page":   0,
        "total_pages": None,
        "total_count": None,
        "done_ids":    [],   # 이미 업데이트 완료된 factory id 목록
    }


def save_progress(p):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(p, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────────────────────
# API
# ─────────────────────────────────────────────────────────────────────────

def fetch_page(session, page_no):
    """API 1페이지 호출 → (items: list, total_count: int)"""
    params = {
        "serviceKey": SERVICE_KEY,
        "numOfRows":  NUM_OF_ROWS,
        "pageNo":     page_no,
        "cmpnyNm":    "",        # 빈값 = 전체 조회
        "resultType": "json",
    }
    resp = session.get(API_URL, params=params, timeout=30)
    resp.raise_for_status()

    try:
        body   = resp.json()
        res    = body["response"]
        header = res["header"]
        code   = header.get("resultCode", "")
        if code not in ("00", "0000", "000"):
            raise ValueError(f"API 오류 코드={code} msg={header.get('resultMsg', '')}")

        raw_items  = res["body"].get("items") or {}
        total      = int(res["body"].get("totalCount", 0))

        # items 는 dict(단일 item) 또는 {"item": [...]} 또는 []
        if isinstance(raw_items, list):
            items = raw_items
        elif isinstance(raw_items, dict):
            inner = raw_items.get("item", [])
            items = [inner] if isinstance(inner, dict) else (inner or [])
        else:
            items = []

        return items, total

    except Exception as e:
        snippet = resp.text[:400]
        raise RuntimeError(f"응답 파싱 실패: {e}\n응답 앞 400자:\n{snippet}") from e


# ─────────────────────────────────────────────────────────────────────────
# Supabase
# ─────────────────────────────────────────────────────────────────────────

def fetch_all_kicox(session):
    """DB의 kicox_ 레코드 전체 (id, name, summary) 페이지네이션으로 로딩"""
    records, offset, ps = [], 0, 1000
    while True:
        resp = session.get(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params={"select": "id,name,summary",
                    "id": "like.kicox_%",
                    "limit": ps, "offset": offset},
        )
        resp.raise_for_status()
        chunk = resp.json()
        if not chunk:
            break
        records.extend(chunk)
        print(f"    {len(records):,}개 로드 중...", end="\r")
        if len(chunk) < ps:
            break
        offset += ps
    print()
    return records


def patch_factory(session, factory_id, payload):
    """단일 PATCH → (id, ok, err_msg)"""
    try:
        resp = session.patch(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params={"id": f"eq.{factory_id}"},
            json=payload,
            timeout=15,
        )
        ok = resp.status_code in (200, 204)
        return factory_id, ok, (None if ok else f"{resp.status_code} {resp.text[:120]}")
    except Exception as e:
        return factory_id, False, str(e)


# ─────────────────────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────────────────────

def main():
    progress  = load_progress()
    session   = requests.Session()
    done_ids  = set(progress["done_ids"])

    # ── 1. 첫 페이지로 구조 확인 ──────────────────────────────────────
    if progress["total_count"] is None:
        print("\n[1] API 첫 페이지 호출 (응답 구조 및 총 건수 확인)...")
        try:
            items, total = fetch_page(session, 1)
        except Exception as e:
            print(f"\n❌ API 호출 실패: {e}")
            return

        if not items:
            print("❌ 응답에 데이터 없음. 인증키·엔드포인트 확인 필요.")
            return

        total_pages = math.ceil(total / NUM_OF_ROWS)
        print(f"    총 건수   : {total:,}")
        print(f"    페이지 수 : {total_pages} (numOfRows={NUM_OF_ROWS})")
        print(f"    샘플 키   : {list(items[0].keys())}")

        needed = total_pages
        if needed <= DAILY_LIMIT:
            print(f"    ✅ 필요 API 호출 {needed}회 ≤ 일일 한도 {DAILY_LIMIT}회 → 하루에 완료 가능")
        else:
            days = math.ceil(needed / DAILY_LIMIT)
            print(f"    ⚠️  필요 {needed}회 > 일일 한도 {DAILY_LIMIT}회 → {days}일 소요")

        progress["total_count"] = total
        progress["total_pages"] = total_pages
        save_progress(progress)
        # 첫 페이지 데이터는 아래 루프에서 재활용하지 않고 다시 호출
        # (단순화를 위해 page 1부터 루프 시작)
    else:
        total_pages = progress["total_pages"]
        print(f"\n[1] 진행 재개: {progress['last_page']}/{total_pages} 페이지 완료")

    # ── 2. DB kicox_ 레코드 로딩 ──────────────────────────────────────
    print("\n[2] DB kicox_ 레코드 로딩...")
    try:
        db_rows = fetch_all_kicox(session)
    except Exception as e:
        print(f"❌ DB 로딩 실패: {e}")
        return

    # name → {id, summary} 매핑
    name_map = {r["name"].strip(): r for r in db_rows}
    print(f"    kicox_ 레코드: {len(name_map):,}개")

    # ── 3. API 페이지별 수집 ───────────────────────────────────────────
    start_page = progress["last_page"] + 1
    print(f"\n[3] API 수집 ({start_page}~{total_pages} 페이지)...")

    updates   = []   # (factory_id, payload)
    api_calls = 0
    t0        = time.time()

    for page in range(start_page, total_pages + 1):

        if api_calls >= DAILY_LIMIT:
            print(f"\n⚠️  일일 호출 한도({DAILY_LIMIT}) 도달. {PROGRESS_FILE} 저장 완료.")
            print("    내일 재실행하면 이어서 진행됩니다.")
            save_progress(progress)
            break

        # API 호출 (오류 시 1회 재시도)
        for attempt in range(2):
            try:
                items, _ = fetch_page(session, page)
                api_calls += 1
                break
            except Exception as e:
                if attempt == 0:
                    print(f"  p{page} 오류, 2초 후 재시도: {e}")
                    time.sleep(2)
                else:
                    print(f"  p{page} 재시도 실패, 건너뜀: {e}")
                    items = []

        # 수집한 items → 업데이트 목록 구성
        for item in items:
            name = sv(item.get("cmpnyNm"))
            if not name:
                continue
            rec = name_map.get(name)
            if not rec or rec["id"] in done_ids:
                continue

            payload = {}

            addr = sv(item.get("rnAdres"))
            if addr:
                payload["address"] = addr

            complex_nm = sv(item.get("irsttNm"))
            if complex_nm:
                # 기존 summary 유지하면서 [단지명] 추가 (중복 방지)
                existing = sv(rec.get("summary")) or ""
                tag = f"[{complex_nm}]"
                if tag not in existing:
                    payload["summary"] = (existing + " " + tag).strip() if existing else tag

            if payload:
                updates.append((rec["id"], payload))

        progress["last_page"] = page
        save_progress(progress)

        # 진행 출력
        if page % 20 == 0 or page == total_pages:
            elapsed = time.time() - t0
            pct     = page / total_pages * 100
            rps     = api_calls / elapsed if elapsed > 0 else 0
            eta     = (total_pages - page) / rps if rps > 0 else 0
            print(f"  {pct:5.1f}% | p{page}/{total_pages} | "
                  f"API {api_calls}회 | 매칭 {len(updates):,}건 | 남은 {eta:.0f}s")

        time.sleep(0.05)   # 서버 부하 방지

    print(f"\n    수집 완료: {len(updates):,}건 업데이트 예정")

    if not updates:
        print("⚠️  업데이트 대상 없음 (이미 모두 완료되었거나 매칭 실패).")
        return

    # ── 4. 병렬 PATCH ─────────────────────────────────────────────────
    print(f"\n[4] Supabase PATCH 중 (동시 {MAX_PATCH_WORKERS}개)...")
    total_u  = len(updates)
    success, errors, done_u = 0, [], 0
    t1 = time.time()

    with ThreadPoolExecutor(max_workers=MAX_PATCH_WORKERS) as executor:
        futures = {
            executor.submit(patch_factory, session, fid, payload): fid
            for fid, payload in updates
        }
        for future in as_completed(futures):
            fid, ok, err = future.result()
            done_u += 1
            if ok:
                success += 1
                done_ids.add(fid)
            else:
                errors.append((fid, err))
                if len(errors) <= 3:
                    print(f"  ⚠️  {fid}: {err}")

            if done_u % 500 == 0 or done_u == total_u:
                el  = time.time() - t1
                rps = done_u / el if el > 0 else 0
                eta = (total_u - done_u) / rps if rps > 0 else 0
                print(f"  {done_u/total_u*100:5.1f}% | {done_u:,}/{total_u:,} | "
                      f"{rps:.0f}건/s | 남은 {eta:.0f}s")

    # 완료 ID 저장
    progress["done_ids"] = list(done_ids)
    save_progress(progress)

    elapsed = time.time() - t1
    print(f"\n✅ 완료: {elapsed:.1f}s | 성공 {success:,} | 실패 {len(errors)}")
    if errors:
        print(f"   첫 오류: {errors[0][1]}")
        print("   → 401/403: Supabase Dashboard > Settings > API > service_role key 사용")

    # 전체 완료 시 진행 파일 삭제
    if progress["last_page"] >= total_pages:
        os.remove(PROGRESS_FILE)
        print("   진행 파일 삭제 (전체 수집 완료)")


if __name__ == "__main__":
    main()
