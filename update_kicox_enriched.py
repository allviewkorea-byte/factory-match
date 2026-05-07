"""
KICOX CSV → Supabase REST API로 factories 테이블 UPDATE

사용법:
  pip install requests pandas
  python update_kicox_enriched.py <CSV경로>

CSV 컬럼: 순번, 회사명, 단지명, 생산품, 공장주소

주의: anon key로 UPDATE가 막히면 Supabase Dashboard > Settings > API >
      service_role key를 API_KEY에 넣고 재실행하세요.
"""

import sys
import math
import time
import pandas as pd
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"

BASE_HEADERS = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

PAGE_SIZE  = 1000   # Supabase 기본 페이지 크기
MAX_WORKERS = 20    # 동시 PATCH 요청 수


def fetch_all_kicox(session):
    """DB의 모든 kicox_ 레코드 (id, name) 페이지네이션으로 가져오기"""
    records = []
    offset = 0
    while True:
        resp = session.get(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=BASE_HEADERS,
            params={
                "select": "id,name",
                "id":     "like.kicox_%",
                "limit":  PAGE_SIZE,
                "offset": offset,
            },
        )
        resp.raise_for_status()
        chunk = resp.json()
        if not chunk:
            break
        records.extend(chunk)
        print(f"    {len(records):,}개 로드 중...", end="\r")
        if len(chunk) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    print()
    return records


def patch_one(session, factory_id, payload):
    """단일 레코드 PATCH. (factory_id, 성공여부, 에러메시지) 반환"""
    try:
        resp = session.patch(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=BASE_HEADERS,
            params={"id": f"eq.{factory_id}"},
            json=payload,
            timeout=15,
        )
        if resp.status_code in (200, 204):
            return factory_id, True, None
        return factory_id, False, f"{resp.status_code} {resp.text[:120]}"
    except Exception as e:
        return factory_id, False, str(e)


def str_val(v):
    """NaN/None/빈값 → None, 나머지 → strip된 문자열"""
    if v is None:
        return None
    if isinstance(v, float) and math.isnan(v):
        return None
    s = str(v).strip()
    return s if s and s.lower() != "nan" else None


def main():
    if len(sys.argv) < 2:
        print("사용법: python update_kicox_enriched.py <CSV경로>")
        sys.exit(1)

    csv_path = sys.argv[1]

    # ── 1. CSV 로딩 ──────────────────────────────────────────
    print(f"\n[1] CSV 로딩: {csv_path}")
    try:
        df = pd.read_csv(csv_path, encoding="utf-8", low_memory=False)
    except UnicodeDecodeError:
        df = pd.read_csv(csv_path, encoding="cp949", low_memory=False)
    print(f"    총 {len(df):,}행 로드")
    print(f"    컬럼: {list(df.columns)}")

    # ── 2. 컬럼 매핑 ─────────────────────────────────────────
    cols = list(df.columns)
    def find_col(*keywords):
        for kw in keywords:
            for c in cols:
                if kw in c:
                    return c
        return None

    col_name    = find_col("회사명", "업체명", "공장명")
    col_addr    = find_col("공장주소", "주소")
    col_prod    = find_col("생산품", "제품")
    col_complex = find_col("단지명", "단지")

    print(f"\n    회사명  → '{col_name}'")
    print(f"    주소    → '{col_addr}'")
    print(f"    생산품  → '{col_prod}'")
    print(f"    단지명  → '{col_complex}'")

    if not col_name:
        print("\n❌ 회사명 컬럼을 찾을 수 없습니다.")
        sys.exit(1)

    # ── 3. DB에서 kicox_ 레코드 가져오기 ─────────────────────
    print("\n[2] DB에서 kicox_ 레코드 로딩...")
    session = requests.Session()
    try:
        db_records = fetch_all_kicox(session)
    except requests.HTTPError as e:
        print(f"❌ DB 조회 실패: {e}")
        sys.exit(1)

    name_to_id = {r["name"].strip(): r["id"] for r in db_records}
    print(f"    DB 내 kicox_ 레코드: {len(name_to_id):,}개")

    # ── 4. CSV 매칭 및 페이로드 생성 ─────────────────────────
    print("\n[3] CSV 매칭 중...")
    update_list = []   # [(factory_id, payload), ...]
    skipped = 0

    for _, row in df.iterrows():
        name = str_val(row.get(col_name))
        if not name:
            skipped += 1
            continue

        factory_id = name_to_id.get(name)
        if not factory_id:
            skipped += 1
            continue

        payload = {}

        # 주소
        addr = str_val(row.get(col_addr)) if col_addr else None
        if addr:
            payload["address"] = addr

        # summary: 생산품 제조 [단지명]
        parts = []
        prod = str_val(row.get(col_prod)) if col_prod else None
        if prod:
            parts.append(prod + " 제조")
        comp = str_val(row.get(col_complex)) if col_complex else None
        if comp:
            parts.append(f"[{comp}]")
        if parts:
            payload["summary"] = " ".join(parts)

        if payload:
            update_list.append((factory_id, payload))
        else:
            skipped += 1

    print(f"    업데이트 대상: {len(update_list):,}개")
    print(f"    건너뜀 (미매칭 / 빈값): {skipped:,}개")

    if not update_list:
        print("\n⚠️  업데이트할 항목이 없습니다.")
        return

    # ── 5. 병렬 PATCH ────────────────────────────────────────
    print(f"\n[4] DB 업데이트 중 (동시 요청: {MAX_WORKERS}개)...")
    total   = len(update_list)
    success = 0
    errors  = []
    t0      = time.time()
    done    = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(patch_one, session, fid, payload): fid
            for fid, payload in update_list
        }
        for future in as_completed(futures):
            fid, ok, err = future.result()
            done += 1
            if ok:
                success += 1
            else:
                errors.append((fid, err))
                if len(errors) <= 3:
                    print(f"\n  ⚠️  {fid}: {err}")

            if done % 500 == 0 or done == total:
                elapsed = time.time() - t0
                pct     = done / total * 100
                rps     = done / elapsed if elapsed > 0 else 0
                eta     = (total - done) / rps if rps > 0 else 0
                print(f"  {pct:5.1f}% | {done:,}/{total:,} | {rps:.0f}건/s | 남은 {eta:.0f}s")

    elapsed = time.time() - t0
    print(f"\n✅ 완료: {elapsed:.1f}s")
    print(f"   성공: {success:,}개")
    if errors:
        print(f"   실패: {len(errors):,}개 (첫 번째: {errors[0][1]})")
        print("   → 401/403 오류면 service_role key로 교체 후 재실행하세요.")


if __name__ == "__main__":
    main()
