lines = open('pages.js', encoding='utf-8').readlines()

# Header 컴포넌트 props에 profile 추가 (59번 줄)
lines[58] = "const Header = ({ route, onNav, density, onLogout, authed, rfqCount = 0, profile }) => {\n  const isAdmin = localStorage.getItem('fm-admin-secret') === '030209';\n  const effectiveAuthed = authed || isAdmin;\n  const displayName = isAdmin ? '관리자' : (profile?.name || profile?.email?.split('@')[0] || '');\n  const displayOrg = isAdmin ? 'FactoryMatch' : (profile?.company_name || '');\n  const displayInitial = isAdmin ? '관' : (displayName ? displayName[0] : '');\n"

open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
