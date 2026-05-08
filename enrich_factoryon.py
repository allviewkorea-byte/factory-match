"""
enrich_factoryon.py
공장설립 온라인지원시스템 API로 공장 정보 보강 → Supabase UPDATE

사용법:
  pip install requests
  python enrich_factoryon.py

동작:
  1. Supabase factories 테이블에서 대상 컬럼이 NULL인 공장 조회 (ID 커서, 1,000개씩)
  2. 공장명으로 공장설립 API 호출 (cmpnyNm 파라미터)
  3. 응답에서 아래 필드 추출 후 NULL인 컬럼만 UPDATE:
       rnAdres       → address
       cmpnyTelno    → phone
       rprsntvNm     → representative    (컬럼 없으면 자동 스킵)
       irsttNm       → industrial_complex (컬럼 없으면 자동 스킵)
  4. 하루 한도 1,000건 도달 시 자동 중단
  5. 진행상황 factoryon_progress.json에 100건마다 저장

API 한도: 1,000건/일
실패(네트워크 오류) 시 1회 재시도, 결과 없으면 NULL 유지
"""

import sys
print("Python " + sys.version)
print("시작...")

import json
import time
import random
from typing import Optional, List, Tuple

import requests

# ── 공장설립 API 설정 ─────────────────────────────────────
API_URL         = "http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService"
API_SERVICE_KEY = "2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7"
DAILY_API_LIMIT = 1_000

# ── Supabase 설정 ─────────────────────────────────────────
SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30"
    ".8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
)
SB_HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── 기타 설정 ─────────────────────────────────────────────
PROGRESS_FILE  = "factoryon_progress.json"
FETCH_PAGESIZE = 1_000
DELAY_MIN      = 0.5
DELAY_MAX      = 1.0

# (API 응답 필드, Supabase 컬럼, 필수여부)
# 필수=False 컬럼은 테이블에 없으면 스킵
FIELD_MAP = [
    ("rnAdres",    "address",            True),
    ("cmpnyTelno", "phone",              True),
    ("rprsntvNm",  "representative",     False),
    ("irsttNm",    "industrial_complex", False),
]  # type: List[Tuple[str, str, bool]]


# ─────────────────────────────────────────────────────────
# 컬럼 존재 여부 확인
# ─────────────────────────────────────────────────────────

def check_column_exists(col):
    # type: (str) -> bool
    """Supabase factories 테이블에 해당 컬럼이 존재하는지 확인"""
    try:
        r = requests.get(
            SUPABASE_URL + "/rest/v1/factories",
            headers=SB_HEADERS,
            params={"select": col, "limit": "1"},
            timeout=10,
        )
        return r.status_code == 200
    except Exception:
        return False


# ─────────────────────────────────────────────────────────
# Supabase 헬퍼
# ─────────────────────────────────────────────────────────

def sb_fetch_batch(last_id, select_cols, active_sb_cols):
    # type: (Optional[str], List[str], List[str]) -> list
    """
    active_sb_cols 중 하나라도 NULL인 공장 조회 (ID 커서 페이지네이션).
    last_id=None 이면 처음부터 조회.
    """
    or_filter = "(" + ",".join(c + ".is.null" for c in active_sb_cols) + ")"
    params = {
        "select": ",".join(select_cols),
        "or":     or_filter,
        "order":  "id.asc",
        "limit":  str(FETCH_PAGESIZE),
    }
    if last_id is not None:
        params["id"] = "gt." + str(last_id)
    r = requests.get(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params=params,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def sb_update_fields(factory_id, updates):
    # type: (str, dict) -> None
    """factories 테이블 PATCH — updates 딕셔너리의 컬럼만 갱신."""
    if not updates:
        return
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/factories",
        headers=SB_HEADERS,
        params={"id": "eq." + str(factory_id)},
        json=updates,
        timeout=30,
    )
    r.raise_for_status()


