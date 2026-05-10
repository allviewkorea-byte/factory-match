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
    { id: 'home',   label: '홈' },
    { id: 'ai',     label: 'AI 상담' },
    { id: 'list',   label: '제조사 탐색' },
    { id: 'rfq',    label: '견적 요청', badge: rfqCount > 0 ? rfqCount : null },
    { id: 'grants', label: '정부지원금' },
    // { id: 'chat',  label: '채팅' },  // 채팅 탭 — 추후 활성화
  ];
  const isCompact = density === 'compact';
  return (
    <header className="hdr" style={{ height: isCompact ? 56 : 64 }}>
      <div className="hdr-inner">
        <div className="hdr-left">
          <button className="logo" onClick={() => {
            if (route === 'home' && authed) window.dispatchEvent(new CustomEvent('home-reset'));
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
                onClick={() => { window.logVisitor?.('tab_click', { tab: n.id }); onNav(n.id); }}
              >
                {n.label}
                {n.badge && <span className="hdr-nav-badge">{n.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="hdr-right">
          {authed ? (
            <>
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
            </>
          ) : (
            <>
              <button className="hdr-login-btn" onClick={() => onNav('login')}>로그인</button>
              <button className="hdr-signup-btn" onClick={() => { window.logVisitor?.('signup_triggered', { trigger: 'header' }); onNav('signup'); }}>무료로 시작하기</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// ──────────────────────────────────────────────────────────
// GateModal — 비로그인 접근 제한 모달
// ──────────────────────────────────────────────────────────
const GATE_MESSAGES = {
  search:       { title: '검색은 회원만 이용 가능합니다', sub: '무료로 가입하면 전국 공장 DB를 자유롭게 검색할 수 있어요.' },
  factory_view: { title: '더 많은 공장을 보려면 가입하세요', sub: '회원 가입 후 모든 공장 상세 정보와 연락처를 확인할 수 있어요.' },
  rfq:          { title: '견적 요청은 회원만 이용 가능합니다', sub: '가입하면 여러 공장에 동시에 견적을 요청할 수 있어요.' },
  ai_consult:   { title: 'AI 상담을 계속하려면 가입하세요', sub: '가입하면 AI 상담을 무제한으로 이용하고 공장 추천을 받을 수 있어요.' },
};

const GateModal = ({ reason, onSignup, onLogin, onClose }) => {
  const msg = GATE_MESSAGES[reason] || GATE_MESSAGES.search;
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="gate-veil" onClick={onClose}>
      <div className="gate-card" onClick={(e) => e.stopPropagation()}>
        <button className="gate-close" onClick={onClose} aria-label="닫기">
          <Icon name="close" size={16} stroke={2.2}/>
        </button>
        <div className="gate-logo">
          <span className="logo-mark" style={{ width: 36, height: 36 }}>
            <span className="logo-mark-inner"/>
          </span>
          <span className="logo-text">
            <span className="logo-ko">공장매칭</span>
            <span className="logo-en">FactoryMatch</span>
          </span>
        </div>
        <div className="gate-lock-icon">
          <Icon name="lock" size={28} stroke={1.6}/>
        </div>
        <h2 className="gate-title">{msg.title}</h2>
        <p className="gate-sub">{msg.sub}</p>
        <div className="gate-btns">
          <button className="gate-btn-primary" onClick={onSignup}>무료로 시작하기</button>
          <button className="gate-btn-secondary" onClick={onLogin}>로그인</button>
        </div>
      </div>
    </div>
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
  machine:     'linear-gradient(135deg, #1a5fa3 0%, #0d3d6e 100%)',
  electronics: 'linear-gradient(135deg, #5236a0 0%, #2d1a6e 100%)',
  chemical:    'linear-gradient(135deg, #b85c0f 0%, #7a3a08 100%)',
  food:        'linear-gradient(135deg, #2a7d50 0%, #1a5235 100%)',
  textile:     'linear-gradient(135deg, #a02d4a 0%, #6e1a30 100%)',
  // 추가 색상
  auto:        'linear-gradient(135deg, #1a6b8a 0%, #0d4560 100%)',
  plastic:     'linear-gradient(135deg, #7a5a1a 0%, #4a380a 100%)',
  print:       'linear-gradient(135deg, #3a6b3a 0%, #1e4a1e 100%)',
  wood:        'linear-gradient(135deg, #7a4a1a 0%, #4a2c0a 100%)',
};
const KO_INDUSTRY_MAP = [
  { key: 'machine',     kws: ['기계','금속','부품','주조','단조','절삭','가공','금형','프레스','CNC','용접','주물','선반','밸브','스프링','볼트','너트','베어링','펌프','모터','설비','장비','시험기','자동화'] },
  { key: 'electronics', kws: ['전자','전기','반도체','회로','LED','PCB','디스플레이','광학','센서','통신','배터리','충전','케이블','변압기','인버터','제어'] },
  { key: 'chemical',    kws: ['화학','소재','플라스틱','고무','도료','수지','합성','도금','코팅','접착','필름','시트','발포','성형','사출','압출','페인트'] },
  { key: 'food',        kws: ['식품','음료','패키징','포장','제과','제빵','농산','수산','축산','조미','양념','제분','쌀','밀','육가공','유제품'] },
  { key: 'textile',     kws: ['섬유','의류','봉제','직물','니트','염색','원단','자수','패션','가방','신발','스포츠웨어'] },
  { key: 'auto',        kws: ['자동차','차량','자동차부품','카시트','범퍼','도어','배기','브레이크','샤시'] },
  { key: 'plastic',     kws: ['사출','압출','블로우','PET','PP','PE','ABS','폴리','포장재','용기','트레이'] },
  { key: 'print',       kws: ['인쇄','출판','포장인쇄','라벨','스티커','박스','골판지','종이'] },
  { key: 'wood',        kws: ['목재','가구','합판','목공','원목','MDF','합판','파티클'] },
];
function _resolveIndustryKey(f) {
  // industries가 문자열로 올 경우 배열로 정규화
  const inds = Array.isArray(f.industries)
    ? f.industries
    : (f.industries ? [String(f.industries)] : []);
  const allInds = inds.join(' ');
  // 영문 id 직접 매핑
  const first = inds[0] || '';
  if (INDUSTRY_BG[first]) return first;
  // 한글 키워드 - industries 필드
  for (const { key, kws } of KO_INDUSTRY_MAP) {
    if (kws.some(kw => allInds.includes(kw))) return key;
  }
  // summary + name 텍스트로 판단 (DB 공장 대부분 industries 없음)
  const text = ((f.summary || '') + ' ' + (f.name || '')).toLowerCase();
  for (const { key, kws } of KO_INDUSTRY_MAP) {
    if (kws.some(kw => text.includes(kw.toLowerCase()))) return key;
  }
  return null;
}
function getCardBg(f) {
  const key = _resolveIndustryKey(f);
  return INDUSTRY_BG[key] || 'linear-gradient(135deg, #3a5882 0%, #1e3a5f 100%)';
}
const INDUSTRY_ICONS = {
  machine: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="4"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
      {[0,45,90,135,180,225,270,315].map(deg => {
        const r = Math.PI * deg / 180;
        const x1 = 32 + 14 * Math.cos(r); const y1 = 32 + 14 * Math.sin(r);
        const x2 = 32 + 22 * Math.cos(r); const y2 = 32 + 22 * Math.sin(r);
        return <rect key={deg} x={x1-3} y={y1-3} width="6" height="8"
          transform={`rotate(${deg} ${x1} ${y1})`} rx="1.5" fill="white"/>;
      })}
    </svg>
  ),
  electronics: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="14,38 24,38 28,22 34,50 40,26 44,38 50,38" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="38" r="3" fill="white"/>
      <circle cx="50" cy="38" r="3" fill="white"/>
    </svg>
  ),
  chemical: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 10 L24 30 L12 50 Q10 54 14 56 L50 56 Q54 54 52 50 L40 30 L40 10 Z" stroke="white" strokeWidth="3.5" strokeLinejoin="round"/>
      <line x1="22" y1="18" x2="42" y2="18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="24" cy="44" r="4" fill="white" opacity="0.7"/>
      <circle cx="36" cy="48" r="3" fill="white" opacity="0.5"/>
      <circle cx="44" cy="43" r="2.5" fill="white" opacity="0.6"/>
    </svg>
  ),
  food: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="24" width="44" height="30" rx="3" stroke="white" strokeWidth="3.5"/>
      <polyline points="10,30 32,16 54,30" stroke="white" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/>
      <line x1="32" y1="24" x2="32" y2="54" stroke="white" strokeWidth="2.5" strokeDasharray="3 3"/>
      <line x1="10" y1="40" x2="54" y2="40" stroke="white" strokeWidth="2.5" strokeDasharray="3 3"/>
    </svg>
  ),
  textile: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="32" rx="8" ry="18" stroke="white" strokeWidth="3.5"/>
      <ellipse cx="44" cy="32" rx="8" ry="18" stroke="white" strokeWidth="3.5"/>
      <path d="M20 14 Q32 22 44 14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 50 Q32 42 44 50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="32" x2="44" y2="32" stroke="white" strokeWidth="2" strokeDasharray="4 3"/>
    </svg>
  ),
};
const ICON_DEFAULT = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="28" width="48" height="28" rx="2" stroke="white" strokeWidth="3.5"/>
    <polyline points="4,32 32,12 60,32" stroke="white" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round"/>
    <rect x="22" y="40" width="8" height="16" rx="1" fill="white" opacity="0.6"/>
    <rect x="34" y="40" width="8" height="16" rx="1" fill="white" opacity="0.6"/>
    <rect x="14" y="34" width="6" height="6" rx="1" fill="white" opacity="0.4"/>
    <rect x="44" y="34" width="6" height="6" rx="1" fill="white" opacity="0.4"/>
  </svg>
);
function getCardIcon(f) {
  const key = _resolveIndustryKey(f);
  return INDUSTRY_ICONS[key] || ICON_DEFAULT;
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
  // summary에서 핵심 키워드 추출 (DB 공장용)
  if (kws.length === 0 && f.summary) {
    // summary에서 '제조' 앞 단어들 추출
    const m = f.summary.match(/([가-힣A-Za-z]+(?:[,，、·]\s*[가-힣A-Za-z]+)*)\s*제조/);
    if (m) {
      const parts = m[1].split(/[,，、·]/).map(s => s.trim()).filter(s => s.length >= 2 && s.length <= 10);
      kws.push(...parts.slice(0, 3));
    }
  }
  // 그래도 없으면 업종 라벨
  if (kws.length === 0) {
    const key = _resolveIndustryKey(f);
    const labelMap = { machine: '기계/금속', electronics: '전자/전기', chemical: '화학/소재', food: '식품가공', textile: '섬유/의류', auto: '자동차부품', plastic: '플라스틱', print: '인쇄/포장', wood: '목재/가구' };
    if (key && labelMap[key]) kws.push(labelMap[key]);
  }
  return kws.slice(0, 3);
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
        <div className="mcard-img-stripes"/>
        <div className="mcard-icon">{getCardIcon(f)}</div>
        {/* 썸네일 텍스트 제거 */}
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
            <div className="mcard-tags">
              {getCardKeywords(f).map((kw, i) => (
                <span key={'kw'+i} className="mtag mtag-product">{kw}</span>
              ))}
              {processTags.map(p => <span key={p} className="mtag">{p}</span>)}
              {industryTags.map(i => <span key={i} className="mtag mtag-ind">{i}</span>)}
            </div>
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
  const selectedMarkerRef = React.useRef(null); // highlighted pin for selected card
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
    const pagedIds = new Set((pagedFactories || []).map(f => f.id));
    const newMarkers = [];
    (geoFactories || []).filter(f => f.lat != null && f.lng != null).forEach(f => {
      const isCurrentPage = pagedIds.has(f.id);
      // No 'map' prop — clusterer manages visibility
      const marker = new google.maps.Marker({
        position: { lat: f.lat, lng: f.lng },
        title: f.name,
        icon: isCurrentPage ? {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        } : {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#94a3b8',
          fillOpacity: 0.7,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
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
      marker._fid = f.id; // pagedFactories 아이콘 업데이트용
      newMarkers.push(marker);
    });
    markersRef.current = newMarkers;

    // 클러스터링 없이 직접 지도에 표시
    newMarkers.forEach(m => m.setMap(mapRef.current));

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, [mapReady, geoFactories]);

  // pagedFactories 변경 시 기존 마커 아이콘만 업데이트 (재생성 없이)
  const pagedIdsRef = React.useRef(new Set());
  React.useEffect(() => {
    if (!mapReady || !mapRef.current || !markersRef.current.length) return;
    const pagedIds = new Set((pagedFactories || []).map(f => f.id));
    // 이전과 같으면 스킵
    const prev = pagedIdsRef.current;
    const same = pagedIds.size === prev.size && [...pagedIds].every(id => prev.has(id));
    if (same) return;
    pagedIdsRef.current = pagedIds;
    // 아이콘만 업데이트
    markersRef.current.forEach(m => {
      const fid = m._fid;
      if (!fid) return;
      const isCurrentPage = pagedIds.has(fid);
      m.setIcon(isCurrentPage ? {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9, fillColor: '#2563eb', fillOpacity: 1,
        strokeColor: '#ffffff', strokeWeight: 2,
      } : {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6, fillColor: '#94a3b8', fillOpacity: 0.7,
        strokeColor: '#ffffff', strokeWeight: 1.5,
      });
    });
  }, [mapReady, pagedFactories]);

  // Dynamic geocoding — pagedFactories without pre-geocoded coords
  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    // pagedFactories ID가 실제로 바뀐 경우에만 실행
    const newIds = (pagedFactories || []).map(f => f.id).sort().join(',');
    if (dynPagedIdsRef.current === newIds) return;
    dynPagedIdsRef.current = newIds;
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

  const dynPagedIdsRef = React.useRef('');

  // Pan/zoom to selected factory + show highlighted pin
  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Remove previous selection marker
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setMap(null);
      selectedMarkerRef.current = null;
    }

    const hideAllMarkers = () => {
      if (clustererRef.current) clustererRef.current.clearMarkers();
      markersRef.current.forEach(m => m.setMap(null));
      dynMarkersRef.current.forEach(m => m.setMap(null));
    };

    const showAllMarkers = () => {
      const MC = window.markerClusterer?.MarkerClusterer;
      if (MC && clustererRef.current && markersRef.current.length) {
        clustererRef.current.addMarkers(markersRef.current);
      } else {
        markersRef.current.forEach(m => m.setMap(mapRef.current));
      }
      dynMarkersRef.current.forEach(m => m.setMap(mapRef.current));
    };

    const placeSelectedPin = (lat, lng) => {
      selectedMarkerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: selectedFactory.name,
        animation: google.maps.Animation.DROP,
        zIndex: 1000,
      });
    };

    if (selectedFactory) {
      hideAllMarkers();
      if (selectedFactory.lat != null && selectedFactory.lng != null) {
        mapRef.current.panTo({ lat: selectedFactory.lat, lng: selectedFactory.lng });
        mapRef.current.setZoom(14);
        placeSelectedPin(selectedFactory.lat, selectedFactory.lng);
      } else {
        new google.maps.Geocoder().geocode(
          { address: selectedFactory.roadAddress || selectedFactory.address || `${selectedFactory.name} ${selectedFactory.city}` },
          (res, status) => {
            if (status === 'OK' && res[0]) {
              const loc = res[0].geometry.location;
              mapRef.current.panTo(loc);
              mapRef.current.setZoom(14);
              placeSelectedPin(loc.lat(), loc.lng());
            }
          }
        );
      }
    } else {
      showAllMarkers();
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

const ManufacturerCardSkeleton = () => (
  <article className="mcard mcard-skeleton">
    <div className="mcard-img sk-block"/>
    <div className="mcard-body" style={{ pointerEvents: 'none' }}>
      <div className="mcard-head">
        <div className="mcard-titles">
          <div className="sk-block sk-name"/>
          <div className="sk-block sk-sub"/>
        </div>
      </div>
      <div className="sk-block sk-tags"/>
      <div className="sk-block sk-desc"/>
      <div className="sk-block sk-desc" style={{ width: '65%' }}/>
    </div>
  </article>
);

Object.assign(window, { Icon, Header, Badge, Chip, ManufacturerCard, KoreaMap });


// 페이지: Home, List, Detail, RFQ, MyPage

const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React;

