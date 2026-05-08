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
const Header = ({ route, onNav, density, onLogout, authed, rfqCount = 0 }) => {
  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'list', label: '제조사 탐색' },
    { id: 'rfq', label: '견적 요청', badge: rfqCount > 0 ? rfqCount : null },
    { id: 'chat', label: '채팅' },
  ];
  const isCompact = density === 'compact';
  return (
    <header className="hdr" style={{ height: isCompact ? 56 : 64 }}>
      <div className="hdr-inner">
        <div className="hdr-left">
          <button className="logo" onClick={() => {
            if (route === 'home') window.dispatchEvent(new CustomEvent('home-reset'));
            else onNav('home');
          }}>
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
const INDUSTRY_BG = {
  food:        '#2a7d50',
  machine:     '#1a5fa3',
  electronics: '#5236a0',
  chemical:    '#b85c0f',
  textile:     '#a02d4a',
};
function getCardBg(f) {
  const ind = (f.industries || [])[0];
  return INDUSTRY_BG[ind] || '#3a5882';
}
const INDUSTRY_LABEL_MAP = {
  machine:      '기계/금속',
  electronics:  '전자/전기',
  chemical:     '화학/소재',
  food:         '식품/음료',
  textile:      '섬유/의류',
  auto:         '자동차부품',
  pcb:          'PCB/전자기판',
  assembly:     '조립/가공',
  machine_parts:'기계부품',
  case:         '케이스/외장',
};
function getCardKeywords(f) {
  const kws = [];
  if (f.products?.length) kws.push(...f.products.slice(0, 3).map(p => INDUSTRY_LABEL_MAP[p] || p));
  if (kws.length === 0 && f.industries?.length) kws.push(...f.industries.slice(0, 3).map(p => INDUSTRY_LABEL_MAP[p] || p));
  if (kws.length === 0 && f.processes?.length) {
    const { PROCESSES } = window.MFG_DATA;
    kws.push(...f.processes.slice(0, 3).map(p => PROCESSES.find(x => x.id === p)?.label || p));
  }
  return kws.slice(0, 3).join(' · ') || (f.name || '').slice(0, 12);
}

// 도로명주소에서 도/특별시 + 시/군/구 추출 ("경기도 파주시 문산읍..." → "경기도 파주시")
function _addrCity(addr) {
  if (!addr) return '';
  const parts = addr.trim().split(/\s+/);
  return parts.length >= 2 ? parts[0] + ' ' + parts[1] : parts[0];
}

const ManufacturerCard = ({ f, onOpen, density, compact = false, onAddRFQ, rfqIds = [], simplified = false }) => {
  const { PROCESSES } = window.MFG_DATA;
  const procLabels = (f.processes || []).map(p => PROCESSES.find(x => x.id === p)?.label).filter(Boolean);
  const isCompact = compact || density === 'compact';
  const isInRfq = rfqIds.includes(f.id);

  // Location: 원본 한글 지역명(regionRaw) 우선, 없으면 regionId 사용
  const location = _addrCity(f.roadAddress) || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || f.city || '';

  // 업종 태그: industries 배열 (KICOX는 raw 한글, 샘플은 영문 id)
  const industryTags = (f.industries || []).map(i => INDUSTRY_LABEL_MAP[i] || i).slice(0, 4);

  // 공정 태그: processes 배열 매핑 (샘플 데이터용)
  const processTags = procLabels.slice(0, 3);

  // 소재 태그 (샘플 데이터용)
  const materialTags = (f.materials || []).slice(0, 2);

  // 태그 영역 표시 여부
  const hasTags = industryTags.length > 0 || processTags.length > 0 || materialTags.length > 0;

  // 실제 운영 통계 보유 여부 (rating/deals 값이 있을 때)
  const hasRealStats = (f.rating > 0) || (f.deals > 0) || (f.moq > 0 && f.moq !== 1);
  const hasCerts = (f.certs || []).length > 0;
  const hasFlags = f.oem || f.odm || f.export;
  const hasFooter = hasCerts || hasFlags;

  return (
    <article className={`mcard ${isCompact ? 'is-compact' : ''}`}>
      <div className="mcard-img" style={{ background: getCardBg(f) }}>
        <div className="mcard-kw-text">{getCardKeywords(f)}</div>
      </div>
      <button className="mcard-body" onClick={() => onOpen?.(f.id)}>
        <div className="mcard-head">
          <div className="mcard-titles">
            <h3 className="mcard-name">
              {f.name}
              {hasCerts && (f.certs || []).includes('IATF 16949') && (
                <span className="mcard-verified" title="인증 제조사">
                  <Icon name="badge_check" size={14} stroke={2}/>
                </span>
              )}
            </h3>
            <div className="mcard-sub">
              {location && <span>{location}</span>}
              {f.founded > 0 && <><span>·</span><span>{f.founded}년 설립</span></>}
              {f.employees > 0 && <><span>·</span><span>직원 {f.employees.toLocaleString()}명</span></>}
            </div>
          </div>
          {f.rating > 0 && (
            <div className="mcard-rating">
              <Icon name="star" size={12} stroke={2}/>
              <strong>{f.rating}</strong>
              {f.reviews > 0 && <span>({f.reviews})</span>}
            </div>
          )}
        </div>

        {simplified ? (
          <>
            {hasTags && (
              <div className="mcard-tags">
                {processTags.map(p => <span key={p} className="mtag">{p}</span>)}
                {industryTags.map(i => <span key={i} className="mtag mtag-ind">{i}</span>)}
              </div>
            )}
            {f.summary && <p className="mcard-desc">{f.summary}</p>}
          </>
        ) : (
          <>
            {f.summary && <p className="mcard-desc">{f.summary}</p>}

            {hasTags && (
              <div className="mcard-tags">
                {processTags.map(p => <span key={p} className="mtag">{p}</span>)}
                {industryTags.map(i => <span key={i} className="mtag mtag-ind">{i}</span>)}
                {materialTags.map(m => <span key={m} className="mtag mtag-mat">{m}</span>)}
              </div>
            )}

            {hasRealStats && (
              <div className="mcard-stats">
                {f.moq > 0 && (
                  <>
                    <div className="stat">
                      <span className="stat-k">MOQ</span>
                      <span className="stat-v">{f.moq.toLocaleString()}<em className="stat-unit">{f.moqUnit || '피스'}</em></span>
                    </div>
                    <div className="stat-sep"/>
                  </>
                )}
                {f.leadDays > 0 && (
                  <>
                    <div className="stat">
                      <span className="stat-k">리드타임</span>
                      <span className="stat-v">{f.leadDays}일</span>
                    </div>
                    {(f.responseHr > 0 && f.responseHr < 24) || f.deals > 0 ? <div className="stat-sep"/> : null}
                  </>
                )}
                {f.responseHr > 0 && f.responseHr < 24 && (
                  <>
                    <div className="stat">
                      <span className="stat-k">응답</span>
                      <span className="stat-v">{f.responseHr}h</span>
                    </div>
                    {f.deals > 0 && <div className="stat-sep"/>}
                  </>
                )}
                {f.deals > 0 && (
                  <div className="stat">
                    <span className="stat-k">거래</span>
                    <span className="stat-v">{f.deals}건</span>
                  </div>
                )}
              </div>
            )}

            {hasFooter && (
              <div className="mcard-foot">
                <div className="mcard-cert">
                  {(f.certs || []).slice(0, 3).map(c => (
                    <span key={c} className="cert">{c}</span>
                  ))}
                  {(f.certs || []).length > 3 && <span className="cert cert-more">+{(f.certs || []).length - 3}</span>}
                </div>
                <div className="mcard-flags">
                  {f.oem && <span className="flag">OEM</span>}
                  {f.odm && <span className="flag">ODM</span>}
                  {f.export && <span className="flag flag-export">수출</span>}
                </div>
              </div>
            )}
          </>
        )}
      </button>
      {onAddRFQ && (
        <div className="mcard-rfq-row">
          <button
            className={`mcard-rfq-btn${isInRfq ? ' is-added' : ''}`}
            onClick={(e) => { e.stopPropagation(); onAddRFQ(f.id); }}
          >
            {isInRfq
              ? <><Icon name="check" size={12} stroke={2.4}/> 견적 추가됨</>
              : simplified ? '견적 요청' : '견적 요청하기'}
          </button>
        </div>
      )}
    </article>
  );
};

// ──────────────────────────────────────────────────────────
// Korea map placeholder (Naver-ish styling)
// ──────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────
// 주소 → SVG 좌표 매핑 (viewBox 0 0 100 100)
// ──────────────────────────────────────────────────────────
const CITY_COORDS = [
  // 서울
  { kw: ['서울'],                                    x: 39, y: 20 },
  // 인천
  { kw: ['인천'],                                    x: 32, y: 27 },
  // 경기 세부
  { kw: ['고양시', '경기 고양'],                     x: 36, y: 22 },
  { kw: ['파주시', '경기 파주'],                     x: 35, y: 20 },
  { kw: ['김포시', '경기 김포'],                     x: 34, y: 25 },
  { kw: ['부천시', '경기 부천'],                     x: 35, y: 27 },
  { kw: ['광명시', '경기 광명'],                     x: 37, y: 28 },
  { kw: ['안양시', '경기 안양'],                     x: 39, y: 30 },
  { kw: ['과천시', '경기 과천'],                     x: 40, y: 28 },
  { kw: ['남양주시', '경기 남양주'],                 x: 44, y: 24 },
  { kw: ['양주시', '경기 양주'],                     x: 42, y: 23 },
  { kw: ['구리시', '경기 구리'],                     x: 42, y: 24 },
  { kw: ['성남시', '경기 성남', '판교', '분당'],     x: 42, y: 27 },
  { kw: ['용인시', '경기 용인'],                     x: 43, y: 31 },
  { kw: ['안산시', '경기 안산'],                     x: 37, y: 33 },
  { kw: ['시흥시', '경기 시흥'],                     x: 36, y: 33 },
  { kw: ['수원시', '경기 수원'],                     x: 40, y: 33 },
  { kw: ['화성시', '경기 화성'],                     x: 39, y: 37 },
  { kw: ['오산시', '경기 오산'],                     x: 41, y: 37 },
  { kw: ['평택시', '경기 평택'],                     x: 41, y: 40 },
  { kw: ['이천시', '경기 이천'],                     x: 46, y: 35 },
  { kw: ['포천시', '경기 포천'],                     x: 45, y: 22 },
  { kw: ['경기'],                                    x: 40, y: 30 },
  // 강원
  { kw: ['춘천시', '강원 춘천'],                     x: 50, y: 27 },
  { kw: ['원주시', '강원 원주'],                     x: 51, y: 34 },
  { kw: ['강릉시', '강원 강릉'],                     x: 59, y: 33 },
  { kw: ['동해시', '강원 동해'],                     x: 60, y: 39 },
  { kw: ['강원'],                                    x: 55, y: 32 },
  // 충청
  { kw: ['세종'],                                    x: 41, y: 49 },
  { kw: ['대전'],                                    x: 42, y: 53 },
  { kw: ['천안시', '충남 천안'],                     x: 41, y: 45 },
  { kw: ['아산시', '충남 아산'],                     x: 39, y: 45 },
  { kw: ['당진시', '충남 당진'],                     x: 36, y: 44 },
  { kw: ['홍성군', '충남 홍성'],                     x: 37, y: 50 },
  { kw: ['서산시', '충남 서산'],                     x: 35, y: 47 },
  { kw: ['충남'],                                    x: 39, y: 50 },
  { kw: ['청주시', '충북 청주'],                     x: 45, y: 47 },
  { kw: ['충주시', '충북 충주'],                     x: 48, y: 41 },
  { kw: ['충북'],                                    x: 46, y: 46 },
  // 전라
  { kw: ['광주'],                                    x: 47, y: 74 },
  { kw: ['전주시', '전북 전주'],                     x: 46, y: 66 },
  { kw: ['군산시', '전북 군산'],                     x: 41, y: 62 },
  { kw: ['익산시', '전북 익산'],                     x: 43, y: 63 },
  { kw: ['전북'],                                    x: 45, y: 66 },
  { kw: ['여수시', '전남 여수'],                     x: 55, y: 83 },
  { kw: ['순천시', '전남 순천'],                     x: 54, y: 79 },
  { kw: ['목포시', '전남 목포'],                     x: 41, y: 80 },
  { kw: ['광양시', '전남 광양'],                     x: 57, y: 79 },
  { kw: ['나주시', '전남 나주'],                     x: 46, y: 76 },
  { kw: ['전남'],                                    x: 49, y: 79 },
  // 경상
  { kw: ['대구'],                                    x: 63, y: 67 },
  { kw: ['포항시', '경북 포항'],                     x: 73, y: 60 },
  { kw: ['구미시', '경북 구미'],                     x: 60, y: 62 },
  { kw: ['경주시', '경북 경주'],                     x: 70, y: 67 },
  { kw: ['안동시', '경북 안동'],                     x: 65, y: 53 },
  { kw: ['영주시', '경북 영주'],                     x: 63, y: 49 },
  { kw: ['김천시', '경북 김천'],                     x: 58, y: 63 },
  { kw: ['경북'],                                    x: 65, y: 60 },
  { kw: ['울산'],                                    x: 73, y: 72 },
  { kw: ['부산'],                                    x: 70, y: 80 },
  { kw: ['창원시', '경남 창원'],                     x: 63, y: 78 },
  { kw: ['김해시', '경남 김해'],                     x: 68, y: 78 },
  { kw: ['거제시', '경남 거제'],                     x: 67, y: 84 },
  { kw: ['진주시', '경남 진주'],                     x: 58, y: 82 },
  { kw: ['양산시', '경남 양산'],                     x: 69, y: 75 },
  { kw: ['사천시', '경남 사천'],                     x: 57, y: 83 },
  { kw: ['경남'],                                    x: 63, y: 80 },
  // 제주
  { kw: ['제주', '서귀포'],                          x: 55, y: 94 },
];

function getCityCoord(city) {
  if (!city) return null;
  for (const entry of CITY_COORDS) {
    if (entry.kw.some(k => city.includes(k))) return { x: entry.x, y: entry.y };
  }
  return null;
}

const KoreaMap = ({ factories, selectedId, onPin, hoveredId }) => {
  const [tip, setTip] = React.useState(null);
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
          const coord = getCityCoord(f.city) || (f.coord || { x: 50, y: 50 });
          const koreanProducts = (f.products || []).filter(p => /[가-힯]/.test(p));
          const tipItems = koreanProducts.length > 0 ? koreanProducts : (f.materials || []);
          return (
            <button
              key={f.id}
              className={`map-pin ${isSel ? 'is-selected' : ''} ${isHov ? 'is-hovered' : ''}`}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              onClick={() => onPin(f.id)}
              onMouseEnter={() => setTip({ f, x: coord.x, y: coord.y, tipItems })}
              onMouseLeave={() => setTip(null)}
              aria-label={f.name}
            >
              <span className="map-pin-dot"/>
              <span className="map-pin-label">{f.name}</span>
            </button>
          );
        })}
        {tip && (
          <div
            className="map-pin-tip"
            style={{
              left: `${Math.min(tip.x + 2, 68)}%`,
              top:  `${Math.max(tip.y - 14, 2)}%`,
            }}
          >
            <div className="map-pin-tip-name">{tip.f.name}</div>
            {tip.f.city && <div className="map-pin-tip-city">{tip.f.city}</div>}
            {tip.tipItems.length > 0 && (
              <div className="map-pin-tip-products">
                {tip.tipItems.slice(0, 3).join(' · ')}
              </div>
            )}
          </div>
        )}
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

// Singleton loader for Google Maps JS API
let _mapsApiPromise = null;
// Module-level geocode cache: address string → {lat, lng} | null
const _geocodeCache = new Map();
function _loadMapsApi(key) {
  if (_mapsApiPromise) return _mapsApiPromise;
  _mapsApiPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) { resolve(); return; }
    window.__gmapsCallback = resolve;
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__gmapsCallback&language=ko`;
    s.async = true;
    s.onerror = () => { _mapsApiPromise = null; reject(new Error('Maps API load failed')); };
    document.head.appendChild(s);
  });
  return _mapsApiPromise;
}

// Google Maps JS API panel — native Markers (follow pan/zoom)
function ListMapPanel({ geoFactories, pagedFactories, selectedFactory, mapsKey, onOpenFactory }) {
  const mapDivRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const clustererRef = React.useRef(null);  // MarkerClusterer instance
  const markersRef = React.useRef([]);      // pre-geocoded (geoFactories)
  const dynMarkersRef = React.useRef([]);   // dynamically geocoded (pagedFactories)
  const infoWindowRef = React.useRef(null);
  const onOpenRef = React.useRef(onOpenFactory);
  const [mapReady, setMapReady] = React.useState(false);

  React.useEffect(() => { onOpenRef.current = onOpenFactory; }, [onOpenFactory]);

  // Load API once, init map
  React.useEffect(() => {
    if (!MAPS_ENABLED || !mapsKey) return;
    _loadMapsApi(mapsKey).then(() => {
      if (!mapDivRef.current || mapRef.current) return;
      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center: { lat: 36.5, lng: 127.5 },
        zoom: 7,
        gestureHandling: 'greedy',
      });
      infoWindowRef.current = new google.maps.InfoWindow();
      setMapReady(true);
    }).catch(() => {});
  }, [mapsKey]);

  // Sync markers with geoFactories — apply MarkerClusterer
  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Destroy previous clusterer and clear markers
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    window.__omf = (id) => onOpenRef.current(id);
    const newMarkers = [];
    (geoFactories || []).filter(f => f.lat != null && f.lng != null).forEach(f => {
      // No 'map' prop — clusterer manages visibility
      const marker = new google.maps.Marker({
        position: { lat: f.lat, lng: f.lng },
        title: f.name,
      });
      marker.addListener('click', () => {
        if (!window._factoryCache) window._factoryCache = {};
        window._factoryCache[f.id] = f;
        const safeId = f.id.toString().replace(/'/g, "\\'");
        infoWindowRef.current.setContent(
          `<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">` +
          `<div style="font-weight:600;font-size:13px;margin-bottom:2px">${f.name}</div>` +
          `<div style="font-size:12px;color:#555;margin-bottom:6px">${f.city}</div>` +
          `<button onclick="window.__omf('${safeId}')" style="font-size:12px;padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:4px;cursor:pointer">상세보기</button>` +
          `</div>`
        );
        infoWindowRef.current.open(mapRef.current, marker);
      });
      newMarkers.push(marker);
    });
    markersRef.current = newMarkers;

    if (newMarkers.length > 0) {
      const MC = window.markerClusterer?.MarkerClusterer;
      if (MC) {
        clustererRef.current = new MC({ map: mapRef.current, markers: newMarkers });
      } else {
        // Fallback if CDN not yet loaded
        newMarkers.forEach(m => m.setMap(mapRef.current));
      }
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, [mapReady, geoFactories]);

  // Dynamic geocoding — pagedFactories without pre-geocoded coords
  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    dynMarkersRef.current.forEach(m => m.setMap(null));
    dynMarkersRef.current = [];
    if (!pagedFactories || !pagedFactories.length) return;

    // Skip factories already covered by geoFactories markers
    const geoIds = new Set((geoFactories || []).map(f => f.id));
    const toCode = pagedFactories.filter(f =>
      !geoIds.has(f.id) && f.lat == null && (f.roadAddress || f.address)
    );
    if (!toCode.length) return;

    const geocoder = new google.maps.Geocoder();
    const addDyn = (f, lat, lng) => {
      if (!mapRef.current) return;
      const marker = new google.maps.Marker({
        position: { lat, lng }, map: mapRef.current, title: f.name,
      });
      marker.addListener('click', () => {
        if (!window._factoryCache) window._factoryCache = {};
        window._factoryCache[f.id] = f;
        const safeId = f.id.toString().replace(/'/g, "\\'");
        infoWindowRef.current.setContent(
          `<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">` +
          `<div style="font-weight:600;font-size:13px;margin-bottom:2px">${f.name}</div>` +
          `<div style="font-size:12px;color:#555;margin-bottom:6px">${_addrCity(f.roadAddress) || f.city}</div>` +
          `<button onclick="window.__omf('${safeId}')" style="font-size:12px;padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:4px;cursor:pointer">상세보기</button>` +
          `</div>`
        );
        infoWindowRef.current.open(mapRef.current, marker);
      });
      dynMarkersRef.current.push(marker);
    };

    toCode.forEach((f, i) => {
      const addr = f.roadAddress || f.address;
      if (_geocodeCache.has(addr)) {
        const cached = _geocodeCache.get(addr);
        if (cached) addDyn(f, cached.lat, cached.lng);
        return;
      }
      // Throttle: 200ms per request to stay within Maps API rate limit
      setTimeout(() => {
        geocoder.geocode({ address: addr }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            // Validate Korea bounds before using
            if (lat >= 33.0 && lat <= 38.9 && lng >= 124.5 && lng <= 132.0) {
              _geocodeCache.set(addr, { lat, lng });
              addDyn(f, lat, lng);
            } else {
              _geocodeCache.set(addr, null);
            }
          } else {
            _geocodeCache.set(addr, null);
          }
        });
      }, i * 200);
    });

    return () => {
      dynMarkersRef.current.forEach(m => m.setMap(null));
      dynMarkersRef.current = [];
    };
  }, [mapReady, pagedFactories, geoFactories]);

  // Pan/zoom to selected factory
  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (selectedFactory) {
      if (selectedFactory.lat != null && selectedFactory.lng != null) {
        mapRef.current.panTo({ lat: selectedFactory.lat, lng: selectedFactory.lng });
        mapRef.current.setZoom(14);
      } else {
        new google.maps.Geocoder().geocode(
          { address: selectedFactory.roadAddress || selectedFactory.address || `${selectedFactory.name} ${selectedFactory.city}` },
          (res, status) => {
            if (status === 'OK' && res[0]) {
              mapRef.current.panTo(res[0].geometry.location);
              mapRef.current.setZoom(14);
            }
          }
        );
      }
    } else {
      mapRef.current.panTo({ lat: 36.5, lng: 127.5 });
      mapRef.current.setZoom(7);
    }
  }, [mapReady, selectedFactory]);

  if (!MAPS_ENABLED || !mapsKey) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--ink-3)', fontSize: 13, background: 'var(--bg-soft)' }}>
        <Icon name="pin" size={20} stroke={1.6}/>
        <span>지도 준비 중</span>
      </div>
    );
  }

  return <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />;
}

Object.assign(window, { Icon, Header, Badge, Chip, ManufacturerCard, KoreaMap });


// 페이지: Home, List, Detail, RFQ, MyPage

const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React;

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

