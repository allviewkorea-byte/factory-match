lines = open('enrich_dart.py', encoding='utf-8').readlines()

# 100번줄 들여쓰기 수정 (0-index: 99)
lines[99] = '            bizr_no = (item.findtext("bizr_no") or "").replace("-", "").strip()\n'

# 103번줄 중복 제거 (0-index: 102) - bizr_no 없는 구버전 삭제
del lines[102]

open('enrich_dart.py', 'w', encoding='utf-8').writelines(lines)
print('수정 완료')
