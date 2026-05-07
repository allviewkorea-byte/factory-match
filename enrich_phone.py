"""
KICOX API → factories.phone 업데이트 파이프라인 (1단계)

사용법:  python enrich_phone.py
진행상황: phone_progress.json (중단 후 재실행 시 이어서 진행)
필요:    pip install requests
"""
import json, time, requests, xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# ── 설정 ─────────────────────────────────────────────────────────────────────
KICOX_KEY   = "2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7"
KICOX_URL   = "https://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService"
NUM_OF_ROWS = 1000

SB_URL      = "https://yezxwlzyiqgewpkkyget.supabase.co"
SB_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
PROGRESS    = Path("phone_progress.json")
MAX_WORKERS = 20

QUERY_TERMS = (
    ['가','까','나','다','따','라','마','바','빠',
     '사','싸','아','자','짜','차','카','타','파','하']
    + [str(d) for d in range(10)]
    + [chr(c) for c in range(ord('A'), ord('Z') + 1)]
)

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
    return {"done_terms": [], "phone_map": {}, "updated": [], "failed": []}

def save_progress(p):
    PROGRESS.write_text(json.dumps(p, ensure_ascii=False, indent=2), "utf-8")


# ── KICOX API ─────────────────────────────────────────────────────────────────
def fetch_kicox_page(session, term, page_no):
    resp = session.get(KICOX_URL, params={
        "serviceKey": KICOX_KEY,
        "numOfRows":  NUM_OF_ROWS,
        "pageNo":     page_no,
        "cmpnyNm":    term,
    }, timeout=30)
    root = ET.fromstring(resp.text.strip())

    rc = root.find(".//resultCode")
    if rc is None or rc.text.strip() not in ("00", "0"):
        return [], 0

    tc    = root.find(".//totalCount")
    total = int(tc.text.strip()) if tc is not None and tc.text else 0

    items = []
    for el in root.findall(".//item"):
        items.append({ch.tag: (ch.text or "").strip() for ch in el})
    return items, total

def collect_term(session, term):
    all_items, page = [], 1
    while True:
        items, total = fetch_kicox_page(session, term, page)
        all_items.extend(items)
        if not items or len(all_items) >= total:
            break
        page += 1
        time.sleep(0.2)
    return all_items


# ── Supabase ──────────────────────────────────────────────────────────────────
def fetch_factories(session):
    """kicox_ 레코드 전체 로딩 (enriched_score 계산에 필요한 필드 포함)"""
    records, offset = [], 0
    while True:
        resp = session.get(f"{SB_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params={
                "select": "id,name,address,employees,founded,summary,website,industries",
                "id":     "like.kicox_%",
                "limit":  1000,
                "offset": offset,
            })
        chunk = resp.json()
        if not chunk:
            break
        records.extend(chunk)
        print(f"    {len(records):,}개 로드 중...", end="\r")
        if len(chunk) < 1000:
            break
        offset += 1000
    print()
    return records

def calc_score(row):
    """enriched_score 계산 (최대 100점)"""
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

def patch_factory(session, factory_id, payload):
    resp = session.patch(
        f"{SB_URL}/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": f"eq.{factory_id}"},
        json=payload,
        timeout=15,
    )
    return resp.status_code in (200, 204)


# ── 메인 ──────────────────────────────────────────────────────────────────────
def main():
    p       = load_progress()
    session = requests.Session()

    # 1. Supabase 로딩
    print("[1] Supabase kicox_ 레코드 로딩...")
    factories   = fetch_factories(session)
    name_to_row = {r["name"].strip(): r for r in factories}
    print(f"    {len(name_to_row):,}개")

    # 2. KICOX API 수집
    print("\n[2] KICOX API 전화번호 수집...")
    for term in QUERY_TERMS:
        if term in p["done_terms"]:
            continue
        items = collect_term(session, term)
        for item in items:
            name  = item.get("cmpnyNm", "").strip()
            phone = item.get("cmpnyTelno", "").strip()
            if name and phone:
                p["phone_map"][name] = phone
        p["done_terms"].append(term)
        save_progress(p)
        print(f"  [{term}] {len(items):,}건 | 누적 {len(p['phone_map']):,}개")
        time.sleep(0.3)

    # 3. 업데이트 목록 생성
    print("\n[3] 업데이트 대상 생성...")
    update_list = []
    for name, phone in p["phone_map"].items():
        row = name_to_row.get(name)
        if not row or row["id"] in p["updated"]:
            continue
        payload = {
            "phone":          phone,
            "enriched_score": calc_score({**row, "phone": phone}),
        }
        update_list.append((row["id"], payload))
    print(f"    업데이트 대상: {len(update_list):,}개")

    if not update_list:
        print("✅ 업데이트할 항목이 없습니다.")
        return

    # 4. 병렬 PATCH
    print(f"\n[4] DB 업데이트 (병렬 {MAX_WORKERS}개)...")
    total, success = len(update_list), 0
    t0             = time.time()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {
            ex.submit(patch_factory, session, fid, payload): fid
            for fid, payload in update_list
        }
        for i, fut in enumerate(as_completed(futures), 1):
            fid = futures[fut]
            if fut.result():
                success += 1
                p["updated"].append(fid)
            else:
                p["failed"].append(fid)
            if i % 500 == 0 or i == total:
                save_progress(p)
                rps = i / (time.time() - t0)
                print(f"  {i:,}/{total:,} | {rps:.0f}건/s | 성공 {success:,}")

    save_progress(p)
    print(f"\n✅ 완료: 성공 {success:,}개 / 실패 {len(p['failed']):,}개")


if __name__ == "__main__":
    main()
