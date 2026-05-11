"""
enrich_dart.py
DART OpenAPI → 재무제표 수집 → factories 테이블 업데이트

흐름:
  1. factories에서 bizrno IS NOT NULL AND dart_corp_code IS NULL 조회
  2. DART corp_code 조회 (사업자번호 → corp_code 매핑)
  3. DART 재무제표 API로 매출액/영업이익/순이익/자산/자본 수집
  4. factories 테이블 PATCH

사용법:
  pip install requests
  py enrich_dart.py

제한:
  - DART는 외감법인(외부감사 대상) 이상만 재무제표 제공
  - 소규모 업체는 corp_code 없음 → 건너뜀
  - 하루 500건 처리 (비용/안정성)
"""

import json, os, time, requests, zipfile, io
from datetime import datetime

# ── 설정 ──────────────────────────────────────────────────────────────────
DART_API_KEY   = "fc85d5b3e93600d415fa6e005057c5b609e874ca"
DART_BASE_URL  = "https://opendart.fss.or.kr/api"
CORP_CODE_FILE = "dart_corp_codes.json"   # 로컬 캐시 파일

SUPABASE_URL   = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
SB_HEADERS     = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

DAILY_LIMIT    = 500
PROGRESS_FILE  = "dart_progress.json"
TARGET_YEAR    = "2024"   # 최신 결산연도


# ── 유틸 ──────────────────────────────────────────────────────────────────
def sv(v):
    if v is None: return None
    s = str(v).strip()
    return s if s and s.lower() not in ("null", "nan", "", "-") else None

def to_int(v):
    try: return int(str(v).replace(",", "").strip())
    except: return None

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {"done_ids": [], "processed": 0}

def save_progress(p):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(p, f, ensure_ascii=False, indent=2)


# ── DART corp_code 전체 다운로드 + 캐시 ──────────────────────────────────
def load_corp_codes():
    """사업자번호 → corp_code 매핑 딕셔너리 반환"""
    if os.path.exists(CORP_CODE_FILE):
        print(f"[DART] 로컬 캐시 로드: {CORP_CODE_FILE}")
        with open(CORP_CODE_FILE, encoding="utf-8") as f:
            return json.load(f)

    print("[DART] corp_code 전체 목록 다운로드 중...")
    resp = requests.get(
        f"{DART_BASE_URL}/corpCode.xml",
        params={"crtfc_key": DART_API_KEY},
        timeout=60
    )
    resp.raise_for_status()

    # ZIP 압축 해제
    with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
        with z.open("CORPCODE.xml") as f:
            content = f.read().decode("utf-8")

    # XML 파싱 (간단하게 직접 처리)
    import xml.etree.ElementTree as ET
    root = ET.fromstring(content)

    mapping = {}  # bizrno → corp_code
    for item in root.findall(".//list"):
        corp_code = (item.findtext("corp_code") or "").strip()
        bizrno    = (item.findtext("bizr_no")   or "").strip().replace("-", "")
        corp_name = (item.findtext("corp_name")  or "").strip()
        if corp_code and bizrno:
            mapping[bizrno] = {"corp_code": corp_code, "corp_name": corp_name}

    with open(CORP_CODE_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False)

    print(f"[DART] {len(mapping):,}개 corp_code 저장 완료")
    return mapping


# ── DART 재무제표 조회 ────────────────────────────────────────────────────
def fetch_financials(corp_code, year=TARGET_YEAR):
    """단일회사 재무제표 조회 → dict 반환"""
    # 손익계산서 (IS)
    resp = requests.get(
        f"{DART_BASE_URL}/fnlttSinglAcntAll.json",
        params={
            "crtfc_key": DART_API_KEY,
            "corp_code": corp_code,
            "bsns_year":  year,
            "reprt_code": "11011",  # 사업보고서
            "fs_div":     "CFS",    # 연결재무제표 (없으면 OFS)
        },
        timeout=15
    )
    data = resp.json() if resp.ok else {}
    items = data.get("list", [])

    # OFS(별도) 폴백
    if not items:
        resp2 = requests.get(
            f"{DART_BASE_URL}/fnlttSinglAcntAll.json",
            params={
                "crtfc_key": DART_API_KEY,
                "corp_code": corp_code,
                "bsns_year":  year,
                "reprt_code": "11011",
                "fs_div":     "OFS",
            },
            timeout=15
        )
        data2 = resp2.json() if resp2.ok else {}
        items = data2.get("list", [])

    if not items:
        return None

    result = {}
    for row in items:
        acnt = row.get("account_nm", "")
        val  = to_int(row.get("thstrm_amount"))  # 당기 금액
        if val is None: continue
        if "매출액" in acnt and "dart_revenue"   not in result: result["dart_revenue"]   = val
        if "영업이익" in acnt and "dart_op_income" not in result: result["dart_op_income"] = val
        if "당기순이익" in acnt and "dart_net_income" not in result: result["dart_net_income"] = val
        if "자산총계" in acnt and "dart_assets"   not in result: result["dart_assets"]   = val
        if "자본총계" in acnt and "dart_equity"   not in result: result["dart_equity"]   = val

    return result if result else None


