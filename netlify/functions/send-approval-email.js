const FROM = 'noreply@oreebus.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function sendEmail(resendKey, { to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + resendKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: Array.isArray(to) ? to : [to], subject, html }),
  });

  const statusCode = res.status;
  let resBody;
  try { resBody = await res.json(); } catch { resBody = await res.text(); }

  if (!res.ok) {
    console.error('[Resend] 발송 실패 — status:', statusCode, '| body:', JSON.stringify(resBody));
    return { ok: false, status: statusCode, error: resBody };
  }
  console.log('[Resend] 발송 성공 — id:', resBody.id);
  return { ok: true, id: resBody.id };
}

function buildApprovedHtml({ name, company }) {
  return `
<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#16a34a;color:white;padding:24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:20px">공장매칭 가입 승인 안내</h1>
  </div>
  <div style="background:white;padding:28px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px;font-size:15px;line-height:1.7">
    <p>안녕하세요, <strong>${name || ''}</strong>님.</p>
    <p><strong>${company || ''}</strong> 의 공장매칭 가입 신청이 <strong style="color:#16a34a">승인</strong>되었습니다.</p>
    <p>이제 공장매칭 서비스를 이용하실 수 있습니다.</p>
    <div style="margin:28px 0;text-align:center">
      <a href="https://steady-mousse-5900f8.netlify.app/" style="background:#2563eb;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">서비스 시작하기</a>
    </div>
    <p style="color:#666;font-size:13px">문의사항이 있으시면 이 메일에 회신해 주세요.</p>
  </div>
  <div style="padding:12px 0;color:#aaa;font-size:12px;text-align:center">공장매칭 · FactoryMatch</div>
</div>`;
}

function buildRejectedHtml({ name, company, reason }) {
  return `
<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#dc2626;color:white;padding:24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:20px">공장매칭 가입 신청 결과 안내</h1>
  </div>
  <div style="background:white;padding:28px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px;font-size:15px;line-height:1.7">
    <p>안녕하세요, <strong>${name || ''}</strong>님.</p>
    <p><strong>${company || ''}</strong> 의 공장매칭 가입 신청을 검토한 결과 아쉽게도 승인이 어렵습니다.</p>
    ${reason ? `<p style="background:#fef2f2;padding:16px;border-radius:6px;color:#991b1b"><strong>사유:</strong> ${reason}</p>` : ''}
    <p style="color:#666">궁금하신 사항은 이 메일에 회신해 주세요.</p>
  </div>
  <div style="padding:12px 0;color:#aaa;font-size:12px;text-align:center">공장매칭 · FactoryMatch</div>
</div>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('RESEND_API_KEY 미설정');
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'CONFIG_MISSING' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }

  const { type, email, name, company, reason } = payload;
  if (!type || !email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'MISSING_FIELDS' }) };
  }

  const isApproved = type === 'approved';
  const subject = isApproved
    ? `[공장매칭] 가입이 승인되었습니다 — ${company || ''}`
    : `[공장매칭] 가입 신청 결과 안내 — ${company || ''}`;
  const html = isApproved
    ? buildApprovedHtml({ name, company })
    : buildRejectedHtml({ name, company, reason });

  const result = await sendEmail(resendKey, { to: email, subject, html });

  if (!result.ok) {
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({ error: 'EMAIL_FAILED', detail: result.error }),
    };
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, id: result.id }),
  };
};