# ─────────────────────────────────────────────────────────
# 공장설립 API 호출
# ─────────────────────────────────────────────────────────

def _api_call(company_name):
    # type: (str) -> Tuple[list, bool]
    """
    공장설립 API 단일 호출.
    반환: (items 리스트, 오류여부)
    """
    try:
        r = requests.get(
            API_URL,
            params={
                "serviceKey": API_SERVICE_KEY,
                "cmpnyNm":    company_name,
                "pageNo":     "1",
                "numOfRows":  "5",
                "type":       "json",
            },
            timeout=15,
        )
        if r.status_code != 200:
            return [], True

        data = r.json()

        # 결과코드 확인
        result_code = (
            data.get("response", {})
                .get("header", {})
                .get("resultCode", "")
        )
        if result_code not in ("00", "000", ""):
            return [], False  # 정상 응답이나 결과 없음

        items = (
            data.get("response", {})
                .get("body", {})
                .get("items", {})
                .get("item", [])
        )
        # 단일 결과는 dict로 반환되는 경우 처리
        if isinstance(items, dict):
            items = [items]
        return (items if isinstance(items, list) else []), False

    except Exception:
        return [], True  # 네트워크/파싱 오류


def _api_call_with_retry(company_name):
    # type: (str) -> Tuple[list, bool]
    """_api_call 래퍼 — 오류 시 1회 재시도 (2초 대기)"""
    items, error = _api_call(company_name)
    if error:
        time.sleep(2)
        items, error = _api_call(company_name)
    return items, error


def find_factory_info(name):
    # type: (str) -> Tuple[dict, bool]
    """
    API에서 공장 정보 조회.
    반환: ({api_field: value}, 오류여부)
    """
    items, error = _api_call_with_retry(name)
    if error:
        return {}, True
    if not items:
        return {}, False

    # 첫 번째 결과 사용
    item = items[0]
    result = {}
    for api_field, _, _ in FIELD_MAP:
        value = str(item.get(api_field) or "").strip()
        if value:
            result[api_field] = value
    return result, False


# ─────────────────────────────────────────────────────────
# 진행 상황 저장 / 불러오기
# ─────────────────────────────────────────────────────────

