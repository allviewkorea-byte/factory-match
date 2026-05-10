// ══════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════
// 메인 카피 후보:
// 1. "AI가 찾아주는 우리 회사에 딱 맞는 제조공장"
// 2. "30만 제조공장에서 단 4초 만에 매칭"
// 3. "공정과 소재만 입력하세요"
const HOME_HEADLINE = "AI가 찾아주는 우리 회사에 딱 맞는 제조공장";

// 보조 카피 후보:
// 1. "공정과 소재만 입력하세요. 매칭부터 견적까지."
// 2. "자연어로 검색하고, 다수 공장에 동시 견적을 받아보세요."
// 3. "전국 12,000+ 제조공장 데이터베이스"
const HOME_SUBLINE = "공정과 소재만 입력하세요. 매칭부터 견적까지.";

const PLACEHOLDER_EXAMPLES = [
  "예: 사출 ABS 부품 100개",
  "예: CNC 알루미늄 가공",
  "예: 프레스 철판 가공",
  "예: 용접 SUS304 소량",
  "예: 판금 알루미늄 시제품",
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

const HOME_TAGS = ['CNC 가공', '사출 성형', '프레스', '봉제', '식품가공'];

const ParticleCanvas = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COLORS = ['#4F8EF7', '#A78BFA', '#60A5FA'];
    const COUNT = 88;
    const ATTRACT_R = 150;
    const LINE_R = 90;
    const LINE_R2 = LINE_R * LINE_R;

    let W = 0, H = 0;
    const mouse = { x: -9999, y: -9999 };
    let animId = 0;
    const pts = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      pts.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        pts.push({
          x, y, ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 2 + Math.random() * 2,
          a: 0.4 + Math.random() * 0.3,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < ATTRACT_R && d > 1) {
          const f = (1 - d / ATTRACT_R) * 0.12;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        } else {
          p.vx += (p.ox - p.x) * 0.003;
          p.vy += (p.oy - p.y) * 0.003;
          p.vx += (Math.random() - 0.5) * 0.018;
          p.vy += (Math.random() - 0.5) * 0.018;
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length - 1; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINE_R2) {
            ctx.globalAlpha = (1 - d2 / LINE_R2) * 0.13;
            ctx.strokeStyle = '#7BA4F5';
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(tick);
    }

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    init();
    tick();

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

const HomePage = ({ onSearch, onOpenFactory, density, authed, onGate, onNav }) => {
  const [q, setQ] = useStateP('');
  const [isFocused, setIsFocused] = useStateP(false);
  const [placeholderIndex, setPlaceholderIndex] = useStateP(0);
  const [loading, setLoading] = useStateP(false);
  const [aiResults, setAiResults] = useStateP(null);
  const [consulting, setConsulting] = useStateP(null);
  const [matchedFactoryDetails, setMatchedFactoryDetails] = useStateP([]);
  const [factoryCount, setFactoryCount] = useStateP(null);

  // Fetch live factory count from Supabase on mount
  useEffectP(() => {
    if (!window._sb) return;
    window._sb.from('factories').select('id', { count: 'estimated', head: true })
      .then(({ count }) => { if (count != null) setFactoryCount(count); })
      .catch(() => {});
  }, []);

  // Rotate placeholder text while idle
  useEffectP(() => {
    if (isFocused || q.length > 0) return;
    const id = setInterval(() => setPlaceholderIndex(p => (p + 1) % PLACEHOLDER_EXAMPLES.length), 3000);
    return () => clearInterval(id);
  }, [isFocused, q]);

  const handleAiSearch = async () => {
    const query = q.trim();
    if (!query) return;
    window.logVisitor?.('search', { query });
    if (!authed) { onGate?.('search'); return; }
    setLoading(true);
    try {
      const resp = await fetch('/.netlify/functions/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) throw new Error('API 오류');
      const data = await resp.json();
      data.topCategories = (data.topCategories || []).map((c, i) => ({
        glyph: 'metal', count: 0, avgLead: '협의', avgPrice: '협의', ...c, id: c.id || `ai-${i}`,
      }));
      setAiResults(data);
      if (data.consulting) setConsulting(data.consulting);

      // Hydrate matched factory details (top 3)
      const matched = data.matchedFactories || [];
      if (matched.length > 0) {
        const ids = matched.slice(0, 3).map(m => m.id);
        let details = [];
        if (window._sb) {
          try {
            const { data: rows } = await window._sb.from('factories').select('*').in('id', ids);
            if (rows && rows.length) {
              const byId = {};
              rows.map(window._dbRowToFactory).forEach(f => { byId[f.id] = f; });
              details = matched.slice(0, 3).map(m => byId[m.id] ? { ...byId[m.id], _matchPct: m.matchPct } : null).filter(Boolean);
            }
          } catch (_) {}
        }
        if (!details.length) {
          const byId = {};
          ((window.MFG_DATA || {}).FACTORIES || []).forEach(f => { byId[f.id] = f; });
          details = matched.slice(0, 3).map(m => byId[m.id] ? { ...byId[m.id], _matchPct: m.matchPct } : null).filter(Boolean);
        }
        setMatchedFactoryDetails(details);
      } else {
        setMatchedFactoryDetails([]);
      }
    } catch (e) {
      console.error('AI match failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = !!(aiResults);

  return (
    <div className="page page-home">
      <ParticleCanvas />
      <div className={`home-hero ${hasResults ? 'home-hero-compact' : ''}`}>
        {!hasResults && <h1 className="home-headline">AI가 찾아주는 우리 회사에 딱 맞는 <span className="home-headline-accent">제조공장</span></h1>}
        {!hasResults && <p className="home-subline">{HOME_SUBLINE}</p>}

        <div className="home-search-wrapper">
          <input
            type="text"
            className="home-search-input"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={e => { if (e.key === 'Enter') handleAiSearch(); }}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
          />
          {q && (
            <button className="home-search-clear" onClick={() => setQ('')} aria-label="지우기">
              <Icon name="close" size={12} stroke={2.4}/>
            </button>
          )}
          <button className="home-search-btn" onClick={handleAiSearch} disabled={loading}>
            {loading ? <span className="home-search-spinner"/> : <Icon name="search" size={20} stroke={2.2}/>}
          </button>
        </div>

        {loading && (
          <div className="home-search-loading">
            <span className="home-loading-spinner"/>
            <span>AI가 분석 중…</span>
          </div>
        )}

        {!hasResults && !loading && (
          <div className="home-tag-row">
            {HOME_TAGS.map(tag => (
              <button key={tag} className="home-tag-pill" onClick={() => { setQ(tag); }}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {!hasResults && !loading && (
          <div className="home-stats-bar">
            전국 <strong>{factoryCount != null ? factoryCount.toLocaleString() + '개' : '217,054개'}</strong> 공장 DB &nbsp;·&nbsp; <strong>1,192개</strong> 사업자 인증
          </div>
        )}
      </div>

      {hasResults && (
        <div className="home-results">

          {/* 1. 공급망 분석 */}
          {!loading && aiResults?.supplyChain?.length > 0 && (
            <div className="sx-supply-chain">
              <div className="sx-supply-header">
                <Icon name="sparkle" size={13} stroke={2.4}/>
                공급망 분석
                {aiResults.intent && <span className="sx-supply-intent">· {aiResults.intent}</span>}
              </div>
              <div className="sx-supply-steps">
                {aiResults.supplyChain.map((s, i) => (
                  <React.Fragment key={i}>
                    <div className="sx-supply-step">
                      <div className="sx-supply-step-num">{s.step}</div>
                      <div className="sx-supply-step-label">{s.label}</div>
                      <div className="sx-supply-step-detail">{s.detail}</div>
                    </div>
                    {i < aiResults.supplyChain.length - 1 && (
                      <div className="sx-supply-arrow"><Icon name="chevron_right" size={16} stroke={2}/></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* 2. 매칭 제조사 */}
          {!loading && matchedFactoryDetails.length > 0 && (
            <div className="sx-match-section">
              <div className="sx-match-header">
                <h2><Icon name="factory" size={15} stroke={2}/>매칭 제조사</h2>
                <span className="sx-match-count">{matchedFactoryDetails.length}개사 매칭</span>
              </div>
              <div className="sx-match-grid">
                {matchedFactoryDetails.map(f => (
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
                      density={density}
                      onOpen={(id) => {
                        if (!window._factoryCache) window._factoryCache = {};
                        window._factoryCache[id] = f;
                        onOpenFactory?.(id);
                      }}
                      compact
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. AI 사전 컨설팅 */}
          {!loading && consulting && (
            <div className="sx-consulting">
              <div className="sx-consulting-head">
                <Icon name="sparkle" size={14} stroke={2.4}/>
                AI 사전 컨설팅
              </div>
              <div className="sx-consulting-grid">
                {consulting.unitCost && <div className="sx-consulting-item"><span className="sx-consulting-label">예상 단가</span><span className="sx-consulting-val">{consulting.unitCost}</span></div>}
                {consulting.moqGuide && <div className="sx-consulting-item"><span className="sx-consulting-label">최소 발주량</span><span className="sx-consulting-val">{consulting.moqGuide}</span></div>}
                {consulting.leadTime && <div className="sx-consulting-item"><span className="sx-consulting-label">리드타임</span><span className="sx-consulting-val">{consulting.leadTime}</span></div>}
                {consulting.budgetRange && <div className="sx-consulting-item"><span className="sx-consulting-label">예산 범위</span><span className="sx-consulting-val">{consulting.budgetRange}</span></div>}
                {(consulting.certRequired || []).length > 0 && <div className="sx-consulting-item"><span className="sx-consulting-label">필요 인증</span><span className="sx-consulting-val">{consulting.certRequired.join(' · ')}</span></div>}
                {consulting.caution && <div className="sx-consulting-item sx-consulting-caution"><span className="sx-consulting-label">주의사항</span><span className="sx-consulting-val">{consulting.caution}</span></div>}
              </div>
            </div>
          )}

          {/* 4. 추천 카테고리 */}
          {!loading && aiResults?.topCategories?.length > 0 && (
            <>
              <div className="sx-mode-banner is-on">
                <div className="sx-mode-banner-icon"><Icon name="sparkle" size={16} stroke={2.4}/></div>
                <div>
                  <strong>"{q}"</strong>에 가장 적합한 <strong>3개 카테고리</strong>를 추출했습니다 · 매칭률·거래량·리드타임 종합 분석
                </div>
                <div className="sx-mode-banner-meta">
                  <span className="sx-mode-pulse"/>
                  Claude AI
                </div>
              </div>
              <div className="sx-rec-h">
                <h2><Icon name="sparkle" size={16} stroke={2.2}/>추천 카테고리</h2>
              </div>
              <div className="sx-rec-grid">
                {aiResults.topCategories.map((r, i) => (
                  <button key={r.id || i} className="sx-rec" onClick={() => onSearch?.(r.title)}>
                    <div className="sx-rec-rank">RANK <strong>0{i + 1}</strong></div>
                    <div className="sx-rec-glyph"><SXGlyph kind={r.glyph}/></div>
                    <div>
                      <div className="sx-rec-title-row">
                        <h3>{r.title}</h3>
                        <span className="sx-rec-match"><Icon name="sparkle" size={9} stroke={2.6}/>매칭 {r.match}%</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-num)', marginTop: 2, fontWeight: 500 }}>{r.en}</div>
                    </div>
                    <p className="sx-rec-desc">{r.desc}</p>
                    <div className="sx-rec-tags">{(r.tags || []).map(t => <span key={t} className="sx-rec-tag">{t}</span>)}</div>
                    <div className="sx-rec-stats">
                      <div className="sx-rec-count">
                        <span className="sx-rec-count-n">{r.count}</span>
                        <span className="sx-rec-count-l">개사</span>
                      </div>
                      <div className="sx-rec-stats-meta">
                        {r.avgLead && <span>평균 리드 <strong>{r.avgLead}</strong></span>}
                        {r.avgPrice && <span>단가 <strong>{r.avgPrice}</strong></span>}
                      </div>
                    </div>
                    <div className="sx-rec-cta">
                      <span>제조사 더 보기</span>
                      <Icon name="arrow_right" size={15} stroke={2.4} className="sx-rec-cta-arrow"/>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

