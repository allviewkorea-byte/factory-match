// trigger-workflow.js
// GitHub Actions 워크플로우를 트리거하는 Netlify Function

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { workflow, limit } = JSON.parse(event.body || '{}');
  const token = process.env.GH_TOKEN;
  const repo = 'allviewkorea-byte/factory-match';

  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GH_TOKEN 환경변수 없음' }) };
  }

  const validWorkflows = [
    'enrich-google-places.yml',
    'enrich-dart.yml',
    'enrich-geocode.yml',
  ];

  if (!validWorkflows.includes(workflow)) {
    return { statusCode: 400, body: JSON.stringify({ error: '유효하지 않은 워크플로우' }) };
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: { limit: String(limit || '500') }
        })
      }
    );

    if (res.status === 204) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      const text = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: text }) };
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
