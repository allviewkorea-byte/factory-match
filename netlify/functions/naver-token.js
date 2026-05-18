// 네이버 OAuth 인가코드 → access_token → 사용자 정보 → Supabase 로그인
const NAVER_CLIENT_ID     = 'yB7i0x6lVEELeleWiQd8';
const NAVER_CLIENT_SECRET = 'NA4cscXfrF';
const SUPABASE_URL        = 'https://yezxwlzyiqgewpkkyget.supabase.co';
const SUPABASE_ANON_KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { code, state } = JSON.parse(event.body || '{}');
    if (!code) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'code required' }) };

    // 1. code → access_token
    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code` +
      `&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}` +
      `&code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || '')}`;

    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: tokenData.error_description || tokenData.error }) };
    }

    const accessToken = tokenData.access_token;

    // 2. access_token → 네이버 사용자 정보
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const profileData = await profileRes.json();

    if (profileData.resultcode !== '00') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '네이버 사용자 정보 조회 실패' }) };
    }

    const { id: naverId, email: naverEmail, name, profile_image } = profileData.response;

    // 이메일이 없을 경우 가상 이메일 생성 (개발 중 상태에서 이메일 미제공 가능)
    const email = naverEmail || `naver_${naverId}@factorymatch.naver`;
    // 네이버 id 기반 고정 패스워드 (서버에서만 생성, 외부 노출 X)
    const password = `nv_${naverId}_${NAVER_CLIENT_SECRET.slice(0, 6)}`;

    // 3. Supabase 로그인 시도 (기존 계정)
    let sbRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    });
    let sbData = await sbRes.json();

    // 4. 로그인 실패 시 신규 가입
    if (!sbRes.ok || sbData.error) {
      sbRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          email,
          password,
          data: { provider: 'naver', naver_id: naverId, full_name: name || '', avatar_url: profile_image || '' },
        }),
      });
      sbData = await sbRes.json();
    }

    if (!sbData.access_token && !sbData.session?.access_token) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Supabase 로그인 실패', detail: sbData }) };
    }

    // 세션 정규화 (signUp은 session 안에, signIn은 바로)
    const session = sbData.session || sbData;

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token:  session.access_token,
        refresh_token: session.refresh_token,
        user:          session.user,
        naver_name:    name || '',
        naver_email:   naverEmail || '',
      }),
    };

  } catch (e) {
    console.error('naver-token error:', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
