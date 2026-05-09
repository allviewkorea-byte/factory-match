"""
nullify_websites.py
잘못된 website URL을 Supabase에서 website=NULL, ai_summary=NULL로 일괄 업데이트

사용법:
  pip install requests
  python nullify_websites.py
"""

import requests

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
    "Prefer":        "return=representation",  # 처리 건수 확인용
}

# (설명, Supabase 필터 파라미터)
RULES = [
    ("moneypin.biz 포함",              {"website": "ilike.*moneypin.biz*"}),
    ("'delete' 포함",                  {"website": "ilike.*delete*"}),
    ("http://http:://nudia.kr (이중)", {"website": "eq.http://http:://nudia.kr"}),
    ("wonju.go.kr 포함",               {"website": "ilike.*wonju.go.kr*"}),
    ("kwwa.or.kr 포함",                {"website": "ilike.*kwwa.or.kr*"}),
    ("grandculture.net 포함",          {"website": "ilike.*grandculture.net*"}),
    ("tradesupport.gwd.go.kr 포함",    {"website": "ilike.*tradesupport.gwd.go.kr*"}),
    ("sen.es.kr 포함",                 {"website": "ilike.*sen.es.kr*"}),
    ("g2b.go.kr 포함",                 {"website": "ilike.*g2b.go.kr*"}),
    ("dh.go.kr 포함",                  {"website": "ilike.*dh.go.kr*"}),
    ("mma.go.kr 포함",                 {"website": "ilike.*mma.go.kr*"}),
    ("iffe.or.kr 포함",                {"website": "ilike.*iffe.or.kr*"}),
    ("xoloninvest.com 포함",           {"website": "ilike.*xoloninvest.com*"}),
    ("inhwa-trading.com 포함",         {"website": "ilike.*inhwa-trading.com*"}),
]


def nullify(desc, params):
    try:
        r = requests.patch(
            SUPABASE_URL + "/rest/v1/factories",
            headers=SB_HEADERS,
            params=params,
            json={"website": None, "ai_summary": None},
            timeout=20,
        )
        if r.status_code in (200, 204):
            try:
                count = len(r.json()) if r.text.strip().startswith("[") else "?"
            except Exception:
                count = "?"
            print("  [{:>3}건] {}".format(count, desc))
        else:
            print("  [오류 HTTP {}] {}".format(r.status_code, desc))
            try:
                print("         ", r.json())
            except Exception:
                pass
    except Exception as e:
        print("  [예외] {} : {}".format(desc, e))


if __name__ == "__main__":
    print("")
    print("=" * 55)
    print("  잘못된 website NULL 일괄 처리")
    print("=" * 55)
    for desc, params in RULES:
        nullify(desc, params)
    print("=" * 55)
    print("완료.")
