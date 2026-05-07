"""
KICOX 원본 데이터로 기존 factories 테이블 UPDATE

사용법:
  pip install psycopg2-binary pandas
  python update_kicox_enriched.py <원본CSV경로>

원본 CSV: data.go.kr/data/15105482 에서 다운로드한 파일
  예) python update_kicox_enriched.py 전국등록공장현황_20241231.csv

동작:
  - 회사명(name)으로 기존 DB 레코드 매칭
  - coord_x(위도), coord_y(경도), address, employees, founded 업데이트
  - summary에 산업단지명 포함
  - 매칭 안 된 행은 건너뜀
"""

import sys
import re
import pandas as pd
import psycopg2
import psycopg2.extras
import time

DB = dict(
    host="db.yezxwlzyiqgewpkkyget.supabase.co",
    port=5432,
    database="postgres",
    user="postgres",
    password="##Wwnanami2407",
)

# ──────────────────────────────────────────
# 컬럼명 후보 매핑 (data.go.kr CSV 컬럼명 변형 대응)
# ──────────────────────────────────────────
COL_CANDIDATES = {
    "name":      ["업체명", "공장명", "사업체명", "회사명", "업체 명", "법인명"],
    "address":   ["도로명주소", "주소(도로명)", "도로명 주소", "도로명_주소", "소재지도로명주소", "소재지(도로명)"],
    "address2":  ["지번주소", "주소(지번)", "지번 주소", "소재지지번주소", "소재지(지번)"],
    "lat":       ["위도", "위도_좌표", "위도좌표", "lat", "latitude", "y좌표", "Y좌표"],
    "lng":       ["경도", "경도_좌표", "경도좌표", "lng", "longitude", "x좌표", "X좌표"],
    "products":  ["주요생산품", "주요제품", "생산품", "제품", "생산품명", "주생산품", "주요 생산품"],
    "industry":  ["업종명", "업종", "한국표준산업분류명", "표준산업분류명", "업태", "업종코드명"],
    "employees": ["종업원수", "임직원수", "직원수", "종사자수", "근로자수", "종업원 수"],
    "founded":   ["공장등록일", "등록일", "등록일자", "사업개시일", "창업일", "설립일", "공장 등록일"],
    "complex":   ["산업단지명", "단지명", "단지 명", "공장소재지단지명", "소재단지명"],
    "area":      ["용지면적", "공장부지면적", "대지면적", "부지면적"],
}


def detect_col(df_cols, candidates):
    """DataFrame 컬럼 목록에서 후보 중 첫 번째 일치 반환"""
    cols_lower = {c.strip(): c for c in df_cols}
    for cand in candidates:
        if cand in cols_lower:
            return cols_lower[cand]
        # 공백 제거 후 비교
        cand_clean = re.sub(r"\s+", "", cand)
        for orig, raw in cols_lower.items():
            if re.sub(r"\s+", "", orig) == cand_clean:
                return raw
    return None


def lat_lng_to_svg(lat, lng):
    """
    실제 위경도 → SVG 0-100 좌표 변환 (한국 범위 기준)
    lat: 33.0(제주 남단) ~ 38.6(북방한계선 근처)
    lng: 124.0(서해) ~ 130.5(동해)
    """
    x = (lng - 124.0) / (130.5 - 124.0) * 100
    y = (38.6 - lat) / (38.6 - 33.0) * 100
    x = max(0.0, min(100.0, round(x, 2)))
    y = max(0.0, min(100.0, round(y, 2)))
    return x, y


def parse_year(val):
    """날짜 문자열에서 연도 추출. 예: '2005-03-21', '20050321', '2005년 3월' → 2005"""
    if not val or (isinstance(val, float) and pd.isna(val)):
        return None
    s = str(val).strip()
    m = re.search(r"(\d{4})", s)
    return int(m.group(1)) if m else None


def parse_employees(val):
    """종업원수를 정수로 변환"""
    if not val or (isinstance(val, float) and pd.isna(val)):
        return None
    try:
        return int(str(val).replace(",", "").strip())
    except ValueError:
        return None


