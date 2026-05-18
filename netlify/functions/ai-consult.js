const SUPABASE_URL = 'https://yezxwlzyiqgewpkkyget.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllenh3bHp5aXFnZXdwa2t5Z2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczODIzNjcsImV4cCI6MjA5Mjk1ODM2N30.8TGX-bvxrxvawNhMPVihvWBKrQrclbIkJ6ops1eAWDs';

const SYSTEM = `당신은 제조업 B2B 분야에서 20년 경력을 가진 전문 컨설턴트입니다. 공장 매칭, 제조 공정, 소재, 납기, MOQ, 인증, 수출입 등 제조업 전반을 깊이 이해하고 있습니다.

페르소나:
- 짧고 정확하게 핵심만 말하는 스타일
- 친근하지만 전문적 ("~어떠세요?", "~확인해드릴게요", "~알아봐드리겠습니다")
- 불필요한 서두나 반복 없이 바로 본론
- 사용자가 업체/공장 추천을 요청하면 즉시 검색 (searchReady: true) — 정보 부족해도 일단 검색
- 검색 후 결과가 나오면 "더 좁혀드릴까요?" 식으로 자연스럽게 후속 질문
- 사용자 의도가 불명확할 때만 한 번에 한 가지씩 질문
- 제조업 경험 많은 선배가 실질적으로 도와주는 느낌
- 매번 인사하지 않음, 대화 흐름 자연스럽게 이어가기

web_search 도구를 활용해 제조사 정보, 업계 동향, 기술 정보를 실시간 조사할 수 있습니다.

역할:
1. 바이어가 원하는 제품/공장 매칭
2. 특정 제조사 조사 및 분석
3. 제조업 전문 지식 제공 (공정, 소재, 인증, 단가 등)

대화 원칙:
- "DB" 대신 "저희 플랫폼" 또는 "공장매칭"으로 표현
- 볼드(**) 등 마크다운 사용 금지, 자연스러운 구어체
- 업체 추천/검색 요청이 오면 바로 searchReady: true로 검색 먼저 실행 — 추가 질문 없이
- 검색 결과를 먼저 보여준 후, 조건을 더 좁히고 싶으면 그때 물어볼 것
- 추천 원하는지 정보 원하는지 먼저 파악 (단, 명확한 추천 요청은 바로 검색)
- 연락처 질문 시: 이메일 있으면 알려주고, 없으면 "견적 요청하기를 통해 직접 문의해보시는 게 좋을 것 같습니다" 안내
- 실제 단가·생산능력은 "견적 요청을 통해 확인하시는 게 정확합니다" 안내

반드시 아래 JSON 형식으로만 응답하세요. web_search 도구를 사용한 후에도 반드시 이 JSON 형식으로 최종 답변을 작성하세요:
{
  "reply": "사용자에게 보여줄 답변 (자연스러운 한국어, 마크다운 없이, 볼드 없이)",
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

async function callClaude(apiKey, contextMsg, timeout, messages) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [...(messages || []), { role: 'user', content: contextMsg }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const data = await resp.json();
    const text = (data.content || []).find(b => b.type === 'text')?.text?.trim() || '';
    const jsonStr = text.startsWith('```') ? text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '') : text;
    return JSON.parse(jsonStr);
  } catch { clearTimeout(timer); return null; }
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
    ({ messages, factoryContext, userProfile } = JSON.parse(event.body || '{}'));
    var userProfile = userProfile || null;
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

  // 사용자 프로필 사전 파악 - AI가 상대방을 먼저 인지
  let systemPrompt = SYSTEM;
  if (userProfile) {
    const role = userProfile.user_type || 'buyer';
    const interests = userProfile.interests || {};
    const name = userProfile.contact_name || '';
    const company = userProfile.company_name || '';
    const procs = (interests.needed_processes || interests.owned_processes || []).join(', ');
    const mats = (interests.needed_materials || interests.main_materials || []).join(', ');
    const orderScale = interests.order_scale || '';
    systemPrompt += `\n\n[상담 고객 사전 정보 - 이미 파악된 프로필]
- 이름: ${name || '미확인'}
- 회사: ${company || '미확인'}
- 유형: ${role === 'buyer' ? '바이어 (공장을 찾는 구매자)' : '제조사 (공장 운영자)'}
${procs ? `- 관심 공정: ${procs}` : ''}
${mats ? `- 관심 소재: ${mats}` : ''}
${orderScale ? `- 발주 규모: ${orderScale}` : ''}

이 정보를 바탕으로:
1. 고객이 이미 말하지 않아도 관심 분야를 파악한 상태로 대화
2. 관련 공정/소재 언급 시 자연스럽게 연결
3. "혹시 ${procs ? procs.split(',')[0].trim() : '관심 분야'} 관련 공장을 찾고 계신가요?" 식으로 먼저 맥락 제시 가능
4. 단, 프로필 정보를 직접 언급하거나 "당신의 프로필에는~" 식으로 말하지 말 것 - 자연스럽게 녹여낼 것`;
  }

  // 특정 제조사 컨텍스트가 있으면 시스템 프롬프트에 추가
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

    // 텍스트 블록 추출 (tool_use 블록 제외, 마지막 텍스트 블록 우선)
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    const textContent = textBlocks.map(b => b.text).join('');

    // JSON 파싱 시도
    try {
      const cleaned = textContent
        .replace(/^```json\s*/,'').replace(/\s*```$/,'')
        .replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
      result = JSON.parse(cleaned);
    } catch(e) {
      // JSON 파싱 실패 - 텍스트에서 JSON 블록 추출 시도
      const jsonMatch = textContent.match(/\{[\s\S]*"reply"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch(e2) {
          // 완전 실패 시 텍스트 그대로 사용 (JSON 코드 제거)
          const cleanText = textContent
            .replace(/```json[\s\S]*?```/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .trim();
          result = { reply: cleanText || '죄송합니다. 잠시 후 다시 시도해주세요.', searchReady: false, searchTerms: null };
        }
      } else {
        result = { reply: textContent || '죄송합니다. 잠시 후 다시 시도해주세요.', searchReady: false, searchTerms: null };
      }
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
      const scored = factories
        .map(f => ({ ...f, _score: scoreFactory(f, st) }))
        .filter(f => f._score >= 30)
        .sort((a, b) => b._score - a._score)
        .slice(0, 6);

      if (scored.length > 0) {
        const topScore = scored[0]._score;

        // ai_summary 있는 공장 정보로 Claude에게 추가 컨텍스트 제공
        const aiSummaryContext = scored
          .filter(f => f.ai_summary)
          .map(f => {
            try {
              const ai = typeof f.ai_summary === 'string' ? JSON.parse(f.ai_summary) : f.ai_summary;
              const parts = [];
              if (ai.intro) parts.push(ai.intro);
              if (ai.products?.length) parts.push(`주요제품: ${ai.products.slice(0,3).join(', ')}`);
              if (ai.equipment?.length) parts.push(`설비: ${ai.equipment.slice(0,2).join(', ')}`);
              if (ai.strengths?.length) parts.push(`강점: ${ai.strengths.slice(0,2).join(', ')}`);
              return `- ${f.name}(${f.city||''}): ${parts.join(' / ')}`;
            } catch { return null; }
          })
          .filter(Boolean);

        if (aiSummaryContext.length > 0) {
          // ai_summary 기반 추가 답변 생성
          const contextMsg = `검색 결과 ${scored.length}개 공장을 찾았습니다. 주요 공장 정보:\n${aiSummaryContext.join('\n')}\n\n이 정보를 바탕으로 사용자에게 구체적으로 어떤 공장이 적합한지 1-2문장으로 자연스럽게 안내해주세요. JSON 형식: {"reply":"...","searchReady":false,"searchTerms":null}`;

          try {
            const followUp = await callClaude(apiKey, contextMsg, 8000, messages);
            if (followUp?.reply) result.reply = followUp.reply;
          } catch {}
        }

        result.matchedFactories = scored.map(f => ({
          id: f.id,
          matchPct: Math.min(96, Math.max(40, Math.round((f._score / topScore) * 96))),
        }));
      }
    }
  }

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(result),
  };
};
