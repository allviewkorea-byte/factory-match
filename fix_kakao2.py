content = open('pages.js', encoding='utf-8').read()
old = """    const redirectUri = encodeURIComponent(window.location.origin + '/');
    sessionStorage.setItem('_sgn_provider', provider);
    if (provider === 'kakao') {
      window.location.href = https://kauth.kakao.com/oauth/authorize?client_id=&redirect_uri=&response_type=code;
    } else {
      const state = Math.random().toString(36).slice(2);
      sessionStorage.setItem('_naver_state', state);
      window.location.href = https://nid.naver.com/oauth2.0/authorize?client_id=&redirect_uri=&response_type=code&state=;
    }"""
new = """    sessionStorage.setItem('_sgn_provider', provider);
    window._sb.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/'
      }
    });"""
if old in content:
    content = content.replace(old, new)
    open('pages.js', 'w', encoding='utf-8').write(content)
    print('
@"
content = open('pages.js', encoding='utf-8').read()
old = """    const redirectUri = encodeURIComponent(window.location.origin + '/');
    sessionStorage.setItem('_sgn_provider', provider);
    if (provider === 'kakao') {
      window.location.href = https://kauth.kakao.com/oauth/authorize?client_id=&redirect_uri=&response_type=code;
    } else {
      const state = Math.random().toString(36).slice(2);
      sessionStorage.setItem('_naver_state', state);
      window.location.href = https://nid.naver.com/oauth2.0/authorize?client_id=&redirect_uri=&response_type=code&state=;
    }"""
new = """    sessionStorage.setItem('_sgn_provider', provider);
    window._sb.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/'
      }
    });"""
if old in content:
    content = content.replace(old, new)
    open('pages.js', 'w', encoding='utf-8').write(content)
    print('수정 완료')
else:
    print('패턴 못찾음')
