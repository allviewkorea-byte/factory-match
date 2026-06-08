import requests, zipfile, io, xml.etree.ElementTree as ET

resp = requests.get('https://opendart.fss.or.kr/api/corpCode.xml', 
    params={'crtfc_key': 'fc85d5b3e93600d415fa6e005057c5b609e874ca'}, timeout=60)

with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
    with z.open('CORPCODE.xml') as f:
        content = f.read().decode('utf-8')

root = ET.fromstring(content)
item = root.findall('.//list')[0]
print('필드 목록:')
for child in item:
    print(f'  {child.tag}: {child.text}')
