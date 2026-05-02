// ──────────────────────────────────────────────────────────
// 검색 UX · 자동추천 ON/OFF 토글 페이지
// ──────────────────────────────────────────────────────────
const { useState: useStateSX, useMemo: useMemoSX } = React;

const SX_RECOMMEND_3 = [
  {
    id: 'metal',
    title: '금속 가공',
    en: 'Metal Fabrication',
    desc: '자판기 외관 캐비닛, 내부 프레임, 동전·지폐 모듈 하우징 등 강판 절단·절곡·용접 일괄 처리.',
    count: 184, match: 96, glyph: 'metal',
    tags: ['프레스', '절곡', '용접', '도장'],
    avgLead: '14일', avgPrice: '₩180k~',
  },
  {
    id: 'electronic',
    title: '전자 제어',
    en: 'Electronic Control',
    desc: '자판기 메인 컨트롤러 PCB, 결제 단말 연동 모듈, 센서·디스플레이 제어 보드 설계·양산.',
    count: 92, match: 91, glyph: 'electronic',
    tags: ['PCB', 'SMT', '펌웨어', 'IoT'],
    avgLead: '21일', avgPrice: '₩4.5k~',
  },
  {
    id: 'assembly',
    title: '기계 조립',
    en: 'Mechanical Assembly',
    desc: '컨베이어·서보모터·솔레노이드 등 구동부 조립 + 최종 자판기 완성품 통합 조립·QA.',
    count: 67, match: 88, glyph: 'assembly',
    tags: ['조립', '검사', '포장', 'OEM'],
    avgLead: '18일', avgPrice: '협의',
  },
];

const SX_ALL_CATEGORIES = [
  { ...SX_RECOMMEND_3[0], rel: 96, popular: true },
  { ...SX_RECOMMEND_3[1], rel: 91, popular: true },
  { ...SX_RECOMMEND_3[2], rel: 88, popular: false },
  { id: 'plastic', title: '플라스틱 사출', en: 'Plastic Injection', desc: '내부 부품 트레이, 컵 디스펜서, 외관 트림 등 ABS·PC 사출 부품.', count: 142, rel: 78, popular: true, glyph: 'plastic', tags: ['사출', '금형', 'ABS', 'PC'] },
  { id: 'cooling', title: '냉각·열교환', en: 'Refrigeration', desc: '음료 냉각 모듈, 컴프레서 유닛, 냉매 시스템 설계·제작 전문.', count: 38, rel: 74, popular: false, glyph: 'cooling', tags: ['냉각기', '열교환기', '컴프레서'] },
  { id: 'sheet', title: '판금 가공', en: 'Sheet Metal', desc: '레이저 절단·절곡·펀칭 기반 자판기 외관 판넬 및 도어 패널.', count: 211, rel: 71, popular: true, glyph: 'sheet', tags: ['레이저', '절곡', '펀칭'] },
  { id: 'display', title: '디스플레이·UI', en: 'Display & UI', desc: '터치 디스플레이, LCD/LED 보드, 키패드 모듈 공급 및 통합.', count: 54, rel: 67, popular: false, glyph: 'display', tags: ['LCD', '터치', '키패드'] },
  { id: 'payment', title: '결제 모듈', en: 'Payment Module', desc: '동전·지폐 인식기, NFC/QR 결제 단말, 카드 리더 모듈 OEM.', count: 23, rel: 62, popular: false, glyph: 'payment', tags: ['NFC', 'QR', '동전인식'] },
  { id: 'paint', title: '도장·코팅', en: 'Painting & Coating', desc: '분체도장, 우레탄 코팅, 실내·옥외용 자판기 외관 마감.', count: 88, rel: 58, popular: false, glyph: 'paint', tags: ['분체도장', '우레탄', '옥외용'] },
];

const SXGlyph = ({ kind }) => {
  const map = {
    metal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16"/><path d="M5 19V9l3-2 3 2v10"/><path d="M13 19v-7l3-2 3 2v7"/><path d="M8 13h2M16 14h2"/></svg>,
    electronic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="1.5"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="16" cy="10" r="1"/><path d="M6 14h6M14 14h4"/></svg>,
    assembly: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></svg>,
    plastic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h6l4 4-4 4H5z"/><path d="M15 12h5"/><path d="M11 8V5M11 19v-3"/></svg>,
    cooling: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 7l14 10M5 17l14-10"/><path d="M9 5l3-2 3 2M9 19l3 2 3-2"/></svg>,
    sheet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 10h16M10 6v12"/></svg>,
    display: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="1.5"/><path d="M9 21h6M12 18v3"/></svg>,
    payment: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 10h18M7 15h3"/></svg>,
    paint: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 14h10v6H5z"/><path d="M15 17l5-2v-4l-5-2"/><circle cx="18" cy="6" r="0.5" fill="currentColor"/><circle cx="20" cy="9" r="0.5" fill="currentColor"/></svg>,
  };
  return map[kind] || map.metal;
};

