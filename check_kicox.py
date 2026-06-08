import requests, xml.etree.ElementTree as ET

API_URL = 'http://apis.data.go.kr/B550624/fctryRegistLndpclInfo/getFctryLndpclService'
SERVICE_KEY = '2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7'

resp = requests.get(API_URL, params={
    'serviceKey': SERVICE_KEY,
    'numOfRows': 1,
    'pageNo': 1,
    'cmpnyNm': '톱텍'
}, timeout=30)

root = ET.fromstring(resp.text)
item = root.find('.//item')
if item is not None:
    for child in item:
        print(f'{child.tag}: {child.text}')
else:
    print(resp.text[:500])
