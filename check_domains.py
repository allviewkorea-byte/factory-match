import requests

SUPABASE_URL = "https://yezxwlzyiqgewpkkyget.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs"
SB_H = {"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY}
KICOX_URL = "http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService"
KICOX_KEY = "2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7"
DOMAINS = ["biztop.co.kr", "marketbz.com", "114.co.kr"]

def kicox_query(name):
    r = requests.get(KICOX_URL, params={
        "serviceKey": KICOX_KEY, "cmpnyNm": name,
        "pageNo": "1", "numOfRows": "3", "type": "json"
    }, timeout=15)
    if r.status_code != 200:
        return []
    items = r.json().get("response",{}).get("body",{}).get("items",{}).get("item",[])
    if isinstance(items, dict): items = [items]
    return items or []

for domain in DOMAINS:
    print(f"\n{'='*60}")
    print(f"도메인: {domain}")
    print('='*60)
    r = requests.get(f"{SUPABASE_URL}/rest/v1/factories",
        headers=SB_H,
        params={"select": "id,name,website", "website": f"ilike.*{domain}*", "limit": "5"})
    factories = r.json()
    if not factories:
        print("  → Supabase 결과 없음")
        continue
    for f in factories:
        print(f"\n  [Supabase] {f['id']} | {f['name']}")
        print(f"    website: {f['website']}")
        items = kicox_query(f['name'])
        if not items:
            print(f"    KICOX: 결과 없음")
        for item in items:
            print(f"    KICOX: {item.get('cmpnyNm')} | {item.get('rnAdres','')} | telno: {item.get('cmpnyTelno','')}")
