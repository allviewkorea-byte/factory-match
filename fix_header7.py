lines = open('pages.js', encoding='utf-8').readlines()

# 59번 줄을 올바르게 교체 (0-index: 58)
lines[58] = "const Header = ({ route, onNav, density, onLogout, authed, rfqCount = 0, profile }) => {\n"
# 60~71번 줄 중복 제거 (0-index: 59~70), 올바른 내용으로 교체
lines[59:71] = [
    "  const isAdmin = localStorage.getItem('fm-admin-secret') === '030209';\n",
    "  const effectiveAuthed = authed || isAdmin;\n",
    "  const displayName = isAdmin ? '관리자' : (profile?.name || profile?.email?.split('@')[0] || '');\n",
    "  const displayOrg = isAdmin ? 'FactoryMatch' : (profile?.company_name || '');\n",
    "  const displayInitial = isAdmin ? '관' : (displayName ? displayName[0] : '');\n",
]
open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
