function SearchUXPage({ onOpenFactory, onSearch, onNav, initialQuery }) {
  // If arriving from home search with a new/different query, wipe stale cache
  const _shouldAutoSearch = !!initialQuery && (
    !_sxStateCache || _sxStateCache.query !== initialQuery
  );
  if (_shouldAutoSearch) _sxStateCache = null;

  const _autoSearchedRef = useRefSX(false);

  const [query, setQuery] = useStateSX(() => _sxStateCache?.query ?? initialQuery ?? '');
  const [smart, setSmart] = useStateSX(() => _sxStateCache ? (_sxStateCache.smart ?? true) : true);
  const [activeKw, setActiveKw] = useStateSX(() => _sxStateCache?.activeKw ?? null);
  const [focused, setFocused] = useStateSX(false);
  const [sort, setSort] = useStateSX(() => _sxStateCache?.sort ?? 'rel');
  const [aiResult, setAiResult] = useStateSX(() => _sxStateCache?.aiResult ?? null);
  const [consulting, setConsulting] = useStateSX(() => _sxStateCache?.consulting ?? null);
  const [loading, setLoading] = useStateSX(false);
  const [aiError, setAiError] = useStateSX(null);
  const [matchedFactories, setMatchedFactories] = useStateSX(() => _sxStateCache?.matchedFactories ?? []);

  // Track latest state in a ref so the unmount cleanup can save it reliably
  const _snapRef = useRefSX({});
  useEffectSX(() => {
    _snapRef.current = { query, smart, activeKw, sort, aiResult, consulting, matchedFactories };
  }, [query, smart, activeKw, sort, aiResult, consulting, matchedFactories]);

  // On unmount: save snapshot to module-level cache for next mount
  useEffectSX(() => () => { _sxStateCache = _snapRef.current; }, []);

  // Auto-trigger AI search when navigating here from home page with a query
  useEffectSX(() => {
    if (_shouldAutoSearch && !_autoSearchedRef.current) {
      _autoSearchedRef.current = true;
      handleSearch();
    }
  }, []);

  const sorted = useMemoSX(() => {
    const arr = [...SX_ALL_CATEGORIES];
    if (sort === 'popular') arr.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    else if (sort === 'count') arr.sort((a, b) => b.count - a.count);
    else arr.sort((a, b) => b.rel - a.rel);
    return arr;
  }, [sort]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setAiError(null);
    setAiResult(null);
    setConsulting(null);
    setMatchedFactories([]);
    try {
      const resp = await fetch('/.netlify/functions/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) throw new Error('API error');
      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      data.topCategories = (data.topCategories || []).map((c, i) => ({
        glyph: 'metal', count: 0, avgLead: '협의', avgPrice: '협의',
        ...c, id: c.id || `ai-${i}`,
      }));
      setAiResult(data);
      if (data.consulting) { console.log('[consulting]', data.consulting); setConsulting(data.consulting); }

      // Use server-matched factories from Netlify function if available
      if (data.matchedFactories && data.matchedFactories.length > 0) {
        // Fetch only the specific matched IDs — never pull the full table
        const ids = data.matchedFactories.slice(0, 10).map(m => m.id);
        let rows = [];
        if (window._sb && ids.length) {
          try {
            const { data: dbRows } = await window._sb.from('factories').select('*').in('id', ids);
            if (dbRows) rows = dbRows;
          } catch (_) {}
        }
        const staticById = {};
        ((window.MFG_DATA || {}).FACTORIES || []).forEach(f => { staticById[f.id] = f; });
        const byId = {};
        (rows.length ? rows.map(window._dbRowToFactory) : []).forEach(f => { byId[f.id] = f; });
        const scored = data.matchedFactories
          .map(m => (byId[m.id] || staticById[m.id])
            ? { ...(byId[m.id] || staticById[m.id]), _matchPct: m.matchPct }
            : null)
          .filter(Boolean);
        setMatchedFactories(scored);
      } else {
        // Fallback: server-side filtered search with LIMIT — never pull full table
        const st = data.searchTerms || {};
        let allFactories = [];
        if (window._sb) {
          try {
            let q = window._sb.from('factories').select('*').eq('hidden', false);
            const kw = (st.keywords || []).concat(st.industries || []).filter(Boolean);
            if (kw.length > 0) {
              q = q.ilike('summary', `%${kw[0]}%`);
            }
            q = q.order('id', { ascending: true }).limit(100);
            const { data: rows } = await q;
            if (rows && rows.length) allFactories = rows.map(window._dbRowToFactory);
          } catch (_) {}
        }
        if (!allFactories.length) allFactories = (window.MFG_DATA || {}).FACTORIES || [];

        const bestPossible =
          (st.industries || []).length * 30 +
          (st.processes || []).length * 25 +
          (st.materials || []).length * 15 +
          (st.keywords || []).length * 18;

        const scored = allFactories
          .filter(f => !f.hidden)
          .map(f => ({ ...f, _score: scoreFactory(f, st) }))
          .filter(f => f._score > 0)
          .sort((a, b) => b._score - a._score)
          .slice(0, 6)
          .map(f => ({
            ...f,
            _matchPct: bestPossible > 0
              ? Math.min(98, Math.max(38, Math.round((f._score / bestPossible) * 100)))
              : 60,
          }));
        setMatchedFactories(scored);
      }
    } catch (e) {
      setAiError('AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  const rec3 = aiResult ? aiResult.topCategories : SX_RECOMMEND_3;
  const topMatch = rec3[0] ? rec3[0].match : 92;

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
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
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
          <Icon name="search" size={15} stroke={2.4}/>
          {loading ? '분석 중…' : '검색'}
        </button>
      </div>

      {loading && (
        <div className="sx-ai-loading">
          <span className="sx-mode-pulse"/>
          Claude가 공급망을 분석하고 있습니다...
        </div>
      )}

      {aiError && (
        <div className="sx-ai-error">{aiError}</div>
      )}

      {aiResult && (
        <div className="sx-supply-chain">
          <div className="sx-supply-header">
            <Icon name="sparkle" size={13} stroke={2.4}/>
            공급망 분석
            <span className="sx-supply-intent">· {aiResult.intent}</span>
          </div>
          <div className="sx-supply-steps">
            {aiResult.supplyChain.map((s, i) => (
              <React.Fragment key={i}>
                <div className="sx-supply-step">
                  <div className="sx-supply-step-num">{s.step}</div>
                  <div className="sx-supply-step-label">{s.label}</div>
                  <div className="sx-supply-step-detail">{s.detail}</div>
                </div>
                {i < aiResult.supplyChain.length - 1 && (
                  <div className="sx-supply-arrow">
                    <Icon name="chevron_right" size={16} stroke={2}/>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {matchedFactories.length > 0 && (
        <div className="sx-match-section">
          <div className="sx-match-header">
            <h2>
              <Icon name="factory" size={15} stroke={2}/>
              매칭 제조사
            </h2>
            <span className="sx-match-count">{matchedFactories.length}개사 매칭</span>
          </div>
          <div className="sx-match-grid">
            {matchedFactories.map(f => (
              <div key={f.id} className="sx-match-card-wrap">
                <div
                  className="sx-match-score-badge"
                  style={{ background: f._matchPct >= 70 ? '#16a34a' : f._matchPct >= 50 ? '#d97706' : '#64748b' }}
                >
                  <span className="sx-match-score-pct">{f._matchPct}%</span>
                  <span className="sx-match-score-label">매칭</span>
                </div>
                <ManufacturerCard
                  f={f}
                  onOpen={(id) => {
                    if (!window._factoryCache) window._factoryCache = {};
                    window._factoryCache[id] = f;
                    onOpenFactory(id);
                  }}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sx-results">
        {(() => {
          const displayConsulting = consulting || { unitCost: 'AI 분석 중...', moqGuide: '검색 후 표시', leadTime: '-', budgetRange: '-', certRequired: [], caution: '검색어를 입력해주세요' };
          return (
            <div className="sx-consulting">
              <div className="sx-consulting-head">
                <Icon name="sparkle" size={14} stroke={2.4}/>
                AI 사전 컨설팅
              </div>
              <div className="sx-consulting-grid">
                {displayConsulting.unitCost && (
                  <div className="sx-consulting-item">
                    <span className="sx-consulting-label">예상 단가</span>
                    <span className="sx-consulting-val">{displayConsulting.unitCost}</span>
                  </div>
                )}
                {displayConsulting.moqGuide && (
                  <div className="sx-consulting-item">
                    <span className="sx-consulting-label">최소 발주량</span>
                    <span className="sx-consulting-val">{displayConsulting.moqGuide}</span>
                  </div>
                )}
                {displayConsulting.leadTime && (
                  <div className="sx-consulting-item">
                    <span className="sx-consulting-label">리드타임</span>
                    <span className="sx-consulting-val">{displayConsulting.leadTime}</span>
                  </div>
                )}
                {displayConsulting.budgetRange && (
                  <div className="sx-consulting-item">
                    <span className="sx-consulting-label">예산 범위</span>
                    <span className="sx-consulting-val">{displayConsulting.budgetRange}</span>
                  </div>
                )}
                {(displayConsulting.certRequired || []).length > 0 && (
                  <div className="sx-consulting-item">
                    <span className="sx-consulting-label">필요 인증</span>
                    <span className="sx-consulting-val">{displayConsulting.certRequired.join(' · ')}</span>
                  </div>
                )}
                {displayConsulting.caution && (
                  <div className="sx-consulting-item sx-consulting-caution">
                    <span className="sx-consulting-label">주의사항</span>
                    <span className="sx-consulting-val">{displayConsulting.caution}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        {smart ? (
          <>
            <div className="sx-mode-banner is-on">
              <div className="sx-mode-banner-icon">
                <Icon name="sparkle" size={16} stroke={2.4}/>
              </div>
              <div>
                <strong>"{query}"</strong>에 가장 적합한 <strong>3개 카테고리</strong>를 추출했습니다 ·
                {aiResult ? 'Claude 실시간 분석 완료' : '매칭률·거래량·리드타임 종합 분석'}
              </div>
              <div className="sx-mode-banner-meta">
                <span className="sx-mode-pulse"/>
                {aiResult ? 'Claude AI' : 'AI 분석 0.4초'}
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
                  <div className="sx-rec-h-bar-fill" style={{ width: `${topMatch}%` }}/>
                </div>
                <strong>{topMatch}%</strong>
              </div>
            </div>

            <div className="sx-rec-grid">
              {rec3.map((r, i) => (
                <button key={r.id || i} className="sx-rec" onClick={() => onNav && onNav('list')}>
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

      <div className="sx-related">
        <span className="sx-related-k">
          <Icon name="sparkle" size={11} stroke={2.2}/>
          연관 키워드:
        </span>
        {SX_RELATED_KEYWORDS.map(kw => (
          <button
            key={kw}
            className={`sx-related-chip ${activeKw === kw ? 'is-active' : ''}`}
            onClick={() => setActiveKw(activeKw === kw ? null : kw)}
          >
            {kw}
          </button>
        ))}
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


// ──────────────────────────────────────────────────────────
// 가입 / 로그인 / 인증 / 온보딩 (4단계)
// ──────────────────────────────────────────────────────────
const { useState: useAuthState, useEffect: useAuthEffect, useRef: useAuthRef } = React;

