"""
실행 방법:
  pip install psycopg2-binary pandas
  python upload_kicox_pg.py

CSV 파일: kicox_factories.csv (같은 폴더에 위치)
"""

import pandas as pd
import psycopg2
import psycopg2.extras
import json
import time

DB = dict(
    host="db.yezxwlzyiqgewpkkyget.supabase.co",
    port=5432,
    database="postgres",
    user="postgres",
    password="##Wwnanami2407",
)

CSV_PATH = "kicox_factories.csv"
BATCH_SIZE = 1000


def to_json_array(val):
    """문자열 값을 JSON 배열로 변환. 빈 값이면 []."""
    if not val or (isinstance(val, float) and pd.isna(val)):
        return "[]"
    s = str(val).strip()
    if not s:
        return "[]"
    return json.dumps([s], ensure_ascii=False)


def main():
    print("CSV 로딩...")
    df = pd.read_csv(CSV_PATH)
    print(f"총 {len(df):,}개 로드")

    conn = psycopg2.connect(**DB)
    conn.autocommit = False
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM factories")
    before = cur.fetchone()[0]
    print(f"업로드 전 factories 수: {before:,}개\n")

    INSERT_SQL = """
    INSERT INTO factories (
        id, name, en, city, region, coord_x, coord_y,
        industries, processes, products, materials,
        moq, moq_unit, lead_days, price_range,
        employees, founded, certs,
        oem, odm, export,
        rating, reviews, response_hr, deals,
        hidden, summary, image
    ) VALUES %s
    ON CONFLICT (id) DO NOTHING
    """

    rows = df.to_dict("records")
    total = len(rows)
    total_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
    success = 0
    t0 = time.time()

    print(f"업로드 시작: {total_batches}배치 × {BATCH_SIZE}개")

    for b in range(total_batches):
        chunk = rows[b * BATCH_SIZE : (b + 1) * BATCH_SIZE]

        values = []
        for r in chunk:
            def g(col, default=None):
                v = r.get(col)
                if v is None or (isinstance(v, float) and pd.isna(v)):
                    return default
                return v

            values.append((
                str(g("id", "")),
                str(g("name", "")),
                "",                         # en
                str(g("city", "")),
                str(g("region", "")),
                None,                       # coord_x
                None,                       # coord_y
                to_json_array(g("industries")),
                "[]",                       # processes
                str(g("products", "")),
                "[]",                       # materials
                None,                       # moq
                "",                         # moq_unit
                None,                       # lead_days
                "",                         # price_range
                None,                       # employees
                None,                       # founded
                "[]",                       # certs
                False,                      # oem
                False,                      # odm
                False,                      # export
                None,                       # rating
                None,                       # reviews
                None,                       # response_hr
                None,                       # deals
                False,                      # hidden
                str(g("summary", "")),
                "",                         # image
            ))

        psycopg2.extras.execute_values(cur, INSERT_SQL, values, page_size=BATCH_SIZE)
        conn.commit()
        success += 1

        if (b + 1) % 50 == 0 or (b + 1) == total_batches:
            elapsed = time.time() - t0
            pct = (b + 1) / total_batches * 100
            eta = elapsed / (b + 1) * (total_batches - b - 1)
            print(f"  {pct:.1f}% | {b+1}/{total_batches}배치 | 경과 {elapsed:.0f}s | 남은 {eta:.0f}s")

    cur.execute("SELECT COUNT(*) FROM factories")
    after = cur.fetchone()[0]
    conn.close()

    elapsed = time.time() - t0
    print(f"\n완료: {elapsed:.1f}s")
    print(f"업로드 전: {before:,}개")
    print(f"업로드 후: {after:,}개")
    print(f"추가된 수: {after - before:,}개")


if __name__ == "__main__":
    main()
