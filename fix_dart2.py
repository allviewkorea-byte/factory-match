lines = open('enrich_dart.py', encoding='utf-8').readlines()

lines.insert(99, '        bizr_no = (item.findtext("bizr_no") or "").replace("-", "").strip()\n')

lines[103] = '            mapping[key] = {"corp_code": corp_code, "corp_name": corp_name, "bizr_no": bizr_no}\n'
lines[104] = '            mapping[corp_name] = {"corp_code": corp_code, "corp_name": corp_name, "bizr_no": bizr_no}\n'
lines.insert(105, '            if bizr_no:\n')
lines.insert(106, '                mapping[bizr_no] = {"corp_code": corp_code, "corp_name": corp_name, "bizr_no": bizr_no}\n')

open('enrich_dart.py', 'w', encoding='utf-8').writelines(lines)
print('수정 완료')
