// 카카오 OAuth 인가코드 → id_token 교환
// 클라이언트가 받은 code를 받아서 카카오 토큰 엔드포인트에 client_secret과 함께 교환 요청
// id_token을 반환하면 클라이언트가 supabase.auth.signInWithIdToken으로 로그인

const KAKAO_REST_API_KEY = '9f4362740ae36ff6463fc200b27322d8';
const KAKAO_CLIENT_SECRET = 'FkiGEMEbTJegODBwyTRo4etzb9cM2PrH';

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { code, redirect_uri } = body;

    if (!code || !redirect_uri) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'code and redirect_uri are required' }),
      };
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_REST_API_KEY,
      client_secret: KAKAO_CLIENT_SECRET,
      redirect_uri: redirect_uri,
      code: code,
    });

    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Kakao token exchange failed:', data);
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: data.error_description || data.error || 'Token exchange failed', detail: data }),
      };
    }

    if (!data.id_token) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'id_token not returned. OpenID Connect may not be enabled or openid scope missing.', detail: data }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: data.id_token,
        access_token: data.access_token,
      }),
    };
  } catch (e) {
    console.error('kakao-token error:', e);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: String(e) }),
    };
  }
};
