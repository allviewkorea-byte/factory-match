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
