// 페이지: Home, List, Detail, RFQ, MyPage

const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React;

// ══════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════
const HomePage = ({ onNav, onOpenFactory, onSearch, density, heroVariant }) => {
  const { FACTORIES, PROCESSES, CATEGORY_CARDS, TRENDING_SEARCHES } = window.MFG_DATA;
  const [q, setQ] = useStateP('');
  const [showAuto, setShowAuto] = useStateP(false);

  // tier 폐지 → 평점 + 거래량 가중치로 추천
  const recommended = FACTORIES
    .slice()
    .sort((a, b) => (b.rating * 100 + b.deals / 10) - (a.rating * 100 + a.deals / 10))
    .slice(0, 4);
  const newest = FACTORIES.slice().sort((a, b) => b.founded - a.founded).slice(0, 3);

  const autoComplete = useMemoP(() => {
    if (!q) return TRENDING_SEARCHES.slice(0, 5);
    const ql = q.toLowerCase();
    const matches = [];
    PROCESSES.forEach(p => {
      if (p.label.includes(q) || p.en.toLowerCase().includes(ql)) {
        matches.push({ kind: 'process', label: p.label, en: p.en });
      }
    });
    FACTORIES.forEach(f => {
      if (f.name.includes(q)) {
        matches.push({ kind: 'factory', label: f.name, en: f.en, id: f.id });
      }
    });
    return matches.slice(0, 6);
  }, [q]);

  return (
    <div className="page page-home">
      {/* Hero */}
      <section className={`hero hero-${heroVariant}`}>
        <div className="hero-bg">
          <div className="hero-grid"/>
          <div className="hero-orb hero-orb-1"/>
          <div className="hero-orb hero-orb-2"/>
        </div>
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"/>
            <span>국내 검증 제조사 <strong>2,847</strong>곳 · 누적 거래 <strong>₩142억</strong></span>
          </div>
          <h1 className="hero-title">
            제조 조건만 입력하세요.<br/>
            <span className="hero-title-em">맞는 공장이 먼저 찾아옵니다.</span>
          </h1>
          <p className="hero-sub">
            가공방식 · 소재 · 제품 키워드로 검색하면 적합한 제조사가 자동 매칭됩니다.
            여러 곳에 동시 견적 요청, 평균 응답 4시간.
          </p>

          {/* Search */}
          <div className={`searchbox ${showAuto ? 'is-open' : ''}`}>
            <div className="searchbox-row">
              <div className="searchbox-cell">
                <span className="searchbox-k">가공방식 · 소재 · 제품</span>
                <input
                  className="searchbox-input"
                  placeholder="예: CNC + 알루미늄, 사출 + 케이스"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setShowAuto(true)}
                  onBlur={() => setTimeout(() => setShowAuto(false), 180)}
                />
              </div>
              <div className="searchbox-divider"/>
              <div className="searchbox-cell searchbox-cell-narrow">
                <span className="searchbox-k">지역</span>
                <select className="searchbox-input" defaultValue="">
                  <option value="">전국</option>
                  <option>수도권</option>
                  <option>경상권</option>
                  <option>충청권</option>
                  <option>전라권</option>
                </select>
              </div>
              <button className="searchbox-btn" onClick={() => onSearch?.(q)}>
                <Icon name="search" size={18} stroke={2.2}/>
                <span>검색</span>
              </button>
            </div>
            {showAuto && (
              <div className="searchbox-auto">
                <div className="searchbox-auto-head">
                  {q ? '검색 제안' : '인기 검색'}
                  <Icon name="flame" size={11} stroke={2}/>
                </div>
                {autoComplete.map((a, i) => (
                  <button
                    key={i}
                    className="searchbox-auto-item"
                    onMouseDown={() => {
                      if (a.kind === 'factory') onOpenFactory(a.id);
                      else onSearch?.(a.label);
                    }}
                  >
                    <Icon name={a.kind === 'factory' ? 'factory' : 'search'} size={13} stroke={1.8}/>
                    <span className="auto-label">{a.label || a}</span>
                    {a.en && <span className="auto-en">{a.en}</span>}
                    <Icon name="arrow_up_right" size={12} stroke={1.8} className="auto-arrow"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hero-trending">
            <span className="hero-trending-k">인기:</span>
            {TRENDING_SEARCHES.map(t => (
              <button key={t} className="hero-trending-item" onClick={() => onSearch?.(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className="hero-actions">
            <button className="btn-ghost-on-hero" onClick={() => onNav('rfq')}>
              <Icon name="upload" size={14} stroke={2}/>
              도면 업로드 매칭
              <Badge tone="amber" size="xs">BETA</Badge>
            </button>
            <button className="btn-ghost-on-hero" onClick={() => onNav('list')}>
              <Icon name="map" size={14} stroke={2}/>
              지도에서 찾기
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">가공 방식별 탐색</h2>
            <p className="section-sub">Browse by process · 8개 가공방식 · 891개 제조사</p>
          </div>
          <button className="link-btn" onClick={() => onNav('list')}>
            전체 보기 <Icon name="chevron_right" size={14} stroke={2}/>
          </button>
        </div>
        <div className="cat-grid">
          {CATEGORY_CARDS.map((c, i) => {
            const proc = PROCESSES.find(p => p.id === c.process);
            return (
              <button key={c.process} className="cat-card" onClick={() => onSearch?.(proc.label)}>
                <div className="cat-card-vis" data-cat={c.process}>
                  <CatGlyph kind={c.process}/>
                </div>
                <div className="cat-card-body">
                  <div className="cat-card-row">
                    <h3 className="cat-card-title">{proc.label}</h3>
                    {c.hot && (
                      <span className="cat-hot">
                        <Icon name="flame" size={10} stroke={2.2}/> HOT
                      </span>
                    )}
                  </div>
                  <div className="cat-card-meta">
                    <span className="cat-card-en">{proc.en}</span>
                    <span className="cat-card-count">{c.count}개사</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recommended for you */}
      <section className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">
              추천 제조사
              <span className="section-title-tag">
                <Icon name="sparkle" size={12} stroke={2.2}/>
                For YD Innovations
              </span>
            </h2>
            <p className="section-sub">
              회원가입 시 입력하신 <strong>전자/전기 + 사출 + ABS · MOQ 1,000</strong> 조건 기반
            </p>
          </div>
          <button className="link-btn" onClick={() => onNav('list')}>
            더보기 <Icon name="chevron_right" size={14} stroke={2}/>
          </button>
        </div>
        <div className="rec-grid">
          {recommended.map(f => (
            <ManufacturerCard
              key={f.id}
              f={f}
              onOpen={onOpenFactory}
              density={density}
            />
          ))}
        </div>
      </section>

      {/* Map preview + new */}
      <section className="section section-split">
        <div className="split-l">
          <div className="section-head">
            <div>
              <h2 className="section-title">지도에서 탐색</h2>
              <p className="section-sub">전국 12개사 위치 · 클릭하여 상세 보기</p>
            </div>
            <button className="link-btn" onClick={() => onNav('list')}>
              전체 지도 <Icon name="arrow_up_right" size={13} stroke={2}/>
            </button>
          </div>
          <div className="map-preview" onClick={() => onNav('list')}>
            <KoreaMap factories={FACTORIES} onPin={() => onNav('list')}/>
            <div className="map-preview-cta">
              <Icon name="map" size={14} stroke={2}/>
              지도 페이지로 이동
            </div>
          </div>
        </div>
        <div className="split-r">
          <div className="section-head">
            <div><h2 className="section-title">신규 등록</h2></div>
          </div>
          <div className="new-list">
            {newest.map(f => (
              <button key={f.id} className="new-item" onClick={() => onOpenFactory(f.id)}>
                <div className="new-img" style={{ background: f.image }}>
                  <div className="mcard-img-stripes"/>
                </div>
                <div className="new-body">
                  <h4>{f.name}</h4>
                  <p>{f.city} · {f.founded}년 설립</p>
                  <div className="new-tags">
                    {f.processes.slice(0, 2).map(pid => {
                      const p = PROCESSES.find(x => x.id === pid);
                      return <span key={pid} className="mtag mtag-sm">{p?.label}</span>;
                    })}
                  </div>
                </div>
                <Icon name="chevron_right" size={16} stroke={2} className="new-arrow"/>
              </button>
            ))}
          </div>
          <div className="trust-box">
            <h3>제조사 신뢰도 지표</h3>
            <ul>
              <li><Icon name="badge_check" size={14} stroke={2}/> 인증 검증 · ISO·KC·IATF</li>
              <li><Icon name="clock" size={14} stroke={2}/> 평균 응답 시간 측정</li>
              <li><Icon name="star" size={14} stroke={2}/> 실거래 기반 리뷰</li>
              <li><Icon name="chart" size={14} stroke={2}/> 누적 거래 이력 공개</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mini glyphs for category cards (geometric, not iconographic)
const CatGlyph = ({ kind }) => {
  const maps = {
    cnc: (
      <svg viewBox="0 0 64 40" fill="none">
        <rect x="8" y="22" width="48" height="3" fill="currentColor" opacity=".25"/>
        <rect x="20" y="8" width="3" height="20" fill="currentColor"/>
        <rect x="14" y="6" width="15" height="4" fill="currentColor" opacity=".7"/>
        <circle cx="44" cy="22" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="44" cy="22" r="2" fill="currentColor"/>
      </svg>
    ),
    injection: (
      <svg viewBox="0 0 64 40" fill="none">
        <rect x="6" y="14" width="22" height="12" rx="2" fill="currentColor" opacity=".25"/>
        <rect x="28" y="18" width="14" height="4" fill="currentColor"/>
        <rect x="42" y="10" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="46" y="16" width="8" height="8" fill="currentColor" opacity=".5"/>
      </svg>
    ),
    press: (
      <svg viewBox="0 0 64 40" fill="none">
        <rect x="14" y="6" width="36" height="6" fill="currentColor" opacity=".25"/>
        <rect x="22" y="12" width="20" height="10" fill="currentColor"/>
        <rect x="8" y="26" width="48" height="4" fill="currentColor" opacity=".4"/>
        <path d="M32 22v4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    mold: (
      <svg viewBox="0 0 64 40" fill="none">
        <rect x="10" y="8" width="20" height="24" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="34" y="8" width="20" height="24" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 14h8v12h-8zM40 14h8v12h-8z" fill="currentColor" opacity=".25"/>
        <circle cx="20" cy="20" r="2" fill="currentColor"/>
        <circle cx="44" cy="20" r="2" fill="currentColor"/>
      </svg>
    ),
    welding: (
      <svg viewBox="0 0 64 40" fill="none">
        <path d="M10 30 L24 14 L38 30" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="24" cy="14" r="2.5" fill="currentColor"/>
        <path d="M24 14 L40 8 L46 18" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 26 L20 22 M22 28 L28 22" stroke="currentColor" strokeWidth="1" opacity=".5"/>
      </svg>
    ),
    painting: (
      <svg viewBox="0 0 64 40" fill="none">
        <rect x="8" y="20" width="36" height="12" rx="1" fill="currentColor" opacity=".25"/>
        <path d="M44 26 L54 22 L54 30 Z" fill="currentColor"/>
        <circle cx="50" cy="14" r="1.5" fill="currentColor" opacity=".6"/>
        <circle cx="55" cy="18" r="1" fill="currentColor" opacity=".6"/>
        <circle cx="48" cy="20" r="1" fill="currentColor" opacity=".6"/>
      </svg>
    ),
  };
  return <div className="cat-glyph">{maps[kind] || maps.cnc}</div>;
};

// ══════════════════════════════════════════════════════════
// LIST + MAP
// ══════════════════════════════════════════════════════════
const ListPage = ({ onOpenFactory, onAddRFQ, rfqIds, density, initialQuery }) => {
  const { FACTORIES, PROCESSES } = window.MFG_DATA;
  const [query, setQuery] = useStateP(initialQuery || '');
  const [activeProcess, setActiveProcess] = useStateP('all');
  const [activeRegion, setActiveRegion] = useStateP('all');
  const [moqMax, setMoqMax] = useStateP(10000);
  const [oemOnly, setOemOnly] = useStateP(false);
  const [exportOnly, setExportOnly] = useStateP(false);
  const [sort, setSort] = useStateP('match');
  const [hovered, setHovered] = useStateP(null);
  const [selected, setSelected] = useStateP('f1');

  const filtered = useMemoP(() => {
    let arr = FACTORIES.filter(f => {
      if (activeProcess !== 'all' && !f.processes.includes(activeProcess)) return false;
      if (activeRegion !== 'all' && f.region !== activeRegion) return false;
      if (f.moq > moqMax) return false;
      if (oemOnly && !f.oem) return false;
      if (exportOnly && !f.export) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = (f.name + f.en + f.city + f.summary + f.materials.join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sort === 'response') arr.sort((a, b) => a.responseHr - b.responseHr);
    else if (sort === 'deals') arr.sort((a, b) => b.deals - a.deals);
    else arr.sort((a, b) => (b.rating * 50 + b.deals / 10) - (a.rating * 50 + a.deals / 10));
    return arr;
  }, [activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query]);

  const selectedFactory = filtered.find(f => f.id === selected) || filtered[0];

  return (
    <div className="page page-list">
      {/* Sub-search bar */}
      <div className="list-search">
        <div className="list-search-input">
          <Icon name="search" size={16} stroke={2}/>
          <input
            placeholder="가공방식 · 소재 · 제품 · 회사명"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="ls-clear" onClick={() => setQuery('')}>
              <Icon name="close" size={12} stroke={2}/>
            </button>
          )}
        </div>
        <div className="list-search-chips">
          <Chip active={activeProcess === 'all'} onClick={() => setActiveProcess('all')}>전체</Chip>
          {PROCESSES.slice(0, 6).map(p => (
            <Chip
              key={p.id}
              active={activeProcess === p.id}
              onClick={() => setActiveProcess(activeProcess === p.id ? 'all' : p.id)}
            >
              {p.label}
            </Chip>
          ))}
          <div className="chip-sep"/>
          <Chip active={oemOnly} onClick={() => setOemOnly(!oemOnly)}>OEM</Chip>
          <Chip active={exportOnly} onClick={() => setExportOnly(!exportOnly)}>수출 가능</Chip>
        </div>
      </div>

      <div className="list-shell">
        {/* Left: filters + list */}
        <div className="list-left">
          <aside className="filters">
            <div className="filters-section">
              <div className="filters-h">
                <h4>지역</h4>
                <button className="filters-reset" onClick={() => setActiveRegion('all')}>초기화</button>
              </div>
              <div className="filters-radios">
                {[
                  { id: 'all', label: '전국' },
                  { id: 'gyeonggi', label: '수도권 (서울·경기·인천)' },
                  { id: 'incheon', label: '인천' },
                  { id: 'gyeongnam', label: '경상남도' },
                  { id: 'busan', label: '부산' },
                  { id: 'ulsan', label: '울산' },
                ].map(r => (
                  <label key={r.id} className={`filter-radio ${activeRegion === r.id ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      checked={activeRegion === r.id}
                      onChange={() => setActiveRegion(r.id)}
                    />
                    <span className="filter-radio-dot"/>
                    <span>{r.label}</span>
                    <span className="filter-radio-count">
                      {r.id === 'all' ? FACTORIES.length : FACTORIES.filter(f => f.region === r.id).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filters-section">
              <div className="filters-h">
                <h4>최소 주문 수량 (MOQ)</h4>
                <span className="filters-val">≤ {moqMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="filter-range"
                min="50"
                max="10000"
                step="50"
                value={moqMax}
                onChange={(e) => setMoqMax(+e.target.value)}
              />
              <div className="filter-range-labels">
                <span>50</span><span>10,000+</span>
              </div>
            </div>

            <div className="filters-section">
              <h4>인증</h4>
              <div className="filters-checks">
                {['ISO 9001', 'IATF 16949', 'KC', 'CE', 'HACCP'].map(c => (
                  <label key={c} className="filter-check">
                    <input type="checkbox"/>
                    <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filters-section">
              <h4>리드타임</h4>
              <div className="filters-checks">
                {['7일 이내', '14일 이내', '30일 이내', '협의'].map(c => (
                  <label key={c} className="filter-check">
                    <input type="checkbox"/>
                    <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="list-results">
            <div className="list-results-head">
              <div>
                <strong>{filtered.length}</strong>개 제조사
                <span className="results-sub">조건에 맞는 결과</span>
              </div>
              <div className="list-results-sort">
                <span>정렬</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="match">매칭도순</option>
                  <option value="rating">평점순</option>
                  <option value="response">응답속도순</option>
                  <option value="deals">거래량순</option>
                </select>
              </div>
            </div>
            <div className="list-results-grid">
              {filtered.map(f => (
                <div
                  key={f.id}
                  onMouseEnter={() => setHovered(f.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(f.id)}
                  className={`list-result-wrap ${selected === f.id ? 'is-active' : ''}`}
                >
                  <ManufacturerCard
                    f={f}
                    onOpen={onOpenFactory}
                    onSelect={onAddRFQ}
                    selected={rfqIds.includes(f.id)}
                    density={density}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: map */}
        <div className="list-map">
          <KoreaMap
            factories={filtered}
            selectedId={selected}
            hoveredId={hovered}
            onPin={(id) => setSelected(id)}
          />
          {selectedFactory && (
            <div className="map-side">
              <div className="map-side-img" style={{ background: selectedFactory.image }}>
                <div className="mcard-img-stripes"/>
                <button className="map-side-close" onClick={() => setSelected(null)}>
                  <Icon name="close" size={14} stroke={2}/>
                </button>
              </div>
              <div className="map-side-body">
                <div className="map-side-row">
                  <h3>{selectedFactory.name}</h3>
                  <div className="mcard-rating">
                    <Icon name="star" size={11} stroke={2}/>
                    <strong>{selectedFactory.rating}</strong>
                  </div>
                </div>
                <p className="map-side-sub">
                  <Icon name="pin" size={11} stroke={2}/>
                  {selectedFactory.city}
                </p>
                <p className="map-side-desc">{selectedFactory.summary}</p>
                <div className="map-side-stats">
                  <div><span>MOQ</span><strong>{selectedFactory.moq.toLocaleString()} {selectedFactory.moqUnit || '피스'}</strong></div>
                  <div><span>리드타임</span><strong>{selectedFactory.leadDays}일</strong></div>
                  <div><span>응답</span><strong>{selectedFactory.responseHr}h</strong></div>
                </div>
                <div className="map-side-actions">
                  <button className="btn btn-secondary" onClick={() => onOpenFactory(selectedFactory.id)}>
                    상세 보기
                  </button>
                  <button
                    className={`btn btn-primary ${rfqIds.includes(selectedFactory.id) ? 'is-added' : ''}`}
                    onClick={() => onAddRFQ(selectedFactory.id)}
                  >
                    {rfqIds.includes(selectedFactory.id) ? <><Icon name="check" size={13} stroke={2.4}/> 견적함</> : <><Icon name="plus" size={13} stroke={2.4}/> 견적 요청</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// FACTORY DETAIL
// ══════════════════════════════════════════════════════════
const DetailPage = ({ factoryId, onBack, onAddRFQ, rfqIds, onChat, backLabel }) => {
  const { FACTORIES, PROCESSES, PRODUCTS, INDUSTRIES } = window.MFG_DATA;
  const f = FACTORIES.find(x => x.id === factoryId) || FACTORIES[0];
  const [tab, setTab] = useStateP('overview');

  const procLabels = f.processes.map(p => PROCESSES.find(x => x.id === p)?.label);
  const prodLabels = f.products.map(p => PRODUCTS.find(x => x.id === p)?.label);
  const indLabels = f.industries.map(p => INDUSTRIES.find(x => x.id === p)?.label);
  const inRfq = rfqIds.includes(f.id);

  return (
    <div className="page page-detail">
      <div className="detail-bar">
        <button className="back-btn" onClick={onBack}>
          <Icon name="chevron_right" size={14} stroke={2} className="back-arrow"/>
          {backLabel || '제조사 목록으로'}
        </button>
        <div className="detail-bar-actions">
          <button className="icon-btn">
            <Icon name="heart" size={14} stroke={2}/>
            관심 제조사
          </button>
          <button className="icon-btn" onClick={() => onChat?.(f.id)}>
            <Icon name="chat" size={14} stroke={2}/>
            채팅 시작
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="detail-hero">
        <div className="detail-hero-img" style={{ background: f.image }}>
          <div className="mcard-img-stripes"/>
          <div className="detail-hero-img-label">FACTORY PHOTO · {f.en.toUpperCase()}</div>
          <div className="detail-hero-thumbs">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="detail-thumb" style={{ background: f.image, opacity: 0.6 + i * 0.1 }}>
                <div className="mcard-img-stripes"/>
              </div>
            ))}
          </div>
        </div>
        <div className="detail-hero-info">
          <div className="detail-hero-head">
            <Badge tone="emerald" icon="badge_check">검증 제조사</Badge>
            {f.certs.includes('IATF 16949') && (
              <Badge tone="indigo" icon="badge_check">자동차 인증</Badge>
            )}
            {f.export && (
              <Badge tone="slate" icon="globe">수출 가능</Badge>
            )}
          </div>
          <h1 className="detail-name">{f.name}</h1>
          <div className="detail-name-en">{f.en}</div>
          <div className="detail-hero-meta">
            <span><Icon name="pin" size={13} stroke={2}/> {f.city}</span>
            <span className="dot">·</span>
            <span>{f.founded}년 설립 · 직원 {f.employees}명</span>
            <span className="dot">·</span>
            <span><Icon name="globe" size={13} stroke={2}/> {f.export ? '수출 가능' : '국내 거래'}</span>
          </div>
          <div className="detail-rating">
            <div className="detail-rating-big">
              <Icon name="star" size={16} stroke={2.4}/>
              <strong>{f.rating}</strong>
              <span>/ 5.0</span>
            </div>
            <div className="detail-rating-meta">
              <span>리뷰 {f.reviews}건</span>
              <span className="dot">·</span>
              <span>거래 {f.deals}건</span>
              <span className="dot">·</span>
              <span>응답 평균 {f.responseHr}시간</span>
            </div>
          </div>

          <div className="detail-stats">
            <div className="dstat">
              <Icon name="box" size={14} stroke={2}/>
              <div>
                <div className="dstat-k">MOQ</div>
                <div className="dstat-v">{f.moq.toLocaleString()} {f.moqUnit || '피스'}</div>
              </div>
            </div>
            <div className="dstat">
              <Icon name="clock" size={14} stroke={2}/>
              <div>
                <div className="dstat-k">리드타임</div>
                <div className="dstat-v">{f.leadDays}일</div>
              </div>
            </div>
            <div className="dstat">
              <Icon name="won" size={14} stroke={2}/>
              <div>
                <div className="dstat-k">단가 범위</div>
                <div className="dstat-v">{f.priceRange}</div>
              </div>
            </div>
          </div>

          <div className="detail-cta">
            <button
              className={`btn btn-primary btn-lg ${inRfq ? 'is-added' : ''}`}
              onClick={() => onAddRFQ(f.id)}
            >
              {inRfq ? <><Icon name="check" size={15} stroke={2.4}/> 견적함에 추가됨</> : <><Icon name="plus" size={15} stroke={2.4}/> 견적 요청하기</>}
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onChat?.(f.id)}>
              <Icon name="chat" size={15} stroke={2}/>
              실시간 상담
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="detail-tabs">
        {[
          { id: 'overview', label: '회사 개요' },
          { id: 'capability', label: '제조 역량' },
          { id: 'certs', label: '인증·신뢰도' },
          { id: 'reviews', label: `리뷰 ${f.reviews}` },
        ].map(t => (
          <button
            key={t.id}
            className={`detail-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <section className="detail-section">
          <div className="detail-grid">
            <div>
              <h3>회사 소개</h3>
              <p className="detail-desc">{f.summary}</p>
              <p className="detail-desc">
                {f.name}은(는) {f.founded}년 설립 이래 {2026 - f.founded}년간
                {indLabels.join(', ')} 분야에서 제조 역량을 축적해왔습니다.
                {f.city} 산업단지 내 자체 공장 보유, 직원 {f.employees}명이 24시간 2교대로 운영합니다.
                주요 거래처로는 국내 대기업 1차 벤더 다수가 있으며,
                {f.export && '글로벌 수출 실적 또한 보유하고 있습니다.'}
              </p>
            </div>
            <div className="detail-side">
              <h4>기본 정보</h4>
              <dl className="detail-dl">
                <dt>산업군</dt><dd>{indLabels.join(', ')}</dd>
                <dt>주소</dt><dd>{f.city} 산업단지로 ○○○</dd>
                <dt>설립</dt><dd>{f.founded}년 ({2026 - f.founded}년차)</dd>
                <dt>직원수</dt><dd>{f.employees}명</dd>
                <dt>거래 형태</dt>
                <dd>
                  {f.oem && <span className="flag">OEM</span>}
                  {f.odm && <span className="flag">ODM</span>}
                  {f.export && <span className="flag flag-export">수출</span>}
                </dd>
              </dl>
            </div>
          </div>
        </section>
      )}

      {tab === 'capability' && (
        <section className="detail-section">
          <div className="cap-grid">
            <div className="cap-block">
              <h3>가공 방식</h3>
              <div className="cap-tags">
                {procLabels.map(p => <span key={p} className="cap-tag cap-tag-blue">{p}</span>)}
              </div>
            </div>
            <div className="cap-block">
              <h3>소재</h3>
              <div className="cap-tags">
                {f.materials.map(m => <span key={m} className="cap-tag">{m}</span>)}
              </div>
            </div>
            <div className="cap-block">
              <h3>생산 가능 제품</h3>
              <div className="cap-tags">
                {prodLabels.map(p => <span key={p} className="cap-tag cap-tag-amber">{p}</span>)}
              </div>
            </div>
            <div className="cap-block">
              <h3>주요 생산 조건</h3>
              <table className="cap-table">
                <tbody>
                  <tr><th>최소 주문 (MOQ)</th><td>{f.moq.toLocaleString()} {f.moqUnit || '피스'}</td></tr>
                  <tr><th>리드타임</th><td>{f.leadDays}일 (시제품 별도)</td></tr>
                  <tr><th>단가 범위</th><td>{f.priceRange}</td></tr>
                  <tr><th>샘플</th><td>유료 / 3~5일</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {tab === 'certs' && (
        <section className="detail-section">
          <div className="trust-grid">
            <div className="trust-card">
              <h3>보유 인증</h3>
              <div className="cert-list">
                {f.certs.map(c => (
                  <div key={c} className="cert-item">
                    <Icon name="badge_check" size={16} stroke={2}/>
                    <div>
                      <div className="cert-item-k">{c}</div>
                      <div className="cert-item-v">유효 · 2027.12 갱신 예정</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="trust-card">
              <h3>응답·거래 지표</h3>
              <div className="trust-stat">
                <div className="trust-stat-k">평균 응답 시간</div>
                <div className="trust-stat-bar">
                  <div className="trust-stat-fill" style={{ width: `${100 - f.responseHr * 10}%` }}/>
                </div>
                <div className="trust-stat-v"><strong>{f.responseHr}시간</strong> · 상위 {f.responseHr <= 2 ? '5%' : f.responseHr <= 4 ? '15%' : '30%'}</div>
              </div>
              <div className="trust-stat">
                <div className="trust-stat-k">누적 거래</div>
                <div className="trust-stat-bar">
                  <div className="trust-stat-fill" style={{ width: `${Math.min(100, f.deals / 4)}%` }}/>
                </div>
                <div className="trust-stat-v"><strong>{f.deals}건</strong> · 최근 12개월 활성</div>
              </div>
              <div className="trust-stat">
                <div className="trust-stat-k">리뷰 평점</div>
                <div className="trust-stat-bar">
                  <div className="trust-stat-fill" style={{ width: `${(f.rating / 5) * 100}%` }}/>
                </div>
                <div className="trust-stat-v"><strong>{f.rating}/5.0</strong> · {f.reviews}건 검증</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === 'reviews' && (
        <section className="detail-section">
          <div className="reviews">
            {[
              { name: '김○○ (전자부품 바이어)', date: '2026.03.18', rating: 5, body: '리드타임 정확하게 지켜주시고, 도면 수정 요청에도 빠르게 대응해주셨습니다. 단가도 합리적이고 다음 발주 예정.', deal: '5,000pcs · ₩12,400,000' },
              { name: '박○○ (가전 OEM)', date: '2026.02.04', rating: 5, body: '소량 시제품도 거절 없이 받아주셔서 좋았습니다. 마감 품질이 특히 만족스럽습니다.', deal: '120pcs · ₩980,000' },
              { name: '이○○ (자동차 부품)', date: '2026.01.22', rating: 4, body: '기본 품질은 좋으나 초기 커뮤니케이션이 다소 느렸습니다. 본 양산은 안정적이었음.', deal: '2,400pcs · ₩4,800,000' },
            ].map((r, i) => (
              <div key={i} className="review">
                <div className="review-head">
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-date">{r.date}</div>
                  </div>
                  <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Icon key={k} name="star" size={12} stroke={2} className={k < r.rating ? 'star-on' : 'star-off'}/>
                    ))}
                  </div>
                </div>
                <p className="review-body">{r.body}</p>
                <div className="review-deal">{r.deal}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// RFQ
// ══════════════════════════════════════════════════════════
const RfqPage = ({ rfqIds, setRfqIds, onOpenFactory, onNav }) => {
  const { FACTORIES, PROCESSES } = window.MFG_DATA;
  const selected = FACTORIES.filter(f => rfqIds.includes(f.id));
  const [step, setStep] = useStateP(1);
  const [form, setForm] = useStateP({
    title: '소형 가전 ABS 케이스 사출',
    qty: 5000,
    process: 'injection',
    material: 'ABS',
    deadline: '2026-06-30',
    budget: '₩8,000,000 — ₩12,000,000',
    notes: '도면 첨부 / 색상 RAL7016 무광 / 후처리 무도장 / OEM 거래 가능',
    file: 'product_case_v3.step (4.2 MB)',
  });

  const totalEstResp = selected.length === 0 ? 0 : Math.max(...selected.map(s => s.responseHr));

  return (
    <div className="page page-rfq">
      <div className="rfq-head">
        <div>
          <h1>견적 요청 (RFQ)</h1>
          <p className="rfq-sub">
            선택한 제조사에 동일한 조건으로 동시 견적을 요청합니다 ·
            예상 응답 <strong>{totalEstResp}시간 내</strong>
          </p>
        </div>
        <div className="rfq-stepper">
          {[
            { n: 1, label: '제조사 선택' },
            { n: 2, label: '요청 조건' },
            { n: 3, label: '검토 · 발송' },
          ].map(s => (
            <div key={s.n} className={`rfq-step ${step >= s.n ? 'is-done' : ''} ${step === s.n ? 'is-current' : ''}`}>
              <span className="rfq-step-n">{step > s.n ? <Icon name="check" size={11} stroke={3}/> : s.n}</span>
              <span className="rfq-step-l">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rfq-shell">
        {/* Step body */}
        <div className="rfq-body">
          {step === 1 && (
            <div className="rfq-section">
              <div className="rfq-section-head">
                <h3>선택된 제조사 ({selected.length})</h3>
                <button className="link-btn" onClick={() => onNav('list')}>
                  <Icon name="plus" size={13} stroke={2.2}/> 더 추가하기
                </button>
              </div>
              {selected.length === 0 ? (
                <div className="rfq-empty">
                  <Icon name="factory" size={28} stroke={1.4}/>
                  <h4>아직 선택된 제조사가 없습니다</h4>
                  <p>제조사 탐색에서 카드 좌측 상단의 체크박스로 추가하세요. 최대 10개사까지 동시 요청 가능합니다.</p>
                  <button className="btn btn-primary" onClick={() => onNav('list')}>제조사 탐색으로 이동</button>
                </div>
              ) : (
                <div className="rfq-selected">
                  {selected.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      className="rfq-row rfq-row-clickable"
                      onClick={() => onOpenFactory?.(f.id)}
                    >
                      <div className="rfq-row-img" style={{ background: f.image }}>
                        <div className="mcard-img-stripes"/>
                      </div>
                      <div className="rfq-row-body">
                        <div className="rfq-row-head">
                          <h4>{f.name}</h4>
                          <span className="rfq-row-city">{f.city}</span>
                        </div>
                        <div className="rfq-row-tags">
                          {f.processes.slice(0, 3).map(pid => {
                            const p = PROCESSES.find(x => x.id === pid);
                            return <span key={pid} className="mtag mtag-sm">{p?.label}</span>;
                          })}
                        </div>
                        <div className="rfq-row-stats">
                          <span>MOQ {f.moq.toLocaleString()} {f.moqUnit || '피스'}</span>
                          <span>리드 {f.leadDays}일</span>
                          <span>응답 {f.responseHr}h</span>
                          <span><Icon name="star" size={10} stroke={2}/> {f.rating}</span>
                        </div>
                        <div className="rfq-row-cta">
                          <Icon name="arrow_up_right" size={11} stroke={2.2}/> 상세 보기
                        </div>
                      </div>
                      <span
                        className="rfq-row-remove"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRfqIds(rfqIds.filter(x => x !== f.id));
                        }}
                      >
                        <Icon name="close" size={14} stroke={2}/>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="rfq-section">
              <div className="rfq-section-head">
                <h3>요청 조건</h3>
              </div>
              <div className="rfq-form">
                <div className="rfq-field rfq-field-full">
                  <label>프로젝트명</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="rfq-field">
                  <label>가공 방식</label>
                  <select value={form.process} onChange={e => setForm({ ...form, process: e.target.value })}>
                    {PROCESSES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div className="rfq-field">
                  <label>주요 소재</label>
                  <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}/>
                </div>
                <div className="rfq-field">
                  <label>수량</label>
                  <input type="number" value={form.qty} onChange={e => setForm({ ...form, qty: +e.target.value })}/>
                </div>
                <div className="rfq-field">
                  <label>희망 납기</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}/>
                </div>
                <div className="rfq-field rfq-field-full">
                  <label>예산 범위 <span className="hint">(선택)</span></label>
                  <input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}/>
                </div>
                <div className="rfq-field rfq-field-full">
                  <label>요청 내용 / 도면 메모</label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
                <div className="rfq-field rfq-field-full">
                  <label>도면 / 시방서 첨부</label>
                  <div className="rfq-file">
                    <Icon name="upload" size={16} stroke={2}/>
                    <span className="rfq-file-name">{form.file}</span>
                    <span className="rfq-file-status">
                      <Icon name="check" size={11} stroke={2.4}/> 업로드 완료
                    </span>
                    <button className="rfq-file-replace">교체</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rfq-section">
              <div className="rfq-section-head">
                <h3>검토 · 발송</h3>
              </div>
              <div className="rfq-review">
                <div className="rfq-review-card">
                  <h4>요청 요약</h4>
                  <dl className="rfq-dl">
                    <dt>프로젝트</dt><dd>{form.title}</dd>
                    <dt>가공 / 소재</dt><dd>{PROCESSES.find(p => p.id === form.process)?.label} / {form.material}</dd>
                    <dt>수량</dt><dd>{form.qty.toLocaleString()} 피스</dd>
                    <dt>납기</dt><dd>{form.deadline}</dd>
                    <dt>예산</dt><dd>{form.budget}</dd>
                    <dt>첨부</dt><dd>{form.file}</dd>
                  </dl>
                </div>
                <div className="rfq-review-card">
                  <h4>발송 대상 ({selected.length}개사)</h4>
                  <ul className="rfq-review-list">
                    {selected.map(f => (
                      <li key={f.id}>
                        <span>{f.name}</span>
                        <span className="hint">예상 응답 {f.responseHr}h 내</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rfq-disclaimer">
                  <Icon name="shield" size={14} stroke={2}/>
                  <span>제조사에는 회사명·연락처가 자동 마스킹된 상태로 발송되며, 응답 후 양 당사자 동의 시 공개됩니다.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <aside className="rfq-side">
          <div className="rfq-side-card">
            <h4>요청 요약</h4>
            <div className="rfq-side-stat">
              <span>선택 제조사</span>
              <strong>{selected.length}곳</strong>
            </div>
            <div className="rfq-side-stat">
              <span>예상 응답</span>
              <strong>{totalEstResp}h 내</strong>
            </div>
            <div className="rfq-side-stat">
              <span>평균 평점</span>
              <strong>
                {selected.length ? (selected.reduce((s, f) => s + f.rating, 0) / selected.length).toFixed(1) : '-'}
              </strong>
            </div>
            <div className="rfq-side-divider"/>
            <div className="rfq-side-actions">
              {step > 1 && (
                <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                  이전
                </button>
              )}
              {step < 3 ? (
                <button
                  className="btn btn-primary"
                  disabled={selected.length === 0}
                  onClick={() => setStep(step + 1)}
                >
                  다음 단계 <Icon name="arrow_right" size={14} stroke={2.4}/>
                </button>
              ) : (
                <button className="btn btn-primary btn-send">
                  <Icon name="check" size={14} stroke={2.4}/> {selected.length}개사에 발송
                </button>
              )}
            </div>
            <div className="rfq-side-tip">
              <Icon name="sparkle" size={11} stroke={2}/>
              <span>3개사 이상에 동시 요청 시 평균 단가 <strong>12% 절감</strong></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

Object.assign(window, { HomePage, ListPage, DetailPage, RfqPage });
