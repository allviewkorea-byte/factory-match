content = open('index.html', encoding='utf-8').read()
old = 'window._env = window._env || {};'
new = 'window._env = window._env || {};\nwindow._KAKAO_CLIENT_ID = "8b3808a2c6376f9824924c482b3ea860";'
content = content.replace(old, new)
open('index.html', 'w', encoding='utf-8').write(content)
print('완료')
