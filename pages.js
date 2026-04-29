// 공통 컴포넌트: Header, Badge, Chip, Card, Map placeholder

const { useState, useEffect, useRef, useMemo } = React;

// ──────────────────────────────────────────────────────────
// Icons (line-based, 1.5px stroke)
// ──────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, className = '', stroke = 1.6 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></>,
    list: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    filter: <><path d="M3 5h18M6 12h12M10 19h4"/></>,
    chat: <><path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    star: <path d="m12 3 2.7 5.5 6 .9-4.4 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9z"/>,
    check: <path d="m4 12 5 5L20 6"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow_right: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrow_up_right: <><path d="M7 17 17 7M8 7h9v9"/></>,
    pin: <><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></>,
    factory: <><path d="M3 21V10l6 4V10l6 4V7l6-3v17z"/><path d="M3 21h18"/></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    box: <><path d="m3 7 9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>,
    won: <><path d="M4 6 7 17l3-7 2 7 3-7 3 7L21 6M3 10h18"/></>,
    chart: <><path d="M4 20V4M4 20h16"/><path d="m8 16 3-4 3 2 4-6"/></>,
    flame: <><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s1 2 3 2c0-3-1-5 1-8z"/></>,
    close: <><path d="M6 6 18 18M18 6 6 18"/></>,
    chevron_right: <path d="m9 6 6 6-6 6"/>,
    chevron_down: <path d="m6 9 6 6 6-6"/>,
    plus_circle: <><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>,
    upload: <><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    badge_check: <><path d="m5 12 2-3-1-3 3-1 2-3 3 2 3-1 1 3 3 2-2 3 1 3-3 1-2 3-3-2-3 1-1-3-3-2z"/><path d="m9 12 2 2 4-4"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="m6 6 3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/></>,
    heart: <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    phone: <path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    eye_off: <><path d="M3 3l18 18"/><path d="M10.6 6.1A9 9 0 0 1 12 6c6 0 10 6 10 6a16 16 0 0 1-2.8 3.4M6.6 6.6A14 14 0 0 0 2 12s4 6 10 6a9 9 0 0 0 4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8v0M12 11v6"/></>,
    building: <><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></>,
    arrow_left: <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className}>{paths[name]}</svg>
  );
};

