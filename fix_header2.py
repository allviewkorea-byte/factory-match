lines = open('pages.js', encoding='utf-8').readlines()

# 119번 줄 (0-index: 118) 비로그인 <> 다음에 관리자 버튼 삽입
lines.insert(119, '              <button\n')
lines.insert(120, "                className={'hdr-icon-btn hdr-admin' + (route === 'admin' ? ' is-active' : '')}\n")
lines.insert(121, "                onClick={() => onNav('admin')}\n")
lines.insert(122, '                aria-label="운영자 콘솔"\n')
lines.insert(123, '                title="운영자 콘솔"\n')
lines.insert(124, '              >\n')
lines.insert(125, '                <Icon name="shield" size={16} stroke={1.8}/>\n')
lines.insert(126, '              </button>\n')

open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
