content = open('app.js', encoding='utf-8').read()
old = '<Header route={route} onNav={nav} density={tweaks.density} onLogout={handleLogout} authed={authed} rfqCount={rfqIds.length}/>'
new = '<Header route={route} onNav={nav} density={tweaks.density} onLogout={handleLogout} authed={authed} rfqCount={rfqIds.length} profile={profile}/>'
if old in content:
    content = content.replace(old, new)
    open('app.js', 'w', encoding='utf-8').write(content)
    print('완료')
else:
    print('패턴 못찾음')
