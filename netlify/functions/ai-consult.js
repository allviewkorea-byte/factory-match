const SUPABASE_URL = 'https://yezxwlzyiqgewpkkyget.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs';

const SYSTEM = `당신은 공장매칭 플랫폼의 AI 컨설턴트입니다. 한국 제조업 B2B 전문가로서 제조 공정, 소재, 유통, 납기, MOQ, 인증, 수출입 등 제조업 전반에 대한 깊은 지식을 보유하고 있습니다.

web_search 도구를 활용하여 제조사 정보, 업계 동향, 기술 정보 등을 실시간으로 조사할 수 있습니다.

역할:
1. 바이어가 원하는 제품/공장을 찾도록 도움 (공장 매칭)
2. 특정 제조사에 대한 조사 및 분석
3. 제조업 관련 전문 지식 제공 (공정, 소재, 인증, 단가 등)

담당자 연락처/이메일 질문 시:
- DB에 이메일이 있으면 알려주기
- 없으면: "정확한 연락처는 견적 요청하기를 통해 직접 문의해 보시는 건 어떨까요?" 로 안내

실제 단가나 현재 생산능력은 정확히 알 수 없으므로 "공장마다 다르며 견적 요청을 통해 확인하시는 게 좋습니다"라고 안내하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "reply": "사용자에게 보여줄 답변 (자연스러운 한국어)",
  "searchReady": false,
  "searchTerms": null
}

공장 매칭이 필요한 경우 searchReady: true로:
{
  "reply": "적합한 공장을 찾아볼게요!",
  "searchReady": true,
  "searchTerms": {
    "industries": ["machine"],
    "processes": ["cnc"],
    "materials": ["알루미늄"],
    "keywords": ["키워드1", "키워드2"]
  }
}

industries: machine / electronics / chemical / food / textile 중 선택
processes: cnc / injection / press / mold / cutting / welding / painting / assembly 중 선택`;

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

function scoreFactory(factory, st) {
  let score = 0;
  const inds = Array.isArray(factory.industries)
    ? factory.industries
    : (factory.industries ? [String(factory.industries)] : []);

  let aiData = null;
  try { aiData = factory.ai_summary ? (typeof factory.ai_summary === 'string' ? JSON.parse(factory.ai_summary) : factory.ai_summary) : null; } catch(e) {}
  const aiProducts  = (aiData?.products  || []).map(p => p.toLowerCase());
  const aiEquip     = (aiData?.equipment || []).map(e => e.toLowerCase());
  const aiStrengths = (aiData?.strengths || []).map(s => s.toLowerCase());
  const aiClients   = (aiData?.clients   || []).map(c => c.toLowerCase());
  const aiIntro     = (aiData?.intro     || '').toLowerCase();

  score += Math.round((factory.completeness_score || 0) * 0.3);

  (st.industries || []).forEach(ind => { if (inds.includes(ind)) score += 30; });
  (st.processes || []).forEach(proc => { if ((factory.processes || []).includes(proc)) score += 25; });
  (st.materials || []).forEach(mat => {
    const m = mat.toLowerCase();
    if ((factory.materials || []).some(fm => fm.toLowerCase().includes(m) || m.includes(fm.toLowerCase()))) score += 15;
    if (aiIntro.includes(m)) score += 10;
  });
  (st.keywords || []).forEach(kw => {
    const k = kw.toLowerCase();
    const nameMatch    = (factory.name || '').toLowerCase().includes(k);
    const summaryMatch = (factory.summary || '').toLowerCase().includes(k);
    const prodMatch    = (factory.products || []).some(p => (p || '').toLowerCase().includes(k));
    const aiProductMatch  = aiProducts.some(p => p.includes(k) || k.includes(p));
    const aiEquipMatch    = aiEquip.some(e => e.includes(k) || k.includes(e));
    const aiIntroMatch    = aiIntro.includes(k);
    const aiStrengthMatch = aiStrengths.some(s => s.includes(k));
    const aiClientMatch   = aiClients.some(c => c.includes(k));

    if (nameMatch)        score += 25;
    if (summaryMatch)     score += 20;
    if (prodMatch)        score += 25;
    if (nameMatch || prodMatch) score += 30;
    if (aiProductMatch)   score += 35;
    if (aiEquipMatch)     score += 20;
    if (aiIntroMatch)     score += 15;
    if (aiStrengthMatch)  score += 10;
    if (aiClientMatch)    score += 10;
  });
  return score;
}

