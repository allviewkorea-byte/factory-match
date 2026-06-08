import requests

API_URL = 'https://www.factoryon.go.kr/openapi/api/fctryListApi'
SERVICE_KEY = '2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7'

resp = requests.get(API_URL, params={
    'serviceKey': SERVICE_KEY,
    'numOfRows': 1,
    'pageNo': 1,
    'cmpnyNm': '톱텍'
}, timeout=30)

import json
data = resp.json()
if data.get('items'):
    item = data['items'][0]
    for k, v in item.items():
        print(f'{k}: {v}')
else:
    print(resp.text[:500])