# ── Supabase ──────────────────────────────────────────────────────────────
def fetch_factories_without_dart(session):
    """검증된 공장만 조회: (bizrno+website+email 모두 있거나 수동승인) + dart 미수집"""
    records, offset, ps = [], 0, 1000

    # ① 자동 검증: bizrno + website + email 모두 있고 dart 미수집
    while True:
        url = (
            f"{SUPABASE_URL}/rest/v1/factories"
            f"?select=id,name,bizrno,website,email,dart_manual_match"
            f"&bizrno=not.is.null&bizrno=neq."
            f"&website=not.is.null&website=neq."
            f"&email=not.is.null&email=neq."
            f"&dart_corp_code=is.null"
            f"&limit={ps}&offset={offset}"
        )
        resp = session.get(url, headers=SB_HEADERS)
        resp.raise_for_status()
        chunk = resp.json()
        if not chunk: break
        records.extend(chunk)
        print(f"  {len(records):,}개 로드...", end="\r")
        if len(chunk) < ps: break
        offset += ps

    # ② 수동 승인된 공장 (MISMATCH였지만 관리자가 승인)
    offset2 = 0
    while True:
        url2 = (
            f"{SUPABASE_URL}/rest/v1/factories"
            f"?select=id,name,bizrno,website,email,dart_manual_match"
            f"&dart_manual_match=eq.true"
            f"&dart_corp_code=eq.MISMATCH"
            f"&limit={ps}&offset={offset2}"
        )
        resp2 = session.get(url2, headers=SB_HEADERS)
        resp2.raise_for_status()
        chunk2 = resp2.json()
        if not chunk2: break
        records.extend(chunk2)
        print(f"  {len(records):,}개 로드 (수동승인 포함)...", end="\r")
        if len(chunk2) < ps: break
        offset2 += ps

    print()
    return records

def patch_factory(session, factory_id, payload):
    resp = session.patch(
        f"{SUPABASE_URL}/rest/v1/factories?id=eq.{factory_id}",
        headers=SB_HEADERS,
        json=payload,
        timeout=10
    )
    return resp.ok


# ── 메인 ──────────────────────────────────────────────────────────────────
def main():
    print("=" * 55)
    print(" DART 재무제표 수집 시작")
    print(f" 대상연도: {TARGET_YEAR}")
    print("=" * 55)

    prog = load_progress()
    done_ids   = set(prog.get("done_ids", []))
    processed  = prog.get("processed", 0)

    # 1. corp_code 매핑 로드
    corp_map = load_corp_codes()
    print(f"[DART] corp_code 매핑: {len(corp_map):,}개")

    session = requests.Session()

    # 2. 대상 공장 조회
    print("[DB] bizrno 있고 dart 미수집 공장 로드 중...")
    factories = fetch_factories_without_dart(session)
    print(f"[DB] 대상: {len(factories):,}개")

    if not factories:
        print("처리할 공장이 없습니다.")
        return

    # 3. 처리
    success = fail_no_corp = fail_no_fin = fail_patch = 0

    for fac in factories:
        if processed >= DAILY_LIMIT:
            print(f"\n⚠️  일일 한도({DAILY_LIMIT}건) 도달. 내일 이어서 실행하세요.")
            break

        fid    = fac["id"]
        name   = fac.get("name", "")
        bizrno = (fac.get("bizrno") or "").replace("-", "").strip()

        if fid in done_ids or not bizrno:
            continue

        # corp_code 매핑
        corp_info = corp_map.get(bizrno)
        if not corp_info:
            # corp_code 없음 → NULL 표시로 스킵 (재시도 방지)
            patch_factory(session, fid, {"dart_corp_code": "NONE"})
            fail_no_corp += 1
            done_ids.add(fid)
            processed += 1
            continue

        # 상호명 일치 검증 (DART corp_name vs DB name)
        corp_name = corp_info.get("corp_name", "")
        db_name   = (name or "").strip()
        name_ok = (
            corp_name == db_name
            or corp_name in db_name
            or db_name in corp_name
        )
        if not name_ok:
            print(f"  ⚠️  상호명 불일치 스킵: DB='{db_name}' / DART='{corp_name}'")
            patch_factory(session, fid, {
                "dart_corp_code":     "MISMATCH",
                "dart_mismatch_name": corp_name,   # DART에서 찾은 회사명 저장
            })
            done_ids.add(fid)
            processed += 1
            continue

        corp_code = corp_info["corp_code"]

        # 재무제표 조회
        fin = fetch_financials(corp_code)
        if not fin:
            patch_factory(session, fid, {
                "dart_corp_code": corp_code,
                "dart_year":      TARGET_YEAR,
                "dart_updated_at": datetime.utcnow().isoformat()
            })
            fail_no_fin += 1
            done_ids.add(fid)
            processed += 1
            time.sleep(0.3)
            continue

        # DB 저장
        payload = {
            "dart_corp_code": corp_code,
            "dart_year":      TARGET_YEAR,
            "dart_updated_at": datetime.utcnow().isoformat(),
            **fin
        }
        ok = patch_factory(session, fid, payload)
        if ok:
            success += 1
            rev = fin.get("dart_revenue", 0)
            print(f"  ✅ [{processed+1}] {name} | 매출 {rev/1e8:.1f}억" if rev else f"  ✅ [{processed+1}] {name}")
        else:
            fail_patch += 1

        done_ids.add(fid)
        processed += 1
        save_progress({"done_ids": list(done_ids), "processed": processed})
        time.sleep(0.3)

    print(f"\n{'='*55}")
    print(f" 완료: 재무수집 {success}건 | corp없음 {fail_no_corp}건 | 재무없음 {fail_no_fin}건 | 오류 {fail_patch}건")
    print(f" 누적 처리: {processed}건")
    print(f"{'='*55}")
    save_progress({"done_ids": list(done_ids), "processed": processed})

if __name__ == "__main__":
    main()