async function fetchFactoriesByKeywords(keywords) {
  if (!keywords || keywords.length === 0) return [];
  const orParts = keywords.flatMap(kw => {
    const enc = encodeURIComponent('%' + kw + '%');
    return ['name.ilike.' + enc, 'summary.ilike.' + enc, 'ai_summary.ilike.' + enc];
  }).join(',');
  const url = SUPABASE_URL + '/rest/v1/factories?hidden=eq.false&select=id,name,city,industries,processes,materials,products,summary,ai_summary,completeness_score&or=(' + orParts + ')&order=completeness_score.desc&limit=200';
  const resp = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
    },
  });
  if (!resp.ok) return [];
  return resp.json();
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: RESPONSE_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: RESPONSE_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let messages, factoryContext;
  try {
    ({ messages, factoryContext } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers: RESPONSE_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers: RESPONSE_HEADERS, body: JSON.stringify({ error: 'messages array required' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ error: 'CONFIG_MISSING', message: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' }),
    };
  }

  // 특정 제조사 컨텍스트가 있으면 시스템 프롬프트에 추가
  let systemPrompt = SYSTEM;
  if (factoryContext) {
    let aiData = null;
    try { aiData = factoryContext.ai_summary ? JSON.parse(factoryContext.ai_summary) : null; } catch(e) {}
    systemPrompt += `\n\n현재 상담 중인 제조사 정보:
- 회사명: ${factoryContext.name || ''}
- 위치: ${factoryContext.city || ''}
- 소개: ${factoryContext.summary || ''}
- 홈페이지: ${factoryContext.website || '없음'}
- 전화: ${factoryContext.phone || '없음'}
- 이메일: ${factoryContext.email || '없음'}
${aiData ? `- 주요제품: ${(aiData.products || []).join(', ')}
- 보유장비: ${(aiData.equipment || []).join(', ')}
- 납품처: ${(aiData.clients || []).join(', ')}
- 강점: ${(aiData.strengths || []).join(', ')}
- AI분석: ${aiData.intro || ''}` : ''}

이 제조사에 대한 질문에 집중하여 답변하세요.
담당자 연락처를 물어보면: ${factoryContext.email ? `이메일(${factoryContext.email})을 알려주고` : '이메일 정보가 없으므로'} 견적 요청하기를 안내하세요.`;
  }

  let result;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
          }
        ],
        messages,
      }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw Object.assign(new Error(err.error?.message || resp.statusText), {
        code: resp.status === 401 ? 'AUTH_FAILED' : 'API_ERROR',
      });
    }
    const data = await resp.json();

    // 텍스트 블록 추출 (tool_use 블록 제외)
    const textContent = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    // JSON 파싱 시도, 실패 시 텍스트 그대로 reply로
    try {
      result = JSON.parse(textContent.replace(/^```json\s*/,'').replace(/\s*```$/,''));
    } catch(e) {
      result = { reply: textContent || '죄송합니다. 잠시 후 다시 시도해주세요.', searchReady: false, searchTerms: null };
    }
  } catch (e) {
    return {
      statusCode: 502,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ error: e.code || 'INTERNAL_ERROR', message: e.message }),
    };
  }

  if (!result.reply) result.reply = '죄송합니다. 잠시 후 다시 시도해주세요.';
  result.matchedFactories = [];

  if (result.searchReady && result.searchTerms) {
    const st = result.searchTerms;
    const searchKeywords = [...new Set([
      ...(st.keywords || []),
      ...(st.materials || []),
    ])];
    const factories = await fetchFactoriesByKeywords(searchKeywords).catch(() => []);
    if (factories.length > 0) {
      const actualMax = factories.map(f => scoreFactory(f, st)).reduce((a, b) => Math.max(a, b), 1);
      result.matchedFactories = factories
        .map(f => ({ id: f.id, _score: scoreFactory(f, st) }))
        .filter(f => f._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, 6)
        .map(f => ({
          id: f.id,
          matchPct: actualMax > 0
            ? Math.min(98, Math.max(38, Math.round((f._score / actualMax) * 100)))
            : 60,
        }));
    }
  }

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(result),
  };
};
