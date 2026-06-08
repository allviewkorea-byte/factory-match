content = open('app.js', encoding='utf-8').read()
old = "    if (!authed && _factoryViewCount.current >= 3) {"
new = "    const _isAdmin = localStorage.getItem('fm-admin-secret') === '030209';\n    if (!authed && !_isAdmin && _factoryViewCount.current >= 3) {"
if old in content:
    content = content.replace(old, new)
    open('app.js', 'w', encoding='utf-8').write(content)
    print('완료')
else:
    print('패턴 못찾음')