def load_progress():
    # type: () -> dict
    try:
        with open(PROGRESS_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (IOError, ValueError):
        return {
            "processed": 0,
            "updated":   0,
            "not_found": 0,
            "api_error": 0,
            "api_calls": 0,
            "last_id":   None,
        }


def save_progress(prog):
    # type: (dict) -> None
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────────────────

def main():
    # 1. 컬럼 존재 여부 확인
    print("컬럼 존재 여부 확인 중...")
    active_fields = []  # type: List[Tuple[str, str]]  # (api_field, sb_col)
    for api_field, sb_col, required in FIELD_MAP:
        exists = check_column_exists(sb_col)
        if exists:
            active_fields.append((api_field, sb_col))
            print("  [O] {0} 컬럼 확인됨".format(sb_col))
        else:
            tag = "(필수)" if required else "(선택)"
            print("  [X] {0} 컬럼 없음 {1} -- 스킵".format(sb_col, tag))

    if not active_fields:
        print("[오류] 업데이트할 컬럼이 없습니다.")
        return

    active_sb_cols = [sb_col for _, sb_col in active_fields]
    select_cols    = ["id", "name"] + active_sb_cols

    # 2. 진행상황 로드
    prog = load_progress()
    total_processed = prog.get("processed", 0)
    total_updated   = prog.get("updated",   0)
    total_not_found = prog.get("not_found", 0)
    total_api_error = prog.get("api_error", 0)
    total_api_calls = prog.get("api_calls", 0)
    last_id         = prog.get("last_id",   None)

    print("")
    print("=" * 55)
    print("  공장설립 API 정보 보강 (enrich_factoryon.py)")
    print("=" * 55)
    print("  이전 누적 처리: {0:,}건 | 업데이트: {1:,}건".format(
        total_processed, total_updated))
    print("  이전 누적 API 호출: {0:,}건".format(total_api_calls))
    print("  금일 API 한도: {0:,}건".format(DAILY_API_LIMIT))
    if last_id is not None:
        print("  커서 재개 위치: id > {0}".format(last_id))
    print("")

    today_api_calls = 0
    quota_exceeded  = False

    while today_api_calls < DAILY_API_LIMIT and not quota_exceeded:
        try:
            batch = sb_fetch_batch(last_id, select_cols, active_sb_cols)
        except Exception as e:
            print("[오류] Supabase 조회 실패: {0}".format(e))
            break

        if not batch:
            print("처리할 공장이 더 없습니다. 모두 완료!")
            break

        for factory in batch:
            if today_api_calls >= DAILY_API_LIMIT:
                print("\n금일 API 한도 {0:,}건 도달. 내일 재실행하세요.".format(
                    DAILY_API_LIMIT))
                quota_exceeded = True
                break

            fid     = factory.get("id", "")
            name    = (factory.get("name") or "").strip()
            last_id = fid

            if not name:
                total_not_found += 1
                total_processed += 1
                continue

            # API 호출
            api_info, api_err = find_factory_info(name)
            today_api_calls += 1
            total_api_calls += 1

            if api_err:
                total_api_error += 1
                status = "E  API 오류 (재시도 후 실패)"
                total_processed += 1
                last_id = fid
                time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))
                continue

            # NULL인 컬럼만 업데이트 딕셔너리 구성
            updates = {}
            for api_field, sb_col in active_fields:
                if factory.get(sb_col) is None and api_field in api_info:
                    updates[sb_col] = api_info[api_field]

            if updates:
                try:
                    sb_update_fields(fid, updates)
                    total_updated += 1
                    fields_str = ", ".join(
                        "{0}={1}".format(k, v[:15]) for k, v in updates.items()
                    )
                    status = "O  " + fields_str
                except Exception as e:
                    status = "X  DB 오류: " + str(e)
            elif api_info:
                status = "~  이미 채워짐"
            else:
                total_not_found += 1
                status = "-  결과 없음"

            total_processed += 1
            print("  [{0:>6}] {1:<28}  ->  {2}".format(
                total_processed, name[:28], status))

            if total_processed % 100 == 0:
                prog.update({
                    "processed": total_processed,
                    "updated":   total_updated,
                    "not_found": total_not_found,
                    "api_error": total_api_error,
                    "api_calls": total_api_calls,
                    "last_id":   last_id,
                })
                save_progress(prog)
                print(
                    "\n  -- 중간 저장 [{0:,}건] 업데이트: {1:,} | "
                    "금일 API: {2:,}/{3:,} --\n".format(
                        total_processed, total_updated,
                        today_api_calls, DAILY_API_LIMIT)
                )

            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

    # 최종 저장
    prog.update({
        "processed": total_processed,
        "updated":   total_updated,
        "not_found": total_not_found,
        "api_error": total_api_error,
        "api_calls": total_api_calls,
        "last_id":   last_id,
    })
    save_progress(prog)

    success_rate = (total_updated / total_processed * 100) if total_processed else 0.0
    print("\n" + "=" * 55)
    print("  완료 요약")
    print("=" * 55)
    print("  금일 처리 건수    : {0:,}건".format(total_processed))
    print("  금일 API 호출     : {0:,}건".format(today_api_calls))
    print("  정보 업데이트     : {0:,}건 ({1:.1f}%)".format(
        total_updated, success_rate))
    print("  결과 없음         : {0:,}건".format(total_not_found))
    print("  API 오류          : {0:,}건".format(total_api_error))
    print("  진행 저장 위치    : {0}".format(PROGRESS_FILE))
    print("=" * 55)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print("\n[오류 발생]")
        traceback.print_exc()
        input("\nEnter 키를 누르면 종료합니다...")