const SX_RELATED_KEYWORDS = ['제조문의', 'OEM', 'ODM', '샘플제작', '소량생산', '견적요청'];

function SearchUXPage() {
  const [query, setQuery] = useStateSX('음료자판기');
  const [smart, setSmart] = useStateSX(true);
  const [activeKw, setActiveKw] = useStateSX(null);
  const [focused, setFocused] = useStateSX(false);
  const [sort, setSort] = useStateSX('rel');
  const [loading, setLoading] = useStateSX(false);
  const [aiResults, setAiResults] = useStateSX(null);
  const [consulting, setConsulting] = useStateSX(null);
  const [relatedKws, setRelatedKws] = useStateSX(SX_RELATED_KEYWORDS);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch('/.netlify/functions/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) throw new Error('API 오류');
      const data = await resp.json();
      setAiResults(data);
      if (data.consulting) setConsulting(data.consulting);
      const kws = [
        ...(data.searchTerms?.keywords || []),
        ...(data.topCategories || []).flatMap(c => c.tags || []),
      ].filter((v, i, a) => typeof v === 'string' && v.length > 0 && a.indexOf(v) === i).slice(0, 8);
      if (kws.length > 0) setRelatedKws(kws);
    } catch {
      // 오류 시 기존 결과 유지
    } finally {
      setLoading(false);
    }
  };

  const sorted = useMemoSX(() => {
    const arr = [...SX_ALL_CATEGORIES];
    if (sort === 'popular') arr.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    else if (sort === 'count') arr.sort((a, b) => b.count - a.count);
    else arr.sort((a, b) => b.rel - a.rel);
    return arr;
  }, [sort]);

  return (
    <main className="search-page">
      <div className="sx-head">
        <div className="sx-eyebrow">
          <Icon name="search" size={11} stroke={2.4}/>
          검색 UX · Search Pattern
        </div>
        <h1 className="sx-title">키워드로 가장 적합한 제조 카테고리를 찾으세요</h1>
        <p className="sx-sub">
          <strong style={{ color: 'var(--ink-1)' }}>자동추천</strong>이 켜져 있으면 AI가 가장 적합한 카테고리 3개만 추출해 빠른 의사결정을 돕습니다.
          끄면 모든 연관 카테고리를 리스트로 탐색할 수 있습니다.
        </p>
      </div>

      <div className={`sx-bar ${focused ? 'is-focused' : ''}`}>
        <div className="sx-input-wrap">
          <Icon name="search" size={18} stroke={2}/>
          <input
            className="sx-input"
            placeholder="예) 고추장 500개 만들고 싶어요, 플라스틱 케이스 OEM 찾아요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {query && (
            <button className="sx-input-clear" onClick={() => setQuery('')} aria-label="지우기">
              <Icon name="close" size={11} stroke={2.4}/>
            </button>
          )}
        </div>
        <label className={`sx-toggle ${smart ? 'is-on' : ''}`}>
          <input type="checkbox" checked={smart} onChange={(e) => setSmart(e.target.checked)}/>
          <span className="sx-toggle-switch"/>
          <span className="sx-toggle-text">
            <span className="sx-toggle-label">
              <Icon name="sparkle" size={11} stroke={2.4}/>
              자동추천
            </span>
            <span className="sx-toggle-hint">{smart ? 'AI가 3개만 추출' : '전체 리스트 탐색'}</span>
          </span>
        </label>
        <button className="sx-search-btn" onClick={handleSearch} disabled={loading}>
          {loading
            ? <span className="sx-search-spinner"/>
            : <Icon name="search" size={15} stroke={2.4}/>
          }
          {loading ? '분석 중…' : '검색'}
        </button>
      </div>

      <div className="sx-related">
        <span className="sx-related-k">
          <Icon name="sparkle" size={11} stroke={2.2}/>
          연관 키워드:
        </span>
        {relatedKws.map(kw => (
          <button
            key={kw}
            className={`sx-related-chip ${activeKw === kw ? 'is-active' : ''}`}
            onClick={() => setActiveKw(activeKw === kw ? null : kw)}
          >
            {kw}
          </button>
        ))}
      </div>

      {consulting && (
        <div className="sx-consulting">
          <div className="sx-consulting-head">
            <Icon name="sparkle" size={14} stroke={2.4}/>
            AI 사전 컨설팅
          </div>
          <div className="sx-consulting-grid">
            {consulting.unitCost && (
              <div className="sx-consulting-item">
                <span className="sx-consulting-label">예상 단가</span>
                <span className="sx-consulting-val">{consulting.unitCost}</span>
              </div>
            )}
            {consulting.moqGuide && (
              <div className="sx-consulting-item">
                <span className="sx-consulting-label">최소 발주량</span>
                <span className="sx-consulting-val">{consulting.moqGuide}</span>
              </div>
            )}
            {consulting.leadTime && (
              <div className="sx-consulting-item">
                <span className="sx-consulting-label">리드타임</span>
                <span className="sx-consulting-val">{consulting.leadTime}</span>
              </div>
            )}
            {consulting.budgetRange && (
              <div className="sx-consulting-item">
                <span className="sx-consulting-label">예산 범위</span>
                <span className="sx-consulting-val">{consulting.budgetRange}</span>
              </div>
            )}
            {(consulting.certRequired || []).length > 0 && (
              <div className="sx-consulting-item">
                <span className="sx-consulting-label">필요 인증</span>
                <span className="sx-consulting-val">{consulting.certRequired.join(' · ')}</span>
              </div>
            )}
            {consulting.caution && (
              <div className="sx-consulting-item sx-consulting-caution">
                <span className="sx-consulting-label">주의사항</span>
                <span className="sx-consulting-val">{consulting.caution}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="sx-results">
        {smart ? (
          <>
            <div className="sx-mode-banner is-on">
              <div className="sx-mode-banner-icon">
                <Icon name="sparkle" size={16} stroke={2.4}/>
              </div>
              <div>
                <strong>"{query}"</strong>에 가장 적합한 <strong>3개 카테고리</strong>를 추출했습니다 ·
                매칭률·거래량·리드타임 종합 분석
              </div>
              <div className="sx-mode-banner-meta">
                <span className="sx-mode-pulse"/>
                AI 분석 0.4초
              </div>
            </div>

            <div className="sx-rec-h">
              <h2>
                <Icon name="sparkle" size={16} stroke={2.2}/>
                추천 카테고리
              </h2>
              <div className="sx-rec-h-rank">
                매칭률
                <div className="sx-rec-h-bar">
                  <div className="sx-rec-h-bar-fill" style={{ width: '92%' }}/>
                </div>
                <strong>92%</strong>
              </div>
            </div>

            <div className="sx-rec-grid">
              {(aiResults?.topCategories || SX_RECOMMEND_3).map((r, i) => (
                <button key={r.id} className="sx-rec" onClick={() => { window.location.href = '/list?q=' + encodeURIComponent(query) + '&category=' + r.id; }}>
                  <div className="sx-rec-rank">RANK <strong>0{i + 1}</strong></div>
                  <div className="sx-rec-glyph">
                    <SXGlyph kind={r.glyph}/>
                  </div>
                  <div>
                    <div className="sx-rec-title-row">
                      <h3>{r.title}</h3>
                      <span className="sx-rec-match">
                        <Icon name="sparkle" size={9} stroke={2.6}/>
                        매칭 {r.match}%
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-num)', marginTop: 2, fontWeight: 500, whiteSpace: 'nowrap' }}>{r.en}</div>
                  </div>
                  <p className="sx-rec-desc">{r.desc}</p>
                  <div className="sx-rec-tags">
                    {r.tags.map(t => <span key={t} className="sx-rec-tag">{t}</span>)}
                  </div>
                  <div className="sx-rec-stats">
                    <div className="sx-rec-count">
                      <span className="sx-rec-count-n">{r.count}</span>
                      <span className="sx-rec-count-l">개사</span>
                    </div>
                    <div className="sx-rec-stats-meta">
                      <span>평균 리드 <strong>{r.avgLead}</strong></span>
                      <span>단가 <strong>{r.avgPrice}</strong></span>
                    </div>
                  </div>
                  <div className="sx-rec-cta">
                    <span>제조사 더 보기</span>
                    <Icon name="arrow_right" size={15} stroke={2.4} className="sx-rec-cta-arrow"/>
                  </div>
                </button>
              ))}
            </div>

            <div className="sx-tip">
              <Icon name="sparkle" size={14} stroke={2.2}/>
              <div>
                <strong>왜 3개만?</strong> 선택지가 많을수록 의사결정 시간이 길어집니다.
                자동추천은 매칭률 88% 이상의 카테고리만 추출해 평균 <strong>탐색 시간을 73% 단축</strong>합니다.
                더 다양한 선택지가 필요하면 우측 자동추천 토글을 끄세요.
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sx-mode-banner is-off">
              <div className="sx-mode-banner-icon">
                <Icon name="list" size={16} stroke={2.2}/>
              </div>
              <div>
                <strong>"{query}"</strong>와 연관된 <strong>{SX_ALL_CATEGORIES.length}개 카테고리</strong>를 모두 표시합니다 ·
                관련도·인기·제조사 수로 정렬 가능
              </div>
              <div className="sx-mode-banner-meta">탐색 모드</div>
            </div>

            <div className="sx-list-h">
              <div className="sx-list-h-l">
                <h2>전체 카테고리</h2>
                <span><strong>{SX_ALL_CATEGORIES.length}</strong>개 결과</span>
              </div>
              <div className="sx-list-h-r">
                {[
                  { id: 'rel', label: '관련도순' },
                  { id: 'popular', label: '인기순' },
                  { id: 'count', label: '제조사 수' },
                ].map(s => (
                  <button
                    key={s.id}
                    className={`sx-sort-btn ${sort === s.id ? 'is-active' : ''}`}
                    onClick={() => setSort(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sx-list">
              {sorted.map(c => (
                <button key={c.id} className="sx-list-row">
                  <div className="sx-list-glyph">
                    <SXGlyph kind={c.glyph}/>
                  </div>
                  <div className="sx-list-main">
                    <div className="sx-list-title-row">
                      <span className="sx-list-title">{c.title}</span>
                      <span className="sx-list-en">{c.en}</span>
                      {c.popular && (
                        <span className="sx-list-popular">
                          <Icon name="flame" size={9} stroke={2.4}/>
                          인기
                        </span>
                      )}
                    </div>
                    <div className="sx-list-desc">{c.desc}</div>
                  </div>
                  <div className="sx-list-tags">
                    {c.tags.slice(0, 3).map(t => (
                      <span key={t} className="sx-rec-tag">{t}</span>
                    ))}
                  </div>
                  <div className="sx-list-rel">
                    <div className="sx-list-rel-bar">
                      <div className="sx-list-rel-bar-fill" style={{ width: `${c.rel}%` }}/>
                    </div>
                    <span className="sx-list-rel-v">{c.rel}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="sx-list-count">
                      <div className="sx-list-count-n">{c.count}</div>
                      <div className="sx-list-count-l">개사</div>
                    </div>
                    <div className="sx-list-arrow">
                      <Icon name="chevron_right" size={14} stroke={2.4}/>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="sx-list-foot">
              <div className="sx-list-foot-l">
                <Icon name="layers" size={13} stroke={2}/>
                총 <strong>{SX_ALL_CATEGORIES.reduce((s, c) => s + c.count, 0)}</strong>개 제조사 ·
                평균 관련도 <strong>{Math.round(SX_ALL_CATEGORIES.reduce((s, c) => s + c.rel, 0) / SX_ALL_CATEGORIES.length)}%</strong>
              </div>
              <button className="link-btn">
                키워드 검색 저장
                <Icon name="arrow_up_right" size={12} stroke={2}/>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="sx-compare">
        <h3>두 모드 비교</h3>
        <p>같은 검색어 "음료자판기"에 대해 두 방식이 어떻게 다른지 한눈에 비교하세요.</p>
        <div className="sx-compare-grid">
          <div className="sx-compare-card is-on">
            <h4><span className="dot-label"/> 자동추천 ON · 빠른 선택</h4>
            <ul>
              <li>매칭률 88% 이상 상위 3개만 표시</li>
              <li>카드형 UI · 한눈에 비교 가능</li>
              <li>각 카드에 매칭률·제조사 수·평균 리드타임 즉시 확인</li>
              <li>초보 바이어 · 빠른 의사결정 필요 시</li>
            </ul>
          </div>
          <div className="sx-compare-card is-off">
            <h4><span className="dot-label"/> 자동추천 OFF · 깊은 탐색</h4>
            <ul>
              <li>연관 카테고리 전체 표시 (현재 9개)</li>
              <li>리스트형 UI · 관련도·인기·제조사 수 정렬</li>
              <li>인기 태그·관련도 막대로 시각적 비교</li>
              <li>숙련 바이어 · 다양한 옵션 비교 필요 시</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

window.SearchUXPage = SearchUXPage;