const HomePage = ({ onSearch, onOpenFactory, density }) => {
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
        {!hasResults && <h1 className="home-headline">{HOME_HEADLINE}</h1>}
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

        {!hasResults && (
          <div className="home-tag-row">
            {HOME_TAGS.map(tag => (
              <button key={tag} className="home-tag-pill" onClick={() => { setQ(tag); }}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {!hasResults && (
          <div className="home-stats-bar">
            전국 <strong>{factoryCount != null ? factoryCount.toLocaleString() + '개' : '217,054개'}</strong> 공장 DB &nbsp;·&nbsp; <strong>1,192개</strong> 사업자 인증
          </div>
        )}
      </div>

      {(loading || hasResults) && (
        <div className={`home-results ${loading ? 'is-loading' : ''}`}>
          {loading && (
            <div className="home-search-loading">
              <span className="home-loading-spinner"/>
              <span>AI가 분석 중…</span>
            </div>
          )}

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

// ══════════════════════════════════════════════════════════
// LIST + MAP
// ══════════════════════════════════════════════════════════

// Persists filter state across unmount/remount (e.g. List → Detail → List)
let _listStateCache = null;

const INDUSTRY_CATS = [
  { id: 'metal',     label: '금속/기계',   industryId: 'machine',
    korKws: ['금속', '기계', '장비', '철강', '1차 금속', '주조', '단조', '프레스', '용접', '도장', '도금', '표면처리', '조선', '자동차', '금형'],
    subs: [
    { id: 'cnc',      label: 'CNC 가공',   pids: ['cnc', 'cutting'] },
    { id: 'press',    label: '프레스',     pids: ['press'] },
    { id: 'welding',  label: '용접',       pids: ['welding'] },
    { id: 'forging',  label: '단조',       pids: [] },
    { id: 'casting',  label: '주조',       pids: [] },
    { id: 'heat',     label: '열처리',     pids: [] },
    { id: 'painting', label: '도장',       pids: ['painting'] },
  ]},
  { id: 'electronics', label: '전자/PCB', industryId: 'electronics',
    korKws: ['전자', '반도체', 'PCB', '전기', '전장', '컴퓨터', '영상', '음향', '통신', '광학기기'],
    subs: [
    { id: 'pcb',      label: 'PCB 조립',  pids: [] },
    { id: 'smt',      label: 'SMT',       pids: [] },
    { id: 'semicon',  label: '반도체',    pids: [] },
    { id: 'eparts',   label: '전장부품',  pids: [] },
  ]},
  { id: 'plastic',   label: '플라스틱/고무', industryId: null,
    korKws: ['플라스틱', '고무', '합성수지', '사출', '압출', '실리콘', '비금속', '유리', '도자'],
    subs: [
    { id: 'injection',label: '사출',      pids: ['injection'] },
    { id: 'mold',     label: '금형',      pids: ['mold'] },
    { id: 'extrusion',label: '압출',      pids: [] },
    { id: 'silicone', label: '실리콘',    pids: [] },
  ]},
  { id: 'textile',   label: '섬유/봉제',  industryId: 'textile',
    korKws: ['섬유', '봉제', '직물', '의류', '의복', '신발', '가죽', '모피', '편직'],
    subs: [
    { id: 'sewing',   label: '봉제',      pids: [] },
    { id: 'dyeing',   label: '나염',      pids: [] },
    { id: 'embroid',  label: '자수',      pids: [] },
    { id: 'notions',  label: '단추/부자재', pids: [] },
    { id: 'knit',     label: '니트',      pids: [] },
  ]},
  { id: 'food',      label: '식품',       industryId: 'food',
    korKws: ['식료품', '식품', '음료', '주류', '담배', '제과', '도축', '수산'],
    subs: [
    { id: 'foodproc', label: '식품가공',  pids: [] },
    { id: 'foodpack', label: '포장',      pids: [] },
    { id: 'foodoem',  label: 'OEM식품',   pids: [] },
    { id: 'haccp',    label: 'HACCP',     pids: [] },
  ]},
  { id: 'chemical',  label: '화학/소재',  industryId: 'chemical',
    korKws: ['화학', '도료', '비료', '의약', '석유', '코크스', '접착', '화장품', '세제'],
    subs: [
    { id: 'plating',  label: '도금',      pids: [] },
    { id: 'coating',  label: '코팅',      pids: [] },
    { id: 'chemproc', label: '화학처리',  pids: [] },
  ]},
  { id: 'wood',      label: '목재/가구',  industryId: null,
    korKws: ['목재', '가구', '나무', '종이', '펄프', '인테리어'],
    subs: [
    { id: 'woodwork', label: '목공',      pids: [] },
    { id: 'furniture',label: '가구',      pids: [] },
    { id: 'interior', label: '인테리어 자재', pids: [] },
  ]},
  { id: 'print',     label: '인쇄/포장',  industryId: null,
    korKws: ['인쇄', '출판', '포장', '라벨'],
    subs: [
    { id: 'printing', label: '인쇄',      pids: [] },
    { id: 'packaging',label: '패키지',    pids: [] },
    { id: 'label',    label: '라벨',      pids: [] },
  ]},
  { id: 'other',     label: '기타',       industryId: null,
    korKws: ['재활용', '폐기물', '수리', '조립'],
    subs: [
    { id: 'assemblyX',label: '조립',      pids: ['assembly'] },
    { id: 'logistics',label: '물류포장',  pids: [] },
    { id: 'etcX',     label: '기타',      pids: [] },
  ]},
];

// Region ID → DB region column values (for Supabase server-side filter)
const _REGION_TO_DB_VALS = {
  seoul:     ['서울특별시'],
  gyeonggi:  ['경기도', 'gyeonggi'],
  incheon:   ['인천광역시'],
  busan:     ['부산광역시'],
  daegu:     ['대구광역시'],
  gyeongnam: ['경상남도', 'gyeongnam'],
  gyeongbuk: ['경상북도'],
  chungnam:  ['충청남도'],
  chungbuk:  ['충청북도'],
  daejeon:   ['대전광역시'],
  sejong:    ['세종특별자치시'],
  gwangju:   ['광주광역시'],
  jeonnam:   ['전라남도'],
  jeonbuk:   ['전북특별자치도', '전라북도'],
  gangwon:   ['강원특별자치도', '강원도'],
  ulsan:     ['울산광역시'],
  jeju:      ['제주특별자치도', '제주도'],
};
const _applyRegionFilter = (q, regionId) => {
  if (regionId === 'other') return q.is('region', null);
  const vals = _REGION_TO_DB_VALS[regionId];
  if (!vals) return q;
  return vals.length === 1 ? q.eq('region', vals[0]) : q.in('region', vals);
};

const ListPage = ({ onOpenFactory, onAddRFQ, rfqIds, density, initialQuery }) => {
  const { PROCESSES } = window.MFG_DATA;
  const [factories, setFactories] = useStateP(window.MFG_DATA.FACTORIES);
  const [dbLoading, setDbLoading] = useStateP(true);
  const [dbError, setDbError] = useStateP(null);
  const [dbTotalCount, setDbTotalCount] = useStateP(null);
  const [regionCounts, setRegionCounts] = useStateP({});
  const [geoFactories, setGeoFactories] = useStateP([]);   // geocoded 공장 지도용
  const [regionRows, setRegionRows] = useStateP([]);         // 지역 선택 시 서버사이드 로드
  const [regionLoading, setRegionLoading] = useStateP(false);
  const [showAllRegions, setShowAllRegions] = useStateP(false);
  const mapsKey = useMapsKey();

  // Restore filter state from cache, unless this is a fresh search from home
  const _prevInitialQuery = _listStateCache?.initialQuery;
  const _freshSearch = !!(initialQuery && initialQuery !== _prevInitialQuery);
  const [query, setQuery] = useStateP(_freshSearch ? initialQuery : (_listStateCache?.query ?? initialQuery ?? ''));
  const [activeProcess, setActiveProcess] = useStateP(_freshSearch ? 'all' : (_listStateCache?.activeProcess ?? 'all'));
  const [activeRegion, setActiveRegion] = useStateP(_freshSearch ? 'all' : (_listStateCache?.activeRegion ?? 'all'));
  const [moqMax, setMoqMax] = useStateP(_freshSearch ? 10000 : (_listStateCache?.moqMax ?? 10000));
  const [oemOnly, setOemOnly] = useStateP(_freshSearch ? false : (_listStateCache?.oemOnly ?? false));
  const [exportOnly, setExportOnly] = useStateP(_freshSearch ? false : (_listStateCache?.exportOnly ?? false));
  const [sort, setSort] = useStateP(_freshSearch ? 'match' : (_listStateCache?.sort ?? 'match'));
  const [hovered, setHovered] = useStateP(null);
  const [selected, setSelected] = useStateP(null);
  const [page, setPage] = useStateP(1);
  const PAGE_SIZE = 20;

  // Accordion state: which sections are open
  const [openSections, setOpenSections] = useStateP(() => new Set(['region', 'industry']));
  const toggleSection = (id) => setOpenSections(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  // Industry filter & category expand state
  const [activeIndustry, setActiveIndustry] = useStateP('all');
  const [openCats, setOpenCats] = useStateP(() => new Set());
  const toggleCat = (id) => setOpenCats(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const selectIndustry = (id) => {
    setActiveIndustry(prev => prev === id ? 'all' : id);
    // auto-expand the parent category when picking a subcategory
    for (const c of INDUSTRY_CATS) {
      if (c.id === id) { setOpenCats(prev => { const n = new Set(prev); n.add(id); return n; }); break; }
      if (c.subs.some(s => s.id === id)) { setOpenCats(prev => { const n = new Set(prev); n.add(c.id); return n; }); break; }
    }
  };

  useEffectP(() => {
    if (!window._sb) { setDbLoading(false); return; }
    let mounted = true;
    const PAGE = 1000;
    const MAX_LOAD = 2000; // 2페이지 로드 (쿼리 횟수 감소)

    // Fetch total DB count separately
    window._sb.from('factories').select('id', { count: 'estimated', head: true })
      .then(({ count }) => { if (mounted && count != null) setDbTotalCount(count); })
      .catch(() => {});

    const loadPage = async (from, acc) => {
      // WHERE 절 없이 PK 순 정렬 → 플래너가 반드시 PK 인덱스 사용
      // hidden 필터는 클라이언트에서 처리
      const { data, error } = await window._sb
        .from('factories').select('*')
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1);
      if (!mounted) return;
      if (error) { setDbError(error.message); setDbLoading(false); return; }
      if (!data || data.length === 0) {
        setFactories(acc.length > 0 ? acc : window.MFG_DATA.FACTORIES);
        setDbLoading(false);
        return;
      }
      // hidden=true 클라이언트 필터링
      const mapped = data.filter(r => !r.hidden).map(window._dbRowToFactory);
      const next = [...acc, ...mapped];
      if (data.length < PAGE || next.length >= MAX_LOAD) {
        const sorted = next.slice().sort((a, b) =>
          (b.enrichedScore || 0) - (a.enrichedScore || 0) || (b.rating || 0) - (a.rating || 0)
        );
        setFactories(sorted);
        setDbLoading(false);
        if (mounted) {
          const counts = {};
          sorted.forEach(f => { if (f.region) counts[f.region] = (counts[f.region] || 0) + 1; });
          setRegionCounts(counts);
        }
      } else {
        loadPage(from + PAGE, next);
      }
    };

    loadPage(0, []);
    return () => { mounted = false; };
  }, []);

  // 지도 핀 로드 — activeRegion 변경 시 재쿼리
  // 지역 선택: region + coord_x IS NOT NULL 조건으로 전체 페이지네이션 (제한 없음)
  // 전체 보기: 1,000개 제한 (전체 DB 규모 대비 합리적 샘플)
  useEffectP(() => {
    if (!window._sb) return;
    let mounted = true;
    setGeoFactories([]);

    if (activeRegion === 'all') {
      window._sb.from('factories').select('*')
        .not('coord_x', 'is', null).not('coord_y', 'is', null)
        .limit(1000)
        .then(({ data }) => {
          if (mounted && data) setGeoFactories(data.map(window._dbRowToFactory).filter(f => f.coord != null));
        }).catch(() => {});
    } else {
      const GEO_PAGE = 1000;
      const loadGeoPage = async (from, acc) => {
        let q = window._sb.from('factories').select('*')
          .not('coord_x', 'is', null).not('coord_y', 'is', null)
          .order('id', { ascending: true })
          .range(from, from + GEO_PAGE - 1);
        q = _applyRegionFilter(q, activeRegion);
        const { data, error } = await q;
        if (!mounted) return;
        if (error || !data || data.length === 0) {
          setGeoFactories(acc.map(window._dbRowToFactory).filter(f => f.coord != null));
          return;
        }
        const next = [...acc, ...data];
        if (data.length < GEO_PAGE) {
          setGeoFactories(next.map(window._dbRowToFactory).filter(f => f.coord != null));
        } else {
          loadGeoPage(from + GEO_PAGE, next);
        }
      };
      loadGeoPage(0, []);
    }

    return () => { mounted = false; };
  }, [activeRegion]);

  // 지역 필터 선택 시 서버사이드 데이터 로드 (최대 5,000개)
  useEffectP(() => {
    if (!window._sb || activeRegion === 'all') {
      setRegionRows([]);
      setRegionLoading(false);
      return;
    }
    let mounted = true;
    setRegionLoading(true);
    setRegionRows([]);
    const PAGE = 1000;
    const MAX = 5000;
    const loadPage = async (from, acc) => {
      let q = window._sb.from('factories').select('*')
        .eq('hidden', false)
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1);
      q = _applyRegionFilter(q, activeRegion);
      const { data, error } = await q;
      if (!mounted) return;
      if (error || !data || data.length === 0) {
        setRegionRows(acc.map(window._dbRowToFactory));
        setRegionLoading(false);
        return;
      }
      const next = [...acc, ...data];
      if (data.length < PAGE || next.length >= MAX) {
        setRegionRows(next.map(window._dbRowToFactory));
        setRegionLoading(false);
      } else {
        loadPage(from + PAGE, next);
      }
    };
    loadPage(0, []);
    return () => { mounted = false; };
  }, [activeRegion]);

  // 지역별 카운트 — get_region_counts() RPC 함수 단일 호출 (정확한 집계)
  useEffectP(() => {
    if (!window._sb) return;
    window._sb.rpc('get_region_counts')
      .then(({ data, error }) => {
        if (error || !data) return;
        const counts = {};
        data.forEach(row => { counts[row.region_id] = Number(row.cnt); });
        setRegionCounts(counts);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemoP(() => {
    // Resolve industry filter
    let industryPids = null;
    let industryId   = null;
    let catKorKws    = [];   // 한글 키워드 (KICOX 공장 매칭용)
    if (activeIndustry !== 'all') {
      const cat = INDUSTRY_CATS.find(c => c.id === activeIndustry);
      if (cat) {
        industryPids = cat.subs.flatMap(s => s.pids);
        industryId   = cat.industryId;
        catKorKws    = cat.korKws || [];
      } else {
        for (const c of INDUSTRY_CATS) {
          const sub = c.subs.find(s => s.id === activeIndustry);
          if (sub) {
            industryPids = sub.pids;
            industryId   = null;
            catKorKws    = c.korKws || [];   // 서브카테고리는 부모 키워드 사용
            break;
          }
        }
      }
    }

    const KNOWN_REGIONS = new Set(['seoul','gyeonggi','incheon','busan','daegu','gyeongnam','gyeongbuk','chungnam','chungbuk','daejeon','sejong','gwangju','jeonnam','jeonbuk','gangwon','ulsan','jeju']);
    // 지역 선택 시 서버사이드 로드된 regionRows 사용, 전체는 클라이언트 캐시 factories 사용
    const source = activeRegion !== 'all' ? regionRows : factories;
    let arr = source.filter(f => {
      if (f.hidden) return false;
      if (activeProcess !== 'all' && !f.processes.includes(activeProcess)) return false;
      if (activeRegion === 'other') {
        if (KNOWN_REGIONS.has(f.region)) return false;
      } else if (activeRegion !== 'all' && f.region !== activeRegion) return false;
      if (f.moq > moqMax) return false;
      if (oemOnly && !f.oem) return false;
      if (exportOnly && !f.export) return false;
      if (industryPids !== null || industryId !== null || catKorKws.length > 0) {
        // 1) process ID 매칭 (영문 샘플 공장)
        const pidMatch = industryPids && industryPids.length > 0
          && industryPids.some(p => (f.processes || []).includes(p));
        // 2) industries 영문 ID 매칭 (영문 샘플 공장)
        const indMatch = industryId && (f.industries || []).includes(industryId);
        // 3) 한글 키워드 매칭: industries 배열 또는 summary 텍스트 (KICOX 공장)
        const korMatch = catKorKws.length > 0 && (
          (f.industries || []).some(ind => catKorKws.some(kw => ind.includes(kw))) ||
          catKorKws.some(kw => (f.summary || '').includes(kw))
        );
        if (!pidMatch && !indMatch && !korMatch) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const hay = ((f.name || '') + (f.en || '') + (f.city || '') + (f.summary || '') + (f.materials || []).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sort === 'response') arr.sort((a, b) => a.responseHr - b.responseHr);
    else if (sort === 'deals') arr.sort((a, b) => b.deals - a.deals);
    else arr.sort((a, b) => (b.rating * 50 + b.deals / 10) - (a.rating * 50 + a.deals / 10));
    return arr;
  }, [factories, regionRows, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query, activeIndustry]);

  // 지도 핀: geo 쿼리가 이미 activeRegion 필터를 적용했으므로 그대로 사용
  const filteredGeoFactories = geoFactories;

  useEffectP(() => { setPage(1); }, [activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query, activeIndustry]);

  useEffectP(() => {
    _listStateCache = { initialQuery, query, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort };
  }, [query, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedFactory = selected ? filtered.find(f => f.id === selected) : null;

  const hasFilter = !!(query || activeProcess !== 'all' || activeRegion !== 'all' || oemOnly || exportOnly || activeIndustry !== 'all');
  const otherFiltersActive = !!(query || activeProcess !== 'all' || oemOnly || exportOnly || activeIndustry !== 'all');
  // 지역만 선택됐을 때 → RPC 집계 카운트 표시 (DB 전체 기준)
  // 지역 + 다른 필터 → 클라이언트 필터된 카운트
  const displayTotal = (activeRegion !== 'all' && !otherFiltersActive)
    ? (regionCounts[activeRegion] ?? filtered.length)
    : hasFilter ? filtered.length : (dbTotalCount ?? factories.length);

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
          <aside className="filters acc-filters">

            {/* ── 지역 ── */}
            <div className={`acc-section ${openSections.has('region') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('region')}>
                <span className="acc-title">지역</span>
                {activeRegion !== 'all' && <span className="acc-active-dot"/>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  <button className="acc-reset-link" onClick={() => setActiveRegion('all')} disabled={activeRegion === 'all'}>초기화</button>
                  <div className="filters-radios">
                    {(() => {
                      const ALL_REGIONS = [
                        { id: 'all',       label: '전국' },
                        { id: 'seoul',     label: '서울' },
                        { id: 'gyeonggi',  label: '경기' },
                        { id: 'incheon',   label: '인천' },
                        { id: 'busan',     label: '부산' },
                        { id: 'daegu',     label: '대구' },
                        { id: 'gyeongnam', label: '경남' },
                        { id: 'gyeongbuk', label: '경북' },
                        { id: 'chungnam',  label: '충남' },
                        { id: 'chungbuk',  label: '충북' },
                        { id: 'daejeon',   label: '대전' },
                        { id: 'sejong',    label: '세종' },
                        { id: 'gwangju',   label: '광주' },
                        { id: 'jeonnam',   label: '전남' },
                        { id: 'jeonbuk',   label: '전북' },
                        { id: 'gangwon',   label: '강원' },
                        { id: 'ulsan',     label: '울산' },
                        { id: 'jeju',      label: '제주' },
                        { id: 'other',     label: '기타' },
                      ];
                      const DEFAULT_COUNT = 6; // 전국 포함 기본 표시 개수
                      const needExpand = !showAllRegions && !ALL_REGIONS.slice(0, DEFAULT_COUNT).some(r => r.id === activeRegion);
                      const expanded = showAllRegions || needExpand;
                      const visible = expanded ? ALL_REGIONS : ALL_REGIONS.slice(0, DEFAULT_COUNT);
                      const otherCount = dbTotalCount != null
                        ? Math.max(0, dbTotalCount - Object.values(regionCounts).reduce((s, c) => s + c, 0))
                        : null;
                      return (<>
                        {visible.map(r => (
                      <label key={r.id} className={`filter-radio ${activeRegion === r.id ? 'is-active' : ''}`}>
                        <input type="radio" checked={activeRegion === r.id} onChange={() => setActiveRegion(r.id)}/>
                        <span className="filter-radio-dot"/>
                        <span>{r.label}</span>
                        <span className="filter-radio-count">
                          {r.id === 'all'
                            ? (dbTotalCount ?? factories.length).toLocaleString()
                            : r.id === 'other'
                              ? (otherCount ?? '').toLocaleString()
                              : (regionCounts[r.id] ?? factories.filter(f => f.region === r.id).length).toLocaleString()
                          }
                        </span>
                      </label>
                        ))}
                        <button
                          className="acc-reset-link"
                          style={{ marginTop: 4 }}
                          onClick={() => setShowAllRegions(v => !v)}
                        >
                          {expanded ? '접기 ▲' : `더보기 ▼ (${ALL_REGIONS.length - DEFAULT_COUNT}개)`}
                        </button>
                      </>);
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 업종/공장 종류 ── */}
            <div className={`acc-section ${openSections.has('industry') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('industry')}>
                <span className="acc-title">업종/공장 종류</span>
                {activeIndustry !== 'all' && <span className="acc-active-dot"/>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  {activeIndustry !== 'all' && (
                    <button className="acc-reset-link" onClick={() => setActiveIndustry('all')}>전체 보기</button>
                  )}
                  {INDUSTRY_CATS.map(cat => (
                    <div key={cat.id} className="ind-cat">
                      <div className="ind-cat-header">
                        <button
                          className={`ind-cat-label ${activeIndustry === cat.id ? 'is-active' : ''}`}
                          onClick={() => selectIndustry(cat.id)}
                        >
                          {cat.label}
                        </button>
                        <button
                          className={`ind-cat-expand ${openCats.has(cat.id) ? 'is-open' : ''}`}
                          onClick={() => toggleCat(cat.id)}
                          aria-label="소분류 펼치기"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                      </div>
                      <div className={`ind-subs ${openCats.has(cat.id) ? 'is-open' : ''}`}>
                        <div className="ind-subs-inner">
                          {cat.subs.map(sub => (
                            <button
                              key={sub.id}
                              className={`ind-sub ${activeIndustry === sub.id ? 'is-active' : ''}`}
                              onClick={() => selectIndustry(sub.id)}
                            >
                              <span className="ind-sub-dot"/>
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── MOQ ── */}
            <div className={`acc-section ${openSections.has('moq') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('moq')}>
                <span className="acc-title">최소 주문 수량 (MOQ)</span>
                {moqMax < 10000 && <span className="acc-val-badge">≤ {moqMax.toLocaleString()}</span>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  <div className="acc-moq-val">≤ {moqMax.toLocaleString()}</div>
                  <input
                    type="range"
                    className="filter-range"
                    min="50" max="10000" step="50"
                    value={moqMax}
                    onChange={(e) => setMoqMax(+e.target.value)}
                  />
                  <div className="filter-range-labels">
                    <span>50</span><span>10,000+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 인증 ── */}
            <div className={`acc-section ${openSections.has('cert') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('cert')}>
                <span className="acc-title">인증</span>
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  {['ISO 9001', 'IATF 16949', 'KC', 'CE', 'HACCP'].map(c => (
                    <label key={c} className="filter-check">
                      <input type="checkbox"/>
                      <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 리드타임 ── */}
            <div className={`acc-section ${openSections.has('lead') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('lead')}>
                <span className="acc-title">리드타임</span>
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  {['7일 이내', '14일 이내', '30일 이내', '협의'].map(c => (
                    <label key={c} className="filter-check">
                      <input type="checkbox"/>
                      <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 기타 필터 ── */}
            <div className={`acc-section ${openSections.has('misc') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('misc')}>
                <span className="acc-title">기타 필터</span>
                {(oemOnly || exportOnly) && <span className="acc-active-dot"/>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  <label className="filter-check">
                    <input type="checkbox" checked={oemOnly} onChange={() => setOemOnly(!oemOnly)}/>
                    <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                    <span>OEM 가능</span>
                  </label>
                  <label className="filter-check">
                    <input type="checkbox" checked={exportOnly} onChange={() => setExportOnly(!exportOnly)}/>
                    <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                    <span>수출 가능</span>
                  </label>
                </div>
              </div>
            </div>

          </aside>

          <div className="list-results">
            {dbError && (
              <div className="list-db-error">Supabase 오류: {dbError}</div>
            )}
            <div className="list-results-head">
              <div>
                <strong>{(dbLoading || regionLoading) ? '…' : displayTotal.toLocaleString()}</strong>개 중{' '}
                <span className="results-range">
                  {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                </span>
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
              {paginated.map(f => (
                <div
                  key={f.id}
                  onMouseEnter={() => setHovered(f.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(f.id)}
                  className={`list-result-wrap ${selected === f.id ? 'is-active' : ''}`}
                >
                  <ManufacturerCard
                    f={f}
                    onOpen={(id) => {
                      if (!window._factoryCache) window._factoryCache = {};
                      window._factoryCache[id] = f;
                      onOpenFactory(id);
                    }}
                    density={density}
                    simplified
                    onAddRFQ={onAddRFQ}
                    rfqIds={rfqIds}
                  />
                </div>
              ))}
            </div>
            {!dbLoading && filtered.length === 0 && (
              <div className="list-empty">
                <Icon name="search" size={36} stroke={1.4}/>
                <p className="list-empty-msg">
                  {query ? `'${query}'에 해당하는 제조사가 없습니다.` : '조건에 맞는 제조사가 없습니다.'}
                </p>
                <p className="list-empty-sub">찾으시는 제조사가 없으신가요? 견적 요청을 남겨주시면 전문 매칭팀이 직접 찾아드립니다.</p>
                <div className="list-empty-actions">
                  <button className="btn btn-primary" onClick={() => { window.location.hash = 'rfq'; }}>견적 요청하기</button>
                  {query && (
                    <button className="btn btn-ghost" onClick={() => setQuery('')}>검색어 초기화</button>
                  )}
                </div>
              </div>
            )}
            {pageCount > 1 && (
              <div className="list-pagination">
                <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <Icon name="arrow_left" size={14} stroke={2}/>
                  이전
                </button>
                <div className="pg-nums">
                  {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
                    const n = pageCount <= 7 ? i + 1
                      : page <= 4 ? i + 1
                      : page >= pageCount - 3 ? pageCount - 6 + i
                      : page - 3 + i;
                    return (
                      <button key={n} className={`pg-num ${page === n ? 'is-active' : ''}`} onClick={() => setPage(n)}>
                        {n}
                      </button>
                    );
                  })}
                </div>
                <button className="pg-btn" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
                  다음
                  <Icon name="arrow_right" size={14} stroke={2}/>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: map */}
        <div className="list-map">
          <ListMapPanel
            geoFactories={filteredGeoFactories}
            pagedFactories={paginated}
            selectedFactory={selectedFactory}
            mapsKey={mapsKey}
            onOpenFactory={onOpenFactory}
          />
          {selectedFactory && (
            <div className="map-side">
              <div className="map-side-body">
                <div className="map-side-row">
                  <h3>{selectedFactory.name}</h3>
                  {selectedFactory.rating > 0 && (
                    <div className="mcard-rating">
                      <Icon name="star" size={11} stroke={2}/>
                      <strong>{selectedFactory.rating}</strong>
                    </div>
                  )}
                </div>
                <p className="map-side-sub">
                  <Icon name="pin" size={11} stroke={2}/>
                  {_addrCity(selectedFactory.roadAddress) || selectedFactory.city}
                </p>
                <p className="map-side-desc">{selectedFactory.summary || '견적 문의 가능한 제조사입니다'}</p>
                <div className="map-side-stats">
                  <div><span>MOQ</span><strong>{(selectedFactory.moq ?? 0).toLocaleString()} {selectedFactory.moqUnit || '피스'}</strong></div>
                  <div><span>리드타임</span><strong>{selectedFactory.leadDays > 0 ? selectedFactory.leadDays + '일' : '−'}</strong></div>
                  {selectedFactory.responseHr > 0 && selectedFactory.responseHr < 24 && (
                    <div><span>응답</span><strong>{selectedFactory.responseHr}h</strong></div>
                  )}
                </div>
                <div className="map-side-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    if (!window._factoryCache) window._factoryCache = {};
                    window._factoryCache[selectedFactory.id] = selectedFactory;
                    onOpenFactory(selectedFactory.id);
                  }}>
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

// Module-level Maps key cache (fetched once per page session)
let _mapsKey = null;
let _mapsKeyFetch = null;

function useMapsKey() {
  const [key, setKey] = React.useState(_mapsKey);
  React.useEffect(() => {
    if (_mapsKey !== null) { setKey(_mapsKey); return; }
    if (!_mapsKeyFetch) {
      _mapsKeyFetch = fetch('/.netlify/functions/get-maps-key')
        .then(r => r.json())
        .then(d => { _mapsKey = d.key || ''; return _mapsKey; })
        .catch(() => { _mapsKey = ''; return ''; });
    }
    _mapsKeyFetch.then(k => setKey(k));
  }, []);
  return key;
}

const MAPS_ENABLED = true; // Set to true when Maps API is authorized

function FactoryMap({ addr, name }) {
  const key = useMapsKey();
  if (MAPS_ENABLED && key) {
    const q = encodeURIComponent(addr || name);
    return (
      <div className="factory-map">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&language=ko`}
          className="factory-map-iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${name} 위치`}
        />
      </div>
    );
  }
  return (
    <div className="factory-map-placeholder">
      <Icon name="pin" size={16} stroke={1.6}/>
      <span>지도 준비 중</span>
    </div>
  );
}

// ── 공장 히어로 이미지: Street View → Static Map → 색상 박스 ─────────────────
const GMAPS_KEY = (window._env || {}).GOOGLE_MAPS_API_KEY || '';

const FactoryHeroImg = ({ f }) => {
  const addr = (f.address || '').trim();
  const [src,  setSrc]  = React.useState(null);   // null=로딩중
  const [type, setType] = React.useState(null);   // 'sv'|'map'|'color'

  React.useEffect(() => {
    if (!addr) { setType('color'); return; }
    let cancelled = false;

    // Street View 메타데이터로 영상 존재 여부 확인 (무료 API)
    fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${encodeURIComponent(addr)}&key=${GMAPS_KEY}`
    )
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        if (d.status === 'OK') {
          setSrc(`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(addr)}&fov=90&pitch=0&key=${GMAPS_KEY}`);
          setType('sv');
        } else {
          setSrc(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(addr)}&zoom=16&size=800x400&maptype=roadmap&markers=color:0x3b82f6|${encodeURIComponent(addr)}&scale=2&key=${GMAPS_KEY}`);
          setType('map');
        }
      })
      .catch(() => { if (!cancelled) setType('color'); });

    return () => { cancelled = true; };
  }, [addr]);

  // Street View 로드 실패 시 지도로 폴백
  const onImgError = () => {
    if (type === 'sv') {
      setSrc(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(addr)}&zoom=16&size=800x400&maptype=roadmap&markers=color:0x3b82f6|${encodeURIComponent(addr)}&scale=2&key=${GMAPS_KEY}`);
      setType('map');
    } else {
      setType('color');
    }
  };

  if (type === 'color' || (!addr && type !== 'sv' && type !== 'map')) {
    return (
      <div className="detail-hero-img" style={{ background: f.image }}>
        <div className="mcard-img-stripes"/>
      </div>
    );
  }

  // 로딩 중 (메타데이터 확인 전) — 색상 박스 임시 표시
  if (!src) {
    return (
      <div className="detail-hero-img" style={{ background: f.image }}>
        <div className="mcard-img-stripes"/>
      </div>
    );
  }

  return (
    <div className="detail-hero-img" style={{ background: '#e8edf2', padding: 0 }}>
      <img
        src={src}
        alt={f.name}
        onError={onImgError}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div className="detail-hero-img-label">
        {type === 'sv' ? 'STREET VIEW' : '지도'}
      </div>
    </div>
  );
};

const DetailPage = ({ factoryId, onBack, onAddRFQ, rfqIds, onChat, onReport, backLabel }) => {
  const { FACTORIES, PROCESSES, PRODUCTS, INDUSTRIES } = window.MFG_DATA;

  const _fromCacheOrFixture = (id) =>
    (window._factoryCache?.[id]) || FACTORIES.find(x => x.id === id) || null;

  const [resolvedFactory, setResolvedFactory] = useStateP(() => _fromCacheOrFixture(factoryId));
  const [detailLoading, setDetailLoading] = useStateP(() => !_fromCacheOrFixture(factoryId));

  useEffectP(() => {
    // 캐시는 초기 렌더용으로만 사용, 항상 DB에서 최신 데이터 재조회
    let cancelled = false;
    window._sb.from('factories').select('*').eq('id', factoryId).single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (data && !error) {
          const factory = window._dbRowToFactory(data);
          if (!window._factoryCache) window._factoryCache = {};
          window._factoryCache[factoryId] = factory;
          setResolvedFactory(factory);
        } else {
          const fallback = _fromCacheOrFixture(factoryId);
          if (fallback) setResolvedFactory(fallback);
        }
        setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [factoryId]);

  const f = resolvedFactory || FACTORIES[0];
  const [tab, setTab] = useStateP('overview');
  const isSample = /^f(\d+)$/.test(f.id) && parseInt(f.id.slice(1)) <= 14;

  const procLabels = f.processes.map(p => PROCESSES.find(x => x.id === p)?.label).filter(Boolean);
  const prodLabels = f.products.map(p => PRODUCTS.find(x => x.id === p)?.label).filter(Boolean);
  const indLabels = f.industries.map(p => INDUSTRIES.find(x => x.id === p)?.label).filter(Boolean);
  const inRfq = rfqIds.includes(f.id);

  // ── 소유자 편집 상태 ──
  const [isOwner, setIsOwner] = useStateP(false);
  const [showEditModal, setShowEditModal] = useStateP(false);
  const [editForm, setEditForm] = useStateP({});
  const [matInput, setMatInput] = useStateP('');
  const [certInput, setCertInput] = useStateP('');
  const [editSaving, setEditSaving] = useStateP(false);
  const [editToast, setEditToast] = useStateP('');

  // 소유자 확인
  useEffectP(() => {
    setIsOwner(false);
    (async () => {
      try {
        const { data: { user } } = await window._sb.auth.getUser();
        if (!user) return;
        const { data } = await window._sb
          .from('user_profiles')
          .select('factory_id, status')
          .eq('id', user.id)
          .maybeSingle();
        if (data?.factory_id === f.id && data?.status === 'approved') setIsOwner(true);
      } catch {}
    })();
  }, [f.id]);

  const openEditModal = () => {
    setEditForm({
      summary: f.summary || '',
      processes: [...(f.processes || [])],
      materials: [...(f.materials || [])],
      products: [...(f.products || [])],
      moq: f.moq || 1,
      moqUnit: f.moqUnit || '피스',
      leadDays: f.leadDays || 14,
      certs: [...(f.certs || [])],
      oem: !!f.oem,
      odm: !!f.odm,
      export: !!f.export,
      image: f.image || '#a8b4c8',
    });
    setMatInput('');
    setCertInput('');
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      const updates = {
        summary: editForm.summary,
        processes: editForm.processes,
        materials: editForm.materials,
        products: editForm.products,
        moq: Number(editForm.moq) || 1,
        moq_unit: editForm.moqUnit,
        lead_days: Number(editForm.leadDays) || 14,
        certs: editForm.certs,
        oem: editForm.oem,
        odm: editForm.odm,
        export: editForm.export,
        image: editForm.image,
      };
      const { error } = await window._sb.from('factories').update(updates).eq('id', f.id);
      if (error) throw error;
      const updated = {
        ...f,
        summary: editForm.summary,
        processes: editForm.processes,
        materials: editForm.materials,
        products: editForm.products,
        moq: Number(editForm.moq) || 1,
        moqUnit: editForm.moqUnit,
        leadDays: Number(editForm.leadDays) || 14,
        certs: editForm.certs,
        oem: editForm.oem,
        odm: editForm.odm,
        export: editForm.export,
        image: editForm.image,
      };
      setResolvedFactory(updated);
      if (window._factoryCache) window._factoryCache[f.id] = updated;
      setShowEditModal(false);
      setEditToast('공장 정보가 업데이트되었습니다');
      setTimeout(() => setEditToast(''), 3200);
    } catch (e) {
      setEditToast('저장 실패: ' + (e.message || '오류'));
      setTimeout(() => setEditToast(''), 4000);
    }
    setEditSaving(false);
  };

  const toggleChip = (field, id) => setEditForm(prev => ({
    ...prev,
    [field]: prev[field].includes(id) ? prev[field].filter(x => x !== id) : [...prev[field], id],
  }));
  const addFreeChip = (field, val, clearFn) => {
    const v = val.trim();
    if (!v) return;
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].includes(v) ? prev[field] : [...prev[field], v],
    }));
    clearFn('');
  };
  const removeFreeChip = (field, val) => setEditForm(prev => ({
    ...prev,
    [field]: prev[field].filter(x => x !== val),
  }));

  useEffect(() => {
    if (tab === 'reviews' && !isSample) setTab('overview');
    if (tab === 'certs' && f.certs.length === 0 && !isSample) setTab('overview');
    if (tab === 'capability' && procLabels.length === 0 && (f.materials || []).length === 0 && prodLabels.length === 0) setTab('overview');
  }, [factoryId]);

  if (detailLoading) {
    return (
      <div className="page page-detail">
        <div className="detail-loading">
          <div className="detail-loading-spinner"/>
          <span className="detail-loading-text">공장 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-detail">
      <div className="detail-bar">
        <button className="back-btn" onClick={() => { if (window.history.length > 1) window.history.back(); else onBack?.(); }}>
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
          {isOwner && (
            <button className="icon-btn detail-edit-btn" onClick={openEditModal}>
              <Icon name="user" size={14} stroke={2}/>
              내 공장 정보 수정
            </button>
          )}
          <button className="detail-report-btn" onClick={() => onReport?.({ type: 'factory_issue', factoryId: f.id, factoryName: f.name })}>
            ⚠ 이 정보 신고
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="detail-hero">
        <FactoryHeroImg f={f}/>
        <div className="detail-hero-info">
          <div className="detail-hero-head">
            {f.certs.includes('IATF 16949') && (
              <Badge tone="indigo" icon="badge_check">자동차 인증</Badge>
            )}
            {f.export && (
              <Badge tone="slate" icon="globe">수출 가능</Badge>
            )}
          </div>
          <h1 className="detail-name">{f.name}</h1>
          {f.isCorporate && f.businessNumber && (
            <div className="detail-business-number">
              <span style={{color:'#555'}}>사업자번호 </span>
              {f.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}
              {f.businessStatus === 'active' && (
                <span style={{background:'#e6f4ea',color:'#2d7a3a',borderRadius:'4px',padding:'2px 8px',fontSize:'11px',marginLeft:'8px',fontWeight:'600'}}>등록법인</span>
              )}
            </div>
          )}
          {f.en && <div className="detail-name-en">{f.en}</div>}
          <div className="detail-hero-meta">
            <span><Icon name="pin" size={13} stroke={2}/> {_addrCity(f.roadAddress) || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || f.city || '—'}</span>
            {isSample && f.founded > 0 && (
              <>
                <span className="dot">·</span>
                <span>{f.founded}년 설립 · 직원 {f.employees}명</span>
              </>
            )}
          </div>
          {isSample && (
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
          )}

          {isSample && (
            <div className="detail-stats">
              <div className="dstat">
                <Icon name="box" size={14} stroke={2}/>
                <div>
                  <div className="dstat-k">MOQ</div>
                  <div className="dstat-v">{(f.moq ?? 0).toLocaleString()} {f.moqUnit || '피스'}</div>
                </div>
              </div>
              <div className="dstat">
                <Icon name="clock" size={14} stroke={2}/>
                <div>
                  <div className="dstat-k">리드타임</div>
                  <div className="dstat-v">{f.leadDays}일</div>
                </div>
              </div>
              {f.priceRange && (
                <div className="dstat">
                  <Icon name="won" size={14} stroke={2}/>
                  <div>
                    <div className="dstat-k">단가 범위</div>
                    <div className="dstat-v">{f.priceRange}</div>
                  </div>
                </div>
              )}
            </div>
          )}

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
          ...(procLabels.length > 0 || (f.materials || []).length > 0 || prodLabels.length > 0
            ? [{ id: 'capability', label: '제조 역량' }] : []),
          ...(f.certs.length > 0 || isSample ? [{ id: 'certs', label: '인증·신뢰도' }] : []),
          ...(isSample ? [{ id: 'reviews', label: `리뷰 ${f.reviews}` }] : []),
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
          <div className={f.summary ? 'detail-grid' : ''}>
            {f.summary && (
              <div>
                <h3>회사 소개</h3>
                <p className="detail-desc">{f.summary}</p>
              </div>
            )}
            <div className="detail-side">
              <h4>기본 정보</h4>
              <dl className="detail-dl">
                {(f.roadAddress || f.address || f.city) && (
                  <><dt>주소</dt><dd>{f.roadAddress || f.address || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ')}</dd></>
                )}
                {f.phone && <><dt>전화번호</dt><dd>{f.phone}</dd></>}
                {f.website && (
                  <><dt>홈페이지</dt><dd><a href={f.website} target="_blank" rel="noreferrer" className="detail-link">{f.website.replace(/^https?:\/\//, '')}</a></dd></>
                )}
                {f.representative && <><dt>대표자</dt><dd>{f.representative}</dd></>}
                {f.industrial_complex && <><dt>산업단지</dt><dd>{f.industrial_complex}</dd></>}
                {f.building_area != null && <><dt>건축면적</dt><dd>{f.building_area.toLocaleString()} ㎡</dd></>}
                {f.employees > 0 && <><dt>직원수</dt><dd>{f.employees}명</dd></>}
                {f.founded > 0 && <><dt>설립연도</dt><dd>{f.founded}년 ({2026 - f.founded}년차)</dd></>}
                {indLabels.length > 0 && <><dt>산업군</dt><dd>{indLabels.join(', ')}</dd></>}
                {(f.oem || f.odm || f.export) && (
                  <><dt>거래 형태</dt>
                  <dd>
                    {f.oem && <span className="flag">OEM</span>}
                    {f.odm && <span className="flag">ODM</span>}
                    {f.export && <span className="flag flag-export">수출</span>}
                  </dd></>
                )}
              </dl>
              <FactoryMap addr={f.roadAddress || f.address} name={f.name} />
            </div>
          </div>
        </section>
      )}

      {tab === 'capability' && (
        <section className="detail-section">
          <div className="cap-grid">
            {procLabels.length > 0 && (
              <div className="cap-block">
                <h3>가공 방식</h3>
                <div className="cap-tags">
                  {procLabels.map(p => <span key={p} className="cap-tag cap-tag-blue">{p}</span>)}
                </div>
              </div>
            )}
            {(f.materials || []).length > 0 && (
              <div className="cap-block">
                <h3>소재</h3>
                <div className="cap-tags">
                  {f.materials.map(m => <span key={m} className="cap-tag">{m}</span>)}
                </div>
              </div>
            )}
            {prodLabels.length > 0 && (
              <div className="cap-block">
                <h3>생산 가능 제품</h3>
                <div className="cap-tags">
                  {prodLabels.map(p => <span key={p} className="cap-tag cap-tag-amber">{p}</span>)}
                </div>
              </div>
            )}
            {isSample && (
              <div className="cap-block">
                <h3>주요 생산 조건</h3>
                <table className="cap-table">
                  <tbody>
                    <tr><th>최소 주문 (MOQ)</th><td>{(f.moq ?? 0).toLocaleString()} {f.moqUnit || '피스'}</td></tr>
                    <tr><th>리드타임</th><td>{f.leadDays ?? '−'}일 (시제품 별도)</td></tr>
                    {f.priceRange && <tr><th>단가 범위</th><td>{f.priceRange}</td></tr>}
                    <tr><th>샘플</th><td>유료 / 3~5일</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'certs' && (
        <section className="detail-section">
          <div className="trust-grid">
            {f.certs.length > 0 && (
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
            )}
            {isSample && (
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
            )}
          </div>
        </section>
      )}

      {/* ── 토스트 ── */}
      {editToast && (
        <div className={'fe-toast ' + (editToast.includes('실패') ? 'fe-toast-err' : 'fe-toast-ok')}>
          {editToast}
        </div>
      )}

      {/* ── 공장 정보 수정 모달 ── */}
      {showEditModal && (
        <div className="fe-overlay" onClick={() => setShowEditModal(false)}>
          <div className="fe-modal" onClick={e => e.stopPropagation()}>
            <div className="fe-head">
              <h2>내 공장 정보 수정</h2>
              <button className="fe-close" onClick={() => setShowEditModal(false)}>
                <Icon name="close" size={18} stroke={2}/>
              </button>
            </div>

            <div className="fe-body">
              {/* 수정 불가 섹션 */}
              <div className="fe-section">
                <h3 className="fe-section-title">기본 정보 (수정 불가)</h3>
                <div className="fe-readonly-grid">
                  <div className="fe-ro-item">
                    <span className="fe-ro-label">회사명</span>
                    <span className="fe-ro-value">{f.name}</span>
                  </div>
                  {f.businessNumber && (
                    <div className="fe-ro-item">
                      <span className="fe-ro-label">사업자번호</span>
                      <span className="fe-ro-value">{f.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}</span>
                    </div>
                  )}
                  <div className="fe-ro-item">
                    <span className="fe-ro-label">주소</span>
                    <span className="fe-ro-value">{f.roadAddress || f.address || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || '—'}</span>
                  </div>
                </div>
              </div>

              {/* 회사 소개 */}
              <div className="fe-section">
                <h3 className="fe-section-title">회사 소개</h3>
                <textarea
                  className="fe-textarea"
                  rows={4}
                  value={editForm.summary}
                  onChange={e => setEditForm(p => ({ ...p, summary: e.target.value }))}
                  placeholder="회사 소개를 입력하세요 (100~300자 권장)"
                />
              </div>

              {/* 주요 공정 */}
              <div className="fe-section">
                <h3 className="fe-section-title">주요 공정</h3>
                <div className="fe-chip-grid">
                  {PROCESSES.map(p => (
                    <button
                      key={p.id}
                      className={'fe-chip ' + (editForm.processes?.includes(p.id) ? 'is-on' : '')}
                      onClick={() => toggleChip('processes', p.id)}
                      type="button"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 소재 */}
              <div className="fe-section">
                <h3 className="fe-section-title">주요 소재</h3>
                <div className="fe-free-chips">
                  {(editForm.materials || []).map(m => (
                    <span key={m} className="fe-free-chip">
                      {m}
                      <button className="fe-free-chip-x" onClick={() => removeFreeChip('materials', m)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="fe-chip-input-row">
                  <input
                    className="fe-input"
                    value={matInput}
                    onChange={e => setMatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFreeChip('materials', matInput, setMatInput); } }}
                    placeholder="소재 입력 후 Enter (예: 알루미늄)"
                  />
                  <button className="fe-chip-add-btn" onClick={() => addFreeChip('materials', matInput, setMatInput)}>추가</button>
                </div>
              </div>

              {/* 주요 제품 */}
              <div className="fe-section">
                <h3 className="fe-section-title">주요 제품</h3>
                <div className="fe-chip-grid">
                  {PRODUCTS.map(p => (
                    <button
                      key={p.id}
                      className={'fe-chip ' + (editForm.products?.includes(p.id) ? 'is-on' : '')}
                      onClick={() => toggleChip('products', p.id)}
                      type="button"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 생산 조건 */}
              <div className="fe-section">
                <h3 className="fe-section-title">생산 조건</h3>
                <div className="fe-cond-grid">
                  <label className="fe-field">
                    <span>최소 주문 수량 (MOQ)</span>
                    <input
                      className="fe-input"
                      type="number"
                      min="1"
                      value={editForm.moq}
                      onChange={e => setEditForm(p => ({ ...p, moq: e.target.value }))}
                    />
                  </label>
                  <label className="fe-field">
                    <span>단위</span>
                    <input
                      className="fe-input"
                      value={editForm.moqUnit}
                      onChange={e => setEditForm(p => ({ ...p, moqUnit: e.target.value }))}
                      placeholder="피스"
                    />
                  </label>
                  <label className="fe-field">
                    <span>리드타임 (일)</span>
                    <input
                      className="fe-input"
                      type="number"
                      min="1"
                      value={editForm.leadDays}
                      onChange={e => setEditForm(p => ({ ...p, leadDays: e.target.value }))}
                    />
                  </label>
                </div>
              </div>

              {/* 인증 */}
              <div className="fe-section">
                <h3 className="fe-section-title">보유 인증</h3>
                <div className="fe-free-chips">
                  {(editForm.certs || []).map(c => (
                    <span key={c} className="fe-free-chip">
                      {c}
                      <button className="fe-free-chip-x" onClick={() => removeFreeChip('certs', c)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="fe-chip-input-row">
                  <input
                    className="fe-input"
                    value={certInput}
                    onChange={e => setCertInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFreeChip('certs', certInput, setCertInput); } }}
                    placeholder="인증명 입력 후 Enter (예: ISO 9001)"
                  />
                  <button className="fe-chip-add-btn" onClick={() => addFreeChip('certs', certInput, setCertInput)}>추가</button>
                </div>
              </div>

              {/* 거래 형태 */}
              <div className="fe-section">
                <h3 className="fe-section-title">거래 형태</h3>
                <div className="fe-toggle-row">
                  {[['oem', 'OEM'], ['odm', 'ODM'], ['export', '수출 가능']].map(([key, label]) => (
                    <button
                      key={key}
                      className={'fe-toggle ' + (editForm[key] ? 'is-on' : '')}
                      onClick={() => setEditForm(p => ({ ...p, [key]: !p[key] }))}
                      type="button"
                    >
                      <span className="fe-toggle-dot"/>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 대표 이미지 (색상 코드) */}
              <div className="fe-section">
                <h3 className="fe-section-title">대표 이미지 색상</h3>
                <div className="fe-image-row">
                  <div className="fe-color-preview" style={{ background: editForm.image }}/>
                  <input
                    className="fe-input"
                    value={editForm.image}
                    onChange={e => setEditForm(p => ({ ...p, image: e.target.value }))}
                    placeholder="#a8b4c8"
                  />
                </div>
              </div>
            </div>

            <div className="fe-foot">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>취소</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={editSaving}>
                {editSaving ? '저장중…' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <section className="detail-section">
          {isSample ? (
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
          ) : (
            <div className="detail-empty">
              <Icon name="star" size={32} stroke={1.4}/>
              <p>아직 리뷰가 없습니다</p>
            </div>
          )}
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
    title: '',
    qty: '',
    process: 'injection',
    material: '',
    deadline: '',
    budget: '',
    notes: '',
    file: '',
    email: '',
  });
  const [rfqShowExtra, setRfqShowExtra] = useStateP(false);
  const [sending, setSending] = useStateP(false);
  const [sendResult, setSendResult] = useStateP(null);
  const [sentSnapshot, setSentSnapshot] = useStateP(null);

  const dispCount = sendResult?.ok ? sendResult?.count : selected.length;
  const step2Valid = !!(form.title && form.qty && form.deadline && form.email);

  return (
    <div className="page page-rfq">
      <div className="rfq-head">
        <div>
          <h1>견적 요청 (RFQ)</h1>
          <p className="rfq-sub">
            선택한 제조사에 동일한 조건으로 동시 견적을 요청합니다
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
                          {f.moq > 0 && <span>MOQ {f.moq.toLocaleString()} {f.moqUnit || '피스'}</span>}
                          {f.leadDays > 0 && <span>리드 {f.leadDays}일</span>}
                          {f.responseHr > 0 && f.responseHr < 24 && <span>응답 {f.responseHr}h</span>}
                          {f.rating > 0 && <span><Icon name="star" size={10} stroke={2}/> {f.rating}</span>}
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
                  <label>제품명 <span className="rfq-required">*</span></label>
                  <input
                    placeholder="예: 알루미늄 CNC 가공 브라켓"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="rfq-field">
                  <label>수량 <span className="rfq-required">*</span></label>
                  <input
                    type="number"
                    placeholder="예: 1000"
                    value={form.qty}
                    onChange={e => setForm({ ...form, qty: e.target.value })}
                  />
                </div>
                <div className="rfq-field">
                  <label>희망 납기 <span className="rfq-required">*</span></label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}/>
                </div>
                <div className="rfq-field rfq-field-full">
                  <label>답변 받을 이메일 <span className="rfq-required">*</span></label>
                  <input
                    type="email"
                    placeholder="company@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="rfq-field rfq-field-full">
                  <button
                    type="button"
                    className="rfq-optional-toggle"
                    onClick={() => setRfqShowExtra(!rfqShowExtra)}
                  >
                    <Icon name={rfqShowExtra ? 'chevron_down' : 'chevron_right'} size={13} stroke={2}/>
                    추가 정보 입력하기 (선택)
                  </button>
                </div>
                {rfqShowExtra && (
                  <>
                    <div className="rfq-field">
                      <label>가공 방식</label>
                      <select value={form.process} onChange={e => setForm({ ...form, process: e.target.value })}>
                        {PROCESSES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                    </div>
                    <div className="rfq-field">
                      <label>주요 소재</label>
                      <input
                        placeholder="예: 알루미늄 6061, ABS"
                        value={form.material}
                        onChange={e => setForm({ ...form, material: e.target.value })}
                      />
                    </div>
                    <div className="rfq-field rfq-field-full">
                      <label>예산 범위</label>
                      <input
                        placeholder="예: ₩5,000,000 — ₩10,000,000"
                        value={form.budget}
                        onChange={e => setForm({ ...form, budget: e.target.value })}
                      />
                    </div>
                    <div className="rfq-field rfq-field-full">
                      <label>요청 내용 / 도면 메모</label>
                      <textarea
                        rows={4}
                        placeholder="표면 처리, 공차 요건, 기타 요청사항을 적어주세요"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>
                    <div className="rfq-field rfq-field-full">
                      <label>도면 / 시방서 첨부</label>
                      <div className="rfq-file">
                        <Icon name="upload" size={16} stroke={2}/>
                        {form.file
                          ? <>
                              <span className="rfq-file-name">{form.file}</span>
                              <span className="rfq-file-status">
                                <Icon name="check" size={11} stroke={2.4}/> 업로드 완료
                              </span>
                              <button className="rfq-file-replace">교체</button>
                            </>
                          : <span className="rfq-file-name" style={{ color: 'var(--ink-4)' }}>파일 선택 (PDF, STEP, DWG)</span>
                        }
                      </div>
                    </div>
                  </>
                )}
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
                    <dt>제품명</dt><dd>{form.title}</dd>
                    <dt>수량</dt><dd>{form.qty} 피스</dd>
                    <dt>납기</dt><dd>{form.deadline}</dd>
                    {form.material && <><dt>소재</dt><dd>{form.material}</dd></>}
                    {form.budget && <><dt>예산</dt><dd>{form.budget}</dd></>}
                    {form.file && <><dt>첨부</dt><dd>{form.file}</dd></>}
                  </dl>
                </div>
                <div className="rfq-review-card">
                  <h4>발송 대상 ({selected.length}개사)</h4>
                  <ul className="rfq-review-list">
                    {selected.map(f => (
                      <li key={f.id}>
                        <span>{f.name}</span>
                        {f.responseHr > 0 && f.responseHr < 24 && (
                          <span className="hint">예상 응답 {f.responseHr}h 내</span>
                        )}
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
              <strong>{dispCount}곳</strong>
            </div>
            <div className="rfq-side-divider"/>
            <div className="rfq-side-actions">
              {sendResult?.ok ? (
                <button className="btn btn-sent" disabled>
                  <Icon name="check" size={14} stroke={2.4}/> {sendResult?.count}개사 발송완료
                </button>
              ) : (
                <>
                  {step > 1 && (
                    <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                      이전
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      className="btn btn-primary"
                      disabled={step === 1 ? selected.length === 0 : !step2Valid}
                      onClick={() => setStep(step + 1)}
                    >
                      다음 단계 <Icon name="arrow_right" size={14} stroke={2.4}/>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-send"
                      disabled={sending}
                      onClick={async () => {
                        const snap = { count: selected.length };
                        setSending(true);
                        setSendResult(null);
                        try {
                          const resp = await fetch('/.netlify/functions/send-rfq', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              factoryIds: rfqIds,
                              buyerEmail: form.email,
                              productName: form.title,
                              quantity: form.qty ? String(form.qty) + ' 피스' : '수량 미정',
                              deadline: form.deadline,
                              message: [
                                form.material ? '소재: ' + form.material : '',
                                form.budget ? '예산: ' + form.budget : '',
                                form.notes || '',
                              ].filter(Boolean).join('\n') || undefined,
                            }),
                          });
                          if (resp.ok) {
                            await resp.json();
                            setSentSnapshot(snap);
                            setSendResult({ ok: true, count: snap.count });
                            setRfqIds([]);
                          } else {
                            setSendResult({ ok: false });
                          }
                        } catch {
                          setSendResult({ ok: false });
                        } finally {
                          setSending(false);
                        }
                      }}
                    >
                      {sending
                        ? <><span className="rfq-sending-spinner"/>발송 중…</>
                        : <><Icon name="check" size={14} stroke={2.4}/> {dispCount}개사에 발송</>
                      }
                    </button>
                  )}
                  {sendResult?.ok === false && (
                    <div className="rfq-send-result rfq-send-err">
                      발송 중 오류가 발생했습니다. 다시 시도해주세요.
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="rfq-side-tip">
              {sendResult?.ok ? (
                <>
                  <Icon name="clock" size={11} stroke={2}/>
                  <span>영업일 기준 1~2일 내 답변을 받으실 수 있습니다</span>
                </>
              ) : (
                <>
                  <Icon name="sparkle" size={11} stroke={2}/>
                  <span>3개사 이상에 동시 요청 시 평균 단가 <strong>12% 절감</strong></span>
                </>
              )}
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
const { useState: useStateSX, useMemo: useMemoSX, useEffect: useEffectSX, useRef: useRefSX } = React;

// Module-level cache: persists across unmount/remount within the same page session
let _sxStateCache = null;

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

const SX_RELATED_KEYWORDS = ['제조문의', 'OEM', 'ODM', '샘플제작', '소량생산', '견적요청'];

function scoreFactory(factory, searchTerms) {
  const st = searchTerms || {};
  let score = 0;
  (st.industries || []).forEach(ind => { if ((factory.industries || []).includes(ind)) score += 30; });
  (st.processes || []).forEach(proc => { if ((factory.processes || []).includes(proc)) score += 25; });
  (st.materials || []).forEach(mat => {
    const m = mat.toLowerCase();
    if ((factory.materials || []).some(fm => fm.toLowerCase().includes(m) || m.includes(fm.toLowerCase()))) score += 15;
  });
  (st.keywords || []).forEach(kw => {
    const k = kw.toLowerCase();
    if ((factory.summary || '').toLowerCase().includes(k) || (factory.name || '').includes(kw)) score += 8;
    if ((factory.products || []).some(p => (p || '').toLowerCase().includes(k))) score += 10;
  });
  return score;
}

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
  const [q, setQ] = useAuthState('');
  const [showModal, setShowModal] = useAuthState(false);

  const handleSearch = (val) => {
    const query = (val ?? q).trim();
    if (!query) return;
    setShowModal(true);
  };

  return (
    <div className="ldg2">
      <ParticleCanvas />
      <header className="ldg2-nav">
        <AuthLogo/>
        <div className="ldg2-nav-right">
          <button className="ldg2-nav-login" onClick={() => onNav('login')}>로그인</button>
          <button className="ldg2-nav-signup" onClick={() => onNav('signup')}>무료로 시작하기</button>
        </div>
      </header>

      <main className="ldg2-main">
        <section className="ldg2-hero">
          <h1 className="ldg2-headline">제조 조건만 입력하세요.</h1>
          <p className="ldg2-sub">맞는 공장이 먼저 찾아옵니다.</p>

          <div className="ldg2-search-wrap">
            <input
              type="text"
              className="ldg2-search-input"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="가공방식, 소재, 제품명으로 검색"
              autoComplete="off"
            />
            <button className="ldg2-search-btn" onClick={handleSearch}>
              <Icon name="search" size={20} stroke={2.2}/>
            </button>
          </div>

          <div className="ldg2-tag-row">
            {HOME_TAGS.map(tag => (
              <button key={tag} className="ldg2-tag" onClick={() => handleSearch(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </section>

        <div className="ldg2-stats">
          전국 <strong>12,138개</strong> 공장 DB &nbsp;·&nbsp; <strong>1,192개</strong> 사업자 인증
        </div>
      </main>

      {showModal && (
        <div className="ldg2-modal-overlay">
          <div className="ldg2-modal">
            <h2 className="ldg2-modal-title">검색하려면 가입이 필요합니다</h2>
            <p className="ldg2-modal-sub">무료로 가입하면 전국 12,138개 공장 DB를 검색할 수 있습니다.</p>
            <div className="ldg2-modal-btns">
              <button className="ldg2-modal-signup-btn" onClick={() => onNav('signup')}>무료로 시작하기</button>
              <button className="ldg2-modal-login-btn" onClick={() => onNav('login')}>로그인</button>
            </div>
          </div>
        </div>
      )}
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
  const [socialToast, setSocialToast] = useAuthState(null);

  const handleSocialLogin = (provider) => {
    const clientId = provider === 'kakao' ? window._KAKAO_CLIENT_ID : window._NAVER_CLIENT_ID;
    if (!clientId) {
      const label = provider === 'kakao' ? '카카오' : '네이버';
      setSocialToast(`${label} 로그인 서비스를 준비 중입니다`);
      setTimeout(() => setSocialToast(null), 3000);
      return;
    }
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    sessionStorage.setItem('_sgn_provider', provider);
    if (provider === 'kakao') {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    } else {
      const state = Math.random().toString(36).slice(2);
      sessionStorage.setItem('_naver_state', state);
      window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    }
  };

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

          {socialToast && (
            <div className="auth-social-toast">
              <Icon name="info" size={13} stroke={2}/>
              {socialToast}
            </div>
          )}

          <div className="auth-social-btns">
            <button
              className="auth-social-btn auth-kakao-btn"
              onClick={() => handleSocialLogin('kakao')}
            >
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
                <path fill="currentColor" d="M9 0C4.03 0 0 3.13 0 7c0 2.48 1.57 4.67 3.96 5.93l-.85 3.18 3.6-2.35c.74.1 1.5.24 2.29.24 4.97 0 9-3.13 9-7S13.97 0 9 0z"/>
              </svg>
              {isSignup ? '카카오로 가입' : '카카오로 로그인'}
            </button>
            <button
              className="auth-social-btn auth-naver-btn"
              onClick={() => handleSocialLogin('naver')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fill="currentColor" d="M9.13 8.16L6.12 3H3v10h3.87V7.84L9.88 13H13V3H9.13z"/>
              </svg>
              {isSignup ? '네이버로 가입' : '네이버로 로그인'}
            </button>
            <button
              className="auth-social-btn auth-google-btn"
              onClick={() => onSubmit({ email: 'user@gmail.com', google: true })}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8L6.2 33C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2c-.4.4 6.6-4.8 6.6-14.9 0-1.3-.1-2.4-.4-3.5z"/></svg>
              {isSignup ? '구글로 가입' : '구글로 로그인'}
            </button>
          </div>

          <div className="auth-divider">
            <span className="auth-divider-line"/>
            <span className="auth-divider-text">또는 이메일로 계속하기</span>
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
              <div className="welcome-stat-n">12,138</div>
              <div className="welcome-stat-l">공장 DB</div>
            </div>
            <div className="welcome-stat-divider"/>
            <div className="welcome-stat">
              <div className="welcome-stat-n">2,847</div>
              <div className="welcome-stat-l">검증 제조사</div>
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
// SignupPage — 회원가입 (5단계)
// ═══════════════════════════════════════════════════════════
function SignupPage({ onNav }) {
  const { PROCESSES } = window.MFG_DATA;

  const [step, setStep] = useStateP(1);
  const [userType, setUserType] = useStateP(null);
  const [sgnSocialToast, setSgnSocialToast] = useStateP(null);

  const handleSgnSocial = (provider) => {
    const clientId = provider === 'kakao' ? window._KAKAO_CLIENT_ID : window._NAVER_CLIENT_ID;
    if (!clientId) {
      const label = provider === 'kakao' ? '카카오' : '네이버';
      setSgnSocialToast(`${label} 로그인 서비스를 준비 중입니다`);
      setTimeout(() => setSgnSocialToast(null), 3000);
      return;
    }
    const redirectUri = encodeURIComponent(window.location.origin + '/');
    sessionStorage.setItem('_sgn_provider', provider);
    if (provider === 'kakao') {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    } else {
      const state = Math.random().toString(36).slice(2);
      sessionStorage.setItem('_naver_state', state);
      window.location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    }
  };

  const [form, setForm] = useStateP({
    email: '', password: '', passwordConfirm: '',
    companyName: '', businessNumber: '', contactName: '', contactPhone: '',
    neededProcesses: [], neededMaterials: [], orderScale: '',
    ownedProcesses: [], ownedMaterials: [], certs: [],
    oemAvailable: false, odmAvailable: false,
    businessDoc: null, factoryPhoto: null,
  });
  const [errors, setErrors] = useStateP({});
  const [loading, setLoading] = useStateP(false);

  const SGN_MATERIALS = ['알루미늄', 'SUS304', 'SS400', 'ABS', 'PC', 'PP', 'PET', '티타늄', '황동', '구리', 'FR-4', '탄소강'];
  const SGN_CERTS = ['ISO 9001', 'IATF 16949', 'ISO 14001', 'ISO 22000', 'HACCP', 'KC', 'CE', 'UL', 'OEKO-TEX'];
  const SGN_SCALES = ['소량 (~100개)', '중량 (100–1,000개)', '중대량 (1,000–10,000개)', '대량 (10,000개+)'];

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tog = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const fmtBiz = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 6) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}`;
  };
  const fmtPhone = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = '유효한 이메일을 입력하세요';
    if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 합니다';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않습니다';
    if (!form.companyName.trim()) e.companyName = '회사명을 입력하세요';
    if (form.businessNumber.replace(/\D/g, '').length < 10) e.businessNumber = '사업자번호 10자리를 입력하세요';
    if (!form.contactName.trim()) e.contactName = '담당자명을 입력하세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };
  const goBack = () => {
    if (step > 1 && step < 5) setStep(s => s - 1);
    else onNav('landing');
  };

  const handleSubmit = async () => {
    if (!form.businessDoc) return;
    setLoading(true);
    setErrors({});
    try {
      const { data: authData, error: authError } = await window._sb.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error('가입에 실패했습니다');

      let documentUrl = null;
      if (form.businessDoc) {
        const ext = form.businessDoc.name.split('.').pop().toLowerCase();
        const { data: up, error: upErr } = await window._sb.storage
          .from('user-documents')
          .upload(`${userId}/business-doc.${ext}`, form.businessDoc);
        if (!upErr && up) documentUrl = `${userId}/business-doc.${ext}`;
      }
      if (userType === 'manufacturer' && form.factoryPhoto) {
        const ext2 = form.factoryPhoto.name.split('.').pop().toLowerCase();
        await window._sb.storage.from('user-documents')
          .upload(`${userId}/factory-photo.${ext2}`, form.factoryPhoto);
      }

      const interests = userType === 'buyer'
        ? { needed_processes: form.neededProcesses, needed_materials: form.neededMaterials, order_scale: form.orderScale }
        : { owned_processes: form.ownedProcesses, main_materials: form.ownedMaterials, certs: form.certs, oem: form.oemAvailable, odm: form.odmAvailable };

      await window._sb.from('user_profiles').insert({
        id: userId,
        user_type: userType,
        company_name: form.companyName,
        business_number: form.businessNumber.replace(/\D/g, ''),
        contact_name: form.contactName,
        contact_phone: form.contactPhone || null,
        contact_email: form.email,
        interests,
        document_url: documentUrl,
        status: 'pending',
      });

      setStep(5);
    } catch (err) {
      setErrors({ submit: err.message || '가입 중 오류가 발생했습니다' });
    } finally {
      setLoading(false);
    }
  };

  const TOTAL = 4;

  return (
    <div className="auth-shell">
      <div className="auth-shell-bg"/>
      <div className="auth-shell-inner">
        <header className="auth-mini-hdr">
          <AuthLogo size={32}/>
          <button className="auth-back-btn" onClick={goBack}>
            <Icon name={step > 1 && step < 5 ? 'arrow_left' : 'close'} size={14} stroke={2}/>
          </button>
        </header>

        <div className="auth-card sgn-card">
          {/* 단계 표시 */}
          {step >= 2 && step <= 4 && (
            <div className="sgn-steps">
              {Array.from({ length: TOTAL }, (_, i) => i + 1).map(n => (
                <React.Fragment key={n}>
                  <div className={`sgn-dot ${step > n ? 'is-done' : step === n ? 'is-active' : ''}`}>
                    {step > n ? <Icon name="check" size={10} stroke={2.8}/> : n}
                  </div>
                  {n < TOTAL && <div className={`sgn-line ${step > n ? 'is-done' : ''}`}/>}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ── 1단계: 유형 선택 ── */}
          {step === 1 && (<>
            <div className="auth-card-head">
              <h1>공장매칭 시작하기</h1>
              <p>소셜 계정 또는 이메일로 가입하세요</p>
            </div>

            {sgnSocialToast && (
              <div className="auth-social-toast">
                <Icon name="info" size={13} stroke={2}/>
                {sgnSocialToast}
              </div>
            )}

            <div className="auth-social-btns">
              <button className="auth-social-btn auth-kakao-btn" onClick={() => handleSgnSocial('kakao')}>
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
                  <path fill="currentColor" d="M9 0C4.03 0 0 3.13 0 7c0 2.48 1.57 4.67 3.96 5.93l-.85 3.18 3.6-2.35c.74.1 1.5.24 2.29.24 4.97 0 9-3.13 9-7S13.97 0 9 0z"/>
                </svg>
                카카오로 가입
              </button>
              <button className="auth-social-btn auth-naver-btn" onClick={() => handleSgnSocial('naver')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path fill="currentColor" d="M9.13 8.16L6.12 3H3v10h3.87V7.84L9.88 13H13V3H9.13z"/>
                </svg>
                네이버로 가입
              </button>
            </div>

            <div className="auth-divider" style={{ margin: '16px 0' }}>
              <span className="auth-divider-line"/>
              <span className="auth-divider-text">또는 유형 선택 후 이메일로</span>
              <span className="auth-divider-line"/>
            </div>

            <div className="sgn-type-grid">
              <button className="sgn-type-card" onClick={() => { setUserType('buyer'); setStep(2); }}>
                <div className="sgn-type-icon sgn-type-buyer">
                  <Icon name="search" size={26} stroke={1.8}/>
                </div>
                <div className="sgn-type-name">바이어</div>
                <div className="sgn-type-desc">제조사를 찾고<br/>견적을 받고 싶어요</div>
              </button>
              <button className="sgn-type-card" onClick={() => { setUserType('manufacturer'); setStep(2); }}>
                <div className="sgn-type-icon sgn-type-mfr">
                  <Icon name="factory" size={26} stroke={1.8}/>
                </div>
                <div className="sgn-type-name">제조사</div>
                <div className="sgn-type-desc">공장을 등록하고<br/>바이어를 받고 싶어요</div>
              </button>
            </div>
            <p className="sgn-login-hint">
              이미 계정이 있으신가요?
              <button className="sgn-text-btn" onClick={() => onNav('login')}>로그인</button>
            </p>
          </>)}

          {/* ── 2단계: 기본 정보 ── */}
          {step === 2 && (<>
            <div className="auth-card-head sgn-step-head">
              <h1>기본 정보 입력</h1>
              <p>{userType === 'buyer' ? '바이어' : '제조사'} 계정을 만들어 드릴게요</p>
            </div>
            <div className="sgn-form">
              <div className="sgn-field">
                <span className="auth-field-label">이메일 <em className="sgn-req">*</em></span>
                <div className={`auth-input-wrap ${errors.email ? 'sgn-wrap-err' : ''}`}>
                  <Icon name="mail" size={15} stroke={1.8}/>
                  <input className="auth-input" type="email" placeholder="company@email.com"
                    value={form.email} onChange={e => upd('email', e.target.value)} autoComplete="email"/>
                </div>
                {errors.email && <span className="sgn-err">{errors.email}</span>}
              </div>
              <div className="sgn-field">
                <span className="auth-field-label">비밀번호 <em className="sgn-req">*</em></span>
                <div className={`auth-input-wrap ${errors.password ? 'sgn-wrap-err' : ''}`}>
                  <Icon name="lock" size={15} stroke={1.8}/>
                  <input className="auth-input" type="password" placeholder="8자 이상"
                    value={form.password} onChange={e => upd('password', e.target.value)} autoComplete="new-password"/>
                </div>
                {errors.password && <span className="sgn-err">{errors.password}</span>}
              </div>
              <div className="sgn-field">
                <span className="auth-field-label">비밀번호 확인 <em className="sgn-req">*</em></span>
                <div className={`auth-input-wrap ${errors.passwordConfirm ? 'sgn-wrap-err' : ''}`}>
                  <Icon name="lock" size={15} stroke={1.8}/>
                  <input className="auth-input" type="password" placeholder="비밀번호 재입력"
                    value={form.passwordConfirm} onChange={e => upd('passwordConfirm', e.target.value)} autoComplete="new-password"/>
                </div>
                {errors.passwordConfirm && <span className="sgn-err">{errors.passwordConfirm}</span>}
              </div>
              <div className="sgn-sep"/>
              <div className="sgn-field">
                <span className="auth-field-label">회사명 <em className="sgn-req">*</em></span>
                <div className={`auth-input-wrap ${errors.companyName ? 'sgn-wrap-err' : ''}`}>
                  <Icon name="building" size={15} stroke={1.8}/>
                  <input className="auth-input" type="text" placeholder="(주)회사명"
                    value={form.companyName} onChange={e => upd('companyName', e.target.value)}/>
                </div>
                {errors.companyName && <span className="sgn-err">{errors.companyName}</span>}
              </div>
              <div className="sgn-field">
                <span className="auth-field-label">사업자번호 <em className="sgn-req">*</em></span>
                <div className={`auth-input-wrap ${errors.businessNumber ? 'sgn-wrap-err' : ''}`}>
                  <Icon name="layers" size={15} stroke={1.8}/>
                  <input className="auth-input" type="text" placeholder="000-00-00000" maxLength={12}
                    value={form.businessNumber} onChange={e => upd('businessNumber', fmtBiz(e.target.value))}/>
                </div>
                {errors.businessNumber && <span className="sgn-err">{errors.businessNumber}</span>}
              </div>
              <div className="sgn-field">
                <span className="auth-field-label">담당자명 <em className="sgn-req">*</em></span>
                <div className={`auth-input-wrap ${errors.contactName ? 'sgn-wrap-err' : ''}`}>
                  <Icon name="user" size={15} stroke={1.8}/>
                  <input className="auth-input" type="text" placeholder="홍길동"
                    value={form.contactName} onChange={e => upd('contactName', e.target.value)}/>
                </div>
                {errors.contactName && <span className="sgn-err">{errors.contactName}</span>}
              </div>
              <div className="sgn-field">
                <span className="auth-field-label">연락처</span>
                <div className="auth-input-wrap">
                  <Icon name="phone" size={15} stroke={1.8}/>
                  <input className="auth-input" type="text" placeholder="010-0000-0000" maxLength={13}
                    value={form.contactPhone} onChange={e => upd('contactPhone', fmtPhone(e.target.value))}/>
                </div>
              </div>
            </div>
            <button className="btn-primary sgn-btn" onClick={goNext}>
              다음 단계 <Icon name="arrow_right" size={14} stroke={2.4}/>
            </button>
          </>)}

          {/* ── 3단계: 관심분야 / 역량 ── */}
          {step === 3 && (<>
            <div className="auth-card-head sgn-step-head">
              <h1>{userType === 'buyer' ? '필요한 제조 정보' : '보유 공정 & 역량'}</h1>
              <p>{userType === 'buyer' ? '어떤 제조 서비스가 필요하신가요?' : '보유한 공정과 역량을 선택해주세요'}</p>
            </div>
            <div className="sgn-form">
              {userType === 'buyer' ? (<>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">필요한 가공방식</div>
                  <div className="sgn-chips">
                    {PROCESSES.map(p => (
                      <button key={p.id} className={`sgn-chip ${form.neededProcesses.includes(p.id) ? 'is-on' : ''}`}
                        onClick={() => upd('neededProcesses', tog(form.neededProcesses, p.id))}>{p.label}</button>
                    ))}
                  </div>
                </div>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">주요 소재</div>
                  <div className="sgn-chips">
                    {SGN_MATERIALS.map(m => (
                      <button key={m} className={`sgn-chip ${form.neededMaterials.includes(m) ? 'is-on' : ''}`}
                        onClick={() => upd('neededMaterials', tog(form.neededMaterials, m))}>{m}</button>
                    ))}
                  </div>
                </div>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">발주 예상 규모</div>
                  <div className="sgn-chips">
                    {SGN_SCALES.map(s => (
                      <button key={s} className={`sgn-chip ${form.orderScale === s ? 'is-on' : ''}`}
                        onClick={() => upd('orderScale', form.orderScale === s ? '' : s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </>) : (<>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">보유 공정</div>
                  <div className="sgn-chips">
                    {PROCESSES.map(p => (
                      <button key={p.id} className={`sgn-chip ${form.ownedProcesses.includes(p.id) ? 'is-on' : ''}`}
                        onClick={() => upd('ownedProcesses', tog(form.ownedProcesses, p.id))}>{p.label}</button>
                    ))}
                  </div>
                </div>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">주력 소재</div>
                  <div className="sgn-chips">
                    {SGN_MATERIALS.map(m => (
                      <button key={m} className={`sgn-chip ${form.ownedMaterials.includes(m) ? 'is-on' : ''}`}
                        onClick={() => upd('ownedMaterials', tog(form.ownedMaterials, m))}>{m}</button>
                    ))}
                  </div>
                </div>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">보유 인증</div>
                  <div className="sgn-chips">
                    {SGN_CERTS.map(c => (
                      <button key={c} className={`sgn-chip ${form.certs.includes(c) ? 'is-on' : ''}`}
                        onClick={() => upd('certs', tog(form.certs, c))}>{c}</button>
                    ))}
                  </div>
                </div>
                <div className="sgn-section">
                  <div className="sgn-section-ttl">OEM / ODM 가능 여부</div>
                  <div className="sgn-chips">
                    <button className={`sgn-chip ${form.oemAvailable ? 'is-on' : ''}`}
                      onClick={() => upd('oemAvailable', !form.oemAvailable)}>OEM 가능</button>
                    <button className={`sgn-chip ${form.odmAvailable ? 'is-on' : ''}`}
                      onClick={() => upd('odmAvailable', !form.odmAvailable)}>ODM 가능</button>
                  </div>
                </div>
              </>)}
            </div>
            <button className="btn-primary sgn-btn" onClick={goNext}>
              다음 단계 <Icon name="arrow_right" size={14} stroke={2.4}/>
            </button>
            <button className="sgn-skip-btn" onClick={goNext}>이 단계 건너뛰기</button>
          </>)}

          {/* ── 4단계: 서류 업로드 ── */}
          {step === 4 && (<>
            <div className="auth-card-head sgn-step-head">
              <h1>서류 업로드</h1>
              <p>본인 확인을 위해 사업자등록증이 필요합니다</p>
            </div>
            <div className="sgn-form">
              <div className="sgn-upload-block">
                <div className="sgn-upload-ttl">
                  사업자등록증
                  <span className="sgn-badge-req">필수</span>
                </div>
                <label className={`sgn-drop-zone ${form.businessDoc ? 'has-file' : ''}`}>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                    onChange={e => upd('businessDoc', e.target.files[0] || null)}/>
                  {form.businessDoc ? (<>
                    <div className="sgn-dz-icon is-ok"><Icon name="check" size={18} stroke={2.5}/></div>
                    <div className="sgn-dz-name">{form.businessDoc.name}</div>
                    <div className="sgn-dz-hint">변경하려면 다시 클릭 · {(form.businessDoc.size/1024).toFixed(0)} KB</div>
                  </>) : (<>
                    <div className="sgn-dz-icon"><Icon name="upload" size={18} stroke={1.8}/></div>
                    <div className="sgn-dz-name">클릭하여 파일 선택</div>
                    <div className="sgn-dz-hint">PDF, JPG, PNG · 최대 10MB</div>
                  </>)}
                </label>
              </div>
              {userType === 'manufacturer' && (
                <div className="sgn-upload-block">
                  <div className="sgn-upload-ttl">
                    공장 사진
                    <span className="sgn-badge-opt">선택</span>
                  </div>
                  <label className={`sgn-drop-zone ${form.factoryPhoto ? 'has-file' : ''}`}>
                    <input type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }}
                      onChange={e => upd('factoryPhoto', e.target.files[0] || null)}/>
                    {form.factoryPhoto ? (<>
                      <div className="sgn-dz-icon is-ok"><Icon name="check" size={18} stroke={2.5}/></div>
                      <div className="sgn-dz-name">{form.factoryPhoto.name}</div>
                      <div className="sgn-dz-hint">변경하려면 다시 클릭 · {(form.factoryPhoto.size/1024).toFixed(0)} KB</div>
                    </>) : (<>
                      <div className="sgn-dz-icon"><Icon name="layers" size={18} stroke={1.8}/></div>
                      <div className="sgn-dz-name">공장 외관 또는 생산 사진</div>
                      <div className="sgn-dz-hint">JPG, PNG</div>
                    </>)}
                  </label>
                </div>
              )}
              {errors.submit && (
                <div className="sgn-error-box">
                  <Icon name="info" size={14} stroke={2}/>
                  {errors.submit}
                </div>
              )}
            </div>
            <button className={`btn-primary sgn-btn ${!form.businessDoc || loading ? 'sgn-btn-off' : ''}`}
              onClick={form.businessDoc && !loading ? handleSubmit : undefined}>
              {loading
                ? <><div className="sgn-spin"/>신청 중...</>
                : <>가입 신청하기 <Icon name="arrow_right" size={14} stroke={2.4}/></>}
            </button>
            <p className="sgn-privacy">제출 서류는 본인 확인 목적으로만 사용되며 암호화하여 보관됩니다.</p>
          </>)}

          {/* ── 5단계: 완료 ── */}
          {step === 5 && (
            <div className="sgn-complete">
              <div className="sgn-complete-ico sgn-complete-ico-check">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="8 12 11 15 16 9"/>
                </svg>
              </div>
              <h2 className="sgn-complete-ttl">가입 신청이 완료되었습니다</h2>
              <p className="sgn-complete-sub">
                담당자 검토 후 승인 이메일을 보내드립니다<br/>
                <strong>영업일 1–2일</strong> 소요됩니다
              </p>
              <div className="sgn-complete-card">
                <div className="sgn-cr"><span className="sgn-ck">이메일</span><span className="sgn-cv">{form.email}</span></div>
                <div className="sgn-cr"><span className="sgn-ck">유형</span><span className="sgn-cv">{userType === 'buyer' ? '바이어' : '제조사'}</span></div>
                <div className="sgn-cr"><span className="sgn-ck">DB 규모</span><span className="sgn-cv">전국 12,138개 공장</span></div>
              </div>
              <button className="btn-primary sgn-btn" onClick={() => onNav('landing')}>
                홈으로 이동
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
Object.assign(window, {
  LandingPage, AuthFormPage, VerifyPage, OnboardingPage, WelcomePage, SignupPage,
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
const MyPage = ({ profile: profileProp, onSwitchRole, onOpenFactory, onNav }) => {
  const [tab, setTab] = useState('overview');
  const [dbProfile, setDbProfile] = useState(null);
  const [rfqs, setRfqs] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ contact_name: '', contact_phone: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  const favorites = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fm-favorites') || '[]'); } catch { return []; }
  }, []);
  const recentViews = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fm-recent-views') || '[]'); } catch { return []; }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await window._sb.auth.getUser();
        if (!user) { setLoadingProfile(false); return; }
        const { data } = await window._sb.from('user_profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) {
          setDbProfile(data);
          setEditForm({ contact_name: data.contact_name || '', contact_phone: data.contact_phone || '' });
        }
        try {
          const { data: rdata } = await window._sb
            .from('rfq_requests').select('id,title,status,created_at,qty')
            .eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
          if (rdata) setRfqs(rdata);
        } catch {}
      } catch {}
      setLoadingProfile(false);
    })();
  }, []);

  const profile = dbProfile || profileProp || {};
  const role = profile.user_type || profile.role || 'buyer';
  const name = profile.contact_name || profile.name || '—';
  const company = profile.company_name || profile.company || '—';
  const email = profile.contact_email || profile.email || '—';
  const phone = profile.contact_phone || '—';
  const businessNumber = profile.business_number || '—';
  const joinedAt = profile.created_at
    ? profile.created_at.slice(0, 10)
    : (profileProp?.joinedAt || '—');
  const interests = profile.interests || {};
  const interestChips = [
    ...(interests.needed_processes || interests.owned_processes || [])
      .map(id => PROCESSES_AC.find(p => p.id === id)?.label || id),
    ...(interests.needed_materials || interests.main_materials || []),
  ].filter(Boolean);

  const stats = [
    { k: '진행중 견적', v: rfqs.filter(r => r.status !== 'completed' && r.status !== '완료').length },
    { k: '관심 제조사', v: favorites.length },
    { k: '최근 조회', v: recentViews.length },
    { k: '활성 채팅', v: 0 },
  ];

  const saveEdit = async () => {
    setEditSaving(true);
    setEditMsg('');
    try {
      const { data: { user } } = await window._sb.auth.getUser();
      if (!user) throw new Error('로그인 필요');
      const { error } = await window._sb.from('user_profiles').update({
        contact_name: editForm.contact_name,
        contact_phone: editForm.contact_phone,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
      if (error) throw error;
      setDbProfile(prev => ({ ...prev, contact_name: editForm.contact_name, contact_phone: editForm.contact_phone }));
      setEditMsg('저장되었습니다.');
      setTimeout(() => { setShowEditModal(false); setEditMsg(''); }, 800);
    } catch (e) {
      setEditMsg('저장 실패: ' + (e.message || '오류'));
    }
    setEditSaving(false);
  };

  const TABS = [
    { id: 'overview', label: '개요' },
    { id: 'rfq', label: '견적 요청 내역', count: rfqs.length || null },
    { id: 'history', label: '최근 조회', count: recentViews.length || null },
    { id: 'favs', label: '관심 제조사', count: favorites.length || null },
    { id: 'profile', label: '계정/회사 정보' },
  ];

  const EmptyState = ({ icon, msg, btnLabel, onBtnClick }) => (
    <div className="myp-empty">
      <Icon name={icon} size={28} stroke={1.4} className="myp-empty-ico"/>
      <p className="myp-empty-msg">{msg}</p>
      {btnLabel && (
        <button className="btn btn-primary btn-sm" onClick={onBtnClick}>{btnLabel}</button>
      )}
    </div>
  );

  return (
    <main className="page mypage">

      {/* ── 프로필 카드 ── */}
      <header className="mypage-hero">
        <div className="mypage-hero-id">
          <div className="mypage-avatar">{name.slice(0, 1)}</div>
          <div className="mypage-hero-info">
            <div className="mypage-role-row">
              <span className={'mypage-role-badge mypage-role-' + (role === 'buyer' ? 'buyer' : 'seller')}>
                <Icon name={role === 'buyer' ? 'search' : 'factory'} size={11} stroke={2.2}/>
                {role === 'buyer' ? '바이어' : '제조사'}
              </span>
              {profile.status && profile.status !== 'approved' && (
                <span className="myp-status-badge myp-status-pending">
                  {profile.status === 'pending' ? '승인 대기중' : '미승인'}
                </span>
              )}
            </div>
            <h1>{name}</h1>
            <div className="mypage-hero-meta">
              <span>{company}</span>
              <span className="dot">·</span>
              <span>{email}</span>
              {joinedAt !== '—' && (
                <><span className="dot">·</span><span>{joinedAt} 가입</span></>
              )}
            </div>
            <button className="myp-role-link" onClick={() => onSwitchRole && onSwitchRole(role === 'buyer' ? 'seller' : 'buyer')}>
              {role === 'buyer' ? '제조사로 전환' : '바이어로 전환'}
            </button>
          </div>
        </div>
        <div className="mypage-hero-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(true)}>
            <Icon name="user" size={13} stroke={2}/>
            프로필 수정
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNav && onNav('list')}>
            <Icon name="search" size={13} stroke={2}/>
            제조사 찾기
          </button>
        </div>
      </header>

      {/* ── 통계 카드 ── */}
      <section className="mypage-stats">
        {stats.map(s => (
          <div key={s.k} className="mystat">
            <div className="mystat-k">{s.k}</div>
            <div className="mystat-v">{loadingProfile ? '—' : s.v}</div>
          </div>
        ))}
      </section>

      {/* ── 탭 ── */}
      <nav className="mypage-tabs">
        {TABS.map(t => (
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

      {/* ── 개요 탭 ── */}
      {tab === 'overview' && (
        <section className="mypage-grid">
          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>최근 견적 요청</h3>
              <button onClick={() => setTab('rfq')}>전체 보기</button>
            </header>
            {rfqs.length === 0 ? (
              <EmptyState icon="layers" msg="견적 요청 내역이 없습니다." btnLabel="제조사 찾기" onBtnClick={() => onNav && onNav('list')}/>
            ) : (
              <ul className="rfq-history">
                {rfqs.slice(0, 3).map(r => (
                  <li key={r.id} className="rfq-history-row">
                    <div className="rfq-history-status" data-status={r.status}>{r.status || '—'}</div>
                    <div className="rfq-history-body">
                      <h4>{r.title || '견적 요청'}</h4>
                      <div className="rfq-history-meta">
                        <span>#{String(r.id).slice(-6)}</span>
                        {r.qty && <><span>·</span><span>{r.qty.toLocaleString()}개</span></>}
                      </div>
                    </div>
                    <div className="rfq-history-date">{r.created_at ? r.created_at.slice(0, 10) : ''}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>관심 제조사</h3>
              <button onClick={() => setTab('favs')}>전체 보기</button>
            </header>
            {favorites.length === 0 ? (
              <EmptyState icon="heart" msg="찜한 제조사가 없습니다." btnLabel="제조사 둘러보기" onBtnClick={() => onNav && onNav('list')}/>
            ) : (
              <ul className="fav-list">
                {favorites.slice(0, 4).map(id => {
                  const f = FACTORIES_AC.find(x => x.id === id);
                  if (!f) return null;
                  return (
                    <li key={id}>
                      <button className="fav-row" onClick={() => onOpenFactory && onOpenFactory(id)}>
                        <div className="fav-img" style={{ background: f.image }}><div className="mcard-img-stripes"/></div>
                        <div className="fav-body">
                          <h4>{f.name}</h4>
                          <span>{f.city} · {f.processes.slice(0, 2).map(pid => PROCESSES_AC.find(p => p.id === pid)?.label).filter(Boolean).join(', ')}</span>
                        </div>
                        <Icon name="chevron_right" size={14} stroke={2} className="fav-arrow"/>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>관심 분야</h3>
            </header>
            {interestChips.length > 0 ? (
              <div className="mypage-tags">
                {interestChips.map((label, i) => <span key={i} className="mtag">{label}</span>)}
              </div>
            ) : (
              <p className="myp-empty-msg" style={{ color: 'var(--ink-4)', fontSize: 13 }}>관심 분야 정보가 없습니다.</p>
            )}
          </div>

          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>알림</h3>
            </header>
            <EmptyState icon="bell" msg="새로운 알림이 없습니다."/>
          </div>
        </section>
      )}

      {/* ── 견적 요청 내역 탭 ── */}
      {tab === 'rfq' && (
        rfqs.length === 0 ? (
          <div className="mypage-card mypage-card-full">
            <EmptyState icon="layers" msg="아직 견적 요청 내역이 없습니다. 제조사를 찾아보세요." btnLabel="제조사 찾기" onBtnClick={() => onNav && onNav('list')}/>
          </div>
        ) : (
          <section className="mypage-table">
            <table>
              <thead>
                <tr>
                  <th>요청 번호</th><th>요청일</th><th>제목</th><th>수량</th><th>상태</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map(r => (
                  <tr key={r.id}>
                    <td className="mono">#{String(r.id).slice(-6)}</td>
                    <td>{r.created_at ? r.created_at.slice(0, 10) : '—'}</td>
                    <td>{r.title || '견적 요청'}</td>
                    <td>{r.qty ? r.qty.toLocaleString() + '개' : '—'}</td>
                    <td><span className={'status-pill status-' + (r.status || '')}>{r.status || '—'}</span></td>
                    <td><button className="link-btn">상세</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )
      )}

      {/* ── 최근 조회 탭 ── */}
      {tab === 'history' && (
        recentViews.length === 0 ? (
          <div className="mypage-card mypage-card-full">
            <EmptyState icon="clock" msg="최근 조회한 제조사가 없습니다." btnLabel="제조사 둘러보기" onBtnClick={() => onNav && onNav('list')}/>
          </div>
        ) : (
          <section className="mypage-card mypage-card-full">
            <header className="mypage-card-head">
              <h3>최근 조회한 제조사</h3>
              <button onClick={() => { try { localStorage.removeItem('fm-recent-views'); } catch {} window.location.reload(); }}>기록 삭제</button>
            </header>
            <ul className="hist-list">
              {recentViews.map((v, i) => {
                const f = FACTORIES_AC.find(x => x.id === v.id);
                if (!f) return null;
                return (
                  <li key={i}>
                    <button className="fav-row" onClick={() => onOpenFactory && onOpenFactory(v.id)}>
                      <div className="fav-img" style={{ background: f.image }}><div className="mcard-img-stripes"/></div>
                      <div className="fav-body">
                        <h4>{f.name}</h4>
                        <span>{f.city} · {f.processes.slice(0, 2).map(pid => PROCESSES_AC.find(p => p.id === pid)?.label).filter(Boolean).join(', ')}</span>
                      </div>
                      {v.at && <span className="hist-time">{v.at}</span>}
                      <Icon name="chevron_right" size={14} stroke={2} className="fav-arrow"/>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )
      )}

      {/* ── 관심 제조사 탭 ── */}
      {tab === 'favs' && (
        favorites.length === 0 ? (
          <div className="mypage-card mypage-card-full">
            <EmptyState icon="heart" msg="찜한 제조사가 없습니다. 공장 상세 페이지에서 ♥를 눌러 저장하세요." btnLabel="제조사 찾기" onBtnClick={() => onNav && onNav('list')}/>
          </div>
        ) : (
          <section className="mypage-card mypage-card-full">
            <header className="mypage-card-head"><h3>관심 제조사</h3></header>
            <ul className="fav-list">
              {favorites.map(id => {
                const f = FACTORIES_AC.find(x => x.id === id);
                if (!f) return null;
                return (
                  <li key={id}>
                    <button className="fav-row" onClick={() => onOpenFactory && onOpenFactory(id)}>
                      <div className="fav-img" style={{ background: f.image }}><div className="mcard-img-stripes"/></div>
                      <div className="fav-body">
                        <h4>{f.name}</h4>
                        <span>{f.city}{f.moq > 0 ? ` · MOQ ${f.moq.toLocaleString()}` : ''}{f.leadDays > 0 ? ` · 리드 ${f.leadDays}일` : ''}</span>
                      </div>
                      <Icon name="chevron_right" size={14} stroke={2} className="fav-arrow"/>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )
      )}

      {/* ── 계정/회사 정보 탭 ── */}
      {tab === 'profile' && (
        <section className="mypage-grid">
          <div className="mypage-card">
            <header className="mypage-card-head">
              <h3>계정 정보</h3>
              <button onClick={() => setShowEditModal(true)}>수정</button>
            </header>
            <dl className="profile-dl">
              <dt>이름</dt><dd>{name}</dd>
              <dt>이메일</dt><dd>{email}</dd>
              <dt>휴대폰</dt><dd>{phone}</dd>
              <dt>가입일</dt><dd>{joinedAt}</dd>
            </dl>
          </div>
          <div className="mypage-card">
            <header className="mypage-card-head"><h3>회사 정보</h3></header>
            <dl className="profile-dl">
              <dt>회사명</dt><dd>{company}</dd>
              <dt>사업자번호</dt><dd>{businessNumber}</dd>
              <dt>역할</dt><dd>{role === 'buyer' ? '바이어 (구매)' : '제조사 (판매)'}</dd>
              <dt>가입 상태</dt>
              <dd>{profile.status === 'approved' ? '승인됨' : profile.status === 'pending' ? '승인 대기중' : profile.status || '—'}</dd>
            </dl>
          </div>
        </section>
      )}

      {/* ── 프로필 수정 모달 ── */}
      {showEditModal && (
        <div className="myp-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="myp-modal" onClick={e => e.stopPropagation()}>
            <div className="myp-modal-head">
              <h2>프로필 수정</h2>
              <button className="myp-modal-close" onClick={() => setShowEditModal(false)}>
                <Icon name="close" size={18} stroke={2}/>
              </button>
            </div>
            <div className="myp-modal-body">
              <label className="myp-field">
                <span>이름</span>
                <input
                  className="myp-input"
                  value={editForm.contact_name}
                  onChange={e => setEditForm(f => ({ ...f, contact_name: e.target.value }))}
                  placeholder="담당자 이름"
                />
              </label>
              <label className="myp-field">
                <span>연락처</span>
                <input
                  className="myp-input"
                  value={editForm.contact_phone}
                  onChange={e => setEditForm(f => ({ ...f, contact_phone: e.target.value }))}
                  placeholder="010-0000-0000"
                />
              </label>
              {editMsg && (
                <p className={'myp-save-msg ' + (editMsg.includes('실패') ? 'err' : 'ok')}>{editMsg}</p>
              )}
            </div>
            <div className="myp-modal-foot">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>취소</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={editSaving}>
                {editSaving ? '저장중…' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// ──────────────────────────────────────────────────────────
// ── 공공데이터 CSV 업로드 헬퍼 ──────────────────────────────
function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const buf = new Uint8Array(e.target.result);
      // UTF-8 BOM?
      if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        resolve(new TextDecoder('utf-8').decode(buf.slice(3)));
        return;
      }
      // Try strict UTF-8 first (throws on bad sequences = EUC-KR file)
      try {
        resolve(new TextDecoder('utf-8', { fatal: true }).decode(buf));
      } catch (_) {
        // Fall back to EUC-KR / CP949
        try { resolve(new TextDecoder('euc-kr').decode(buf)); }
        catch (e2) { reject(new Error('UTF-8 또는 EUC-KR 파일만 지원합니다.')); }
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function parseCSVLine(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur.trim()); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function extractRegion(addr) {
  if (!addr) return 'etc';
  if (addr.includes('서울'))                              return 'seoul';
  if (addr.includes('경기'))                              return 'gyeonggi';
  if (addr.includes('인천'))                              return 'incheon';
  if (addr.includes('부산'))                              return 'busan';
  if (addr.includes('울산'))                              return 'ulsan';
  if (addr.includes('경남'))                              return 'gyeongnam';
  if (addr.includes('대구') || addr.includes('경북'))     return 'daegu';
  if (addr.includes('광주') || addr.includes('전남') || addr.includes('전북')) return 'jeonla';
  if (addr.includes('대전') || addr.includes('충남') || addr.includes('충북') || addr.includes('세종')) return 'chungcheong';
  if (addr.includes('강원'))                              return 'gangwon';
  if (addr.includes('제주'))                              return 'jeju';
  return 'etc';
}

// AdminReportsTab — 신고 관리
// ──────────────────────────────────────────────────────────
const AdminReportsTab = () => {
  const [activeStatus, setActiveStatus] = useState('pending');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [counts, setCounts] = useState({ pending: 0, processing: 0, resolved: 0, rejected: 0 });

  const loadReports = async (status) => {
    setLoading(true);
    setError('');
    try {
      const { data, error: dbError } = await window._sb
        .from('factory_reports')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
      if (dbError) throw dbError;
      setReports(data || []);
    } catch (err) {
      console.error('Load reports error:', err);
      setError('신고 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    try {
      const statuses = ['pending', 'processing', 'resolved', 'rejected'];
      const results = await Promise.all(
        statuses.map(s =>
          window._sb
            .from('factory_reports')
            .select('id', { count: 'estimated', head: true })
            .eq('status', s)
        )
      );
      const newCounts = {};
      statuses.forEach((s, i) => { newCounts[s] = results[i].count || 0; });
      setCounts(newCounts);
    } catch (err) {
      console.error('Load counts error:', err);
    }
  };

  useEffect(() => {
    if (!window._sb) { setLoading(false); setError('Supabase 연결이 필요합니다.'); return; }
    loadReports(activeStatus);
    loadCounts();
  }, [activeStatus]);

  const handleStatusChange = async (reportId, newStatus, adminNote = '') => {
    try {
      const updates = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === 'resolved' || newStatus === 'rejected') {
        updates.resolved_at = new Date().toISOString();
      }
      if (adminNote) updates.admin_note = adminNote;
      const { error: dbError } = await window._sb
        .from('factory_reports')
        .update(updates)
        .eq('id', reportId);
      if (dbError) throw dbError;
      await loadReports(activeStatus);
      await loadCounts();
      setSelectedReport(null);
    } catch (err) {
      console.error('Status change error:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const STATUS_LABELS = { pending: '접수', processing: '처리중', resolved: '완료', rejected: '거절' };
  const TYPE_LABELS = { factory_issue: '공장 신고', self_correction: '자사 정정', general_inquiry: '일반 문의' };

  const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  return (
    <div className="admin-reports-tab">
      <div className="admin-reports-status-tabs">
        {['pending', 'processing', 'resolved', 'rejected'].map(s => (
          <button
            key={s}
            className={`admin-reports-status-tab ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {STATUS_LABELS[s]}
            {counts[s] > 0 && <span className="admin-reports-count-badge">{counts[s]}</span>}
          </button>
        ))}
      </div>

      <div className="admin-reports-list">
        {loading && <div className="admin-reports-loading">로딩 중...</div>}
        {error && <div className="admin-reports-error">{error}</div>}
        {!loading && !error && reports.length === 0 && (
          <div className="admin-reports-empty">{STATUS_LABELS[activeStatus]} 상태의 신고가 없습니다.</div>
        )}
        {!loading && !error && reports.length > 0 && (
          <table className="admin-reports-table">
            <thead>
              <tr>
                <th>접수일시</th><th>종류</th><th>대상 공장</th>
                <th>신청자</th><th>회사명</th><th>사유</th><th>액션</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <span className={`admin-reports-type-badge type-${r.report_type}`}>
                      {TYPE_LABELS[r.report_type] || r.report_type}
                    </span>
                  </td>
                  <td>{r.target_factory_name || '-'}</td>
                  <td>{r.reporter_name}</td>
                  <td>{r.reporter_company}</td>
                  <td className="admin-reports-reason-cell">{r.reason}</td>
                  <td>
                    <button className="admin-reports-detail-btn" onClick={() => setSelectedReport(r)}>
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedReport && (
        <div className="admin-reports-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="admin-reports-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-reports-modal-header">
              <h2>신고 상세</h2>
              <button className="admin-reports-modal-close" onClick={() => setSelectedReport(null)}>×</button>
            </div>

            <div className="admin-reports-modal-body">
              <div className="admin-reports-detail-section">
                <h3>요청 정보</h3>
                <div className="admin-reports-detail-row"><strong>접수번호:</strong> #{selectedReport.id}</div>
                <div className="admin-reports-detail-row"><strong>접수일시:</strong> {formatDate(selectedReport.created_at)}</div>
                <div className="admin-reports-detail-row"><strong>종류:</strong> {TYPE_LABELS[selectedReport.report_type]}</div>
                <div className="admin-reports-detail-row">
                  <strong>현재 상태:</strong>
                  <span className={`admin-reports-status-badge status-${selectedReport.status}`}>
                    {STATUS_LABELS[selectedReport.status]}
                  </span>
                </div>
                {selectedReport.target_factory_name && (
                  <div className="admin-reports-detail-row">
                    <strong>대상 공장:</strong> {selectedReport.target_factory_name}
                    {selectedReport.target_factory_id && (
                      <span style={{color:'#888',fontSize:'12px'}}> (ID: {selectedReport.target_factory_id})</span>
                    )}
                  </div>
                )}
              </div>

              <div className="admin-reports-detail-section">
                <h3>신청자 정보</h3>
                <div className="admin-reports-detail-row"><strong>회사명:</strong> {selectedReport.reporter_company}</div>
                {selectedReport.reporter_business_number && (
                  <div className="admin-reports-detail-row"><strong>사업자번호:</strong> {selectedReport.reporter_business_number}</div>
                )}
                <div className="admin-reports-detail-row"><strong>담당자:</strong> {selectedReport.reporter_name}</div>
                <div className="admin-reports-detail-row">
                  <strong>이메일:</strong>
                  <a href={`mailto:${selectedReport.reporter_email}`}>{selectedReport.reporter_email}</a>
                </div>
                {selectedReport.reporter_phone && (
                  <div className="admin-reports-detail-row"><strong>연락처:</strong> {selectedReport.reporter_phone}</div>
                )}
              </div>

              <div className="admin-reports-detail-section">
                <h3>요청 내용</h3>
                <div className="admin-reports-detail-row"><strong>사유:</strong> {selectedReport.reason}</div>
                {selectedReport.description && (
                  <div className="admin-reports-detail-description">
                    <strong>상세:</strong>
                    <div className="admin-reports-detail-text">{selectedReport.description}</div>
                  </div>
                )}
              </div>

              {selectedReport.admin_note && (
                <div className="admin-reports-detail-section">
                  <h3>관리자 메모</h3>
                  <div className="admin-reports-detail-text">{selectedReport.admin_note}</div>
                </div>
              )}

              {selectedReport.resolved_at && (
                <div className="admin-reports-detail-section">
                  <h3>처리 정보</h3>
                  <div className="admin-reports-detail-row"><strong>처리일시:</strong> {formatDate(selectedReport.resolved_at)}</div>
                </div>
              )}
            </div>

            <div className="admin-reports-modal-actions">
              {selectedReport.status === 'pending' && (<>
                <button className="admin-reports-action-btn primary"
                  onClick={() => handleStatusChange(selectedReport.id, 'processing')}>
                  처리 시작
                </button>
                <button className="admin-reports-action-btn"
                  onClick={() => { const n = prompt('거절 사유를 입력하세요:'); if (n) handleStatusChange(selectedReport.id, 'rejected', n); }}>
                  거절
                </button>
              </>)}
              {selectedReport.status === 'processing' && (<>
                <button className="admin-reports-action-btn primary"
                  onClick={() => { const n = prompt('처리 내용을 입력하세요 (선택):') || ''; handleStatusChange(selectedReport.id, 'resolved', n); }}>
                  완료 처리
                </button>
                <button className="admin-reports-action-btn"
                  onClick={() => { const n = prompt('거절 사유를 입력하세요:'); if (n) handleStatusChange(selectedReport.id, 'rejected', n); }}>
                  거절
                </button>
              </>)}
              {(selectedReport.status === 'resolved' || selectedReport.status === 'rejected') && (
                <button className="admin-reports-action-btn"
                  onClick={() => handleStatusChange(selectedReport.id, 'pending')}>
                  접수 상태로 되돌리기
                </button>
              )}
              <button className="admin-reports-action-btn cancel" onClick={() => setSelectedReport(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AdminSignupTab — 가입 신청 관리
// ──────────────────────────────────────────────────────────
const AdminSignupTab = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [memo, setMemo] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });

  const loadSignups = async (status) => {
    setLoading(true);
    setError('');
    try {
      let q = window._sb.from('user_profiles').select('*').order('created_at', { ascending: false });
      if (status !== 'all') q = q.eq('status', status);
      const { data, error: dbErr } = await q;
      if (dbErr) throw dbErr;
      setSignups(data || []);
    } catch (err) {
      console.error('AdminSignupTab load error:', err);
      setError('목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    try {
      const statuses = ['pending', 'approved', 'rejected'];
      const [allRes, ...results] = await Promise.all([
        window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }),
        ...statuses.map(s =>
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }).eq('status', s)
        ),
      ]);
      const c = { all: allRes.count || 0 };
      statuses.forEach((s, i) => { c[s] = results[i].count || 0; });
      setCounts(c);
    } catch (err) {
      console.error('AdminSignupTab count error:', err);
    }
  };

  useEffect(() => {
    if (!window._sb) { setLoading(false); setError('Supabase 연결이 필요합니다.'); return; }
    loadSignups(activeStatus);
    loadCounts();
  }, [activeStatus]);

  const openDetail = (row) => {
    setSelected(row);
    setMemo(row.admin_memo || '');
    setEmailStatus('');
  };

  const handleApprove = async () => {
    if (!selected || actionLoading) return;
    setActionLoading(true);
    try {
      const now = new Date().toISOString();
      const updates = { status: 'approved', approved_at: now, updated_at: now };
      if (memo.trim()) updates.admin_memo = memo.trim();
      const { error: dbErr } = await window._sb.from('user_profiles').update(updates).eq('id', selected.id);
      if (dbErr) throw dbErr;

      if (selected.role === 'manufacturer' && selected.business_number) {
        const bizNum = selected.business_number.replace(/\D/g, '');
        const { data: matched } = await window._sb.from('factories').select('id, business_number').limit(200);
        if (matched) {
          const hit = matched.find(f => f.business_number && f.business_number.replace(/\D/g, '') === bizNum);
          if (hit) {
            await window._sb.from('factories').update({ owner_user_id: selected.id }).eq('id', hit.id);
          }
        }
      }

      setEmailStatus('sending');
      try {
        const res = await fetch('/.netlify/functions/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'approved', email: selected.email, name: selected.contact_name, company: selected.company_name }),
        });
        setEmailStatus(res.ok ? 'sent' : 'failed');
      } catch { setEmailStatus('failed'); }

      await loadSignups(activeStatus);
      await loadCounts();
      setSelected(s => s ? { ...s, status: 'approved', approved_at: now, admin_memo: memo.trim() || s.admin_memo } : null);
    } catch (err) {
      console.error('Approve error:', err);
      alert('승인 처리에 실패했습니다: ' + (err.message || err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected || actionLoading) return;
    const reason = prompt('거절 사유를 입력하세요 (선택사항):');
    if (reason === null) return;
    setActionLoading(true);
    try {
      const now = new Date().toISOString();
      const finalMemo = reason.trim() || memo.trim();
      const updates = { status: 'rejected', updated_at: now };
      if (finalMemo) updates.admin_memo = finalMemo;
      const { error: dbErr } = await window._sb.from('user_profiles').update(updates).eq('id', selected.id);
      if (dbErr) throw dbErr;

      setEmailStatus('sending');
      try {
        const res = await fetch('/.netlify/functions/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'rejected', email: selected.email, name: selected.contact_name, company: selected.company_name, reason: finalMemo }),
        });
        setEmailStatus(res.ok ? 'sent' : 'failed');
      } catch { setEmailStatus('failed'); }

      await loadSignups(activeStatus);
      await loadCounts();
      setSelected(s => s ? { ...s, status: 'rejected', admin_memo: finalMemo || s.admin_memo } : null);
    } catch (err) {
      console.error('Reject error:', err);
      alert('거절 처리에 실패했습니다: ' + (err.message || err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!selected || actionLoading) return;
    setEmailStatus('sending');
    try {
      const res = await fetch('/.netlify/functions/send-approval-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected.status === 'approved' ? 'approved' : 'rejected', email: selected.email, name: selected.contact_name, company: selected.company_name }),
      });
      setEmailStatus(res.ok ? 'sent' : 'failed');
    } catch { setEmailStatus('failed'); }
  };

  const saveMemo = async () => {
    if (!selected) return;
    try {
      await window._sb.from('user_profiles').update({ admin_memo: memo, updated_at: new Date().toISOString() }).eq('id', selected.id);
      setSignups(prev => prev.map(r => r.id === selected.id ? { ...r, admin_memo: memo } : r));
    } catch (err) { alert('메모 저장 실패: ' + (err.message || err)); }
  };

  const fmtDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const STATUS_LABELS = { all: '전체', pending: '대기중', approved: '승인됨', rejected: '거절됨' };
  const ROLE_LABELS = { buyer: '바이어', manufacturer: '제조사' };

  return (
    <div className="asgn-wrap">
      <div className="asgn-status-tabs">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            className={`asgn-status-tab ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {STATUS_LABELS[s]}
            {counts[s] > 0 && <span className="asgn-count-badge">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {loading && <div className="asgn-state-msg">로딩 중…</div>}
      {error && <div className="asgn-state-msg asgn-error">{error}</div>}
      {!loading && !error && signups.length === 0 && (
        <div className="asgn-state-msg">해당 상태의 신청이 없습니다.</div>
      )}
      {!loading && !error && signups.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table asgn-table">
            <thead>
              <tr>
                <th>신청일</th><th>유형</th><th>회사명</th><th>사업자번호</th>
                <th>담당자</th><th>연락처</th><th>상태</th><th></th>
              </tr>
            </thead>
            <tbody>
              {signups.map(r => (
                <tr key={r.id}>
                  <td className="mono">{fmtDate(r.created_at)}</td>
                  <td><span className={`asgn-role-badge role-${r.role}`}>{ROLE_LABELS[r.role] || r.role || '-'}</span></td>
                  <td><strong>{r.company_name || '-'}</strong></td>
                  <td className="mono">{r.business_number || '-'}</td>
                  <td>{r.contact_name || '-'}</td>
                  <td className="mono">{r.phone || '-'}</td>
                  <td><span className={`asgn-status-badge status-${r.status}`}>{STATUS_LABELS[r.status] || r.status}</span></td>
                  <td><button className="admin-reports-detail-btn" onClick={() => openDetail(r)}>상세</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-reports-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-reports-modal asgn-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-reports-modal-header">
              <h2>가입 신청 상세</h2>
              <button className="admin-reports-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="admin-reports-modal-body">
              <div className="admin-reports-detail-section">
                <h3>기본 정보</h3>
                <div className="admin-reports-detail-row"><strong>신청일:</strong> {fmtDate(selected.created_at)}</div>
                <div className="admin-reports-detail-row">
                  <strong>유형:</strong>
                  <span className={`asgn-role-badge role-${selected.role}`}>{ROLE_LABELS[selected.role] || selected.role}</span>
                </div>
                <div className="admin-reports-detail-row">
                  <strong>상태:</strong>
                  <span className={`asgn-status-badge status-${selected.status}`}>{STATUS_LABELS[selected.status]}</span>
                </div>
                {selected.approved_at && (
                  <div className="admin-reports-detail-row"><strong>처리일:</strong> {fmtDate(selected.approved_at)}</div>
                )}
              </div>
              <div className="admin-reports-detail-section">
                <h3>회사 정보</h3>
                <div className="admin-reports-detail-row"><strong>회사명:</strong> {selected.company_name || '-'}</div>
                <div className="admin-reports-detail-row"><strong>사업자번호:</strong> <span className="mono">{selected.business_number || '-'}</span></div>
                <div className="admin-reports-detail-row"><strong>담당자:</strong> {selected.contact_name || '-'}</div>
                <div className="admin-reports-detail-row">
                  <strong>이메일:</strong>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
                <div className="admin-reports-detail-row"><strong>연락처:</strong> <span className="mono">{selected.phone || '-'}</span></div>
              </div>
              {selected.interests && selected.interests.length > 0 && (
                <div className="admin-reports-detail-section">
                  <h3>관심 분야</h3>
                  <div className="asgn-interests">
                    {(Array.isArray(selected.interests) ? selected.interests : []).map(t => (
                      <span key={t} className="asgn-interest-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.document_url && (
                <div className="admin-reports-detail-section">
                  <h3>제출 서류</h3>
                  <a className="asgn-doc-link" href={selected.document_url} target="_blank" rel="noopener noreferrer">
                    <Icon name="file" size={14} stroke={2}/> 서류 보기 (새 탭)
                  </a>
                </div>
              )}
              <div className="admin-reports-detail-section">
                <h3>관리자 메모</h3>
                <div className="asgn-memo-wrap">
                  <textarea
                    className="asgn-memo-textarea"
                    rows={3}
                    placeholder="내부 메모를 입력하세요…"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                  />
                  <button className="asgn-memo-save-btn" onClick={saveMemo}>메모 저장</button>
                </div>
              </div>
              {emailStatus && (
                <div className={`asgn-email-status ${emailStatus}`}>
                  {emailStatus === 'sending' && '이메일 발송 중…'}
                  {emailStatus === 'sent' && '이메일 발송 완료'}
                  {emailStatus === 'failed' && '이메일 발송 실패 (Netlify 함수 확인 필요)'}
                </div>
              )}
            </div>
            <div className="admin-reports-modal-actions">
              {selected.status === 'pending' && (<>
                <button className="admin-reports-action-btn primary" disabled={actionLoading} onClick={handleApprove}>
                  {actionLoading ? '처리 중…' : '승인'}
                </button>
                <button className="admin-reports-action-btn" disabled={actionLoading} onClick={handleReject}>거절</button>
              </>)}
              {(selected.status === 'approved' || selected.status === 'rejected') && (
                <button className="admin-reports-action-btn" disabled={actionLoading} onClick={handleResendEmail}>이메일 재발송</button>
              )}
              <button className="admin-reports-action-btn cancel" onClick={() => setSelected(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AdminPasswordGate
// ──────────────────────────────────────────────────────────
const ADMIN_SESSION_KEY = 'fm-admin-auth';

const AdminPasswordGate = ({ onAuth }) => {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = pw.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/.netlify/functions/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });
      const data = await res.json();
      if (data.ok) {
        try { sessionStorage.setItem(ADMIN_SESSION_KEY, '1'); } catch {}
        onAuth();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
    setLoading(false);
  };

  return (
    <main className="page admin-gate-page">
      <div className="admin-gate-box">
        <div className="admin-gate-icon">
          <Icon name="shield" size={28} stroke={1.8}/>
        </div>
        <h1 className="admin-gate-title">관리자 인증</h1>
        <p className="admin-gate-sub">접근하려면 관리자 비밀번호가 필요합니다.</p>
        <div className="admin-gate-form">
          <input
            type="password"
            className="admin-gate-input"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="비밀번호"
            autoFocus
          />
          {error && <p className="admin-gate-error">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
            {loading ? '확인중…' : '확인'}
          </button>
        </div>
      </div>
    </main>
  );
};

// AdminAnalyticsTab
// ──────────────────────────────────────────────────────────
const AdminAnalyticsTab = () => {
  const [todayViews, setTodayViews] = useState(null);
  const [totalViews, setTotalViews] = useState(null);
  const [dayChart, setDayChart] = useState([]);
  const [refBreakdown, setRefBreakdown] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 7일치 뷰 로드
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

        const { data: views } = await window._sb
          .from('page_views')
          .select('path, referrer, created_at')
          .gte('created_at', since)
          .order('created_at', { ascending: true })
          .limit(5000);

        if (views) {
          setTodayViews(views.filter(v => v.created_at >= todayStart.toISOString()).length);

          const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0);
            return d;
          });
          setDayChart(days.map(d => {
            const next = new Date(d); next.setDate(next.getDate() + 1);
            const v = views.filter(x => x.created_at >= d.toISOString() && x.created_at < next.toISOString()).length;
            return { label: `${d.getMonth() + 1}/${d.getDate()}`, v };
          }));

          const ref = { direct: 0, search: 0, social: 0, other: 0 };
          views.forEach(v => {
            if (!v.referrer) ref.direct++;
            else if (/google|naver|daum|bing|yahoo/i.test(v.referrer)) ref.search++;
            else if (/facebook|twitter|instagram|kakao|linkedin/i.test(v.referrer)) ref.social++;
            else ref.other++;
          });
          setRefBreakdown(ref);
        }

        // 전체 누적
        const { count: total } = await window._sb
          .from('page_views').select('id', { count: 'estimated', head: true });
        setTotalViews(total ?? 0);

        // 유저 통계
        const [
          { count: uAll },
          { count: uPending },
          { count: uApproved },
        ] = await Promise.all([
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }),
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }).eq('status', 'pending'),
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }).eq('status', 'approved'),
        ]);
        setUserStats({ total: uAll ?? 0, pending: uPending ?? 0, approved: uApproved ?? 0 });
      } catch {}
      setLoading(false);
    })();
  }, []);

  const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.v), 1);
    const cols = data.length;
    const W = 420, H = 100;
    const colW = W / cols;
    const barW = Math.max(6, colW - 8);
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: 'visible', display: 'block' }}>
        {data.map((d, i) => {
          const bh = Math.max(2, (d.v / max) * H);
          const x = i * colW + (colW - barW) / 2;
          return (
            <g key={i}>
              <rect x={x} y={H - bh} width={barW} height={bh} fill="#3b82f6" rx="3" opacity="0.85"/>
              {d.v > 0 && (
                <text x={x + barW / 2} y={H - bh - 4} textAnchor="middle" fontSize="9" fill="#555">{d.v}</text>
              )}
              <text x={x + barW / 2} y={H + 16} textAnchor="middle" fontSize="9" fill="#999">{d.label}</text>
            </g>
          );
        })}
        <line x1={0} y1={H} x2={W} y2={H} stroke="#eee" strokeWidth="1"/>
      </svg>
    );
  };

  const Metric = ({ label, value, sub }) => (
    <div className="an-metric">
      <div className="an-metric-v">{value ?? '—'}</div>
      <div className="an-metric-k">{label}</div>
      {sub && <div className="an-metric-sub">{sub}</div>}
    </div>
  );

  if (loading) return <div className="an-loading">데이터를 불러오는 중…</div>;

  const totalRef = refBreakdown ? Object.values(refBreakdown).reduce((a, b) => a + b, 0) : 1;
  const refPct = (n) => totalRef ? Math.round((n / totalRef) * 100) : 0;

  return (
    <div className="an-grid">
      {/* 방문자 요약 */}
      <div className="an-card an-card-wide">
        <h3 className="an-card-title">방문자 통계</h3>
        <div className="an-metrics-row">
          <Metric label="오늘 방문자" value={todayViews}/>
          <Metric label="누적 방문자 (전체)" value={totalViews?.toLocaleString()}/>
          <Metric label="최근 7일" value={dayChart.reduce((s, d) => s + d.v, 0)}/>
        </div>
      </div>

      {/* 7일 바 차트 */}
      <div className="an-card an-card-wide">
        <h3 className="an-card-title">최근 7일 일별 방문</h3>
        {dayChart.length > 0 ? (
          <div className="an-chart-wrap">
            <BarChart data={dayChart}/>
          </div>
        ) : (
          <p className="an-empty">데이터가 없습니다.</p>
        )}
      </div>

      {/* 유입 경로 */}
      <div className="an-card">
        <h3 className="an-card-title">유입 경로 (최근 7일)</h3>
        {refBreakdown ? (
          <div className="an-ref-list">
            {[
              { label: '직접 접속', key: 'direct', color: '#3b82f6' },
              { label: '검색엔진', key: 'search', color: '#10b981' },
              { label: '소셜',     key: 'social', color: '#8b5cf6' },
              { label: '기타',     key: 'other',  color: '#f59e0b' },
            ].map(({ label, key, color }) => (
              <div key={key} className="an-ref-row">
                <div className="an-ref-label">
                  <span className="an-ref-dot" style={{ background: color }}/>
                  {label}
                </div>
                <div className="an-ref-bar-wrap">
                  <div className="an-ref-bar" style={{ width: refPct(refBreakdown[key]) + '%', background: color }}/>
                </div>
                <span className="an-ref-val">{refBreakdown[key]}</span>
                <span className="an-ref-pct">({refPct(refBreakdown[key])}%)</span>
              </div>
            ))}
          </div>
        ) : <p className="an-empty">데이터가 없습니다.</p>}
      </div>

      {/* 주요 지표 */}
      <div className="an-card">
        <h3 className="an-card-title">주요 지표</h3>
        {userStats ? (
          <div className="an-kpi-list">
            <div className="an-kpi-row">
              <span>전체 가입 신청</span>
              <strong>{userStats.total}</strong>
            </div>
            <div className="an-kpi-row">
              <span>승인 대기</span>
              <strong className="an-kpi-pending">{userStats.pending}</strong>
            </div>
            <div className="an-kpi-row">
              <span>승인 완료</span>
              <strong className="an-kpi-ok">{userStats.approved}</strong>
            </div>
          </div>
        ) : <p className="an-empty">데이터가 없습니다.</p>}
      </div>
    </div>
  );
};

// AdminFactoriesTab — 제조사 관리 (서버사이드 페이지네이션 + 검색 + 편집)
const AdminFactoriesTab = ({ onOpenFactory }) => {
  const PAGE_SIZE = 50;
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [filterVisible, setFilterVisible] = useState('all'); // all|public|private
  const [filterWebsite, setFilterWebsite] = useState('all'); // all|yes|no
  const [filterContact, setFilterContact] = useState('all'); // all|yes|no
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => { setPage(1); }, [debouncedQ, filterVisible, filterWebsite, filterContact]);

  useEffect(() => {
    if (!window._sb) return;
    let mounted = true;
    setLoading(true);
    let sq = window._sb.from('factories').select('*', { count: 'exact' });
    if (debouncedQ) sq = sq.or(`name.ilike.%${debouncedQ}%,city.ilike.%${debouncedQ}%`);
    if (filterVisible === 'public')  sq = sq.eq('hidden', false);
    if (filterVisible === 'private') sq = sq.eq('hidden', true);
    if (filterWebsite === 'yes') sq = sq.not('website', 'is', null);
    if (filterWebsite === 'no')  sq = sq.is('website', null);
    if (filterContact === 'yes') sq = sq.not('phone', 'is', null);
    if (filterContact === 'no')  sq = sq.is('phone', null);
    const from = (page - 1) * PAGE_SIZE;
    sq.order('id', { ascending: true }).range(from, from + PAGE_SIZE - 1)
      .then(({ data, count, error }) => {
        if (!mounted) return;
        if (!error) { setRows(data || []); setTotalCount(count); }
        setLoading(false);
      }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [page, debouncedQ, filterVisible, filterWebsite, filterContact]);

  const openEdit = (row) => {
    setEditTarget(row);
    setEditDraft({
      name:      row.name || '',
      summary:   row.summary || '',
      region:    row.region || '',
      city:      row.city || '',
      phone:     row.phone || '',
      website:   row.website || '',
      employees: row.employees ?? '',
      founded:   row.founded ?? '',
      hidden:    !!row.hidden,
    });
  };

  const saveEdit = async () => {
    if (!editTarget || saving) return;
    setSaving(true);
    const updates = {
      name:      editDraft.name.trim(),
      summary:   editDraft.summary.trim(),
      region:    editDraft.region.trim(),
      city:      editDraft.city.trim(),
      phone:     editDraft.phone.trim() || null,
      website:   editDraft.website.trim() || null,
      employees: editDraft.employees === '' ? null : Number(editDraft.employees),
      founded:   editDraft.founded === '' ? null : Number(editDraft.founded),
      hidden:    editDraft.hidden,
    };
    const { error } = await window._sb.from('factories').update(updates).eq('id', editTarget.id);
    setSaving(false);
    if (error) { alert('저장 실패: ' + error.message); return; }
    setRows(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...updates } : r));
    setEditTarget(null);
  };

  const pageCount = totalCount != null ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const EDIT_FIELDS = [
    { key: 'name',      label: '회사명',     type: 'text'   },
    { key: 'city',      label: '도시/주소',   type: 'text'   },
    { key: 'region',    label: '지역 (DB값)', type: 'text'   },
    { key: 'phone',     label: '연락처',      type: 'text'   },
    { key: 'website',   label: '웹사이트',    type: 'text'   },
    { key: 'employees', label: '임직원 수',   type: 'number' },
    { key: 'founded',   label: '설립연도',    type: 'number' },
  ];

  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Icon name="search" size={14} stroke={2}/>
          <input placeholder="제조사명, 도시로 검색" value={q} onChange={e => setQ(e.target.value)}/>
          {q && <button className="ls-clear" onClick={() => setQ('')}><Icon name="close" size={12} stroke={2}/></button>}
        </div>
        <div className="admin-segmented">
          {[{id:'all',label:'전체'},{id:'public',label:'공개'},{id:'private',label:'비공개'}].map(s => (
            <button key={s.id} className={'seg-btn '+(filterVisible===s.id?'is-active':'')} onClick={() => setFilterVisible(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="admin-segmented">
          {[{id:'all',label:'웹사이트'},{id:'yes',label:'있음'},{id:'no',label:'없음'}].map(s => (
            <button key={s.id} className={'seg-btn '+(filterWebsite===s.id?'is-active':'')} onClick={() => setFilterWebsite(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="admin-segmented">
          {[{id:'all',label:'연락처'},{id:'yes',label:'있음'},{id:'no',label:'없음'}].map(s => (
            <button key={s.id} className={'seg-btn '+(filterContact===s.id?'is-active':'')} onClick={() => setFilterContact(s.id)}>{s.label}</button>
          ))}
        </div>
        <span className="admin-toolbar-count">{loading ? '…' : (totalCount ?? 0).toLocaleString()}곳</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>제조사명</th>
              <th>도시</th>
              <th>연락처</th>
              <th>웹사이트</th>
              <th>공개</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr><td colSpan="6" className="admin-table-empty">로딩 중…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="6" className="admin-table-empty">검색 결과가 없습니다</td></tr>
            ) : rows.map(f => (
              <tr key={f.id}>
                <td>
                  <div className="admin-name">
                    <div className="admin-name-dot"/>
                    <strong>{f.name}</strong>
                    <span className="mono">#{String(f.id).slice(0, 12)}</span>
                  </div>
                </td>
                <td>{f.city || '—'}</td>
                <td>{f.phone || '—'}</td>
                <td>
                  {f.website
                    ? <span className="admin-link-cell" title={f.website}>{f.website.replace(/^https?:\/\//, '').slice(0, 28)}</span>
                    : '—'}
                </td>
                <td>
                  <span className={'admin-visible-badge ' + (f.hidden ? 'is-hidden' : 'is-public')}>
                    {f.hidden ? '비공개' : '공개'}
                  </span>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <button className="link-btn" onClick={() => openEdit(f)}>수정</button>
                    <button className="link-btn" onClick={() => onOpenFactory && onOpenFactory(f.id)}>보기</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="admin-pagination">
          <button className="pg-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {(() => {
            const start = Math.max(1, Math.min(page - 3, pageCount - 6));
            const end = Math.min(pageCount, start + 6);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(n => (
              <button key={n} className={'pg-num ' + (page === n ? 'is-active' : '')} onClick={() => setPage(n)}>{n}</button>
            ));
          })()}
          <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === pageCount}>›</button>
          <button className="pg-btn" onClick={() => setPage(pageCount)} disabled={page === pageCount}>»</button>
          <span className="admin-page-info">{page.toLocaleString()} / {pageCount.toLocaleString()} 페이지</span>
        </div>
      )}

      {editTarget && (
        <div className="admin-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>제조사 편집</h3>
              <button className="admin-modal-close" onClick={() => setEditTarget(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              {EDIT_FIELDS.map(({ key, label, type }) => (
                <div key={key} className="admin-form-row">
                  <label className="admin-form-label">{label}</label>
                  <input
                    className="admin-form-input"
                    type={type}
                    value={editDraft[key]}
                    onChange={e => setEditDraft(d => ({ ...d, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="admin-form-row">
                <label className="admin-form-label">한줄 소개</label>
                <textarea
                  className="admin-form-input"
                  rows={3}
                  value={editDraft.summary}
                  onChange={e => setEditDraft(d => ({ ...d, summary: e.target.value }))}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-form-label">공개 여부</label>
                <label className="admin-form-check">
                  <input
                    type="checkbox"
                    checked={!editDraft.hidden}
                    onChange={e => setEditDraft(d => ({ ...d, hidden: !e.target.checked }))}
                  />
                  <span>공개 (체크 해제 시 비공개)</span>
                </label>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditTarget(null)}>취소</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                {saving ? '저장 중…' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// AdminPage — 운영자 대시보드
// ──────────────────────────────────────────────────────────
const AdminPage = ({ onOpenFactory }) => {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; } catch { return false; }
  });
  const [totalCount, setTotalCount] = useState(null);
  const [tab, setTab] = useState('factories');

  useEffect(() => {
    if (!window._sb) return;
    window._sb.from('factories').select('*', { count: 'estimated', head: true })
      .then(({ count }) => { if (count != null) setTotalCount(count); });
  }, []);
  const [showUpload, setShowUpload] = useState(false);

  // Upload flow phases: idle → mapping → preview → uploading → result
  const [uploadPhase, setUploadPhase] = useState('idle');
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawLines, setRawLines] = useState([]);
  const [colMap, setColMap] = useState({});
  const [parsedRows, setParsedRows] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = React.useRef(null);

  const MAPPING_FIELDS = [
    { field: 'id_src',     label: 'ID 번호', required: false },
    { field: 'name',       label: '회사명',   required: true  },
    { field: 'city',       label: '주소',     required: false },
    { field: 'products',   label: '생산품',   required: false },
    { field: 'summary',    label: '단지명',   required: false },
    { field: 'industries', label: '업종명',   required: false },
  ];
  const FIELD_KEYWORDS = {
    name:       ['회사명', '사업체명', '업체명', '공장명', '상호', '법인명', '회사', '기업명', '업체', '사업자명', '공장', '업체'],
    city:       ['공장주소', '주소', '본사소재지', '소재지', '주소지', '사업장주소', '도로명주소', '지번주소', '위치', '공장대표주소', '사업장소재지', 'address'],
    products:   ['생산품', '주생산품', '제품', '생산제품', '품목', '주요생산품', '생산물', '취급품목', '주력제품', '생산품목'],
    id_src:     ['연번', '순번', '번호', 'id', 'no', '일련번호'],
    summary:    ['단지명', '산업단지명', '단지', '지구', '구역', '입주단지'],
    industries: ['업종명', '업종', '업태', '산업분류', '업종코드', '주업종', '제조업종'],
  };
  const autoMap = (headers) => {
    const result = { name: -1, city: -1, products: -1, id_src: -1, summary: -1, industries: -1 };
    headers.forEach((h, i) => {
      const norm = h.replace(/[\s\(\)\/·\-_]/g, '').toLowerCase();
      for (const [field, kws] of Object.entries(FIELD_KEYWORDS)) {
        if (result[field] === -1 && kws.some(kw => norm.includes(kw.toLowerCase()))) result[field] = i;
      }
    });
    return result;
  };

  const resetUpload = () => {
    setUploadPhase('idle');
    setRawHeaders([]);
    setRawLines([]);
    setColMap({});
    setParsedRows([]);
    setParseErrors([]);
    setUploadProgress({ done: 0, total: 0 });
    setUploadResult(null);
  };
  const closeUpload = () => { setShowUpload(false); resetUpload(); };

  const downloadTemplate = () => {
    const hdr = 'id,name,en,city,region,coord_x,coord_y,industries,processes,products,materials,moq,moq_unit,lead_days,price_range,employees,founded,certs,oem,odm,export,rating,reviews,response_hr,deals,summary,image';
    const ex  = 'f_ex1,예시정밀,Example Precision,경기 안산시,gyeonggi,38,32,machine,cnc;cutting,auto;machine_parts,알루미늄;SUS304,100,피스,14,₩2500~₩18000,42,2008,ISO 9001;IATF 16949,true,true,false,4.5,80,3,200,자동차 정밀부품 전문입니다.,#a8b4c8';
    const blob = new Blob([hdr + '\n' + ex], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'factories_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Step 1: Read file → detect headers → show mapping phase
  const parseFileHeaders = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { alert('.csv 파일만 업로드할 수 있습니다.'); return; }
    resetUpload();
    try {
      const text = await readFileText(file);
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) throw new Error('데이터 행이 없습니다. 헤더 외에 최소 1행이 필요합니다.');
      const headers = parseCSVLine(lines[0]).map(h => h.replace(/^﻿/, '').trim());
      const dataLines = lines.slice(1).map(l => parseCSVLine(l));
      setRawHeaders(headers);
      setRawLines(dataLines);
      setColMap(autoMap(headers));
      setUploadPhase('mapping');
    } catch (e) {
      alert('파싱 오류: ' + e.message);
    }
  };

  // Step 2: Apply column mapping → generate parsedRows → show preview
  const applyMapping = () => {
    const get = (vals, idx) => (idx >= 0 && idx < vals.length ? (vals[idx] || '').trim() : '');
    const ts = Date.now();
    const rows = [], errors = [];
    rawLines.forEach((vals, i) => {
      const name = get(vals, colMap.name);
      if (!name) { errors.push({ rowNum: i + 2, msg: '회사명 없음' }); return; }
      const seqRaw = get(vals, colMap.id_src);
      const id = seqRaw || ('upload_' + ts + '_' + (i + 1));
      const city = get(vals, colMap.city);
      rows.push({
        id,
        name,
        en:          '',
        city,
        region:      extractRegion(city),
        coord_x:     50,
        coord_y:     50,
        industries:  get(vals, colMap.industries).split(/[,;／、]/).map(s => s.trim()).filter(Boolean),
        processes:   [],
        products:    get(vals, colMap.products).split(/[,;／、]/).map(s => s.trim()).filter(Boolean),
        materials:   [],
        moq:         1,
        moq_unit:    '협의',
        lead_days:   0,
        price_range: '',
        employees:   0,
        founded:     0,
        certs:       [],
        oem:         false,
        odm:         false,
        export:      false,
        rating:      0,
        reviews:     0,
        response_hr: 24,
        deals:       0,
        hidden:      false,
        summary:     get(vals, colMap.summary),
        image:       '#a8b4c8',
      });
    });
    setParsedRows(rows);
    setParseErrors(errors);
    setUploadPhase('preview');
  };

  // Step 3: 1000-row batch upsert
  const confirmUpload = async () => {
    if (!window._sb) { alert('Supabase 연결이 없습니다.'); return; }
    setUploadPhase('uploading');
    const BATCH = 1000;
    let ok = 0, fail = 0;
    const failedRows = [];
    setUploadProgress({ done: 0, total: parsedRows.length });
    for (let i = 0; i < parsedRows.length; i += BATCH) {
      const chunk = parsedRows.slice(i, i + BATCH);
      const { error } = await window._sb.from('factories').upsert(chunk, { onConflict: 'id' });
      if (!error) {
        ok += chunk.length;
      } else {
        fail += chunk.length;
        failedRows.push({ id: `${i+1}~${Math.min(i+BATCH,parsedRows.length)}행`, name: '', msg: error.message });
      }
      setUploadProgress({ done: Math.min(i + BATCH, parsedRows.length), total: parsedRows.length });
      await new Promise(r => setTimeout(r, 0));
    }
    setUploadResult({ ok, fail, failedRows });
    setUploadPhase('result');
    try {
      const { count } = await window._sb.from('factories').select('*', { count: 'estimated', head: true });
      if (count != null) setTotalCount(count);
    } catch (_) {}
  };

  const stats = {
    total: totalCount ?? 0,
    rfq: 248, chat: 89, users: 1342,
  };

  const PREVIEW_COLS = [
    { key: 'id',       label: 'ID' },
    { key: 'name',     label: '회사명' },
    { key: 'city',     label: '주소', render: v => v ? v.slice(0, 22) + (v.length > 22 ? '…' : '') : '—' },
    { key: 'products', label: '생산품', render: v => (v || []).slice(0, 3).join(', ') || '—' },
    { key: 'summary',  label: '단지명' },
  ];

  // 비밀번호 게이트 — 모든 훅 선언 이후에 위치
  if (!authed) return <AdminPasswordGate onAuth={() => setAuthed(true)}/>;

  const handleLogout = () => {
    try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch {}
    setAuthed(false);
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
          <p>CSV로 일괄 업로드하고, 검증 완료된 제조사만 공개로 전환하세요.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="btn btn-secondary" onClick={handleLogout}>
            <Icon name="lock" size={14} stroke={2}/>
            로그아웃
          </button>
          <button className="btn btn-secondary" onClick={downloadTemplate}>
            <Icon name="arrow_up_right" size={14} stroke={2}/>
            템플릿 다운로드
          </button>
          <button className="btn btn-primary" onClick={() => { resetUpload(); setShowUpload(true); }}>
            <Icon name="upload" size={14} stroke={2}/>
            CSV 업로드
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <div className="astat"><div className="astat-k">전체 제조사</div><div className="astat-v">{stats.total}</div></div>
        <div className="astat"><div className="astat-k">전체 사용자</div><div className="astat-v">{stats.users.toLocaleString()}</div></div>
        <div className="astat"><div className="astat-k">RFQ (이번달)</div><div className="astat-v">{stats.rfq}</div></div>
        <div className="astat"><div className="astat-k">활성 채팅</div><div className="astat-v">{stats.chat}</div></div>
      </section>

      <nav className="admin-tabs">
        {[
          { id: 'factories', label: '제조사 관리' },
          { id: 'users',     label: '사용자' },
          { id: 'rfq',       label: 'RFQ 모니터링' },
          { id: 'logs',      label: '업로드 이력' },
          { id: 'reports',   label: '신고 관리' },
          { id: 'signups',   label: '가입 신청' },
          { id: 'analytics', label: '통계' },
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

      {tab === 'factories' && <AdminFactoriesTab onOpenFactory={onOpenFactory}/>}

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
                <tr><th>일시</th><th>파일명</th><th>전체</th><th>성공</th><th>실패</th><th>결과</th></tr>
              </thead>
              <tbody>
                <tr><td className="mono">2025-01-06 14:23</td><td>factories_2025_01.csv</td><td>184</td><td>179</td><td>5</td><td><span className="status-pill status-진행중">검증중</span></td></tr>
                <tr><td className="mono">2024-12-28 09:14</td><td>factories_dec.csv</td><td>241</td><td>241</td><td>0</td><td><span className="status-pill status-완료">완료</span></td></tr>
                <tr><td className="mono">2024-12-15 16:42</td><td>cnc_extra.csv</td><td>72</td><td>72</td><td>0</td><td><span className="status-pill status-완료">완료</span></td></tr>
                <tr><td className="mono">2024-11-29 11:08</td><td>busan_factories.csv</td><td>56</td><td>54</td><td>2</td><td><span className="status-pill status-완료">완료</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'reports' && (
        <section className="admin-panel">
          <AdminReportsTab />
        </section>
      )}

      {tab === 'signups' && (
        <section className="admin-panel">
          <AdminSignupTab />
        </section>
      )}

      {tab === 'analytics' && (
        <section className="admin-panel">
          <AdminAnalyticsTab />
        </section>
      )}

      {/* ── CSV 업로드 모달 ── */}
      {showUpload && (
        <div className="modal-veil" onClick={closeUpload}>
          <div className="modal-card upload-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h3>
                {uploadPhase === 'idle'      && 'CSV 일괄 업로드'}
                {uploadPhase === 'mapping'   && `컬럼 매핑 · ${rawHeaders.length}개 감지`}
                {uploadPhase === 'preview'   && `미리보기 · ${parsedRows.length.toLocaleString()}행`}
                {uploadPhase === 'uploading' && '업로드 중…'}
                {uploadPhase === 'result'    && '업로드 완료'}
              </h3>
              <button className="modal-close" onClick={closeUpload}>
                <Icon name="close" size={16} stroke={2}/>
              </button>
            </header>

            {/* Phase: idle — drop zone */}
            {uploadPhase === 'idle' && (
              <>
                <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files[0]; if (f) parseFileHeaders(f); e.target.value = ''; }}
                />
                <div
                  className={'upload-drop' + (dragOver ? ' is-drag' : '')}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) parseFileHeaders(f); }}
                >
                  <Icon name="upload" size={32} stroke={1.4}/>
                  <strong>CSV 파일을 끌어다 놓으세요</strong>
                  <span>.csv · UTF-8 / EUC-KR · 컬럼명 자동 인식</span>
                  <button className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
                    <Icon name="plus" size={12} stroke={2.2}/>
                    파일 선택
                  </button>
                </div>
                <div className="upload-template">
                  <Icon name="info" size={13} stroke={2}/>
                  <div>
                    <strong>어떤 CSV든 OK</strong>
                    <span>컬럼명을 자동 분석해 매핑합니다. 공공데이터·자체 양식 모두 지원.</span>
                  </div>
                  <button className="link-btn" onClick={downloadTemplate}>기본 템플릿</button>
                </div>
              </>
            )}

            {/* Phase: mapping — review/adjust column mapping */}
            {uploadPhase === 'mapping' && (
              <>
                <div className="mapping-info">
                  <Icon name="layers" size={14} stroke={2}/>
                  <span><strong>{rawHeaders.length}개 컬럼</strong> 감지 · <strong>{rawLines.length.toLocaleString()}행</strong></span>
                </div>
                <div className="mapping-table">
                  {MAPPING_FIELDS.map(({ field, label, required }) => {
                    const idx = colMap[field] ?? -1;
                    return (
                      <div key={field} className={`mapping-row ${idx >= 0 ? 'is-matched' : 'is-unmatched'}`}>
                        <div className="mapping-target">
                          {label}
                          {required && <span className="mapping-required">필수</span>}
                        </div>
                        <div className="mapping-status">
                          {idx >= 0
                            ? <><Icon name="check" size={12} stroke={2.4}/><span className="mapping-col-name">{rawHeaders[idx]}</span></>
                            : <><Icon name="info"  size={12} stroke={2}/> <span className="mapping-col-none">미감지</span></>
                          }
                        </div>
                        <select
                          className="mapping-select"
                          value={idx >= 0 ? idx : ''}
                          onChange={(e) => setColMap(m => ({ ...m, [field]: e.target.value === '' ? -1 : parseInt(e.target.value) }))}
                        >
                          <option value="">— 매핑 안 함 —</option>
                          {rawHeaders.map((h, i) => <option key={i} value={i}>{h}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>
                {(colMap.name ?? -1) < 0 && (
                  <div className="mapping-warn">
                    <Icon name="info" size={13} stroke={2}/> 회사명 컬럼을 반드시 지정해주세요.
                  </div>
                )}
                <footer className="modal-foot">
                  <button className="btn btn-secondary" onClick={resetUpload}>다시 선택</button>
                  <button className="btn btn-primary" onClick={applyMapping} disabled={(colMap.name ?? -1) < 0}>
                    <Icon name="check" size={13} stroke={2.2}/>
                    매핑 확인 · 미리보기
                  </button>
                </footer>
              </>
            )}

            {/* Phase: preview — table of first 10 rows */}
            {uploadPhase === 'preview' && (
              <>
                <div className="upload-preview-summary">
                  <div className="upload-preview-stat upload-stat-ok">
                    <Icon name="check" size={14} stroke={2.4}/>
                    유효 <strong>{parsedRows.length}행</strong>
                  </div>
                  {parseErrors.length > 0 && (
                    <div className="upload-preview-stat upload-stat-fail">
                      <Icon name="info" size={14} stroke={2}/>
                      건너뜀 <strong>{parseErrors.length}행</strong>
                    </div>
                  )}
                  <span className="upload-preview-hint">처음 10행 미리보기</span>
                </div>

                <div className="admin-table-wrap upload-preview-table">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        {PREVIEW_COLS.map(c => <th key={c.key}>{c.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          {PREVIEW_COLS.map(c => (
                            <td key={c.key} className={c.key === 'id' ? 'mono' : ''}>
                              {c.render ? c.render(row[c.key]) : (row[c.key] ?? '—')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedRows.length > 10 && (
                    <div className="upload-preview-more">… 외 {parsedRows.length - 10}행</div>
                  )}
                </div>

                {parseErrors.length > 0 && (
                  <div className="upload-parse-errors">
                    <strong>건너뛴 행 ({parseErrors.length}개)</strong>
                    <ul>
                      {parseErrors.slice(0, 5).map((e, i) => (
                        <li key={i}>{e.rowNum}행 · id:{e.id} · {e.msg}</li>
                      ))}
                      {parseErrors.length > 5 && <li>… 외 {parseErrors.length - 5}건</li>}
                    </ul>
                  </div>
                )}

                <footer className="modal-foot">
                  <button className="btn btn-secondary" onClick={() => setUploadPhase('mapping')}>다시 선택</button>
                  <button className="btn btn-primary" onClick={confirmUpload} disabled={parsedRows.length === 0}>
                    <Icon name="upload" size={13} stroke={2.2}/>
                    {parsedRows.length.toLocaleString()}개 업로드 시작
                  </button>
                </footer>
              </>
            )}

            {/* Phase: uploading — progress bar */}
            {uploadPhase === 'uploading' && (
              <div className="upload-progress-wrap">
                <div className="upload-spinner"/>
                <strong>Supabase에 저장하는 중…</strong>
                <div className="upload-progress-bar-wrap">
                  <div
                    className="upload-progress-bar-fill"
                    style={{ width: uploadProgress.total > 0 ? `${Math.round(uploadProgress.done / uploadProgress.total * 100)}%` : '0%' }}
                  />
                </div>
                <span className="upload-progress-label">
                  {uploadProgress.done.toLocaleString()} / {uploadProgress.total.toLocaleString()} 처리 중…
                  {uploadProgress.total > 0 && ` (${Math.round(uploadProgress.done / uploadProgress.total * 100)}%)`}
                </span>
              </div>
            )}

            {/* Phase: result — success/fail counts */}
            {uploadPhase === 'result' && uploadResult && (
              <>
                <div className="upload-result-summary">
                  <div className="upload-result-stat upload-stat-ok">
                    <Icon name="check" size={20} stroke={2.4}/>
                    <span className="upload-result-n">{uploadResult.ok}</span>
                    <span className="upload-result-label">성공</span>
                  </div>
                  {uploadResult.fail > 0 && (
                    <div className="upload-result-stat upload-stat-fail">
                      <Icon name="info" size={20} stroke={1.8}/>
                      <span className="upload-result-n">{uploadResult.fail}</span>
                      <span className="upload-result-label">실패</span>
                    </div>
                  )}
                </div>

                {uploadResult.failedRows.length > 0 && (
                  <div className="upload-parse-errors">
                    <strong>실패한 행</strong>
                    <ul>
                      {uploadResult.failedRows.slice(0, 8).map((e, i) => (
                        <li key={i}>id:{e.id} · {e.name || '이름없음'} · {e.msg}</li>
                      ))}
                      {uploadResult.failedRows.length > 8 && <li>… 외 {uploadResult.failedRows.length - 8}건</li>}
                    </ul>
                  </div>
                )}

                <footer className="modal-foot">
                  <button className="btn btn-secondary" onClick={resetUpload}>
                    <Icon name="upload" size={13} stroke={2}/>
                    다른 파일 업로드
                  </button>
                  <button className="btn btn-primary" onClick={closeUpload}>닫기</button>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
Object.assign(window, { ChatPage, MyPage, AdminPage, AdminReportsTab, AdminSignupTab });


// ──────────────────────────────────────────────────────────
// TermsPage — 이용약관
// ──────────────────────────────────────────────────────────
const TermsPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-page-container">
        <h1 className="legal-page-title">이용약관</h1>
        <p className="legal-page-meta">
          시행일: 2026년 5월 6일<br/>
          최종 수정일: 2026년 5월 6일
        </p>

        <section className="legal-section">
          <h2>제1조 (목적)</h2>
          <p>
            본 약관은 주식회사 올뷰코리아(이하 "회사")가 제공하는 공장매칭(FactoryMatch, 이하 "서비스")의
            이용 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="legal-section">
          <h2>제2조 (정의)</h2>
          <ol>
            <li>"서비스"란 회사가 제공하는 공장매칭(FactoryMatch) 웹사이트 및 관련 부가 서비스 일체를 말합니다.</li>
            <li>"이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>"제조업체 정보"란 공공데이터포털 등 공개된 정보를 기반으로 본 서비스에 등록된 국내 제조업체의 사업자 정보를 말합니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제3조 (서비스의 목적 및 내용)</h2>
          <p>본 서비스는 다음 목적을 위해 운영됩니다:</p>
          <ol>
            <li>국내 제조업체와 발주 기업 간 B2B 거래 매칭</li>
            <li>제조업체 정보 검색 및 비교 서비스 제공</li>
            <li>견적 요청(RFQ) 및 거래 연결 지원</li>
            <li>거래 신뢰도 검증을 위한 사업자 정보 제공</li>
          </ol>
          <p>회사는 위 목적 외 본 서비스에서 제공되는 정보를 마케팅 등 다른 목적으로 사용하는 것을 금지합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제4조 (약관의 효력 및 변경)</h2>
          <ol>
            <li>본 약관은 서비스를 이용하는 모든 이용자에게 그 효력이 발생합니다.</li>
            <li>이용자가 본 서비스를 이용하는 행위는 본 약관에 동의한 것으로 간주됩니다.</li>
            <li>회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 효력이 발생합니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제5조 (제조업체 정보의 출처 및 활용)</h2>
          <ol>
            <li>본 서비스에 등록된 제조업체 정보는 다음의 공개 데이터를 기반으로 합니다:
              <ul>
                <li>공공데이터포털(data.go.kr)에 공개된 공장 등록 정보</li>
                <li>국세청 사업자등록정보 진위확인 및 상태조회 서비스</li>
                <li>금융위원회 기업 기본정보 및 재무정보</li>
                <li>각 지방자치단체가 공개한 공장 정보</li>
              </ul>
            </li>
            <li>본 서비스의 정보는 거래 신뢰도 검증을 위한 참고 자료이며, 법적 효력이 있는 증빙 자료가 아닙니다.</li>
            <li>회사는 정보의 정확성을 위해 정기적으로 데이터를 갱신하나, 실시간 정확성을 보장하지 않습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제6조 (이용자의 의무)</h2>
          <ol>
            <li>이용자는 본 서비스에서 제공받은 정보를 다음 목적으로만 사용해야 합니다:
              <ul>
                <li>B2B 제조 거래 검토 및 진행</li>
                <li>거래 상대방의 신뢰도 검증</li>
              </ul>
            </li>
            <li>이용자는 본 서비스에서 얻은 정보를 다음 행위에 사용해서는 안 됩니다:
              <ul>
                <li>무단 마케팅, 광고성 메시지 발송, 스팸 행위</li>
                <li>제3자에게 정보를 무단 제공, 판매, 재배포</li>
                <li>법령 또는 공서양속에 위반되는 행위</li>
                <li>회사 또는 제3자의 권리를 침해하는 행위</li>
              </ul>
            </li>
            <li>위 의무를 위반한 이용자는 그로 인해 발생한 모든 법적 책임을 부담하며, 회사는 해당 이용자의 서비스 이용을 제한할 수 있습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제7조 (정보의 정정·삭제 요청)</h2>
          <ol>
            <li>제조업체 정보의 정정 또는 삭제를 원하는 경우, 다음 방법으로 요청할 수 있습니다:
              <ul>
                <li>사이트 내 신고 폼: [정정·삭제 요청] (서비스 내 별도 페이지)</li>
                <li>이메일: privacy@avk-agency.com</li>
              </ul>
            </li>
            <li>회사는 요청을 접수한 후 영업일 기준 5일 이내에 검토 및 처리합니다.</li>
            <li>다음의 경우 정정·삭제 요청이 거부될 수 있습니다:
              <ul>
                <li>법령에서 공개를 의무화한 정보</li>
                <li>이미 공공데이터로 공개된 정보 (이 경우 원본 출처에 정정 요청 안내)</li>
                <li>요청자가 정보 주체임을 증명하지 못하는 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제8조 (서비스의 제공 및 중단)</h2>
          <ol>
            <li>회사는 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 합니다.</li>
            <li>다음의 경우 사전 공지 없이 서비스가 일시 중단될 수 있습니다:
              <ul>
                <li>시스템 점검, 보수, 교체</li>
                <li>천재지변, 정전, 통신 장애 등 불가항력적 사유</li>
                <li>회사가 합리적으로 판단한 사정상 서비스 제공이 불가능한 경우</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제9조 (책임의 제한)</h2>
          <ol>
            <li>회사는 본 서비스를 통해 제공되는 정보의 정확성, 완전성에 대해 합리적인 노력을 다하나, 정보의 절대적 정확성을 보장하지 않습니다.</li>
            <li>이용자가 본 서비스의 정보를 신뢰하여 발생한 손해에 대해 회사는 다음의 경우 책임을 지지 않습니다:
              <ul>
                <li>공공데이터의 원본 자체에 오류가 있는 경우</li>
                <li>이용자가 정보를 본 약관의 목적 외로 사용하여 발생한 손해</li>
                <li>거래 당사자 간 분쟁에 회사가 개입하지 않은 경우</li>
              </ul>
            </li>
            <li>본 서비스는 거래 매칭 플랫폼이며, 회사는 이용자 간 거래의 당사자가 아닙니다. 거래 결과에 대한 책임은 거래 당사자에게 있습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제10조 (지적재산권)</h2>
          <ol>
            <li>본 서비스의 디자인, 로고, 콘텐츠 구성, 매칭 알고리즘 등에 대한 저작권은 회사에 귀속됩니다.</li>
            <li>이용자는 회사의 사전 동의 없이 본 서비스의 콘텐츠를 복제, 배포, 상업적 이용할 수 없습니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제11조 (분쟁의 해결)</h2>
          <ol>
            <li>본 약관과 관련된 분쟁은 대한민국 법령을 적용합니다.</li>
            <li>본 서비스 이용으로 발생한 분쟁의 관할 법원은 회사 본사 소재지 관할 법원으로 합니다.</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제12조 (회사 정보)</h2>
          <ul className="legal-company-info">
            <li><strong>회사명:</strong> 주식회사 올뷰코리아 (AVK)</li>
            <li><strong>서비스명:</strong> 공장매칭(FactoryMatch)</li>
            <li><strong>대표 이메일:</strong> <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
            <li><strong>웹사이트:</strong> [본 서비스 URL]</li>
          </ul>
        </section>

        <p className="legal-page-footer">
          본 약관은 2026년 5월 6일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// PrivacyPage — 개인정보처리방침
// ──────────────────────────────────────────────────────────
const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-page-container">
        <h1 className="legal-page-title">개인정보처리방침</h1>
        <p className="legal-page-meta">
          시행일: 2026년 5월 6일<br/>
          최종 수정일: 2026년 5월 6일
        </p>

        <section className="legal-section">
          <h2>제1조 (총칙)</h2>
          <p>
            주식회사 올뷰코리아(이하 "회사")는 공장매칭(FactoryMatch, 이하 "서비스")을 운영함에 있어
            이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하기 위하여 노력하고 있습니다.
          </p>
          <p>
            본 개인정보처리방침은 회사가 제공하는 서비스 이용과 관련하여 이용자의 개인정보 처리에 관한 사항을 규정합니다.
          </p>
        </section>

        <section className="legal-section">
          <h2>제2조 (수집하는 개인정보의 항목 및 수집 방법)</h2>
          <p>회사는 다음 항목을 수집할 수 있습니다:</p>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>1. 자동 수집 항목</h3>
          <ul>
            <li>접속 IP 주소, 쿠키, 접속 일시, 서비스 이용 기록</li>
            <li>브라우저 종류, OS, 디바이스 정보</li>
          </ul>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>2. 견적 요청(RFQ) 시 수집 항목</h3>
          <ul>
            <li>필수: 회사명, 담당자명, 연락처(이메일 또는 전화번호), 요청 내용</li>
            <li>선택: 첨부 파일, 추가 요구사항</li>
          </ul>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>3. 신고·문의 시 수집 항목</h3>
          <ul>
            <li>필수: 회사명, 담당자명, 연락처, 신고 사유</li>
            <li>선택: 증빙 자료, 추가 의견</li>
          </ul>

          <h3 style={{fontSize: '15px', marginTop: '16px', marginBottom: '8px', fontWeight: '600'}}>4. 수집 방법</h3>
          <ul>
            <li>이용자가 서비스 화면에서 직접 입력</li>
            <li>이메일을 통한 수신</li>
            <li>접속 시 자동 생성되는 정보의 자동 수집</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제3조 (개인정보의 처리 목적)</h2>
          <p>회사는 수집한 개인정보를 다음 목적에만 사용합니다:</p>
          <ol>
            <li>견적 요청(RFQ) 처리 및 매칭 서비스 제공</li>
            <li>제조업체 정보의 정정·삭제 요청 처리</li>
            <li>이용자 문의 응대 및 고객 지원</li>
            <li>서비스 이용 통계 분석 및 품질 개선 (개인 식별 불가능한 형태)</li>
            <li>법령상 의무 이행</li>
          </ol>
          <p>회사는 위 목적 외 다른 목적으로 개인정보를 사용하지 않으며, 사용 목적이 변경될 경우 사전에 동의를 받습니다.</p>
        </section>

        <section className="legal-section">
          <h2>제4조 (개인정보의 보유 및 이용 기간)</h2>
          <p>회사는 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 경우 관련 법령에 따라 일정 기간 보관합니다:</p>
          <ul>
            <li><strong>견적 요청 기록:</strong> 처리 완료 후 3년 (전자상거래법)</li>
            <li><strong>이용자 문의·신고 기록:</strong> 처리 완료 후 3년 (전자상거래법)</li>
            <li><strong>접속 로그:</strong> 3개월 (통신비밀보호법)</li>
            <li><strong>부정 이용 기록:</strong> 1년</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제5조 (제조업체 정보의 출처 및 처리)</h2>
          <p>본 서비스에 표시되는 제조업체 정보는 다음 공개 데이터를 기반으로 합니다:</p>
          <ul>
            <li>공공데이터포털(data.go.kr)에 공개된 공장 등록 정보</li>
            <li>국세청 사업자등록정보 진위확인 및 상태조회 서비스</li>
            <li>금융위원회 기업 기본정보 및 재무정보</li>
            <li>각 지방자치단체가 공개한 공장 정보</li>
          </ul>
          <p>제조업체 정보는 「공공데이터의 제공 및 이용 활성화에 관한 법률」에 따라 공개된 정보이며, B2B 거래 매칭 및 신뢰도 검증 목적으로만 활용됩니다.</p>
          <p>회사는 다음과 같은 정보를 처리하지 않습니다:</p>
          <ul>
            <li>주민등록번호</li>
            <li>개인 휴대폰 번호 (법인 대표 연락처가 아닌 경우)</li>
            <li>대표자 개인 거주지 주소</li>
            <li>기타 개인 식별 가능한 민감 정보</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제6조 (개인정보의 제3자 제공)</h2>
          <p>회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다:</p>
          <ol>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의해 제공이 의무화된 경우</li>
            <li>견적 요청 시 이용자가 선택한 제조업체에 한하여 견적 처리에 필요한 최소한의 정보 제공</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제7조 (개인정보 처리의 위탁)</h2>
          <p>회사는 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁할 수 있습니다:</p>
          <ul className="legal-company-info">
            <li><strong>Resend (resend.com):</strong> 이메일 발송 서비스</li>
            <li><strong>Supabase:</strong> 데이터베이스 운영 및 호스팅</li>
            <li><strong>Netlify:</strong> 웹사이트 호스팅 및 서버리스 함수 실행</li>
            <li><strong>Anthropic (anthropic.com):</strong> AI 매칭 분석 서비스</li>
          </ul>
          <p>회사는 위탁 계약 시 개인정보 보호와 관련된 의무를 명시하고, 위탁 업무를 안전하게 관리하기 위해 필요한 사항을 규정합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제8조 (이용자의 권리와 행사 방법)</h2>
          <p>이용자는 다음 권리를 행사할 수 있습니다:</p>
          <ol>
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정·삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
            <li>개인정보 처리에 대한 동의 철회</li>
          </ol>
          <p>위 권리 행사는 다음 방법으로 가능합니다:</p>
          <ul>
            <li>사이트 내 정정·삭제 요청 폼 (서비스 내 별도 페이지)</li>
            <li>이메일: <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
          </ul>
          <p>회사는 요청 접수 후 영업일 기준 5일 이내에 처리합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제9조 (제조업체 정보 정정·삭제 요청)</h2>
          <p>본 서비스에 게시된 제조업체 정보의 정정 또는 삭제를 원하는 경우 다음 방법으로 요청할 수 있습니다:</p>
          <ol>
            <li>사이트 내 신고 폼: 별도 페이지에서 신청</li>
            <li>이메일: <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
          </ol>
          <p>요청 시 다음 정보를 포함해주세요:</p>
          <ul>
            <li>회사명 및 사업자등록번호</li>
            <li>요청 사유 (예: 정보 오류, 폐업, 정보 비공개 요청 등)</li>
            <li>요청자 정보 및 권한 증빙 (해당 회사 관계자 확인용)</li>
          </ul>
          <p>회사는 요청 접수 후 영업일 기준 5일 이내 검토하여 처리합니다.</p>
        </section>

        <section className="legal-section">
          <h2>제10조 (개인정보의 안전성 확보 조치)</h2>
          <p>회사는 개인정보 보호를 위해 다음 조치를 시행합니다:</p>
          <ol>
            <li><strong>관리적 조치:</strong> 개인정보 보호 책임자 지정, 정기적인 보안 교육</li>
            <li><strong>기술적 조치:</strong> HTTPS 암호화 통신, 데이터베이스 접근 권한 관리</li>
            <li><strong>물리적 조치:</strong> 위탁 서비스 제공자(Supabase, Netlify 등)의 보안 인증 확인</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>제11조 (쿠키의 운영)</h2>
          <p>회사는 서비스 제공을 위해 쿠키(Cookie)를 사용할 수 있습니다.</p>
          <ul>
            <li><strong>사용 목적:</strong> 이용자의 검색 기록 유지, 서비스 이용 분석</li>
            <li><strong>거부 방법:</strong> 브라우저 설정에서 쿠키 저장 거부 가능 (단, 일부 기능 이용 제한 가능)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제12조 (개인정보 보호 책임자)</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 관련 불만 처리 및 피해 구제를 위해 다음과 같이 책임자를 지정합니다:</p>
          <ul className="legal-company-info">
            <li><strong>회사명:</strong> 주식회사 올뷰코리아</li>
            <li><strong>책임자:</strong> 개인정보 보호 담당자</li>
            <li><strong>이메일:</strong> <a href="mailto:privacy@avk-agency.com">privacy@avk-agency.com</a></li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제13조 (개인정보 침해 신고)</h2>
          <p>개인정보 침해에 대한 신고나 상담이 필요한 경우 다음 기관에 문의할 수 있습니다:</p>
          <ul>
            <li><strong>개인정보보호 종합지원 포털:</strong> privacy.go.kr / 국번없이 182</li>
            <li><strong>개인정보 분쟁조정위원회:</strong> kopico.go.kr / 1833-6972</li>
            <li><strong>대검찰청 사이버수사과:</strong> spo.go.kr / 02-3480-3573</li>
            <li><strong>경찰청 사이버수사국:</strong> ecrm.cyber.go.kr / 국번없이 182</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>제14조 (방침의 변경)</h2>
          <ol>
            <li>본 개인정보처리방침은 시행일로부터 적용됩니다.</li>
            <li>법령, 정책 또는 보안 기술의 변경에 따라 내용 추가·삭제·수정이 있을 시, 사이트 내 공지사항을 통해 사전에 알립니다.</li>
          </ol>
        </section>

        <p className="legal-page-footer">
          본 개인정보처리방침은 2026년 5월 6일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
};

// ReportPage — 정정·삭제 요청 / 신고 / 일반 문의
// ──────────────────────────────────────────────────────────
const ReportPage = ({ params, onNav }) => {
  const factoryId = params?.factoryId || '';
  const factoryName = params?.factoryName || '';
  const initialType = params?.type || (factoryId ? 'factory_issue' : 'general_inquiry');

  const [reportType, setReportType] = useStateP(initialType);
  const [targetFactoryName, setTargetFactoryName] = useStateP(factoryName);
  const [reporterCompany, setReporterCompany] = useStateP('');
  const [reporterBusinessNumber, setReporterBusinessNumber] = useStateP('');
  const [reporterName, setReporterName] = useStateP('');
  const [reporterEmail, setReporterEmail] = useStateP('');
  const [reporterPhone, setReporterPhone] = useStateP('');
  const [reason, setReason] = useStateP('');
  const [description, setDescription] = useStateP('');
  const [submitting, setSubmitting] = useStateP(false);
  const [submitted, setSubmitted] = useStateP(false);
  const [errorMsg, setErrorMsg] = useStateP('');

  const validate = () => {
    if (!reporterCompany.trim()) return '회사명을 입력해주세요.';
    if (!reporterName.trim()) return '담당자명을 입력해주세요.';
    if (!reporterEmail.trim()) return '이메일을 입력해주세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) return '올바른 이메일 형식이 아닙니다.';
    if (!reason.trim()) return '사유를 입력해주세요.';
    if ((reportType === 'factory_issue' || reportType === 'self_correction') && !targetFactoryName.trim()) {
      return '대상 공장명을 입력해주세요.';
    }
    return null;
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    const error = validate();
    if (error) { setErrorMsg(error); return; }
    setSubmitting(true);

    const payload = {
      report_type: reportType,
      target_factory_id: factoryId || null,
      target_factory_name: targetFactoryName || null,
      reporter_company: reporterCompany,
      reporter_business_number: reporterBusinessNumber || null,
      reporter_name: reporterName,
      reporter_email: reporterEmail,
      reporter_phone: reporterPhone || null,
      reason,
      description: description || null
    };

    try {
      if (window._sb) {
        const { error: dbError } = await window._sb.from('factory_reports').insert(payload);
        if (dbError) throw new Error('데이터 저장에 실패했습니다.');
      }

      const emailResp = await fetch('/.netlify/functions/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!emailResp.ok) console.warn('Email notification failed, but report saved');

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || '제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="report-page">
        <div className="report-page-container">
          <div className="report-success">
            <div className="report-success-icon">✓</div>
            <h1>접수가 완료되었습니다</h1>
            <p>요청 내용은 영업일 기준 5일 이내에 검토 후 처리됩니다.</p>
            <p>처리 결과는 <strong>{reporterEmail}</strong>로 회신드립니다.</p>
            <div className="report-success-actions">
              <button onClick={() => onNav?.('home')}>홈으로</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-page-container">
        <h1 className="report-page-title">정정·삭제 요청 / 문의</h1>
        <p className="report-page-meta">
          공장 정보의 정정·삭제 요청 또는 일반 문의를 받습니다.<br/>
          영업일 기준 5일 이내에 검토 후 회신드립니다.
        </p>

        <div className="report-section">
          <label className="report-label">요청 종류 <span className="required">*</span></label>
          <div className="report-type-options">
            {[
              { value: 'factory_issue', title: '공장 정보 신고', desc: '제3자가 다른 공장 정보의 오류·문제를 신고' },
              { value: 'self_correction', title: '자사 정보 정정·삭제', desc: '본인 회사 정보의 정정 또는 삭제 요청' },
              { value: 'general_inquiry', title: '일반 문의', desc: '서비스 이용 문의·제휴·기타' },
            ].map(opt => (
              <label key={opt.value} className={`report-type-option ${reportType === opt.value ? 'active' : ''}`}>
                <input type="radio" name="reportType" value={opt.value}
                  checked={reportType === opt.value}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <div className="report-type-content">
                  <strong>{opt.title}</strong>
                  <span>{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {(reportType === 'factory_issue' || reportType === 'self_correction') && (
          <div className="report-section">
            <label className="report-label">대상 공장명 <span className="required">*</span></label>
            <input type="text" className="report-input"
              placeholder="공장명을 입력하세요"
              value={targetFactoryName}
              onChange={(e) => setTargetFactoryName(e.target.value)}
            />
          </div>
        )}

        <div className="report-section">
          <h2 className="report-section-title">신청자 정보</h2>
          <div className="report-field">
            <label className="report-label">회사명 <span className="required">*</span></label>
            <input type="text" className="report-input" placeholder="회사명을 입력하세요"
              value={reporterCompany} onChange={(e) => setReporterCompany(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">사업자번호</label>
            <input type="text" className="report-input" placeholder="000-00-00000 (선택)"
              value={reporterBusinessNumber} onChange={(e) => setReporterBusinessNumber(e.target.value)}/>
            <span className="report-hint">자사 정정·삭제 요청 시 권한 확인용 (선택)</span>
          </div>
          <div className="report-field">
            <label className="report-label">담당자명 <span className="required">*</span></label>
            <input type="text" className="report-input" placeholder="담당자 성함"
              value={reporterName} onChange={(e) => setReporterName(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">이메일 <span className="required">*</span></label>
            <input type="email" className="report-input" placeholder="회신 받을 이메일"
              value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">연락처</label>
            <input type="tel" className="report-input" placeholder="000-0000-0000 (선택)"
              value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)}/>
          </div>
        </div>

        <div className="report-section">
          <h2 className="report-section-title">요청 내용</h2>
          <div className="report-field">
            <label className="report-label">사유 <span className="required">*</span></label>
            <input type="text" className="report-input"
              placeholder="간단한 사유 (예: 폐업, 정보 오류, 노출 거부 등)"
              value={reason} onChange={(e) => setReason(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">상세 내용</label>
            <textarea className="report-textarea" rows="6"
              placeholder="구체적인 내용을 입력해주세요 (선택)"
              value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
        </div>

        <div className="report-notice">
          <p>※ 본 폼을 통해 수집된 정보는 요청 처리 목적으로만 사용되며, 처리 완료 후 3년간 보관 후 파기됩니다.</p>
          <p>※ 자세한 내용은 <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('privacy'); }}>개인정보처리방침</a>을 참조하세요.</p>
        </div>

        {errorMsg && <div className="report-error">{errorMsg}</div>}

        <div className="report-actions">
          <button className="report-cancel-btn" onClick={() => onNav?.('home')} disabled={submitting}>취소</button>
          <button className="report-submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '제출 중...' : '제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

// SiteFooter — 출처 표기 + 법적 링크
// ──────────────────────────────────────────────────────────
const SiteFooter = ({ onNav }) => (
  <footer className="site-footer">
    <div className="site-footer-content">
      <div className="site-footer-info">
        <p>본 사이트는 공공데이터포털의 공개정보를 기반으로 운영됩니다.</p>
        <p>정보의 정정·삭제 요청은 <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('report'); }}>여기</a>에서 가능합니다.</p>
      </div>
      <div className="site-footer-meta">
        <p>주식회사 올뷰코리아 © 2026</p>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('terms'); }}>이용약관</a>
          {' · '}
          <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('privacy'); }}>개인정보처리방침</a>
          {' · '}
          <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('report'); }}>정정/삭제 요청</a>
        </p>
      </div>
    </div>
  </footer>
);

Object.assign(window, { TermsPage, PrivacyPage, ReportPage, SiteFooter });


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

