"""
한국산업단지공단 공장등록필지정보 API → factories 테이블 UPDATE
cmpnyNm 필수 파라미터 대응: 초성별 분할 수집 + 중복 제거

수집 필드:
  cmpnyNm  → 회사명 매칭 키
  rnAdres  → address 컬럼
  irsttNm  → summary에 [단지명] 추가

사용법:
  pip install requests
  python collect_kicox_lndpcl.py

진행 상태: lndpcl_progress.json 저장 → 중단 후 재실행 시 이어서 진행
"""

import json, math, os, time, requests
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed

# ── API ───────────────────────────────────────────────────────────────────
# http / https 모두 시도 — 오류 시 아래 주석 교체
API_URL     = "https://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService"
# API_URL   = "http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService"
SERVICE_KEY = "2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7"
NUM_OF_ROWS = 1000
DAILY_LIMIT = 1000
DEBUG       = False   # True 로 바꾸면 첫 응답 500자 출력

# 초성 대표 음절 (ㄱ→가, ㄲ→까, ㄴ→나, ...)  +  숫자  +  영문
# → 전체 한글 회사명은 반드시 이 중 하나를 포함함
# → API가 contains 검색이면 중복 발생 → seen_names로 제거
QUERY_TERMS = [
    '가', '까', '나', '다', '따', '라', '마', '바', '빠',
    '사', '싸', '아', '자', '짜', '차', '카', '타', '파', '하',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
] + [chr(c) for c in range(ord('A'), ord('Z') + 1)]

# ── Supabase ──────────────────────────────────────────────────────────────
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
API_KEY      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
# ⚠️  PATCH 401/403 → Dashboard > Settings > API > service_role key 로 교체
SB_HEADERS = {
    "apikey":        API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}
MAX_PATCH_WORKERS = 20
PROGRESS_FILE     = "lndpcl_progress.json"


# ── 유틸 ─────────────────────────────────────────────────────────────────

def sv(v):
    if v is None:
        return None
    s = str(v).strip()
    return s if s and s.lower() not in ("null", "nan", "") else None


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {
        "done_terms":  [],   # 완료된 쿼리 텀
        "cur_term":    None, # 현재 처리 중인 텀
        "cur_page":    0,    # 현재 텀의 마지막 완료 페이지
        "done_ids":    [],   # DB 업데이트 완료된 factory id
        "seen_names":  [],   # 이미 수집된 회사명 (중복 방지)
        "api_calls":   0,    # 오늘 총 API 호출 수 (한도 추적)
    }


def save_progress(p):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(p, f, ensure_ascii=False, indent=2)


# ── API 호출 (XML 파싱) ───────────────────────────────────────────────────

def fetch_page(session, term, page_no):
    """term으로 검색, page_no 페이지 반환 → (items: list[dict], total: int)"""
    params = {
        "serviceKey": SERVICE_KEY,
        "numOfRows":  NUM_OF_ROWS,
        "pageNo":     page_no,
        "cmpnyNm":    term,
        # resultType 파라미터 제거 → 기본 XML 응답 사용
    }
    resp = session.get(API_URL, params=params, timeout=30)
    resp.raise_for_status()

    raw_text = resp.text.strip()

    if DEBUG or page_no == 1:
        preview = raw_text[:500].replace("\n", " ")
        print(f"    [DEBUG 응답 앞 500자]: {preview}")

    if not raw_text:
        raise ValueError("빈 응답 수신")

    # ── XML 파싱 ──────────────────────────────────────────────────────────
    try:
        root = ET.fromstring(raw_text)
    except ET.ParseError as e:
        raise ValueError(f"XML 파싱 실패: {e}\n응답: {raw_text[:300]}") from e

    # 오류 코드 확인
    code_el = root.find(".//resultCode")
    code    = code_el.text.strip() if code_el is not None else ""
    if code not in ("00", "0000", "000"):
        msg_el = root.find(".//resultMsg")
        msg    = msg_el.text.strip() if msg_el is not None else ""
        raise ValueError(f"API 오류 [{code}] {msg}")

    # totalCount
    tc_el = root.find(".//totalCount")
    total = int(tc_el.text.strip()) if tc_el is not None else 0

    # items → list[dict]
    items = []
    for item_el in root.findall(".//item"):
        d = {child.tag: (child.text or "").strip() for child in item_el}
        if d:
            items.append(d)

    return items, total


