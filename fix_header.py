lines = open('pages.js', encoding='utf-8').readlines()

# 1. 비로그인 상태에 관리자 버튼 추가 (119번 줄 앞에)
# 현재 118: ) : (
# 현재 119: <>
# 현재 120: <button className="hdr-login-btn"...

lines[119] = lines[119].replace(
    '              <>',
    '              <>\n              <button\n                className={\'hdr-icon-btn hdr-admin\' + (route === \'admin\' ? \' is-active\' : \'\')}\n                onClick={() => onNav(\'admin\')}\n                aria-label="운영자 콘솔"\n                title="운영자 콘솔"\n              >\n                <Icon name="shield" size={16} stroke={1.8}/>\n              </button>'
)

# 2. 관리자 인증 시 이름 "관리자"로 표시
lines[105] = lines[105].replace(
    '<span className="hdr-avatar">윤</span>',
    '<span className="hdr-avatar">{localStorage.getItem(\'fm-admin-secret\') === \'030209\' ? \'관\' : \'윤\'}</span>'
)
lines[107] = lines[107].replace(
    '<span className="hdr-user-name">윤도현 · Buyer</span>',
    '<span className="hdr-user-name">{localStorage.getItem(\'fm-admin-secret\') === \'030209\' ? \'관리자\' : \'윤도현 · Buyer\'}</span>'
)
lines[108] = lines[108].replace(
    '<span className="hdr-user-org">YD Innovations</span>',
    '<span className="hdr-user-org">{localStorage.getItem(\'fm-admin-secret\') === \'030209\' ? \'FactoryMatch\' : \'YD Innovations\'}</span>'
)

open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
