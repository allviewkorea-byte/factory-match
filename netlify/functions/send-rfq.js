const SUPABASE_URL = 'https://yezxwlzyiqgewpkkyget.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs';
const FROM = 'noreply@oreebus.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function sbFetch(path, opts = {}) {
  const res = await fetch(SUPABASE_URL + path, {
    ...opts,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  return res;
}

const TEST_TO = 'allviewkorea@naver.com'; // [TEST] 모든 이메일을 이 주소로 강제 발송

async function sendEmail(resendKey, { to, subject, html }) {
  const payload = {
    from: FROM,
    to: [TEST_TO], // [TEST] factoryIds 무관하게 하드코딩
    subject,
    html,
  };
  console.log('[Resend] 요청 payload:', JSON.stringify({ ...payload, html: '(생략)' }));
  console.log('RESEND_KEY:', process.env.RESEND_API_KEY ? '있음' : '없음');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + resendKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const statusCode = res.status;
    let resBody;
    try { resBody = await res.json(); } catch { resBody = await res.text(); }

    console.log('[Resend] 응답 status:', statusCode);
    console.log('[Resend] 응답 body:', JSON.stringify(resBody));

    if (!res.ok) {
      console.error('[Resend] 발송 실패 — status:', statusCode, '| body:', JSON.stringify(resBody), '| 원래 수신자:', to);
      return { ok: false, status: statusCode, error: resBody };
    }
    console.log('[Resend] 발송 성공 — id:', resBody.id, '| 원래 수신자:', to);
    return { ok: true, id: resBody.id };
  } catch (e) {
    console.error('[Resend] fetch 예외 발생:', e.message);
    return { ok: false, error: e.message };
  }
}

function factoryEmailHtml({ factoryName, buyerEmail, productName, quantity, deadline, message }) {
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b">
  <h2 style="font-size:20px;margin-bottom:4px">견적 요청이 도착했습니다</h2>
  <p style="color:#64748b;font-size:14px;margin-bottom:24px">공장매칭을 통해 바이어가 견적을 요청했습니다.</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;width:120px">제품명</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600">${productName}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b">수량</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${quantity}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b">납기</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${deadline || '협의'}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b">바이어 연락처</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${buyerEmail}</td></tr>
    ${message ? `<tr><td style="padding:10px 0;color:#64748b;vertical-align:top">요청사항</td><td style="padding:10px 0">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
  </table>
  <p style="margin-top:24px;font-size:13px;color:#94a3b8">본 이메일은 공장매칭(factorymatch.co.kr)을 통해 발송됐습니다. 바이어에게 직접 회신해 주세요.</p>
</div>`;
}

function buyerConfirmHtml({ buyerEmail, productName, quantity, deadline, message, factoryNames }) {
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1e293b">
  <h2 style="font-size:20px;margin-bottom:4px">견적 요청이 접수됐습니다</h2>
  <p style="color:#64748b;font-size:14px;margin-bottom:24px">아래 내용으로 ${factoryNames.length}개 제조사에 견적 요청을 발송했습니다.</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;width:120px">제품명</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600">${productName}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b">수량</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${quantity}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b">납기</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${deadline || '협의'}</td></tr>
    ${message ? `<tr><td style="padding:10px 0;color:#64748b;vertical-align:top">요청사항</td><td style="padding:10px 0">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b">발송 제조사</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${factoryNames.join(', ')}</td></tr>
  </table>
  <p style="margin-top:24px;font-size:13px;color:#94a3b8">각 제조사가 이메일로 직접 회신드릴 예정입니다. 공장매칭(factorymatch.co.kr)을 이용해 주셔서 감사합니다.</p>
</div>`;
}

exports.handler = async (event) => {
  console.log('ENV CHECK:', !!process.env.RESEND_API_KEY);
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: '잘못된 요청 형식입니다' }) };
  }

  const { factoryIds, buyerEmail, productName, quantity, deadline, message } = body;

  if (!factoryIds?.length || !buyerEmail || !productName || !quantity) {
    return {
      statusCode: 400,
      headers: CORS,
      body: JSON.stringify({ error: 'factoryIds, buyerEmail, productName, quantity 필드가 필요합니다' }),
    };
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'RESEND_API_KEY가 설정되지 않았습니다' }) };
  }

  // Supabase에서 공장 이메일 및 이름 조회
  const ids = factoryIds.map(id => `"${id}"`).join(',');
  const factoryRes = await sbFetch(`/rest/v1/factories?id=in.(${ids})&select=id,name,email`);
  if (!factoryRes.ok) {
    const errText = await factoryRes.text();
    console.error('[Supabase] 조회 실패 — status:', factoryRes.status, '| body:', errText);
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Supabase 조회 실패', status: factoryRes.status, detail: errText }) };
  }
  const factories = await factoryRes.json();
  console.log('[Supabase] 조회 결과:', JSON.stringify(factories));

  if (!factories.length) {
    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: '해당 공장을 찾을 수 없습니다' }) };
  }

  const factoryNames = factories.map(f => f.name);

  // 각 공장에 이메일 발송
  const emailPromises = factories
    .filter(f => f.email)
    .map(f =>
      sendEmail(resendKey, {
        to: f.email,
        subject: `[공장매칭] ${buyerEmail}님의 견적 요청 - ${productName}`,
        html: factoryEmailHtml({ factoryName: f.name, buyerEmail, productName, quantity, deadline, message }),
      })
    );

  // 바이어 확인 이메일
  emailPromises.push(
    sendEmail(resendKey, {
      to: buyerEmail,
      subject: `[공장매칭] 견적 요청 접수 완료 - ${productName}`,
      html: buyerConfirmHtml({ buyerEmail, productName, quantity, deadline, message, factoryNames }),
    })
  );

  const emailResults = await Promise.allSettled(emailPromises);
  const emailSummary = emailResults.map((r, i) => ({
    index: i,
    status: r.status,
    value: r.status === 'fulfilled' ? r.value : undefined,
    reason: r.status === 'rejected' ? String(r.reason) : undefined,
  }));
  console.log('[이메일 발송 결과]', JSON.stringify(emailSummary));

  // Supabase rfq_requests 테이블에 저장
  const insertRes = await sbFetch('/rest/v1/rfq_requests', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      factory_ids: factoryIds,
      buyer_email: buyerEmail,
      product_name: productName,
      quantity,
      deadline: deadline || null,
      message: message || null,
      status: 'sent',
      sent_at: new Date().toISOString(),
    }),
  });

  const saved = insertRes.ok || insertRes.status === 201;
  if (!saved) {
    console.error('rfq_requests 저장 실패:', await insertRes.text());
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      sent: factories.filter(f => f.email).length,
      factories: factoryNames,
      saved,
      emailResults: emailSummary,
    }),
  };
};