// ──────────────────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────────────────
const Header = ({ route, onNav, density, onLogout, authed }) => {
  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'list', label: '제조사 탐색' },
    { id: 'search', label: '검색 UX' },
    { id: 'rfq', label: '견적 요청', badge: 2 },
    { id: 'chat', label: '채팅' },
  ];
  const isCompact = density === 'compact';
  return (
    <header className="hdr" style={{ height: isCompact ? 56 : 64 }}>
      <div className="hdr-inner">
        <div className="hdr-left">
          <button className="logo" onClick={() => onNav('home')}>
            <span className="logo-mark">
              <span className="logo-mark-inner"/>
            </span>
            <span className="logo-text">
              <span className="logo-ko">공장매칭</span>
              <span className="logo-en">FactoryMatch</span>
            </span>
          </button>
          <nav className="hdr-nav">
            {navItems.map(n => (
              <button
                key={n.id}
                className={`hdr-nav-item ${route === n.id ? 'is-active' : ''}`}
                onClick={() => onNav(n.id)}
              >
                {n.label}
                {n.badge && <span className="hdr-nav-badge">{n.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="hdr-right">
          <button className="hdr-icon-btn" aria-label="알림">
            <Icon name="bell" size={18}/>
            <span className="hdr-dot"/>
          </button>
          <div className="hdr-divider"/>
          <button
            className={'hdr-icon-btn hdr-admin' + (route === 'admin' ? ' is-active' : '')}
            onClick={() => onNav('admin')}
            aria-label="운영자 콘솔"
            title="운영자 콘솔"
          >
            <Icon name="shield" size={16} stroke={1.8}/>
          </button>
          <button className="hdr-user" onClick={() => onNav('mypage')}>
            <span className="hdr-avatar">윤</span>
            <span className="hdr-user-meta">
              <span className="hdr-user-name">윤도현 · Buyer</span>
              <span className="hdr-user-org">YD Innovations</span>
            </span>
          </button>
          {onLogout && (
            <button className="hdr-icon-btn hdr-logout" onClick={onLogout} aria-label="로그아웃" title="로그아웃">
              <Icon name="arrow_right" size={16} stroke={2}/>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// ──────────────────────────────────────────────────────────
// Badge
// ──────────────────────────────────────────────────────────
const Badge = ({ children, tone = 'slate', size = 'sm', icon }) => (
  <span className={`badge badge-${tone} badge-${size}`}>
    {icon && <Icon name={icon} size={11} stroke={1.8}/>}
    {children}
  </span>
);

// ──────────────────────────────────────────────────────────
// Filter chip
// ──────────────────────────────────────────────────────────
const Chip = ({ active, onClick, children, count }) => (
  <button className={`chip ${active ? 'is-active' : ''}`} onClick={onClick}>
    {children}
    {count != null && <span className="chip-count">{count}</span>}
  </button>
);

// ──────────────────────────────────────────────────────────
// Manufacturer card (used in list, recommended, RFQ)
// ──────────────────────────────────────────────────────────
const ManufacturerCard = ({ f, onOpen, onSelect, selected, density, compact = false }) => {
  const { PROCESSES } = window.MFG_DATA;
  const procLabels = f.processes.map(p => PROCESSES.find(x => x.id === p)?.label).filter(Boolean);
  const isCompact = compact || density === 'compact';

  return (
    <article className={`mcard ${selected ? 'is-selected' : ''} ${isCompact ? 'is-compact' : ''}`}>
      <div className="mcard-img" style={{ background: f.image }}>
        <div className="mcard-img-stripes"/>
        <div className="mcard-img-label">FACTORY · {f.en.toUpperCase()}</div>
        {onSelect && (
          <button
            className={`mcard-select ${selected ? 'is-on' : ''}`}
            onClick={(e) => { e.stopPropagation(); onSelect(f.id); }}
            aria-label="견적 요청 선택"
          >
            {selected ? <Icon name="check" size={14} stroke={2.4}/> : null}
          </button>
        )}
      </div>
      <button className="mcard-body" onClick={() => onOpen?.(f.id)}>
        <div className="mcard-head">
          <div className="mcard-titles">
            <h3 className="mcard-name">
              {f.name}
              {f.certs.includes('IATF 16949') && (
                <span className="mcard-verified" title="인증 제조사">
                  <Icon name="badge_check" size={14} stroke={2}/>
                </span>
              )}
            </h3>
            <div className="mcard-sub">
              <span>{f.en}</span>
              <span className="dot">·</span>
              <span>{f.city}</span>
            </div>
          </div>
          <div className="mcard-rating">
            <Icon name="star" size={12} stroke={2}/>
            <strong>{f.rating}</strong>
            <span>({f.reviews})</span>
          </div>
        </div>
        {!isCompact && <p className="mcard-desc">{f.summary}</p>}
        <div className="mcard-tags">
          {procLabels.slice(0, 4).map(p => (
            <span key={p} className="mtag">{p}</span>
          ))}
          {procLabels.length > 4 && <span className="mtag mtag-more">+{procLabels.length - 4}</span>}
        </div>
        <div className="mcard-stats">
          <div className="stat">
            <span className="stat-k">MOQ</span>
            <span className="stat-v">{f.moq.toLocaleString()}<em className="stat-unit">{f.moqUnit || '피스'}</em></span>
          </div>
          <div className="stat-sep"/>
          <div className="stat">
            <span className="stat-k">리드타임</span>
            <span className="stat-v">{f.leadDays}일</span>
          </div>
          <div className="stat-sep"/>
          <div className="stat">
            <span className="stat-k">응답</span>
            <span className="stat-v">{f.responseHr}h</span>
          </div>
          <div className="stat-sep"/>
          <div className="stat">
            <span className="stat-k">거래</span>
            <span className="stat-v">{f.deals}건</span>
          </div>
        </div>
        <div className="mcard-foot">
          <div className="mcard-cert">
            {f.certs.slice(0, 3).map(c => (
              <span key={c} className="cert">{c}</span>
            ))}
            {f.certs.length > 3 && <span className="cert cert-more">+{f.certs.length - 3}</span>}
          </div>
          <div className="mcard-flags">
            {f.oem && <span className="flag">OEM</span>}
            {f.odm && <span className="flag">ODM</span>}
            {f.export && <span className="flag flag-export">수출</span>}
          </div>
        </div>
      </button>
    </article>
  );
};

// ──────────────────────────────────────────────────────────
// Korea map placeholder (Naver-ish styling)
// ──────────────────────────────────────────────────────────
const KoreaMap = ({ factories, selectedId, onPin, hoveredId }) => {
  // Simplified Korea silhouette as SVG path; coords are normalized 0..100
  const pinFor = (id) => factories.find(f => f.id === id);

  return (
    <div className="map">
      <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="mapGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(15,23,42,.04)" strokeWidth="0.3"/>
          </pattern>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef4f8"/>
            <stop offset="100%" stopColor="#e6eef4"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#seaGrad)"/>
        <rect width="100" height="100" fill="url(#mapGrid)"/>

        {/* Korea silhouette (very stylized) */}
        <path
          d="M 32 12 L 38 8 L 46 11 L 50 18 L 48 24 L 52 30 L 50 36 L 56 42 L 52 50 L 58 56
             L 64 60 L 70 64 L 76 72 L 78 80 L 72 88 L 64 92 L 58 88 L 54 82 L 48 76 L 42 72
             L 38 64 L 32 58 L 28 50 L 30 42 L 26 34 L 28 26 L 30 18 Z"
          fill="#fafbfc"
          stroke="#cbd5e1"
          strokeWidth="0.4"
        />
        {/* Jeju island */}
        <ellipse cx="58" cy="95" rx="6" ry="2.5" fill="#fafbfc" stroke="#cbd5e1" strokeWidth="0.4"/>

        {/* Highway lines */}
        <path d="M 38 14 L 40 30 L 38 45 L 50 60 L 65 75" stroke="#dde6ee" strokeWidth="0.5" fill="none" strokeDasharray="1.5 1.5"/>
        <path d="M 30 25 L 50 40 L 70 65" stroke="#dde6ee" strokeWidth="0.5" fill="none" strokeDasharray="1.5 1.5"/>

        {/* Region labels */}
        <text x="38" y="22" className="map-label">서울·경기</text>
        <text x="32" y="42" className="map-label">충청</text>
        <text x="44" y="64" className="map-label">전북</text>
        <text x="68" y="58" className="map-label">경북</text>
        <text x="68" y="80" className="map-label">경남·부산</text>
      </svg>

      {/* Pins */}
      <div className="map-pins">
        {factories.map(f => {
          const isSel = f.id === selectedId;
          const isHov = f.id === hoveredId;
          return (
            <button
              key={f.id}
              className={`map-pin ${isSel ? 'is-selected' : ''} ${isHov ? 'is-hovered' : ''}`}
              style={{ left: `${f.coord.x}%`, top: `${f.coord.y}%` }}
              onClick={() => onPin(f.id)}
              aria-label={f.name}
            >
              <span className="map-pin-dot"/>
              <span className="map-pin-label">{f.name}</span>
            </button>
          );
        })}
      </div>

      {/* Map controls */}
      <div className="map-ctrl">
        <button className="map-ctrl-btn" aria-label="확대"><Icon name="plus" size={14} stroke={2}/></button>
        <div className="map-ctrl-sep"/>
        <button className="map-ctrl-btn" aria-label="축소">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>
        </button>
      </div>
      <div className="map-attr">
        <span>© FactoryMatch Maps</span>
        <span className="dot">·</span>
        <span>도로 데이터 기준</span>
      </div>
    </div>
  );
};

Object.assign(window, { Icon, Header, Badge, Chip, ManufacturerCard, KoreaMap });


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
  const { PROCESSES } = window.MFG_DATA;
  const [factories, setFactories] = useStateP(window.MFG_DATA.FACTORIES);
  const [dbLoading, setDbLoading] = useStateP(true);
  const [dbError, setDbError] = useStateP(null);
  const [query, setQuery] = useStateP(initialQuery || '');
  const [activeProcess, setActiveProcess] = useStateP('all');
  const [activeRegion, setActiveRegion] = useStateP('all');
  const [moqMax, setMoqMax] = useStateP(10000);
  const [oemOnly, setOemOnly] = useStateP(false);
  const [exportOnly, setExportOnly] = useStateP(false);
  const [sort, setSort] = useStateP('match');
  const [hovered, setHovered] = useStateP(null);
  const [selected, setSelected] = useStateP('f1');

  useEffectP(() => {
    if (!window._sb) { setDbLoading(false); return; }
    window._sb.from('factories').select('*').order('rating', { ascending: false })
      .then(({ data, error }) => {
        if (error) { setDbError(error.message); }
        else if (data && data.length > 0) { setFactories(data.map(window._dbRowToFactory)); }
        setDbLoading(false);
      });
  }, []);

  const filtered = useMemoP(() => {
    let arr = factories.filter(f => {
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
  }, [factories, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query]);

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
                      {r.id === 'all' ? factories.length : factories.filter(f => f.region === r.id).length}
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
            {dbLoading && (
              <div className="list-db-status">
                <div className="list-db-spinner"/>
                <span>Supabase에서 제조사 데이터 불러오는 중…</span>
              </div>
            )}
            {dbError && (
              <div className="list-db-error">Supabase 오류: {dbError}</div>
            )}
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

const SX_RELATED_KEYWORDS = ['자판기', '냉장기기', '전자제어', '금속가공', '컨베이어', '컵디스펜서'];

function SearchUXPage() {
  const [query, setQuery] = useStateSX('음료자판기');
  const [smart, setSmart] = useStateSX(true);
  const [activeKw, setActiveKw] = useStateSX(null);
  const [focused, setFocused] = useStateSX(false);
  const [sort, setSort] = useStateSX('rel');

  const [aiResult, setAiResult] = useStateSX(null);
  const [loading, setLoading] = useStateSX(false);
  const [aiError, setAiError] = useStateSX(null);

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
    try {
      const resp = await fetch('/.netlify/functions/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) throw new Error('API error');
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      data.topCategories = data.topCategories.map((c, i) => ({
        glyph: 'metal',
        count: 0,
        avgLead: '협의',
        avgPrice: '협의',
        ...c,
        id: c.id || `ai-${i}`,
      }));
      setAiResult(data);
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
            placeholder="제품·키워드 입력 (예: 음료자판기)"
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

      <div className="sx-results">
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
                <button key={r.id || i} className="sx-rec">
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


// ──────────────────────────────────────────────────────────
// 가입 / 로그인 / 인증 / 온보딩 (4단계)
// ──────────────────────────────────────────────────────────
const { useState: useAuthState, useEffect: useAuthEffect, useRef: useAuthRef } = React;

// ─── Mini logo ───
const AuthLogo = ({ size = 36 }) => (
  <a className="auth-logo" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('auth-nav', { detail: 'landing' })); }}>
    <span className="logo-mark" style={{ width: size, height: size }}>
      <span className="logo-mark-inner"/>
    </span>
    <span className="logo-text">
      <span className="logo-ko">공장매칭</span>
      <span className="logo-en">FactoryMatch</span>
    </span>
  </a>
);

// ═══════════════════════════════════════════════════════════
// 1) LANDING (로그아웃 상태)
// ═══════════════════════════════════════════════════════════
function LandingPage({ onNav }) {
  return (
    <div className="landing">
      <header className="landing-hdr">
        <AuthLogo/>
        <div className="landing-hdr-right">
          <button className="landing-nav-link" onClick={() => onNav('login')}>로그인</button>
          <button className="btn-primary landing-cta" onClick={() => onNav('signup')}>
            무료로 시작하기
            <Icon name="arrow_right" size={14} stroke={2.4}/>
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-text">
            <div className="landing-eyebrow">
              <span className="landing-eyebrow-dot"/>
              국내 검증 제조사 <strong>2,847곳</strong> · 누적 거래 ₩142억
            </div>
            <h1 className="landing-title">
              제조 조건만 입력하세요.<br/>
              <span className="landing-title-grad">맞는 공장이 먼저 찾아옵니다.</span>
            </h1>
            <p className="landing-sub">
              가공방식·소재·제품 키워드로 검색하면 적합한 제조사가 자동 매칭됩니다.<br/>
              여러 곳에 동시 견적 요청, 평균 응답 4시간.
            </p>
            <div className="landing-cta-row">
              <button className="btn-primary landing-cta-big" onClick={() => onNav('signup')}>
                <Icon name="sparkle" size={16} stroke={2.2}/>
                무료로 시작하기
              </button>
              <button className="btn-ghost landing-cta-big" onClick={() => onNav('login')}>
                로그인
              </button>
            </div>
            <div className="landing-trust">
              <div className="landing-trust-stars">
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/></svg>
                ))}
              </div>
              <span><strong>4.8</strong> · 바이어 <strong>980+</strong>의 평가</span>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="lhv-card lhv-c1">
              <div className="lhv-card-glyph"><Icon name="search" size={18} stroke={2}/></div>
              <div>
                <div className="lhv-card-title">"음료자판기"</div>
                <div className="lhv-card-meta">3개 카테고리 매칭됨</div>
              </div>
              <div className="lhv-card-pulse"/>
            </div>
            <div className="lhv-card lhv-c2">
              <div className="lhv-rank">RANK 01</div>
              <div className="lhv-card-glyph lhv-card-glyph-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M4 19h16"/><path d="M5 19V9l3-2 3 2v10"/><path d="M13 19v-7l3-2 3 2v7"/></svg>
              </div>
              <div className="lhv-c2-title">금속 가공</div>
              <div className="lhv-c2-meta">매칭률 96% · 184개사</div>
              <div className="lhv-c2-bar"><div className="lhv-c2-bar-fill" style={{ width: '96%' }}/></div>
            </div>
            <div className="lhv-card lhv-c3">
              <div className="lhv-c3-row">
                <div className="lhv-c3-avatar">대</div>
                <div>
                  <div className="lhv-c3-title">대성정밀(주)</div>
                  <div className="lhv-c3-meta">안산 · 견적 응답 ✓</div>
                </div>
                <div className="lhv-c3-badge">2시간 전</div>
              </div>
            </div>
            <div className="lhv-grid"/>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-section-title">
            <h2>3단계로 끝나는 제조 매칭</h2>
            <p>가입부터 첫 견적까지 평균 8분</p>
          </div>
          <div className="landing-feat-grid">
            {[
              { num: '01', icon: 'search', title: '제조 조건 검색', desc: '가공방식·소재·키워드만 입력하면 AI가 적합 카테고리를 추출합니다.' },
              { num: '02', icon: 'layers', title: '제조사 비교', desc: '인증·실적·리드타임을 한눈에 비교하고 관심 공장을 모아두세요.' },
              { num: '03', icon: 'check', title: '동시 견적 요청', desc: '최대 5곳에 한 번에 견적 요청 — 평균 4시간 내 응답.' },
            ].map(f => (
              <div key={f.num} className="landing-feat">
                <div className="landing-feat-num">{f.num}</div>
                <div className="landing-feat-icon"><Icon name={f.icon} size={22} stroke={1.8}/></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-final-cta">
          <h2>가입하면 첫 매칭이 더 정확해집니다</h2>
          <p>관심 분야·발주 규모를 등록하면 맞춤 추천이 활성화됩니다.</p>
          <button className="btn-primary landing-cta-big" onClick={() => onNav('signup')}>
            무료로 시작하기 · 1분 소요
            <Icon name="arrow_right" size={15} stroke={2.4}/>
          </button>
        </section>
      </main>

      <footer className="landing-foot">
        <div>© 2025 FactoryMatch · 사업자 123-45-67890</div>
        <div className="landing-foot-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2) AUTH FORM (회원가입 / 로그인)
// ═══════════════════════════════════════════════════════════
function AuthFormPage({ mode, onNav, onSubmit }) {
  const isSignup = mode === 'signup';
  const [email, setEmail] = useAuthState('');
  const [password, setPassword] = useAuthState('');
  const [showPw, setShowPw] = useAuthState(false);
  const [agree, setAgree] = useAuthState({ tos: false, privacy: false, marketing: false });
  const allAgreed = agree.tos && agree.privacy;

  const pwStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const pwLabel = ['', '약함', '보통', '강함', '매우 강함'][pwStrength];
  const pwColor = ['var(--ink-5)', 'var(--rose)', 'var(--amber)', 'var(--brand)', 'var(--emerald)'][pwStrength];

  const canSubmit = email.includes('@') && password.length >= 8 && (!isSignup || allAgreed);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onSubmit({ email });
  };

  return (
    <div className="auth-shell">
      <div className="auth-shell-bg"/>
      <div className="auth-shell-inner">
        <header className="auth-mini-hdr">
          <AuthLogo size={32}/>
          <button className="auth-back-btn" onClick={() => onNav('landing')}>
            <Icon name="close" size={14} stroke={2}/>
          </button>
        </header>

        <div className="auth-card">
          <div className="auth-card-head">
            <h1>{isSignup ? '공장매칭 시작하기' : '다시 오신 걸 환영해요'}</h1>
            <p>{isSignup
              ? '가입 후 1분이면 맞춤 제조사를 만나볼 수 있어요.'
              : '이메일로 로그인하거나 구글 계정을 사용하세요.'}</p>
          </div>

          <button className="auth-google-btn" onClick={() => onSubmit({ email: 'user@gmail.com', google: true })}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8L6.2 33C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2c-.4.4 6.6-4.8 6.6-14.9 0-1.3-.1-2.4-.4-3.5z"/></svg>
            {isSignup ? '구글로 가입' : '구글로 로그인'}
          </button>

          <div className="auth-divider">
            <span className="auth-divider-line"/>
            <span className="auth-divider-text">또는 이메일로</span>
            <span className="auth-divider-line"/>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span className="auth-field-label">이메일</span>
              <div className="auth-input-wrap">
                <Icon name="mail" size={16} stroke={1.8}/>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                {email.includes('@') && (
                  <span className="auth-input-check">
                    <Icon name="check" size={12} stroke={3}/>
                  </span>
                )}
              </div>
            </label>

            <label className="auth-field">
              <span className="auth-field-label">
                비밀번호
                {!isSignup && <button type="button" className="auth-field-link" onClick={() => onNav('forgot')}>비밀번호 찾기</button>}
              </span>
              <div className="auth-input-wrap">
                <Icon name="lock" size={16} stroke={1.8}/>
                <input
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder={isSignup ? '8자 이상, 영문·숫자 포함' : '비밀번호'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button type="button" className="auth-input-eye" onClick={() => setShowPw(!showPw)} aria-label="비밀번호 표시 전환">
                  <Icon name={showPw ? 'eye_off' : 'eye'} size={15} stroke={1.8}/>
                </button>
              </div>
              {isSignup && password && (
                <div className="auth-pw-meter">
                  <div className="auth-pw-meter-bar">
                    {[0,1,2,3].map(i => (
                      <span key={i} className="auth-pw-meter-seg" style={{ background: i < pwStrength ? pwColor : 'var(--bg-soft)' }}/>
                    ))}
                  </div>
                  <span className="auth-pw-meter-label" style={{ color: pwColor }}>{pwLabel}</span>
                </div>
              )}
            </label>

            {isSignup && (
              <div className="auth-agree">
                <label className="auth-agree-all">
                  <input
                    type="checkbox"
                    checked={agree.tos && agree.privacy && agree.marketing}
                    onChange={(e) => setAgree({ tos: e.target.checked, privacy: e.target.checked, marketing: e.target.checked })}
                  />
                  <span className="auth-cb"><Icon name="check" size={11} stroke={3.2}/></span>
                  <strong>전체 동의</strong>
                </label>
                <div className="auth-agree-list">
                  {[
                    { k: 'tos', label: '서비스 이용약관 동의', req: true },
                    { k: 'privacy', label: '개인정보 수집·이용 동의', req: true },
                    { k: 'marketing', label: '마케팅 정보 수신 동의', req: false },
                  ].map(a => (
                    <label key={a.k} className="auth-agree-item">
                      <input
                        type="checkbox"
                        checked={agree[a.k]}
                        onChange={(e) => setAgree({ ...agree, [a.k]: e.target.checked })}
                      />
                      <span className="auth-cb"><Icon name="check" size={10} stroke={3.2}/></span>
                      <span className="auth-agree-text">
                        {a.label}
                        {a.req ? <em className="auth-req">(필수)</em> : <em className="auth-opt">(선택)</em>}
                      </span>
                      <button type="button" className="auth-agree-view">보기</button>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={!canSubmit}
            >
              {isSignup ? '이메일로 가입' : '로그인'}
              <Icon name="arrow_right" size={14} stroke={2.4}/>
            </button>
          </form>

          <div className="auth-card-foot">
            {isSignup ? (
              <>이미 계정이 있으신가요? <button className="auth-foot-link" onClick={() => onNav('login')}>로그인</button></>
            ) : (
              <>아직 계정이 없으신가요? <button className="auth-foot-link" onClick={() => onNav('signup')}>무료 가입</button></>
            )}
          </div>
        </div>

        <div className="auth-illust">
          <div className="auth-illust-card">
            <Icon name="shield" size={20} stroke={1.8}/>
            <div>
              <strong>안전한 B2B 인증</strong>
              <span>휴대폰 + 이메일로 신뢰도를 확인합니다</span>
            </div>
          </div>
          <div className="auth-illust-card">
            <Icon name="sparkle" size={20} stroke={1.8}/>
            <div>
              <strong>가입 즉시 맞춤 추천</strong>
              <span>관심 분야·발주 규모 기반 자동 매칭</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3) VERIFY (휴대폰 + 이메일 인증)
// ═══════════════════════════════════════════════════════════
function VerifyPage({ email, onNav, onComplete }) {
  // step: phone-input → phone-code → email-confirm
  const [step, setStep] = useAuthState('phone-input');
  const [phone, setPhone] = useAuthState('');
  const [code, setCode] = useAuthState(['', '', '', '', '', '']);
  const [timer, setTimer] = useAuthState(180);
  const codeRefs = [useAuthRef(), useAuthRef(), useAuthRef(), useAuthRef(), useAuthRef(), useAuthRef()];

  useAuthEffect(() => {
    if (step !== 'phone-code') return;
    const t = setInterval(() => setTimer(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const sendCode = () => {
    if (phone.replace(/\D/g, '').length < 10) return;
    setStep('phone-code');
    setTimer(180);
  };

  const handleCodeChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) codeRefs[i + 1].current?.focus();
    if (next.every(c => c) && next.join('').length === 6) {
      setTimeout(() => setStep('email-confirm'), 400);
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = ['', '', '', '', '', ''];
    pasted.forEach((c, i) => next[i] = c);
    setCode(next);
    if (pasted.length === 6) setTimeout(() => setStep('email-confirm'), 400);
  };

  const fmtPhone = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };
  const fmtTimer = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`;

  return (
    <div className="auth-shell">
      <div className="auth-shell-bg"/>
      <div className="auth-shell-inner">
        <header className="auth-mini-hdr">
          <AuthLogo size={32}/>
          <button className="auth-back-btn" onClick={() => onNav('signup')}>
            <Icon name="close" size={14} stroke={2}/>
          </button>
        </header>

        {/* Step indicator */}
        <div className="auth-steps">
          <AuthStep n={1} label="이메일·비밀번호" done/>
          <AuthStepLine done/>
          <AuthStep n={2} label="휴대폰·이메일 인증" active/>
          <AuthStepLine/>
          <AuthStep n={3} label="프로필 설정"/>
          <AuthStepLine/>
          <AuthStep n={4} label="완료"/>
        </div>

        <div className="auth-card auth-card-narrow">
          {step === 'phone-input' && (
            <>
              <div className="auth-card-head">
                <div className="auth-card-glyph"><Icon name="phone" size={22} stroke={1.8}/></div>
                <h1>휴대폰 번호를 인증해주세요</h1>
                <p>견적 알림과 본인 확인을 위해 사용됩니다.</p>
              </div>
              <div className="auth-form">
                <label className="auth-field">
                  <span className="auth-field-label">휴대폰 번호</span>
                  <div className="auth-input-wrap auth-phone">
                    <span className="auth-phone-cc">+82</span>
                    <input
                      className="auth-input"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={fmtPhone(phone)}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </label>
                <button
                  className="btn-primary auth-submit"
                  onClick={sendCode}
                  disabled={phone.replace(/\D/g, '').length < 10}
                >
                  인증번호 받기
                  <Icon name="arrow_right" size={14} stroke={2.4}/>
                </button>
                <div className="auth-skip-note">
                  <Icon name="info" size={12} stroke={2}/>
                  최대 60초 이내 SMS로 6자리 인증번호가 발송됩니다.
                </div>
              </div>
            </>
          )}

          {step === 'phone-code' && (
            <>
              <div className="auth-card-head">
                <div className="auth-card-glyph"><Icon name="phone" size={22} stroke={1.8}/></div>
                <h1>인증번호를 입력해주세요</h1>
                <p>
                  <strong>{fmtPhone(phone)}</strong>로 6자리 인증번호를 보냈어요.<br/>
                  <button className="auth-foot-link" onClick={() => setStep('phone-input')}>번호 변경</button>
                </p>
              </div>
              <div className="auth-form">
                <div className="auth-otp-row" onPaste={handleCodePaste}>
                  {code.map((c, i) => (
                    <input
                      key={i}
                      ref={codeRefs[i]}
                      className="auth-otp-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={c}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !c && i > 0) codeRefs[i - 1].current?.focus();
                      }}
                    />
                  ))}
                </div>
                <div className="auth-otp-meta">
                  <span className={timer < 30 ? 'auth-otp-timer is-warning' : 'auth-otp-timer'}>
                    <Icon name="clock" size={11} stroke={2}/>
                    남은 시간 {fmtTimer}
                  </span>
                  <button className="auth-foot-link" onClick={() => { setTimer(180); setCode(['','','','','','']); }}>
                    인증번호 재전송
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'email-confirm' && (
            <>
              <div className="auth-card-head">
                <div className="auth-card-glyph auth-card-glyph-success">
                  <Icon name="check" size={22} stroke={2.6}/>
                </div>
                <h1>휴대폰 인증 완료!</h1>
                <p>
                  이메일 <strong>{email}</strong>로 인증 메일을 발송했어요.<br/>
                  메일함에서 <strong>인증 링크를 클릭</strong>해주세요.
                </p>
              </div>
              <div className="auth-form">
                <div className="auth-mail-preview">
                  <div className="auth-mail-icon">
                    <Icon name="mail" size={20} stroke={1.8}/>
                  </div>
                  <div className="auth-mail-text">
                    <strong>FactoryMatch &lt;noreply@factorymatch.kr&gt;</strong>
                    <span>이메일 인증을 완료해주세요</span>
                  </div>
                  <div className="auth-mail-pulse"/>
                </div>
                <button className="btn-primary auth-submit" onClick={onComplete}>
                  인증 완료 — 프로필 설정으로
                  <Icon name="arrow_right" size={14} stroke={2.4}/>
                </button>
                <div className="auth-skip-note">
                  <button className="auth-foot-link">메일이 안 왔나요? 재전송</button>
                  ·
                  <button className="auth-foot-link" onClick={onComplete}>나중에 인증하기</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Step indicator atoms
const AuthStep = ({ n, label, active, done }) => (
  <div className={`auth-step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
    <div className="auth-step-circle">
      {done ? <Icon name="check" size={11} stroke={3}/> : n}
    </div>
    <span className="auth-step-label">{label}</span>
  </div>
);
const AuthStepLine = ({ done }) => (
  <div className={`auth-step-line ${done ? 'is-done' : ''}`}/>
);

// ═══════════════════════════════════════════════════════════
// 4) ONBOARDING (4 steps)
// ═══════════════════════════════════════════════════════════
function OnboardingPage({ onComplete, onNav }) {
  const [step, setStep] = useAuthState(0);
  const [data, setData] = useAuthState({
    role: null, // 'buyer' | 'maker'
    company: '',
    position: '',
    employees: null,
    interests: [],
    products: [],
    moq: 'medium',
    notify: { email: true, sms: true, kakao: false, marketing: false },
  });

  const update = (patch) => setData({ ...data, ...patch });

  const stepValid = [
    !!data.role,
    data.company.length >= 2 && data.position.length >= 1 && !!data.employees,
    data.interests.length >= 1,
    true, // notify always valid
  ];

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };
  const prev = () => step > 0 ? setStep(step - 1) : onNav('verify');

  const stepTitles = ['역할 선택', '회사 정보', '관심 분야', '알림 설정'];

  return (
    <div className="onb-shell">
      <div className="auth-shell-bg"/>
      <div className="onb-inner">
        <header className="auth-mini-hdr onb-mini-hdr">
          <AuthLogo size={32}/>
          <button className="onb-skip-btn" onClick={onComplete}>나중에 설정하기</button>
        </header>

        {/* Step indicator */}
        <div className="auth-steps">
          <AuthStep n={1} label="이메일·비밀번호" done/>
          <AuthStepLine done/>
          <AuthStep n={2} label="휴대폰·이메일 인증" done/>
          <AuthStepLine done/>
          <AuthStep n={3} label="프로필 설정" active/>
          <AuthStepLine/>
          <AuthStep n={4} label="완료"/>
        </div>

        {/* Sub-progress for 4 onboarding sub-steps */}
        <div className="onb-sub-progress">
          {[0,1,2,3].map(i => (
            <div key={i} className={`onb-sub-pill ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
              <span className="onb-sub-num">{i < step ? <Icon name="check" size={9} stroke={3}/> : i + 1}</span>
              <span className="onb-sub-label">{stepTitles[i]}</span>
            </div>
          ))}
        </div>

        <div className="onb-card">
          {step === 0 && <OnbStepRole data={data} update={update}/>}
          {step === 1 && <OnbStepCompany data={data} update={update}/>}
          {step === 2 && <OnbStepInterests data={data} update={update}/>}
          {step === 3 && <OnbStepNotify data={data} update={update}/>}

          <div className="onb-foot">
            <button className="btn-ghost onb-back" onClick={prev}>
              <Icon name="arrow_left" size={14} stroke={2.4}/>
              이전
            </button>
            <div className="onb-foot-meta">{step + 1} / 4</div>
            <button
              className="btn-primary onb-next"
              onClick={next}
              disabled={!stepValid[step]}
            >
              {step < 3 ? '다음' : '완료하고 시작하기'}
              <Icon name="arrow_right" size={14} stroke={2.4}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Onb Step 0: Role ───
function OnbStepRole({ data, update }) {
  const roles = [
    {
      id: 'buyer',
      title: '바이어',
      en: 'Buyer',
      tag: '제조사를 찾는 쪽',
      desc: '제품 개발·구매 담당으로 적합한 제조사를 찾고 견적을 받습니다.',
      perks: ['제조사 검색·비교', '동시 견적 요청', '관심 공장 저장'],
      glyph: 'buyer',
    },
    {
      id: 'maker',
      title: '제조사',
      en: 'Manufacturer',
      tag: '공장을 운영하는 쪽',
      desc: '공장을 등록해 적합한 발주 건을 받고 견적을 제안합니다.',
      perks: ['공장 프로필 노출', '맞춤 RFQ 수신', '거래 실적 관리'],
      glyph: 'maker',
    },
  ];
  return (
    <div className="onb-step">
      <div className="onb-step-head">
        <h2>안녕하세요! 어떤 역할로 가입하시나요?</h2>
        <p>가입 후에도 마이페이지에서 변경할 수 있어요.</p>
      </div>
      <div className="onb-role-grid">
        {roles.map(r => (
          <button
            key={r.id}
            className={`onb-role ${data.role === r.id ? 'is-selected' : ''}`}
            onClick={() => update({ role: r.id })}
          >
            <div className="onb-role-glyph">
              {r.glyph === 'buyer' ? (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="22" r="8"/>
                  <path d="M16 50c0-8 7-14 16-14s16 6 16 14"/>
                  <path d="M44 30l4 4M48 26l2 2" opacity="0.4"/>
                </svg>
              ) : (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 50V28l10 6V28l10 6V20l10 6V18l14 8v24z"/>
                  <path d="M18 50v-8M28 50v-8M38 50v-8M48 50v-8"/>
                </svg>
              )}
            </div>
            <div className="onb-role-body">
              <div className="onb-role-title-row">
                <h3>
                  {r.title}
                  <span className="onb-role-tag">{r.tag}</span>
                </h3>
                {data.role === r.id && (
                  <span className="onb-role-check">
                    <Icon name="check" size={12} stroke={3}/>
                  </span>
                )}
              </div>
              <p>{r.desc}</p>
              <ul className="onb-role-perks">
                {r.perks.map(p => (
                  <li key={p}>
                    <Icon name="check" size={11} stroke={2.6}/>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Onb Step 1: Company ───
function OnbStepCompany({ data, update }) {
  const sizes = [
    { id: 'solo', label: '1인 사업자', range: '1명' },
    { id: 'small', label: '소기업', range: '2~10명' },
    { id: 'mid', label: '중견기업', range: '11~50명' },
    { id: 'large', label: '대기업', range: '50명+' },
  ];
  const isMaker = data.role === 'maker';
  return (
    <div className="onb-step">
      <div className="onb-step-head">
        <h2>회사 정보를 알려주세요</h2>
        <p>{isMaker ? '제조사 프로필에 표시되는 기본 정보입니다.' : '맞춤 추천을 위해 사용되며 외부에 공개되지 않습니다.'}</p>
      </div>
      <div className="onb-fields">
        <label className="auth-field">
          <span className="auth-field-label">회사명 / 소속 <em className="auth-req">(필수)</em></span>
          <div className="auth-input-wrap">
            <Icon name="building" size={16} stroke={1.8}/>
            <input
              className="auth-input"
              placeholder="예: YD Innovations"
              value={data.company}
              onChange={(e) => update({ company: e.target.value })}
            />
          </div>
        </label>
        <label className="auth-field">
          <span className="auth-field-label">직책 / 직무 <em className="auth-req">(필수)</em></span>
          <div className="auth-input-wrap">
            <Icon name="user" size={16} stroke={1.8}/>
            <input
              className="auth-input"
              placeholder="예: 제품 개발 매니저"
              value={data.position}
              onChange={(e) => update({ position: e.target.value })}
            />
          </div>
        </label>
        <div className="auth-field">
          <span className="auth-field-label">회사 규모 <em className="auth-req">(필수)</em></span>
          <div className="onb-size-grid">
            {sizes.map(s => (
              <button
                key={s.id}
                className={`onb-size ${data.employees === s.id ? 'is-selected' : ''}`}
                onClick={() => update({ employees: s.id })}
              >
                <strong>{s.label}</strong>
                <span>{s.range}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Onb Step 2: Interests ───
function OnbStepInterests({ data, update }) {
  const cats = [
    { id: 'cnc', label: 'CNC 가공', icon: '⚙' },
    { id: 'injection', label: '사출', icon: '◐' },
    { id: 'press', label: '프레스', icon: '▭' },
    { id: 'mold', label: '금형', icon: '◆' },
    { id: 'welding', label: '용접', icon: '╳' },
    { id: 'painting', label: '도장', icon: '◉' },
    { id: 'assembly', label: '조립', icon: '⬡' },
    { id: 'pcb', label: 'PCB·전자', icon: '⊞' },
    { id: 'sheet', label: '판금·절곡', icon: '▱' },
    { id: 'plastic', label: '플라스틱', icon: '○' },
    { id: 'metal', label: '금속소재', icon: '■' },
    { id: 'package', label: '포장', icon: '◫' },
  ];
  const products = [
    '자동차 부품', '가전·생활', '의료기기', '산업기계', '식음료 자판기',
    '전자제품 케이스', '건축·인테리어', '농업·축산', '에너지·태양광',
  ];
  const moqs = [
    { id: 'small', label: '소량 (1~100)', desc: '시제품·소량 생산' },
    { id: 'medium', label: '중량 (100~10,000)', desc: '일반 양산' },
    { id: 'large', label: '대량 (10,000+)', desc: '대규모 양산' },
  ];
  const toggleCat = (id) => {
    const next = data.interests.includes(id)
      ? data.interests.filter(x => x !== id)
      : [...data.interests, id];
    update({ interests: next });
  };
  const toggleProd = (p) => {
    const next = data.products.includes(p)
      ? data.products.filter(x => x !== p)
      : [...data.products, p];
    update({ products: next });
  };
  const isMaker = data.role === 'maker';
  return (
    <div className="onb-step">
      <div className="onb-step-head">
        <h2>{isMaker ? '제공 가능한 가공 방식을 선택해주세요' : '관심 있는 가공 방식을 선택해주세요'}</h2>
        <p>여러 개 선택 가능 · 추천 정확도가 올라갑니다 ({data.interests.length}개 선택됨)</p>
      </div>
      <div className="onb-fields">
        <div className="auth-field">
          <span className="auth-field-label">가공 방식 <em className="auth-req">(1개 이상 필수)</em></span>
          <div className="onb-cat-grid">
            {cats.map(c => (
              <button
                key={c.id}
                className={`onb-cat ${data.interests.includes(c.id) ? 'is-selected' : ''}`}
                onClick={() => toggleCat(c.id)}
              >
                <span className="onb-cat-icon">{c.icon}</span>
                <span className="onb-cat-label">{c.label}</span>
                {data.interests.includes(c.id) && (
                  <span className="onb-cat-check"><Icon name="check" size={9} stroke={3.4}/></span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="auth-field">
          <span className="auth-field-label">{isMaker ? '주요 생산 분야' : '주요 발주 분야'} <em className="auth-opt">(선택)</em></span>
          <div className="onb-prod-row">
            {products.map(p => (
              <button
                key={p}
                className={`onb-prod-chip ${data.products.includes(p) ? 'is-selected' : ''}`}
                onClick={() => toggleProd(p)}
              >
                {data.products.includes(p) && <Icon name="check" size={10} stroke={3}/>}
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="auth-field">
          <span className="auth-field-label">{isMaker ? '주요 생산 규모' : '주요 발주 규모'}</span>
          <div className="onb-moq-row">
            {moqs.map(m => (
              <button
                key={m.id}
                className={`onb-moq ${data.moq === m.id ? 'is-selected' : ''}`}
                onClick={() => update({ moq: m.id })}
              >
                <strong>{m.label}</strong>
                <span>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Onb Step 3: Notify ───
function OnbStepNotify({ data, update }) {
  const channels = [
    { k: 'email', label: '이메일', icon: 'mail', desc: '견적 응답·일일 리포트', rec: true },
    { k: 'sms', label: '문자 (SMS)', icon: 'phone', desc: '긴급 알림 (응답 임박)', rec: true },
    { k: 'kakao', label: '카카오 알림톡', icon: 'chat', desc: '실시간 메시지 수신', rec: false },
    { k: 'marketing', label: '신규 제조사·이벤트', icon: 'sparkle', desc: '주 1회 이내 발송', rec: false },
  ];
  return (
    <div className="onb-step">
      <div className="onb-step-head">
        <h2>알림을 어떻게 받으시겠어요?</h2>
        <p>견적 응답 시 즉시 알림을 받으면 평균 응답률이 <strong>3배</strong> 높아집니다. 언제든 변경 가능해요.</p>
      </div>
      <div className="onb-notify-list">
        {channels.map(c => (
          <label key={c.k} className={`onb-notify ${data.notify[c.k] ? 'is-on' : ''}`}>
            <div className="onb-notify-icon">
              <Icon name={c.icon} size={18} stroke={1.8}/>
            </div>
            <div className="onb-notify-text">
              <div className="onb-notify-title">
                {c.label}
                {c.rec && <span className="onb-notify-rec">권장</span>}
              </div>
              <div className="onb-notify-desc">{c.desc}</div>
            </div>
            <input
              type="checkbox"
              checked={data.notify[c.k]}
              onChange={(e) => update({ notify: { ...data.notify, [c.k]: e.target.checked } })}
            />
            <span className="onb-notify-switch"/>
          </label>
        ))}
      </div>
      <div className="onb-notify-tip">
        <Icon name="info" size={14} stroke={2}/>
        <span>야간(22시~08시) 알림은 자동으로 일시 중지됩니다.</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 5) WELCOME (완료 → 메인 진입)
// ═══════════════════════════════════════════════════════════
function WelcomePage({ data, onEnter }) {
  return (
    <div className="auth-shell welcome-shell">
      <div className="auth-shell-bg"/>
      <div className="welcome-inner">
        <div className="welcome-confetti">
          {[...Array(20)].map((_, i) => (
            <span key={i} style={{
              left: `${(i * 5.3) % 100}%`,
              animationDelay: `${(i * 0.07) % 1.4}s`,
              background: ['var(--brand)', 'var(--emerald)', 'var(--amber)', 'var(--rose)'][i % 4],
            }}/>
          ))}
        </div>

        <div className="welcome-card">
          <div className="welcome-glyph">
            <Icon name="check" size={36} stroke={2.6}/>
          </div>
          <div className="welcome-eyebrow">가입 완료 · STEP 4/4</div>
          <h1 className="welcome-title">
            환영합니다, <span className="welcome-name">{data?.company || '바이어'}</span>님!
          </h1>
          <p className="welcome-sub">
            관심 분야 <strong>{data?.interests?.length || 0}개</strong>를 기반으로 맞춤 제조사를 준비했어요.<br/>
            첫 매칭 정확도 <strong>92%</strong> · 평균 견적 응답 <strong>4시간</strong>.
          </p>

          <div className="welcome-stats">
            <div className="welcome-stat">
              <div className="welcome-stat-n">2,847</div>
              <div className="welcome-stat-l">검증 제조사</div>
            </div>
            <div className="welcome-stat-divider"/>
            <div className="welcome-stat">
              <div className="welcome-stat-n">142<em>억</em></div>
              <div className="welcome-stat-l">누적 거래액</div>
            </div>
            <div className="welcome-stat-divider"/>
            <div className="welcome-stat">
              <div className="welcome-stat-n">4<em>시간</em></div>
              <div className="welcome-stat-l">평균 응답</div>
            </div>
          </div>

          <div className="welcome-next">
            <div className="welcome-next-title">이제 무엇을 해볼까요?</div>
            <div className="welcome-next-grid">
              <button className="welcome-next-card" onClick={onEnter}>
                <div className="welcome-next-icon"><Icon name="sparkle" size={18} stroke={2}/></div>
                <div className="welcome-next-text">
                  <strong>맞춤 추천 보기</strong>
                  <span>관심 분야 기반 제조사 12곳</span>
                </div>
                <Icon name="arrow_right" size={14} stroke={2.4} className="welcome-next-arrow"/>
              </button>
              <button className="welcome-next-card" onClick={onEnter}>
                <div className="welcome-next-icon"><Icon name="search" size={18} stroke={2}/></div>
                <div className="welcome-next-text">
                  <strong>키워드로 검색</strong>
                  <span>예: "음료자판기", "CNC 알루미늄"</span>
                </div>
                <Icon name="arrow_right" size={14} stroke={2.4} className="welcome-next-arrow"/>
              </button>
            </div>
          </div>

          <button className="btn-primary welcome-cta" onClick={onEnter}>
            메인으로 이동
            <Icon name="arrow_right" size={15} stroke={2.4}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
Object.assign(window, {
  LandingPage, AuthFormPage, VerifyPage, OnboardingPage, WelcomePage,
});


// ──────────────────────────────────────────────────────────
// Chat / MyPage / Admin
// ──────────────────────────────────────────────────────────

const FACTORIES_AC = window.MFG_DATA.FACTORIES;
const PROCESSES_AC = window.MFG_DATA.PROCESSES;

// 더미 채팅 메시지 — 제조사별
const CHAT_THREADS = {
  f1: [
    { from: 'them', text: '안녕하세요, 대성정밀공업입니다. 알루미늄 CNC 가공 문의 주셔서 감사합니다.', t: '14:21' },
    { from: 'me', text: '도면 첨부드립니다. 알루미늄 6061-T6 기준 1,000개 견적 부탁드립니다.', t: '14:23' },
    { from: 'them', text: '도면 잘 받았습니다. 검토 후 1시간 이내에 견적 회신드리겠습니다.', t: '14:25' },
    { from: 'them', text: '추가로 표면 처리(아노다이징) 필요하실까요?', t: '14:25' },
  ],
  f3: [
    { from: 'them', text: '한일프레스금형입니다. 자동차 부품 도면 검토 완료했습니다.', t: '11:08' },
    { from: 'me', text: '리드타임 단축 가능한가요? 18일 → 14일 이내로 부탁드립니다.', t: '11:12' },
    { from: 'them', text: '월 10,000개 이상 물량이면 14일 가능합니다. 5,000개 기준은 16일까지 가능합니다.', t: '11:14' },
  ],
  f10: [
    { from: 'them', text: '안녕하세요, 정밀가공센터입니다.', t: '어제' },
    { from: 'me', text: '시제품 5개 가공 가능한 일정 알려주세요.', t: '어제' },
    { from: 'them', text: '오늘 접수 시 7일 내 발송 가능합니다.', t: '오늘 09:14' },
  ],
};

// 마이페이지 더미 — RFQ 내역, 조회기록, 관심사
const MY_RFQS = [
  { id: 'r-2401', date: '2024-12-18', title: '알루미늄 CNC 가공 부품', qty: 1200, factories: ['f1', 'f8', 'f10'], status: '응답대기', responses: 1 },
  { id: 'r-2382', date: '2024-12-11', title: '플라스틱 사출 케이스', qty: 5000, factories: ['f2', 'f11'], status: '진행중', responses: 2 },
  { id: 'r-2351', date: '2024-11-29', title: '자동차 도어 패널 프레스', qty: 8000, factories: ['f3', 'f12'], status: '완료', responses: 3 },
  { id: 'r-2298', date: '2024-11-14', title: 'PCB 양산', qty: 800, factories: ['f4'], status: '완료', responses: 1 },
];

// 관리자 — 등록 제조사 목록 (FACTORIES + 가짜 비공개 2건)
const ADMIN_FACTORIES = [
  ...FACTORIES_AC.map(f => ({
    id: f.id, name: f.name, city: f.city, processes: f.processes, certs: f.certs,
    public: true, registered: '2024-08-12', source: 'CSV',
  })),
  { id: 'd1', name: '신일제관(임시)', city: '대구', processes: ['stamping'], certs: ['ISO 9001'], public: false, registered: '2025-01-04', source: 'CSV' },
  { id: 'd2', name: '평화기계(검증중)', city: '울산', processes: ['cnc', 'casting'], certs: [], public: false, registered: '2025-01-06', source: 'CSV' },
];

// ──────────────────────────────────────────────────────────
// ChatPage
// ──────────────────────────────────────────────────────────
const ChatPage = ({ initialFactoryId, onBack, onOpenFactory }) => {
  // 채팅이 있는 제조사들만 sidebar에 노출
  const threadIds = Object.keys(CHAT_THREADS);
  const threads = threadIds.map(id => {
    const f = FACTORIES_AC.find(x => x.id === id);
    const msgs = CHAT_THREADS[id];
    const last = msgs[msgs.length - 1];
    return { id, f, last, msgs };
  });

  // initialFactoryId가 채팅에 없으면 새로 추가
  const allThreads = useMemo(() => {
    if (initialFactoryId && !threadIds.includes(initialFactoryId)) {
      const f = FACTORIES_AC.find(x => x.id === initialFactoryId);
      if (f) {
        return [
          { id: f.id, f, last: { from: 'them', text: '안녕하세요, ' + f.name + '입니다. 무엇을 도와드릴까요?', t: '방금' }, msgs: [
            { from: 'them', text: '안녕하세요, ' + f.name + '입니다. 문의 주셔서 감사합니다.', t: '방금' },
          ] },
          ...threads,
        ];
      }
    }
    return threads;
  }, [initialFactoryId]);

  const [activeId, setActiveId] = useState(initialFactoryId || allThreads[0]?.id);
  const active = allThreads.find(t => t.id === activeId) || allThreads[0];

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(active?.msgs || []);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages(active?.msgs || []);
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    const txt = draft.trim();
    if (!txt) return;
    const now = new Date();
    const t = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setMessages([...messages, { from: 'me', text: txt, t }]);
    setDraft('');
    // 가짜 자동응답
    setTimeout(() => {
      setMessages(m => [...m, { from: 'them', text: '확인했습니다. 잠시만 기다려주세요.', t }]);
    }, 900);
  };

  if (!active) {
    return (
      <main className="page chat-empty">
        <div className="empty-card">
          <Icon name="chat" size={32} stroke={1.4}/>
          <h2>아직 채팅이 없습니다</h2>
          <p>제조사 상세 페이지에서 "실시간 상담"을 눌러 채팅을 시작하세요.</p>
          <button className="btn btn-primary" onClick={() => onBack && onBack()}>제조사 둘러보기</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page chat-page">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-head">
          <h3>채팅</h3>
          <span className="chat-sidebar-count">{allThreads.length}</span>
        </div>
        <div className="chat-sidebar-search">
          <Icon name="search" size={14} stroke={2}/>
          <input placeholder="제조사 검색"/>
        </div>
        <div className="chat-thread-list">
          {allThreads.map(t => (
            <button
              key={t.id}
              className={'chat-thread ' + (t.id === activeId ? 'is-active' : '')}
              onClick={() => setActiveId(t.id)}
            >
              <div className="chat-thread-avatar" style={{ background: t.f.image }}>
                {t.f.name.slice(0, 1)}
              </div>
              <div className="chat-thread-body">
                <div className="chat-thread-row">
                  <h4>{t.f.name}</h4>
                  <span className="chat-thread-time">{t.last.t}</span>
                </div>
                <p>{t.last.text}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-main">
        <header className="chat-head">
          <div className="chat-head-info">
            <div className="chat-head-avatar" style={{ background: active.f.image }}>
              {active.f.name.slice(0, 1)}
            </div>
            <div>
              <h3>{active.f.name}</h3>
              <span className="chat-head-meta">{active.f.city} · 평균 응답 {active.f.responseHr}시간</span>
            </div>
          </div>
          <div className="chat-head-actions">
            <button className="icon-btn" onClick={() => onOpenFactory && onOpenFactory(active.f.id)}>
              <Icon name="building" size={14} stroke={2}/>
              제조사 정보
            </button>
            <button className="icon-btn">
              <Icon name="plus" size={14} stroke={2}/>
              파일 첨부
            </button>
          </div>
        </header>

        <div className="chat-banner">
          <Icon name="info" size={14} stroke={2}/>
          <div>
            <strong>이 채팅은 견적 협상용입니다.</strong>
            <span>외부 결제 유도, 개인정보 요청은 즉시 신고해주세요.</span>
          </div>
        </div>

        <div className="chat-messages" ref={scrollRef}>
          <div className="chat-day">2024년 12월 18일</div>
          {messages.map((m, i) => (
            <div key={i} className={'chat-msg chat-msg-' + m.from}>
              {m.from === 'them' && (
                <div className="chat-msg-avatar" style={{ background: active.f.image }}>
                  {active.f.name.slice(0, 1)}
                </div>
              )}
              <div className="chat-msg-body">
                <div className="chat-msg-bubble">{m.text}</div>
                <div className="chat-msg-time">{m.t}</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="chat-input">
          <button className="chat-input-attach">
            <Icon name="plus" size={16} stroke={2}/>
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="메시지를 입력하세요. Enter로 전송, Shift+Enter 줄바꿈"
            rows={2}
          />
          <button className="chat-input-send" onClick={send} disabled={!draft.trim()}>
            <Icon name="arrow_right" size={16} stroke={2}/>
          </button>
        </footer>
      </section>
    </main>
  );
};

// ──────────────────────────────────────────────────────────
// MyPage
// ──────────────────────────────────────────────────────────
const MyPage = ({ profile, onSwitchRole, onOpenFactory, onNav }) => {
  const role = profile?.role || 'buyer';
  const [tab, setTab] = useState('overview');

  const company = profile?.company || '아크미 인더스트리';
  const email = profile?.email || 'buyer@acme.co.kr';
  const joinedAt = profile?.joinedAt || '2024-10-12';
  const interests = profile?.interests || ['cnc', 'sheet_metal', 'pcb'];

  // 조회기록(더미)
  const recentViews = [
    { id: 'f1', at: '오늘 14:23' },
    { id: 'f4', at: '오늘 11:02' },
    { id: 'f10', at: '어제 18:41' },
    { id: 'f3', at: '어제 09:15' },
    { id: 'f8', at: '12월 17일' },
    { id: 'f2', at: '12월 16일' },
  ];
  const favorites = ['f1', 'f4', 'f8'];

  const stats = [
    { k: '진행중 견적', v: MY_RFQS.filter(r => r.status !== '완료').length, sub: '응답 받은 제조사 ' + MY_RFQS.reduce((s, r) => s + r.responses, 0) + '곳' },
    { k: '관심 제조사', v: favorites.length, sub: '최근 추가 1주일 전' },
    { k: '조회 기록', v: recentViews.length, sub: '최근 7일' },
    { k: '활성 채팅', v: 3, sub: '응답 대기 1건' },
  ];

  return (
    <main className="page mypage">
      <header className="mypage-hero">
        <div className="mypage-hero-id">
          <div className="mypage-avatar">{(profile?.name || '김').slice(0, 1)}</div>
          <div>
            <div className="mypage-role-row">
              <span className={'mypage-role-badge mypage-role-' + role}>
                <Icon name={role === 'buyer' ? 'search' : 'factory'} size={11} stroke={2.2}/>
                {role === 'buyer' ? '바이어' : '제조사'}
              </span>
              <button className="mypage-role-switch" onClick={() => onSwitchRole && onSwitchRole(role === 'buyer' ? 'seller' : 'buyer')}>
                <Icon name="arrow_right" size={11} stroke={2.2}/>
                {role === 'buyer' ? '제조사로 전환' : '바이어로 전환'}
              </button>
            </div>
            <h1>{profile?.name || '김민준'}</h1>
            <div className="mypage-hero-meta">
              <span>{company}</span>
              <span className="dot">·</span>
              <span>{email}</span>
              <span className="dot">·</span>
              <span>{joinedAt} 가입</span>
            </div>
          </div>
        </div>
        <div className="mypage-hero-actions">
          <button className="btn btn-secondary">
            <Icon name="user" size={14} stroke={2}/>
            프로필 수정
          </button>
          <button className="btn btn-primary" onClick={() => onNav && onNav('list')}>
            <Icon name="search" size={14} stroke={2}/>
            제조사 찾기
          </button>
        </div>
      </header>

      <section className="mypage-stats">
        {stats.map(s => (
          <div key={s.k} className="mystat">
            <div className="mystat-k">{s.k}</div>
            <div className="mystat-v">{s.v}</div>
            <div className="mystat-sub">{s.sub}</div>
          </div>
        ))}
      </section>

      <nav className="mypage-tabs">
        {[
          { id: 'overview', label: '개요' },
          { id: 'rfq', label: '견적 요청 내역', count: MY_RFQS.length },
          { id: 'history', label: '최근 조회', count: recentViews.length },
          { id: 'favs', label: '관심 제조사', count: favorites.length },
          { id: 'profile', label: '계정/회사 정보' },
        ].map(t => (
          <button
            key={t.id}
            className={'mypage-tab ' + (tab === t.id ? 'is-active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count != null && <span className="mypage-tab-count">{t.count}</span>}
          </button>
        ))}
      </nav>

      {tab === 'overview' && (
        <section className="mypage-grid">
          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>최근 견적 요청</h3>
              <button onClick={() => setTab('rfq')}>전체 보기</button>
            </header>
            <ul className="rfq-history">
              {MY_RFQS.slice(0, 3).map(r => (
                <li key={r.id} className="rfq-history-row">
                  <div className="rfq-history-status" data-status={r.status}>{r.status}</div>
                  <div className="rfq-history-body">
                    <h4>{r.title}</h4>
                    <div className="rfq-history-meta">
                      <span>#{r.id}</span>
                      <span>·</span>
                      <span>{r.qty.toLocaleString()}개</span>
                      <span>·</span>
                      <span>제조사 {r.factories.length}곳 발송</span>
                      <span>·</span>
                      <span>응답 {r.responses}건</span>
                    </div>
                  </div>
                  <div className="rfq-history-date">{r.date}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>관심 제조사</h3>
              <button onClick={() => setTab('favs')}>전체 보기</button>
            </header>
            <ul className="fav-list">
              {favorites.map(id => {
                const f = FACTORIES_AC.find(x => x.id === id);
                return (
                  <li key={id}>
                    <button className="fav-row" onClick={() => onOpenFactory && onOpenFactory(id)}>
                      <div className="fav-img" style={{ background: f.image }}>
                        <div className="mcard-img-stripes"/>
                      </div>
                      <div className="fav-body">
                        <h4>{f.name}</h4>
                        <span>{f.city} · {f.processes.slice(0, 2).map(pid => PROCESSES_AC.find(p => p.id === pid)?.label).join(', ')}</span>
                      </div>
                      <Icon name="chevron_right" size={14} stroke={2} className="fav-arrow"/>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>관심 분야</h3>
              <button>편집</button>
            </header>
            <div className="mypage-tags">
              {interests.map(id => {
                const p = PROCESSES_AC.find(x => x.id === id);
                return <span key={id} className="mtag">{p?.label || id}</span>;
              })}
            </div>
            <p className="mypage-card-foot">관심 분야에 맞춰 추천 제조사가 자동 갱신됩니다.</p>
          </div>

          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>알림</h3>
              <button>설정</button>
            </header>
            <ul className="noti-list">
              <li><Icon name="chat" size={12} stroke={2}/> 한일프레스금형이 견적 회신을 보냈습니다 · 2시간 전</li>
              <li><Icon name="check" size={12} stroke={2}/> RFQ #r-2401 응답 1건 도착 · 5시간 전</li>
              <li><Icon name="bell" size={12} stroke={2}/> 새 추천 제조사 3곳이 등록되었습니다 · 어제</li>
            </ul>
          </div>
        </section>
      )}

      {tab === 'rfq' && (
        <section className="mypage-table">
          <table>
            <thead>
              <tr>
                <th>요청 번호</th>
                <th>요청일</th>
                <th>제목</th>
                <th>수량</th>
                <th>발송</th>
                <th>응답</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {MY_RFQS.map(r => (
                <tr key={r.id}>
                  <td className="mono">#{r.id}</td>
                  <td>{r.date}</td>
                  <td>{r.title}</td>
                  <td>{r.qty.toLocaleString()}개</td>
                  <td>{r.factories.length}곳</td>
                  <td><strong>{r.responses}</strong>건</td>
                  <td><span className={'status-pill status-' + r.status}>{r.status}</span></td>
                  <td><button className="link-btn">상세</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === 'history' && (
        <section className="mypage-card">
          <header className="mypage-card-head">
            <h3>최근 조회한 제조사</h3>
            <button>기록 삭제</button>
          </header>
          <ul className="hist-list">
            {recentViews.map(v => {
              const f = FACTORIES_AC.find(x => x.id === v.id);
              return (
                <li key={v.id}>
                  <button className="fav-row" onClick={() => onOpenFactory && onOpenFactory(v.id)}>
                    <div className="fav-img" style={{ background: f.image }}>
                      <div className="mcard-img-stripes"/>
                    </div>
                    <div className="fav-body">
                      <h4>{f.name}</h4>
                      <span>{f.city} · {f.processes.slice(0, 2).map(pid => PROCESSES_AC.find(p => p.id === pid)?.label).join(', ')} · ★ {f.rating}</span>
                    </div>
                    <span className="hist-time">{v.at}</span>
                    <Icon name="chevron_right" size={14} stroke={2} className="fav-arrow"/>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tab === 'favs' && (
        <section className="mypage-card">
          <header className="mypage-card-head">
            <h3>관심 제조사</h3>
          </header>
          <ul className="fav-list">
            {favorites.map(id => {
              const f = FACTORIES_AC.find(x => x.id === id);
              return (
                <li key={id}>
                  <button className="fav-row" onClick={() => onOpenFactory && onOpenFactory(id)}>
                    <div className="fav-img" style={{ background: f.image }}>
                      <div className="mcard-img-stripes"/>
                    </div>
                    <div className="fav-body">
                      <h4>{f.name}</h4>
                      <span>{f.city} · MOQ {f.moq.toLocaleString()} {f.moqUnit || '피스'} · 리드 {f.leadDays}일</span>
                    </div>
                    <Icon name="chevron_right" size={14} stroke={2} className="fav-arrow"/>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tab === 'profile' && (
        <section className="mypage-grid">
          <div className="mypage-card">
            <header className="mypage-card-head"><h3>계정 정보</h3><button>수정</button></header>
            <dl className="profile-dl">
              <dt>이름</dt><dd>{profile?.name || '김민준'}</dd>
              <dt>이메일</dt><dd>{email}</dd>
              <dt>휴대폰</dt><dd>010-•••-1234</dd>
              <dt>가입일</dt><dd>{joinedAt}</dd>
            </dl>
          </div>
          <div className="mypage-card">
            <header className="mypage-card-head"><h3>회사 정보</h3><button>수정</button></header>
            <dl className="profile-dl">
              <dt>회사명</dt><dd>{company}</dd>
              <dt>사업자번호</dt><dd>123-45-67890</dd>
              <dt>업종</dt><dd>제조 / 자동차 부품</dd>
              <dt>역할</dt><dd>{role === 'buyer' ? '바이어 (구매)' : '제조사 (판매)'}</dd>
            </dl>
          </div>
        </section>
      )}
    </main>
  );
};

// ──────────────────────────────────────────────────────────
// AdminPage — 운영자 대시보드
// ──────────────────────────────────────────────────────────
const AdminPage = ({ onOpenFactory }) => {
  const [data, setData] = useState(ADMIN_FACTORIES);
  const [tab, setTab] = useState('factories');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');  // all / public / private
  const [showUpload, setShowUpload] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | parsing | uploading | done | error
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = React.useRef(null);

  const closeUpload = () => { setShowUpload(false); setUploadState('idle'); setUploadResult(null); };

  const downloadTemplate = () => {
    const hdr = 'id,name,en,city,region,coord_x,coord_y,industries,processes,products,materials,moq,moq_unit,lead_days,price_range,employees,founded,certs,oem,odm,export,rating,reviews,response_hr,deals,summary,image';
    const ex = 'f_ex1,예시정밀,Example Precision,경기 안산시,gyeonggi,38,32,machine,cnc;cutting,auto;machine_parts,알루미늄;SUS304,100,피스,14,₩2500~₩18000,42,2008,ISO 9001;IATF 16949,true,true,false,4.5,80,3,200,자동차 정밀부품 전문입니다.,#a8b4c8';
    const blob = new Blob([hdr + '\n' + ex], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'factories_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadState('parsing');
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) throw new Error('CSV에 데이터 행이 없어요.');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map((line, i) => {
        const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, j) => { obj[h] = vals[j] || ''; });
        return {
          id: obj.id || ('c' + Date.now() + i),
          name: obj.name || '',
          en: obj.en || '',
          city: obj.city || '',
          region: obj.region || '',
          coord_x: parseFloat(obj.coord_x) || 50,
          coord_y: parseFloat(obj.coord_y) || 50,
          industries: (obj.industries || '').split(';').filter(Boolean),
          processes: (obj.processes || '').split(';').filter(Boolean),
          products: (obj.products || '').split(';').filter(Boolean),
          materials: (obj.materials || '').split(';').filter(Boolean),
          moq: parseInt(obj.moq) || 1,
          moq_unit: obj.moq_unit || '피스',
          lead_days: parseInt(obj.lead_days) || 14,
          price_range: obj.price_range || '',
          employees: parseInt(obj.employees) || 0,
          founded: parseInt(obj.founded) || 2000,
          certs: (obj.certs || '').split(';').filter(Boolean),
          oem: obj.oem === 'true' || obj.oem === '1',
          odm: obj.odm === 'true' || obj.odm === '1',
          export: obj.export === 'true' || obj.export === '1',
          rating: parseFloat(obj.rating) || 0,
          reviews: parseInt(obj.reviews) || 0,
          response_hr: parseInt(obj.response_hr) || 24,
          deals: parseInt(obj.deals) || 0,
          hidden: false,
          summary: obj.summary || '',
          image: obj.image || '#a8b4c8',
        };
      }).filter(r => r.name);
      if (!rows.length) throw new Error('유효한 행이 없어요. name 열이 있는지 확인하세요.');
      setUploadState('uploading');
      if (!window._sb) throw new Error('Supabase 연결 실패. 페이지를 새로고침 해주세요.');
      const { error } = await window._sb.from('factories').upsert(rows, { onConflict: 'id' });
      if (error) throw new Error(error.message);
      setUploadState('done');
      setUploadResult({ count: rows.length });
      const { data: fresh } = await window._sb.from('factories').select('*');
      if (fresh) {
        window.MFG_DATA.FACTORIES = fresh.map(window._dbRowToFactory);
        setData(fresh.map(r => ({
          ...window._dbRowToFactory(r),
          public: !r.hidden,
          registered: new Date().toISOString().slice(0, 10),
          source: 'CSV',
        })));
      }
    } catch (err) {
      setUploadState('error');
      setUploadResult({ msg: err.message });
    }
  };

  const togglePublic = (id) => {
    setData(d => d.map(x => x.id === id ? { ...x, public: !x.public } : x));
  };

  const filtered = data.filter(f => {
    if (filter === 'public' && !f.public) return false;
    if (filter === 'private' && f.public) return false;
    if (q && !(f.name.includes(q) || f.city.includes(q))) return false;
    return true;
  });

  const stats = {
    total: data.length,
    pub: data.filter(f => f.public).length,
    priv: data.filter(f => !f.public).length,
    rfq: 248,
    chat: 89,
    users: 1342,
  };

  return (
    <main className="page admin-page">
      <header className="admin-hero">
        <div>
          <div className="admin-eyebrow">
            <Icon name="shield" size={11} stroke={2.2}/>
            FactoryMatch · 운영자 콘솔
          </div>
          <h1>제조사 데이터 관리</h1>
          <p>엑셀로 일괄 업로드하고, 검증 완료된 제조사만 공개로 전환하세요.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="btn btn-secondary">
            <Icon name="chart" size={14} stroke={2}/>
            통계 다운로드
          </button>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Icon name="upload" size={14} stroke={2}/>
            엑셀 업로드
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <div className="astat"><div className="astat-k">전체 제조사</div><div className="astat-v">{stats.total}</div></div>
        <div className="astat astat-emerald"><div className="astat-k">공개중</div><div className="astat-v">{stats.pub}</div></div>
        <div className="astat astat-amber"><div className="astat-k">비공개</div><div className="astat-v">{stats.priv}</div></div>
        <div className="astat"><div className="astat-k">전체 사용자</div><div className="astat-v">{stats.users.toLocaleString()}</div></div>
        <div className="astat"><div className="astat-k">RFQ (이번달)</div><div className="astat-v">{stats.rfq}</div></div>
        <div className="astat"><div className="astat-k">활성 채팅</div><div className="astat-v">{stats.chat}</div></div>
      </section>

      <nav className="admin-tabs">
        {[
          { id: 'factories', label: '제조사 관리' },
          { id: 'users', label: '사용자' },
          { id: 'rfq', label: 'RFQ 모니터링' },
          { id: 'logs', label: '업로드 이력' },
        ].map(t => (
          <button
            key={t.id}
            className={'admin-tab ' + (tab === t.id ? 'is-active' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'factories' && (
        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Icon name="search" size={14} stroke={2}/>
              <input
                placeholder="제조사명, 도시로 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="admin-segmented">
              {[
                { id: 'all', label: '전체' },
                { id: 'public', label: '공개' },
                { id: 'private', label: '비공개' },
              ].map(s => (
                <button
                  key={s.id}
                  className={'seg-btn ' + (filter === s.id ? 'is-active' : '')}
                  onClick={() => setFilter(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <span className="admin-toolbar-count">{filtered.length}곳</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><input type="checkbox"/></th>
                  <th>제조사명</th>
                  <th>도시</th>
                  <th>공정</th>
                  <th>인증</th>
                  <th>등록일</th>
                  <th>출처</th>
                  <th>공개</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td><input type="checkbox"/></td>
                    <td>
                      <div className="admin-name">
                        <div className="admin-name-dot"/>
                        <strong>{f.name}</strong>
                        <span className="mono">#{f.id}</span>
                      </div>
                    </td>
                    <td>{f.city}</td>
                    <td>
                      <div className="admin-tag-row">
                        {f.processes.slice(0, 2).map(pid => (
                          <span key={pid} className="mtag mtag-sm">{PROCESSES_AC.find(p => p.id === pid)?.label || pid}</span>
                        ))}
                        {f.processes.length > 2 && <span className="admin-more">+{f.processes.length - 2}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="admin-tag-row">
                        {f.certs.slice(0, 2).map(c => <span key={c} className="mtag mtag-sm mtag-emerald">{c}</span>)}
                        {f.certs.length === 0 && <span className="admin-empty">—</span>}
                      </div>
                    </td>
                    <td className="mono">{f.registered}</td>
                    <td><span className="admin-source">{f.source}</span></td>
                    <td>
                      <button
                        className={'toggle-pill ' + (f.public ? 'is-on' : '')}
                        onClick={() => togglePublic(f.id)}
                        aria-label={f.public ? '공개중' : '비공개'}
                      >
                        <span className="toggle-pill-thumb"/>
                        <span className="toggle-pill-label">{f.public ? '공개' : '비공개'}</span>
                      </button>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="link-btn" onClick={() => onOpenFactory && onOpenFactory(f.id)}>
                          <Icon name="eye" size={12} stroke={2}/> 미리보기
                        </button>
                        <button className="link-btn link-danger">삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'users' && (
        <section className="admin-panel admin-placeholder">
          <Icon name="user" size={28} stroke={1.4}/>
          <h3>사용자 관리</h3>
          <p>가입 사용자 목록, 역할 변경, 정지/해제 기능</p>
        </section>
      )}

      {tab === 'rfq' && (
        <section className="admin-panel admin-placeholder">
          <Icon name="chart" size={28} stroke={1.4}/>
          <h3>RFQ 모니터링</h3>
          <p>이번달 RFQ {stats.rfq}건 — 응답률, 평균 회신 시간 트래킹</p>
        </section>
      )}

      {tab === 'logs' && (
        <section className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>일시</th>
                  <th>업로더</th>
                  <th>파일명</th>
                  <th>행 수</th>
                  <th>신규</th>
                  <th>업데이트</th>
                  <th>오류</th>
                  <th>결과</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="mono">2025-01-06 14:23</td><td>운영팀 김</td><td>factories_2025_01.xlsx</td><td>184</td><td>12</td><td>167</td><td>5</td><td><span className="status-pill status-진행중">검증중</span></td></tr>
                <tr><td className="mono">2024-12-28 09:14</td><td>운영팀 박</td><td>factories_dec.xlsx</td><td>241</td><td>38</td><td>198</td><td>5</td><td><span className="status-pill status-완료">완료</span></td></tr>
                <tr><td className="mono">2024-12-15 16:42</td><td>운영팀 김</td><td>cnc_extra.xlsx</td><td>72</td><td>72</td><td>0</td><td>0</td><td><span className="status-pill status-완료">완료</span></td></tr>
                <tr><td className="mono">2024-11-29 11:08</td><td>운영팀 이</td><td>busan_factories.xlsx</td><td>56</td><td>54</td><td>2</td><td>0</td><td><span className="status-pill status-완료">완료</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showUpload && (
        <div className="modal-veil" onClick={closeUpload}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h3>CSV 일괄 업로드</h3>
              <button className="modal-close" onClick={closeUpload}>
                <Icon name="close" size={16} stroke={2}/>
              </button>
            </header>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files[0]; if (f) handleFileUpload(f); e.target.value = ''; }}
            />

            <div
              className="upload-drop"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f); }}
            >
              {uploadState === 'idle' && (<>
                <Icon name="upload" size={28} stroke={1.4}/>
                <strong>CSV 파일을 끌어다 놓으세요</strong>
                <span>.csv · 최대 10MB · 한 번에 1,000개까지</span>
                <button className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="plus" size={12} stroke={2.2}/>
                  파일 선택
                </button>
              </>)}
              {(uploadState === 'parsing' || uploadState === 'uploading') && (<>
                <div className="upload-spinner"/>
                <strong>{uploadState === 'parsing' ? 'CSV 분석 중…' : 'Supabase에 업로드 중…'}</strong>
              </>)}
              {uploadState === 'done' && (<>
                <Icon name="check" size={32} stroke={2}/>
                <strong style={{ color: 'var(--emerald)' }}>업로드 완료!</strong>
                <span>{uploadResult?.count}개 제조사가 Supabase에 등록됐어요.</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setUploadState('idle')}>다른 파일 업로드</button>
              </>)}
              {uploadState === 'error' && (<>
                <Icon name="info" size={32} stroke={1.5}/>
                <strong style={{ color: 'var(--amber)' }}>업로드 실패</strong>
                <span>{uploadResult?.msg}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setUploadState('idle')}>다시 시도</button>
              </>)}
            </div>

            <div className="upload-template">
              <Icon name="info" size={13} stroke={2}/>
              <div>
                <strong>CSV 템플릿 형식</strong>
                <span>id, name, city, region, processes(;구분), certs(;구분), moq, lead_days, rating 등 27개 필드. 배열은 세미콜론(;)으로 구분.</span>
              </div>
              <button className="link-btn" onClick={downloadTemplate}>템플릿 다운로드</button>
            </div>

            <div className="upload-rules">
              <h4>업로드 규칙</h4>
              <ul>
                <li><Icon name="check" size={11} stroke={2.4}/> id 중복 시 upsert(덮어쓰기)</li>
                <li><Icon name="check" size={11} stroke={2.4}/> processes/certs/materials 등 배열 필드는 세미콜론(;)으로 구분</li>
                <li><Icon name="check" size={11} stroke={2.4}/> oem/odm/export 필드는 true 또는 false</li>
                <li><Icon name="check" size={11} stroke={2.4}/> hidden=false로 등록 후 운영자가 공개 전환</li>
              </ul>
            </div>

            <footer className="modal-foot">
              <button className="btn btn-secondary" onClick={closeUpload}>닫기</button>
              <button
                className="btn btn-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadState === 'parsing' || uploadState === 'uploading'}
              >
                <Icon name="upload" size={13} stroke={2.2}/>
                {uploadState === 'parsing' || uploadState === 'uploading' ? '처리 중…' : '파일 선택 후 업로드'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

Object.assign(window, { ChatPage, MyPage, AdminPage });



// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel"
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">{children}</div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

function TweakColor({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <input type="color" className="twk-swatch" value={value}
             onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});

