const SYSTEM = `당신은 한국 B2B 제조업 공급망 전문가입니다. 사용자가 제품명, 재료명, 또는 문장으로 검색하면 해당 제품의 공급망과 관련 제조 카테고리를 분석합니다.

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
      "avgPrice": "₩5k~"
    }
  ]
}

규칙:
- supplyChain: 원재료부터 완제품까지 3~5단계
- topCategories: 정확히 3개, match는 65~98 사이, 내림차순 정렬
- glyph는 반드시 위 목록 중 하나 선택
- count는 해당 카테고리 예상 제조사 수 (10~500 사이 정수)
- 한국 제조업 실정에 맞는 구체적 내용으로 채울 것`;

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

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: query }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Anthropic API 오류: ${resp.status}`, detail: err }),
    };
  }

  const data = await resp.json();
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

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(result),
  };
};