def main():
    if len(sys.argv) < 2:
        print("사용법: python update_kicox_enriched.py <원본CSV경로>")
        print("예)    python update_kicox_enriched.py 전국등록공장현황_20241231.csv")
        sys.exit(1)

    csv_path = sys.argv[1]

    # ── 1. CSV 로딩 ──────────────────────────────────────────
    print(f"\n[1] CSV 로딩: {csv_path}")
    try:
        df = pd.read_csv(csv_path, encoding="utf-8", low_memory=False)
    except UnicodeDecodeError:
        df = pd.read_csv(csv_path, encoding="cp949", low_memory=False)
    print(f"    총 {len(df):,}행 로드")

    # ── 2. 컬럼 감지 ─────────────────────────────────────────
    print("\n[2] 컬럼 감지 결과:")
    detected = {}
    for key, candidates in COL_CANDIDATES.items():
        col = detect_col(df.columns, candidates)
        detected[key] = col
        status = f"✅ '{col}'" if col else "❌ 없음"
        print(f"    {key:12s} → {status}")

    print(f"\n    전체 컬럼 목록 ({len(df.columns)}개):")
    for c in df.columns:
        print(f"      - {c}")

    name_col = detected["name"]
    if not name_col:
        print("\n❌ 회사명 컬럼을 찾을 수 없습니다. 스크립트를 종료합니다.")
        print("   COL_CANDIDATES['name'] 목록에 실제 컬럼명을 추가하세요.")
        sys.exit(1)

    lat_col  = detected["lat"]
    lng_col  = detected["lng"]
    addr_col = detected["address"] or detected["address2"]

    print(f"\n    매칭 기준 컬럼: '{name_col}'")
    print(f"    위도: {lat_col or '없음'}, 경도: {lng_col or '없음'}")
    print(f"    주소: {addr_col or '없음'}")

    # ── 3. DB 연결 ───────────────────────────────────────────
    print("\n[3] DB 연결 중...")
    conn = psycopg2.connect(**DB)
    conn.autocommit = False
    cur = conn.cursor()

    # 기존 레코드: name → id 매핑
    cur.execute("SELECT id, name FROM factories WHERE id LIKE 'kicox_%'")
    db_rows = cur.fetchall()
    name_to_id = {row[1].strip(): row[0] for row in db_rows}
    print(f"    DB 내 kicox_ 레코드: {len(name_to_id):,}개")

    # ── 4. 업데이트 준비 ─────────────────────────────────────
    print("\n[4] 업데이트 데이터 준비 중...")
    update_rows = []
    skipped = 0

    for _, row in df.iterrows():
        name = str(row[name_col]).strip() if name_col else ""
        if not name or name == "nan":
            skipped += 1
            continue

        factory_id = name_to_id.get(name)
        if not factory_id:
            skipped += 1
            continue

        # 위도/경도 → SVG 좌표 변환
        coord_x = coord_y = None
        if lat_col and lng_col:
            try:
                lat = float(row[lat_col])
                lng = float(row[lng_col])
                if 33.0 <= lat <= 39.0 and 124.0 <= lng <= 132.0:
                    coord_x, coord_y = lat_lng_to_svg(lat, lng)
            except (ValueError, TypeError):
                pass

        # 주소
        address = ""
        if addr_col:
            v = row.get(addr_col, "")
            address = "" if (not v or (isinstance(v, float) and pd.isna(v))) else str(v).strip()

        # 종업원수
        employees = parse_employees(row.get(detected["employees"])) if detected["employees"] else None

        # 설립연도
        founded = parse_year(row.get(detected["founded"])) if detected["founded"] else None

        # summary: 산업단지명 포함
        complex_name = ""
        if detected["complex"]:
            v = row.get(detected["complex"], "")
            complex_name = "" if (not v or (isinstance(v, float) and pd.isna(v))) else str(v).strip()

        # 주요생산품
        products_raw = ""
        if detected["products"]:
            v = row.get(detected["products"], "")
            products_raw = "" if (not v or (isinstance(v, float) and pd.isna(v))) else str(v).strip()

        summary_parts = []
        if products_raw:
            summary_parts.append(products_raw + " 제조")
        if complex_name:
            summary_parts.append(f"[{complex_name}]")
        summary = " ".join(summary_parts) if summary_parts else None

        update_rows.append({
            "id":        factory_id,
            "coord_x":   coord_x,
            "coord_y":   coord_y,
            "address":   address,
            "employees": employees,
            "founded":   founded,
            "summary":   summary,
        })

    print(f"    업데이트 대상: {len(update_rows):,}개")
    print(f"    매칭 실패 / 건너뜀: {skipped:,}개")

    if not update_rows:
        print("\n⚠️  업데이트할 항목이 없습니다.")
        conn.close()
        return

    # ── 5. 일괄 UPDATE ───────────────────────────────────────
    print("\n[5] DB 업데이트 중...")
    BATCH = 1000
    total = len(update_rows)
    total_batches = (total + BATCH - 1) // BATCH
    updated = 0
    t0 = time.time()

    for b in range(total_batches):
        chunk = update_rows[b * BATCH:(b + 1) * BATCH]

        for r in chunk:
            fields = []
            vals   = []

            if r["coord_x"] is not None:
                fields.append("coord_x = %s"); vals.append(r["coord_x"])
                fields.append("coord_y = %s"); vals.append(r["coord_y"])
            if r["address"]:
                fields.append("address = %s"); vals.append(r["address"])
            if r["employees"] is not None:
                fields.append("employees = %s"); vals.append(r["employees"])
            if r["founded"] is not None:
                fields.append("founded = %s"); vals.append(r["founded"])
            if r["summary"]:
                fields.append("summary = %s"); vals.append(r["summary"])

            if not fields:
                continue

            sql = f"UPDATE factories SET {', '.join(fields)} WHERE id = %s"
            vals.append(r["id"])
            cur.execute(sql, vals)

        conn.commit()
        updated += len(chunk)

        if (b + 1) % 10 == 0 or (b + 1) == total_batches:
            elapsed = time.time() - t0
            pct = (b + 1) / total_batches * 100
            eta = elapsed / (b + 1) * (total_batches - b - 1)
            print(f"  {pct:.1f}% | {b+1}/{total_batches}배치 | 경과 {elapsed:.0f}s | 남은 {eta:.0f}s")

    # ── 6. 결과 확인 ─────────────────────────────────────────
    cur.execute("SELECT COUNT(*) FROM factories WHERE coord_x IS NOT NULL AND id LIKE 'kicox_%'")
    with_coord = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM factories WHERE address != '' AND id LIKE 'kicox_%'")
    with_addr = cur.fetchone()[0]
    conn.close()

    elapsed = time.time() - t0
    print(f"\n✅ 완료: {elapsed:.1f}s")
    print(f"   업데이트 처리: {updated:,}개")
    print(f"   좌표 있는 kicox 공장: {with_coord:,}개")
    print(f"   주소 있는 kicox 공장: {with_addr:,}개")


if __name__ == "__main__":
    main()
