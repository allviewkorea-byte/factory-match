lines = open('pages.js', encoding='utf-8').readlines()

# 59번 줄 Header 컴포넌트에서 authed를 관리자 포함으로 수정
lines[58] = "const Header = ({ route, onNav, density, onLogout, authed, rfqCount = 0 }) => {\n  const isAdmin = localStorage.getItem('fm-admin-secret') === '030209';\n  const effectiveAuthed = authed || isAdmin;\n"

# 94번 줄 {authed ? 를 {effectiveAuthed ? 로 변경
for i, line in enumerate(lines):
    if '{authed ?' in line and i < 200:
        lines[i] = line.replace('{authed ?', '{effectiveAuthed ?')
        break

open('pages.js', 'w', encoding='utf-8').writelines(lines)
print('완료')
