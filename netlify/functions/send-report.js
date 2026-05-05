const FROM = 'noreply@oreebus.com';
const TO = 'privacy@avk-agency.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TYPE_LABELS = {
  factory_issue: '공장 정보 신고',
  self_correction: '자사 정보 정정·삭제',
  general_inquiry: '일반 문의',
};

async function sendEmail(resendKey, { to, replyTo, subject, html }) {
  const payload = { from: FROM, to: Array.isArray(to) ? to : [to], subject, html };
  if (replyTo) payload.reply_to = replyTo;

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

  if (!res.ok) {
    console.error('[Resend] 발송 실패 — status:', statusCode, '| body:', JSON.stringify(resBody));
    return { ok: false, status: statusCode, error: resBody };
  }
  console.log('[Resend] 발송 성공 — id:', resBody.id);
  return { ok: true, id: resBody.id };
}

function buildHtml(payload) {
  const typeLabel = TYPE_LABELS[payload.report_type] || '기타';
  const row = (label, value) => value
    ? `<tr><td style="padding:8px 0;color:#666;width:120px;vertical-align:top">${label}</td><td style="padding:8px 0">${value}</td></tr>`
    : '';

  return `
<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#2563eb;color:white;padding:20px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:18px">[공장매칭] 신규 ${typeLabel}</h1>
  </div>
  <div style="background:white;padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row('요청 종류', `<strong>${typeLabel}</strong>`)}
      ${row('대상 공장', payload.target_factory_name ? `${payload.target_factory_name}${payload.target_factory_id ? ` (ID: ${payload.target_factory_id})` : ''}` : '')}
      <tr><td colspan="2" style="padding:16px 0 8px;border-top:1px solid #f0f0f0;font-weight:600">신청자 정보</td></tr>
      ${row('회사명', payload.reporter_company)}
      ${row('사업자번호', payload.reporter_business_number)}
      ${row('담당자', payload.reporter_name)}
      ${row('이메일', `<a href="mailto:${payload.reporter_email}">${payload.reporter_email}</a>`)}
      ${row('연락처', payload.reporter_phone)}
      <tr><td colspan="2" style="padding:16px 0 8px;border-top:1px solid #f0f0f0;font-weight:600">요청 내용</td></tr>
      ${row('사유', payload.reason)}
      ${payload.description ? `<tr><td colspan="2" style="padding:8px 0"><div style="background:#f9f9f9;padding:12px;border-radius:6px;white-space:pre-wrap">${payload.description}</div></td></tr>` : ''}
    </table>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #f0f0f0;color:#999;font-size:12px">
      이 메일은 공장매칭 사이트의 신고 폼을 통해 자동 발송되었습니다.
    </div>
  </div>
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

  if (!payload.reporter_email || !payload.reporter_company || !payload.reason) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'MISSING_FIELDS' }) };
  }

  const typeLabel = TYPE_LABELS[payload.report_type] || '기타';

  const result = await sendEmail(resendKey, {
    to: TO,
    replyTo: payload.reporter_email,
    subject: `[공장매칭] ${typeLabel} - ${payload.reporter_company}`,
    html: buildHtml(payload),
  });

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