# ── Supabase ─────────────────────────────────────────────────────────────

def fetch_all_kicox(session):
    """DB kicox_ 레코드 전체 (id, name, summary, bizrno) 페이지네이션 로딩"""
    records, offset, ps = [], 0, 1000
    while True:
        resp = session.get(
            f"{SUPABASE_URL}/rest/v1/factories",
            headers=SB_HEADERS,
            params={"select": "id,name,summary,bizrno",
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


# ── 메인 ─────────────────────────────────────────────────────────────────

def main():
    progress   = load_progress()
    session    = requests.Session()
    done_ids   = set(progress["done_ids"])
    seen_names = set(progress["seen_names"])  # 이 실행 내 중복 제거용
    api_calls  = progress["api_calls"]
    done_terms = set(progress["done_terms"])

    # ── 1. DB kicox_ 레코드 로딩 ─────────────────────────────────────
    print("\n[1] DB kicox_ 레코드 로딩...")
    try:
        db_rows = fetch_all_kicox(session)
    except Exception as e:
        print(f"❌ DB 로딩 실패: {e}")
        return
    name_map = {r["name"].strip(): r for r in db_rows}
    print(f"    kicox_ 레코드: {len(name_map):,}개")

    # 남은 쿼리 텀 계산
    remaining_terms = [t for t in QUERY_TERMS if t not in done_terms]
    total_terms     = len(QUERY_TERMS)
    print(f"\n    쿼리 텀 전체: {total_terms}개 | 완료: {len(done_terms)}개 | 남은: {len(remaining_terms)}개")
    print(f"    오늘 API 호출: {api_calls}회 / 한도: {DAILY_LIMIT}회")

    if not remaining_terms:
        print("\n✅ 모든 쿼리 텀 완료. 업데이트 단계로 진행합니다.")

    # ── 2. 초성별 분할 수집 ──────────────────────────────────────────
    all_updates = {}   # factory_id → payload (중복 덮어쓰기 무방)
    t0 = time.time()

    for term in remaining_terms:
        if api_calls >= DAILY_LIMIT:
            print(f"\n⚠️  일일 한도({DAILY_LIMIT}회) 도달. 진행 상태 저장.")
            print(f"    완료 텀: {sorted(done_terms)}")
            print(f"    내일 재실행하면 '{term}'부터 이어서 진행됩니다.")
            save_progress({**progress,
                           "done_terms":  list(done_terms),
                           "cur_term":    term,
                           "api_calls":   api_calls,
                           "seen_names":  list(seen_names),
                           "done_ids":    list(done_ids)})
            break

        # 이 텀의 총 페이지 파악 (첫 페이지 호출)
        try:
            items0, total = fetch_page(session, term, 1)
            api_calls += 1
        except Exception as e:
            print(f"  [{term}] 첫 페이지 오류: {e}")
            continue

        if total == 0:
            done_terms.add(term)
            continue

        pages = math.ceil(total / NUM_OF_ROWS)
        # 진행 재개: cur_term이 이 텀이면 cur_page부터 시작
        start_page = 1
        if progress.get("cur_term") == term and progress.get("cur_page", 0) > 0:
            start_page = progress["cur_page"] + 1
            print(f"  [{term}] {total:,}건 ({pages}p) — p{start_page}부터 재개")
        else:
            print(f"  [{term}] {total:,}건 ({pages}p)")

        # 첫 페이지 결과 처리
        if start_page == 1:
            _process_items(items0, name_map, seen_names, done_ids, all_updates, progress)

        # 나머지 페이지
        for page in range(max(2, start_page), pages + 1):
            if api_calls >= DAILY_LIMIT:
                # 한도 도달 — cur_term / cur_page 저장 후 종료
                save_progress({**progress,
                               "done_terms":  list(done_terms),
                               "cur_term":    term,
                               "cur_page":    page - 1,
                               "api_calls":   api_calls,
                               "seen_names":  list(seen_names),
                               "done_ids":    list(done_ids)})
                print(f"\n⚠️  일일 한도 도달 (텀={term}, 페이지={page-1}/{pages}). 내일 이어서 진행.")
                _do_patch(session, all_updates, done_ids)
                return

            for attempt in range(2):
                try:
                    items, _ = fetch_page(session, term, page)
                    api_calls += 1
                    break
                except Exception as e:
                    if attempt == 0:
                        print(f"    p{page} 오류, 재시도: {e}")
                        time.sleep(2)
                    else:
                        print(f"    p{page} 실패, 건너뜀")
                        items = []

            _process_items(items, name_map, seen_names, done_ids, all_updates, progress)

            # 10페이지마다 중간 저장
            if page % 10 == 0:
                save_progress({**progress,
                               "done_terms": list(done_terms),
                               "cur_term":   term,
                               "cur_page":   page,
                               "api_calls":  api_calls,
                               "seen_names": list(seen_names),
                               "done_ids":   list(done_ids)})

            time.sleep(0.05)

        done_terms.add(term)
        progress["cur_page"] = 0

        elapsed = time.time() - t0
        print(f"    → 완료 {len(done_terms)}/{total_terms}텀 | "
              f"API {api_calls}회 | 매칭 {len(all_updates):,}건 | {elapsed:.0f}s")

    # ── 3. 병렬 PATCH ────────────────────────────────────────────────
    _do_patch(session, all_updates, done_ids)

    # 전체 완료 시 진행 파일 삭제
    if done_terms >= set(QUERY_TERMS):
        save_progress({**progress, "done_ids": list(done_ids)})
        os.remove(PROGRESS_FILE)
        print("   진행 파일 삭제 (전체 수집 완료)")
    else:
        save_progress({**progress,
                       "done_terms": list(done_terms),
                       "api_calls":  api_calls,
                       "seen_names": list(seen_names),
                       "done_ids":   list(done_ids)})


def _process_items(items, name_map, seen_names, done_ids, all_updates, progress):
    """items → all_updates 딕셔너리에 추가 (중복 제거)"""
    for item in items:
        name = sv(item.get("cmpnyNm"))
        if not name or name in seen_names:
            continue
        seen_names.add(name)

        rec = name_map.get(name)
        if not rec or rec["id"] in done_ids:
            continue

        payload = {}
        addr = sv(item.get("rnAdres"))
        if addr:
            payload["address"] = addr

        complex_nm = sv(item.get("irsttNm"))
        if complex_nm:
            existing = sv(rec.get("summary")) or ""
            tag = f"[{complex_nm}]"
            if tag not in existing:
                payload["summary"] = (existing + " " + tag).strip() if existing else tag

        # 사업자등록번호 수집
        bizrno = sv(item.get("bizrno"))
        if bizrno:
            payload["bizrno"] = bizrno

        if payload:
            all_updates[rec["id"]] = payload


def _do_patch(session, all_updates, done_ids):
    if not all_updates:
        print("\n⚠️  이번 실행에서 업데이트할 항목 없음.")
        return

    items    = list(all_updates.items())
    total_u  = len(items)
    print(f"\n[3] Supabase PATCH 중 (동시 {MAX_PATCH_WORKERS}개, {total_u:,}건)...")

    success, errors, done_u = 0, [], 0
    t1 = time.time()

    with ThreadPoolExecutor(max_workers=MAX_PATCH_WORKERS) as executor:
        futures = {
            executor.submit(patch_factory, session, fid, payload): fid
            for fid, payload in items
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

    elapsed = time.time() - t1
    print(f"\n✅ PATCH 완료: {elapsed:.1f}s | 성공 {success:,} | 실패 {len(errors)}")
    if errors:
        print(f"   첫 오류: {errors[0][1]}")
        print("   → 401/403: service_role key로 교체 후 재실행")


if __name__ == "__main__":
    main()
