const SUPABASE_URL = 'https://yezxwlzyiqgewpkkyget.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs';

const SYSTEM = `당신은 한국 B2B 제조업 공급망 전문가입니다. 사용자가 제품명, 재료명, 또는 문장으로 검색하면 공급망과 제조사 매칭에 필요한 모든 정보를 분석합니다.

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이 순수 JSON):
{
  "queryType": "product|ingredient|sentence",
  "intent": "사용자 의도 한 문장 요약 (30자 이내)",
  "supplyChain": [
    { "step": 1, "label": "단계명 (5자 이내)", "detail": "설명 (20자 이내)", "category": "제조카테고리" }
  ],
  "topCategories": [
    {
      "id": "영문소문자id",
      "title": "카테고리명",
      "en": "English Name",
      "match": 95,
      "desc": "이 카테고리가 적합한 이유 (35자 이내)",
      "tags": ["태그1", "태그2", "태그3"],
      "glyph": "metal|electronic|assembly|plastic|cooling|sheet|display|payment|paint",
      "count": 150,
      "avgLead": "14일",
      "avgPrice": "W5k~"
    }
  ],
  "searchTerms": {
    "industries": ["machine"],
    "processes": ["cnc", "assembly"],
    "materials": ["알루미늄"],
    "keywords": ["선풍기", "모터"]
  }
}

searchTerms 규칙:
- industries: 반드시 이 목록에서만 선택 → machine, electronics, chemical, food, textile
- processes: 반드시 이 목록에서만 선택 → cnc, injection, press, mold, cutting, welding, painting, assembly
- materials: 한국어 재료명
- keywords: 제품·부품·특성 관련 한국어 키워드 3~8개

topCategories 규칙:
- 정확히 3개, match는 65~98 사이, 내림차순 정렬
- glyph는 반드시 위 목록 중 하나 선택
- count는 10~500 사이 정수
- supplyChain은 3~5단계`;

function scoreFactory(factory, st) {
  let score = 0;
  (st.industries || []).forEach(ind => { if ((factory.industries || []).includes(ind)) score += 30; });
  (st.processes || []).forEach(proc => { if ((factory.processes || []).includes(proc)) score += 25; });
  (st.materials || []).forEach(mat => {
    const m = mat.toLowerCase();
    if ((factory.materials || []).some(fm => fm.toLowerCase().includes(m) || m.includes(fm.toLowerCase()))) score += 15;
  });
  (st.keywords || []).forEach(kw => {
    const k = kw.toLowerCase();
    if ((factory.name || '').toLowerCase().includes(k)) score += 25;
    if ((factory.summary || '').toLowerCase().includes(k)) score += 20;
    if ((factory.products || []).some(p => (p || '').toLowerCase().includes(k))) score += 25;
  });
  return score;
}

async function fetchFactoriesByKeywords(keywords) {
  if (!keywords || keywords.length === 0) return [];
  const orParts = keywords.flatMap(kw => {
    const enc = encodeURIComponent('%' + kw + '%');
    return ['name.ilike.' + enc, 'summary.ilike.' + enc];
  }).join(',');
  const url = SUPABASE_URL + '/rest/v1/factories?hidden=eq.false&select=id,name,city,industries,processes,materials,products,summary&or=(' + orParts + ')&limit=200';
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

  let query;
  try {
    ({ query } = JSON.parse(event.body));
    if (!query || typeof query !== 'string') throw new Error('invalid');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'query 필드가 필요합니다' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API 키가 설정되지 않았습니다' }) };
  }

  const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: SYSTEM,
      messages: [{ role: 'user', content: query }],
    }),
  });

  if (!claudeResp.ok) {
    const err = await claudeResp.text();
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Anthropic API 오류: ' + claudeResp.status, detail: err }),
    };
  }

  const data = await claudeResp.json();
  const textBlock = data.content.find((b) => b.type === 'text');
  if (!textBlock) {
    return { statusCode: 502, body: JSON.stringify({ error: '응답 텍스트가 없습니다' }) };
  }

  let result;
  try {
    const raw = textBlock.text.trim();
    const jsonStr = raw.startsWith('```') ? raw.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '') : raw;
    result = JSON.parse(jsonStr);
  } catch {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'JSON 파싱 실패', raw: textBlock.text }),
    };
  }

  const st = result.searchTerms || {};
  const searchKeywords = [
    ...(st.keywords || []),
    ...(st.materials || []),
    ...query.split(/[\s,·]+/).filter(w => w.length >= 2),
  ];

  const factories = await fetchFactoriesByKeywords([...new Set(searchKeywords)]).catch(() => []);

  if (factories.length > 0) {
    const bestPossible =
      (st.industries || []).length * 30 +
      (st.processes || []).length * 25 +
      (st.materials || []).length * 15 +
      (st.keywords || []).length * 18;

    const scored = factories
      .map(f => ({ id: f.id, _score: scoreFactory(f, st) }))
      .filter(f => f._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 6)
      .map(f => ({
        id: f.id,
        matchPct: bestPossible > 0
          ? Math.min(98, Math.max(38, Math.round((f._score / bestPossible) * 100)))
          : 60,
      }));

    result.matchedFactories = scored;
  } else {
    result.matchedFactories = [];
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(result),
  };
};
