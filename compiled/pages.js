// 공통 컴포넌트: Header, Badge, Chip, Card, Map placeholder

const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

// ──────────────────────────────────────────────────────────
// Icons (line-based, 1.5px stroke)
// ──────────────────────────────────────────────────────────
const Icon = ({
  name,
  size = 16,
  className = '',
  stroke = 1.6
}) => {
  const paths = {
    search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m20 20-3.5-3.5"
    })),
    map: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 4v14M15 6v14"
    })),
    list: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 6h18M3 12h18M3 18h18"
    })),
    filter: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 5h18M6 12h12M10 19h4"
    })),
    chat: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z"
    })),
    user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 21a8 8 0 0 1 16 0"
    })),
    bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 21a2 2 0 0 0 4 0"
    })),
    star: /*#__PURE__*/React.createElement("path", {
      d: "m12 3 2.7 5.5 6 .9-4.4 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9z"
    }),
    check: /*#__PURE__*/React.createElement("path", {
      d: "m4 12 5 5L20 6"
    }),
    plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 5v14M5 12h14"
    })),
    arrow_right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14M13 5l7 7-7 7"
    })),
    arrow_up_right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M7 17 17 7M8 7h9v9"
    })),
    pin: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "9",
      r: "2.5"
    })),
    factory: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 21V10l6 4V10l6 4V7l6-3v17z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 21h18"
    })),
    shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 12 2 2 4-4"
    })),
    clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7v5l3 2"
    })),
    box: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m3 7 9-4 9 4-9 4z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 7v10l9 4 9-4V7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 11v10"
    })),
    won: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 6 7 17l3-7 2 7 3-7 3 7L21 6M3 10h18"
    })),
    chart: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 20V4M4 20h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m8 16 3-4 3 2 4-6"
    })),
    flame: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s1 2 3 2c0-3-1-5 1-8z"
    })),
    close: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 6 18 18M18 6 6 18"
    })),
    chevron_right: /*#__PURE__*/React.createElement("path", {
      d: "m9 6 6 6-6 6"
    }),
    chevron_down: /*#__PURE__*/React.createElement("path", {
      d: "m6 9 6 6 6-6"
    }),
    plus_circle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v8M8 12h8"
    })),
    upload: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 16V4M6 10l6-6 6 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 20h16"
    })),
    globe: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
    })),
    badge_check: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m5 12 2-3-1-3 3-1 2-3 3 2 3-1 1 3 3 2-2 3 1 3-3 1-2 3-3-2-3 1-1-3-3-2z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 12 2 2 4-4"
    })),
    sparkle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 3v6M12 15v6M3 12h6M15 12h6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m6 6 3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"
    })),
    layers: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m12 3 9 5-9 5-9-5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m3 13 9 5 9-5M3 18l9 5 9-5"
    })),
    heart: /*#__PURE__*/React.createElement("path", {
      d: "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"
    }),
    mail: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "5",
      width: "18",
      height: "14",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m3 7 9 6 9-6"
    })),
    lock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "11",
      width: "16",
      height: "10",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11V7a4 4 0 0 1 8 0v4"
    })),
    phone: /*#__PURE__*/React.createElement("path", {
      d: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
    }),
    eye: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    eye_off: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 3l18 18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.6 6.1A9 9 0 0 1 12 6c6 0 10 6 10 6a16 16 0 0 1-2.8 3.4M6.6 6.6A14 14 0 0 0 2 12s4 6 10 6a9 9 0 0 0 4-1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9.9 9.9a3 3 0 0 0 4.2 4.2"
    })),
    info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v0M12 11v6"
    })),
    building: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "3",
      width: "14",
      height: "18",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"
    })),
    arrow_left: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M19 12H5M11 5l-7 7 7 7"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className
  }, paths[name]);
};

// ──────────────────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────────────────
const Header = ({
  route,
  onNav,
  density,
  onLogout,
  authed,
  rfqCount = 0
}) => {
  const navItems = [{
    id: 'home',
    label: '홈'
  }, {
    id: 'ai',
    label: 'AI 상담'
  }, {
    id: 'list',
    label: '제조사 탐색'
  }, {
    id: 'rfq',
    label: '견적 요청',
    badge: rfqCount > 0 ? rfqCount : null
  }, {
    id: 'grants',
    label: '정부지원금'
  }
  // { id: 'chat',  label: '채팅' },  // 채팅 탭 — 추후 활성화
  ];
  const isCompact = density === 'compact';
  return /*#__PURE__*/React.createElement("header", {
    className: "hdr",
    style: {
      height: isCompact ? 56 : 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hdr-left"
  }, /*#__PURE__*/React.createElement("button", {
    className: "logo",
    onClick: () => {
      if (route === 'home' && authed) window.dispatchEvent(new CustomEvent('home-reset'));else onNav('home');
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark-inner"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-ko"
  }, "\uACF5\uC7A5\uB9E4\uCE6D"), /*#__PURE__*/React.createElement("span", {
    className: "logo-en"
  }, "FactoryMatch"))), /*#__PURE__*/React.createElement("nav", {
    className: "hdr-nav"
  }, navItems.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    className: `hdr-nav-item ${route === n.id ? 'is-active' : ''}`,
    onClick: () => {
      window.logVisitor?.('tab_click', {
        tab: n.id
      });
      onNav(n.id);
    }
  }, n.label, n.badge && /*#__PURE__*/React.createElement("span", {
    className: "hdr-nav-badge"
  }, n.badge))))), /*#__PURE__*/React.createElement("div", {
    className: "hdr-right"
  }, authed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "hdr-divider"
  }), /*#__PURE__*/React.createElement("button", {
    className: 'hdr-icon-btn hdr-admin' + (route === 'admin' ? ' is-active' : ''),
    onClick: () => onNav('admin'),
    "aria-label": "\uC6B4\uC601\uC790 \uCF58\uC194",
    title: "\uC6B4\uC601\uC790 \uCF58\uC194"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 16,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("button", {
    className: "hdr-user",
    onClick: () => onNav('mypage')
  }, /*#__PURE__*/React.createElement("span", {
    className: "hdr-avatar"
  }, "\uC724"), /*#__PURE__*/React.createElement("span", {
    className: "hdr-user-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hdr-user-name"
  }, "\uC724\uB3C4\uD604 \xB7 Buyer"), /*#__PURE__*/React.createElement("span", {
    className: "hdr-user-org"
  }, "YD Innovations"))), onLogout && /*#__PURE__*/React.createElement("button", {
    className: "hdr-icon-btn hdr-logout",
    onClick: onLogout,
    "aria-label": "\uB85C\uADF8\uC544\uC6C3",
    title: "\uB85C\uADF8\uC544\uC6C3"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 16,
    stroke: 2
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "hdr-login-btn",
    onClick: () => onNav('login')
  }, "\uB85C\uADF8\uC778"), /*#__PURE__*/React.createElement("button", {
    className: "hdr-signup-btn",
    onClick: () => {
      window.logVisitor?.('signup_triggered', {
        trigger: 'header'
      });
      onNav('signup');
    }
  }, "\uBB34\uB8CC\uB85C \uC2DC\uC791\uD558\uAE30")))));
};

// ──────────────────────────────────────────────────────────
// GateModal — 비로그인 접근 제한 모달
// ──────────────────────────────────────────────────────────
const GATE_MESSAGES = {
  search: {
    title: '검색은 회원만 이용 가능합니다',
    sub: '무료로 가입하면 전국 공장 DB를 자유롭게 검색할 수 있어요.'
  },
  factory_view: {
    title: '더 많은 공장을 보려면 가입하세요',
    sub: '회원 가입 후 모든 공장 상세 정보와 연락처를 확인할 수 있어요.'
  },
  rfq: {
    title: '견적 요청은 회원만 이용 가능합니다',
    sub: '가입하면 여러 공장에 동시에 견적을 요청할 수 있어요.'
  },
  ai_consult: {
    title: 'AI 상담을 계속하려면 가입하세요',
    sub: '가입하면 AI 상담을 무제한으로 이용하고 공장 추천을 받을 수 있어요.'
  }
};
const GateModal = ({
  reason,
  onSignup,
  onLogin,
  onClose
}) => {
  const msg = GATE_MESSAGES[reason] || GATE_MESSAGES.search;
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "gate-veil",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "gate-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "gate-close",
    onClick: onClose,
    "aria-label": "\uB2EB\uAE30"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16,
    stroke: 2.2
  })), /*#__PURE__*/React.createElement("div", {
    className: "gate-logo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark",
    style: {
      width: 36,
      height: 36
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-mark-inner"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo-ko"
  }, "\uACF5\uC7A5\uB9E4\uCE6D"), /*#__PURE__*/React.createElement("span", {
    className: "logo-en"
  }, "FactoryMatch"))), /*#__PURE__*/React.createElement("div", {
    className: "gate-lock-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 28,
    stroke: 1.6
  })), /*#__PURE__*/React.createElement("h2", {
    className: "gate-title"
  }, msg.title), /*#__PURE__*/React.createElement("p", {
    className: "gate-sub"
  }, msg.sub), /*#__PURE__*/React.createElement("div", {
    className: "gate-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "gate-btn-primary",
    onClick: onSignup
  }, "\uBB34\uB8CC\uB85C \uC2DC\uC791\uD558\uAE30"), /*#__PURE__*/React.createElement("button", {
    className: "gate-btn-secondary",
    onClick: onLogin
  }, "\uB85C\uADF8\uC778"))));
};

// ──────────────────────────────────────────────────────────
// Badge
// ──────────────────────────────────────────────────────────
const Badge = ({
  children,
  tone = 'slate',
  size = 'sm',
  icon
}) => /*#__PURE__*/React.createElement("span", {
  className: `badge badge-${tone} badge-${size}`
}, icon && /*#__PURE__*/React.createElement(Icon, {
  name: icon,
  size: 11,
  stroke: 1.8
}), children);

// ──────────────────────────────────────────────────────────
// Filter chip
// ──────────────────────────────────────────────────────────
const Chip = ({
  active,
  onClick,
  children,
  count
}) => /*#__PURE__*/React.createElement("button", {
  className: `chip ${active ? 'is-active' : ''}`,
  onClick: onClick
}, children, count != null && /*#__PURE__*/React.createElement("span", {
  className: "chip-count"
}, count));

// ──────────────────────────────────────────────────────────
// Manufacturer card (used in list, recommended, RFQ)
// ──────────────────────────────────────────────────────────
const INDUSTRY_BG = {
  machine: 'linear-gradient(135deg, #1a5fa3 0%, #0d3d6e 100%)',
  electronics: 'linear-gradient(135deg, #5236a0 0%, #2d1a6e 100%)',
  chemical: 'linear-gradient(135deg, #b85c0f 0%, #7a3a08 100%)',
  food: 'linear-gradient(135deg, #2a7d50 0%, #1a5235 100%)',
  textile: 'linear-gradient(135deg, #a02d4a 0%, #6e1a30 100%)',
  // 추가 색상
  auto: 'linear-gradient(135deg, #1a6b8a 0%, #0d4560 100%)',
  plastic: 'linear-gradient(135deg, #7a5a1a 0%, #4a380a 100%)',
  print: 'linear-gradient(135deg, #3a6b3a 0%, #1e4a1e 100%)',
  wood: 'linear-gradient(135deg, #7a4a1a 0%, #4a2c0a 100%)'
};
const KO_INDUSTRY_MAP = [{
  key: 'machine',
  kws: ['기계', '금속', '부품', '주조', '단조', '절삭', '가공', '금형', '프레스', 'CNC', '용접', '주물', '선반', '밸브', '스프링', '볼트', '너트', '베어링', '펌프', '모터', '설비', '장비', '시험기', '자동화']
}, {
  key: 'electronics',
  kws: ['전자', '전기', '반도체', '회로', 'LED', 'PCB', '디스플레이', '광학', '센서', '통신', '배터리', '충전', '케이블', '변압기', '인버터', '제어']
}, {
  key: 'chemical',
  kws: ['화학', '소재', '플라스틱', '고무', '도료', '수지', '합성', '도금', '코팅', '접착', '필름', '시트', '발포', '성형', '사출', '압출', '페인트']
}, {
  key: 'food',
  kws: ['식품', '음료', '패키징', '포장', '제과', '제빵', '농산', '수산', '축산', '조미', '양념', '제분', '쌀', '밀', '육가공', '유제품']
}, {
  key: 'textile',
  kws: ['섬유', '의류', '봉제', '직물', '니트', '염색', '원단', '자수', '패션', '가방', '신발', '스포츠웨어']
}, {
  key: 'auto',
  kws: ['자동차', '차량', '자동차부품', '카시트', '범퍼', '도어', '배기', '브레이크', '샤시']
}, {
  key: 'plastic',
  kws: ['사출', '압출', '블로우', 'PET', 'PP', 'PE', 'ABS', '폴리', '포장재', '용기', '트레이']
}, {
  key: 'print',
  kws: ['인쇄', '출판', '포장인쇄', '라벨', '스티커', '박스', '골판지', '종이']
}, {
  key: 'wood',
  kws: ['목재', '가구', '합판', '목공', '원목', 'MDF', '합판', '파티클']
}];
function _resolveIndustryKey(f) {
  // industries가 문자열로 올 경우 배열로 정규화
  const inds = Array.isArray(f.industries) ? f.industries : f.industries ? [String(f.industries)] : [];
  const allInds = inds.join(' ');
  // 영문 id 직접 매핑
  const first = inds[0] || '';
  if (INDUSTRY_BG[first]) return first;
  // 한글 키워드 - industries 필드
  for (const {
    key,
    kws
  } of KO_INDUSTRY_MAP) {
    if (kws.some(kw => allInds.includes(kw))) return key;
  }
  // summary + name 텍스트로 판단 (DB 공장 대부분 industries 없음)
  const text = ((f.summary || '') + ' ' + (f.name || '')).toLowerCase();
  for (const {
    key,
    kws
  } of KO_INDUSTRY_MAP) {
    if (kws.some(kw => text.includes(kw.toLowerCase()))) return key;
  }
  return null;
}
function getCardBg(f) {
  const key = _resolveIndustryKey(f);
  return INDUSTRY_BG[key] || 'linear-gradient(135deg, #3a5882 0%, #1e3a5f 100%)';
}
const INDUSTRY_ICONS = {
  machine: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: "10",
    stroke: "white",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: "4",
    fill: "white"
  }), [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
    const r = Math.PI * deg / 180;
    const x1 = 32 + 14 * Math.cos(r);
    const y1 = 32 + 14 * Math.sin(r);
    const x2 = 32 + 22 * Math.cos(r);
    const y2 = 32 + 22 * Math.sin(r);
    return /*#__PURE__*/React.createElement("rect", {
      key: deg,
      x: x1 - 3,
      y: y1 - 3,
      width: "6",
      height: "8",
      transform: `rotate(${deg} ${x1} ${y1})`,
      rx: "1.5",
      fill: "white"
    });
  })),
  electronics: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "14,38 24,38 28,22 34,50 40,26 44,38 50,38",
    stroke: "white",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "38",
    r: "3",
    fill: "white"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "38",
    r: "3",
    fill: "white"
  })),
  chemical: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M24 10 L24 30 L12 50 Q10 54 14 56 L50 56 Q54 54 52 50 L40 30 L40 10 Z",
    stroke: "white",
    strokeWidth: "3.5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "22",
    y1: "18",
    x2: "42",
    y2: "18",
    stroke: "white",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "44",
    r: "4",
    fill: "white",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "48",
    r: "3",
    fill: "white",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "44",
    cy: "43",
    r: "2.5",
    fill: "white",
    opacity: "0.6"
  })),
  food: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "24",
    width: "44",
    height: "30",
    rx: "3",
    stroke: "white",
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "10,30 32,16 54,30",
    stroke: "white",
    strokeWidth: "3.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "32",
    y1: "24",
    x2: "32",
    y2: "54",
    stroke: "white",
    strokeWidth: "2.5",
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "40",
    x2: "54",
    y2: "40",
    stroke: "white",
    strokeWidth: "2.5",
    strokeDasharray: "3 3"
  })),
  textile: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "20",
    cy: "32",
    rx: "8",
    ry: "18",
    stroke: "white",
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "44",
    cy: "32",
    rx: "8",
    ry: "18",
    stroke: "white",
    strokeWidth: "3.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 14 Q32 22 44 14",
    stroke: "white",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 50 Q32 42 44 50",
    stroke: "white",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "32",
    x2: "44",
    y2: "32",
    stroke: "white",
    strokeWidth: "2",
    strokeDasharray: "4 3"
  }))
};
const ICON_DEFAULT = /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 64 64",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("rect", {
  x: "8",
  y: "28",
  width: "48",
  height: "28",
  rx: "2",
  stroke: "white",
  strokeWidth: "3.5"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "4,32 32,12 60,32",
  stroke: "white",
  strokeWidth: "3.5",
  strokeLinejoin: "round",
  strokeLinecap: "round"
}), /*#__PURE__*/React.createElement("rect", {
  x: "22",
  y: "40",
  width: "8",
  height: "16",
  rx: "1",
  fill: "white",
  opacity: "0.6"
}), /*#__PURE__*/React.createElement("rect", {
  x: "34",
  y: "40",
  width: "8",
  height: "16",
  rx: "1",
  fill: "white",
  opacity: "0.6"
}), /*#__PURE__*/React.createElement("rect", {
  x: "14",
  y: "34",
  width: "6",
  height: "6",
  rx: "1",
  fill: "white",
  opacity: "0.4"
}), /*#__PURE__*/React.createElement("rect", {
  x: "44",
  y: "34",
  width: "6",
  height: "6",
  rx: "1",
  fill: "white",
  opacity: "0.4"
}));
function getCardIcon(f) {
  const key = _resolveIndustryKey(f);
  return INDUSTRY_ICONS[key] || ICON_DEFAULT;
}
const INDUSTRY_LABEL_MAP = {
  machine: '기계/금속',
  electronics: '전자/전기',
  chemical: '화학/소재',
  food: '식품/음료',
  textile: '섬유/의류',
  auto: '자동차부품',
  pcb: 'PCB/전자기판',
  assembly: '조립/가공',
  machine_parts: '기계부품',
  case: '케이스/외장'
};
function getCardKeywords(f) {
  const kws = [];
  if (f.products?.length) kws.push(...f.products.slice(0, 3).map(p => INDUSTRY_LABEL_MAP[p] || p));
  if (kws.length === 0 && f.industries?.length) kws.push(...f.industries.slice(0, 3).map(p => INDUSTRY_LABEL_MAP[p] || p));
  if (kws.length === 0 && f.processes?.length) {
    const {
      PROCESSES
    } = window.MFG_DATA;
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
    const labelMap = {
      machine: '기계/금속',
      electronics: '전자/전기',
      chemical: '화학/소재',
      food: '식품가공',
      textile: '섬유/의류',
      auto: '자동차부품',
      plastic: '플라스틱',
      print: '인쇄/포장',
      wood: '목재/가구'
    };
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
const ManufacturerCard = ({
  f,
  onOpen,
  density,
  compact = false,
  onAddRFQ,
  rfqIds = [],
  simplified = false
}) => {
  const {
    PROCESSES
  } = window.MFG_DATA;
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
  const hasRealStats = f.rating > 0 || f.deals > 0 || f.moq > 0 && f.moq !== 1;
  const hasCerts = (f.certs || []).length > 0;
  const hasFlags = f.oem || f.odm || f.export;
  const hasFooter = hasCerts || hasFlags;
  return /*#__PURE__*/React.createElement("article", {
    className: `mcard ${isCompact ? 'is-compact' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-img",
    style: {
      background: getCardBg(f)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-img-stripes"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mcard-icon"
  }, getCardIcon(f))), /*#__PURE__*/React.createElement("button", {
    className: "mcard-body",
    onClick: () => onOpen?.(f.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-titles"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mcard-name"
  }, f.name, hasCerts && (f.certs || []).includes('IATF 16949') && /*#__PURE__*/React.createElement("span", {
    className: "mcard-verified",
    title: "\uC778\uC99D \uC81C\uC870\uC0AC"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge_check",
    size: 14,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mcard-sub"
  }, location && /*#__PURE__*/React.createElement("span", null, location), f.founded > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, f.founded, "\uB144 \uC124\uB9BD")), f.employees > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\uC9C1\uC6D0 ", f.employees.toLocaleString(), "\uBA85")))), f.rating > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mcard-rating"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 12,
    stroke: 2
  }), /*#__PURE__*/React.createElement("strong", null, f.rating), f.reviews > 0 && /*#__PURE__*/React.createElement("span", null, "(", f.reviews, ")"))), simplified ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mcard-tags"
  }, getCardKeywords(f).map((kw, i) => /*#__PURE__*/React.createElement("span", {
    key: 'kw' + i,
    className: "mtag mtag-product"
  }, kw)), processTags.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "mtag"
  }, p)), industryTags.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "mtag mtag-ind"
  }, i))), f.summary && /*#__PURE__*/React.createElement("p", {
    className: "mcard-desc"
  }, f.summary)) : /*#__PURE__*/React.createElement(React.Fragment, null, f.summary && /*#__PURE__*/React.createElement("p", {
    className: "mcard-desc"
  }, f.summary), hasTags && /*#__PURE__*/React.createElement("div", {
    className: "mcard-tags"
  }, processTags.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "mtag"
  }, p)), industryTags.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "mtag mtag-ind"
  }, i)), materialTags.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    className: "mtag mtag-mat"
  }, m))), hasRealStats && /*#__PURE__*/React.createElement("div", {
    className: "mcard-stats"
  }, f.moq > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-k"
  }, "MOQ"), /*#__PURE__*/React.createElement("span", {
    className: "stat-v"
  }, f.moq.toLocaleString(), /*#__PURE__*/React.createElement("em", {
    className: "stat-unit"
  }, f.moqUnit || '피스'))), /*#__PURE__*/React.createElement("div", {
    className: "stat-sep"
  })), f.leadDays > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-k"
  }, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("span", {
    className: "stat-v"
  }, f.leadDays, "\uC77C")), f.responseHr > 0 && f.responseHr < 24 || f.deals > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "stat-sep"
  }) : null), f.responseHr > 0 && f.responseHr < 24 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-k"
  }, "\uC751\uB2F5"), /*#__PURE__*/React.createElement("span", {
    className: "stat-v"
  }, f.responseHr, "h")), f.deals > 0 && /*#__PURE__*/React.createElement("div", {
    className: "stat-sep"
  })), f.deals > 0 && /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-k"
  }, "\uAC70\uB798"), /*#__PURE__*/React.createElement("span", {
    className: "stat-v"
  }, f.deals, "\uAC74"))), hasFooter && /*#__PURE__*/React.createElement("div", {
    className: "mcard-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-cert"
  }, (f.certs || []).slice(0, 3).map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    className: "cert"
  }, c)), (f.certs || []).length > 3 && /*#__PURE__*/React.createElement("span", {
    className: "cert cert-more"
  }, "+", (f.certs || []).length - 3)), /*#__PURE__*/React.createElement("div", {
    className: "mcard-flags"
  }, f.oem && /*#__PURE__*/React.createElement("span", {
    className: "flag"
  }, "OEM"), f.odm && /*#__PURE__*/React.createElement("span", {
    className: "flag"
  }, "ODM"), f.export && /*#__PURE__*/React.createElement("span", {
    className: "flag flag-export"
  }, "\uC218\uCD9C"))))), onAddRFQ && /*#__PURE__*/React.createElement("div", {
    className: "mcard-rfq-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: `mcard-rfq-btn${isInRfq ? ' is-added' : ''}`,
    onClick: e => {
      e.stopPropagation();
      onAddRFQ(f.id);
    }
  }, isInRfq ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    stroke: 2.4
  }), " \uACAC\uC801 \uCD94\uAC00\uB428") : simplified ? '견적 요청' : '견적 요청하기')));
};

// ──────────────────────────────────────────────────────────
// Korea map placeholder (Naver-ish styling)
// ──────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────
// 주소 → SVG 좌표 매핑 (viewBox 0 0 100 100)
// ──────────────────────────────────────────────────────────
const CITY_COORDS = [
// 서울
{
  kw: ['서울'],
  x: 39,
  y: 20
},
// 인천
{
  kw: ['인천'],
  x: 32,
  y: 27
},
// 경기 세부
{
  kw: ['고양시', '경기 고양'],
  x: 36,
  y: 22
}, {
  kw: ['파주시', '경기 파주'],
  x: 35,
  y: 20
}, {
  kw: ['김포시', '경기 김포'],
  x: 34,
  y: 25
}, {
  kw: ['부천시', '경기 부천'],
  x: 35,
  y: 27
}, {
  kw: ['광명시', '경기 광명'],
  x: 37,
  y: 28
}, {
  kw: ['안양시', '경기 안양'],
  x: 39,
  y: 30
}, {
  kw: ['과천시', '경기 과천'],
  x: 40,
  y: 28
}, {
  kw: ['남양주시', '경기 남양주'],
  x: 44,
  y: 24
}, {
  kw: ['양주시', '경기 양주'],
  x: 42,
  y: 23
}, {
  kw: ['구리시', '경기 구리'],
  x: 42,
  y: 24
}, {
  kw: ['성남시', '경기 성남', '판교', '분당'],
  x: 42,
  y: 27
}, {
  kw: ['용인시', '경기 용인'],
  x: 43,
  y: 31
}, {
  kw: ['안산시', '경기 안산'],
  x: 37,
  y: 33
}, {
  kw: ['시흥시', '경기 시흥'],
  x: 36,
  y: 33
}, {
  kw: ['수원시', '경기 수원'],
  x: 40,
  y: 33
}, {
  kw: ['화성시', '경기 화성'],
  x: 39,
  y: 37
}, {
  kw: ['오산시', '경기 오산'],
  x: 41,
  y: 37
}, {
  kw: ['평택시', '경기 평택'],
  x: 41,
  y: 40
}, {
  kw: ['이천시', '경기 이천'],
  x: 46,
  y: 35
}, {
  kw: ['포천시', '경기 포천'],
  x: 45,
  y: 22
}, {
  kw: ['경기'],
  x: 40,
  y: 30
},
// 강원
{
  kw: ['춘천시', '강원 춘천'],
  x: 50,
  y: 27
}, {
  kw: ['원주시', '강원 원주'],
  x: 51,
  y: 34
}, {
  kw: ['강릉시', '강원 강릉'],
  x: 59,
  y: 33
}, {
  kw: ['동해시', '강원 동해'],
  x: 60,
  y: 39
}, {
  kw: ['강원'],
  x: 55,
  y: 32
},
// 충청
{
  kw: ['세종'],
  x: 41,
  y: 49
}, {
  kw: ['대전'],
  x: 42,
  y: 53
}, {
  kw: ['천안시', '충남 천안'],
  x: 41,
  y: 45
}, {
  kw: ['아산시', '충남 아산'],
  x: 39,
  y: 45
}, {
  kw: ['당진시', '충남 당진'],
  x: 36,
  y: 44
}, {
  kw: ['홍성군', '충남 홍성'],
  x: 37,
  y: 50
}, {
  kw: ['서산시', '충남 서산'],
  x: 35,
  y: 47
}, {
  kw: ['충남'],
  x: 39,
  y: 50
}, {
  kw: ['청주시', '충북 청주'],
  x: 45,
  y: 47
}, {
  kw: ['충주시', '충북 충주'],
  x: 48,
  y: 41
}, {
  kw: ['충북'],
  x: 46,
  y: 46
},
// 전라
{
  kw: ['광주'],
  x: 47,
  y: 74
}, {
  kw: ['전주시', '전북 전주'],
  x: 46,
  y: 66
}, {
  kw: ['군산시', '전북 군산'],
  x: 41,
  y: 62
}, {
  kw: ['익산시', '전북 익산'],
  x: 43,
  y: 63
}, {
  kw: ['전북'],
  x: 45,
  y: 66
}, {
  kw: ['여수시', '전남 여수'],
  x: 55,
  y: 83
}, {
  kw: ['순천시', '전남 순천'],
  x: 54,
  y: 79
}, {
  kw: ['목포시', '전남 목포'],
  x: 41,
  y: 80
}, {
  kw: ['광양시', '전남 광양'],
  x: 57,
  y: 79
}, {
  kw: ['나주시', '전남 나주'],
  x: 46,
  y: 76
}, {
  kw: ['전남'],
  x: 49,
  y: 79
},
// 경상
{
  kw: ['대구'],
  x: 63,
  y: 67
}, {
  kw: ['포항시', '경북 포항'],
  x: 73,
  y: 60
}, {
  kw: ['구미시', '경북 구미'],
  x: 60,
  y: 62
}, {
  kw: ['경주시', '경북 경주'],
  x: 70,
  y: 67
}, {
  kw: ['안동시', '경북 안동'],
  x: 65,
  y: 53
}, {
  kw: ['영주시', '경북 영주'],
  x: 63,
  y: 49
}, {
  kw: ['김천시', '경북 김천'],
  x: 58,
  y: 63
}, {
  kw: ['경북'],
  x: 65,
  y: 60
}, {
  kw: ['울산'],
  x: 73,
  y: 72
}, {
  kw: ['부산'],
  x: 70,
  y: 80
}, {
  kw: ['창원시', '경남 창원'],
  x: 63,
  y: 78
}, {
  kw: ['김해시', '경남 김해'],
  x: 68,
  y: 78
}, {
  kw: ['거제시', '경남 거제'],
  x: 67,
  y: 84
}, {
  kw: ['진주시', '경남 진주'],
  x: 58,
  y: 82
}, {
  kw: ['양산시', '경남 양산'],
  x: 69,
  y: 75
}, {
  kw: ['사천시', '경남 사천'],
  x: 57,
  y: 83
}, {
  kw: ['경남'],
  x: 63,
  y: 80
},
// 제주
{
  kw: ['제주', '서귀포'],
  x: 55,
  y: 94
}];
function getCityCoord(city) {
  if (!city) return null;
  for (const entry of CITY_COORDS) {
    if (entry.kw.some(k => city.includes(k))) return {
      x: entry.x,
      y: entry.y
    };
  }
  return null;
}
const KoreaMap = ({
  factories,
  selectedId,
  onPin,
  hoveredId
}) => {
  const [tip, setTip] = React.useState(null);
  const pinFor = id => factories.find(f => f.id === id);
  return /*#__PURE__*/React.createElement("div", {
    className: "map"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "map-svg",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "mapGrid",
    width: "6",
    height: "6",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 0 L 0 0 0 6",
    fill: "none",
    stroke: "rgba(15,23,42,.04)",
    strokeWidth: "0.3"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "seaGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#eef4f8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#e6eef4"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "100",
    height: "100",
    fill: "url(#seaGrad)"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "100",
    height: "100",
    fill: "url(#mapGrid)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 32 12 L 38 8 L 46 11 L 50 18 L 48 24 L 52 30 L 50 36 L 56 42 L 52 50 L 58 56 L 64 60 L 70 64 L 76 72 L 78 80 L 72 88 L 64 92 L 58 88 L 54 82 L 48 76 L 42 72 L 38 64 L 32 58 L 28 50 L 30 42 L 26 34 L 28 26 L 30 18 Z",
    fill: "#fafbfc",
    stroke: "#cbd5e1",
    strokeWidth: "0.4"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "58",
    cy: "95",
    rx: "6",
    ry: "2.5",
    fill: "#fafbfc",
    stroke: "#cbd5e1",
    strokeWidth: "0.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 38 14 L 40 30 L 38 45 L 50 60 L 65 75",
    stroke: "#dde6ee",
    strokeWidth: "0.5",
    fill: "none",
    strokeDasharray: "1.5 1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 30 25 L 50 40 L 70 65",
    stroke: "#dde6ee",
    strokeWidth: "0.5",
    fill: "none",
    strokeDasharray: "1.5 1.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "38",
    y: "22",
    className: "map-label"
  }, "\uC11C\uC6B8\xB7\uACBD\uAE30"), /*#__PURE__*/React.createElement("text", {
    x: "32",
    y: "42",
    className: "map-label"
  }, "\uCDA9\uCCAD"), /*#__PURE__*/React.createElement("text", {
    x: "44",
    y: "64",
    className: "map-label"
  }, "\uC804\uBD81"), /*#__PURE__*/React.createElement("text", {
    x: "68",
    y: "58",
    className: "map-label"
  }, "\uACBD\uBD81"), /*#__PURE__*/React.createElement("text", {
    x: "68",
    y: "80",
    className: "map-label"
  }, "\uACBD\uB0A8\xB7\uBD80\uC0B0")), /*#__PURE__*/React.createElement("div", {
    className: "map-pins"
  }, factories.map(f => {
    const isSel = f.id === selectedId;
    const isHov = f.id === hoveredId;
    const coord = getCityCoord(f.city) || f.coord || {
      x: 50,
      y: 50
    };
    const koreanProducts = (f.products || []).filter(p => /[가-힯]/.test(p));
    const tipItems = koreanProducts.length > 0 ? koreanProducts : f.materials || [];
    return /*#__PURE__*/React.createElement("button", {
      key: f.id,
      className: `map-pin ${isSel ? 'is-selected' : ''} ${isHov ? 'is-hovered' : ''}`,
      style: {
        left: `${coord.x}%`,
        top: `${coord.y}%`
      },
      onClick: () => onPin(f.id),
      onMouseEnter: () => setTip({
        f,
        x: coord.x,
        y: coord.y,
        tipItems
      }),
      onMouseLeave: () => setTip(null),
      "aria-label": f.name
    }, /*#__PURE__*/React.createElement("span", {
      className: "map-pin-dot"
    }), /*#__PURE__*/React.createElement("span", {
      className: "map-pin-label"
    }, f.name));
  }), tip && /*#__PURE__*/React.createElement("div", {
    className: "map-pin-tip",
    style: {
      left: `${Math.min(tip.x + 2, 68)}%`,
      top: `${Math.max(tip.y - 14, 2)}%`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-pin-tip-name"
  }, tip.f.name), tip.f.city && /*#__PURE__*/React.createElement("div", {
    className: "map-pin-tip-city"
  }, tip.f.city), tip.tipItems.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "map-pin-tip-products"
  }, tip.tipItems.slice(0, 3).join(' · ')))), /*#__PURE__*/React.createElement("div", {
    className: "map-ctrl"
  }, /*#__PURE__*/React.createElement("button", {
    className: "map-ctrl-btn",
    "aria-label": "\uD655\uB300"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    className: "map-ctrl-sep"
  }), /*#__PURE__*/React.createElement("button", {
    className: "map-ctrl-btn",
    "aria-label": "\uCD95\uC18C"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "map-attr"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 FactoryMatch Maps"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\uB3C4\uB85C \uB370\uC774\uD130 \uAE30\uC900")));
};

// Singleton loader for Google Maps JS API
let _mapsApiPromise = null;
// Module-level geocode cache: address string → {lat, lng} | null
const _geocodeCache = new Map();
function _loadMapsApi(key) {
  if (_mapsApiPromise) return _mapsApiPromise;
  _mapsApiPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    window.__gmapsCallback = resolve;
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__gmapsCallback&language=ko`;
    s.async = true;
    s.onerror = () => {
      _mapsApiPromise = null;
      reject(new Error('Maps API load failed'));
    };
    document.head.appendChild(s);
  });
  return _mapsApiPromise;
}

// Google Maps JS API panel — native Markers (follow pan/zoom)
function ListMapPanel({
  geoFactories,
  pagedFactories,
  selectedFactory,
  mapsKey,
  onOpenFactory
}) {
  const mapDivRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const clustererRef = React.useRef(null); // MarkerClusterer instance
  const markersRef = React.useRef([]); // pre-geocoded (geoFactories)
  const dynMarkersRef = React.useRef([]); // dynamically geocoded (pagedFactories)
  const selectedMarkerRef = React.useRef(null); // highlighted pin for selected card
  const infoWindowRef = React.useRef(null);
  const onOpenRef = React.useRef(onOpenFactory);
  const [mapReady, setMapReady] = React.useState(false);
  React.useEffect(() => {
    onOpenRef.current = onOpenFactory;
  }, [onOpenFactory]);

  // Load API once, init map
  React.useEffect(() => {
    if (!MAPS_ENABLED || !mapsKey) return;
    _loadMapsApi(mapsKey).then(() => {
      if (!mapDivRef.current || mapRef.current) return;
      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center: {
          lat: 36.5,
          lng: 127.5
        },
        zoom: 7,
        gestureHandling: 'greedy'
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
    window.__omf = id => onOpenRef.current(id);
    const pagedIds = new Set((pagedFactories || []).map(f => f.id));
    const newMarkers = [];
    (geoFactories || []).filter(f => f.lat != null && f.lng != null).forEach(f => {
      const isCurrentPage = pagedIds.has(f.id);
      // No 'map' prop — clusterer manages visibility
      const marker = new google.maps.Marker({
        position: {
          lat: f.lat,
          lng: f.lng
        },
        title: f.name,
        icon: isCurrentPage ? {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        } : {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#94a3b8',
          fillOpacity: 0.7,
          strokeColor: '#ffffff',
          strokeWeight: 1.5
        }
      });
      marker.addListener('click', () => {
        if (!window._factoryCache) window._factoryCache = {};
        window._factoryCache[f.id] = f;
        const safeId = f.id.toString().replace(/'/g, "\\'");
        infoWindowRef.current.setContent(`<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">` + `<div style="font-weight:600;font-size:13px;margin-bottom:2px">${f.name}</div>` + `<div style="font-size:12px;color:#555;margin-bottom:6px">${f.city}</div>` + `<button onclick="window.__omf('${safeId}')" style="font-size:12px;padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:4px;cursor:pointer">상세보기</button>` + `</div>`);
        infoWindowRef.current.open(mapRef.current, marker);
      });
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

  // Dynamic geocoding — pagedFactories without pre-geocoded coords
  React.useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    dynMarkersRef.current.forEach(m => m.setMap(null));
    dynMarkersRef.current = [];
    if (!pagedFactories || !pagedFactories.length) return;

    // Skip factories already covered by geoFactories markers
    const geoIds = new Set((geoFactories || []).map(f => f.id));
    const toCode = pagedFactories.filter(f => !geoIds.has(f.id) && f.lat == null && (f.roadAddress || f.address));
    if (!toCode.length) return;
    const geocoder = new google.maps.Geocoder();
    const addDyn = (f, lat, lng) => {
      if (!mapRef.current) return;
      const marker = new google.maps.Marker({
        position: {
          lat,
          lng
        },
        map: mapRef.current,
        title: f.name
      });
      marker.addListener('click', () => {
        if (!window._factoryCache) window._factoryCache = {};
        window._factoryCache[f.id] = f;
        const safeId = f.id.toString().replace(/'/g, "\\'");
        infoWindowRef.current.setContent(`<div style="font-family:sans-serif;padding:4px 6px;min-width:140px">` + `<div style="font-weight:600;font-size:13px;margin-bottom:2px">${f.name}</div>` + `<div style="font-size:12px;color:#555;margin-bottom:6px">${_addrCity(f.roadAddress) || f.city}</div>` + `<button onclick="window.__omf('${safeId}')" style="font-size:12px;padding:4px 10px;background:#2563eb;color:#fff;border:none;border-radius:4px;cursor:pointer">상세보기</button>` + `</div>`);
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
        geocoder.geocode({
          address: addr
        }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            // Validate Korea bounds before using
            if (lat >= 33.0 && lat <= 38.9 && lng >= 124.5 && lng <= 132.0) {
              _geocodeCache.set(addr, {
                lat,
                lng
              });
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
        position: {
          lat,
          lng
        },
        map: mapRef.current,
        title: selectedFactory.name,
        animation: google.maps.Animation.DROP,
        zIndex: 1000
      });
    };
    if (selectedFactory) {
      hideAllMarkers();
      if (selectedFactory.lat != null && selectedFactory.lng != null) {
        mapRef.current.panTo({
          lat: selectedFactory.lat,
          lng: selectedFactory.lng
        });
        mapRef.current.setZoom(14);
        placeSelectedPin(selectedFactory.lat, selectedFactory.lng);
      } else {
        new google.maps.Geocoder().geocode({
          address: selectedFactory.roadAddress || selectedFactory.address || `${selectedFactory.name} ${selectedFactory.city}`
        }, (res, status) => {
          if (status === 'OK' && res[0]) {
            const loc = res[0].geometry.location;
            mapRef.current.panTo(loc);
            mapRef.current.setZoom(14);
            placeSelectedPin(loc.lat(), loc.lng());
          }
        });
      }
    } else {
      showAllMarkers();
      mapRef.current.panTo({
        lat: 36.5,
        lng: 127.5
      });
      mapRef.current.setZoom(7);
    }
  }, [mapReady, selectedFactory]);
  if (!MAPS_ENABLED || !mapsKey) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 8,
        color: 'var(--ink-3)',
        fontSize: 13,
        background: 'var(--bg-soft)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 20,
      stroke: 1.6
    }), /*#__PURE__*/React.createElement("span", null, "\uC9C0\uB3C4 \uC900\uBE44 \uC911"));
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: mapDivRef,
    style: {
      width: '100%',
      height: '100%'
    }
  });
}
const ManufacturerCardSkeleton = () => /*#__PURE__*/React.createElement("article", {
  className: "mcard mcard-skeleton"
}, /*#__PURE__*/React.createElement("div", {
  className: "mcard-img sk-block"
}), /*#__PURE__*/React.createElement("div", {
  className: "mcard-body",
  style: {
    pointerEvents: 'none'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "mcard-head"
}, /*#__PURE__*/React.createElement("div", {
  className: "mcard-titles"
}, /*#__PURE__*/React.createElement("div", {
  className: "sk-block sk-name"
}), /*#__PURE__*/React.createElement("div", {
  className: "sk-block sk-sub"
}))), /*#__PURE__*/React.createElement("div", {
  className: "sk-block sk-tags"
}), /*#__PURE__*/React.createElement("div", {
  className: "sk-block sk-desc"
}), /*#__PURE__*/React.createElement("div", {
  className: "sk-block sk-desc",
  style: {
    width: '65%'
  }
})));
Object.assign(window, {
  Icon,
  Header,
  Badge,
  Chip,
  ManufacturerCard,
  KoreaMap
});

// 페이지: Home, List, Detail, RFQ, MyPage

const {
  useState: useStateP,
  useMemo: useMemoP,
  useEffect: useEffectP
} = React;

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
const PLACEHOLDER_EXAMPLES = ["예: 사출 ABS 부품 100개", "예: CNC 알루미늄 가공", "예: 프레스 철판 가공", "예: 용접 SUS304 소량", "예: 판금 알루미늄 시제품"];
const SXGlyph = ({
  kind
}) => {
  const map = {
    metal: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 19h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 19V9l3-2 3 2v10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13 19v-7l3-2 3 2v7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 13h2M16 14h2"
    })),
    electronic: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "6",
      width: "18",
      height: "12",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "10",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "16",
      cy: "10",
      r: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 14h6M14 14h4"
    })),
    assembly: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 4v3M12 17v3M4 12h3M17 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"
    })),
    plastic: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 8h6l4 4-4 4H5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 12h5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11 8V5M11 19v-3"
    })),
    cooling: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3v18M5 7l14 10M5 17l14-10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 5l3-2 3 2M9 19l3 2 3-2"
    })),
    sheet: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "6",
      width: "16",
      height: "12",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 10h16M10 6v12"
    })),
    display: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4",
      width: "18",
      height: "14",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 21h6M12 18v3"
    })),
    payment: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "6",
      width: "18",
      height: "12",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 10h18M7 15h3"
    })),
    paint: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 14h10v6H5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 17l5-2v-4l-5-2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "6",
      r: "0.5",
      fill: "currentColor"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "9",
      r: "0.5",
      fill: "currentColor"
    }))
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
    let W = 0,
      H = 0;
    const mouse = {
      x: -9999,
      y: -9999
    };
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
          x,
          y,
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 2 + Math.random() * 2,
          a: 0.4 + Math.random() * 0.3,
          c: COLORS[Math.floor(Math.random() * COLORS.length)]
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
          p.vx += dx / d * f;
          p.vy += dy / d * f;
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
    const onMove = e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
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
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0
    }
  });
};
const HomePage = ({
  onSearch,
  onOpenFactory,
  density,
  authed,
  onGate,
  onNav
}) => {
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
    window._sb.from('factories').select('id', {
      count: 'estimated',
      head: true
    }).then(({
      count
    }) => {
      if (count != null) setFactoryCount(count);
    }).catch(() => {});
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
    window.logVisitor?.('search', {
      query
    });
    if (!authed) {
      onGate?.('search');
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('/.netlify/functions/ai-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query
        })
      });
      if (!resp.ok) throw new Error('API 오류');
      const data = await resp.json();
      data.topCategories = (data.topCategories || []).map((c, i) => ({
        glyph: 'metal',
        count: 0,
        avgLead: '협의',
        avgPrice: '협의',
        ...c,
        id: c.id || `ai-${i}`
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
            const {
              data: rows
            } = await window._sb.from('factories').select('*').in('id', ids);
            if (rows && rows.length) {
              const byId = {};
              rows.map(window._dbRowToFactory).forEach(f => {
                byId[f.id] = f;
              });
              details = matched.slice(0, 3).map(m => byId[m.id] ? {
                ...byId[m.id],
                _matchPct: m.matchPct
              } : null).filter(Boolean);
            }
          } catch (_) {}
        }
        if (!details.length) {
          const byId = {};
          ((window.MFG_DATA || {}).FACTORIES || []).forEach(f => {
            byId[f.id] = f;
          });
          details = matched.slice(0, 3).map(m => byId[m.id] ? {
            ...byId[m.id],
            _matchPct: m.matchPct
          } : null).filter(Boolean);
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
  const hasResults = !!aiResults;
  return /*#__PURE__*/React.createElement("div", {
    className: "page page-home"
  }, /*#__PURE__*/React.createElement(ParticleCanvas, null), /*#__PURE__*/React.createElement("div", {
    className: `home-hero ${hasResults ? 'home-hero-compact' : ''}`
  }, !hasResults && /*#__PURE__*/React.createElement("h1", {
    className: "home-headline"
  }, "AI\uAC00 \uCC3E\uC544\uC8FC\uB294 \uC6B0\uB9AC \uD68C\uC0AC\uC5D0 \uB531 \uB9DE\uB294 ", /*#__PURE__*/React.createElement("span", {
    className: "home-headline-accent"
  }, "\uC81C\uC870\uACF5\uC7A5")), !hasResults && /*#__PURE__*/React.createElement("p", {
    className: "home-subline"
  }, HOME_SUBLINE), /*#__PURE__*/React.createElement("div", {
    className: "home-search-wrapper"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "home-search-input",
    value: q,
    onChange: e => setQ(e.target.value),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: e => {
      if (e.key === 'Enter') handleAiSearch();
    },
    placeholder: PLACEHOLDER_EXAMPLES[placeholderIndex]
  }), q && /*#__PURE__*/React.createElement("button", {
    className: "home-search-clear",
    onClick: () => setQ(''),
    "aria-label": "\uC9C0\uC6B0\uAE30"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 12,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("button", {
    className: "home-search-btn",
    onClick: handleAiSearch,
    disabled: loading
  }, loading ? /*#__PURE__*/React.createElement("span", {
    className: "home-search-spinner"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20,
    stroke: 2.2
  }))), loading && /*#__PURE__*/React.createElement("div", {
    className: "home-search-loading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "home-loading-spinner"
  }), /*#__PURE__*/React.createElement("span", null, "AI\uAC00 \uBD84\uC11D \uC911\u2026")), !hasResults && !loading && /*#__PURE__*/React.createElement("div", {
    className: "home-tag-row"
  }, HOME_TAGS.map(tag => /*#__PURE__*/React.createElement("button", {
    key: tag,
    className: "home-tag-pill",
    onClick: () => {
      setQ(tag);
    }
  }, tag))), !hasResults && !loading && /*#__PURE__*/React.createElement("div", {
    className: "home-stats-bar"
  }, "\uC804\uAD6D ", /*#__PURE__*/React.createElement("strong", null, factoryCount != null ? factoryCount.toLocaleString() + '개' : '217,054개'), " \uACF5\uC7A5 DB \xA0\xB7\xA0 ", /*#__PURE__*/React.createElement("strong", null, "1,192\uAC1C"), " \uC0AC\uC5C5\uC790 \uC778\uC99D")), hasResults && /*#__PURE__*/React.createElement("div", {
    className: "home-results"
  }, !loading && aiResults?.supplyChain?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-chain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-header"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 13,
    stroke: 2.4
  }), "\uACF5\uAE09\uB9DD \uBD84\uC11D", aiResults.intent && /*#__PURE__*/React.createElement("span", {
    className: "sx-supply-intent"
  }, "\xB7 ", aiResults.intent)), /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-steps"
  }, aiResults.supplyChain.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step-num"
  }, s.step), /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step-label"
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step-detail"
  }, s.detail)), i < aiResults.supplyChain.length - 1 && /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-arrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 16,
    stroke: 2
  })))))), !loading && matchedFactoryDetails.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sx-match-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-match-header"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement(Icon, {
    name: "factory",
    size: 15,
    stroke: 2
  }), "\uB9E4\uCE6D \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("span", {
    className: "sx-match-count"
  }, matchedFactoryDetails.length, "\uAC1C\uC0AC \uB9E4\uCE6D")), /*#__PURE__*/React.createElement("div", {
    className: "sx-match-grid"
  }, matchedFactoryDetails.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    className: "sx-match-card-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-match-score-badge",
    style: {
      background: f._matchPct >= 70 ? '#16a34a' : f._matchPct >= 50 ? '#d97706' : '#64748b'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-match-score-pct"
  }, f._matchPct, "%"), /*#__PURE__*/React.createElement("span", {
    className: "sx-match-score-label"
  }, "\uB9E4\uCE6D")), /*#__PURE__*/React.createElement(ManufacturerCard, {
    f: f,
    density: density,
    onOpen: id => {
      if (!window._factoryCache) window._factoryCache = {};
      window._factoryCache[id] = f;
      onOpenFactory?.(id);
    },
    compact: true
  }))))), !loading && consulting && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 14,
    stroke: 2.4
  }), "AI \uC0AC\uC804 \uCEE8\uC124\uD305"), /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-grid"
  }, consulting.unitCost && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-label"
  }, "\uC608\uC0C1 \uB2E8\uAC00"), /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-val"
  }, consulting.unitCost)), consulting.moqGuide && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-label"
  }, "\uCD5C\uC18C \uBC1C\uC8FC\uB7C9"), /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-val"
  }, consulting.moqGuide)), consulting.leadTime && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-label"
  }, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-val"
  }, consulting.leadTime)), consulting.budgetRange && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-label"
  }, "\uC608\uC0B0 \uBC94\uC704"), /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-val"
  }, consulting.budgetRange)), (consulting.certRequired || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-label"
  }, "\uD544\uC694 \uC778\uC99D"), /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-val"
  }, consulting.certRequired.join(' · '))), consulting.caution && /*#__PURE__*/React.createElement("div", {
    className: "sx-consulting-item sx-consulting-caution"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-label"
  }, "\uC8FC\uC758\uC0AC\uD56D"), /*#__PURE__*/React.createElement("span", {
    className: "sx-consulting-val"
  }, consulting.caution)))), !loading && aiResults?.topCategories?.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner is-on"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 16,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\"", q, "\""), "\uC5D0 \uAC00\uC7A5 \uC801\uD569\uD55C ", /*#__PURE__*/React.createElement("strong", null, "3\uAC1C \uCE74\uD14C\uACE0\uB9AC"), "\uB97C \uCD94\uCD9C\uD588\uC2B5\uB2C8\uB2E4 \xB7 \uB9E4\uCE6D\uB960\xB7\uAC70\uB798\uB7C9\xB7\uB9AC\uB4DC\uD0C0\uC784 \uC885\uD569 \uBD84\uC11D"), /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-mode-pulse"
  }), "Claude AI")), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-h"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 16,
    stroke: 2.2
  }), "\uCD94\uCC9C \uCE74\uD14C\uACE0\uB9AC")), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-grid"
  }, aiResults.topCategories.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.id || i,
    className: "sx-rec",
    onClick: () => onSearch?.(r.title)
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-rank"
  }, "RANK ", /*#__PURE__*/React.createElement("strong", null, "0", i + 1)), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-glyph"
  }, /*#__PURE__*/React.createElement(SXGlyph, {
    kind: r.glyph
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-title-row"
  }, /*#__PURE__*/React.createElement("h3", null, r.title), /*#__PURE__*/React.createElement("span", {
    className: "sx-rec-match"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 9,
    stroke: 2.6
  }), "\uB9E4\uCE6D ", r.match, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-4)',
      fontFamily: 'var(--font-num)',
      marginTop: 2,
      fontWeight: 500
    }
  }, r.en)), /*#__PURE__*/React.createElement("p", {
    className: "sx-rec-desc"
  }, r.desc), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-tags"
  }, (r.tags || []).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "sx-rec-tag"
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-count"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-rec-count-n"
  }, r.count), /*#__PURE__*/React.createElement("span", {
    className: "sx-rec-count-l"
  }, "\uAC1C\uC0AC")), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-stats-meta"
  }, r.avgLead && /*#__PURE__*/React.createElement("span", null, "\uD3C9\uADE0 \uB9AC\uB4DC ", /*#__PURE__*/React.createElement("strong", null, r.avgLead)), r.avgPrice && /*#__PURE__*/React.createElement("span", null, "\uB2E8\uAC00 ", /*#__PURE__*/React.createElement("strong", null, r.avgPrice)))), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-cta"
  }, /*#__PURE__*/React.createElement("span", null, "\uC81C\uC870\uC0AC \uB354 \uBCF4\uAE30"), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 15,
    stroke: 2.4,
    className: "sx-rec-cta-arrow"
  }))))))));
};

// ══════════════════════════════════════════════════════════
// GRANTS SHARED
// ══════════════════════════════════════════════════════════

const GRANT_CATS = ['전체', '설비투자', '수출지원', '고용', '기술개발', '기타'];
const GRANT_CAT_COLOR = {
  설비투자: {
    bg: '#eff6ff',
    color: '#1d4ed8'
  },
  수출지원: {
    bg: '#f0fdf4',
    color: '#15803d'
  },
  고용: {
    bg: '#fdf4ff',
    color: '#7e22ce'
  },
  기술개발: {
    bg: '#fff7ed',
    color: '#c2410c'
  },
  기타: {
    bg: '#f1f5f9',
    color: '#64748b'
  }
};
function calcDday(deadline) {
  if (!deadline) return null;
  // Handle both YYYY-MM-DD and YYYYMMDD
  const normalized = String(deadline).length === 8 ? `${deadline.slice(0, 4)}-${deadline.slice(4, 6)}-${deadline.slice(6, 8)}` : deadline;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(normalized + 'T00:00:00');
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff < 0) return {
    label: '마감',
    urgent: false,
    expired: true
  };
  if (diff === 0) return {
    label: 'D-day',
    urgent: true,
    expired: false
  };
  return {
    label: `D-${diff}`,
    urgent: diff <= 7,
    expired: false
  };
}
function _stripHtml(html) {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<\/div>/gi, '\n').replace(/<\/li>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&[a-zA-Z0-9#]+;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

// 날짜 문자열을 YYYYMMDD 8자리로 정규화 (YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD 모두 처리)
function _normDate(v) {
  if (!v) return '';
  const s = String(v).trim();
  // YYYY-MM-DD 또는 YYYY/MM/DD
  const m = s.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})/);
  if (m) return m[1] + m[2] + m[3];
  // YYYYMMDD
  if (/^\d{8}$/.test(s)) return s;
  return '';
}
function _biz(item) {
  // reqstBeginEndDe: "20260101~20260531" 또는 "2026.01.01~2026.05.31" 형태 파싱
  let combinedStt = '',
    combinedEnd = '';
  if (item.reqstBeginEndDe) {
    const raw = String(item.reqstBeginEndDe);
    const parts = raw.split(/[~\-]/);
    if (parts.length >= 2) {
      combinedStt = _normDate(parts[0].trim());
      combinedEnd = _normDate(parts[parts.length - 1].trim());
    } else {
      combinedEnd = _normDate(raw.trim());
    }
  }

  // 날짜 자동 탐지: YYYYMMDD or YYYY-MM-DD 형식의 필드를 오름차순 정렬해 시작/종료일 추정
  const dateFlds = Object.entries(item).map(([k, v]) => [k, _normDate(v)]).filter(([, v]) => v.length === 8).sort(([, a], [, b]) => a < b ? -1 : 1);
  const autoStt = dateFlds[0]?.[1] || '';
  const autoEnd = dateFlds[dateFlds.length - 1]?.[1] || '';

  // 날짜 필드 추출 헬퍼
  const _d = (...keys) => {
    for (const k of keys) {
      const v = _normDate(item[k]);
      if (v) return v;
    }
    return '';
  };
  return {
    title: item.pblancNm || item.pbancNm || item.bizNm || item.sprtBizNm || '',
    org: item.mnofcDeptNm || item.jrsdInsttNm || item.instNm || item.sprtInsttNm || item.orgnNm || item.deptNm || '',
    execOrg: item.rcvAcptInsttNm || item.prgrsInsttNm || item.operInsttNm || item.execInsttNm || '',
    cat: item.bizSectCdNm || item.sprtFldNm || item.lclasNm || item.lclasSe || item.sectNm || item.fldNm || item.ctgryNm || '',
    desc: item.bsnsSumryCn || item.pblancDtlCn || item.smryCn || item.bizDtlCn || item.dtlCn || item.bizOvrvcCn || '',
    method: item.rcptMthdCdNm || item.applyMthdNm || item.rcptMthd || item.applyMthd || '',
    contact: item.mainCntcInsttNm || item.chargerNm || item.cntcNm || item.telNm || item.cntcTelno || '',
    target: item.sprtTrgetNm || item.trgetNm || item.sprtObjNm || item.sprtTrget || '',
    // 신청기간: reqstBeginEndDe(합산필드) 최우선 → 개별 필드 → 자동 탐지
    sttDate: combinedStt || _d('rcptBgnDe', 'pbancBgngDt', 'bizPbancBgngDe', 'rcptSttDate', 'sprtSttDate', 'applyBgngDe', 'applyStDt', 'rcptBgngDe', 'pbancBgngDe', 'bizApplyBgngDe') || autoStt,
    endDate: combinedEnd || _d('rcptEndDe', 'pbancEndDt', 'bizPbancEndDe', 'rcptEndDate', 'sprtEndDate', 'applyEndDe', 'applyEdDt', 'pbancEndDe', 'bizApplyEndDe') || autoEnd,
    applyUrl: item.pbancUrl || item.pblancUrl || item.applyUrl || item.detailUrl || item.hmpgUrl || '',
    viewUrl: item.pblancUrl || item.pbancUrl || item.hmpgUrl || '',
    no: item.pblancNo || item.pblancId || item.bizId || item.pbancId || '',
    regDate: _d('rgstDt', 'rgstDate', 'registDt', 'creatDt', 'frstRegistDt')
  };
}
function _hashViews(id) {
  if (!id) return 120;
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = Math.imul(h, 31) + s.charCodeAt(i) >>> 0;
  // 10% 확률로 인기글 (1100~1300), 나머지 50~800
  if (h % 10 === 0) return h % 200 + 1100;
  return h % 751 + 50;
}
const GrantCard = ({
  g,
  authed,
  onNav
}) => {
  const dday = calcDday(g.deadline);
  const catStyle = GRANT_CAT_COLOR[g.category] || GRANT_CAT_COLOR['기타'];
  const [gateOpen, setGateOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "grant-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grant-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "grant-org"
  }, g.organization), /*#__PURE__*/React.createElement("span", {
    className: "grant-cat-badge",
    style: {
      background: catStyle.bg,
      color: catStyle.color
    }
  }, g.category)), /*#__PURE__*/React.createElement("h3", {
    className: "grant-title"
  }, g.title), /*#__PURE__*/React.createElement("div", {
    className: "grant-card-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grant-meta"
  }, g.amount && /*#__PURE__*/React.createElement("span", {
    className: "grant-amount"
  }, g.amount)), /*#__PURE__*/React.createElement("div", {
    className: "grant-foot-right"
  }, dday && !dday.expired && /*#__PURE__*/React.createElement("span", {
    className: `grant-dday${dday.urgent ? ' is-urgent' : ''}`
  }, dday.label), g.url && (authed ? /*#__PURE__*/React.createElement("a", {
    href: g.url,
    target: "_blank",
    rel: "noreferrer",
    className: "grant-link-btn"
  }, "\uC790\uC138\uD788 \uBCF4\uAE30") : /*#__PURE__*/React.createElement("button", {
    className: "grant-link-btn",
    onClick: () => setGateOpen(true)
  }, "\uC790\uC138\uD788 \uBCF4\uAE30")))), gateOpen && /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-veil",
    onClick: () => setGateOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "grant-gate-close",
    onClick: () => setGateOpen(false)
  }, "\u2715"), /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-icon"
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("p", {
    className: "grant-gate-msg"
  }, "\uC9C0\uC6D0\uC0AC\uC5C5 \uC0C1\uC138 \uC815\uBCF4\uB294", /*#__PURE__*/React.createElement("br", null), "\uD68C\uC6D0\uB9CC \uD655\uC778 \uAC00\uB2A5\uD569\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "grant-gate-signup",
    onClick: () => {
      setGateOpen(false);
      onNav?.('signup');
    }
  }, "\uBB34\uB8CC\uB85C \uC2DC\uC791\uD558\uAE30"), /*#__PURE__*/React.createElement("button", {
    className: "grant-gate-login",
    onClick: () => {
      setGateOpen(false);
      onNav?.('login');
    }
  }, "\uB85C\uADF8\uC778")))));
};

// ──────────────────────────────────────────────────────────
// 공공데이터 기업마당 API (bizinfo.go.kr)
// ──────────────────────────────────────────────────────────
const _BIZINFO_KEY = '2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7';
const _BIZINFO_URL = 'https://apis.data.go.kr/1421000/bizinfo/pblancBsnsService';
const BIZINFO_CATS = [{
  label: '전체',
  id: ''
}, {
  label: '기술',
  id: '01'
}, {
  label: '수출',
  id: '02'
}, {
  label: '금융',
  id: '03'
}, {
  label: '인력',
  id: '04'
}, {
  label: '창업',
  id: '05'
}, {
  label: '경영',
  id: '06'
}];
const BIZINFO_CAT_COLOR = {
  '기술': {
    bg: '#fff7ed',
    color: '#c2410c'
  },
  '수출': {
    bg: '#f0fdf4',
    color: '#15803d'
  },
  '금융': {
    bg: '#eff6ff',
    color: '#1d4ed8'
  },
  '인력': {
    bg: '#fdf4ff',
    color: '#7e22ce'
  },
  '창업': {
    bg: '#fef9c3',
    color: '#854d0e'
  },
  '경영': {
    bg: '#f1f5f9',
    color: '#475569'
  },
  '기타': {
    bg: '#f1f5f9',
    color: '#475569'
  }
};
const BIZINFO_RGNS = [{
  label: '전국',
  code: ''
}, {
  label: '서울',
  code: '11'
}, {
  label: '경기',
  code: '41'
}, {
  label: '인천',
  code: '28'
}, {
  label: '부산',
  code: '26'
}, {
  label: '대구',
  code: '27'
}, {
  label: '광주',
  code: '29'
}, {
  label: '대전',
  code: '30'
}, {
  label: '울산',
  code: '31'
}, {
  label: '경남',
  code: '48'
}, {
  label: '경북',
  code: '47'
}, {
  label: '전남',
  code: '46'
}, {
  label: '전북',
  code: '45'
}, {
  label: '충남',
  code: '44'
}, {
  label: '충북',
  code: '43'
}, {
  label: '강원',
  code: '42'
}, {
  label: '제주',
  code: '50'
}];
const STATUS_FILTERS = [{
  id: 'active',
  label: '진행중'
}, {
  id: 'urgent',
  label: '마감임박'
}, {
  id: 'all',
  label: '전체'
}, {
  id: 'closed',
  label: '마감'
}];
function _fmtDate8(s) {
  if (!s || String(s).length < 8) return s || '';
  return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
}
async function fetchBizInfo({
  pageNo = 1,
  numOfRows = 10,
  searchLclasId = '',
  searchRgnCode = ''
} = {}) {
  const params = new URLSearchParams({
    serviceKey: _BIZINFO_KEY,
    dataType: 'json',
    pageNo: String(pageNo),
    numOfRows: String(numOfRows)
  });
  if (searchLclasId) params.set('searchLclasId', searchLclasId);
  if (searchRgnCode) params.set('searchRgnCode', searchRgnCode);
  const res = await fetch(`${_BIZINFO_URL}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const body = json?.response?.body;
  // body.items.item / body.items / body.item 세 가지 구조 모두 처리
  const raw = body?.items ?? body?.item;
  let items = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw?.item) {
    items = Array.isArray(raw.item) ? raw.item : [raw.item];
  } else if (raw && typeof raw === 'object') {
    items = [raw];
  }
  if (items.length > 0) {
    window._bizInfoRaw = items[0]; // 브라우저 콘솔: _bizInfoRaw 로 확인
    console.log('[BizInfo] 필드명:', Object.keys(items[0]));
    console.log('[BizInfo] 첫 아이템:', items[0]);
  }
  // 마감일 기준 내림차순 정렬: 진행중(미래) 공고가 먼저, 마감(과거) 공고가 나중
  items.sort((a, b) => {
    const ea = _normDate(a.rcptEndDe || a.pbancEndDt || a.rcptEndDate || a.sprtEndDate || '');
    const eb = _normDate(b.rcptEndDe || b.pbancEndDt || b.rcptEndDate || b.sprtEndDate || '');
    if (!ea && !eb) return 0;
    if (!ea) return 1;
    if (!eb) return -1;
    return ea > eb ? -1 : 1;
  });
  return {
    total: Number(body?.totalCount ?? 0),
    items
  };
}
const BizGrantCard = ({
  item,
  authed,
  onNav,
  compact
}) => {
  // 필드명 변형 대응: 공공데이터포털 API 응답 필드는 버전마다 다를 수 있음
  const title = item.pblancNm || item.pbancNm || item.bizNm || item.sprtBizNm || '(제목 없음)';
  const org = item.mnofcDeptNm || item.jrsdInsttNm || item.instNm || item.sprtInsttNm || '';
  const catName = item.bizSectCdNm || item.sprtFldNm || item.lclasNm || item.sectNm || '';
  const desc = item.bsnsSumryCn || item.pblancDtlCn || item.smryCn || item.bizDtlCn || '';
  const sttDate = item.rcptSttDate || item.sprtSttDate || item.applyStDt || '';
  const endDate = item.rcptEndDate || item.sprtEndDate || item.applyEdDt || item.pbancEndDt || '';
  const url = item.pbancUrl || item.pblancUrl || item.detailUrl || item.hmpgUrl || '';
  const pblancNo = item.pblancNo || item.pblancId || item.bizId || '';
  const dday = calcDday(endDate);
  const catStyle = BIZINFO_CAT_COLOR[catName] || {
    bg: '#f1f5f9',
    color: '#475569'
  };
  const [gateOpen, setGateOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "grant-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grant-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "grant-org"
  }, org || '중소벤처기업부'), catName && /*#__PURE__*/React.createElement("span", {
    className: "grant-cat-badge",
    style: {
      background: catStyle.bg,
      color: catStyle.color
    }
  }, catName)), /*#__PURE__*/React.createElement("h3", {
    className: "grant-title"
  }, title), !compact && desc && /*#__PURE__*/React.createElement("p", {
    className: "grant-desc biz-grant-desc"
  }, desc), !compact && (sttDate || endDate) && /*#__PURE__*/React.createElement("p", {
    className: "biz-grant-period"
  }, sttDate && endDate ? `신청기간: ${_fmtDate8(sttDate)} ~ ${_fmtDate8(endDate)}` : endDate ? `마감: ${_fmtDate8(endDate)}` : ''), /*#__PURE__*/React.createElement("div", {
    className: "grant-card-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grant-meta"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grant-foot-right"
  }, dday && !dday.expired && /*#__PURE__*/React.createElement("span", {
    className: `grant-dday${dday.urgent ? ' is-urgent' : ''}`
  }, dday.label), url && (authed ? /*#__PURE__*/React.createElement("a", {
    href: url,
    target: "_blank",
    rel: "noreferrer",
    className: "grant-link-btn"
  }, "\uC790\uC138\uD788 \uBCF4\uAE30") : /*#__PURE__*/React.createElement("button", {
    className: "grant-link-btn",
    onClick: () => setGateOpen(true)
  }, "\uC790\uC138\uD788 \uBCF4\uAE30")))), !compact && /*#__PURE__*/React.createElement("p", {
    className: "biz-grant-source"
  }, "\uCD9C\uCC98: \uC911\uC18C\uBCA4\uCC98\uAE30\uC5C5\uBD80 \uAE30\uC5C5\uB9C8\uB2F9 (bizinfo.go.kr)"), gateOpen && /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-veil",
    onClick: () => setGateOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "grant-gate-close",
    onClick: () => setGateOpen(false)
  }, "\u2715"), /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-icon"
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("p", {
    className: "grant-gate-msg"
  }, "\uC9C0\uC6D0\uC0AC\uC5C5 \uC0C1\uC138 \uC815\uBCF4\uB294", /*#__PURE__*/React.createElement("br", null), "\uD68C\uC6D0\uB9CC \uD655\uC778 \uAC00\uB2A5\uD569\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("div", {
    className: "grant-gate-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "grant-gate-signup",
    onClick: () => {
      setGateOpen(false);
      onNav?.('signup');
    }
  }, "\uBB34\uB8CC\uB85C \uC2DC\uC791\uD558\uAE30"), /*#__PURE__*/React.createElement("button", {
    className: "grant-gate-login",
    onClick: () => {
      setGateOpen(false);
      onNav?.('login');
    }
  }, "\uB85C\uADF8\uC778")))));
};
const GrantsHomeSection = ({
  onNav,
  authed,
  compact
}) => {
  const [items, setItems] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    fetchBizInfo({
      pageNo: 1,
      numOfRows: 10
    }).then(({
      items
    }) => {
      const getEnd = it => it.rcptEndDate || it.sprtEndDate || it.applyEdDt || it.pbancEndDt || '';
      const sorted = [...items].filter(it => getEnd(it)).sort((a, b) => String(getEnd(a)).localeCompare(String(getEnd(b))));
      setItems((sorted.length ? sorted : items).slice(0, 3));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);
  if (!loaded || items.length === 0) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: `grants-home-section${compact ? ' is-compact' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-home-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-home-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "grants-home-title"
  }, "\uC81C\uC870\uAE30\uC5C5\uC744 \uC704\uD55C \uC815\uBD80\uC9C0\uC6D0\uAE08 \xB7 \uBCF4\uC870\uAE08 \uC815\uBCF4"), /*#__PURE__*/React.createElement("button", {
    className: "grants-all-btn",
    onClick: () => onNav('grants')
  }, "\uC804\uCCB4 \uC9C0\uC6D0\uC0AC\uC5C5 \uBCF4\uAE30 \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "grants-card-grid"
  }, items.map((item, i) => /*#__PURE__*/React.createElement(BizGrantCard, {
    key: item.pblancNo || i,
    item: item,
    authed: authed,
    onNav: onNav,
    compact: true
  })))));
};

// ══════════════════════════════════════════════════════════
// LIST + MAP
// ══════════════════════════════════════════════════════════

// Persists filter state across unmount/remount (e.g. List → Detail → List)
let _listStateCache = null;
const INDUSTRY_CATS = [{
  id: 'metal',
  label: '금속/기계',
  industryId: 'machine',
  korKws: ['금속', '기계', '장비', '철강', '1차 금속', '주조', '단조', '프레스', '용접', '도장', '도금', '표면처리', '조선', '자동차', '금형'],
  subs: [{
    id: 'cnc',
    label: 'CNC 가공',
    pids: ['cnc', 'cutting']
  }, {
    id: 'press',
    label: '프레스',
    pids: ['press']
  }, {
    id: 'welding',
    label: '용접',
    pids: ['welding']
  }, {
    id: 'forging',
    label: '단조',
    pids: []
  }, {
    id: 'casting',
    label: '주조',
    pids: []
  }, {
    id: 'heat',
    label: '열처리',
    pids: []
  }, {
    id: 'painting',
    label: '도장',
    pids: ['painting']
  }]
}, {
  id: 'electronics',
  label: '전자/PCB',
  industryId: 'electronics',
  korKws: ['전자', '반도체', 'PCB', '전기', '전장', '컴퓨터', '영상', '음향', '통신', '광학기기'],
  subs: [{
    id: 'pcb',
    label: 'PCB 조립',
    pids: []
  }, {
    id: 'smt',
    label: 'SMT',
    pids: []
  }, {
    id: 'semicon',
    label: '반도체',
    pids: []
  }, {
    id: 'eparts',
    label: '전장부품',
    pids: []
  }]
}, {
  id: 'plastic',
  label: '플라스틱/고무',
  industryId: null,
  korKws: ['플라스틱', '고무', '합성수지', '사출', '압출', '실리콘', '비금속', '유리', '도자'],
  subs: [{
    id: 'injection',
    label: '사출',
    pids: ['injection']
  }, {
    id: 'mold',
    label: '금형',
    pids: ['mold']
  }, {
    id: 'extrusion',
    label: '압출',
    pids: []
  }, {
    id: 'silicone',
    label: '실리콘',
    pids: []
  }]
}, {
  id: 'textile',
  label: '섬유/봉제',
  industryId: 'textile',
  korKws: ['섬유', '봉제', '직물', '의류', '의복', '신발', '가죽', '모피', '편직'],
  subs: [{
    id: 'sewing',
    label: '봉제',
    pids: []
  }, {
    id: 'dyeing',
    label: '나염',
    pids: []
  }, {
    id: 'embroid',
    label: '자수',
    pids: []
  }, {
    id: 'notions',
    label: '단추/부자재',
    pids: []
  }, {
    id: 'knit',
    label: '니트',
    pids: []
  }]
}, {
  id: 'food',
  label: '식품',
  industryId: 'food',
  korKws: ['식료품', '식품', '음료', '주류', '담배', '제과', '도축', '수산'],
  subs: [{
    id: 'foodproc',
    label: '식품가공',
    pids: []
  }, {
    id: 'foodpack',
    label: '포장',
    pids: []
  }, {
    id: 'foodoem',
    label: 'OEM식품',
    pids: []
  }, {
    id: 'haccp',
    label: 'HACCP',
    pids: []
  }]
}, {
  id: 'chemical',
  label: '화학/소재',
  industryId: 'chemical',
  korKws: ['화학', '도료', '비료', '의약', '석유', '코크스', '접착', '화장품', '세제'],
  subs: [{
    id: 'plating',
    label: '도금',
    pids: []
  }, {
    id: 'coating',
    label: '코팅',
    pids: []
  }, {
    id: 'chemproc',
    label: '화학처리',
    pids: []
  }]
}, {
  id: 'wood',
  label: '목재/가구',
  industryId: null,
  korKws: ['목재', '가구', '나무', '종이', '펄프', '인테리어'],
  subs: [{
    id: 'woodwork',
    label: '목공',
    pids: []
  }, {
    id: 'furniture',
    label: '가구',
    pids: []
  }, {
    id: 'interior',
    label: '인테리어 자재',
    pids: []
  }]
}, {
  id: 'print',
  label: '인쇄/포장',
  industryId: null,
  korKws: ['인쇄', '출판', '포장', '라벨'],
  subs: [{
    id: 'printing',
    label: '인쇄',
    pids: []
  }, {
    id: 'packaging',
    label: '패키지',
    pids: []
  }, {
    id: 'label',
    label: '라벨',
    pids: []
  }]
}, {
  id: 'other',
  label: '기타',
  industryId: null,
  korKws: ['재활용', '폐기물', '수리', '조립'],
  subs: [{
    id: 'assemblyX',
    label: '조립',
    pids: ['assembly']
  }, {
    id: 'logistics',
    label: '물류포장',
    pids: []
  }, {
    id: 'etcX',
    label: '기타',
    pids: []
  }]
}];

// Region ID → DB region column values (for Supabase server-side filter)
const _REGION_TO_DB_VALS = {
  seoul: ['서울특별시'],
  gyeonggi: ['경기도', 'gyeonggi'],
  incheon: ['인천광역시'],
  busan: ['부산광역시'],
  daegu: ['대구광역시'],
  gyeongnam: ['경상남도', 'gyeongnam'],
  gyeongbuk: ['경상북도'],
  chungnam: ['충청남도'],
  chungbuk: ['충청북도'],
  daejeon: ['대전광역시'],
  sejong: ['세종특별자치시'],
  gwangju: ['광주광역시'],
  jeonnam: ['전라남도'],
  jeonbuk: ['전북특별자치도', '전라북도'],
  gangwon: ['강원특별자치도', '강원도'],
  ulsan: ['울산광역시'],
  jeju: ['제주특별자치도', '제주도']
};
const _applyRegionFilter = (q, regionId) => {
  if (regionId === 'other') return q.is('region', null);
  const vals = _REGION_TO_DB_VALS[regionId];
  if (!vals) return q;
  return vals.length === 1 ? q.eq('region', vals[0]) : q.in('region', vals);
};
const _scrollListToTop = () => {
  requestAnimationFrame(() => {
    const el = document.querySelector('.list-results');
    if (el) el.scrollTop = 0;else window.scrollTo(0, 0);
  });
};
const ListPage = ({
  onOpenFactory,
  onAddRFQ,
  rfqIds,
  density,
  initialQuery
}) => {
  const {
    PROCESSES
  } = window.MFG_DATA;
  const [factories, setFactories] = useStateP(() => window._listFactoriesCache || []);
  const [dbLoading, setDbLoading] = useStateP(() => !(window._listFactoriesCache?.length > 0));
  const [dbError, setDbError] = useStateP(null);
  const [dbTotalCount, setDbTotalCount] = useStateP(null);
  const [regionCounts, setRegionCounts] = useStateP({});
  const [geoFactories, setGeoFactories] = useStateP([]); // geocoded 공장 지도용
  const [regionRows, setRegionRows] = useStateP([]); // 지역 선택 시 서버사이드 로드
  const [regionLoading, setRegionLoading] = useStateP(false);
  const [showAllRegions, setShowAllRegions] = useStateP(false);
  const mapsKey = useMapsKey();

  // Restore filter state from cache, unless this is a fresh search from home
  const _prevInitialQuery = _listStateCache?.initialQuery;
  const _freshSearch = !!(initialQuery && initialQuery !== _prevInitialQuery);
  const [query, setQuery] = useStateP(_freshSearch ? initialQuery : _listStateCache?.query ?? initialQuery ?? '');
  const [activeProcess, setActiveProcess] = useStateP(_freshSearch ? 'all' : _listStateCache?.activeProcess ?? 'all');
  const [activeRegion, setActiveRegion] = useStateP(_freshSearch ? 'all' : _listStateCache?.activeRegion ?? 'all');
  const [moqMax, setMoqMax] = useStateP(_freshSearch ? 10000 : _listStateCache?.moqMax ?? 10000);
  const [oemOnly, setOemOnly] = useStateP(_freshSearch ? false : _listStateCache?.oemOnly ?? false);
  const [exportOnly, setExportOnly] = useStateP(_freshSearch ? false : _listStateCache?.exportOnly ?? false);
  const [sort, setSort] = useStateP(_freshSearch ? 'match' : _listStateCache?.sort ?? 'match');
  const [hovered, setHovered] = useStateP(null);
  const [selected, setSelected] = useStateP(null);
  const [page, setPage] = useStateP(_freshSearch ? 1 : _listStateCache?.page ?? 1);
  const PAGE_SIZE = 20;

  // Accordion state: which sections are open
  const [openSections, setOpenSections] = useStateP(() => new Set(['region', 'industry']));
  const toggleSection = id => setOpenSections(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  // Industry filter & category expand state
  const [activeIndustry, setActiveIndustry] = useStateP('all');
  const [openCats, setOpenCats] = useStateP(() => new Set());
  const toggleCat = id => setOpenCats(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const selectIndustry = id => {
    setActiveIndustry(prev => prev === id ? 'all' : id);
    // auto-expand the parent category when picking a subcategory
    for (const c of INDUSTRY_CATS) {
      if (c.id === id) {
        setOpenCats(prev => {
          const n = new Set(prev);
          n.add(id);
          return n;
        });
        break;
      }
      if (c.subs.some(s => s.id === id)) {
        setOpenCats(prev => {
          const n = new Set(prev);
          n.add(c.id);
          return n;
        });
        break;
      }
    }
  };
  useEffectP(() => {
    if (!window._sb) {
      setDbLoading(false);
      return;
    }
    let mounted = true;
    const PAGE = 1000;
    const MAX_LOAD = 2000; // 2페이지 로드 (쿼리 횟수 감소)

    // Fetch total DB count separately
    window._sb.from('factories').select('id', {
      count: 'estimated',
      head: true
    }).then(({
      count
    }) => {
      if (mounted && count != null) setDbTotalCount(count);
    }).catch(() => {});
    const loadPage = async (from, acc) => {
      // WHERE 절 없이 PK 순 정렬 → 플래너가 반드시 PK 인덱스 사용
      // hidden 필터는 클라이언트에서 처리
      const {
        data,
        error
      } = await window._sb.from('factories').select('*').order('completeness_score', {
        ascending: false
      }).order('id', {
        ascending: true
      }).range(from, from + PAGE - 1);
      if (!mounted) return;
      if (error) {
        setDbError(error.message);
        setDbLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        setFactories(acc.length > 0 ? acc : window.MFG_DATA.FACTORIES);
        setDbLoading(false);
        return;
      }
      // hidden=true 클라이언트 필터링
      const mapped = data.filter(r => !r.hidden).map(window._dbRowToFactory);
      const next = [...acc, ...mapped];
      if (data.length < PAGE || next.length >= MAX_LOAD) {
        const sorted = next.slice().sort((a, b) => (b.completeness_score || 0) - (a.completeness_score || 0) || (b.enrichedScore || 0) - (a.enrichedScore || 0) || (b.rating || 0) - (a.rating || 0));
        setFactories(sorted);
        setDbLoading(false);
        if (mounted) {
          const counts = {};
          sorted.forEach(f => {
            if (f.region) counts[f.region] = (counts[f.region] || 0) + 1;
          });
          setRegionCounts(counts);
        }
      } else {
        loadPage(from + PAGE, next);
      }
    };
    loadPage(0, []);
    return () => {
      mounted = false;
    };
  }, []);

  // 지도 핀 로드 — activeRegion 변경 시 재쿼리
  // 지역 선택: region + coord_x IS NOT NULL 조건으로 전체 페이지네이션 (제한 없음)
  // 전체 보기: 1,000개 제한 (전체 DB 규모 대비 합리적 샘플)
  useEffectP(() => {
    if (!window._sb) return;
    let mounted = true;
    setGeoFactories([]);
    if (activeRegion === 'all') {
      window._sb.from('factories').select('*').not('coord_x', 'is', null).not('coord_y', 'is', null).limit(1000).then(({
        data
      }) => {
        if (mounted && data) setGeoFactories(data.map(window._dbRowToFactory).filter(f => f.coord != null));
      }).catch(() => {});
    } else {
      const GEO_PAGE = 1000;
      const loadGeoPage = async (from, acc) => {
        let q = window._sb.from('factories').select('*').not('coord_x', 'is', null).not('coord_y', 'is', null).order('completeness_score', {
          ascending: false
        }).order('id', {
          ascending: true
        }).range(from, from + GEO_PAGE - 1);
        q = _applyRegionFilter(q, activeRegion);
        const {
          data,
          error
        } = await q;
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
    return () => {
      mounted = false;
    };
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
      let q = window._sb.from('factories').select('*').eq('hidden', false).order('completeness_score', {
        ascending: false
      }).order('id', {
        ascending: true
      }).range(from, from + PAGE - 1);
      q = _applyRegionFilter(q, activeRegion);
      const {
        data,
        error
      } = await q;
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
    return () => {
      mounted = false;
    };
  }, [activeRegion]);

  // 지역별 카운트 — get_region_counts() RPC 함수 단일 호출 (정확한 집계)
  useEffectP(() => {
    if (!window._sb) return;
    window._sb.rpc('get_region_counts').then(({
      data,
      error
    }) => {
      if (error || !data) return;
      const counts = {};
      data.forEach(row => {
        counts[row.region_id] = Number(row.cnt);
      });
      setRegionCounts(counts);
    }).catch(() => {});
  }, []);
  const filtered = useMemoP(() => {
    // Resolve industry filter
    let industryPids = null;
    let industryId = null;
    let catKorKws = []; // 한글 키워드 (KICOX 공장 매칭용)
    if (activeIndustry !== 'all') {
      const cat = INDUSTRY_CATS.find(c => c.id === activeIndustry);
      if (cat) {
        industryPids = cat.subs.flatMap(s => s.pids);
        industryId = cat.industryId;
        catKorKws = cat.korKws || [];
      } else {
        for (const c of INDUSTRY_CATS) {
          const sub = c.subs.find(s => s.id === activeIndustry);
          if (sub) {
            industryPids = sub.pids;
            industryId = null;
            catKorKws = c.korKws || []; // 서브카테고리는 부모 키워드 사용
            break;
          }
        }
      }
    }
    const KNOWN_REGIONS = new Set(['seoul', 'gyeonggi', 'incheon', 'busan', 'daegu', 'gyeongnam', 'gyeongbuk', 'chungnam', 'chungbuk', 'daejeon', 'sejong', 'gwangju', 'jeonnam', 'jeonbuk', 'gangwon', 'ulsan', 'jeju']);
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
        const pidMatch = industryPids && industryPids.length > 0 && industryPids.some(p => (f.processes || []).includes(p));
        // 2) industries 영문 ID 매칭 (영문 샘플 공장)
        const indMatch = industryId && (f.industries || []).includes(industryId);
        // 3) 한글 키워드 매칭: industries 배열 또는 summary 텍스트 (KICOX 공장)
        const korMatch = catKorKws.length > 0 && ((f.industries || []).some(ind => catKorKws.some(kw => ind.includes(kw))) || catKorKws.some(kw => (f.summary || '').includes(kw)));
        if (!pidMatch && !indMatch && !korMatch) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const hay = ((f.name || '') + (f.en || '') + (f.city || '') + (f.summary || '') + (f.materials || []).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);else if (sort === 'response') arr.sort((a, b) => a.responseHr - b.responseHr);else if (sort === 'deals') arr.sort((a, b) => b.deals - a.deals);else arr.sort((a, b) => b.rating * 50 + b.deals / 10 - (a.rating * 50 + a.deals / 10));
    return arr;
  }, [factories, regionRows, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query, activeIndustry]);

  // 지도 핀: 현재 페이지에 보이는 공장만 표시 + 결과 없으면 빈 배열
  const filteredGeoFactories = React.useMemo(() => {
    if (filtered.length === 0) return []; // 결과 없으면 핀 없애기
    // 현재 페이지 공장 중 좌표 있는 것 + geoFactories에서 현재 필터된 공장만
    const filteredIds = new Set(filtered.map(f => f.id));
    return geoFactories.filter(f => filteredIds.has(f.id));
  }, [geoFactories, filtered]);
  useEffectP(() => {
    setPage(1);
  }, [activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query, activeIndustry]);
  useEffectP(() => {
    _listStateCache = {
      initialQuery,
      query,
      activeProcess,
      activeRegion,
      moqMax,
      oemOnly,
      exportOnly,
      sort,
      page
    };
  }, [query, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, page]);

  // factories 데이터 캐시 저장
  useEffectP(() => {
    if (factories.length > 0) window._listFactoriesCache = factories;
  }, [factories]);

  // 목록으로 돌아왔을 때 페이지 번호 복원
  useEffectP(() => {
    if (window._listPageCache && window._listPageCache > 1) {
      setPage(window._listPageCache);
      window._listPageCache = null;
    } else {
      _scrollListToTop();
    }
  }, []);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedFactory = selected ? filtered.find(f => f.id === selected) : null;
  const hasFilter = !!(query || activeProcess !== 'all' || activeRegion !== 'all' || oemOnly || exportOnly || activeIndustry !== 'all');
  const otherFiltersActive = !!(query || activeProcess !== 'all' || oemOnly || exportOnly || activeIndustry !== 'all');
  // 지역만 선택됐을 때 → RPC 집계 카운트 표시 (DB 전체 기준)
  // 지역 + 다른 필터 → 클라이언트 필터된 카운트
  const displayTotal = activeRegion !== 'all' && !otherFiltersActive ? regionCounts[activeRegion] ?? filtered.length : hasFilter ? filtered.length : dbTotalCount ?? factories.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "page page-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "list-search"
  }, /*#__PURE__*/React.createElement("div", {
    className: "list-search-input"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    stroke: 2
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "\uAC00\uACF5\uBC29\uC2DD \xB7 \uC18C\uC7AC \xB7 \uC81C\uD488 \xB7 \uD68C\uC0AC\uBA85",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), query && /*#__PURE__*/React.createElement("button", {
    className: "ls-clear",
    onClick: () => setQuery('')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 12,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "list-search-chips"
  }, /*#__PURE__*/React.createElement(Chip, {
    active: activeProcess === 'all',
    onClick: () => setActiveProcess('all')
  }, "\uC804\uCCB4"), PROCESSES.slice(0, 6).map(p => /*#__PURE__*/React.createElement(Chip, {
    key: p.id,
    active: activeProcess === p.id,
    onClick: () => setActiveProcess(activeProcess === p.id ? 'all' : p.id)
  }, p.label)), /*#__PURE__*/React.createElement("div", {
    className: "chip-sep"
  }), /*#__PURE__*/React.createElement(Chip, {
    active: oemOnly,
    onClick: () => setOemOnly(!oemOnly)
  }, "OEM"), /*#__PURE__*/React.createElement(Chip, {
    active: exportOnly,
    onClick: () => setExportOnly(!exportOnly)
  }, "\uC218\uCD9C \uAC00\uB2A5"))), /*#__PURE__*/React.createElement("div", {
    className: "list-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "list-left"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "filters acc-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: `acc-section ${openSections.has('region') ? 'acc-open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-header",
    onClick: () => toggleSection('region')
  }, /*#__PURE__*/React.createElement("span", {
    className: "acc-title"
  }, "\uC9C0\uC5ED"), activeRegion !== 'all' && /*#__PURE__*/React.createElement("span", {
    className: "acc-active-dot"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "acc-chevron",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "acc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-body-inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-reset-link",
    onClick: () => setActiveRegion('all'),
    disabled: activeRegion === 'all'
  }, "\uCD08\uAE30\uD654"), /*#__PURE__*/React.createElement("div", {
    className: "filters-radios"
  }, (() => {
    const ALL_REGIONS = [{
      id: 'all',
      label: '전국'
    }, {
      id: 'seoul',
      label: '서울'
    }, {
      id: 'gyeonggi',
      label: '경기'
    }, {
      id: 'incheon',
      label: '인천'
    }, {
      id: 'busan',
      label: '부산'
    }, {
      id: 'daegu',
      label: '대구'
    }, {
      id: 'gyeongnam',
      label: '경남'
    }, {
      id: 'gyeongbuk',
      label: '경북'
    }, {
      id: 'chungnam',
      label: '충남'
    }, {
      id: 'chungbuk',
      label: '충북'
    }, {
      id: 'daejeon',
      label: '대전'
    }, {
      id: 'sejong',
      label: '세종'
    }, {
      id: 'gwangju',
      label: '광주'
    }, {
      id: 'jeonnam',
      label: '전남'
    }, {
      id: 'jeonbuk',
      label: '전북'
    }, {
      id: 'gangwon',
      label: '강원'
    }, {
      id: 'ulsan',
      label: '울산'
    }, {
      id: 'jeju',
      label: '제주'
    }, {
      id: 'other',
      label: '기타'
    }];
    const DEFAULT_COUNT = 6; // 전국 포함 기본 표시 개수
    const needExpand = !showAllRegions && !ALL_REGIONS.slice(0, DEFAULT_COUNT).some(r => r.id === activeRegion);
    const expanded = showAllRegions || needExpand;
    const visible = expanded ? ALL_REGIONS : ALL_REGIONS.slice(0, DEFAULT_COUNT);
    const otherCount = dbTotalCount != null ? Math.max(0, dbTotalCount - Object.values(regionCounts).reduce((s, c) => s + c, 0)) : null;
    return /*#__PURE__*/React.createElement(React.Fragment, null, visible.map(r => /*#__PURE__*/React.createElement("label", {
      key: r.id,
      className: `filter-radio ${activeRegion === r.id ? 'is-active' : ''}`
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      checked: activeRegion === r.id,
      onChange: () => setActiveRegion(r.id)
    }), /*#__PURE__*/React.createElement("span", {
      className: "filter-radio-dot"
    }), /*#__PURE__*/React.createElement("span", null, r.label), /*#__PURE__*/React.createElement("span", {
      className: "filter-radio-count"
    }, r.id === 'all' ? (dbTotalCount ?? factories.length).toLocaleString() : r.id === 'other' ? (otherCount ?? '').toLocaleString() : (regionCounts[r.id] ?? factories.filter(f => f.region === r.id).length).toLocaleString()))), /*#__PURE__*/React.createElement("button", {
      className: "acc-reset-link",
      style: {
        marginTop: 4
      },
      onClick: () => setShowAllRegions(v => !v)
    }, expanded ? '접기 ▲' : `더보기 ▼ (${ALL_REGIONS.length - DEFAULT_COUNT}개)`));
  })())))), /*#__PURE__*/React.createElement("div", {
    className: `acc-section ${openSections.has('industry') ? 'acc-open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-header",
    onClick: () => toggleSection('industry')
  }, /*#__PURE__*/React.createElement("span", {
    className: "acc-title"
  }, "\uC5C5\uC885/\uACF5\uC7A5 \uC885\uB958"), activeIndustry !== 'all' && /*#__PURE__*/React.createElement("span", {
    className: "acc-active-dot"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "acc-chevron",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "acc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-body-inner"
  }, activeIndustry !== 'all' && /*#__PURE__*/React.createElement("button", {
    className: "acc-reset-link",
    onClick: () => setActiveIndustry('all')
  }, "\uC804\uCCB4 \uBCF4\uAE30"), INDUSTRY_CATS.map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat.id,
    className: "ind-cat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ind-cat-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `ind-cat-label ${activeIndustry === cat.id ? 'is-active' : ''}`,
    onClick: () => selectIndustry(cat.id)
  }, cat.label), /*#__PURE__*/React.createElement("button", {
    className: `ind-cat-expand ${openCats.has(cat.id) ? 'is-open' : ''}`,
    onClick: () => toggleCat(cat.id),
    "aria-label": "\uC18C\uBD84\uB958 \uD3BC\uCE58\uAE30"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })))), /*#__PURE__*/React.createElement("div", {
    className: `ind-subs ${openCats.has(cat.id) ? 'is-open' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "ind-subs-inner"
  }, cat.subs.map(sub => /*#__PURE__*/React.createElement("button", {
    key: sub.id,
    className: `ind-sub ${activeIndustry === sub.id ? 'is-active' : ''}`,
    onClick: () => selectIndustry(sub.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ind-sub-dot"
  }), sub.label))))))))), /*#__PURE__*/React.createElement("div", {
    className: `acc-section ${openSections.has('moq') ? 'acc-open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-header",
    onClick: () => toggleSection('moq')
  }, /*#__PURE__*/React.createElement("span", {
    className: "acc-title"
  }, "\uCD5C\uC18C \uC8FC\uBB38 \uC218\uB7C9 (MOQ)"), moqMax < 10000 && /*#__PURE__*/React.createElement("span", {
    className: "acc-val-badge"
  }, "\u2264 ", moqMax.toLocaleString()), /*#__PURE__*/React.createElement("svg", {
    className: "acc-chevron",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "acc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-body-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-moq-val"
  }, "\u2264 ", moqMax.toLocaleString()), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "filter-range",
    min: "50",
    max: "10000",
    step: "50",
    value: moqMax,
    onChange: e => setMoqMax(+e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "filter-range-labels"
  }, /*#__PURE__*/React.createElement("span", null, "50"), /*#__PURE__*/React.createElement("span", null, "10,000+"))))), /*#__PURE__*/React.createElement("div", {
    className: `acc-section ${openSections.has('cert') ? 'acc-open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-header",
    onClick: () => toggleSection('cert')
  }, /*#__PURE__*/React.createElement("span", {
    className: "acc-title"
  }, "\uC778\uC99D"), /*#__PURE__*/React.createElement("svg", {
    className: "acc-chevron",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "acc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-body-inner"
  }, ['ISO 9001', 'IATF 16949', 'KC', 'CE', 'HACCP'].map(c => /*#__PURE__*/React.createElement("label", {
    key: c,
    className: "filter-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }), /*#__PURE__*/React.createElement("span", {
    className: "filter-check-box"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 3
  })), /*#__PURE__*/React.createElement("span", null, c)))))), /*#__PURE__*/React.createElement("div", {
    className: `acc-section ${openSections.has('lead') ? 'acc-open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-header",
    onClick: () => toggleSection('lead')
  }, /*#__PURE__*/React.createElement("span", {
    className: "acc-title"
  }, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("svg", {
    className: "acc-chevron",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "acc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-body-inner"
  }, ['7일 이내', '14일 이내', '30일 이내', '협의'].map(c => /*#__PURE__*/React.createElement("label", {
    key: c,
    className: "filter-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }), /*#__PURE__*/React.createElement("span", {
    className: "filter-check-box"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 3
  })), /*#__PURE__*/React.createElement("span", null, c)))))), /*#__PURE__*/React.createElement("div", {
    className: `acc-section ${openSections.has('misc') ? 'acc-open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "acc-header",
    onClick: () => toggleSection('misc')
  }, /*#__PURE__*/React.createElement("span", {
    className: "acc-title"
  }, "\uAE30\uD0C0 \uD544\uD130"), (oemOnly || exportOnly) && /*#__PURE__*/React.createElement("span", {
    className: "acc-active-dot"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "acc-chevron",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "acc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "acc-body-inner"
  }, /*#__PURE__*/React.createElement("label", {
    className: "filter-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: oemOnly,
    onChange: () => setOemOnly(!oemOnly)
  }), /*#__PURE__*/React.createElement("span", {
    className: "filter-check-box"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 3
  })), /*#__PURE__*/React.createElement("span", null, "OEM \uAC00\uB2A5")), /*#__PURE__*/React.createElement("label", {
    className: "filter-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: exportOnly,
    onChange: () => setExportOnly(!exportOnly)
  }), /*#__PURE__*/React.createElement("span", {
    className: "filter-check-box"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 3
  })), /*#__PURE__*/React.createElement("span", null, "\uC218\uCD9C \uAC00\uB2A5")))))), /*#__PURE__*/React.createElement("div", {
    className: "list-results"
  }, dbError && /*#__PURE__*/React.createElement("div", {
    className: "list-db-error"
  }, "Supabase \uC624\uB958: ", dbError), /*#__PURE__*/React.createElement("div", {
    className: "list-results-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, dbLoading || regionLoading ? '…' : displayTotal.toLocaleString()), "\uAC1C \uC911", ' ', /*#__PURE__*/React.createElement("span", {
    className: "results-range"
  }, filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1, "\u2013", Math.min(page * PAGE_SIZE, filtered.length))), /*#__PURE__*/React.createElement("div", {
    className: "list-results-sort"
  }, /*#__PURE__*/React.createElement("span", null, "\uC815\uB82C"), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "match"
  }, "\uB9E4\uCE6D\uB3C4\uC21C"), /*#__PURE__*/React.createElement("option", {
    value: "rating"
  }, "\uD3C9\uC810\uC21C"), /*#__PURE__*/React.createElement("option", {
    value: "response"
  }, "\uC751\uB2F5\uC18D\uB3C4\uC21C"), /*#__PURE__*/React.createElement("option", {
    value: "deals"
  }, "\uAC70\uB798\uB7C9\uC21C")))), /*#__PURE__*/React.createElement("div", {
    className: "list-results-grid"
  }, dbLoading && paginated.length === 0 ? Array.from({
    length: 4
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "list-result-wrap"
  }, /*#__PURE__*/React.createElement(ManufacturerCardSkeleton, null))) : paginated.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onMouseEnter: () => setHovered(f.id),
    onMouseLeave: () => setHovered(null),
    onClick: () => setSelected(f.id),
    className: `list-result-wrap ${selected === f.id ? 'is-active' : ''}`
  }, /*#__PURE__*/React.createElement(ManufacturerCard, {
    f: f,
    onOpen: id => {
      if (!window._factoryCache) window._factoryCache = {};
      window._factoryCache[id] = f;
      window._listPageCache = page;
      onOpenFactory(id);
    },
    density: density,
    simplified: true,
    onAddRFQ: onAddRFQ,
    rfqIds: rfqIds
  })))), !dbLoading && filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "list-empty"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 36,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("p", {
    className: "list-empty-msg"
  }, query ? `'${query}'에 해당하는 제조사가 없습니다.` : '조건에 맞는 제조사가 없습니다.'), /*#__PURE__*/React.createElement("p", {
    className: "list-empty-sub"
  }, "\uCC3E\uC73C\uC2DC\uB294 \uC81C\uC870\uC0AC\uAC00 \uC5C6\uC73C\uC2E0\uAC00\uC694? \uACAC\uC801 \uC694\uCCAD\uC744 \uB0A8\uACA8\uC8FC\uC2DC\uBA74 \uC804\uBB38 \uB9E4\uCE6D\uD300\uC774 \uC9C1\uC811 \uCC3E\uC544\uB4DC\uB9BD\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    className: "list-empty-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      window.location.hash = 'rfq';
    }
  }, "\uACAC\uC801 \uC694\uCCAD\uD558\uAE30"), query && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => setQuery('')
  }, "\uAC80\uC0C9\uC5B4 \uCD08\uAE30\uD654"))), pageCount > 1 && /*#__PURE__*/React.createElement("div", {
    className: "list-pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pg-btn",
    onClick: () => {
      setPage(p => Math.max(1, p - 1));
      _scrollListToTop();
    },
    disabled: page === 1
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_left",
    size: 14,
    stroke: 2
  }), "\uC774\uC804"), /*#__PURE__*/React.createElement("div", {
    className: "pg-nums"
  }, Array.from({
    length: Math.min(pageCount, 7)
  }, (_, i) => {
    const n = pageCount <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= pageCount - 3 ? pageCount - 6 + i : page - 3 + i;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      className: `pg-num ${page === n ? 'is-active' : ''}`,
      onClick: () => {
        setPage(n);
        _scrollListToTop();
      }
    }, n);
  })), /*#__PURE__*/React.createElement("button", {
    className: "pg-btn",
    onClick: () => {
      setPage(p => Math.min(pageCount, p + 1));
      _scrollListToTop();
    },
    disabled: page === pageCount
  }, "\uB2E4\uC74C", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "list-map"
  }, /*#__PURE__*/React.createElement(ListMapPanel, {
    geoFactories: filteredGeoFactories,
    pagedFactories: paginated,
    selectedFactory: selectedFactory,
    mapsKey: mapsKey,
    onOpenFactory: onOpenFactory
  }), selectedFactory && /*#__PURE__*/React.createElement("div", {
    className: "map-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-side-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-side-row"
  }, /*#__PURE__*/React.createElement("h3", null, selectedFactory.name), selectedFactory.rating > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mcard-rating"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 11,
    stroke: 2
  }), /*#__PURE__*/React.createElement("strong", null, selectedFactory.rating))), /*#__PURE__*/React.createElement("p", {
    className: "map-side-sub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 11,
    stroke: 2
  }), _addrCity(selectedFactory.roadAddress) || selectedFactory.city), /*#__PURE__*/React.createElement("p", {
    className: "map-side-desc"
  }, selectedFactory.summary || '견적 문의 가능한 제조사입니다'), /*#__PURE__*/React.createElement("div", {
    className: "map-side-stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "MOQ"), /*#__PURE__*/React.createElement("strong", null, (selectedFactory.moq ?? 0).toLocaleString(), " ", selectedFactory.moqUnit || '피스')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("strong", null, selectedFactory.leadDays > 0 ? selectedFactory.leadDays + '일' : '−')), selectedFactory.responseHr > 0 && selectedFactory.responseHr < 24 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\uC751\uB2F5"), /*#__PURE__*/React.createElement("strong", null, selectedFactory.responseHr, "h"))), /*#__PURE__*/React.createElement("div", {
    className: "map-side-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => {
      if (!window._factoryCache) window._factoryCache = {};
      window._factoryCache[selectedFactory.id] = selectedFactory;
      onOpenFactory(selectedFactory.id);
    }
  }, "\uC0C1\uC138 \uBCF4\uAE30"), /*#__PURE__*/React.createElement("button", {
    className: `btn btn-primary ${rfqIds.includes(selectedFactory.id) ? 'is-added' : ''}`,
    onClick: () => onAddRFQ(selectedFactory.id)
  }, rfqIds.includes(selectedFactory.id) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 13,
    stroke: 2.4
  }), " \uACAC\uC801\uD568") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13,
    stroke: 2.4
  }), " \uACAC\uC801 \uC694\uCCAD"))))))));
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
    if (_mapsKey !== null) {
      setKey(_mapsKey);
      return;
    }
    if (!_mapsKeyFetch) {
      _mapsKeyFetch = fetch('/.netlify/functions/get-maps-key').then(r => r.json()).then(d => {
        _mapsKey = d.key || '';
        return _mapsKey;
      }).catch(() => {
        _mapsKey = '';
        return '';
      });
    }
    _mapsKeyFetch.then(k => setKey(k));
  }, []);
  return key;
}
const MAPS_ENABLED = true; // Set to true when Maps API is authorized

function FactoryMap({
  addr,
  name,
  lat,
  lng
}) {
  const key = useMapsKey();
  if (MAPS_ENABLED && key) {
    // 좌표가 있으면 정확한 핀 고정 (주소 텍스트는 인근 장소로 오인될 수 있음)
    const q = lat != null && lng != null ? encodeURIComponent(`${lat},${lng}`) : encodeURIComponent(addr || name);
    const mapsLink = lat != null && lng != null ? `https://www.google.com/maps?q=${lat},${lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr || name)}`;
    return /*#__PURE__*/React.createElement("div", {
      className: "factory-map"
    }, /*#__PURE__*/React.createElement("iframe", {
      src: `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&language=ko`,
      className: "factory-map-iframe",
      loading: "lazy",
      referrerPolicy: "no-referrer-when-downgrade",
      title: `${name} 위치`
    }), /*#__PURE__*/React.createElement("a", {
      href: mapsLink,
      target: "_blank",
      rel: "noreferrer",
      className: "factory-map-link"
    }, "Google \uC9C0\uB3C4\uC5D0\uC11C \uBCF4\uAE30"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "factory-map-placeholder"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 16,
    stroke: 1.6
  }), /*#__PURE__*/React.createElement("span", null, "\uC9C0\uB3C4 \uC900\uBE44 \uC911"));
}

// ── 공장 히어로 이미지: Street View → Static Map → 색상 박스 ─────────────────
const GMAPS_KEY = (window._env || {}).GOOGLE_MAPS_API_KEY || '';
const FactoryHeroImg = ({
  f
}) => {
  const addr = (f.address || '').trim();
  const [src, setSrc] = React.useState(null); // null=로딩중
  const [type, setType] = React.useState(null); // 'sv'|'map'|'color'

  React.useEffect(() => {
    if (!addr) {
      setType('color');
      return;
    }
    let cancelled = false;

    // Street View 메타데이터로 영상 존재 여부 확인 (무료 API)
    fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${encodeURIComponent(addr)}&key=${GMAPS_KEY}`).then(r => r.json()).then(d => {
      if (cancelled) return;
      if (d.status === 'OK') {
        setSrc(`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(addr)}&fov=90&pitch=0&key=${GMAPS_KEY}`);
        setType('sv');
      } else {
        setSrc(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(addr)}&zoom=16&size=800x400&maptype=roadmap&markers=color:0x3b82f6|${encodeURIComponent(addr)}&scale=2&key=${GMAPS_KEY}`);
        setType('map');
      }
    }).catch(() => {
      if (!cancelled) setType('color');
    });
    return () => {
      cancelled = true;
    };
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
  if (type === 'color' || !addr && type !== 'sv' && type !== 'map') {
    return /*#__PURE__*/React.createElement("div", {
      className: "detail-hero-img",
      style: {
        background: getCardBg(f)
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcard-icon detail-hero-icon"
    }, getCardIcon(f)), /*#__PURE__*/React.createElement("div", {
      className: "mcard-img-stripes"
    }));
  }

  // 로딩 중 (메타데이터 확인 전) — 색상 박스 임시 표시
  if (!src) {
    return /*#__PURE__*/React.createElement("div", {
      className: "detail-hero-img",
      style: {
        background: getCardBg(f)
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcard-icon detail-hero-icon"
    }, getCardIcon(f)), /*#__PURE__*/React.createElement("div", {
      className: "mcard-img-stripes"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "detail-hero-img",
    style: {
      background: '#e8edf2',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: f.name,
    onError: onImgError,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "detail-hero-img-label"
  }, type === 'sv' ? 'STREET VIEW' : '지도'));
};
const DetailPage = ({
  factoryId,
  onBack,
  onAddRFQ,
  rfqIds,
  onChat,
  onReport,
  backLabel
}) => {
  const {
    FACTORIES,
    PROCESSES,
    PRODUCTS,
    INDUSTRIES
  } = window.MFG_DATA;
  const _fromCacheOrFixture = id => window._factoryCache?.[id] || FACTORIES.find(x => x.id === id) || null;
  const [resolvedFactory, setResolvedFactory] = useStateP(() => _fromCacheOrFixture(factoryId));
  const [detailLoading, setDetailLoading] = useStateP(() => !_fromCacheOrFixture(factoryId));
  useEffectP(() => {
    // 캐시는 초기 렌더용으로만 사용, 항상 DB에서 최신 데이터 재조회
    let cancelled = false;
    window._sb.from('factories').select('*').eq('id', factoryId).single().then(({
      data,
      error
    }) => {
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
    return () => {
      cancelled = true;
    };
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
        const {
          data: {
            user
          }
        } = await window._sb.auth.getUser();
        if (!user) return;
        const {
          data
        } = await window._sb.from('user_profiles').select('factory_id, status').eq('id', user.id).maybeSingle();
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
      image: f.image || '#a8b4c8'
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
        image: editForm.image
      };
      const {
        error
      } = await window._sb.from('factories').update(updates).eq('id', f.id);
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
        image: editForm.image
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
    [field]: prev[field].includes(id) ? prev[field].filter(x => x !== id) : [...prev[field], id]
  }));
  const addFreeChip = (field, val, clearFn) => {
    const v = val.trim();
    if (!v) return;
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].includes(v) ? prev[field] : [...prev[field], v]
    }));
    clearFn('');
  };
  const removeFreeChip = (field, val) => setEditForm(prev => ({
    ...prev,
    [field]: prev[field].filter(x => x !== val)
  }));
  useEffect(() => {
    if (tab === 'reviews' && !isSample) setTab('overview');
    if (tab === 'certs' && f.certs.length === 0 && !isSample) setTab('overview');
    if (tab === 'capability' && procLabels.length === 0 && (f.materials || []).length === 0 && prodLabels.length === 0) setTab('overview');
  }, [factoryId]);
  if (detailLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page page-detail"
    }, /*#__PURE__*/React.createElement("div", {
      className: "detail-loading"
    }, /*#__PURE__*/React.createElement("div", {
      className: "detail-loading-spinner"
    }), /*#__PURE__*/React.createElement("span", {
      className: "detail-loading-text"
    }, "\uACF5\uC7A5 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911...")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "page page-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-btn",
    onClick: () => {
      onBack?.();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 14,
    stroke: 2,
    className: "back-arrow"
  }), backLabel || '제조사 목록으로'), /*#__PURE__*/React.createElement("div", {
    className: "detail-bar-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 14,
    stroke: 2
  }), "\uAD00\uC2EC \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => onChat?.(f.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chat",
    size: 14,
    stroke: 2
  }), "\uCC44\uD305 \uC2DC\uC791"), isOwner && /*#__PURE__*/React.createElement("button", {
    className: "icon-btn detail-edit-btn",
    onClick: openEditModal
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 14,
    stroke: 2
  }), "\uB0B4 \uACF5\uC7A5 \uC815\uBCF4 \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    className: "detail-report-btn",
    onClick: () => onReport?.({
      type: 'factory_issue',
      factoryId: f.id,
      factoryName: f.name
    })
  }, "\u26A0 \uC774 \uC815\uBCF4 \uC2E0\uACE0"))), /*#__PURE__*/React.createElement("section", {
    className: "detail-hero"
  }, /*#__PURE__*/React.createElement(FactoryHeroImg, {
    f: f
  }), /*#__PURE__*/React.createElement("div", {
    className: "detail-hero-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-hero-head"
  }, f.certs.includes('IATF 16949') && /*#__PURE__*/React.createElement(Badge, {
    tone: "indigo",
    icon: "badge_check"
  }, "\uC790\uB3D9\uCC28 \uC778\uC99D"), f.export && /*#__PURE__*/React.createElement(Badge, {
    tone: "slate",
    icon: "globe"
  }, "\uC218\uCD9C \uAC00\uB2A5")), /*#__PURE__*/React.createElement("h1", {
    className: "detail-name"
  }, f.name), f.isCorporate && f.businessNumber && /*#__PURE__*/React.createElement("div", {
    className: "detail-business-number"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#555'
    }
  }, "\uC0AC\uC5C5\uC790\uBC88\uD638 "), f.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'), f.businessStatus === 'active' && /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#e6f4ea',
      color: '#2d7a3a',
      borderRadius: '4px',
      padding: '2px 8px',
      fontSize: '11px',
      marginLeft: '8px',
      fontWeight: '600'
    }
  }, "\uB4F1\uB85D\uBC95\uC778")), f.en && /*#__PURE__*/React.createElement("div", {
    className: "detail-name-en"
  }, f.en), /*#__PURE__*/React.createElement("div", {
    className: "detail-hero-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 13,
    stroke: 2
  }), " ", _addrCity(f.roadAddress) || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || f.city || '—'), isSample && f.founded > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, f.founded, "\uB144 \uC124\uB9BD \xB7 \uC9C1\uC6D0 ", f.employees, "\uBA85"))), isSample && /*#__PURE__*/React.createElement("div", {
    className: "detail-rating"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-rating-big"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 16,
    stroke: 2.4
  }), /*#__PURE__*/React.createElement("strong", null, f.rating), /*#__PURE__*/React.createElement("span", null, "/ 5.0")), /*#__PURE__*/React.createElement("div", {
    className: "detail-rating-meta"
  }, /*#__PURE__*/React.createElement("span", null, "\uB9AC\uBDF0 ", f.reviews, "\uAC74"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\uAC70\uB798 ", f.deals, "\uAC74"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\uC751\uB2F5 \uD3C9\uADE0 ", f.responseHr, "\uC2DC\uAC04"))), isSample && /*#__PURE__*/React.createElement("div", {
    className: "detail-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dstat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "box",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dstat-k"
  }, "MOQ"), /*#__PURE__*/React.createElement("div", {
    className: "dstat-v"
  }, (f.moq ?? 0).toLocaleString(), " ", f.moqUnit || '피스'))), /*#__PURE__*/React.createElement("div", {
    className: "dstat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dstat-k"
  }, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("div", {
    className: "dstat-v"
  }, f.leadDays, "\uC77C"))), f.priceRange && /*#__PURE__*/React.createElement("div", {
    className: "dstat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "won",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dstat-k"
  }, "\uB2E8\uAC00 \uBC94\uC704"), /*#__PURE__*/React.createElement("div", {
    className: "dstat-v"
  }, f.priceRange)))), /*#__PURE__*/React.createElement("div", {
    className: "detail-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-primary btn-lg ${inRfq ? 'is-added' : ''}`,
    onClick: () => onAddRFQ(f.id)
  }, inRfq ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    stroke: 2.4
  }), " \uACAC\uC801\uD568\uC5D0 \uCD94\uAC00\uB428") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15,
    stroke: 2.4
  }), " \uACAC\uC801 \uC694\uCCAD\uD558\uAE30")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-lg",
    onClick: () => onChat?.(f.id, f)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chat",
    size: 15,
    stroke: 2
  }), "AI \uC0C1\uB2F4")))), /*#__PURE__*/React.createElement("div", {
    className: "detail-tabs"
  }, [{
    id: 'overview',
    label: '회사 개요'
  }, ...(procLabels.length > 0 || (f.materials || []).length > 0 || prodLabels.length > 0 ? [{
    id: 'capability',
    label: '제조 역량'
  }] : []), ...(f.certs.length > 0 || isSample ? [{
    id: 'certs',
    label: '인증·신뢰도'
  }] : []), ...(isSample ? [{
    id: 'reviews',
    label: `리뷰 ${f.reviews}`
  }] : [])].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `detail-tab ${tab === t.id ? 'is-active' : ''}`,
    onClick: () => setTab(t.id)
  }, t.label))), tab === 'overview' && /*#__PURE__*/React.createElement("section", {
    className: "detail-section"
  }, (() => {
    let aiData = null;
    try {
      aiData = f.ai_summary ? typeof f.ai_summary === 'string' ? JSON.parse(f.ai_summary) : f.ai_summary : null;
    } catch (e) {}
    const intro = aiData?.intro || f.summary;
    const hasAiExtra = aiData && (aiData.products?.length || aiData.equipment?.length || aiData.clients?.length || aiData.certifications?.length || aiData.strengths?.length);
    return /*#__PURE__*/React.createElement("div", {
      className: intro || hasAiExtra ? 'detail-grid' : ''
    }, intro && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "\uD68C\uC0AC \uC18C\uAC1C"), /*#__PURE__*/React.createElement("p", {
      className: "detail-desc"
    }, intro), hasAiExtra && /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-wrap"
    }, aiData.products?.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-summary-label"
    }, "\uC8FC\uC694 \uC81C\uD488"), /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-tags"
    }, aiData.products.map((p, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "ai-tag ai-tag-blue"
    }, p)))), aiData.equipment?.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-summary-label"
    }, "\uBCF4\uC720 \uC7A5\uBE44"), /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-tags"
    }, aiData.equipment.map((e, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "ai-tag ai-tag-gray"
    }, e)))), aiData.clients?.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-summary-label"
    }, "\uB0A9\uD488\uCC98"), /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-tags"
    }, aiData.clients.map((c, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "ai-tag ai-tag-amber"
    }, c)))), aiData.certifications?.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-summary-label"
    }, "\uC778\uC99D"), /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-tags"
    }, aiData.certifications.map((c, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "ai-tag ai-tag-green"
    }, c)))), aiData.strengths?.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-summary-label"
    }, "\uAC15\uC810"), /*#__PURE__*/React.createElement("div", {
      className: "ai-summary-tags"
    }, aiData.strengths.map((s, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "ai-tag ai-tag-purple"
    }, s)))))), !intro && !hasAiExtra && null, /*#__PURE__*/React.createElement("div", {
      className: "detail-side"
    }, /*#__PURE__*/React.createElement("h4", null, "\uAE30\uBCF8 \uC815\uBCF4"), /*#__PURE__*/React.createElement("dl", {
      className: "detail-dl"
    }, (f.roadAddress || f.address || f.city) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC8FC\uC18C"), /*#__PURE__*/React.createElement("dd", null, f.roadAddress || f.address || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' '))), f.phone && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC804\uD654\uBC88\uD638"), /*#__PURE__*/React.createElement("dd", null, f.phone)), f.website && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uD648\uD398\uC774\uC9C0"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("a", {
      href: f.website,
      target: "_blank",
      rel: "noreferrer",
      className: "detail-link"
    }, f.website.replace(/^https?:\/\//, '')))), f.representative && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uB300\uD45C\uC790"), /*#__PURE__*/React.createElement("dd", null, f.representative)), f.industrial_complex && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC0B0\uC5C5\uB2E8\uC9C0"), /*#__PURE__*/React.createElement("dd", null, f.industrial_complex)), f.building_area != null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uAC74\uCD95\uBA74\uC801"), /*#__PURE__*/React.createElement("dd", null, f.building_area.toLocaleString(), " \u33A1")), f.employees > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC9C1\uC6D0\uC218"), /*#__PURE__*/React.createElement("dd", null, f.employees, "\uBA85")), f.founded > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC124\uB9BD\uC5F0\uB3C4"), /*#__PURE__*/React.createElement("dd", null, f.founded, "\uB144 (", 2026 - f.founded, "\uB144\uCC28)")), indLabels.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC0B0\uC5C5\uAD70"), /*#__PURE__*/React.createElement("dd", null, indLabels.join(', '))), (f.oem || f.odm || f.export) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uAC70\uB798 \uD615\uD0DC"), /*#__PURE__*/React.createElement("dd", null, f.oem && /*#__PURE__*/React.createElement("span", {
      className: "flag"
    }, "OEM"), f.odm && /*#__PURE__*/React.createElement("span", {
      className: "flag"
    }, "ODM"), f.export && /*#__PURE__*/React.createElement("span", {
      className: "flag flag-export"
    }, "\uC218\uCD9C")))), (f.dart_revenue || f.dart_op_income || f.dart_net_income || f.dart_assets || f.dart_equity) && /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-header"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dart-finance-title"
    }, "\uD83D\uDCCA \uC7AC\uBB34\uC815\uBCF4"), f.dart_year && /*#__PURE__*/React.createElement("span", {
      className: "dart-finance-year"
    }, f.dart_year, "\uB144 \uAE30\uC900")), /*#__PURE__*/React.createElement("dl", {
      className: "dart-finance-dl"
    }, f.dart_revenue != null && /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-item"
    }, /*#__PURE__*/React.createElement("dt", null, "\uB9E4\uCD9C\uC561"), /*#__PURE__*/React.createElement("dd", {
      className: "dart-finance-val dart-val-blue"
    }, f.dart_revenue >= 1e8 ? `${(f.dart_revenue / 1e8).toFixed(1)}억원` : `${(f.dart_revenue / 1e4).toFixed(0)}만원`)), f.dart_op_income != null && /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-item"
    }, /*#__PURE__*/React.createElement("dt", null, "\uC601\uC5C5\uC774\uC775"), /*#__PURE__*/React.createElement("dd", {
      className: `dart-finance-val ${f.dart_op_income >= 0 ? 'dart-val-green' : 'dart-val-red'}`
    }, f.dart_op_income >= 0 ? '' : '▼ ', Math.abs(f.dart_op_income) >= 1e8 ? `${(Math.abs(f.dart_op_income) / 1e8).toFixed(1)}억원` : `${(Math.abs(f.dart_op_income) / 1e4).toFixed(0)}만원`)), f.dart_net_income != null && /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-item"
    }, /*#__PURE__*/React.createElement("dt", null, "\uB2F9\uAE30\uC21C\uC774\uC775"), /*#__PURE__*/React.createElement("dd", {
      className: `dart-finance-val ${f.dart_net_income >= 0 ? 'dart-val-green' : 'dart-val-red'}`
    }, f.dart_net_income >= 0 ? '' : '▼ ', Math.abs(f.dart_net_income) >= 1e8 ? `${(Math.abs(f.dart_net_income) / 1e8).toFixed(1)}억원` : `${(Math.abs(f.dart_net_income) / 1e4).toFixed(0)}만원`)), f.dart_assets != null && /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-item"
    }, /*#__PURE__*/React.createElement("dt", null, "\uC790\uC0B0\uCD1D\uACC4"), /*#__PURE__*/React.createElement("dd", {
      className: "dart-finance-val"
    }, f.dart_assets >= 1e8 ? `${(f.dart_assets / 1e8).toFixed(1)}억원` : `${(f.dart_assets / 1e4).toFixed(0)}만원`)), f.dart_equity != null && /*#__PURE__*/React.createElement("div", {
      className: "dart-finance-item"
    }, /*#__PURE__*/React.createElement("dt", null, "\uC790\uBCF8\uCD1D\uACC4"), /*#__PURE__*/React.createElement("dd", {
      className: "dart-finance-val"
    }, f.dart_equity >= 1e8 ? `${(f.dart_equity / 1e8).toFixed(1)}억원` : `${(f.dart_equity / 1e4).toFixed(0)}만원`))), /*#__PURE__*/React.createElement("p", {
      className: "dart-finance-source"
    }, "\uCD9C\uCC98: \uAE08\uC735\uAC10\uB3C5\uC6D0 DART \uACF5\uC2DC\uC815\uBCF4")), /*#__PURE__*/React.createElement(FactoryMap, {
      addr: f.roadAddress || f.address,
      name: f.name,
      lat: f.lat,
      lng: f.lng
    })));
  })()), tab === 'capability' && /*#__PURE__*/React.createElement("section", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cap-grid"
  }, procLabels.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cap-block"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAC00\uACF5 \uBC29\uC2DD"), /*#__PURE__*/React.createElement("div", {
    className: "cap-tags"
  }, procLabels.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "cap-tag cap-tag-blue"
  }, p)))), (f.materials || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cap-block"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC18C\uC7AC"), /*#__PURE__*/React.createElement("div", {
    className: "cap-tags"
  }, f.materials.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    className: "cap-tag"
  }, m)))), prodLabels.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cap-block"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC0DD\uC0B0 \uAC00\uB2A5 \uC81C\uD488"), /*#__PURE__*/React.createElement("div", {
    className: "cap-tags"
  }, prodLabels.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "cap-tag cap-tag-amber"
  }, p)))), isSample && /*#__PURE__*/React.createElement("div", {
    className: "cap-block"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC8FC\uC694 \uC0DD\uC0B0 \uC870\uAC74"), /*#__PURE__*/React.createElement("table", {
    className: "cap-table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uCD5C\uC18C \uC8FC\uBB38 (MOQ)"), /*#__PURE__*/React.createElement("td", null, (f.moq ?? 0).toLocaleString(), " ", f.moqUnit || '피스')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("td", null, f.leadDays ?? '−', "\uC77C (\uC2DC\uC81C\uD488 \uBCC4\uB3C4)")), f.priceRange && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uB2E8\uAC00 \uBC94\uC704"), /*#__PURE__*/React.createElement("td", null, f.priceRange)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC0D8\uD50C"), /*#__PURE__*/React.createElement("td", null, "\uC720\uB8CC / 3~5\uC77C"))))))), tab === 'certs' && /*#__PURE__*/React.createElement("section", {
    className: "detail-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-grid"
  }, f.certs.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "trust-card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uBCF4\uC720 \uC778\uC99D"), /*#__PURE__*/React.createElement("div", {
    className: "cert-list"
  }, f.certs.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    className: "cert-item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge_check",
    size: 16,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cert-item-k"
  }, c), /*#__PURE__*/React.createElement("div", {
    className: "cert-item-v"
  }, "\uC720\uD6A8 \xB7 2027.12 \uAC31\uC2E0 \uC608\uC815")))))), isSample && /*#__PURE__*/React.createElement("div", {
    className: "trust-card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC751\uB2F5\xB7\uAC70\uB798 \uC9C0\uD45C"), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-k"
  }, "\uD3C9\uADE0 \uC751\uB2F5 \uC2DC\uAC04"), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-fill",
    style: {
      width: `${100 - f.responseHr * 10}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-v"
  }, /*#__PURE__*/React.createElement("strong", null, f.responseHr, "\uC2DC\uAC04"), " \xB7 \uC0C1\uC704 ", f.responseHr <= 2 ? '5%' : f.responseHr <= 4 ? '15%' : '30%')), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-k"
  }, "\uB204\uC801 \uAC70\uB798"), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-fill",
    style: {
      width: `${Math.min(100, f.deals / 4)}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-v"
  }, /*#__PURE__*/React.createElement("strong", null, f.deals, "\uAC74"), " \xB7 \uCD5C\uADFC 12\uAC1C\uC6D4 \uD65C\uC131")), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-k"
  }, "\uB9AC\uBDF0 \uD3C9\uC810"), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-fill",
    style: {
      width: `${f.rating / 5 * 100}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "trust-stat-v"
  }, /*#__PURE__*/React.createElement("strong", null, f.rating, "/5.0"), " \xB7 ", f.reviews, "\uAC74 \uAC80\uC99D"))))), editToast && /*#__PURE__*/React.createElement("div", {
    className: 'fe-toast ' + (editToast.includes('실패') ? 'fe-toast-err' : 'fe-toast-ok')
  }, editToast), showEditModal && /*#__PURE__*/React.createElement("div", {
    className: "fe-overlay",
    onClick: () => setShowEditModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "fe-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "fe-head"
  }, /*#__PURE__*/React.createElement("h2", null, "\uB0B4 \uACF5\uC7A5 \uC815\uBCF4 \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    className: "fe-close",
    onClick: () => setShowEditModal(false)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "fe-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uAE30\uBCF8 \uC815\uBCF4 (\uC218\uC815 \uBD88\uAC00)"), /*#__PURE__*/React.createElement("div", {
    className: "fe-readonly-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fe-ro-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fe-ro-label"
  }, "\uD68C\uC0AC\uBA85"), /*#__PURE__*/React.createElement("span", {
    className: "fe-ro-value"
  }, f.name)), f.businessNumber && /*#__PURE__*/React.createElement("div", {
    className: "fe-ro-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fe-ro-label"
  }, "\uC0AC\uC5C5\uC790\uBC88\uD638"), /*#__PURE__*/React.createElement("span", {
    className: "fe-ro-value"
  }, f.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'))), /*#__PURE__*/React.createElement("div", {
    className: "fe-ro-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fe-ro-label"
  }, "\uC8FC\uC18C"), /*#__PURE__*/React.createElement("span", {
    className: "fe-ro-value"
  }, f.roadAddress || f.address || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || '—')))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uD68C\uC0AC \uC18C\uAC1C"), /*#__PURE__*/React.createElement("textarea", {
    className: "fe-textarea",
    rows: 4,
    value: editForm.summary,
    onChange: e => setEditForm(p => ({
      ...p,
      summary: e.target.value
    })),
    placeholder: "\uD68C\uC0AC \uC18C\uAC1C\uB97C \uC785\uB825\uD558\uC138\uC694 (100~300\uC790 \uAD8C\uC7A5)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uC8FC\uC694 \uACF5\uC815"), /*#__PURE__*/React.createElement("div", {
    className: "fe-chip-grid"
  }, PROCESSES.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: 'fe-chip ' + (editForm.processes?.includes(p.id) ? 'is-on' : ''),
    onClick: () => toggleChip('processes', p.id),
    type: "button"
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uC8FC\uC694 \uC18C\uC7AC"), /*#__PURE__*/React.createElement("div", {
    className: "fe-free-chips"
  }, (editForm.materials || []).map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    className: "fe-free-chip"
  }, m, /*#__PURE__*/React.createElement("button", {
    className: "fe-free-chip-x",
    onClick: () => removeFreeChip('materials', m)
  }, "\xD7")))), /*#__PURE__*/React.createElement("div", {
    className: "fe-chip-input-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "fe-input",
    value: matInput,
    onChange: e => setMatInput(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addFreeChip('materials', matInput, setMatInput);
      }
    },
    placeholder: "\uC18C\uC7AC \uC785\uB825 \uD6C4 Enter (\uC608: \uC54C\uB8E8\uBBF8\uB284)"
  }), /*#__PURE__*/React.createElement("button", {
    className: "fe-chip-add-btn",
    onClick: () => addFreeChip('materials', matInput, setMatInput)
  }, "\uCD94\uAC00"))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uC8FC\uC694 \uC81C\uD488"), /*#__PURE__*/React.createElement("div", {
    className: "fe-chip-grid"
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: 'fe-chip ' + (editForm.products?.includes(p.id) ? 'is-on' : ''),
    onClick: () => toggleChip('products', p.id),
    type: "button"
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uC0DD\uC0B0 \uC870\uAC74"), /*#__PURE__*/React.createElement("div", {
    className: "fe-cond-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fe-field"
  }, /*#__PURE__*/React.createElement("span", null, "\uCD5C\uC18C \uC8FC\uBB38 \uC218\uB7C9 (MOQ)"), /*#__PURE__*/React.createElement("input", {
    className: "fe-input",
    type: "number",
    min: "1",
    value: editForm.moq,
    onChange: e => setEditForm(p => ({
      ...p,
      moq: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("label", {
    className: "fe-field"
  }, /*#__PURE__*/React.createElement("span", null, "\uB2E8\uC704"), /*#__PURE__*/React.createElement("input", {
    className: "fe-input",
    value: editForm.moqUnit,
    onChange: e => setEditForm(p => ({
      ...p,
      moqUnit: e.target.value
    })),
    placeholder: "\uD53C\uC2A4"
  })), /*#__PURE__*/React.createElement("label", {
    className: "fe-field"
  }, /*#__PURE__*/React.createElement("span", null, "\uB9AC\uB4DC\uD0C0\uC784 (\uC77C)"), /*#__PURE__*/React.createElement("input", {
    className: "fe-input",
    type: "number",
    min: "1",
    value: editForm.leadDays,
    onChange: e => setEditForm(p => ({
      ...p,
      leadDays: e.target.value
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uBCF4\uC720 \uC778\uC99D"), /*#__PURE__*/React.createElement("div", {
    className: "fe-free-chips"
  }, (editForm.certs || []).map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    className: "fe-free-chip"
  }, c, /*#__PURE__*/React.createElement("button", {
    className: "fe-free-chip-x",
    onClick: () => removeFreeChip('certs', c)
  }, "\xD7")))), /*#__PURE__*/React.createElement("div", {
    className: "fe-chip-input-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "fe-input",
    value: certInput,
    onChange: e => setCertInput(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addFreeChip('certs', certInput, setCertInput);
      }
    },
    placeholder: "\uC778\uC99D\uBA85 \uC785\uB825 \uD6C4 Enter (\uC608: ISO 9001)"
  }), /*#__PURE__*/React.createElement("button", {
    className: "fe-chip-add-btn",
    onClick: () => addFreeChip('certs', certInput, setCertInput)
  }, "\uCD94\uAC00"))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uAC70\uB798 \uD615\uD0DC"), /*#__PURE__*/React.createElement("div", {
    className: "fe-toggle-row"
  }, [['oem', 'OEM'], ['odm', 'ODM'], ['export', '수출 가능']].map(([key, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    className: 'fe-toggle ' + (editForm[key] ? 'is-on' : ''),
    onClick: () => setEditForm(p => ({
      ...p,
      [key]: !p[key]
    })),
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fe-toggle-dot"
  }), label)))), /*#__PURE__*/React.createElement("div", {
    className: "fe-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fe-section-title"
  }, "\uB300\uD45C \uC774\uBBF8\uC9C0 \uC0C9\uC0C1"), /*#__PURE__*/React.createElement("div", {
    className: "fe-image-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fe-color-preview",
    style: {
      background: editForm.image
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "fe-input",
    value: editForm.image,
    onChange: e => setEditForm(p => ({
      ...p,
      image: e.target.value
    })),
    placeholder: "#a8b4c8"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "fe-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setShowEditModal(false)
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveEdit,
    disabled: editSaving
  }, editSaving ? '저장중…' : '저장')))), tab === 'reviews' && /*#__PURE__*/React.createElement("section", {
    className: "detail-section"
  }, isSample ? /*#__PURE__*/React.createElement("div", {
    className: "reviews"
  }, [{
    name: '김○○ (전자부품 바이어)',
    date: '2026.03.18',
    rating: 5,
    body: '리드타임 정확하게 지켜주시고, 도면 수정 요청에도 빠르게 대응해주셨습니다. 단가도 합리적이고 다음 발주 예정.',
    deal: '5,000pcs · ₩12,400,000'
  }, {
    name: '박○○ (가전 OEM)',
    date: '2026.02.04',
    rating: 5,
    body: '소량 시제품도 거절 없이 받아주셔서 좋았습니다. 마감 품질이 특히 만족스럽습니다.',
    deal: '120pcs · ₩980,000'
  }, {
    name: '이○○ (자동차 부품)',
    date: '2026.01.22',
    rating: 4,
    body: '기본 품질은 좋으나 초기 커뮤니케이션이 다소 느렸습니다. 본 양산은 안정적이었음.',
    deal: '2,400pcs · ₩4,800,000'
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "review-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "review-name"
  }, r.name), /*#__PURE__*/React.createElement("div", {
    className: "review-date"
  }, r.date)), /*#__PURE__*/React.createElement("div", {
    className: "review-rating"
  }, Array.from({
    length: 5
  }).map((_, k) => /*#__PURE__*/React.createElement(Icon, {
    key: k,
    name: "star",
    size: 12,
    stroke: 2,
    className: k < r.rating ? 'star-on' : 'star-off'
  })))), /*#__PURE__*/React.createElement("p", {
    className: "review-body"
  }, r.body), /*#__PURE__*/React.createElement("div", {
    className: "review-deal"
  }, r.deal)))) : /*#__PURE__*/React.createElement("div", {
    className: "detail-empty"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 32,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("p", null, "\uC544\uC9C1 \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4"))));
};

// ══════════════════════════════════════════════════════════
// RFQ
// ══════════════════════════════════════════════════════════
const RfqPage = ({
  rfqIds,
  setRfqIds,
  onOpenFactory,
  onNav
}) => {
  const {
    FACTORIES,
    PROCESSES
  } = window.MFG_DATA;
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
    email: ''
  });
  const [rfqShowExtra, setRfqShowExtra] = useStateP(false);
  const [sending, setSending] = useStateP(false);
  const [sendResult, setSendResult] = useStateP(null);
  const [sentSnapshot, setSentSnapshot] = useStateP(null);
  const dispCount = sendResult?.ok ? sendResult?.count : selected.length;
  const step2Valid = !!(form.title && form.qty && form.deadline && form.email);
  return /*#__PURE__*/React.createElement("div", {
    className: "page page-rfq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "\uACAC\uC801 \uC694\uCCAD (RFQ)"), /*#__PURE__*/React.createElement("p", {
    className: "rfq-sub"
  }, "\uC120\uD0DD\uD55C \uC81C\uC870\uC0AC\uC5D0 \uB3D9\uC77C\uD55C \uC870\uAC74\uC73C\uB85C \uB3D9\uC2DC \uACAC\uC801\uC744 \uC694\uCCAD\uD569\uB2C8\uB2E4")), /*#__PURE__*/React.createElement("div", {
    className: "rfq-stepper"
  }, [{
    n: 1,
    label: '제조사 선택'
  }, {
    n: 2,
    label: '요청 조건'
  }, {
    n: 3,
    label: '검토 · 발송'
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    className: `rfq-step ${step >= s.n ? 'is-done' : ''} ${step === s.n ? 'is-current' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "rfq-step-n"
  }, step > s.n ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11,
    stroke: 3
  }) : s.n), /*#__PURE__*/React.createElement("span", {
    className: "rfq-step-l"
  }, s.label))))), /*#__PURE__*/React.createElement("div", {
    className: "rfq-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-body"
  }, step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "rfq-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-section-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC120\uD0DD\uB41C \uC81C\uC870\uC0AC (", selected.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: "link-btn",
    onClick: () => onNav('list')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13,
    stroke: 2.2
  }), " \uB354 \uCD94\uAC00\uD558\uAE30")), selected.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "rfq-empty"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "factory",
    size: 28,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("h4", null, "\uC544\uC9C1 \uC120\uD0DD\uB41C \uC81C\uC870\uC0AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", null, "\uC81C\uC870\uC0AC \uD0D0\uC0C9\uC5D0\uC11C \uCE74\uB4DC \uC88C\uCE21 \uC0C1\uB2E8\uC758 \uCCB4\uD06C\uBC15\uC2A4\uB85C \uCD94\uAC00\uD558\uC138\uC694. \uCD5C\uB300 10\uAC1C\uC0AC\uAE4C\uC9C0 \uB3D9\uC2DC \uC694\uCCAD \uAC00\uB2A5\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => onNav('list')
  }, "\uC81C\uC870\uC0AC \uD0D0\uC0C9\uC73C\uB85C \uC774\uB3D9")) : /*#__PURE__*/React.createElement("div", {
    className: "rfq-selected"
  }, selected.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    type: "button",
    className: "rfq-row rfq-row-clickable",
    onClick: () => onOpenFactory?.(f.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-row-img",
    style: {
      background: f.image
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-img-stripes"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-row-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-row-head"
  }, /*#__PURE__*/React.createElement("h4", null, f.name), /*#__PURE__*/React.createElement("span", {
    className: "rfq-row-city"
  }, f.city)), /*#__PURE__*/React.createElement("div", {
    className: "rfq-row-tags"
  }, f.processes.slice(0, 3).map(pid => {
    const p = PROCESSES.find(x => x.id === pid);
    return /*#__PURE__*/React.createElement("span", {
      key: pid,
      className: "mtag mtag-sm"
    }, p?.label);
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-row-stats"
  }, f.moq > 0 && /*#__PURE__*/React.createElement("span", null, "MOQ ", f.moq.toLocaleString(), " ", f.moqUnit || '피스'), f.leadDays > 0 && /*#__PURE__*/React.createElement("span", null, "\uB9AC\uB4DC ", f.leadDays, "\uC77C"), f.responseHr > 0 && f.responseHr < 24 && /*#__PURE__*/React.createElement("span", null, "\uC751\uB2F5 ", f.responseHr, "h"), f.rating > 0 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 10,
    stroke: 2
  }), " ", f.rating)), /*#__PURE__*/React.createElement("div", {
    className: "rfq-row-cta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_up_right",
    size: 11,
    stroke: 2.2
  }), " \uC0C1\uC138 \uBCF4\uAE30")), /*#__PURE__*/React.createElement("span", {
    className: "rfq-row-remove",
    role: "button",
    tabIndex: 0,
    onClick: e => {
      e.stopPropagation();
      setRfqIds(rfqIds.filter(x => x !== f.id));
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 14,
    stroke: 2
  })))))), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "rfq-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-section-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC694\uCCAD \uC870\uAC74")), /*#__PURE__*/React.createElement("div", {
    className: "rfq-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-field rfq-field-full"
  }, /*#__PURE__*/React.createElement("label", null, "\uC81C\uD488\uBA85 ", /*#__PURE__*/React.createElement("span", {
    className: "rfq-required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    placeholder: "\uC608: \uC54C\uB8E8\uBBF8\uB284 CNC \uAC00\uACF5 \uBE0C\uB77C\uCF13",
    value: form.title,
    onChange: e => setForm({
      ...form,
      title: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field"
  }, /*#__PURE__*/React.createElement("label", null, "\uC218\uB7C9 ", /*#__PURE__*/React.createElement("span", {
    className: "rfq-required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "\uC608: 1000",
    value: form.qty,
    onChange: e => setForm({
      ...form,
      qty: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field"
  }, /*#__PURE__*/React.createElement("label", null, "\uD76C\uB9DD \uB0A9\uAE30 ", /*#__PURE__*/React.createElement("span", {
    className: "rfq-required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.deadline,
    onChange: e => setForm({
      ...form,
      deadline: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field rfq-field-full"
  }, /*#__PURE__*/React.createElement("label", null, "\uB2F5\uBCC0 \uBC1B\uC744 \uC774\uBA54\uC77C ", /*#__PURE__*/React.createElement("span", {
    className: "rfq-required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "company@example.com",
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field rfq-field-full"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rfq-optional-toggle",
    onClick: () => setRfqShowExtra(!rfqShowExtra)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: rfqShowExtra ? 'chevron_down' : 'chevron_right',
    size: 13,
    stroke: 2
  }), "\uCD94\uAC00 \uC815\uBCF4 \uC785\uB825\uD558\uAE30 (\uC120\uD0DD)")), rfqShowExtra && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "rfq-field"
  }, /*#__PURE__*/React.createElement("label", null, "\uAC00\uACF5 \uBC29\uC2DD"), /*#__PURE__*/React.createElement("select", {
    value: form.process,
    onChange: e => setForm({
      ...form,
      process: e.target.value
    })
  }, PROCESSES.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field"
  }, /*#__PURE__*/React.createElement("label", null, "\uC8FC\uC694 \uC18C\uC7AC"), /*#__PURE__*/React.createElement("input", {
    placeholder: "\uC608: \uC54C\uB8E8\uBBF8\uB284 6061, ABS",
    value: form.material,
    onChange: e => setForm({
      ...form,
      material: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field rfq-field-full"
  }, /*#__PURE__*/React.createElement("label", null, "\uC608\uC0B0 \uBC94\uC704"), /*#__PURE__*/React.createElement("input", {
    placeholder: "\uC608: \u20A95,000,000 \u2014 \u20A910,000,000",
    value: form.budget,
    onChange: e => setForm({
      ...form,
      budget: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field rfq-field-full"
  }, /*#__PURE__*/React.createElement("label", null, "\uC694\uCCAD \uB0B4\uC6A9 / \uB3C4\uBA74 \uBA54\uBAA8"), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    placeholder: "\uD45C\uBA74 \uCC98\uB9AC, \uACF5\uCC28 \uC694\uAC74, \uAE30\uD0C0 \uC694\uCCAD\uC0AC\uD56D\uC744 \uC801\uC5B4\uC8FC\uC138\uC694",
    value: form.notes,
    onChange: e => setForm({
      ...form,
      notes: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "rfq-field rfq-field-full"
  }, /*#__PURE__*/React.createElement("label", null, "\uB3C4\uBA74 / \uC2DC\uBC29\uC11C \uCCA8\uBD80"), /*#__PURE__*/React.createElement("div", {
    className: "rfq-file"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16,
    stroke: 2
  }), form.file ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "rfq-file-name"
  }, form.file), /*#__PURE__*/React.createElement("span", {
    className: "rfq-file-status"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11,
    stroke: 2.4
  }), " \uC5C5\uB85C\uB4DC \uC644\uB8CC"), /*#__PURE__*/React.createElement("button", {
    className: "rfq-file-replace"
  }, "\uAD50\uCCB4")) : /*#__PURE__*/React.createElement("span", {
    className: "rfq-file-name",
    style: {
      color: 'var(--ink-4)'
    }
  }, "\uD30C\uC77C \uC120\uD0DD (PDF, STEP, DWG)")))))), step === 3 && /*#__PURE__*/React.createElement("div", {
    className: "rfq-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-section-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAC80\uD1A0 \xB7 \uBC1C\uC1A1")), /*#__PURE__*/React.createElement("div", {
    className: "rfq-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-review-card"
  }, /*#__PURE__*/React.createElement("h4", null, "\uC694\uCCAD \uC694\uC57D"), /*#__PURE__*/React.createElement("dl", {
    className: "rfq-dl"
  }, /*#__PURE__*/React.createElement("dt", null, "\uC81C\uD488\uBA85"), /*#__PURE__*/React.createElement("dd", null, form.title), /*#__PURE__*/React.createElement("dt", null, "\uC218\uB7C9"), /*#__PURE__*/React.createElement("dd", null, form.qty, " \uD53C\uC2A4"), /*#__PURE__*/React.createElement("dt", null, "\uB0A9\uAE30"), /*#__PURE__*/React.createElement("dd", null, form.deadline), form.material && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC18C\uC7AC"), /*#__PURE__*/React.createElement("dd", null, form.material)), form.budget && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uC608\uC0B0"), /*#__PURE__*/React.createElement("dd", null, form.budget)), form.file && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("dt", null, "\uCCA8\uBD80"), /*#__PURE__*/React.createElement("dd", null, form.file)))), /*#__PURE__*/React.createElement("div", {
    className: "rfq-review-card"
  }, /*#__PURE__*/React.createElement("h4", null, "\uBC1C\uC1A1 \uB300\uC0C1 (", selected.length, "\uAC1C\uC0AC)"), /*#__PURE__*/React.createElement("ul", {
    className: "rfq-review-list"
  }, selected.map(f => /*#__PURE__*/React.createElement("li", {
    key: f.id
  }, /*#__PURE__*/React.createElement("span", null, f.name), f.responseHr > 0 && f.responseHr < 24 && /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, "\uC608\uC0C1 \uC751\uB2F5 ", f.responseHr, "h \uB0B4"))))), /*#__PURE__*/React.createElement("div", {
    className: "rfq-disclaimer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", null, "\uC81C\uC870\uC0AC\uC5D0\uB294 \uD68C\uC0AC\uBA85\xB7\uC5F0\uB77D\uCC98\uAC00 \uC790\uB3D9 \uB9C8\uC2A4\uD0B9\uB41C \uC0C1\uD0DC\uB85C \uBC1C\uC1A1\uB418\uBA70, \uC751\uB2F5 \uD6C4 \uC591 \uB2F9\uC0AC\uC790 \uB3D9\uC758 \uC2DC \uACF5\uAC1C\uB429\uB2C8\uB2E4."))))), /*#__PURE__*/React.createElement("aside", {
    className: "rfq-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-side-card"
  }, /*#__PURE__*/React.createElement("h4", null, "\uC694\uCCAD \uC694\uC57D"), /*#__PURE__*/React.createElement("div", {
    className: "rfq-side-stat"
  }, /*#__PURE__*/React.createElement("span", null, "\uC120\uD0DD \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("strong", null, dispCount, "\uACF3")), /*#__PURE__*/React.createElement("div", {
    className: "rfq-side-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rfq-side-actions"
  }, sendResult?.ok ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sent",
    disabled: true
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    stroke: 2.4
  }), " ", sendResult?.count, "\uAC1C\uC0AC \uBC1C\uC1A1\uC644\uB8CC") : /*#__PURE__*/React.createElement(React.Fragment, null, step > 1 && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setStep(step - 1)
  }, "\uC774\uC804"), step < 3 ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    disabled: step === 1 ? selected.length === 0 : !step2Valid,
    onClick: () => setStep(step + 1)
  }, "\uB2E4\uC74C \uB2E8\uACC4 ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  })) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-send",
    disabled: sending,
    onClick: async () => {
      const snap = {
        count: selected.length
      };
      setSending(true);
      setSendResult(null);
      try {
        const resp = await fetch('/.netlify/functions/send-rfq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            factoryIds: rfqIds,
            buyerEmail: form.email,
            productName: form.title,
            quantity: form.qty ? String(form.qty) + ' 피스' : '수량 미정',
            deadline: form.deadline,
            message: [form.material ? '소재: ' + form.material : '', form.budget ? '예산: ' + form.budget : '', form.notes || ''].filter(Boolean).join('\n') || undefined
          })
        });
        if (resp.ok) {
          await resp.json();
          setSentSnapshot(snap);
          setSendResult({
            ok: true,
            count: snap.count
          });
          setRfqIds([]);
        } else {
          setSendResult({
            ok: false
          });
        }
      } catch {
        setSendResult({
          ok: false
        });
      } finally {
        setSending(false);
      }
    }
  }, sending ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "rfq-sending-spinner"
  }), "\uBC1C\uC1A1 \uC911\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    stroke: 2.4
  }), " ", dispCount, "\uAC1C\uC0AC\uC5D0 \uBC1C\uC1A1")), sendResult?.ok === false && /*#__PURE__*/React.createElement("div", {
    className: "rfq-send-result rfq-send-err"
  }, "\uBC1C\uC1A1 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694."))), /*#__PURE__*/React.createElement("div", {
    className: "rfq-side-tip"
  }, sendResult?.ok ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", null, "\uC601\uC5C5\uC77C \uAE30\uC900 1~2\uC77C \uB0B4 \uB2F5\uBCC0\uC744 \uBC1B\uC73C\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 11,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", null, "3\uAC1C\uC0AC \uC774\uC0C1\uC5D0 \uB3D9\uC2DC \uC694\uCCAD \uC2DC \uD3C9\uADE0 \uB2E8\uAC00 ", /*#__PURE__*/React.createElement("strong", null, "12% \uC808\uAC10"))))))));
};
Object.assign(window, {
  HomePage,
  ListPage,
  DetailPage,
  RfqPage
});

// ──────────────────────────────────────────────────────────
// 검색 UX · 자동추천 ON/OFF 토글 페이지
// ──────────────────────────────────────────────────────────
const {
  useState: useStateSX,
  useMemo: useMemoSX,
  useEffect: useEffectSX,
  useRef: useRefSX
} = React;

// Module-level cache: persists across unmount/remount within the same page session
let _sxStateCache = null;
const SX_RECOMMEND_3 = [{
  id: 'metal',
  title: '금속 가공',
  en: 'Metal Fabrication',
  desc: '자판기 외관 캐비닛, 내부 프레임, 동전·지폐 모듈 하우징 등 강판 절단·절곡·용접 일괄 처리.',
  count: 184,
  match: 96,
  glyph: 'metal',
  tags: ['프레스', '절곡', '용접', '도장'],
  avgLead: '14일',
  avgPrice: '₩180k~'
}, {
  id: 'electronic',
  title: '전자 제어',
  en: 'Electronic Control',
  desc: '자판기 메인 컨트롤러 PCB, 결제 단말 연동 모듈, 센서·디스플레이 제어 보드 설계·양산.',
  count: 92,
  match: 91,
  glyph: 'electronic',
  tags: ['PCB', 'SMT', '펌웨어', 'IoT'],
  avgLead: '21일',
  avgPrice: '₩4.5k~'
}, {
  id: 'assembly',
  title: '기계 조립',
  en: 'Mechanical Assembly',
  desc: '컨베이어·서보모터·솔레노이드 등 구동부 조립 + 최종 자판기 완성품 통합 조립·QA.',
  count: 67,
  match: 88,
  glyph: 'assembly',
  tags: ['조립', '검사', '포장', 'OEM'],
  avgLead: '18일',
  avgPrice: '협의'
}];
const SX_ALL_CATEGORIES = [{
  ...SX_RECOMMEND_3[0],
  rel: 96,
  popular: true
}, {
  ...SX_RECOMMEND_3[1],
  rel: 91,
  popular: true
}, {
  ...SX_RECOMMEND_3[2],
  rel: 88,
  popular: false
}, {
  id: 'plastic',
  title: '플라스틱 사출',
  en: 'Plastic Injection',
  desc: '내부 부품 트레이, 컵 디스펜서, 외관 트림 등 ABS·PC 사출 부품.',
  count: 142,
  rel: 78,
  popular: true,
  glyph: 'plastic',
  tags: ['사출', '금형', 'ABS', 'PC']
}, {
  id: 'cooling',
  title: '냉각·열교환',
  en: 'Refrigeration',
  desc: '음료 냉각 모듈, 컴프레서 유닛, 냉매 시스템 설계·제작 전문.',
  count: 38,
  rel: 74,
  popular: false,
  glyph: 'cooling',
  tags: ['냉각기', '열교환기', '컴프레서']
}, {
  id: 'sheet',
  title: '판금 가공',
  en: 'Sheet Metal',
  desc: '레이저 절단·절곡·펀칭 기반 자판기 외관 판넬 및 도어 패널.',
  count: 211,
  rel: 71,
  popular: true,
  glyph: 'sheet',
  tags: ['레이저', '절곡', '펀칭']
}, {
  id: 'display',
  title: '디스플레이·UI',
  en: 'Display & UI',
  desc: '터치 디스플레이, LCD/LED 보드, 키패드 모듈 공급 및 통합.',
  count: 54,
  rel: 67,
  popular: false,
  glyph: 'display',
  tags: ['LCD', '터치', '키패드']
}, {
  id: 'payment',
  title: '결제 모듈',
  en: 'Payment Module',
  desc: '동전·지폐 인식기, NFC/QR 결제 단말, 카드 리더 모듈 OEM.',
  count: 23,
  rel: 62,
  popular: false,
  glyph: 'payment',
  tags: ['NFC', 'QR', '동전인식']
}, {
  id: 'paint',
  title: '도장·코팅',
  en: 'Painting & Coating',
  desc: '분체도장, 우레탄 코팅, 실내·옥외용 자판기 외관 마감.',
  count: 88,
  rel: 58,
  popular: false,
  glyph: 'paint',
  tags: ['분체도장', '우레탄', '옥외용']
}];
const SX_RELATED_KEYWORDS = ['제조문의', 'OEM', 'ODM', '샘플제작', '소량생산', '견적요청'];
function scoreFactory(factory, searchTerms) {
  const st = searchTerms || {};
  let score = 0;
  (st.industries || []).forEach(ind => {
    if ((factory.industries || []).includes(ind)) score += 30;
  });
  (st.processes || []).forEach(proc => {
    if ((factory.processes || []).includes(proc)) score += 25;
  });
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
function SearchUXPage({
  onOpenFactory,
  onSearch,
  onNav,
  initialQuery
}) {
  // If arriving from home search with a new/different query, wipe stale cache
  const _shouldAutoSearch = !!initialQuery && (!_sxStateCache || _sxStateCache.query !== initialQuery);
  if (_shouldAutoSearch) _sxStateCache = null;
  const _autoSearchedRef = useRefSX(false);
  const [query, setQuery] = useStateSX(() => _sxStateCache?.query ?? initialQuery ?? '');
  const [smart, setSmart] = useStateSX(() => _sxStateCache ? _sxStateCache.smart ?? true : true);
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
    _snapRef.current = {
      query,
      smart,
      activeKw,
      sort,
      aiResult,
      consulting,
      matchedFactories
    };
  }, [query, smart, activeKw, sort, aiResult, consulting, matchedFactories]);

  // On unmount: save snapshot to module-level cache for next mount
  useEffectSX(() => () => {
    _sxStateCache = _snapRef.current;
  }, []);

  // Auto-trigger AI search when navigating here from home page with a query
  useEffectSX(() => {
    if (_shouldAutoSearch && !_autoSearchedRef.current) {
      _autoSearchedRef.current = true;
      handleSearch();
    }
  }, []);
  const sorted = useMemoSX(() => {
    const arr = [...SX_ALL_CATEGORIES];
    if (sort === 'popular') arr.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));else if (sort === 'count') arr.sort((a, b) => b.count - a.count);else arr.sort((a, b) => b.rel - a.rel);
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query
        })
      });
      if (!resp.ok) throw new Error('API error');
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      data.topCategories = (data.topCategories || []).map((c, i) => ({
        glyph: 'metal',
        count: 0,
        avgLead: '협의',
        avgPrice: '협의',
        ...c,
        id: c.id || `ai-${i}`
      }));
      setAiResult(data);
      if (data.consulting) {
        console.log('[consulting]', data.consulting);
        setConsulting(data.consulting);
      }

      // Use server-matched factories from Netlify function if available
      if (data.matchedFactories && data.matchedFactories.length > 0) {
        // Fetch only the specific matched IDs — never pull the full table
        const ids = data.matchedFactories.slice(0, 10).map(m => m.id);
        let rows = [];
        if (window._sb && ids.length) {
          try {
            const {
              data: dbRows
            } = await window._sb.from('factories').select('*').in('id', ids);
            if (dbRows) rows = dbRows;
          } catch (_) {}
        }
        const staticById = {};
        ((window.MFG_DATA || {}).FACTORIES || []).forEach(f => {
          staticById[f.id] = f;
        });
        const byId = {};
        (rows.length ? rows.map(window._dbRowToFactory) : []).forEach(f => {
          byId[f.id] = f;
        });
        const scored = data.matchedFactories.map(m => byId[m.id] || staticById[m.id] ? {
          ...(byId[m.id] || staticById[m.id]),
          _matchPct: m.matchPct
        } : null).filter(Boolean);
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
            q = q.order('id', {
              ascending: true
            }).limit(100);
            const {
              data: rows
            } = await q;
            if (rows && rows.length) allFactories = rows.map(window._dbRowToFactory);
          } catch (_) {}
        }
        if (!allFactories.length) allFactories = (window.MFG_DATA || {}).FACTORIES || [];
        const bestPossible = (st.industries || []).length * 30 + (st.processes || []).length * 25 + (st.materials || []).length * 15 + (st.keywords || []).length * 18;
        const scored = allFactories.filter(f => !f.hidden).map(f => ({
          ...f,
          _score: scoreFactory(f, st)
        })).filter(f => f._score > 0).sort((a, b) => b._score - a._score).slice(0, 6).map(f => ({
          ...f,
          _matchPct: bestPossible > 0 ? Math.min(98, Math.max(38, Math.round(f._score / bestPossible * 100))) : 60
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
  return /*#__PURE__*/React.createElement("main", {
    className: "search-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 11,
    stroke: 2.4
  }), "\uAC80\uC0C9 UX \xB7 Search Pattern"), /*#__PURE__*/React.createElement("h1", {
    className: "sx-title"
  }, "\uD0A4\uC6CC\uB4DC\uB85C \uAC00\uC7A5 \uC801\uD569\uD55C \uC81C\uC870 \uCE74\uD14C\uACE0\uB9AC\uB97C \uCC3E\uC73C\uC138\uC694"), /*#__PURE__*/React.createElement("p", {
    className: "sx-sub"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink-1)'
    }
  }, "\uC790\uB3D9\uCD94\uCC9C"), "\uC774 \uCF1C\uC838 \uC788\uC73C\uBA74 AI\uAC00 \uAC00\uC7A5 \uC801\uD569\uD55C \uCE74\uD14C\uACE0\uB9AC 3\uAC1C\uB9CC \uCD94\uCD9C\uD574 \uBE60\uB978 \uC758\uC0AC\uACB0\uC815\uC744 \uB3D5\uC2B5\uB2C8\uB2E4. \uB044\uBA74 \uBAA8\uB4E0 \uC5F0\uAD00 \uCE74\uD14C\uACE0\uB9AC\uB97C \uB9AC\uC2A4\uD2B8\uB85C \uD0D0\uC0C9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    className: `sx-bar ${focused ? 'is-focused' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18,
    stroke: 2
  }), /*#__PURE__*/React.createElement("input", {
    className: "sx-input",
    placeholder: "\uC608) \uACE0\uCD94\uC7A5 500\uAC1C \uB9CC\uB4E4\uACE0 \uC2F6\uC5B4\uC694, \uD50C\uB77C\uC2A4\uD2F1 \uCF00\uC774\uC2A4 OEM \uCC3E\uC544\uC694",
    value: query,
    onChange: e => setQuery(e.target.value),
    onKeyDown: e => e.key === 'Enter' && handleSearch(),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }), query && /*#__PURE__*/React.createElement("button", {
    className: "sx-input-clear",
    onClick: () => setQuery(''),
    "aria-label": "\uC9C0\uC6B0\uAE30"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 11,
    stroke: 2.4
  }))), /*#__PURE__*/React.createElement("label", {
    className: `sx-toggle ${smart ? 'is-on' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: smart,
    onChange: e => setSmart(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "sx-toggle-switch"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sx-toggle-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-toggle-label"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 11,
    stroke: 2.4
  }), "\uC790\uB3D9\uCD94\uCC9C"), /*#__PURE__*/React.createElement("span", {
    className: "sx-toggle-hint"
  }, smart ? 'AI가 3개만 추출' : '전체 리스트 탐색'))), /*#__PURE__*/React.createElement("button", {
    className: "sx-search-btn",
    onClick: handleSearch,
    disabled: loading
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    stroke: 2.4
  }), loading ? '분석 중…' : '검색')), loading && /*#__PURE__*/React.createElement("div", {
    className: "sx-ai-loading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-mode-pulse"
  }), "Claude\uAC00 \uACF5\uAE09\uB9DD\uC744 \uBD84\uC11D\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4..."), aiError && /*#__PURE__*/React.createElement("div", {
    className: "sx-ai-error"
  }, aiError), aiResult && /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-chain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-header"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 13,
    stroke: 2.4
  }), "\uACF5\uAE09\uB9DD \uBD84\uC11D", /*#__PURE__*/React.createElement("span", {
    className: "sx-supply-intent"
  }, "\xB7 ", aiResult.intent)), /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-steps"
  }, aiResult.supplyChain.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step-num"
  }, s.step), /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step-label"
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-step-detail"
  }, s.detail)), i < aiResult.supplyChain.length - 1 && /*#__PURE__*/React.createElement("div", {
    className: "sx-supply-arrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 16,
    stroke: 2
  })))))), matchedFactories.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sx-match-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-match-header"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement(Icon, {
    name: "factory",
    size: 15,
    stroke: 2
  }), "\uB9E4\uCE6D \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("span", {
    className: "sx-match-count"
  }, matchedFactories.length, "\uAC1C\uC0AC \uB9E4\uCE6D")), /*#__PURE__*/React.createElement("div", {
    className: "sx-match-grid"
  }, matchedFactories.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    className: "sx-match-card-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-match-score-badge",
    style: {
      background: f._matchPct >= 70 ? '#16a34a' : f._matchPct >= 50 ? '#d97706' : '#64748b'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-match-score-pct"
  }, f._matchPct, "%"), /*#__PURE__*/React.createElement("span", {
    className: "sx-match-score-label"
  }, "\uB9E4\uCE6D")), /*#__PURE__*/React.createElement(ManufacturerCard, {
    f: f,
    onOpen: id => {
      if (!window._factoryCache) window._factoryCache = {};
      window._factoryCache[id] = f;
      onOpenFactory(id);
    },
    compact: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "sx-results"
  }, (() => {
    const displayConsulting = consulting || {
      unitCost: 'AI 분석 중...',
      moqGuide: '검색 후 표시',
      leadTime: '-',
      budgetRange: '-',
      certRequired: [],
      caution: '검색어를 입력해주세요'
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-head"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkle",
      size: 14,
      stroke: 2.4
    }), "AI \uC0AC\uC804 \uCEE8\uC124\uD305"), /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-grid"
    }, displayConsulting.unitCost && /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-label"
    }, "\uC608\uC0C1 \uB2E8\uAC00"), /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-val"
    }, displayConsulting.unitCost)), displayConsulting.moqGuide && /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-label"
    }, "\uCD5C\uC18C \uBC1C\uC8FC\uB7C9"), /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-val"
    }, displayConsulting.moqGuide)), displayConsulting.leadTime && /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-label"
    }, "\uB9AC\uB4DC\uD0C0\uC784"), /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-val"
    }, displayConsulting.leadTime)), displayConsulting.budgetRange && /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-label"
    }, "\uC608\uC0B0 \uBC94\uC704"), /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-val"
    }, displayConsulting.budgetRange)), (displayConsulting.certRequired || []).length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-item"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-label"
    }, "\uD544\uC694 \uC778\uC99D"), /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-val"
    }, displayConsulting.certRequired.join(' · '))), displayConsulting.caution && /*#__PURE__*/React.createElement("div", {
      className: "sx-consulting-item sx-consulting-caution"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-label"
    }, "\uC8FC\uC758\uC0AC\uD56D"), /*#__PURE__*/React.createElement("span", {
      className: "sx-consulting-val"
    }, displayConsulting.caution))));
  })(), smart ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner is-on"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 16,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\"", query, "\""), "\uC5D0 \uAC00\uC7A5 \uC801\uD569\uD55C ", /*#__PURE__*/React.createElement("strong", null, "3\uAC1C \uCE74\uD14C\uACE0\uB9AC"), "\uB97C \uCD94\uCD9C\uD588\uC2B5\uB2C8\uB2E4 \xB7", aiResult ? 'Claude 실시간 분석 완료' : '매칭률·거래량·리드타임 종합 분석'), /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-mode-pulse"
  }), aiResult ? 'Claude AI' : 'AI 분석 0.4초')), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-h"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 16,
    stroke: 2.2
  }), "\uCD94\uCC9C \uCE74\uD14C\uACE0\uB9AC"), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-h-rank"
  }, "\uB9E4\uCE6D\uB960", /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-h-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-h-bar-fill",
    style: {
      width: `${topMatch}%`
    }
  })), /*#__PURE__*/React.createElement("strong", null, topMatch, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-grid"
  }, rec3.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.id || i,
    className: "sx-rec",
    onClick: () => onNav && onNav('list')
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-rank"
  }, "RANK ", /*#__PURE__*/React.createElement("strong", null, "0", i + 1)), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-glyph"
  }, /*#__PURE__*/React.createElement(SXGlyph, {
    kind: r.glyph
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-title-row"
  }, /*#__PURE__*/React.createElement("h3", null, r.title), /*#__PURE__*/React.createElement("span", {
    className: "sx-rec-match"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 9,
    stroke: 2.6
  }), "\uB9E4\uCE6D ", r.match, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--ink-4)',
      fontFamily: 'var(--font-num)',
      marginTop: 2,
      fontWeight: 500,
      whiteSpace: 'nowrap'
    }
  }, r.en)), /*#__PURE__*/React.createElement("p", {
    className: "sx-rec-desc"
  }, r.desc), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-tags"
  }, r.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "sx-rec-tag"
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-count"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-rec-count-n"
  }, r.count), /*#__PURE__*/React.createElement("span", {
    className: "sx-rec-count-l"
  }, "\uAC1C\uC0AC")), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-stats-meta"
  }, /*#__PURE__*/React.createElement("span", null, "\uD3C9\uADE0 \uB9AC\uB4DC ", /*#__PURE__*/React.createElement("strong", null, r.avgLead)), /*#__PURE__*/React.createElement("span", null, "\uB2E8\uAC00 ", /*#__PURE__*/React.createElement("strong", null, r.avgPrice)))), /*#__PURE__*/React.createElement("div", {
    className: "sx-rec-cta"
  }, /*#__PURE__*/React.createElement("span", null, "\uC81C\uC870\uC0AC \uB354 \uBCF4\uAE30"), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 15,
    stroke: 2.4,
    className: "sx-rec-cta-arrow"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "sx-tip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 14,
    stroke: 2.2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uC65C 3\uAC1C\uB9CC?"), " \uC120\uD0DD\uC9C0\uAC00 \uB9CE\uC744\uC218\uB85D \uC758\uC0AC\uACB0\uC815 \uC2DC\uAC04\uC774 \uAE38\uC5B4\uC9D1\uB2C8\uB2E4. \uC790\uB3D9\uCD94\uCC9C\uC740 \uB9E4\uCE6D\uB960 88% \uC774\uC0C1\uC758 \uCE74\uD14C\uACE0\uB9AC\uB9CC \uCD94\uCD9C\uD574 \uD3C9\uADE0 ", /*#__PURE__*/React.createElement("strong", null, "\uD0D0\uC0C9 \uC2DC\uAC04\uC744 73% \uB2E8\uCD95"), "\uD569\uB2C8\uB2E4. \uB354 \uB2E4\uC591\uD55C \uC120\uD0DD\uC9C0\uAC00 \uD544\uC694\uD558\uBA74 \uC6B0\uCE21 \uC790\uB3D9\uCD94\uCC9C \uD1A0\uAE00\uC744 \uB044\uC138\uC694."))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner is-off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 16,
    stroke: 2.2
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\"", query, "\""), "\uC640 \uC5F0\uAD00\uB41C ", /*#__PURE__*/React.createElement("strong", null, SX_ALL_CATEGORIES.length, "\uAC1C \uCE74\uD14C\uACE0\uB9AC"), "\uB97C \uBAA8\uB450 \uD45C\uC2DC\uD569\uB2C8\uB2E4 \xB7 \uAD00\uB828\uB3C4\xB7\uC778\uAE30\xB7\uC81C\uC870\uC0AC \uC218\uB85C \uC815\uB82C \uAC00\uB2A5"), /*#__PURE__*/React.createElement("div", {
    className: "sx-mode-banner-meta"
  }, "\uD0D0\uC0C9 \uBAA8\uB4DC")), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-h-l"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC804\uCCB4 \uCE74\uD14C\uACE0\uB9AC"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, SX_ALL_CATEGORIES.length), "\uAC1C \uACB0\uACFC")), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-h-r"
  }, [{
    id: 'rel',
    label: '관련도순'
  }, {
    id: 'popular',
    label: '인기순'
  }, {
    id: 'count',
    label: '제조사 수'
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `sx-sort-btn ${sort === s.id ? 'is-active' : ''}`,
    onClick: () => setSort(s.id)
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    className: "sx-list"
  }, sorted.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "sx-list-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-glyph"
  }, /*#__PURE__*/React.createElement(SXGlyph, {
    kind: c.glyph
  })), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-title-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-list-title"
  }, c.title), /*#__PURE__*/React.createElement("span", {
    className: "sx-list-en"
  }, c.en), c.popular && /*#__PURE__*/React.createElement("span", {
    className: "sx-list-popular"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 9,
    stroke: 2.4
  }), "\uC778\uAE30")), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-desc"
  }, c.desc)), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-tags"
  }, c.tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "sx-rec-tag"
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-rel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-rel-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-rel-bar-fill",
    style: {
      width: `${c.rel}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "sx-list-rel-v"
  }, c.rel, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-count"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-count-n"
  }, c.count), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-count-l"
  }, "\uAC1C\uC0AC")), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-arrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 14,
    stroke: 2.4
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "sx-list-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-list-foot-l"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 13,
    stroke: 2
  }), "\uCD1D ", /*#__PURE__*/React.createElement("strong", null, SX_ALL_CATEGORIES.reduce((s, c) => s + c.count, 0)), "\uAC1C \uC81C\uC870\uC0AC \xB7 \uD3C9\uADE0 \uAD00\uB828\uB3C4 ", /*#__PURE__*/React.createElement("strong", null, Math.round(SX_ALL_CATEGORIES.reduce((s, c) => s + c.rel, 0) / SX_ALL_CATEGORIES.length), "%")), /*#__PURE__*/React.createElement("button", {
    className: "link-btn"
  }, "\uD0A4\uC6CC\uB4DC \uAC80\uC0C9 \uC800\uC7A5", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_up_right",
    size: 12,
    stroke: 2
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "sx-related"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sx-related-k"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 11,
    stroke: 2.2
  }), "\uC5F0\uAD00 \uD0A4\uC6CC\uB4DC:"), SX_RELATED_KEYWORDS.map(kw => /*#__PURE__*/React.createElement("button", {
    key: kw,
    className: `sx-related-chip ${activeKw === kw ? 'is-active' : ''}`,
    onClick: () => setActiveKw(activeKw === kw ? null : kw)
  }, kw))), /*#__PURE__*/React.createElement("div", {
    className: "sx-compare"
  }, /*#__PURE__*/React.createElement("h3", null, "\uB450 \uBAA8\uB4DC \uBE44\uAD50"), /*#__PURE__*/React.createElement("p", null, "\uAC19\uC740 \uAC80\uC0C9\uC5B4 \"\uC74C\uB8CC\uC790\uD310\uAE30\"\uC5D0 \uB300\uD574 \uB450 \uBC29\uC2DD\uC774 \uC5B4\uB5BB\uAC8C \uB2E4\uB978\uC9C0 \uD55C\uB208\uC5D0 \uBE44\uAD50\uD558\uC138\uC694."), /*#__PURE__*/React.createElement("div", {
    className: "sx-compare-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sx-compare-card is-on"
  }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("span", {
    className: "dot-label"
  }), " \uC790\uB3D9\uCD94\uCC9C ON \xB7 \uBE60\uB978 \uC120\uD0DD"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uB9E4\uCE6D\uB960 88% \uC774\uC0C1 \uC0C1\uC704 3\uAC1C\uB9CC \uD45C\uC2DC"), /*#__PURE__*/React.createElement("li", null, "\uCE74\uB4DC\uD615 UI \xB7 \uD55C\uB208\uC5D0 \uBE44\uAD50 \uAC00\uB2A5"), /*#__PURE__*/React.createElement("li", null, "\uAC01 \uCE74\uB4DC\uC5D0 \uB9E4\uCE6D\uB960\xB7\uC81C\uC870\uC0AC \uC218\xB7\uD3C9\uADE0 \uB9AC\uB4DC\uD0C0\uC784 \uC989\uC2DC \uD655\uC778"), /*#__PURE__*/React.createElement("li", null, "\uCD08\uBCF4 \uBC14\uC774\uC5B4 \xB7 \uBE60\uB978 \uC758\uC0AC\uACB0\uC815 \uD544\uC694 \uC2DC"))), /*#__PURE__*/React.createElement("div", {
    className: "sx-compare-card is-off"
  }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("span", {
    className: "dot-label"
  }), " \uC790\uB3D9\uCD94\uCC9C OFF \xB7 \uAE4A\uC740 \uD0D0\uC0C9"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC5F0\uAD00 \uCE74\uD14C\uACE0\uB9AC \uC804\uCCB4 \uD45C\uC2DC (\uD604\uC7AC 9\uAC1C)"), /*#__PURE__*/React.createElement("li", null, "\uB9AC\uC2A4\uD2B8\uD615 UI \xB7 \uAD00\uB828\uB3C4\xB7\uC778\uAE30\xB7\uC81C\uC870\uC0AC \uC218 \uC815\uB82C"), /*#__PURE__*/React.createElement("li", null, "\uC778\uAE30 \uD0DC\uADF8\xB7\uAD00\uB828\uB3C4 \uB9C9\uB300\uB85C \uC2DC\uAC01\uC801 \uBE44\uAD50"), /*#__PURE__*/React.createElement("li", null, "\uC219\uB828 \uBC14\uC774\uC5B4 \xB7 \uB2E4\uC591\uD55C \uC635\uC158 \uBE44\uAD50 \uD544\uC694 \uC2DC"))))));
}
window.SearchUXPage = SearchUXPage;

// ──────────────────────────────────────────────────────────
// 가입 / 로그인 / 인증 / 온보딩 (4단계)
// ──────────────────────────────────────────────────────────
const {
  useState: useAuthState,
  useEffect: useAuthEffect,
  useRef: useAuthRef
} = React;

// ─── Mini logo ───
const AuthLogo = ({
  size = 36
}) => /*#__PURE__*/React.createElement("a", {
  className: "auth-logo",
  href: "#",
  onClick: e => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('auth-nav', {
      detail: 'landing'
    }));
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "logo-mark",
  style: {
    width: size,
    height: size
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "logo-mark-inner"
})), /*#__PURE__*/React.createElement("span", {
  className: "logo-text"
}, /*#__PURE__*/React.createElement("span", {
  className: "logo-ko"
}, "\uACF5\uC7A5\uB9E4\uCE6D"), /*#__PURE__*/React.createElement("span", {
  className: "logo-en"
}, "FactoryMatch")));

// ═══════════════════════════════════════════════════════════
// 1) LANDING (로그아웃 상태)
// ═══════════════════════════════════════════════════════════
function LandingPage({
  onNav,
  authed
}) {
  const [q, setQ] = useAuthState('');
  const [showModal, setShowModal] = useAuthState(false);
  const handleSearch = val => {
    const query = (val ?? q).trim();
    if (!query) return;
    setShowModal(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ldg2"
  }, /*#__PURE__*/React.createElement(ParticleCanvas, null), /*#__PURE__*/React.createElement("main", {
    className: "ldg2-main"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ldg2-hero"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "ldg2-headline"
  }, "AI\uAC00 \uCC3E\uC544\uC8FC\uB294 \uC6B0\uB9AC \uD68C\uC0AC\uC5D0 \uB531 \uB9DE\uB294 ", /*#__PURE__*/React.createElement("span", {
    className: "ldg2-headline-accent"
  }, "\uC81C\uC870\uACF5\uC7A5")), /*#__PURE__*/React.createElement("p", {
    className: "ldg2-sub"
  }, "\uACF5\uC815\uACFC \uC18C\uC7AC\uB9CC \uC785\uB825\uD558\uC138\uC694. \uB9E4\uCE6D\uBD80\uD130 \uACAC\uC801\uAE4C\uC9C0."), /*#__PURE__*/React.createElement("div", {
    className: "ldg2-search-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "ldg2-search-input",
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleSearch();
    },
    placeholder: "\uC608: CNC \uC54C\uB8E8\uBBF8\uB284 \uAC00\uACF5",
    autoComplete: "off"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ldg2-search-btn",
    onClick: handleSearch
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20,
    stroke: 2.2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ldg2-tag-row"
  }, HOME_TAGS.map(tag => /*#__PURE__*/React.createElement("button", {
    key: tag,
    className: "ldg2-tag",
    onClick: () => handleSearch(tag)
  }, tag)))), /*#__PURE__*/React.createElement("div", {
    className: "ldg2-stats"
  }, "\uC804\uAD6D ", /*#__PURE__*/React.createElement("strong", null, "12,138\uAC1C"), " \uACF5\uC7A5 DB \xA0\xB7\xA0 ", /*#__PURE__*/React.createElement("strong", null, "1,192\uAC1C"), " \uC0AC\uC5C5\uC790 \uC778\uC99D")), showModal && /*#__PURE__*/React.createElement("div", {
    className: "ldg2-modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ldg2-modal"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ldg2-modal-title"
  }, "\uAC80\uC0C9\uD558\uB824\uBA74 \uAC00\uC785\uC774 \uD544\uC694\uD569\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
    className: "ldg2-modal-sub"
  }, "\uBB34\uB8CC\uB85C \uAC00\uC785\uD558\uBA74 \uC804\uAD6D 12,138\uAC1C \uACF5\uC7A5 DB\uB97C \uAC80\uC0C9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    className: "ldg2-modal-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ldg2-modal-signup-btn",
    onClick: () => {
      window.logVisitor?.('signup_triggered', {
        trigger: 'landing_search_modal'
      });
      onNav('signup');
    }
  }, "\uBB34\uB8CC\uB85C \uC2DC\uC791\uD558\uAE30"), /*#__PURE__*/React.createElement("button", {
    className: "ldg2-modal-login-btn",
    onClick: () => onNav('login')
  }, "\uB85C\uADF8\uC778")))));
}

// ═══════════════════════════════════════════════════════════
// 2) AUTH FORM (회원가입 / 로그인)
// ═══════════════════════════════════════════════════════════
function AuthFormPage({
  mode,
  onNav,
  onSubmit
}) {
  const isSignup = mode === 'signup';
  const [email, setEmail] = useAuthState('');
  const [password, setPassword] = useAuthState('');
  const [showPw, setShowPw] = useAuthState(false);
  const [agree, setAgree] = useAuthState({
    tos: false,
    privacy: false,
    marketing: false
  });
  const allAgreed = agree.tos && agree.privacy;
  const [socialToast, setSocialToast] = useAuthState(null);
  const handleSocialLogin = provider => {
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
  const handleSubmit = e => {
    e.preventDefault();
    if (canSubmit) onSubmit({
      email
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "auth-mini-hdr"
  }, /*#__PURE__*/React.createElement(AuthLogo, {
    size: 32
  }), /*#__PURE__*/React.createElement("button", {
    className: "auth-back-btn",
    onClick: () => onNav('home')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 14,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "auth-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head"
  }, /*#__PURE__*/React.createElement("h1", null, isSignup ? '공장매칭 시작하기' : '다시 오신 걸 환영해요'), /*#__PURE__*/React.createElement("p", null, isSignup ? '가입 후 1분이면 맞춤 제조사를 만나볼 수 있어요.' : '이메일로 로그인하거나 구글 계정을 사용하세요.')), socialToast && /*#__PURE__*/React.createElement("div", {
    className: "auth-social-toast"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 13,
    stroke: 2
  }), socialToast), /*#__PURE__*/React.createElement("div", {
    className: "auth-social-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "auth-social-btn auth-kakao-btn",
    onClick: () => handleSocialLogin('kakao')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "17",
    viewBox: "0 0 18 17",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M9 0C4.03 0 0 3.13 0 7c0 2.48 1.57 4.67 3.96 5.93l-.85 3.18 3.6-2.35c.74.1 1.5.24 2.29.24 4.97 0 9-3.13 9-7S13.97 0 9 0z"
  })), isSignup ? '카카오로 가입' : '카카오로 로그인'), /*#__PURE__*/React.createElement("button", {
    className: "auth-social-btn auth-naver-btn",
    onClick: () => handleSocialLogin('naver')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M9.13 8.16L6.12 3H3v10h3.87V7.84L9.88 13H13V3H9.13z"
  })), isSignup ? '네이버로 가입' : '네이버로 로그인'), /*#__PURE__*/React.createElement("button", {
    className: "auth-social-btn auth-google-btn",
    onClick: () => onSubmit({
      email: 'user@gmail.com',
      google: true
    })
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 48 48"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#FFC107",
    d: "M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FF3D00",
    d: "m6.3 14.7 6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#4CAF50",
    d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8L6.2 33C9.5 39.6 16.2 44 24 44z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#1976D2",
    d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2c-.4.4 6.6-4.8 6.6-14.9 0-1.3-.1-2.4-.4-3.5z"
  })), isSignup ? '구글로 가입' : '구글로 로그인')), /*#__PURE__*/React.createElement("div", {
    className: "auth-divider"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-divider-line"
  }), /*#__PURE__*/React.createElement("span", {
    className: "auth-divider-text"
  }, "\uB610\uB294 \uC774\uBA54\uC77C\uB85C \uACC4\uC18D\uD558\uAE30"), /*#__PURE__*/React.createElement("span", {
    className: "auth-divider-line"
  })), /*#__PURE__*/React.createElement("form", {
    className: "auth-form",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("label", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uC774\uBA54\uC77C"), /*#__PURE__*/React.createElement("div", {
    className: "auth-input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "email",
    placeholder: "name@company.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    autoComplete: "email"
  }), email.includes('@') && /*#__PURE__*/React.createElement("span", {
    className: "auth-input-check"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    stroke: 3
  })))), /*#__PURE__*/React.createElement("label", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uBE44\uBC00\uBC88\uD638", !isSignup && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auth-field-link",
    onClick: () => onNav('forgot')
  }, "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30")), /*#__PURE__*/React.createElement("div", {
    className: "auth-input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 16,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: showPw ? 'text' : 'password',
    placeholder: isSignup ? '8자 이상, 영문·숫자 포함' : '비밀번호',
    value: password,
    onChange: e => setPassword(e.target.value),
    autoComplete: isSignup ? 'new-password' : 'current-password'
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auth-input-eye",
    onClick: () => setShowPw(!showPw),
    "aria-label": "\uBE44\uBC00\uBC88\uD638 \uD45C\uC2DC \uC804\uD658"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: showPw ? 'eye_off' : 'eye',
    size: 15,
    stroke: 1.8
  }))), isSignup && password && /*#__PURE__*/React.createElement("div", {
    className: "auth-pw-meter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-pw-meter-bar"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "auth-pw-meter-seg",
    style: {
      background: i < pwStrength ? pwColor : 'var(--bg-soft)'
    }
  }))), /*#__PURE__*/React.createElement("span", {
    className: "auth-pw-meter-label",
    style: {
      color: pwColor
    }
  }, pwLabel))), isSignup && /*#__PURE__*/React.createElement("div", {
    className: "auth-agree"
  }, /*#__PURE__*/React.createElement("label", {
    className: "auth-agree-all"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: agree.tos && agree.privacy && agree.marketing,
    onChange: e => setAgree({
      tos: e.target.checked,
      privacy: e.target.checked,
      marketing: e.target.checked
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "auth-cb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11,
    stroke: 3.2
  })), /*#__PURE__*/React.createElement("strong", null, "\uC804\uCCB4 \uB3D9\uC758")), /*#__PURE__*/React.createElement("div", {
    className: "auth-agree-list"
  }, [{
    k: 'tos',
    label: '서비스 이용약관 동의',
    req: true
  }, {
    k: 'privacy',
    label: '개인정보 수집·이용 동의',
    req: true
  }, {
    k: 'marketing',
    label: '마케팅 정보 수신 동의',
    req: false
  }].map(a => /*#__PURE__*/React.createElement("label", {
    key: a.k,
    className: "auth-agree-item"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: agree[a.k],
    onChange: e => setAgree({
      ...agree,
      [a.k]: e.target.checked
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "auth-cb"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 3.2
  })), /*#__PURE__*/React.createElement("span", {
    className: "auth-agree-text"
  }, a.label, a.req ? /*#__PURE__*/React.createElement("em", {
    className: "auth-req"
  }, "(\uD544\uC218)") : /*#__PURE__*/React.createElement("em", {
    className: "auth-opt"
  }, "(\uC120\uD0DD)")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auth-agree-view"
  }, "\uBCF4\uAE30"))))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary auth-submit",
    disabled: !canSubmit
  }, isSignup ? '이메일로 가입' : '로그인', /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  }))), /*#__PURE__*/React.createElement("div", {
    className: "auth-card-foot"
  }, isSignup ? /*#__PURE__*/React.createElement(React.Fragment, null, "\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694? ", /*#__PURE__*/React.createElement("button", {
    className: "auth-foot-link",
    onClick: () => onNav('login')
  }, "\uB85C\uADF8\uC778")) : /*#__PURE__*/React.createElement(React.Fragment, null, "\uC544\uC9C1 \uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694? ", /*#__PURE__*/React.createElement("button", {
    className: "auth-foot-link",
    onClick: () => onNav('signup')
  }, "\uBB34\uB8CC \uAC00\uC785")))), /*#__PURE__*/React.createElement("div", {
    className: "auth-illust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-illust-card"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 20,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uC548\uC804\uD55C B2B \uC778\uC99D"), /*#__PURE__*/React.createElement("span", null, "\uD734\uB300\uD3F0 + \uC774\uBA54\uC77C\uB85C \uC2E0\uB8B0\uB3C4\uB97C \uD655\uC778\uD569\uB2C8\uB2E4"))), /*#__PURE__*/React.createElement("div", {
    className: "auth-illust-card"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 20,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uAC00\uC785 \uC989\uC2DC \uB9DE\uCDA4 \uCD94\uCC9C"), /*#__PURE__*/React.createElement("span", null, "\uAD00\uC2EC \uBD84\uC57C\xB7\uBC1C\uC8FC \uADDC\uBAA8 \uAE30\uBC18 \uC790\uB3D9 \uB9E4\uCE6D"))))));
}

// ═══════════════════════════════════════════════════════════
// 3) VERIFY (휴대폰 + 이메일 인증)
// ═══════════════════════════════════════════════════════════
function VerifyPage({
  email,
  onNav,
  onComplete
}) {
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
  const handleCodePaste = e => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = ['', '', '', '', '', ''];
    pasted.forEach((c, i) => next[i] = c);
    setCode(next);
    if (pasted.length === 6) setTimeout(() => setStep('email-confirm'), 400);
  };
  const fmtPhone = v => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };
  const fmtTimer = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "auth-mini-hdr"
  }, /*#__PURE__*/React.createElement(AuthLogo, {
    size: 32
  }), /*#__PURE__*/React.createElement("button", {
    className: "auth-back-btn",
    onClick: () => onNav('signup')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 14,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "auth-steps"
  }, /*#__PURE__*/React.createElement(AuthStep, {
    n: 1,
    label: "\uC774\uBA54\uC77C\xB7\uBE44\uBC00\uBC88\uD638",
    done: true
  }), /*#__PURE__*/React.createElement(AuthStepLine, {
    done: true
  }), /*#__PURE__*/React.createElement(AuthStep, {
    n: 2,
    label: "\uD734\uB300\uD3F0\xB7\uC774\uBA54\uC77C \uC778\uC99D",
    active: true
  }), /*#__PURE__*/React.createElement(AuthStepLine, null), /*#__PURE__*/React.createElement(AuthStep, {
    n: 3,
    label: "\uD504\uB85C\uD544 \uC124\uC815"
  }), /*#__PURE__*/React.createElement(AuthStepLine, null), /*#__PURE__*/React.createElement(AuthStep, {
    n: 4,
    label: "\uC644\uB8CC"
  })), /*#__PURE__*/React.createElement("div", {
    className: "auth-card auth-card-narrow"
  }, step === 'phone-input' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-glyph"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 22,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("h1", null, "\uD734\uB300\uD3F0 \uBC88\uD638\uB97C \uC778\uC99D\uD574\uC8FC\uC138\uC694"), /*#__PURE__*/React.createElement("p", null, "\uACAC\uC801 \uC54C\uB9BC\uACFC \uBCF8\uC778 \uD655\uC778\uC744 \uC704\uD574 \uC0AC\uC6A9\uB429\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    className: "auth-form"
  }, /*#__PURE__*/React.createElement("label", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uD734\uB300\uD3F0 \uBC88\uD638"), /*#__PURE__*/React.createElement("div", {
    className: "auth-input-wrap auth-phone"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-phone-cc"
  }, "+82"), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "tel",
    placeholder: "010-1234-5678",
    value: fmtPhone(phone),
    onChange: e => setPhone(e.target.value)
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary auth-submit",
    onClick: sendCode,
    disabled: phone.replace(/\D/g, '').length < 10
  }, "\uC778\uC99D\uBC88\uD638 \uBC1B\uAE30", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("div", {
    className: "auth-skip-note"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 12,
    stroke: 2
  }), "\uCD5C\uB300 60\uCD08 \uC774\uB0B4 SMS\uB85C 6\uC790\uB9AC \uC778\uC99D\uBC88\uD638\uAC00 \uBC1C\uC1A1\uB429\uB2C8\uB2E4."))), step === 'phone-code' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-glyph"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 22,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("h1", null, "\uC778\uC99D\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, fmtPhone(phone)), "\uB85C 6\uC790\uB9AC \uC778\uC99D\uBC88\uD638\uB97C \uBCF4\uB0C8\uC5B4\uC694.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "auth-foot-link",
    onClick: () => setStep('phone-input')
  }, "\uBC88\uD638 \uBCC0\uACBD"))), /*#__PURE__*/React.createElement("div", {
    className: "auth-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-otp-row",
    onPaste: handleCodePaste
  }, code.map((c, i) => /*#__PURE__*/React.createElement("input", {
    key: i,
    ref: codeRefs[i],
    className: "auth-otp-input",
    type: "text",
    inputMode: "numeric",
    maxLength: 1,
    value: c,
    onChange: e => handleCodeChange(i, e.target.value),
    onKeyDown: e => {
      if (e.key === 'Backspace' && !c && i > 0) codeRefs[i - 1].current?.focus();
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "auth-otp-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: timer < 30 ? 'auth-otp-timer is-warning' : 'auth-otp-timer'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11,
    stroke: 2
  }), "\uB0A8\uC740 \uC2DC\uAC04 ", fmtTimer), /*#__PURE__*/React.createElement("button", {
    className: "auth-foot-link",
    onClick: () => {
      setTimer(180);
      setCode(['', '', '', '', '', '']);
    }
  }, "\uC778\uC99D\uBC88\uD638 \uC7AC\uC804\uC1A1")))), step === 'email-confirm' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-glyph auth-card-glyph-success"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 22,
    stroke: 2.6
  })), /*#__PURE__*/React.createElement("h1", null, "\uD734\uB300\uD3F0 \uC778\uC99D \uC644\uB8CC!"), /*#__PURE__*/React.createElement("p", null, "\uC774\uBA54\uC77C ", /*#__PURE__*/React.createElement("strong", null, email), "\uB85C \uC778\uC99D \uBA54\uC77C\uC744 \uBC1C\uC1A1\uD588\uC5B4\uC694.", /*#__PURE__*/React.createElement("br", null), "\uBA54\uC77C\uD568\uC5D0\uC11C ", /*#__PURE__*/React.createElement("strong", null, "\uC778\uC99D \uB9C1\uD06C\uB97C \uD074\uB9AD"), "\uD574\uC8FC\uC138\uC694.")), /*#__PURE__*/React.createElement("div", {
    className: "auth-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-mail-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-mail-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 20,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "auth-mail-text"
  }, /*#__PURE__*/React.createElement("strong", null, "FactoryMatch <noreply@factorymatch.kr>"), /*#__PURE__*/React.createElement("span", null, "\uC774\uBA54\uC77C \uC778\uC99D\uC744 \uC644\uB8CC\uD574\uC8FC\uC138\uC694")), /*#__PURE__*/React.createElement("div", {
    className: "auth-mail-pulse"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary auth-submit",
    onClick: onComplete
  }, "\uC778\uC99D \uC644\uB8CC \u2014 \uD504\uB85C\uD544 \uC124\uC815\uC73C\uB85C", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("div", {
    className: "auth-skip-note"
  }, /*#__PURE__*/React.createElement("button", {
    className: "auth-foot-link"
  }, "\uBA54\uC77C\uC774 \uC548 \uC654\uB098\uC694? \uC7AC\uC804\uC1A1"), "\xB7", /*#__PURE__*/React.createElement("button", {
    className: "auth-foot-link",
    onClick: onComplete
  }, "\uB098\uC911\uC5D0 \uC778\uC99D\uD558\uAE30")))))));
}

// Step indicator atoms
const AuthStep = ({
  n,
  label,
  active,
  done
}) => /*#__PURE__*/React.createElement("div", {
  className: `auth-step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`
}, /*#__PURE__*/React.createElement("div", {
  className: "auth-step-circle"
}, done ? /*#__PURE__*/React.createElement(Icon, {
  name: "check",
  size: 11,
  stroke: 3
}) : n), /*#__PURE__*/React.createElement("span", {
  className: "auth-step-label"
}, label));
const AuthStepLine = ({
  done
}) => /*#__PURE__*/React.createElement("div", {
  className: `auth-step-line ${done ? 'is-done' : ''}`
});

// ═══════════════════════════════════════════════════════════
// 4) ONBOARDING (4 steps)
// ═══════════════════════════════════════════════════════════
function OnboardingPage({
  onComplete,
  onNav
}) {
  const [step, setStep] = useAuthState(0);
  const [data, setData] = useAuthState({
    role: null,
    // 'buyer' | 'maker'
    company: '',
    position: '',
    employees: null,
    interests: [],
    products: [],
    moq: 'medium',
    notify: {
      email: true,
      sms: true,
      kakao: false,
      marketing: false
    }
  });
  const update = patch => setData({
    ...data,
    ...patch
  });
  const stepValid = [!!data.role, data.company.length >= 2 && data.position.length >= 1 && !!data.employees, data.interests.length >= 1, true // notify always valid
  ];
  const next = () => {
    if (step < 3) setStep(step + 1);else onComplete(data);
  };
  const prev = () => step > 0 ? setStep(step - 1) : onNav('verify');
  const stepTitles = ['역할 선택', '회사 정보', '관심 분야', '알림 설정'];
  return /*#__PURE__*/React.createElement("div", {
    className: "onb-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "onb-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "auth-mini-hdr onb-mini-hdr"
  }, /*#__PURE__*/React.createElement(AuthLogo, {
    size: 32
  }), /*#__PURE__*/React.createElement("button", {
    className: "onb-skip-btn",
    onClick: onComplete
  }, "\uB098\uC911\uC5D0 \uC124\uC815\uD558\uAE30")), /*#__PURE__*/React.createElement("div", {
    className: "auth-steps"
  }, /*#__PURE__*/React.createElement(AuthStep, {
    n: 1,
    label: "\uC774\uBA54\uC77C\xB7\uBE44\uBC00\uBC88\uD638",
    done: true
  }), /*#__PURE__*/React.createElement(AuthStepLine, {
    done: true
  }), /*#__PURE__*/React.createElement(AuthStep, {
    n: 2,
    label: "\uD734\uB300\uD3F0\xB7\uC774\uBA54\uC77C \uC778\uC99D",
    done: true
  }), /*#__PURE__*/React.createElement(AuthStepLine, {
    done: true
  }), /*#__PURE__*/React.createElement(AuthStep, {
    n: 3,
    label: "\uD504\uB85C\uD544 \uC124\uC815",
    active: true
  }), /*#__PURE__*/React.createElement(AuthStepLine, null), /*#__PURE__*/React.createElement(AuthStep, {
    n: 4,
    label: "\uC644\uB8CC"
  })), /*#__PURE__*/React.createElement("div", {
    className: "onb-sub-progress"
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `onb-sub-pill ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "onb-sub-num"
  }, i < step ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 9,
    stroke: 3
  }) : i + 1), /*#__PURE__*/React.createElement("span", {
    className: "onb-sub-label"
  }, stepTitles[i])))), /*#__PURE__*/React.createElement("div", {
    className: "onb-card"
  }, step === 0 && /*#__PURE__*/React.createElement(OnbStepRole, {
    data: data,
    update: update
  }), step === 1 && /*#__PURE__*/React.createElement(OnbStepCompany, {
    data: data,
    update: update
  }), step === 2 && /*#__PURE__*/React.createElement(OnbStepInterests, {
    data: data,
    update: update
  }), step === 3 && /*#__PURE__*/React.createElement(OnbStepNotify, {
    data: data,
    update: update
  }), /*#__PURE__*/React.createElement("div", {
    className: "onb-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost onb-back",
    onClick: prev
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_left",
    size: 14,
    stroke: 2.4
  }), "\uC774\uC804"), /*#__PURE__*/React.createElement("div", {
    className: "onb-foot-meta"
  }, step + 1, " / 4"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary onb-next",
    onClick: next,
    disabled: !stepValid[step]
  }, step < 3 ? '다음' : '완료하고 시작하기', /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  }))))));
}

// ─── Onb Step 0: Role ───
function OnbStepRole({
  data,
  update
}) {
  const roles = [{
    id: 'buyer',
    title: '바이어',
    en: 'Buyer',
    tag: '제조사를 찾는 쪽',
    desc: '제품 개발·구매 담당으로 적합한 제조사를 찾고 견적을 받습니다.',
    perks: ['제조사 검색·비교', '동시 견적 요청', '관심 공장 저장'],
    glyph: 'buyer'
  }, {
    id: 'maker',
    title: '제조사',
    en: 'Manufacturer',
    tag: '공장을 운영하는 쪽',
    desc: '공장을 등록해 적합한 발주 건을 받고 견적을 제안합니다.',
    perks: ['공장 프로필 노출', '맞춤 RFQ 수신', '거래 실적 관리'],
    glyph: 'maker'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "onb-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-step-head"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC548\uB155\uD558\uC138\uC694! \uC5B4\uB5A4 \uC5ED\uD560\uB85C \uAC00\uC785\uD558\uC2DC\uB098\uC694?"), /*#__PURE__*/React.createElement("p", null, "\uAC00\uC785 \uD6C4\uC5D0\uB3C4 \uB9C8\uC774\uD398\uC774\uC9C0\uC5D0\uC11C \uBCC0\uACBD\uD560 \uC218 \uC788\uC5B4\uC694.")), /*#__PURE__*/React.createElement("div", {
    className: "onb-role-grid"
  }, roles.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.id,
    className: `onb-role ${data.role === r.id ? 'is-selected' : ''}`,
    onClick: () => update({
      role: r.id
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-role-glyph"
  }, r.glyph === 'buyer' ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "22",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 50c0-8 7-14 16-14s16 6 16 14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44 30l4 4M48 26l2 2",
    opacity: "0.4"
  })) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 50V28l10 6V28l10 6V20l10 6V18l14 8v24z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 50v-8M28 50v-8M38 50v-8M48 50v-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "onb-role-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-role-title-row"
  }, /*#__PURE__*/React.createElement("h3", null, r.title, /*#__PURE__*/React.createElement("span", {
    className: "onb-role-tag"
  }, r.tag)), data.role === r.id && /*#__PURE__*/React.createElement("span", {
    className: "onb-role-check"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    stroke: 3
  }))), /*#__PURE__*/React.createElement("p", null, r.desc), /*#__PURE__*/React.createElement("ul", {
    className: "onb-role-perks"
  }, r.perks.map(p => /*#__PURE__*/React.createElement("li", {
    key: p
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11,
    stroke: 2.6
  }), p))))))));
}

// ─── Onb Step 1: Company ───
function OnbStepCompany({
  data,
  update
}) {
  const sizes = [{
    id: 'solo',
    label: '1인 사업자',
    range: '1명'
  }, {
    id: 'small',
    label: '소기업',
    range: '2~10명'
  }, {
    id: 'mid',
    label: '중견기업',
    range: '11~50명'
  }, {
    id: 'large',
    label: '대기업',
    range: '50명+'
  }];
  const isMaker = data.role === 'maker';
  return /*#__PURE__*/React.createElement("div", {
    className: "onb-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-step-head"
  }, /*#__PURE__*/React.createElement("h2", null, "\uD68C\uC0AC \uC815\uBCF4\uB97C \uC54C\uB824\uC8FC\uC138\uC694"), /*#__PURE__*/React.createElement("p", null, isMaker ? '제조사 프로필에 표시되는 기본 정보입니다.' : '맞춤 추천을 위해 사용되며 외부에 공개되지 않습니다.')), /*#__PURE__*/React.createElement("div", {
    className: "onb-fields"
  }, /*#__PURE__*/React.createElement("label", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uD68C\uC0AC\uBA85 / \uC18C\uC18D ", /*#__PURE__*/React.createElement("em", {
    className: "auth-req"
  }, "(\uD544\uC218)")), /*#__PURE__*/React.createElement("div", {
    className: "auth-input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "building",
    size: 16,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    placeholder: "\uC608: YD Innovations",
    value: data.company,
    onChange: e => update({
      company: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("label", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uC9C1\uCC45 / \uC9C1\uBB34 ", /*#__PURE__*/React.createElement("em", {
    className: "auth-req"
  }, "(\uD544\uC218)")), /*#__PURE__*/React.createElement("div", {
    className: "auth-input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 16,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    placeholder: "\uC608: \uC81C\uD488 \uAC1C\uBC1C \uB9E4\uB2C8\uC800",
    value: data.position,
    onChange: e => update({
      position: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uD68C\uC0AC \uADDC\uBAA8 ", /*#__PURE__*/React.createElement("em", {
    className: "auth-req"
  }, "(\uD544\uC218)")), /*#__PURE__*/React.createElement("div", {
    className: "onb-size-grid"
  }, sizes.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `onb-size ${data.employees === s.id ? 'is-selected' : ''}`,
    onClick: () => update({
      employees: s.id
    })
  }, /*#__PURE__*/React.createElement("strong", null, s.label), /*#__PURE__*/React.createElement("span", null, s.range)))))));
}

// ─── Onb Step 2: Interests ───
function OnbStepInterests({
  data,
  update
}) {
  const cats = [{
    id: 'cnc',
    label: 'CNC 가공',
    icon: '⚙'
  }, {
    id: 'injection',
    label: '사출',
    icon: '◐'
  }, {
    id: 'press',
    label: '프레스',
    icon: '▭'
  }, {
    id: 'mold',
    label: '금형',
    icon: '◆'
  }, {
    id: 'welding',
    label: '용접',
    icon: '╳'
  }, {
    id: 'painting',
    label: '도장',
    icon: '◉'
  }, {
    id: 'assembly',
    label: '조립',
    icon: '⬡'
  }, {
    id: 'pcb',
    label: 'PCB·전자',
    icon: '⊞'
  }, {
    id: 'sheet',
    label: '판금·절곡',
    icon: '▱'
  }, {
    id: 'plastic',
    label: '플라스틱',
    icon: '○'
  }, {
    id: 'metal',
    label: '금속소재',
    icon: '■'
  }, {
    id: 'package',
    label: '포장',
    icon: '◫'
  }];
  const products = ['자동차 부품', '가전·생활', '의료기기', '산업기계', '식음료 자판기', '전자제품 케이스', '건축·인테리어', '농업·축산', '에너지·태양광'];
  const moqs = [{
    id: 'small',
    label: '소량 (1~100)',
    desc: '시제품·소량 생산'
  }, {
    id: 'medium',
    label: '중량 (100~10,000)',
    desc: '일반 양산'
  }, {
    id: 'large',
    label: '대량 (10,000+)',
    desc: '대규모 양산'
  }];
  const toggleCat = id => {
    const next = data.interests.includes(id) ? data.interests.filter(x => x !== id) : [...data.interests, id];
    update({
      interests: next
    });
  };
  const toggleProd = p => {
    const next = data.products.includes(p) ? data.products.filter(x => x !== p) : [...data.products, p];
    update({
      products: next
    });
  };
  const isMaker = data.role === 'maker';
  return /*#__PURE__*/React.createElement("div", {
    className: "onb-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-step-head"
  }, /*#__PURE__*/React.createElement("h2", null, isMaker ? '제공 가능한 가공 방식을 선택해주세요' : '관심 있는 가공 방식을 선택해주세요'), /*#__PURE__*/React.createElement("p", null, "\uC5EC\uB7EC \uAC1C \uC120\uD0DD \uAC00\uB2A5 \xB7 \uCD94\uCC9C \uC815\uD655\uB3C4\uAC00 \uC62C\uB77C\uAC11\uB2C8\uB2E4 (", data.interests.length, "\uAC1C \uC120\uD0DD\uB428)")), /*#__PURE__*/React.createElement("div", {
    className: "onb-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uAC00\uACF5 \uBC29\uC2DD ", /*#__PURE__*/React.createElement("em", {
    className: "auth-req"
  }, "(1\uAC1C \uC774\uC0C1 \uD544\uC218)")), /*#__PURE__*/React.createElement("div", {
    className: "onb-cat-grid"
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: `onb-cat ${data.interests.includes(c.id) ? 'is-selected' : ''}`,
    onClick: () => toggleCat(c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "onb-cat-icon"
  }, c.icon), /*#__PURE__*/React.createElement("span", {
    className: "onb-cat-label"
  }, c.label), data.interests.includes(c.id) && /*#__PURE__*/React.createElement("span", {
    className: "onb-cat-check"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 9,
    stroke: 3.4
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, isMaker ? '주요 생산 분야' : '주요 발주 분야', " ", /*#__PURE__*/React.createElement("em", {
    className: "auth-opt"
  }, "(\uC120\uD0DD)")), /*#__PURE__*/React.createElement("div", {
    className: "onb-prod-row"
  }, products.map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: `onb-prod-chip ${data.products.includes(p) ? 'is-selected' : ''}`,
    onClick: () => toggleProd(p)
  }, data.products.includes(p) && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 3
  }), p)))), /*#__PURE__*/React.createElement("div", {
    className: "auth-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, isMaker ? '주요 생산 규모' : '주요 발주 규모'), /*#__PURE__*/React.createElement("div", {
    className: "onb-moq-row"
  }, moqs.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    className: `onb-moq ${data.moq === m.id ? 'is-selected' : ''}`,
    onClick: () => update({
      moq: m.id
    })
  }, /*#__PURE__*/React.createElement("strong", null, m.label), /*#__PURE__*/React.createElement("span", null, m.desc)))))));
}

// ─── Onb Step 3: Notify ───
function OnbStepNotify({
  data,
  update
}) {
  const channels = [{
    k: 'email',
    label: '이메일',
    icon: 'mail',
    desc: '견적 응답·일일 리포트',
    rec: true
  }, {
    k: 'sms',
    label: '문자 (SMS)',
    icon: 'phone',
    desc: '긴급 알림 (응답 임박)',
    rec: true
  }, {
    k: 'kakao',
    label: '카카오 알림톡',
    icon: 'chat',
    desc: '실시간 메시지 수신',
    rec: false
  }, {
    k: 'marketing',
    label: '신규 제조사·이벤트',
    icon: 'sparkle',
    desc: '주 1회 이내 발송',
    rec: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "onb-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-step-head"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC54C\uB9BC\uC744 \uC5B4\uB5BB\uAC8C \uBC1B\uC73C\uC2DC\uACA0\uC5B4\uC694?"), /*#__PURE__*/React.createElement("p", null, "\uACAC\uC801 \uC751\uB2F5 \uC2DC \uC989\uC2DC \uC54C\uB9BC\uC744 \uBC1B\uC73C\uBA74 \uD3C9\uADE0 \uC751\uB2F5\uB960\uC774 ", /*#__PURE__*/React.createElement("strong", null, "3\uBC30"), " \uB192\uC544\uC9D1\uB2C8\uB2E4. \uC5B8\uC81C\uB4E0 \uBCC0\uACBD \uAC00\uB2A5\uD574\uC694.")), /*#__PURE__*/React.createElement("div", {
    className: "onb-notify-list"
  }, channels.map(c => /*#__PURE__*/React.createElement("label", {
    key: c.k,
    className: `onb-notify ${data.notify[c.k] ? 'is-on' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-notify-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 18,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "onb-notify-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-notify-title"
  }, c.label, c.rec && /*#__PURE__*/React.createElement("span", {
    className: "onb-notify-rec"
  }, "\uAD8C\uC7A5")), /*#__PURE__*/React.createElement("div", {
    className: "onb-notify-desc"
  }, c.desc)), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: data.notify[c.k],
    onChange: e => update({
      notify: {
        ...data.notify,
        [c.k]: e.target.checked
      }
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "onb-notify-switch"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "onb-notify-tip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", null, "\uC57C\uAC04(22\uC2DC~08\uC2DC) \uC54C\uB9BC\uC740 \uC790\uB3D9\uC73C\uB85C \uC77C\uC2DC \uC911\uC9C0\uB429\uB2C8\uB2E4.")));
}

// ═══════════════════════════════════════════════════════════
// 5) WELCOME (완료 → 메인 진입)
// ═══════════════════════════════════════════════════════════
function WelcomePage({
  data,
  onEnter
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-shell welcome-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "welcome-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-confetti"
  }, [...Array(20)].map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      left: `${i * 5.3 % 100}%`,
      animationDelay: `${i * 0.07 % 1.4}s`,
      background: ['var(--brand)', 'var(--emerald)', 'var(--amber)', 'var(--rose)'][i % 4]
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "welcome-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-glyph"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 36,
    stroke: 2.6
  })), /*#__PURE__*/React.createElement("div", {
    className: "welcome-eyebrow"
  }, "\uAC00\uC785 \uC644\uB8CC \xB7 STEP 4/4"), /*#__PURE__*/React.createElement("h1", {
    className: "welcome-title"
  }, "\uD658\uC601\uD569\uB2C8\uB2E4, ", /*#__PURE__*/React.createElement("span", {
    className: "welcome-name"
  }, data?.company || '바이어'), "\uB2D8!"), /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub"
  }, "\uAD00\uC2EC \uBD84\uC57C ", /*#__PURE__*/React.createElement("strong", null, data?.interests?.length || 0, "\uAC1C"), "\uB97C \uAE30\uBC18\uC73C\uB85C \uB9DE\uCDA4 \uC81C\uC870\uC0AC\uB97C \uC900\uBE44\uD588\uC5B4\uC694.", /*#__PURE__*/React.createElement("br", null), "\uCCAB \uB9E4\uCE6D \uC815\uD655\uB3C4 ", /*#__PURE__*/React.createElement("strong", null, "92%"), " \xB7 \uD3C9\uADE0 \uACAC\uC801 \uC751\uB2F5 ", /*#__PURE__*/React.createElement("strong", null, "4\uC2DC\uAC04"), "."), /*#__PURE__*/React.createElement("div", {
    className: "welcome-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat-n"
  }, "12,138"), /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat-l"
  }, "\uACF5\uC7A5 DB")), /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat-n"
  }, "2,847"), /*#__PURE__*/React.createElement("div", {
    className: "welcome-stat-l"
  }, "\uAC80\uC99D \uC81C\uC870\uC0AC"))), /*#__PURE__*/React.createElement("div", {
    className: "welcome-next"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-next-title"
  }, "\uC774\uC81C \uBB34\uC5C7\uC744 \uD574\uBCFC\uAE4C\uC694?"), /*#__PURE__*/React.createElement("div", {
    className: "welcome-next-grid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "welcome-next-card",
    onClick: onEnter
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-next-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 18,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    className: "welcome-next-text"
  }, /*#__PURE__*/React.createElement("strong", null, "\uB9DE\uCDA4 \uCD94\uCC9C \uBCF4\uAE30"), /*#__PURE__*/React.createElement("span", null, "\uAD00\uC2EC \uBD84\uC57C \uAE30\uBC18 \uC81C\uC870\uC0AC 12\uACF3")), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4,
    className: "welcome-next-arrow"
  })), /*#__PURE__*/React.createElement("button", {
    className: "welcome-next-card",
    onClick: onEnter
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-next-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    className: "welcome-next-text"
  }, /*#__PURE__*/React.createElement("strong", null, "\uD0A4\uC6CC\uB4DC\uB85C \uAC80\uC0C9"), /*#__PURE__*/React.createElement("span", null, "\uC608: \"\uC74C\uB8CC\uC790\uD310\uAE30\", \"CNC \uC54C\uB8E8\uBBF8\uB284\"")), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4,
    className: "welcome-next-arrow"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary welcome-cta",
    onClick: onEnter
  }, "\uBA54\uC778\uC73C\uB85C \uC774\uB3D9", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 15,
    stroke: 2.4
  })))));
}

// ═══════════════════════════════════════════════════════════
// SignupPage — 회원가입 (5단계)
// ═══════════════════════════════════════════════════════════
function SignupPage({
  onNav
}) {
  const {
    PROCESSES
  } = window.MFG_DATA;
  const [step, setStep] = useStateP(1);
  const [userType, setUserType] = useStateP(null);
  const [sgnSocialToast, setSgnSocialToast] = useStateP(null);
  const handleSgnSocial = provider => {
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
    email: '',
    password: '',
    passwordConfirm: '',
    companyName: '',
    businessNumber: '',
    contactName: '',
    contactPhone: '',
    neededProcesses: [],
    neededMaterials: [],
    orderScale: '',
    ownedProcesses: [],
    ownedMaterials: [],
    certs: [],
    oemAvailable: false,
    odmAvailable: false,
    businessDoc: null,
    factoryPhoto: null
  });
  const [errors, setErrors] = useStateP({});
  const [loading, setLoading] = useStateP(false);
  const SGN_MATERIALS = ['알루미늄', 'SUS304', 'SS400', 'ABS', 'PC', 'PP', 'PET', '티타늄', '황동', '구리', 'FR-4', '탄소강'];
  const SGN_CERTS = ['ISO 9001', 'IATF 16949', 'ISO 14001', 'ISO 22000', 'HACCP', 'KC', 'CE', 'UL', 'OEKO-TEX'];
  const SGN_SCALES = ['소량 (~100개)', '중량 (100–1,000개)', '중대량 (1,000–10,000개)', '대량 (10,000개+)'];
  const upd = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const tog = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  const fmtBiz = v => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  };
  const fmtPhone = v => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
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
    if (step > 1 && step < 5) setStep(s => s - 1);else onNav('home');
  };
  const handleSubmit = async () => {
    if (!form.businessDoc) return;
    setLoading(true);
    setErrors({});
    try {
      const {
        data: authData,
        error: authError
      } = await window._sb.auth.signUp({
        email: form.email,
        password: form.password
      });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error('가입에 실패했습니다');
      let documentUrl = null;
      if (form.businessDoc) {
        const ext = form.businessDoc.name.split('.').pop().toLowerCase();
        const {
          data: up,
          error: upErr
        } = await window._sb.storage.from('user-documents').upload(`${userId}/business-doc.${ext}`, form.businessDoc);
        if (!upErr && up) documentUrl = `${userId}/business-doc.${ext}`;
      }
      if (userType === 'manufacturer' && form.factoryPhoto) {
        const ext2 = form.factoryPhoto.name.split('.').pop().toLowerCase();
        await window._sb.storage.from('user-documents').upload(`${userId}/factory-photo.${ext2}`, form.factoryPhoto);
      }
      const interests = userType === 'buyer' ? {
        needed_processes: form.neededProcesses,
        needed_materials: form.neededMaterials,
        order_scale: form.orderScale
      } : {
        owned_processes: form.ownedProcesses,
        main_materials: form.ownedMaterials,
        certs: form.certs,
        oem: form.oemAvailable,
        odm: form.odmAvailable
      };
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
        status: 'pending'
      });
      setStep(5);
    } catch (err) {
      setErrors({
        submit: err.message || '가입 중 오류가 발생했습니다'
      });
    } finally {
      setLoading(false);
    }
  };
  const TOTAL = 4;
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "auth-shell-inner"
  }, /*#__PURE__*/React.createElement("header", {
    className: "auth-mini-hdr"
  }, /*#__PURE__*/React.createElement(AuthLogo, {
    size: 32
  }), /*#__PURE__*/React.createElement("button", {
    className: "auth-back-btn",
    onClick: goBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: step > 1 && step < 5 ? 'arrow_left' : 'close',
    size: 14,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "auth-card sgn-card"
  }, step >= 2 && step <= 4 && /*#__PURE__*/React.createElement("div", {
    className: "sgn-steps"
  }, Array.from({
    length: TOTAL
  }, (_, i) => i + 1).map(n => /*#__PURE__*/React.createElement(React.Fragment, {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    className: `sgn-dot ${step > n ? 'is-done' : step === n ? 'is-active' : ''}`
  }, step > n ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 10,
    stroke: 2.8
  }) : n), n < TOTAL && /*#__PURE__*/React.createElement("div", {
    className: `sgn-line ${step > n ? 'is-done' : ''}`
  })))), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head"
  }, /*#__PURE__*/React.createElement("h1", null, "\uACF5\uC7A5\uB9E4\uCE6D \uC2DC\uC791\uD558\uAE30"), /*#__PURE__*/React.createElement("p", null, "\uC18C\uC15C \uACC4\uC815 \uB610\uB294 \uC774\uBA54\uC77C\uB85C \uAC00\uC785\uD558\uC138\uC694")), sgnSocialToast && /*#__PURE__*/React.createElement("div", {
    className: "auth-social-toast"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 13,
    stroke: 2
  }), sgnSocialToast), /*#__PURE__*/React.createElement("div", {
    className: "auth-social-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "auth-social-btn auth-kakao-btn",
    onClick: () => handleSgnSocial('kakao')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "17",
    viewBox: "0 0 18 17",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M9 0C4.03 0 0 3.13 0 7c0 2.48 1.57 4.67 3.96 5.93l-.85 3.18 3.6-2.35c.74.1 1.5.24 2.29.24 4.97 0 9-3.13 9-7S13.97 0 9 0z"
  })), "\uCE74\uCE74\uC624\uB85C \uAC00\uC785"), /*#__PURE__*/React.createElement("button", {
    className: "auth-social-btn auth-naver-btn",
    onClick: () => handleSgnSocial('naver')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M9.13 8.16L6.12 3H3v10h3.87V7.84L9.88 13H13V3H9.13z"
  })), "\uB124\uC774\uBC84\uB85C \uAC00\uC785")), /*#__PURE__*/React.createElement("div", {
    className: "auth-divider",
    style: {
      margin: '16px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-divider-line"
  }), /*#__PURE__*/React.createElement("span", {
    className: "auth-divider-text"
  }, "\uB610\uB294 \uC720\uD615 \uC120\uD0DD \uD6C4 \uC774\uBA54\uC77C\uB85C"), /*#__PURE__*/React.createElement("span", {
    className: "auth-divider-line"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-grid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sgn-type-card",
    onClick: () => {
      setUserType('buyer');
      setStep(2);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-icon sgn-type-buyer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 26,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-name"
  }, "\uBC14\uC774\uC5B4"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-desc"
  }, "\uC81C\uC870\uC0AC\uB97C \uCC3E\uACE0", /*#__PURE__*/React.createElement("br", null), "\uACAC\uC801\uC744 \uBC1B\uACE0 \uC2F6\uC5B4\uC694")), /*#__PURE__*/React.createElement("button", {
    className: "sgn-type-card",
    onClick: () => {
      setUserType('manufacturer');
      setStep(2);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-icon sgn-type-mfr"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "factory",
    size: 26,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-name"
  }, "\uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-type-desc"
  }, "\uACF5\uC7A5\uC744 \uB4F1\uB85D\uD558\uACE0", /*#__PURE__*/React.createElement("br", null), "\uBC14\uC774\uC5B4\uB97C \uBC1B\uACE0 \uC2F6\uC5B4\uC694"))), /*#__PURE__*/React.createElement("p", {
    className: "sgn-login-hint"
  }, "\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?", /*#__PURE__*/React.createElement("button", {
    className: "sgn-text-btn",
    onClick: () => onNav('login')
  }, "\uB85C\uADF8\uC778"))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head sgn-step-head"
  }, /*#__PURE__*/React.createElement("h1", null, "\uAE30\uBCF8 \uC815\uBCF4 \uC785\uB825"), /*#__PURE__*/React.createElement("p", null, userType === 'buyer' ? '바이어' : '제조사', " \uACC4\uC815\uC744 \uB9CC\uB4E4\uC5B4 \uB4DC\uB9B4\uAC8C\uC694")), /*#__PURE__*/React.createElement("div", {
    className: "sgn-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uC774\uBA54\uC77C ", /*#__PURE__*/React.createElement("em", {
    className: "sgn-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: `auth-input-wrap ${errors.email ? 'sgn-wrap-err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "email",
    placeholder: "company@email.com",
    value: form.email,
    onChange: e => upd('email', e.target.value),
    autoComplete: "email"
  })), errors.email && /*#__PURE__*/React.createElement("span", {
    className: "sgn-err"
  }, errors.email)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uBE44\uBC00\uBC88\uD638 ", /*#__PURE__*/React.createElement("em", {
    className: "sgn-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: `auth-input-wrap ${errors.password ? 'sgn-wrap-err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "password",
    placeholder: "8\uC790 \uC774\uC0C1",
    value: form.password,
    onChange: e => upd('password', e.target.value),
    autoComplete: "new-password"
  })), errors.password && /*#__PURE__*/React.createElement("span", {
    className: "sgn-err"
  }, errors.password)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uBE44\uBC00\uBC88\uD638 \uD655\uC778 ", /*#__PURE__*/React.createElement("em", {
    className: "sgn-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: `auth-input-wrap ${errors.passwordConfirm ? 'sgn-wrap-err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "password",
    placeholder: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC785\uB825",
    value: form.passwordConfirm,
    onChange: e => upd('passwordConfirm', e.target.value),
    autoComplete: "new-password"
  })), errors.passwordConfirm && /*#__PURE__*/React.createElement("span", {
    className: "sgn-err"
  }, errors.passwordConfirm)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uD68C\uC0AC\uBA85 ", /*#__PURE__*/React.createElement("em", {
    className: "sgn-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: `auth-input-wrap ${errors.companyName ? 'sgn-wrap-err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "building",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "text",
    placeholder: "(\uC8FC)\uD68C\uC0AC\uBA85",
    value: form.companyName,
    onChange: e => upd('companyName', e.target.value)
  })), errors.companyName && /*#__PURE__*/React.createElement("span", {
    className: "sgn-err"
  }, errors.companyName)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uC0AC\uC5C5\uC790\uBC88\uD638 ", /*#__PURE__*/React.createElement("em", {
    className: "sgn-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: `auth-input-wrap ${errors.businessNumber ? 'sgn-wrap-err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "text",
    placeholder: "000-00-00000",
    maxLength: 12,
    value: form.businessNumber,
    onChange: e => upd('businessNumber', fmtBiz(e.target.value))
  })), errors.businessNumber && /*#__PURE__*/React.createElement("span", {
    className: "sgn-err"
  }, errors.businessNumber)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uB2F4\uB2F9\uC790\uBA85 ", /*#__PURE__*/React.createElement("em", {
    className: "sgn-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: `auth-input-wrap ${errors.contactName ? 'sgn-wrap-err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "text",
    placeholder: "\uD64D\uAE38\uB3D9",
    value: form.contactName,
    onChange: e => upd('contactName', e.target.value)
  })), errors.contactName && /*#__PURE__*/React.createElement("span", {
    className: "sgn-err"
  }, errors.contactName)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auth-field-label"
  }, "\uC5F0\uB77D\uCC98"), /*#__PURE__*/React.createElement("div", {
    className: "auth-input-wrap"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 15,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("input", {
    className: "auth-input",
    type: "text",
    placeholder: "010-0000-0000",
    maxLength: 13,
    value: form.contactPhone,
    onChange: e => upd('contactPhone', fmtPhone(e.target.value))
  })))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary sgn-btn",
    onClick: goNext
  }, "\uB2E4\uC74C \uB2E8\uACC4 ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  }))), step === 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head sgn-step-head"
  }, /*#__PURE__*/React.createElement("h1", null, userType === 'buyer' ? '필요한 제조 정보' : '보유 공정 & 역량'), /*#__PURE__*/React.createElement("p", null, userType === 'buyer' ? '어떤 제조 서비스가 필요하신가요?' : '보유한 공정과 역량을 선택해주세요')), /*#__PURE__*/React.createElement("div", {
    className: "sgn-form"
  }, userType === 'buyer' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "\uD544\uC694\uD55C \uAC00\uACF5\uBC29\uC2DD"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, PROCESSES.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: `sgn-chip ${form.neededProcesses.includes(p.id) ? 'is-on' : ''}`,
    onClick: () => upd('neededProcesses', tog(form.neededProcesses, p.id))
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "\uC8FC\uC694 \uC18C\uC7AC"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, SGN_MATERIALS.map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    className: `sgn-chip ${form.neededMaterials.includes(m) ? 'is-on' : ''}`,
    onClick: () => upd('neededMaterials', tog(form.neededMaterials, m))
  }, m)))), /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "\uBC1C\uC8FC \uC608\uC0C1 \uADDC\uBAA8"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, SGN_SCALES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `sgn-chip ${form.orderScale === s ? 'is-on' : ''}`,
    onClick: () => upd('orderScale', form.orderScale === s ? '' : s)
  }, s))))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "\uBCF4\uC720 \uACF5\uC815"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, PROCESSES.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: `sgn-chip ${form.ownedProcesses.includes(p.id) ? 'is-on' : ''}`,
    onClick: () => upd('ownedProcesses', tog(form.ownedProcesses, p.id))
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "\uC8FC\uB825 \uC18C\uC7AC"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, SGN_MATERIALS.map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    className: `sgn-chip ${form.ownedMaterials.includes(m) ? 'is-on' : ''}`,
    onClick: () => upd('ownedMaterials', tog(form.ownedMaterials, m))
  }, m)))), /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "\uBCF4\uC720 \uC778\uC99D"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, SGN_CERTS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: `sgn-chip ${form.certs.includes(c) ? 'is-on' : ''}`,
    onClick: () => upd('certs', tog(form.certs, c))
  }, c)))), /*#__PURE__*/React.createElement("div", {
    className: "sgn-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-section-ttl"
  }, "OEM / ODM \uAC00\uB2A5 \uC5EC\uBD80"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: `sgn-chip ${form.oemAvailable ? 'is-on' : ''}`,
    onClick: () => upd('oemAvailable', !form.oemAvailable)
  }, "OEM \uAC00\uB2A5"), /*#__PURE__*/React.createElement("button", {
    className: `sgn-chip ${form.odmAvailable ? 'is-on' : ''}`,
    onClick: () => upd('odmAvailable', !form.odmAvailable)
  }, "ODM \uAC00\uB2A5"))))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary sgn-btn",
    onClick: goNext
  }, "\uB2E4\uC74C \uB2E8\uACC4 ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("button", {
    className: "sgn-skip-btn",
    onClick: goNext
  }, "\uC774 \uB2E8\uACC4 \uAC74\uB108\uB6F0\uAE30")), step === 4 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "auth-card-head sgn-step-head"
  }, /*#__PURE__*/React.createElement("h1", null, "\uC11C\uB958 \uC5C5\uB85C\uB4DC"), /*#__PURE__*/React.createElement("p", null, "\uBCF8\uC778 \uD655\uC778\uC744 \uC704\uD574 \uC0AC\uC5C5\uC790\uB4F1\uB85D\uC99D\uC774 \uD544\uC694\uD569\uB2C8\uB2E4")), /*#__PURE__*/React.createElement("div", {
    className: "sgn-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-upload-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-upload-ttl"
  }, "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uC99D", /*#__PURE__*/React.createElement("span", {
    className: "sgn-badge-req"
  }, "\uD544\uC218")), /*#__PURE__*/React.createElement("label", {
    className: `sgn-drop-zone ${form.businessDoc ? 'has-file' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".pdf,.jpg,.jpeg,.png",
    style: {
      display: 'none'
    },
    onChange: e => upd('businessDoc', e.target.files[0] || null)
  }), form.businessDoc ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-icon is-ok"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-name"
  }, form.businessDoc.name), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-hint"
  }, "\uBCC0\uACBD\uD558\uB824\uBA74 \uB2E4\uC2DC \uD074\uB9AD \xB7 ", (form.businessDoc.size / 1024).toFixed(0), " KB")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 18,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-name"
  }, "\uD074\uB9AD\uD558\uC5EC \uD30C\uC77C \uC120\uD0DD"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-hint"
  }, "PDF, JPG, PNG \xB7 \uCD5C\uB300 10MB")))), userType === 'manufacturer' && /*#__PURE__*/React.createElement("div", {
    className: "sgn-upload-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-upload-ttl"
  }, "\uACF5\uC7A5 \uC0AC\uC9C4", /*#__PURE__*/React.createElement("span", {
    className: "sgn-badge-opt"
  }, "\uC120\uD0DD")), /*#__PURE__*/React.createElement("label", {
    className: `sgn-drop-zone ${form.factoryPhoto ? 'has-file' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".jpg,.jpeg,.png",
    style: {
      display: 'none'
    },
    onChange: e => upd('factoryPhoto', e.target.files[0] || null)
  }), form.factoryPhoto ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-icon is-ok"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-name"
  }, form.factoryPhoto.name), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-hint"
  }, "\uBCC0\uACBD\uD558\uB824\uBA74 \uB2E4\uC2DC \uD074\uB9AD \xB7 ", (form.factoryPhoto.size / 1024).toFixed(0), " KB")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 18,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-name"
  }, "\uACF5\uC7A5 \uC678\uAD00 \uB610\uB294 \uC0DD\uC0B0 \uC0AC\uC9C4"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-dz-hint"
  }, "JPG, PNG")))), errors.submit && /*#__PURE__*/React.createElement("div", {
    className: "sgn-error-box"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14,
    stroke: 2
  }), errors.submit)), /*#__PURE__*/React.createElement("button", {
    className: `btn-primary sgn-btn ${!form.businessDoc || loading ? 'sgn-btn-off' : ''}`,
    onClick: form.businessDoc && !loading ? handleSubmit : undefined
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sgn-spin"
  }), "\uC2E0\uCCAD \uC911...") : /*#__PURE__*/React.createElement(React.Fragment, null, "\uAC00\uC785 \uC2E0\uCCAD\uD558\uAE30 ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2.4
  }))), /*#__PURE__*/React.createElement("p", {
    className: "sgn-privacy"
  }, "\uC81C\uCD9C \uC11C\uB958\uB294 \uBCF8\uC778 \uD655\uC778 \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9\uB418\uBA70 \uC554\uD638\uD654\uD558\uC5EC \uBCF4\uAD00\uB429\uB2C8\uB2E4.")), step === 5 && /*#__PURE__*/React.createElement("div", {
    className: "sgn-complete"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-complete-ico sgn-complete-ico-check"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#16a34a",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "8 12 11 15 16 9"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "sgn-complete-ttl"
  }, "\uAC00\uC785 \uC2E0\uCCAD\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
    className: "sgn-complete-sub"
  }, "\uB2F4\uB2F9\uC790 \uAC80\uD1A0 \uD6C4 \uC2B9\uC778 \uC774\uBA54\uC77C\uC744 \uBCF4\uB0B4\uB4DC\uB9BD\uB2C8\uB2E4", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\uC601\uC5C5\uC77C 1\u20132\uC77C"), " \uC18C\uC694\uB429\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("div", {
    className: "sgn-complete-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sgn-cr"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sgn-ck"
  }, "\uC774\uBA54\uC77C"), /*#__PURE__*/React.createElement("span", {
    className: "sgn-cv"
  }, form.email)), /*#__PURE__*/React.createElement("div", {
    className: "sgn-cr"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sgn-ck"
  }, "\uC720\uD615"), /*#__PURE__*/React.createElement("span", {
    className: "sgn-cv"
  }, userType === 'buyer' ? '바이어' : '제조사')), /*#__PURE__*/React.createElement("div", {
    className: "sgn-cr"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sgn-ck"
  }, "DB \uADDC\uBAA8"), /*#__PURE__*/React.createElement("span", {
    className: "sgn-cv"
  }, "\uC804\uAD6D 12,138\uAC1C \uACF5\uC7A5"))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary sgn-btn",
    onClick: () => onNav('landing')
  }, "\uD648\uC73C\uB85C \uC774\uB3D9")))));
}

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
Object.assign(window, {
  LandingPage,
  AuthFormPage,
  VerifyPage,
  OnboardingPage,
  WelcomePage,
  SignupPage
});

// ──────────────────────────────────────────────────────────
// Chat / MyPage / Admin
// ──────────────────────────────────────────────────────────

const FACTORIES_AC = window.MFG_DATA.FACTORIES;
const PROCESSES_AC = window.MFG_DATA.PROCESSES;

// 더미 채팅 메시지 — 제조사별
const CHAT_THREADS = {
  f1: [{
    from: 'them',
    text: '안녕하세요, 대성정밀공업입니다. 알루미늄 CNC 가공 문의 주셔서 감사합니다.',
    t: '14:21'
  }, {
    from: 'me',
    text: '도면 첨부드립니다. 알루미늄 6061-T6 기준 1,000개 견적 부탁드립니다.',
    t: '14:23'
  }, {
    from: 'them',
    text: '도면 잘 받았습니다. 검토 후 1시간 이내에 견적 회신드리겠습니다.',
    t: '14:25'
  }, {
    from: 'them',
    text: '추가로 표면 처리(아노다이징) 필요하실까요?',
    t: '14:25'
  }],
  f3: [{
    from: 'them',
    text: '한일프레스금형입니다. 자동차 부품 도면 검토 완료했습니다.',
    t: '11:08'
  }, {
    from: 'me',
    text: '리드타임 단축 가능한가요? 18일 → 14일 이내로 부탁드립니다.',
    t: '11:12'
  }, {
    from: 'them',
    text: '월 10,000개 이상 물량이면 14일 가능합니다. 5,000개 기준은 16일까지 가능합니다.',
    t: '11:14'
  }],
  f10: [{
    from: 'them',
    text: '안녕하세요, 정밀가공센터입니다.',
    t: '어제'
  }, {
    from: 'me',
    text: '시제품 5개 가공 가능한 일정 알려주세요.',
    t: '어제'
  }, {
    from: 'them',
    text: '오늘 접수 시 7일 내 발송 가능합니다.',
    t: '오늘 09:14'
  }]
};

// 마이페이지 더미 — RFQ 내역, 조회기록, 관심사
const MY_RFQS = [{
  id: 'r-2401',
  date: '2024-12-18',
  title: '알루미늄 CNC 가공 부품',
  qty: 1200,
  factories: ['f1', 'f8', 'f10'],
  status: '응답대기',
  responses: 1
}, {
  id: 'r-2382',
  date: '2024-12-11',
  title: '플라스틱 사출 케이스',
  qty: 5000,
  factories: ['f2', 'f11'],
  status: '진행중',
  responses: 2
}, {
  id: 'r-2351',
  date: '2024-11-29',
  title: '자동차 도어 패널 프레스',
  qty: 8000,
  factories: ['f3', 'f12'],
  status: '완료',
  responses: 3
}, {
  id: 'r-2298',
  date: '2024-11-14',
  title: 'PCB 양산',
  qty: 800,
  factories: ['f4'],
  status: '완료',
  responses: 1
}];

// 관리자 — 등록 제조사 목록 (FACTORIES + 가짜 비공개 2건)
const ADMIN_FACTORIES = [...FACTORIES_AC.map(f => ({
  id: f.id,
  name: f.name,
  city: f.city,
  processes: f.processes,
  certs: f.certs,
  public: true,
  registered: '2024-08-12',
  source: 'CSV'
})), {
  id: 'd1',
  name: '신일제관(임시)',
  city: '대구',
  processes: ['stamping'],
  certs: ['ISO 9001'],
  public: false,
  registered: '2025-01-04',
  source: 'CSV'
}, {
  id: 'd2',
  name: '평화기계(검증중)',
  city: '울산',
  processes: ['cnc', 'casting'],
  certs: [],
  public: false,
  registered: '2025-01-06',
  source: 'CSV'
}];

// ──────────────────────────────────────────────────────────
// ChatPage
// ──────────────────────────────────────────────────────────
const ChatPage = ({
  initialFactoryId,
  onBack,
  onOpenFactory
}) => {
  // 채팅이 있는 제조사들만 sidebar에 노출
  const threadIds = Object.keys(CHAT_THREADS);
  const threads = threadIds.map(id => {
    const f = FACTORIES_AC.find(x => x.id === id);
    const msgs = CHAT_THREADS[id];
    const last = msgs[msgs.length - 1];
    return {
      id,
      f,
      last,
      msgs
    };
  });

  // initialFactoryId가 채팅에 없으면 새로 추가
  const allThreads = useMemo(() => {
    if (initialFactoryId && !threadIds.includes(initialFactoryId)) {
      const f = FACTORIES_AC.find(x => x.id === initialFactoryId);
      if (f) {
        return [{
          id: f.id,
          f,
          last: {
            from: 'them',
            text: '안녕하세요, ' + f.name + '입니다. 무엇을 도와드릴까요?',
            t: '방금'
          },
          msgs: [{
            from: 'them',
            text: '안녕하세요, ' + f.name + '입니다. 문의 주셔서 감사합니다.',
            t: '방금'
          }]
        }, ...threads];
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
    setMessages([...messages, {
      from: 'me',
      text: txt,
      t
    }]);
    setDraft('');
    // 가짜 자동응답
    setTimeout(() => {
      setMessages(m => [...m, {
        from: 'them',
        text: '확인했습니다. 잠시만 기다려주세요.',
        t
      }]);
    }, 900);
  };
  if (!active) {
    return /*#__PURE__*/React.createElement("main", {
      className: "page chat-empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty-card"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chat",
      size: 32,
      stroke: 1.4
    }), /*#__PURE__*/React.createElement("h2", null, "\uC544\uC9C1 \uCC44\uD305\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", null, "\uC81C\uC870\uC0AC \uC0C1\uC138 \uD398\uC774\uC9C0\uC5D0\uC11C \"\uC2E4\uC2DC\uAC04 \uC0C1\uB2F4\"\uC744 \uB20C\uB7EC \uCC44\uD305\uC744 \uC2DC\uC791\uD558\uC138\uC694."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => onBack && onBack()
    }, "\uC81C\uC870\uC0AC \uB458\uB7EC\uBCF4\uAE30")));
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "page chat-page"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "chat-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-sidebar-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uCC44\uD305"), /*#__PURE__*/React.createElement("span", {
    className: "chat-sidebar-count"
  }, allThreads.length)), /*#__PURE__*/React.createElement("div", {
    className: "chat-sidebar-search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "\uC81C\uC870\uC0AC \uAC80\uC0C9"
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-thread-list"
  }, allThreads.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: 'chat-thread ' + (t.id === activeId ? 'is-active' : ''),
    onClick: () => setActiveId(t.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-thread-avatar",
    style: {
      background: t.f.image
    }
  }, t.f.name.slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "chat-thread-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-thread-row"
  }, /*#__PURE__*/React.createElement("h4", null, t.f.name), /*#__PURE__*/React.createElement("span", {
    className: "chat-thread-time"
  }, t.last.t)), /*#__PURE__*/React.createElement("p", null, t.last.text)))))), /*#__PURE__*/React.createElement("section", {
    className: "chat-main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "chat-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-head-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-head-avatar",
    style: {
      background: active.f.image
    }
  }, active.f.name.slice(0, 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, active.f.name), /*#__PURE__*/React.createElement("span", {
    className: "chat-head-meta"
  }, active.f.city, " \xB7 \uD3C9\uADE0 \uC751\uB2F5 ", active.f.responseHr, "\uC2DC\uAC04"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => onOpenFactory && onOpenFactory(active.f.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "building",
    size: 14,
    stroke: 2
  }), "\uC81C\uC870\uC0AC \uC815\uBCF4"), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    stroke: 2
  }), "\uD30C\uC77C \uCCA8\uBD80"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-banner"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uC774 \uCC44\uD305\uC740 \uACAC\uC801 \uD611\uC0C1\uC6A9\uC785\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("span", null, "\uC678\uBD80 \uACB0\uC81C \uC720\uB3C4, \uAC1C\uC778\uC815\uBCF4 \uC694\uCCAD\uC740 \uC989\uC2DC \uC2E0\uACE0\uD574\uC8FC\uC138\uC694."))), /*#__PURE__*/React.createElement("div", {
    className: "chat-messages",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-day"
  }, "2024\uB144 12\uC6D4 18\uC77C"), messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'chat-msg chat-msg-' + m.from
  }, m.from === 'them' && /*#__PURE__*/React.createElement("div", {
    className: "chat-msg-avatar",
    style: {
      background: active.f.image
    }
  }, active.f.name.slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "chat-msg-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-msg-bubble"
  }, m.text), /*#__PURE__*/React.createElement("div", {
    className: "chat-msg-time"
  }, m.t))))), /*#__PURE__*/React.createElement("footer", {
    className: "chat-input"
  }, /*#__PURE__*/React.createElement("button", {
    className: "chat-input-attach"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    stroke: 2
  })), /*#__PURE__*/React.createElement("textarea", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694. Enter\uB85C \uC804\uC1A1, Shift+Enter \uC904\uBC14\uAFC8",
    rows: 2
  }), /*#__PURE__*/React.createElement("button", {
    className: "chat-input-send",
    onClick: send,
    disabled: !draft.trim()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 16,
    stroke: 2
  })))));
};

// ──────────────────────────────────────────────────────────
// MyPage
// ──────────────────────────────────────────────────────────
const MyPage = ({
  profile: profileProp,
  onSwitchRole,
  onOpenFactory,
  onNav
}) => {
  const [tab, setTab] = useState('overview');
  const [dbProfile, setDbProfile] = useState(null);
  const [rfqs, setRfqs] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    contact_name: '',
    contact_phone: ''
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState('');
  const favorites = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('fm-favorites') || '[]');
    } catch {
      return [];
    }
  }, []);
  const recentViews = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('fm-recent-views') || '[]');
    } catch {
      return [];
    }
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const {
          data: {
            user
          }
        } = await window._sb.auth.getUser();
        if (!user) {
          setLoadingProfile(false);
          return;
        }
        const {
          data
        } = await window._sb.from('user_profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) {
          setDbProfile(data);
          setEditForm({
            contact_name: data.contact_name || '',
            contact_phone: data.contact_phone || ''
          });
        }
        try {
          const {
            data: rdata
          } = await window._sb.from('rfq_requests').select('id,title,status,created_at,qty').eq('user_id', user.id).order('created_at', {
            ascending: false
          }).limit(50);
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
  const joinedAt = profile.created_at ? profile.created_at.slice(0, 10) : profileProp?.joinedAt || '—';
  const interests = profile.interests || {};
  const interestChips = [...(interests.needed_processes || interests.owned_processes || []).map(id => PROCESSES_AC.find(p => p.id === id)?.label || id), ...(interests.needed_materials || interests.main_materials || [])].filter(Boolean);
  const stats = [{
    k: '진행중 견적',
    v: rfqs.filter(r => r.status !== 'completed' && r.status !== '완료').length
  }, {
    k: '관심 제조사',
    v: favorites.length
  }, {
    k: '최근 조회',
    v: recentViews.length
  }, {
    k: '활성 채팅',
    v: 0
  }];
  const saveEdit = async () => {
    setEditSaving(true);
    setEditMsg('');
    try {
      const {
        data: {
          user
        }
      } = await window._sb.auth.getUser();
      if (!user) throw new Error('로그인 필요');
      const {
        error
      } = await window._sb.from('user_profiles').update({
        contact_name: editForm.contact_name,
        contact_phone: editForm.contact_phone,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;
      setDbProfile(prev => ({
        ...prev,
        contact_name: editForm.contact_name,
        contact_phone: editForm.contact_phone
      }));
      setEditMsg('저장되었습니다.');
      setTimeout(() => {
        setShowEditModal(false);
        setEditMsg('');
      }, 800);
    } catch (e) {
      setEditMsg('저장 실패: ' + (e.message || '오류'));
    }
    setEditSaving(false);
  };
  const TABS = [{
    id: 'overview',
    label: '개요'
  }, {
    id: 'rfq',
    label: '견적 요청 내역',
    count: rfqs.length || null
  }, {
    id: 'history',
    label: '최근 조회',
    count: recentViews.length || null
  }, {
    id: 'favs',
    label: '관심 제조사',
    count: favorites.length || null
  }, {
    id: 'profile',
    label: '계정/회사 정보'
  }];
  const EmptyState = ({
    icon,
    msg,
    btnLabel,
    onBtnClick
  }) => /*#__PURE__*/React.createElement("div", {
    className: "myp-empty"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 28,
    stroke: 1.4,
    className: "myp-empty-ico"
  }), /*#__PURE__*/React.createElement("p", {
    className: "myp-empty-msg"
  }, msg), btnLabel && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: onBtnClick
  }, btnLabel));
  return /*#__PURE__*/React.createElement("main", {
    className: "page mypage"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mypage-hero-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mypage-avatar"
  }, name.slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "mypage-hero-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mypage-role-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'mypage-role-badge mypage-role-' + (role === 'buyer' ? 'buyer' : 'seller')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: role === 'buyer' ? 'search' : 'factory',
    size: 11,
    stroke: 2.2
  }), role === 'buyer' ? '바이어' : '제조사'), profile.status && profile.status !== 'approved' && /*#__PURE__*/React.createElement("span", {
    className: "myp-status-badge myp-status-pending"
  }, profile.status === 'pending' ? '승인 대기중' : '미승인')), /*#__PURE__*/React.createElement("h1", null, name), /*#__PURE__*/React.createElement("div", {
    className: "mypage-hero-meta"
  }, /*#__PURE__*/React.createElement("span", null, company), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, email), joinedAt !== '—' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, joinedAt, " \uAC00\uC785"))), /*#__PURE__*/React.createElement("button", {
    className: "myp-role-link",
    onClick: () => onSwitchRole && onSwitchRole(role === 'buyer' ? 'seller' : 'buyer')
  }, role === 'buyer' ? '제조사로 전환' : '바이어로 전환'))), /*#__PURE__*/React.createElement("div", {
    className: "mypage-hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setShowEditModal(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 13,
    stroke: 2
  }), "\uD504\uB85C\uD544 \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => onNav && onNav('list')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 13,
    stroke: 2
  }), "\uC81C\uC870\uC0AC \uCC3E\uAE30"))), /*#__PURE__*/React.createElement("section", {
    className: "mypage-stats"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    className: "mystat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mystat-k"
  }, s.k), /*#__PURE__*/React.createElement("div", {
    className: "mystat-v"
  }, loadingProfile ? '—' : s.v)))), /*#__PURE__*/React.createElement("nav", {
    className: "mypage-tabs"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: 'mypage-tab ' + (tab === t.id ? 'is-active' : ''),
    onClick: () => setTab(t.id)
  }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
    className: "mypage-tab-count"
  }, t.count)))), tab === 'overview' && /*#__PURE__*/React.createElement("section", {
    className: "mypage-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mypage-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uCD5C\uADFC \uACAC\uC801 \uC694\uCCAD"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('rfq')
  }, "\uC804\uCCB4 \uBCF4\uAE30")), rfqs.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "layers",
    msg: "\uACAC\uC801 \uC694\uCCAD \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
    btnLabel: "\uC81C\uC870\uC0AC \uCC3E\uAE30",
    onBtnClick: () => onNav && onNav('list')
  }) : /*#__PURE__*/React.createElement("ul", {
    className: "rfq-history"
  }, rfqs.slice(0, 3).map(r => /*#__PURE__*/React.createElement("li", {
    key: r.id,
    className: "rfq-history-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rfq-history-status",
    "data-status": r.status
  }, r.status || '—'), /*#__PURE__*/React.createElement("div", {
    className: "rfq-history-body"
  }, /*#__PURE__*/React.createElement("h4", null, r.title || '견적 요청'), /*#__PURE__*/React.createElement("div", {
    className: "rfq-history-meta"
  }, /*#__PURE__*/React.createElement("span", null, "#", String(r.id).slice(-6)), r.qty && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, r.qty.toLocaleString(), "\uAC1C")))), /*#__PURE__*/React.createElement("div", {
    className: "rfq-history-date"
  }, r.created_at ? r.created_at.slice(0, 10) : ''))))), /*#__PURE__*/React.createElement("div", {
    className: "mypage-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAD00\uC2EC \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('favs')
  }, "\uC804\uCCB4 \uBCF4\uAE30")), favorites.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "heart",
    msg: "\uCC1C\uD55C \uC81C\uC870\uC0AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
    btnLabel: "\uC81C\uC870\uC0AC \uB458\uB7EC\uBCF4\uAE30",
    onBtnClick: () => onNav && onNav('list')
  }) : /*#__PURE__*/React.createElement("ul", {
    className: "fav-list"
  }, favorites.slice(0, 4).map(id => {
    const f = FACTORIES_AC.find(x => x.id === id);
    if (!f) return null;
    return /*#__PURE__*/React.createElement("li", {
      key: id
    }, /*#__PURE__*/React.createElement("button", {
      className: "fav-row",
      onClick: () => onOpenFactory && onOpenFactory(id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "fav-img",
      style: {
        background: f.image
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcard-img-stripes"
    })), /*#__PURE__*/React.createElement("div", {
      className: "fav-body"
    }, /*#__PURE__*/React.createElement("h4", null, f.name), /*#__PURE__*/React.createElement("span", null, f.city, " \xB7 ", f.processes.slice(0, 2).map(pid => PROCESSES_AC.find(p => p.id === pid)?.label).filter(Boolean).join(', '))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron_right",
      size: 14,
      stroke: 2,
      className: "fav-arrow"
    })));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mypage-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAD00\uC2EC \uBD84\uC57C")), interestChips.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "mypage-tags"
  }, interestChips.map((label, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "mtag"
  }, label))) : /*#__PURE__*/React.createElement("p", {
    className: "myp-empty-msg",
    style: {
      color: 'var(--ink-4)',
      fontSize: 13
    }
  }, "\uAD00\uC2EC \uBD84\uC57C \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    className: "mypage-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC54C\uB9BC")), /*#__PURE__*/React.createElement(EmptyState, {
    icon: "bell",
    msg: "\uC0C8\uB85C\uC6B4 \uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."
  }))), tab === 'rfq' && (rfqs.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "mypage-card mypage-card-full"
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "layers",
    msg: "\uC544\uC9C1 \uACAC\uC801 \uC694\uCCAD \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC81C\uC870\uC0AC\uB97C \uCC3E\uC544\uBCF4\uC138\uC694.",
    btnLabel: "\uC81C\uC870\uC0AC \uCC3E\uAE30",
    onBtnClick: () => onNav && onNav('list')
  })) : /*#__PURE__*/React.createElement("section", {
    className: "mypage-table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC694\uCCAD \uBC88\uD638"), /*#__PURE__*/React.createElement("th", null, "\uC694\uCCAD\uC77C"), /*#__PURE__*/React.createElement("th", null, "\uC81C\uBAA9"), /*#__PURE__*/React.createElement("th", null, "\uC218\uB7C9"), /*#__PURE__*/React.createElement("th", null, "\uC0C1\uD0DC"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rfqs.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, "#", String(r.id).slice(-6)), /*#__PURE__*/React.createElement("td", null, r.created_at ? r.created_at.slice(0, 10) : '—'), /*#__PURE__*/React.createElement("td", null, r.title || '견적 요청'), /*#__PURE__*/React.createElement("td", null, r.qty ? r.qty.toLocaleString() + '개' : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'status-pill status-' + (r.status || '')
  }, r.status || '—')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "link-btn"
  }, "\uC0C1\uC138")))))))), tab === 'history' && (recentViews.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "mypage-card mypage-card-full"
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "clock",
    msg: "\uCD5C\uADFC \uC870\uD68C\uD55C \uC81C\uC870\uC0AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
    btnLabel: "\uC81C\uC870\uC0AC \uB458\uB7EC\uBCF4\uAE30",
    onBtnClick: () => onNav && onNav('list')
  })) : /*#__PURE__*/React.createElement("section", {
    className: "mypage-card mypage-card-full"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uCD5C\uADFC \uC870\uD68C\uD55C \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      try {
        localStorage.removeItem('fm-recent-views');
      } catch {}
      window.location.reload();
    }
  }, "\uAE30\uB85D \uC0AD\uC81C")), /*#__PURE__*/React.createElement("ul", {
    className: "hist-list"
  }, recentViews.map((v, i) => {
    const f = FACTORIES_AC.find(x => x.id === v.id);
    if (!f) return null;
    return /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement("button", {
      className: "fav-row",
      onClick: () => onOpenFactory && onOpenFactory(v.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "fav-img",
      style: {
        background: f.image
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcard-img-stripes"
    })), /*#__PURE__*/React.createElement("div", {
      className: "fav-body"
    }, /*#__PURE__*/React.createElement("h4", null, f.name), /*#__PURE__*/React.createElement("span", null, f.city, " \xB7 ", f.processes.slice(0, 2).map(pid => PROCESSES_AC.find(p => p.id === pid)?.label).filter(Boolean).join(', '))), v.at && /*#__PURE__*/React.createElement("span", {
      className: "hist-time"
    }, v.at), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron_right",
      size: 14,
      stroke: 2,
      className: "fav-arrow"
    })));
  })))), tab === 'favs' && (favorites.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "mypage-card mypage-card-full"
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "heart",
    msg: "\uCC1C\uD55C \uC81C\uC870\uC0AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uACF5\uC7A5 \uC0C1\uC138 \uD398\uC774\uC9C0\uC5D0\uC11C \u2665\uB97C \uB20C\uB7EC \uC800\uC7A5\uD558\uC138\uC694.",
    btnLabel: "\uC81C\uC870\uC0AC \uCC3E\uAE30",
    onBtnClick: () => onNav && onNav('list')
  })) : /*#__PURE__*/React.createElement("section", {
    className: "mypage-card mypage-card-full"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAD00\uC2EC \uC81C\uC870\uC0AC")), /*#__PURE__*/React.createElement("ul", {
    className: "fav-list"
  }, favorites.map(id => {
    const f = FACTORIES_AC.find(x => x.id === id);
    if (!f) return null;
    return /*#__PURE__*/React.createElement("li", {
      key: id
    }, /*#__PURE__*/React.createElement("button", {
      className: "fav-row",
      onClick: () => onOpenFactory && onOpenFactory(id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "fav-img",
      style: {
        background: f.image
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcard-img-stripes"
    })), /*#__PURE__*/React.createElement("div", {
      className: "fav-body"
    }, /*#__PURE__*/React.createElement("h4", null, f.name), /*#__PURE__*/React.createElement("span", null, f.city, f.moq > 0 ? ` · MOQ ${f.moq.toLocaleString()}` : '', f.leadDays > 0 ? ` · 리드 ${f.leadDays}일` : '')), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron_right",
      size: 14,
      stroke: 2,
      className: "fav-arrow"
    })));
  })))), tab === 'profile' && /*#__PURE__*/React.createElement("section", {
    className: "mypage-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mypage-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uACC4\uC815 \uC815\uBCF4"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowEditModal(true)
  }, "\uC218\uC815")), /*#__PURE__*/React.createElement("dl", {
    className: "profile-dl"
  }, /*#__PURE__*/React.createElement("dt", null, "\uC774\uB984"), /*#__PURE__*/React.createElement("dd", null, name), /*#__PURE__*/React.createElement("dt", null, "\uC774\uBA54\uC77C"), /*#__PURE__*/React.createElement("dd", null, email), /*#__PURE__*/React.createElement("dt", null, "\uD734\uB300\uD3F0"), /*#__PURE__*/React.createElement("dd", null, phone), /*#__PURE__*/React.createElement("dt", null, "\uAC00\uC785\uC77C"), /*#__PURE__*/React.createElement("dd", null, joinedAt))), /*#__PURE__*/React.createElement("div", {
    className: "mypage-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mypage-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD68C\uC0AC \uC815\uBCF4")), /*#__PURE__*/React.createElement("dl", {
    className: "profile-dl"
  }, /*#__PURE__*/React.createElement("dt", null, "\uD68C\uC0AC\uBA85"), /*#__PURE__*/React.createElement("dd", null, company), /*#__PURE__*/React.createElement("dt", null, "\uC0AC\uC5C5\uC790\uBC88\uD638"), /*#__PURE__*/React.createElement("dd", null, businessNumber), /*#__PURE__*/React.createElement("dt", null, "\uC5ED\uD560"), /*#__PURE__*/React.createElement("dd", null, role === 'buyer' ? '바이어 (구매)' : '제조사 (판매)'), /*#__PURE__*/React.createElement("dt", null, "\uAC00\uC785 \uC0C1\uD0DC"), /*#__PURE__*/React.createElement("dd", null, profile.status === 'approved' ? '승인됨' : profile.status === 'pending' ? '승인 대기중' : profile.status || '—')))), showEditModal && /*#__PURE__*/React.createElement("div", {
    className: "myp-modal-overlay",
    onClick: () => setShowEditModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "myp-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "myp-modal-head"
  }, /*#__PURE__*/React.createElement("h2", null, "\uD504\uB85C\uD544 \uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    className: "myp-modal-close",
    onClick: () => setShowEditModal(false)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "myp-modal-body"
  }, /*#__PURE__*/React.createElement("label", {
    className: "myp-field"
  }, /*#__PURE__*/React.createElement("span", null, "\uC774\uB984"), /*#__PURE__*/React.createElement("input", {
    className: "myp-input",
    value: editForm.contact_name,
    onChange: e => setEditForm(f => ({
      ...f,
      contact_name: e.target.value
    })),
    placeholder: "\uB2F4\uB2F9\uC790 \uC774\uB984"
  })), /*#__PURE__*/React.createElement("label", {
    className: "myp-field"
  }, /*#__PURE__*/React.createElement("span", null, "\uC5F0\uB77D\uCC98"), /*#__PURE__*/React.createElement("input", {
    className: "myp-input",
    value: editForm.contact_phone,
    onChange: e => setEditForm(f => ({
      ...f,
      contact_phone: e.target.value
    })),
    placeholder: "010-0000-0000"
  })), editMsg && /*#__PURE__*/React.createElement("p", {
    className: 'myp-save-msg ' + (editMsg.includes('실패') ? 'err' : 'ok')
  }, editMsg)), /*#__PURE__*/React.createElement("div", {
    className: "myp-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setShowEditModal(false)
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveEdit,
    disabled: editSaving
  }, editSaving ? '저장중…' : '저장')))));
};

// ──────────────────────────────────────────────────────────
// ── 공공데이터 CSV 업로드 헬퍼 ──────────────────────────────
function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const buf = new Uint8Array(e.target.result);
      // UTF-8 BOM?
      if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        resolve(new TextDecoder('utf-8').decode(buf.slice(3)));
        return;
      }
      // Try strict UTF-8 first (throws on bad sequences = EUC-KR file)
      try {
        resolve(new TextDecoder('utf-8', {
          fatal: true
        }).decode(buf));
      } catch (_) {
        // Fall back to EUC-KR / CP949
        try {
          resolve(new TextDecoder('euc-kr').decode(buf));
        } catch (e2) {
          reject(new Error('UTF-8 또는 EUC-KR 파일만 지원합니다.'));
        }
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
function parseCSVLine(line) {
  const result = [];
  let cur = '',
    inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}
function extractRegion(addr) {
  if (!addr) return 'etc';
  if (addr.includes('서울')) return 'seoul';
  if (addr.includes('경기')) return 'gyeonggi';
  if (addr.includes('인천')) return 'incheon';
  if (addr.includes('부산')) return 'busan';
  if (addr.includes('울산')) return 'ulsan';
  if (addr.includes('경남')) return 'gyeongnam';
  if (addr.includes('대구') || addr.includes('경북')) return 'daegu';
  if (addr.includes('광주') || addr.includes('전남') || addr.includes('전북')) return 'jeonla';
  if (addr.includes('대전') || addr.includes('충남') || addr.includes('충북') || addr.includes('세종')) return 'chungcheong';
  if (addr.includes('강원')) return 'gangwon';
  if (addr.includes('제주')) return 'jeju';
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
  const [counts, setCounts] = useState({
    pending: 0,
    processing: 0,
    resolved: 0,
    rejected: 0
  });
  const loadReports = async status => {
    setLoading(true);
    setError('');
    try {
      const {
        data,
        error: dbError
      } = await window._sb.from('factory_reports').select('*').eq('status', status).order('created_at', {
        ascending: false
      });
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
      const results = await Promise.all(statuses.map(s => window._sb.from('factory_reports').select('id', {
        count: 'estimated',
        head: true
      }).eq('status', s)));
      const newCounts = {};
      statuses.forEach((s, i) => {
        newCounts[s] = results[i].count || 0;
      });
      setCounts(newCounts);
    } catch (err) {
      console.error('Load counts error:', err);
    }
  };
  useEffect(() => {
    if (!window._sb) {
      setLoading(false);
      setError('Supabase 연결이 필요합니다.');
      return;
    }
    loadReports(activeStatus);
    loadCounts();
  }, [activeStatus]);
  const handleStatusChange = async (reportId, newStatus, adminNote = '') => {
    try {
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      if (newStatus === 'resolved' || newStatus === 'rejected') {
        updates.resolved_at = new Date().toISOString();
      }
      if (adminNote) updates.admin_note = adminNote;
      const {
        error: dbError
      } = await window._sb.from('factory_reports').update(updates).eq('id', reportId);
      if (dbError) throw dbError;
      await loadReports(activeStatus);
      await loadCounts();
      setSelectedReport(null);
    } catch (err) {
      console.error('Status change error:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };
  const STATUS_LABELS = {
    pending: '접수',
    processing: '처리중',
    resolved: '완료',
    rejected: '거절'
  };
  const TYPE_LABELS = {
    factory_issue: '공장 신고',
    self_correction: '자사 정정',
    general_inquiry: '일반 문의'
  };
  const formatDate = iso => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-status-tabs"
  }, ['pending', 'processing', 'resolved', 'rejected'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `admin-reports-status-tab ${activeStatus === s ? 'active' : ''}`,
    onClick: () => setActiveStatus(s)
  }, STATUS_LABELS[s], counts[s] > 0 && /*#__PURE__*/React.createElement("span", {
    className: "admin-reports-count-badge"
  }, counts[s])))), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-list"
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-loading"
  }, "\uB85C\uB529 \uC911..."), error && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-error"
  }, error), !loading && !error && reports.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-empty"
  }, STATUS_LABELS[activeStatus], " \uC0C1\uD0DC\uC758 \uC2E0\uACE0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."), !loading && !error && reports.length > 0 && /*#__PURE__*/React.createElement("table", {
    className: "admin-reports-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC811\uC218\uC77C\uC2DC"), /*#__PURE__*/React.createElement("th", null, "\uC885\uB958"), /*#__PURE__*/React.createElement("th", null, "\uB300\uC0C1 \uACF5\uC7A5"), /*#__PURE__*/React.createElement("th", null, "\uC2E0\uCCAD\uC790"), /*#__PURE__*/React.createElement("th", null, "\uD68C\uC0AC\uBA85"), /*#__PURE__*/React.createElement("th", null, "\uC0AC\uC720"), /*#__PURE__*/React.createElement("th", null, "\uC561\uC158"))), /*#__PURE__*/React.createElement("tbody", null, reports.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id
  }, /*#__PURE__*/React.createElement("td", null, formatDate(r.created_at)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `admin-reports-type-badge type-${r.report_type}`
  }, TYPE_LABELS[r.report_type] || r.report_type)), /*#__PURE__*/React.createElement("td", null, r.target_factory_name || '-'), /*#__PURE__*/React.createElement("td", null, r.reporter_name), /*#__PURE__*/React.createElement("td", null, r.reporter_company), /*#__PURE__*/React.createElement("td", {
    className: "admin-reports-reason-cell"
  }, r.reason), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-detail-btn",
    onClick: () => setSelectedReport(r)
  }, "\uC0C1\uC138"))))))), selectedReport && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-overlay",
    onClick: () => setSelectedReport(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC2E0\uACE0 \uC0C1\uC138"), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-modal-close",
    onClick: () => setSelectedReport(null)
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC694\uCCAD \uC815\uBCF4"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC811\uC218\uBC88\uD638:"), " #", selectedReport.id), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC811\uC218\uC77C\uC2DC:"), " ", formatDate(selectedReport.created_at)), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC885\uB958:"), " ", TYPE_LABELS[selectedReport.report_type]), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uD604\uC7AC \uC0C1\uD0DC:"), /*#__PURE__*/React.createElement("span", {
    className: `admin-reports-status-badge status-${selectedReport.status}`
  }, STATUS_LABELS[selectedReport.status])), selectedReport.target_factory_name && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uB300\uC0C1 \uACF5\uC7A5:"), " ", selectedReport.target_factory_name, selectedReport.target_factory_id && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#888',
      fontSize: '12px'
    }
  }, " (ID: ", selectedReport.target_factory_id, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC2E0\uCCAD\uC790 \uC815\uBCF4"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uD68C\uC0AC\uBA85:"), " ", selectedReport.reporter_company), selectedReport.reporter_business_number && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC0AC\uC5C5\uC790\uBC88\uD638:"), " ", selectedReport.reporter_business_number), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uB2F4\uB2F9\uC790:"), " ", selectedReport.reporter_name), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC774\uBA54\uC77C:"), /*#__PURE__*/React.createElement("a", {
    href: `mailto:${selectedReport.reporter_email}`
  }, selectedReport.reporter_email)), selectedReport.reporter_phone && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC5F0\uB77D\uCC98:"), " ", selectedReport.reporter_phone)), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC694\uCCAD \uB0B4\uC6A9"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC0AC\uC720:"), " ", selectedReport.reason), selectedReport.description && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-description"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC0C1\uC138:"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-text"
  }, selectedReport.description))), selectedReport.admin_note && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAD00\uB9AC\uC790 \uBA54\uBAA8"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-text"
  }, selectedReport.admin_note)), selectedReport.resolved_at && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uCC98\uB9AC \uC815\uBCF4"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uCC98\uB9AC\uC77C\uC2DC:"), " ", formatDate(selectedReport.resolved_at)))), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-actions"
  }, selectedReport.status === 'pending' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn primary",
    onClick: () => handleStatusChange(selectedReport.id, 'processing')
  }, "\uCC98\uB9AC \uC2DC\uC791"), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn",
    onClick: () => {
      const n = prompt('거절 사유를 입력하세요:');
      if (n) handleStatusChange(selectedReport.id, 'rejected', n);
    }
  }, "\uAC70\uC808")), selectedReport.status === 'processing' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn primary",
    onClick: () => {
      const n = prompt('처리 내용을 입력하세요 (선택):') || '';
      handleStatusChange(selectedReport.id, 'resolved', n);
    }
  }, "\uC644\uB8CC \uCC98\uB9AC"), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn",
    onClick: () => {
      const n = prompt('거절 사유를 입력하세요:');
      if (n) handleStatusChange(selectedReport.id, 'rejected', n);
    }
  }, "\uAC70\uC808")), (selectedReport.status === 'resolved' || selectedReport.status === 'rejected') && /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn",
    onClick: () => handleStatusChange(selectedReport.id, 'pending')
  }, "\uC811\uC218 \uC0C1\uD0DC\uB85C \uB418\uB3CC\uB9AC\uAE30"), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn cancel",
    onClick: () => setSelectedReport(null)
  }, "\uB2EB\uAE30")))));
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
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const loadSignups = async status => {
    setLoading(true);
    setError('');
    try {
      let q = window._sb.from('user_profiles').select('*').order('created_at', {
        ascending: false
      });
      if (status !== 'all') q = q.eq('status', status);
      const {
        data,
        error: dbErr
      } = await q;
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
      const [allRes, ...results] = await Promise.all([window._sb.from('user_profiles').select('id', {
        count: 'estimated',
        head: true
      }), ...statuses.map(s => window._sb.from('user_profiles').select('id', {
        count: 'estimated',
        head: true
      }).eq('status', s))]);
      const c = {
        all: allRes.count || 0
      };
      statuses.forEach((s, i) => {
        c[s] = results[i].count || 0;
      });
      setCounts(c);
    } catch (err) {
      console.error('AdminSignupTab count error:', err);
    }
  };
  useEffect(() => {
    if (!window._sb) {
      setLoading(false);
      setError('Supabase 연결이 필요합니다.');
      return;
    }
    loadSignups(activeStatus);
    loadCounts();
  }, [activeStatus]);
  const openDetail = row => {
    setSelected(row);
    setMemo(row.admin_memo || '');
    setEmailStatus('');
  };
  const handleApprove = async () => {
    if (!selected || actionLoading) return;
    setActionLoading(true);
    try {
      const now = new Date().toISOString();
      const updates = {
        status: 'approved',
        approved_at: now,
        updated_at: now
      };
      if (memo.trim()) updates.admin_memo = memo.trim();
      const {
        error: dbErr
      } = await window._sb.from('user_profiles').update(updates).eq('id', selected.id);
      if (dbErr) throw dbErr;
      if (selected.role === 'manufacturer' && selected.business_number) {
        const bizNum = selected.business_number.replace(/\D/g, '');
        const {
          data: matched
        } = await window._sb.from('factories').select('id, business_number').limit(200);
        if (matched) {
          const hit = matched.find(f => f.business_number && f.business_number.replace(/\D/g, '') === bizNum);
          if (hit) {
            await window._sb.from('factories').update({
              owner_user_id: selected.id
            }).eq('id', hit.id);
          }
        }
      }
      setEmailStatus('sending');
      try {
        const res = await fetch('/.netlify/functions/send-approval-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'approved',
            email: selected.email,
            name: selected.contact_name,
            company: selected.company_name
          })
        });
        setEmailStatus(res.ok ? 'sent' : 'failed');
      } catch {
        setEmailStatus('failed');
      }
      await loadSignups(activeStatus);
      await loadCounts();
      setSelected(s => s ? {
        ...s,
        status: 'approved',
        approved_at: now,
        admin_memo: memo.trim() || s.admin_memo
      } : null);
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
      const updates = {
        status: 'rejected',
        updated_at: now
      };
      if (finalMemo) updates.admin_memo = finalMemo;
      const {
        error: dbErr
      } = await window._sb.from('user_profiles').update(updates).eq('id', selected.id);
      if (dbErr) throw dbErr;
      setEmailStatus('sending');
      try {
        const res = await fetch('/.netlify/functions/send-approval-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'rejected',
            email: selected.email,
            name: selected.contact_name,
            company: selected.company_name,
            reason: finalMemo
          })
        });
        setEmailStatus(res.ok ? 'sent' : 'failed');
      } catch {
        setEmailStatus('failed');
      }
      await loadSignups(activeStatus);
      await loadCounts();
      setSelected(s => s ? {
        ...s,
        status: 'rejected',
        admin_memo: finalMemo || s.admin_memo
      } : null);
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selected.status === 'approved' ? 'approved' : 'rejected',
          email: selected.email,
          name: selected.contact_name,
          company: selected.company_name
        })
      });
      setEmailStatus(res.ok ? 'sent' : 'failed');
    } catch {
      setEmailStatus('failed');
    }
  };
  const saveMemo = async () => {
    if (!selected) return;
    try {
      await window._sb.from('user_profiles').update({
        admin_memo: memo,
        updated_at: new Date().toISOString()
      }).eq('id', selected.id);
      setSignups(prev => prev.map(r => r.id === selected.id ? {
        ...r,
        admin_memo: memo
      } : r));
    } catch (err) {
      alert('메모 저장 실패: ' + (err.message || err));
    }
  };
  const fmtDate = iso => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const STATUS_LABELS = {
    all: '전체',
    pending: '대기중',
    approved: '승인됨',
    rejected: '거절됨'
  };
  const ROLE_LABELS = {
    buyer: '바이어',
    manufacturer: '제조사'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "asgn-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "asgn-status-tabs"
  }, ['all', 'pending', 'approved', 'rejected'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `asgn-status-tab ${activeStatus === s ? 'active' : ''}`,
    onClick: () => setActiveStatus(s)
  }, STATUS_LABELS[s], counts[s] > 0 && /*#__PURE__*/React.createElement("span", {
    className: "asgn-count-badge"
  }, counts[s])))), loading && /*#__PURE__*/React.createElement("div", {
    className: "asgn-state-msg"
  }, "\uB85C\uB529 \uC911\u2026"), error && /*#__PURE__*/React.createElement("div", {
    className: "asgn-state-msg asgn-error"
  }, error), !loading && !error && signups.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "asgn-state-msg"
  }, "\uD574\uB2F9 \uC0C1\uD0DC\uC758 \uC2E0\uCCAD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."), !loading && !error && signups.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table asgn-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC2E0\uCCAD\uC77C"), /*#__PURE__*/React.createElement("th", null, "\uC720\uD615"), /*#__PURE__*/React.createElement("th", null, "\uD68C\uC0AC\uBA85"), /*#__PURE__*/React.createElement("th", null, "\uC0AC\uC5C5\uC790\uBC88\uD638"), /*#__PURE__*/React.createElement("th", null, "\uB2F4\uB2F9\uC790"), /*#__PURE__*/React.createElement("th", null, "\uC5F0\uB77D\uCC98"), /*#__PURE__*/React.createElement("th", null, "\uC0C1\uD0DC"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, signups.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, fmtDate(r.created_at)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `asgn-role-badge role-${r.role}`
  }, ROLE_LABELS[r.role] || r.role || '-')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, r.company_name || '-')), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, r.business_number || '-'), /*#__PURE__*/React.createElement("td", null, r.contact_name || '-'), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, r.phone || '-'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `asgn-status-badge status-${r.status}`
  }, STATUS_LABELS[r.status] || r.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-detail-btn",
    onClick: () => openDetail(r)
  }, "\uC0C1\uC138"))))))), selected && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-overlay",
    onClick: () => setSelected(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal asgn-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, "\uAC00\uC785 \uC2E0\uCCAD \uC0C1\uC138"), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-modal-close",
    onClick: () => setSelected(null)
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAE30\uBCF8 \uC815\uBCF4"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC2E0\uCCAD\uC77C:"), " ", fmtDate(selected.created_at)), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC720\uD615:"), /*#__PURE__*/React.createElement("span", {
    className: `asgn-role-badge role-${selected.role}`
  }, ROLE_LABELS[selected.role] || selected.role)), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC0C1\uD0DC:"), /*#__PURE__*/React.createElement("span", {
    className: `asgn-status-badge status-${selected.status}`
  }, STATUS_LABELS[selected.status])), selected.approved_at && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uCC98\uB9AC\uC77C:"), " ", fmtDate(selected.approved_at))), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD68C\uC0AC \uC815\uBCF4"), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uD68C\uC0AC\uBA85:"), " ", selected.company_name || '-'), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC0AC\uC5C5\uC790\uBC88\uD638:"), " ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, selected.business_number || '-')), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uB2F4\uB2F9\uC790:"), " ", selected.contact_name || '-'), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC774\uBA54\uC77C:"), /*#__PURE__*/React.createElement("a", {
    href: `mailto:${selected.email}`
  }, selected.email)), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-row"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC5F0\uB77D\uCC98:"), " ", /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, selected.phone || '-'))), selected.interests && selected.interests.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAD00\uC2EC \uBD84\uC57C"), /*#__PURE__*/React.createElement("div", {
    className: "asgn-interests"
  }, (Array.isArray(selected.interests) ? selected.interests : []).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "asgn-interest-chip"
  }, t)))), selected.document_url && /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC81C\uCD9C \uC11C\uB958"), /*#__PURE__*/React.createElement("a", {
    className: "asgn-doc-link",
    href: selected.document_url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file",
    size: 14,
    stroke: 2
  }), " \uC11C\uB958 \uBCF4\uAE30 (\uC0C8 \uD0ED)")), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-detail-section"
  }, /*#__PURE__*/React.createElement("h3", null, "\uAD00\uB9AC\uC790 \uBA54\uBAA8"), /*#__PURE__*/React.createElement("div", {
    className: "asgn-memo-wrap"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "asgn-memo-textarea",
    rows: 3,
    placeholder: "\uB0B4\uBD80 \uBA54\uBAA8\uB97C \uC785\uB825\uD558\uC138\uC694\u2026",
    value: memo,
    onChange: e => setMemo(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "asgn-memo-save-btn",
    onClick: saveMemo
  }, "\uBA54\uBAA8 \uC800\uC7A5"))), emailStatus && /*#__PURE__*/React.createElement("div", {
    className: `asgn-email-status ${emailStatus}`
  }, emailStatus === 'sending' && '이메일 발송 중…', emailStatus === 'sent' && '이메일 발송 완료', emailStatus === 'failed' && '이메일 발송 실패 (Netlify 함수 확인 필요)')), /*#__PURE__*/React.createElement("div", {
    className: "admin-reports-modal-actions"
  }, selected.status === 'pending' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn primary",
    disabled: actionLoading,
    onClick: handleApprove
  }, actionLoading ? '처리 중…' : '승인'), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn",
    disabled: actionLoading,
    onClick: handleReject
  }, "\uAC70\uC808")), (selected.status === 'approved' || selected.status === 'rejected') && /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn",
    disabled: actionLoading,
    onClick: handleResendEmail
  }, "\uC774\uBA54\uC77C \uC7AC\uBC1C\uC1A1"), /*#__PURE__*/React.createElement("button", {
    className: "admin-reports-action-btn cancel",
    onClick: () => setSelected(null)
  }, "\uB2EB\uAE30")))));
};

// AdminPasswordGate
// ──────────────────────────────────────────────────────────
const ADMIN_SESSION_KEY = 'fm-admin-auth';
const AdminPasswordGate = ({
  onAuth
}) => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: trimmed
        })
      });
      const data = await res.json();
      if (data.ok) {
        try {
          sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
        } catch {}
        onAuth();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
    setLoading(false);
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "page admin-gate-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-gate-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-gate-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 28,
    stroke: 1.8
  })), /*#__PURE__*/React.createElement("h1", {
    className: "admin-gate-title"
  }, "\uAD00\uB9AC\uC790 \uC778\uC99D"), /*#__PURE__*/React.createElement("p", {
    className: "admin-gate-sub"
  }, "\uC811\uADFC\uD558\uB824\uBA74 \uAD00\uB9AC\uC790 \uBE44\uBC00\uBC88\uD638\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    className: "admin-gate-form"
  }, /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "admin-gate-input",
    value: pw,
    onChange: e => setPw(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') handleSubmit();
    },
    placeholder: "\uBE44\uBC00\uBC88\uD638",
    autoFocus: true
  }), error && /*#__PURE__*/React.createElement("p", {
    className: "admin-gate-error"
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%'
    },
    onClick: handleSubmit,
    disabled: loading
  }, loading ? '확인중…' : '확인'))));
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
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const {
          data: views
        } = await window._sb.from('page_views').select('path, referrer, created_at').gte('created_at', since).order('created_at', {
          ascending: true
        }).limit(5000);
        if (views) {
          setTodayViews(views.filter(v => v.created_at >= todayStart.toISOString()).length);
          const days = Array.from({
            length: 7
          }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            return d;
          });
          setDayChart(days.map(d => {
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            const v = views.filter(x => x.created_at >= d.toISOString() && x.created_at < next.toISOString()).length;
            return {
              label: `${d.getMonth() + 1}/${d.getDate()}`,
              v
            };
          }));
          const ref = {
            direct: 0,
            search: 0,
            social: 0,
            other: 0
          };
          views.forEach(v => {
            if (!v.referrer) ref.direct++;else if (/google|naver|daum|bing|yahoo/i.test(v.referrer)) ref.search++;else if (/facebook|twitter|instagram|kakao|linkedin/i.test(v.referrer)) ref.social++;else ref.other++;
          });
          setRefBreakdown(ref);
        }

        // 전체 누적
        const {
          count: total
        } = await window._sb.from('page_views').select('id', {
          count: 'estimated',
          head: true
        });
        setTotalViews(total ?? 0);

        // 유저 통계
        const [{
          count: uAll
        }, {
          count: uPending
        }, {
          count: uApproved
        }] = await Promise.all([window._sb.from('user_profiles').select('id', {
          count: 'estimated',
          head: true
        }), window._sb.from('user_profiles').select('id', {
          count: 'estimated',
          head: true
        }).eq('status', 'pending'), window._sb.from('user_profiles').select('id', {
          count: 'estimated',
          head: true
        }).eq('status', 'approved')]);
        setUserStats({
          total: uAll ?? 0,
          pending: uPending ?? 0,
          approved: uApproved ?? 0
        });
      } catch {}
      setLoading(false);
    })();
  }, []);
  const BarChart = ({
    data
  }) => {
    const max = Math.max(...data.map(d => d.v), 1);
    const cols = data.length;
    const W = 420,
      H = 100;
    const colW = W / cols;
    const barW = Math.max(6, colW - 8);
    return /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      viewBox: `0 0 ${W} ${H + 24}`,
      style: {
        overflow: 'visible',
        display: 'block'
      }
    }, data.map((d, i) => {
      const bh = Math.max(2, d.v / max * H);
      const x = i * colW + (colW - barW) / 2;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("rect", {
        x: x,
        y: H - bh,
        width: barW,
        height: bh,
        fill: "#3b82f6",
        rx: "3",
        opacity: "0.85"
      }), d.v > 0 && /*#__PURE__*/React.createElement("text", {
        x: x + barW / 2,
        y: H - bh - 4,
        textAnchor: "middle",
        fontSize: "9",
        fill: "#555"
      }, d.v), /*#__PURE__*/React.createElement("text", {
        x: x + barW / 2,
        y: H + 16,
        textAnchor: "middle",
        fontSize: "9",
        fill: "#999"
      }, d.label));
    }), /*#__PURE__*/React.createElement("line", {
      x1: 0,
      y1: H,
      x2: W,
      y2: H,
      stroke: "#eee",
      strokeWidth: "1"
    }));
  };
  const Metric = ({
    label,
    value,
    sub
  }) => /*#__PURE__*/React.createElement("div", {
    className: "an-metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "an-metric-v"
  }, value ?? '—'), /*#__PURE__*/React.createElement("div", {
    className: "an-metric-k"
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    className: "an-metric-sub"
  }, sub));
  if (loading) return /*#__PURE__*/React.createElement("div", {
    className: "an-loading"
  }, "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");
  const totalRef = refBreakdown ? Object.values(refBreakdown).reduce((a, b) => a + b, 0) : 1;
  const refPct = n => totalRef ? Math.round(n / totalRef * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "an-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "an-card an-card-wide"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "an-card-title"
  }, "\uBC29\uBB38\uC790 \uD1B5\uACC4"), /*#__PURE__*/React.createElement("div", {
    className: "an-metrics-row"
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "\uC624\uB298 \uBC29\uBB38\uC790",
    value: todayViews
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "\uB204\uC801 \uBC29\uBB38\uC790 (\uC804\uCCB4)",
    value: totalViews?.toLocaleString()
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "\uCD5C\uADFC 7\uC77C",
    value: dayChart.reduce((s, d) => s + d.v, 0)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "an-card an-card-wide"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "an-card-title"
  }, "\uCD5C\uADFC 7\uC77C \uC77C\uBCC4 \uBC29\uBB38"), dayChart.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "an-chart-wrap"
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: dayChart
  })) : /*#__PURE__*/React.createElement("p", {
    className: "an-empty"
  }, "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    className: "an-card"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "an-card-title"
  }, "\uC720\uC785 \uACBD\uB85C (\uCD5C\uADFC 7\uC77C)"), refBreakdown ? /*#__PURE__*/React.createElement("div", {
    className: "an-ref-list"
  }, [{
    label: '직접 접속',
    key: 'direct',
    color: '#3b82f6'
  }, {
    label: '검색엔진',
    key: 'search',
    color: '#10b981'
  }, {
    label: '소셜',
    key: 'social',
    color: '#8b5cf6'
  }, {
    label: '기타',
    key: 'other',
    color: '#f59e0b'
  }].map(({
    label,
    key,
    color
  }) => /*#__PURE__*/React.createElement("div", {
    key: key,
    className: "an-ref-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "an-ref-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "an-ref-dot",
    style: {
      background: color
    }
  }), label), /*#__PURE__*/React.createElement("div", {
    className: "an-ref-bar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "an-ref-bar",
    style: {
      width: refPct(refBreakdown[key]) + '%',
      background: color
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "an-ref-val"
  }, refBreakdown[key]), /*#__PURE__*/React.createElement("span", {
    className: "an-ref-pct"
  }, "(", refPct(refBreakdown[key]), "%)")))) : /*#__PURE__*/React.createElement("p", {
    className: "an-empty"
  }, "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
    className: "an-card"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "an-card-title"
  }, "\uC8FC\uC694 \uC9C0\uD45C"), userStats ? /*#__PURE__*/React.createElement("div", {
    className: "an-kpi-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "an-kpi-row"
  }, /*#__PURE__*/React.createElement("span", null, "\uC804\uCCB4 \uAC00\uC785 \uC2E0\uCCAD"), /*#__PURE__*/React.createElement("strong", null, userStats.total)), /*#__PURE__*/React.createElement("div", {
    className: "an-kpi-row"
  }, /*#__PURE__*/React.createElement("span", null, "\uC2B9\uC778 \uB300\uAE30"), /*#__PURE__*/React.createElement("strong", {
    className: "an-kpi-pending"
  }, userStats.pending)), /*#__PURE__*/React.createElement("div", {
    className: "an-kpi-row"
  }, /*#__PURE__*/React.createElement("span", null, "\uC2B9\uC778 \uC644\uB8CC"), /*#__PURE__*/React.createElement("strong", {
    className: "an-kpi-ok"
  }, userStats.approved))) : /*#__PURE__*/React.createElement("p", {
    className: "an-empty"
  }, "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")));
};

// ──────────────────────────────────────────────────────────
// AdminVisitorTab — 비회원 활동 현황
// ──────────────────────────────────────────────────────────
const VISITOR_PERIODS = [{
  id: 'today',
  label: '오늘'
}, {
  id: 'week',
  label: '이번 주'
}, {
  id: 'month',
  label: '이번 달'
}];
const AdminVisitorTab = () => {
  const [period, setPeriod] = useState('today');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const periodStart = p => {
    const d = new Date();
    if (p === 'today') {
      d.setHours(0, 0, 0, 0);
    } else if (p === 'week') {
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
    } else {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
    }
    return d.toISOString();
  };
  useEffect(() => {
    setLoading(true);
    setData(null);
    (async () => {
      if (!window._sb) {
        setLoading(false);
        return;
      }
      try {
        const since = periodStart(period);
        const {
          data: rows
        } = await window._sb.from('visitor_logs').select('session_id, event_type, event_data, created_at').gte('created_at', since).order('created_at', {
          ascending: false
        }).limit(5000);
        if (!rows) {
          setData({});
          setLoading(false);
          return;
        }
        const sessions = new Set(rows.map(r => r.session_id));
        const byType = t => rows.filter(r => r.event_type === t);
        const searches = byType('search');
        const factoryViews = byType('factory_view');
        const rfqAttempts = byType('rfq_attempt');
        const aiConsults = byType('ai_consult');
        const triggered = byType('signup_triggered');
        const completed = byType('signup_completed');

        // 인기 검색어 Top 10
        const qCounts = {};
        searches.forEach(r => {
          const q = r.event_data?.query;
          if (q) qCounts[q] = (qCounts[q] || 0) + 1;
        });
        const topQueries = Object.entries(qCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([q, n]) => ({
          q,
          n
        }));

        // 트리거별 전환율
        const triggerCounts = {};
        triggered.forEach(r => {
          const t = r.event_data?.trigger || 'unknown';
          triggerCounts[t] = (triggerCounts[t] || 0) + 1;
        });
        const completedCount = completed.length;
        const triggerConversion = Object.entries(triggerCounts).map(([t, n]) => ({
          trigger: t,
          shown: n,
          pct: completedCount > 0 ? Math.round(completedCount / n * 100) : 0
        }));
        setData({
          sessions: sessions.size,
          searches: searches.length,
          factoryViews: factoryViews.length,
          rfqAttempts: rfqAttempts.length,
          aiConsults: aiConsults.length,
          triggered: triggered.length,
          completed: completedCount,
          convRate: triggered.length > 0 ? (completedCount / triggered.length * 100).toFixed(1) : '0.0',
          topQueries,
          triggerConversion
        });
      } catch (e) {
        console.error('visitor_logs fetch error:', e);
        setData({});
      }
      setLoading(false);
    })();
  }, [period]);
  const Stat = ({
    label,
    value,
    highlight
  }) => /*#__PURE__*/React.createElement("div", {
    className: `vst-stat ${highlight ? 'vst-stat-hi' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "vst-stat-v"
  }, value ?? '—'), /*#__PURE__*/React.createElement("div", {
    className: "vst-stat-k"
  }, label));
  const BarRow = ({
    label,
    value,
    max,
    color
  }) => /*#__PURE__*/React.createElement("div", {
    className: "vst-bar-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vst-bar-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "vst-bar-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vst-bar-fill",
    style: {
      width: max ? `${Math.round(value / max * 100)}%` : '0%',
      background: color || '#3b6ef5'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "vst-bar-val"
  }, value));
  return /*#__PURE__*/React.createElement("div", {
    className: "vst-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vst-period-row"
  }, VISITOR_PERIODS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: `vst-period-btn ${period === p.id ? 'is-active' : ''}`,
    onClick: () => setPeriod(p.id)
  }, p.label))), loading && /*#__PURE__*/React.createElement("div", {
    className: "an-loading"
  }, "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026"), !loading && data && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "vst-stats-grid"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "\uBE44\uD68C\uC6D0 \uC138\uC158 \uC218",
    value: data.sessions,
    highlight: true
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\uAC80\uC0C9 \uC2DC\uB3C4",
    value: data.searches
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\uACF5\uC7A5 \uC0C1\uC138 \uD074\uB9AD",
    value: data.factoryViews
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\uACAC\uC801 \uC694\uCCAD \uC2DC\uB3C4",
    value: data.rfqAttempts
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "AI \uC0C1\uB2F4 \uC2DC\uB3C4",
    value: data.aiConsults
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\uAC00\uC785 \uC720\uB3C4 \uB178\uCD9C",
    value: data.triggered
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\uAC00\uC785 \uC644\uB8CC",
    value: data.completed,
    highlight: true
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\uC804\uD658\uC728",
    value: `${data.convRate}%`,
    highlight: true
  })), data.triggerConversion?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "vst-card"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "vst-card-title"
  }, "\uAC00\uC785 \uC720\uB3C4 \uD2B8\uB9AC\uAC70\uBCC4 \uD604\uD669"), /*#__PURE__*/React.createElement("div", {
    className: "vst-trigger-list"
  }, data.triggerConversion.map(({
    trigger,
    shown,
    pct
  }) => /*#__PURE__*/React.createElement("div", {
    key: trigger,
    className: "vst-trigger-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vst-trigger-label"
  }, trigger), /*#__PURE__*/React.createElement("div", {
    className: "vst-trigger-bar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vst-trigger-bar",
    style: {
      width: `${Math.min(pct, 100)}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "vst-trigger-meta"
  }, shown, "\uD68C \uB178\uCD9C \xB7 \uC804\uD658 ", pct, "%"))))), data.topQueries?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "vst-card"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "vst-card-title"
  }, "\uC778\uAE30 \uAC80\uC0C9\uC5B4 Top 10"), /*#__PURE__*/React.createElement("div", {
    className: "vst-query-list"
  }, data.topQueries.map(({
    q,
    n
  }, i) => /*#__PURE__*/React.createElement(BarRow, {
    key: q,
    label: `${i + 1}. ${q}`,
    value: n,
    max: data.topQueries[0].n,
    color: i === 0 ? '#3b6ef5' : i < 3 ? '#6366f1' : '#94a3b8'
  })))), !data.sessions && /*#__PURE__*/React.createElement("div", {
    className: "an-empty",
    style: {
      marginTop: 40
    }
  }, "\uD574\uB2F9 \uAE30\uAC04 \uBE44\uD68C\uC6D0 \uD65C\uB3D9 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.")));
};

// AdminFactoriesTab — 제조사 관리 (서버사이드 페이지네이션 + 검색 + 편집)
const AdminFactoriesTab = ({
  onOpenFactory
}) => {
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
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, filterVisible, filterWebsite, filterContact]);
  useEffect(() => {
    if (!window._sb) return;
    let mounted = true;
    setLoading(true);
    let sq = window._sb.from('factories').select('*', {
      count: 'exact'
    });
    if (debouncedQ) sq = sq.or(`name.ilike.%${debouncedQ}%,city.ilike.%${debouncedQ}%`);
    if (filterVisible === 'public') sq = sq.eq('hidden', false);
    if (filterVisible === 'private') sq = sq.eq('hidden', true);
    if (filterWebsite === 'yes') sq = sq.not('website', 'is', null);
    if (filterWebsite === 'no') sq = sq.is('website', null);
    if (filterContact === 'yes') sq = sq.not('phone', 'is', null);
    if (filterContact === 'no') sq = sq.is('phone', null);
    const from = (page - 1) * PAGE_SIZE;
    sq.order('id', {
      ascending: true
    }).range(from, from + PAGE_SIZE - 1).then(({
      data,
      count,
      error
    }) => {
      if (!mounted) return;
      if (!error) {
        setRows(data || []);
        setTotalCount(count);
      }
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [page, debouncedQ, filterVisible, filterWebsite, filterContact]);
  const openEdit = row => {
    setEditTarget(row);
    setEditDraft({
      name: row.name || '',
      summary: row.summary || '',
      region: row.region || '',
      city: row.city || '',
      phone: row.phone || '',
      website: row.website || '',
      employees: row.employees ?? '',
      founded: row.founded ?? '',
      hidden: !!row.hidden
    });
  };
  const saveEdit = async () => {
    if (!editTarget || saving) return;
    setSaving(true);
    const updates = {
      name: editDraft.name.trim(),
      summary: editDraft.summary.trim(),
      region: editDraft.region.trim(),
      city: editDraft.city.trim(),
      phone: editDraft.phone.trim() || null,
      website: editDraft.website.trim() || null,
      employees: editDraft.employees === '' ? null : Number(editDraft.employees),
      founded: editDraft.founded === '' ? null : Number(editDraft.founded),
      hidden: editDraft.hidden
    };
    const {
      error
    } = await window._sb.from('factories').update(updates).eq('id', editTarget.id);
    setSaving(false);
    if (error) {
      alert('저장 실패: ' + error.message);
      return;
    }
    setRows(prev => prev.map(r => r.id === editTarget.id ? {
      ...r,
      ...updates
    } : r));
    setEditTarget(null);
  };
  const pageCount = totalCount != null ? Math.ceil(totalCount / PAGE_SIZE) : 0;
  const EDIT_FIELDS = [{
    key: 'name',
    label: '회사명',
    type: 'text'
  }, {
    key: 'city',
    label: '도시/주소',
    type: 'text'
  }, {
    key: 'region',
    label: '지역 (DB값)',
    type: 'text'
  }, {
    key: 'phone',
    label: '연락처',
    type: 'text'
  }, {
    key: 'website',
    label: '웹사이트',
    type: 'text'
  }, {
    key: 'employees',
    label: '임직원 수',
    type: 'number'
  }, {
    key: 'founded',
    label: '설립연도',
    type: 'number'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "\uC81C\uC870\uC0AC\uBA85, \uB3C4\uC2DC\uB85C \uAC80\uC0C9",
    value: q,
    onChange: e => setQ(e.target.value)
  }), q && /*#__PURE__*/React.createElement("button", {
    className: "ls-clear",
    onClick: () => setQ('')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 12,
    stroke: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "admin-segmented"
  }, [{
    id: 'all',
    label: '전체'
  }, {
    id: 'public',
    label: '공개'
  }, {
    id: 'private',
    label: '비공개'
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: 'seg-btn ' + (filterVisible === s.id ? 'is-active' : ''),
    onClick: () => setFilterVisible(s.id)
  }, s.label))), /*#__PURE__*/React.createElement("div", {
    className: "admin-segmented"
  }, [{
    id: 'all',
    label: '웹사이트'
  }, {
    id: 'yes',
    label: '있음'
  }, {
    id: 'no',
    label: '없음'
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: 'seg-btn ' + (filterWebsite === s.id ? 'is-active' : ''),
    onClick: () => setFilterWebsite(s.id)
  }, s.label))), /*#__PURE__*/React.createElement("div", {
    className: "admin-segmented"
  }, [{
    id: 'all',
    label: '연락처'
  }, {
    id: 'yes',
    label: '있음'
  }, {
    id: 'no',
    label: '없음'
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: 'seg-btn ' + (filterContact === s.id ? 'is-active' : ''),
    onClick: () => setFilterContact(s.id)
  }, s.label))), /*#__PURE__*/React.createElement("span", {
    className: "admin-toolbar-count"
  }, loading ? '…' : (totalCount ?? 0).toLocaleString(), "\uACF3")), /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC81C\uC870\uC0AC\uBA85"), /*#__PURE__*/React.createElement("th", null, "\uB3C4\uC2DC"), /*#__PURE__*/React.createElement("th", null, "\uC5F0\uB77D\uCC98"), /*#__PURE__*/React.createElement("th", null, "\uC6F9\uC0AC\uC774\uD2B8"), /*#__PURE__*/React.createElement("th", null, "\uACF5\uAC1C"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, loading && rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    className: "admin-table-empty"
  }, "\uB85C\uB529 \uC911\u2026")) : rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    className: "admin-table-empty"
  }, "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4")) : rows.map(f => /*#__PURE__*/React.createElement("tr", {
    key: f.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "admin-name"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-name-dot"
  }), /*#__PURE__*/React.createElement("strong", null, f.name), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "#", String(f.id).slice(0, 12)))), /*#__PURE__*/React.createElement("td", null, f.city || '—'), /*#__PURE__*/React.createElement("td", null, f.phone || '—'), /*#__PURE__*/React.createElement("td", null, f.website ? /*#__PURE__*/React.createElement("span", {
    className: "admin-link-cell",
    title: f.website
  }, f.website.replace(/^https?:\/\//, '').slice(0, 28)) : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: 'admin-visible-badge ' + (f.hidden ? 'is-hidden' : 'is-public')
  }, f.hidden ? '비공개' : '공개')), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "admin-row-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "link-btn",
    onClick: () => openEdit(f)
  }, "\uC218\uC815"), /*#__PURE__*/React.createElement("button", {
    className: "link-btn",
    onClick: () => onOpenFactory && onOpenFactory(f.id)
  }, "\uBCF4\uAE30")))))))), pageCount > 1 && /*#__PURE__*/React.createElement("div", {
    className: "admin-pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pg-btn",
    onClick: () => setPage(1),
    disabled: page === 1
  }, "\xAB"), /*#__PURE__*/React.createElement("button", {
    className: "pg-btn",
    onClick: () => setPage(p => p - 1),
    disabled: page === 1
  }, "\u2039"), (() => {
    const start = Math.max(1, Math.min(page - 3, pageCount - 6));
    const end = Math.min(pageCount, start + 6);
    return Array.from({
      length: end - start + 1
    }, (_, i) => start + i).map(n => /*#__PURE__*/React.createElement("button", {
      key: n,
      className: 'pg-num ' + (page === n ? 'is-active' : ''),
      onClick: () => setPage(n)
    }, n));
  })(), /*#__PURE__*/React.createElement("button", {
    className: "pg-btn",
    onClick: () => setPage(p => p + 1),
    disabled: page === pageCount
  }, "\u203A"), /*#__PURE__*/React.createElement("button", {
    className: "pg-btn",
    onClick: () => setPage(pageCount),
    disabled: page === pageCount
  }, "\xBB"), /*#__PURE__*/React.createElement("span", {
    className: "admin-page-info"
  }, page.toLocaleString(), " / ", pageCount.toLocaleString(), " \uD398\uC774\uC9C0")), editTarget && /*#__PURE__*/React.createElement("div", {
    className: "admin-modal-overlay",
    onClick: () => setEditTarget(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "\uC81C\uC870\uC0AC \uD3B8\uC9D1"), /*#__PURE__*/React.createElement("button", {
    className: "admin-modal-close",
    onClick: () => setEditTarget(null)
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "admin-modal-body"
  }, EDIT_FIELDS.map(({
    key,
    label,
    type
  }) => /*#__PURE__*/React.createElement("div", {
    key: key,
    className: "admin-form-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "admin-form-label"
  }, label), /*#__PURE__*/React.createElement("input", {
    className: "admin-form-input",
    type: type,
    value: editDraft[key],
    onChange: e => setEditDraft(d => ({
      ...d,
      [key]: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "admin-form-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "admin-form-label"
  }, "\uD55C\uC904 \uC18C\uAC1C"), /*#__PURE__*/React.createElement("textarea", {
    className: "admin-form-input",
    rows: 3,
    value: editDraft.summary,
    onChange: e => setEditDraft(d => ({
      ...d,
      summary: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "admin-form-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "admin-form-label"
  }, "\uACF5\uAC1C \uC5EC\uBD80"), /*#__PURE__*/React.createElement("label", {
    className: "admin-form-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !editDraft.hidden,
    onChange: e => setEditDraft(d => ({
      ...d,
      hidden: !e.target.checked
    }))
  }), /*#__PURE__*/React.createElement("span", null, "\uACF5\uAC1C (\uCCB4\uD06C \uD574\uC81C \uC2DC \uBE44\uACF5\uAC1C)")))), /*#__PURE__*/React.createElement("div", {
    className: "admin-modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setEditTarget(null)
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: saveEdit,
    disabled: saving
  }, saving ? '저장 중…' : '저장')))));
};

// ─── AdminGrantsTab ────────────────────────────────────────
const AdminGrantsTab = () => {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('전체');
  const [showModal, setShowModal] = useState(false);
  const [editGrant, setEditGrant] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const BLANK = {
    title: '',
    organization: '',
    category: '설비투자',
    description: '',
    target: '',
    amount: '',
    deadline: '',
    url: '',
    is_active: true
  };
  const load = () => {
    setLoading(true);
    if (!window._sb) {
      setLoading(false);
      return;
    }
    window._sb.from('government_support').select('*').order('deadline', {
      ascending: true
    }).then(({
      data
    }) => {
      if (data) setGrants(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(load, []);
  const openAdd = () => {
    setEditGrant(null);
    setForm({
      ...BLANK
    });
    setShowModal(true);
  };
  const openEdit = g => {
    setEditGrant(g);
    setForm({
      ...g
    });
    setShowModal(true);
  };
  const save = async () => {
    if (!form.title?.trim() || !form.organization?.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      category: form.category || '기타',
      description: form.description || null,
      target: form.target || null,
      amount: form.amount || null,
      deadline: form.deadline || null,
      url: form.url || null,
      is_active: !!form.is_active
    };
    if (editGrant) {
      await window._sb.from('government_support').update(payload).eq('id', editGrant.id);
    } else {
      await window._sb.from('government_support').insert(payload);
    }
    setSaving(false);
    setShowModal(false);
    load();
  };
  const del = async id => {
    if (!confirm('삭제하시겠습니까?')) return;
    await window._sb.from('government_support').delete().eq('id', id);
    setGrants(prev => prev.filter(g => g.id !== id));
  };
  const setF = (key, val) => setForm(p => ({
    ...p,
    [key]: val
  }));
  const filtered = grants.filter(g => catFilter === '전체' || g.category === catFilter);
  return /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      flexWrap: 'wrap',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 15,
      fontWeight: 700
    }
  }, "\uC9C0\uC6D0\uC0AC\uC5C5 \uAD00\uB9AC"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-cat-tabs"
  }, GRANT_CATS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: `grants-cat-tab${catFilter === c ? ' is-active' : ''}`,
    onClick: () => setCatFilter(c)
  }, c))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: openAdd
  }, "+ \uCD94\uAC00"))), loading ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-3)',
      fontSize: 13
    }
  }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026") : /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC0AC\uC5C5\uBA85"), /*#__PURE__*/React.createElement("th", null, "\uAE30\uAD00"), /*#__PURE__*/React.createElement("th", null, "\uCE74\uD14C\uACE0\uB9AC"), /*#__PURE__*/React.createElement("th", null, "\uC9C0\uC6D0\uAE08\uC561"), /*#__PURE__*/React.createElement("th", null, "\uB9C8\uAC10\uC77C"), /*#__PURE__*/React.createElement("th", null, "D-day"), /*#__PURE__*/React.createElement("th", null, "\uC0C1\uD0DC"), /*#__PURE__*/React.createElement("th", null, "\uAD00\uB9AC"))), /*#__PURE__*/React.createElement("tbody", null, filtered.map(g => {
    const dday = calcDday(g.deadline);
    return /*#__PURE__*/React.createElement("tr", {
      key: g.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        maxWidth: 180
      }
    }, g.title), /*#__PURE__*/React.createElement("td", null, g.organization), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "grant-cat-badge",
      style: {
        background: (GRANT_CAT_COLOR[g.category] || GRANT_CAT_COLOR['기타']).bg,
        color: (GRANT_CAT_COLOR[g.category] || GRANT_CAT_COLOR['기타']).color
      }
    }, g.category)), /*#__PURE__*/React.createElement("td", null, g.amount || '—'), /*#__PURE__*/React.createElement("td", null, g.deadline || '—'), /*#__PURE__*/React.createElement("td", null, dday ? /*#__PURE__*/React.createElement("span", {
      className: `grant-dday${dday.urgent ? ' is-urgent' : ''}`
    }, dday.label) : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: g.is_active ? '#16a34a' : '#94a3b8',
        fontSize: 12,
        fontWeight: 600
      }
    }, g.is_active ? '공개' : '비공개')), /*#__PURE__*/React.createElement("td", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      style: {
        padding: '4px 8px',
        fontSize: 12
      },
      onClick: () => openEdit(g)
    }, "\uC218\uC815"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost btn-sm",
      style: {
        padding: '4px 8px',
        fontSize: 12,
        color: 'var(--rose)',
        marginLeft: 4
      },
      onClick: () => del(g.id)
    }, "\uC0AD\uC81C")));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "8",
    className: "admin-table-empty"
  }, "\uC9C0\uC6D0\uC0AC\uC5C5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4"))))), showModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-veil",
    onClick: () => setShowModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: 520
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("header", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, editGrant ? '지원사업 수정' : '지원사업 추가'), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: () => setShowModal(false)
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [{
    key: 'title',
    label: '사업명 *'
  }, {
    key: 'organization',
    label: '기관명 *'
  }, {
    key: 'description',
    label: '요약'
  }, {
    key: 'target',
    label: '지원대상'
  }, {
    key: 'amount',
    label: '지원금액'
  }, {
    key: 'url',
    label: '링크 URL'
  }].map(({
    key,
    label
  }) => /*#__PURE__*/React.createElement("label", {
    key: key,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, label, /*#__PURE__*/React.createElement("input", {
    className: "admin-form-input",
    value: form[key] || '',
    onChange: e => setF(key, e.target.value)
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, "\uCE74\uD14C\uACE0\uB9AC", /*#__PURE__*/React.createElement("select", {
    className: "admin-form-input",
    value: form.category || '기타',
    onChange: e => setF('category', e.target.value)
  }, GRANT_CATS.filter(c => c !== '전체').map(c => /*#__PURE__*/React.createElement("option", {
    key: c
  }, c)))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, "\uB9C8\uAC10\uC77C", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "admin-form-input",
    value: form.deadline || '',
    onChange: e => setF('deadline', e.target.value)
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      fontSize: 13,
      color: 'var(--ink-2)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!form.is_active,
    onChange: e => setF('is_active', e.target.checked)
  }), "\uACF5\uAC1C \uC5EC\uBD80")), /*#__PURE__*/React.createElement("footer", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => setShowModal(false)
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: save,
    disabled: saving
  }, saving ? '저장 중…' : '저장')))));
};

// AdminPage — 운영자 대시보드
// ──────────────────────────────────────────────────────────
const AdminPage = ({
  onOpenFactory
}) => {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [totalCount, setTotalCount] = useState(null);
  const [tab, setTab] = useState('factories');
  useEffect(() => {
    if (!window._sb) return;
    window._sb.from('factories').select('*', {
      count: 'estimated',
      head: true
    }).then(({
      count
    }) => {
      if (count != null) setTotalCount(count);
    });
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
  const [uploadProgress, setUploadProgress] = useState({
    done: 0,
    total: 0
  });
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = React.useRef(null);
  const MAPPING_FIELDS = [{
    field: 'id_src',
    label: 'ID 번호',
    required: false
  }, {
    field: 'name',
    label: '회사명',
    required: true
  }, {
    field: 'city',
    label: '주소',
    required: false
  }, {
    field: 'products',
    label: '생산품',
    required: false
  }, {
    field: 'summary',
    label: '단지명',
    required: false
  }, {
    field: 'industries',
    label: '업종명',
    required: false
  }];
  const FIELD_KEYWORDS = {
    name: ['회사명', '사업체명', '업체명', '공장명', '상호', '법인명', '회사', '기업명', '업체', '사업자명', '공장', '업체'],
    city: ['공장주소', '주소', '본사소재지', '소재지', '주소지', '사업장주소', '도로명주소', '지번주소', '위치', '공장대표주소', '사업장소재지', 'address'],
    products: ['생산품', '주생산품', '제품', '생산제품', '품목', '주요생산품', '생산물', '취급품목', '주력제품', '생산품목'],
    id_src: ['연번', '순번', '번호', 'id', 'no', '일련번호'],
    summary: ['단지명', '산업단지명', '단지', '지구', '구역', '입주단지'],
    industries: ['업종명', '업종', '업태', '산업분류', '업종코드', '주업종', '제조업종']
  };
  const autoMap = headers => {
    const result = {
      name: -1,
      city: -1,
      products: -1,
      id_src: -1,
      summary: -1,
      industries: -1
    };
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
    setUploadProgress({
      done: 0,
      total: 0
    });
    setUploadResult(null);
  };
  const closeUpload = () => {
    setShowUpload(false);
    resetUpload();
  };
  const downloadTemplate = () => {
    const hdr = 'id,name,en,city,region,coord_x,coord_y,industries,processes,products,materials,moq,moq_unit,lead_days,price_range,employees,founded,certs,oem,odm,export,rating,reviews,response_hr,deals,summary,image';
    const ex = 'f_ex1,예시정밀,Example Precision,경기 안산시,gyeonggi,38,32,machine,cnc;cutting,auto;machine_parts,알루미늄;SUS304,100,피스,14,₩2500~₩18000,42,2008,ISO 9001;IATF 16949,true,true,false,4.5,80,3,200,자동차 정밀부품 전문입니다.,#a8b4c8';
    const blob = new Blob([hdr + '\n' + ex], {
      type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'factories_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Step 1: Read file → detect headers → show mapping phase
  const parseFileHeaders = async file => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('.csv 파일만 업로드할 수 있습니다.');
      return;
    }
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
    const get = (vals, idx) => idx >= 0 && idx < vals.length ? (vals[idx] || '').trim() : '';
    const ts = Date.now();
    const rows = [],
      errors = [];
    rawLines.forEach((vals, i) => {
      const name = get(vals, colMap.name);
      if (!name) {
        errors.push({
          rowNum: i + 2,
          msg: '회사명 없음'
        });
        return;
      }
      const seqRaw = get(vals, colMap.id_src);
      const id = seqRaw || 'upload_' + ts + '_' + (i + 1);
      const city = get(vals, colMap.city);
      rows.push({
        id,
        name,
        en: '',
        city,
        region: extractRegion(city),
        coord_x: 50,
        coord_y: 50,
        industries: get(vals, colMap.industries).split(/[,;／、]/).map(s => s.trim()).filter(Boolean),
        processes: [],
        products: get(vals, colMap.products).split(/[,;／、]/).map(s => s.trim()).filter(Boolean),
        materials: [],
        moq: 1,
        moq_unit: '협의',
        lead_days: 0,
        price_range: '',
        employees: 0,
        founded: 0,
        certs: [],
        oem: false,
        odm: false,
        export: false,
        rating: 0,
        reviews: 0,
        response_hr: 24,
        deals: 0,
        hidden: false,
        summary: get(vals, colMap.summary),
        image: '#a8b4c8'
      });
    });
    setParsedRows(rows);
    setParseErrors(errors);
    setUploadPhase('preview');
  };

  // Step 3: 1000-row batch upsert
  const confirmUpload = async () => {
    if (!window._sb) {
      alert('Supabase 연결이 없습니다.');
      return;
    }
    setUploadPhase('uploading');
    const BATCH = 1000;
    let ok = 0,
      fail = 0;
    const failedRows = [];
    setUploadProgress({
      done: 0,
      total: parsedRows.length
    });
    for (let i = 0; i < parsedRows.length; i += BATCH) {
      const chunk = parsedRows.slice(i, i + BATCH);
      const {
        error
      } = await window._sb.from('factories').upsert(chunk, {
        onConflict: 'id'
      });
      if (!error) {
        ok += chunk.length;
      } else {
        fail += chunk.length;
        failedRows.push({
          id: `${i + 1}~${Math.min(i + BATCH, parsedRows.length)}행`,
          name: '',
          msg: error.message
        });
      }
      setUploadProgress({
        done: Math.min(i + BATCH, parsedRows.length),
        total: parsedRows.length
      });
      await new Promise(r => setTimeout(r, 0));
    }
    setUploadResult({
      ok,
      fail,
      failedRows
    });
    setUploadPhase('result');
    try {
      const {
        count
      } = await window._sb.from('factories').select('*', {
        count: 'estimated',
        head: true
      });
      if (count != null) setTotalCount(count);
    } catch (_) {}
  };
  const [userCount, setUserCount] = useState(null);
  const [rfqMonthCount, setRfqMonthCount] = useState(null);
  useEffect(() => {
    if (!window._sb) return;
    // 전체 사용자 수: user_profiles (anon key로 접근 가능한 public 테이블)
    window._sb.from('user_profiles').select('*', {
      count: 'exact',
      head: true
    }).then(({
      count,
      error
    }) => {
      if (!error && count != null) setUserCount(count);
    }).catch(() => {});
    // RFQ 이번달 건수
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    window._sb.from('rfq').select('*', {
      count: 'exact',
      head: true
    }).gte('created_at', firstDay).then(({
      count,
      error
    }) => {
      setRfqMonthCount(!error && count != null ? count : 0);
    }).catch(() => setRfqMonthCount(0));
  }, []);
  const stats = {
    total: totalCount ?? '…',
    users: userCount ?? '…',
    rfq: rfqMonthCount ?? '…'
  };
  const PREVIEW_COLS = [{
    key: 'id',
    label: 'ID'
  }, {
    key: 'name',
    label: '회사명'
  }, {
    key: 'city',
    label: '주소',
    render: v => v ? v.slice(0, 22) + (v.length > 22 ? '…' : '') : '—'
  }, {
    key: 'products',
    label: '생산품',
    render: v => (v || []).slice(0, 3).join(', ') || '—'
  }, {
    key: 'summary',
    label: '단지명'
  }];

  // 비밀번호 게이트 — 모든 훅 선언 이후에 위치
  if (!authed) return /*#__PURE__*/React.createElement(AdminPasswordGate, {
    onAuth: () => setAuthed(true)
  });
  const handleLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {}
    setAuthed(false);
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "page admin-page"
  }, /*#__PURE__*/React.createElement("header", {
    className: "admin-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "admin-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 11,
    stroke: 2.2
  }), "FactoryMatch \xB7 \uC6B4\uC601\uC790 \uCF58\uC194"), /*#__PURE__*/React.createElement("h1", null, "\uC81C\uC870\uC0AC \uB370\uC774\uD130 \uAD00\uB9AC"), /*#__PURE__*/React.createElement("p", null, "CSV\uB85C \uC77C\uAD04 \uC5C5\uB85C\uB4DC\uD558\uACE0, \uAC80\uC99D \uC644\uB8CC\uB41C \uC81C\uC870\uC0AC\uB9CC \uACF5\uAC1C\uB85C \uC804\uD658\uD558\uC138\uC694.")), /*#__PURE__*/React.createElement("div", {
    className: "admin-hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: handleLogout
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14,
    stroke: 2
  }), "\uB85C\uADF8\uC544\uC6C3"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: downloadTemplate
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_up_right",
    size: 14,
    stroke: 2
  }), "\uD15C\uD50C\uB9BF \uB2E4\uC6B4\uB85C\uB4DC"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      resetUpload();
      setShowUpload(true);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 14,
    stroke: 2
  }), "CSV \uC5C5\uB85C\uB4DC"))), /*#__PURE__*/React.createElement("section", {
    className: "admin-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "astat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "astat-k"
  }, "\uC804\uCCB4 \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("div", {
    className: "astat-v"
  }, typeof stats.total === 'number' ? stats.total.toLocaleString() : stats.total)), /*#__PURE__*/React.createElement("div", {
    className: "astat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "astat-k"
  }, "\uC804\uCCB4 \uC0AC\uC6A9\uC790"), /*#__PURE__*/React.createElement("div", {
    className: "astat-v"
  }, typeof stats.users === 'number' ? stats.users.toLocaleString() : stats.users)), /*#__PURE__*/React.createElement("div", {
    className: "astat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "astat-k"
  }, "RFQ (\uC774\uBC88\uB2EC)"), /*#__PURE__*/React.createElement("div", {
    className: "astat-v"
  }, stats.rfq)), /*#__PURE__*/React.createElement("div", {
    className: "astat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "astat-k"
  }, "\uD65C\uC131 \uCC44\uD305"), /*#__PURE__*/React.createElement("div", {
    className: "astat-v",
    style: {
      color: 'var(--ink-4)',
      fontSize: 13
    }
  }, "\uC900\uBE44 \uC911"))), /*#__PURE__*/React.createElement("nav", {
    className: "admin-tabs"
  }, [{
    id: 'factories',
    label: '제조사 관리'
  }, {
    id: 'users',
    label: '사용자'
  }, {
    id: 'rfq',
    label: 'RFQ 모니터링'
  }, {
    id: 'logs',
    label: '업로드 이력'
  }, {
    id: 'reports',
    label: '신고 관리'
  }, {
    id: 'signups',
    label: '가입 신청'
  }, {
    id: 'analytics',
    label: '통계'
  }, {
    id: 'visitors',
    label: '비회원 활동'
  }, {
    id: 'grants',
    label: '지원사업 관리'
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: 'admin-tab ' + (tab === t.id ? 'is-active' : ''),
    onClick: () => setTab(t.id)
  }, t.label))), tab === 'factories' && /*#__PURE__*/React.createElement(AdminFactoriesTab, {
    onOpenFactory: onOpenFactory
  }), tab === 'users' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel admin-placeholder"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 28,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("h3", null, "\uC0AC\uC6A9\uC790 \uAD00\uB9AC"), /*#__PURE__*/React.createElement("p", null, "\uAC00\uC785 \uC0AC\uC6A9\uC790 \uBAA9\uB85D, \uC5ED\uD560 \uBCC0\uACBD, \uC815\uC9C0/\uD574\uC81C \uAE30\uB2A5")), tab === 'rfq' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel admin-placeholder"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chart",
    size: 28,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("h3", null, "RFQ \uBAA8\uB2C8\uD130\uB9C1"), /*#__PURE__*/React.createElement("p", null, "\uC774\uBC88\uB2EC RFQ ", stats.rfq, "\uAC74 \u2014 \uC751\uB2F5\uB960, \uD3C9\uADE0 \uD68C\uC2E0 \uC2DC\uAC04 \uD2B8\uB798\uD0B9")), tab === 'logs' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC77C\uC2DC"), /*#__PURE__*/React.createElement("th", null, "\uD30C\uC77C\uBA85"), /*#__PURE__*/React.createElement("th", null, "\uC804\uCCB4"), /*#__PURE__*/React.createElement("th", null, "\uC131\uACF5"), /*#__PURE__*/React.createElement("th", null, "\uC2E4\uD328"), /*#__PURE__*/React.createElement("th", null, "\uACB0\uACFC"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, "2025-01-06 14:23"), /*#__PURE__*/React.createElement("td", null, "factories_2025_01.csv"), /*#__PURE__*/React.createElement("td", null, "184"), /*#__PURE__*/React.createElement("td", null, "179"), /*#__PURE__*/React.createElement("td", null, "5"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "status-pill status-\uC9C4\uD589\uC911"
  }, "\uAC80\uC99D\uC911"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, "2024-12-28 09:14"), /*#__PURE__*/React.createElement("td", null, "factories_dec.csv"), /*#__PURE__*/React.createElement("td", null, "241"), /*#__PURE__*/React.createElement("td", null, "241"), /*#__PURE__*/React.createElement("td", null, "0"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "status-pill status-\uC644\uB8CC"
  }, "\uC644\uB8CC"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, "2024-12-15 16:42"), /*#__PURE__*/React.createElement("td", null, "cnc_extra.csv"), /*#__PURE__*/React.createElement("td", null, "72"), /*#__PURE__*/React.createElement("td", null, "72"), /*#__PURE__*/React.createElement("td", null, "0"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "status-pill status-\uC644\uB8CC"
  }, "\uC644\uB8CC"))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, "2024-11-29 11:08"), /*#__PURE__*/React.createElement("td", null, "busan_factories.csv"), /*#__PURE__*/React.createElement("td", null, "56"), /*#__PURE__*/React.createElement("td", null, "54"), /*#__PURE__*/React.createElement("td", null, "2"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "status-pill status-\uC644\uB8CC"
  }, "\uC644\uB8CC"))))))), tab === 'reports' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement(AdminReportsTab, null)), tab === 'signups' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement(AdminSignupTab, null)), tab === 'analytics' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement(AdminAnalyticsTab, null)), tab === 'visitors' && /*#__PURE__*/React.createElement("section", {
    className: "admin-panel"
  }, /*#__PURE__*/React.createElement(AdminVisitorTab, null)), tab === 'grants' && /*#__PURE__*/React.createElement(AdminGrantsTab, null), showUpload && /*#__PURE__*/React.createElement("div", {
    className: "modal-veil",
    onClick: closeUpload
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card upload-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("header", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, uploadPhase === 'idle' && 'CSV 일괄 업로드', uploadPhase === 'mapping' && `컬럼 매핑 · ${rawHeaders.length}개 감지`, uploadPhase === 'preview' && `미리보기 · ${parsedRows.length.toLocaleString()}행`, uploadPhase === 'uploading' && '업로드 중…', uploadPhase === 'result' && '업로드 완료'), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: closeUpload
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 16,
    stroke: 2
  }))), uploadPhase === 'idle' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: ".csv",
    style: {
      display: 'none'
    },
    onChange: e => {
      const f = e.target.files[0];
      if (f) parseFileHeaders(f);
      e.target.value = '';
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: 'upload-drop' + (dragOver ? ' is-drag' : ''),
    onDragOver: e => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: e => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) parseFileHeaders(f);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 32,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("strong", null, "CSV \uD30C\uC77C\uC744 \uB04C\uC5B4\uB2E4 \uB193\uC73C\uC138\uC694"), /*#__PURE__*/React.createElement("span", null, ".csv \xB7 UTF-8 / EUC-KR \xB7 \uCEEC\uB7FC\uBA85 \uC790\uB3D9 \uC778\uC2DD"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => fileInputRef.current?.click()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12,
    stroke: 2.2
  }), "\uD30C\uC77C \uC120\uD0DD")), /*#__PURE__*/React.createElement("div", {
    className: "upload-template"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 13,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\uC5B4\uB5A4 CSV\uB4E0 OK"), /*#__PURE__*/React.createElement("span", null, "\uCEEC\uB7FC\uBA85\uC744 \uC790\uB3D9 \uBD84\uC11D\uD574 \uB9E4\uD551\uD569\uB2C8\uB2E4. \uACF5\uACF5\uB370\uC774\uD130\xB7\uC790\uCCB4 \uC591\uC2DD \uBAA8\uB450 \uC9C0\uC6D0.")), /*#__PURE__*/React.createElement("button", {
    className: "link-btn",
    onClick: downloadTemplate
  }, "\uAE30\uBCF8 \uD15C\uD50C\uB9BF"))), uploadPhase === 'mapping' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mapping-info"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 14,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, rawHeaders.length, "\uAC1C \uCEEC\uB7FC"), " \uAC10\uC9C0 \xB7 ", /*#__PURE__*/React.createElement("strong", null, rawLines.length.toLocaleString(), "\uD589"))), /*#__PURE__*/React.createElement("div", {
    className: "mapping-table"
  }, MAPPING_FIELDS.map(({
    field,
    label,
    required
  }) => {
    const idx = colMap[field] ?? -1;
    return /*#__PURE__*/React.createElement("div", {
      key: field,
      className: `mapping-row ${idx >= 0 ? 'is-matched' : 'is-unmatched'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "mapping-target"
    }, label, required && /*#__PURE__*/React.createElement("span", {
      className: "mapping-required"
    }, "\uD544\uC218")), /*#__PURE__*/React.createElement("div", {
      className: "mapping-status"
    }, idx >= 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      stroke: 2.4
    }), /*#__PURE__*/React.createElement("span", {
      className: "mapping-col-name"
    }, rawHeaders[idx])) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 12,
      stroke: 2
    }), " ", /*#__PURE__*/React.createElement("span", {
      className: "mapping-col-none"
    }, "\uBBF8\uAC10\uC9C0"))), /*#__PURE__*/React.createElement("select", {
      className: "mapping-select",
      value: idx >= 0 ? idx : '',
      onChange: e => setColMap(m => ({
        ...m,
        [field]: e.target.value === '' ? -1 : parseInt(e.target.value)
      }))
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u2014 \uB9E4\uD551 \uC548 \uD568 \u2014"), rawHeaders.map((h, i) => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: i
    }, h))));
  })), (colMap.name ?? -1) < 0 && /*#__PURE__*/React.createElement("div", {
    className: "mapping-warn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 13,
    stroke: 2
  }), " \uD68C\uC0AC\uBA85 \uCEEC\uB7FC\uC744 \uBC18\uB4DC\uC2DC \uC9C0\uC815\uD574\uC8FC\uC138\uC694."), /*#__PURE__*/React.createElement("footer", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: resetUpload
  }, "\uB2E4\uC2DC \uC120\uD0DD"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: applyMapping,
    disabled: (colMap.name ?? -1) < 0
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 13,
    stroke: 2.2
  }), "\uB9E4\uD551 \uD655\uC778 \xB7 \uBBF8\uB9AC\uBCF4\uAE30"))), uploadPhase === 'preview' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "upload-preview-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-preview-stat upload-stat-ok"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    stroke: 2.4
  }), "\uC720\uD6A8 ", /*#__PURE__*/React.createElement("strong", null, parsedRows.length, "\uD589")), parseErrors.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "upload-preview-stat upload-stat-fail"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 14,
    stroke: 2
  }), "\uAC74\uB108\uB700 ", /*#__PURE__*/React.createElement("strong", null, parseErrors.length, "\uD589")), /*#__PURE__*/React.createElement("span", {
    className: "upload-preview-hint"
  }, "\uCC98\uC74C 10\uD589 \uBBF8\uB9AC\uBCF4\uAE30")), /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap upload-preview-table"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, PREVIEW_COLS.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, parsedRows.slice(0, 10).map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, PREVIEW_COLS.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    className: c.key === 'id' ? 'mono' : ''
  }, c.render ? c.render(row[c.key]) : row[c.key] ?? '—')))))), parsedRows.length > 10 && /*#__PURE__*/React.createElement("div", {
    className: "upload-preview-more"
  }, "\u2026 \uC678 ", parsedRows.length - 10, "\uD589")), parseErrors.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "upload-parse-errors"
  }, /*#__PURE__*/React.createElement("strong", null, "\uAC74\uB108\uB6F4 \uD589 (", parseErrors.length, "\uAC1C)"), /*#__PURE__*/React.createElement("ul", null, parseErrors.slice(0, 5).map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, e.rowNum, "\uD589 \xB7 id:", e.id, " \xB7 ", e.msg)), parseErrors.length > 5 && /*#__PURE__*/React.createElement("li", null, "\u2026 \uC678 ", parseErrors.length - 5, "\uAC74"))), /*#__PURE__*/React.createElement("footer", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setUploadPhase('mapping')
  }, "\uB2E4\uC2DC \uC120\uD0DD"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: confirmUpload,
    disabled: parsedRows.length === 0
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 13,
    stroke: 2.2
  }), parsedRows.length.toLocaleString(), "\uAC1C \uC5C5\uB85C\uB4DC \uC2DC\uC791"))), uploadPhase === 'uploading' && /*#__PURE__*/React.createElement("div", {
    className: "upload-progress-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-spinner"
  }), /*#__PURE__*/React.createElement("strong", null, "Supabase\uC5D0 \uC800\uC7A5\uD558\uB294 \uC911\u2026"), /*#__PURE__*/React.createElement("div", {
    className: "upload-progress-bar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-progress-bar-fill",
    style: {
      width: uploadProgress.total > 0 ? `${Math.round(uploadProgress.done / uploadProgress.total * 100)}%` : '0%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "upload-progress-label"
  }, uploadProgress.done.toLocaleString(), " / ", uploadProgress.total.toLocaleString(), " \uCC98\uB9AC \uC911\u2026", uploadProgress.total > 0 && ` (${Math.round(uploadProgress.done / uploadProgress.total * 100)}%)`)), uploadPhase === 'result' && uploadResult && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "upload-result-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-result-stat upload-stat-ok"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 20,
    stroke: 2.4
  }), /*#__PURE__*/React.createElement("span", {
    className: "upload-result-n"
  }, uploadResult.ok), /*#__PURE__*/React.createElement("span", {
    className: "upload-result-label"
  }, "\uC131\uACF5")), uploadResult.fail > 0 && /*#__PURE__*/React.createElement("div", {
    className: "upload-result-stat upload-stat-fail"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 20,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("span", {
    className: "upload-result-n"
  }, uploadResult.fail), /*#__PURE__*/React.createElement("span", {
    className: "upload-result-label"
  }, "\uC2E4\uD328"))), uploadResult.failedRows.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "upload-parse-errors"
  }, /*#__PURE__*/React.createElement("strong", null, "\uC2E4\uD328\uD55C \uD589"), /*#__PURE__*/React.createElement("ul", null, uploadResult.failedRows.slice(0, 8).map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, "id:", e.id, " \xB7 ", e.name || '이름없음', " \xB7 ", e.msg)), uploadResult.failedRows.length > 8 && /*#__PURE__*/React.createElement("li", null, "\u2026 \uC678 ", uploadResult.failedRows.length - 8, "\uAC74"))), /*#__PURE__*/React.createElement("footer", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: resetUpload
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 13,
    stroke: 2
  }), "\uB2E4\uB978 \uD30C\uC77C \uC5C5\uB85C\uB4DC"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: closeUpload
  }, "\uB2EB\uAE30"))))));
};
Object.assign(window, {
  ChatPage,
  MyPage,
  AdminPage,
  AdminReportsTab,
  AdminSignupTab,
  AdminVisitorTab,
  AdminGrantsTab,
  GateModal
});

// ──────────────────────────────────────────────────────────
// TermsPage — 이용약관
// ──────────────────────────────────────────────────────────
const TermsPage = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "legal-page-container"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "legal-page-title"
  }, "\uC774\uC6A9\uC57D\uAD00"), /*#__PURE__*/React.createElement("p", {
    className: "legal-page-meta"
  }, "\uC2DC\uD589\uC77C: 2026\uB144 5\uC6D4 6\uC77C", /*#__PURE__*/React.createElement("br", null), "\uCD5C\uC885 \uC218\uC815\uC77C: 2026\uB144 5\uC6D4 6\uC77C"), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C1\uC870 (\uBAA9\uC801)"), /*#__PURE__*/React.createElement("p", null, "\uBCF8 \uC57D\uAD00\uC740 \uC8FC\uC2DD\uD68C\uC0AC \uC62C\uBDF0\uCF54\uB9AC\uC544(\uC774\uD558 \"\uD68C\uC0AC\")\uAC00 \uC81C\uACF5\uD558\uB294 \uACF5\uC7A5\uB9E4\uCE6D(FactoryMatch, \uC774\uD558 \"\uC11C\uBE44\uC2A4\")\uC758 \uC774\uC6A9 \uC870\uAC74 \uBC0F \uC808\uCC28, \uD68C\uC0AC\uC640 \uC774\uC6A9\uC790\uC758 \uAD8C\uB9AC, \uC758\uBB34 \uBC0F \uCC45\uC784 \uC0AC\uD56D\uC744 \uADDC\uC815\uD568\uC744 \uBAA9\uC801\uC73C\uB85C \uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C2\uC870 (\uC815\uC758)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\"\uC11C\uBE44\uC2A4\"\uB780 \uD68C\uC0AC\uAC00 \uC81C\uACF5\uD558\uB294 \uACF5\uC7A5\uB9E4\uCE6D(FactoryMatch) \uC6F9\uC0AC\uC774\uD2B8 \uBC0F \uAD00\uB828 \uBD80\uAC00 \uC11C\uBE44\uC2A4 \uC77C\uCCB4\uB97C \uB9D0\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\"\uC774\uC6A9\uC790\"\uB780 \uBCF8 \uC57D\uAD00\uC5D0 \uB530\uB77C \uC11C\uBE44\uC2A4\uB97C \uC774\uC6A9\uD558\uB294 \uD68C\uC6D0 \uBC0F \uBE44\uD68C\uC6D0\uC744 \uB9D0\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\"\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\"\uB780 \uACF5\uACF5\uB370\uC774\uD130\uD3EC\uD138 \uB4F1 \uACF5\uAC1C\uB41C \uC815\uBCF4\uB97C \uAE30\uBC18\uC73C\uB85C \uBCF8 \uC11C\uBE44\uC2A4\uC5D0 \uB4F1\uB85D\uB41C \uAD6D\uB0B4 \uC81C\uC870\uC5C5\uCCB4\uC758 \uC0AC\uC5C5\uC790 \uC815\uBCF4\uB97C \uB9D0\uD569\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C3\uC870 (\uC11C\uBE44\uC2A4\uC758 \uBAA9\uC801 \uBC0F \uB0B4\uC6A9)"), /*#__PURE__*/React.createElement("p", null, "\uBCF8 \uC11C\uBE44\uC2A4\uB294 \uB2E4\uC74C \uBAA9\uC801\uC744 \uC704\uD574 \uC6B4\uC601\uB429\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uAD6D\uB0B4 \uC81C\uC870\uC5C5\uCCB4\uC640 \uBC1C\uC8FC \uAE30\uC5C5 \uAC04 B2B \uAC70\uB798 \uB9E4\uCE6D"), /*#__PURE__*/React.createElement("li", null, "\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4 \uAC80\uC0C9 \uBC0F \uBE44\uAD50 \uC11C\uBE44\uC2A4 \uC81C\uACF5"), /*#__PURE__*/React.createElement("li", null, "\uACAC\uC801 \uC694\uCCAD(RFQ) \uBC0F \uAC70\uB798 \uC5F0\uACB0 \uC9C0\uC6D0"), /*#__PURE__*/React.createElement("li", null, "\uAC70\uB798 \uC2E0\uB8B0\uB3C4 \uAC80\uC99D\uC744 \uC704\uD55C \uC0AC\uC5C5\uC790 \uC815\uBCF4 \uC81C\uACF5")), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC704 \uBAA9\uC801 \uC678 \uBCF8 \uC11C\uBE44\uC2A4\uC5D0\uC11C \uC81C\uACF5\uB418\uB294 \uC815\uBCF4\uB97C \uB9C8\uCF00\uD305 \uB4F1 \uB2E4\uB978 \uBAA9\uC801\uC73C\uB85C \uC0AC\uC6A9\uD558\uB294 \uAC83\uC744 \uAE08\uC9C0\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C4\uC870 (\uC57D\uAD00\uC758 \uD6A8\uB825 \uBC0F \uBCC0\uACBD)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC57D\uAD00\uC740 \uC11C\uBE44\uC2A4\uB97C \uC774\uC6A9\uD558\uB294 \uBAA8\uB4E0 \uC774\uC6A9\uC790\uC5D0\uAC8C \uADF8 \uD6A8\uB825\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uAC00 \uBCF8 \uC11C\uBE44\uC2A4\uB97C \uC774\uC6A9\uD558\uB294 \uD589\uC704\uB294 \uBCF8 \uC57D\uAD00\uC5D0 \uB3D9\uC758\uD55C \uAC83\uC73C\uB85C \uAC04\uC8FC\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uB294 \uAD00\uB828 \uBC95\uB839\uC744 \uC704\uBC30\uD558\uC9C0 \uC54A\uB294 \uBC94\uC704\uC5D0\uC11C \uBCF8 \uC57D\uAD00\uC744 \uBCC0\uACBD\uD560 \uC218 \uC788\uC73C\uBA70, \uBCC0\uACBD\uB41C \uC57D\uAD00\uC740 \uC11C\uBE44\uC2A4 \uB0B4 \uACF5\uC9C0 \uD6C4 \uD6A8\uB825\uC774 \uBC1C\uC0DD\uD569\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C5\uC870 (\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uC758 \uCD9C\uCC98 \uBC0F \uD65C\uC6A9)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC11C\uBE44\uC2A4\uC5D0 \uB4F1\uB85D\uB41C \uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uB294 \uB2E4\uC74C\uC758 \uACF5\uAC1C \uB370\uC774\uD130\uB97C \uAE30\uBC18\uC73C\uB85C \uD569\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uACF5\uACF5\uB370\uC774\uD130\uD3EC\uD138(data.go.kr)\uC5D0 \uACF5\uAC1C\uB41C \uACF5\uC7A5 \uB4F1\uB85D \uC815\uBCF4"), /*#__PURE__*/React.createElement("li", null, "\uAD6D\uC138\uCCAD \uC0AC\uC5C5\uC790\uB4F1\uB85D\uC815\uBCF4 \uC9C4\uC704\uD655\uC778 \uBC0F \uC0C1\uD0DC\uC870\uD68C \uC11C\uBE44\uC2A4"), /*#__PURE__*/React.createElement("li", null, "\uAE08\uC735\uC704\uC6D0\uD68C \uAE30\uC5C5 \uAE30\uBCF8\uC815\uBCF4 \uBC0F \uC7AC\uBB34\uC815\uBCF4"), /*#__PURE__*/React.createElement("li", null, "\uAC01 \uC9C0\uBC29\uC790\uCE58\uB2E8\uCCB4\uAC00 \uACF5\uAC1C\uD55C \uACF5\uC7A5 \uC815\uBCF4"))), /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC11C\uBE44\uC2A4\uC758 \uC815\uBCF4\uB294 \uAC70\uB798 \uC2E0\uB8B0\uB3C4 \uAC80\uC99D\uC744 \uC704\uD55C \uCC38\uACE0 \uC790\uB8CC\uC774\uBA70, \uBC95\uC801 \uD6A8\uB825\uC774 \uC788\uB294 \uC99D\uBE59 \uC790\uB8CC\uAC00 \uC544\uB2D9\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uB294 \uC815\uBCF4\uC758 \uC815\uD655\uC131\uC744 \uC704\uD574 \uC815\uAE30\uC801\uC73C\uB85C \uB370\uC774\uD130\uB97C \uAC31\uC2E0\uD558\uB098, \uC2E4\uC2DC\uAC04 \uC815\uD655\uC131\uC744 \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C6\uC870 (\uC774\uC6A9\uC790\uC758 \uC758\uBB34)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uB294 \uBCF8 \uC11C\uBE44\uC2A4\uC5D0\uC11C \uC81C\uACF5\uBC1B\uC740 \uC815\uBCF4\uB97C \uB2E4\uC74C \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9\uD574\uC57C \uD569\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "B2B \uC81C\uC870 \uAC70\uB798 \uAC80\uD1A0 \uBC0F \uC9C4\uD589"), /*#__PURE__*/React.createElement("li", null, "\uAC70\uB798 \uC0C1\uB300\uBC29\uC758 \uC2E0\uB8B0\uB3C4 \uAC80\uC99D"))), /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uB294 \uBCF8 \uC11C\uBE44\uC2A4\uC5D0\uC11C \uC5BB\uC740 \uC815\uBCF4\uB97C \uB2E4\uC74C \uD589\uC704\uC5D0 \uC0AC\uC6A9\uD574\uC11C\uB294 \uC548 \uB429\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uBB34\uB2E8 \uB9C8\uCF00\uD305, \uAD11\uACE0\uC131 \uBA54\uC2DC\uC9C0 \uBC1C\uC1A1, \uC2A4\uD338 \uD589\uC704"), /*#__PURE__*/React.createElement("li", null, "\uC81C3\uC790\uC5D0\uAC8C \uC815\uBCF4\uB97C \uBB34\uB2E8 \uC81C\uACF5, \uD310\uB9E4, \uC7AC\uBC30\uD3EC"), /*#__PURE__*/React.createElement("li", null, "\uBC95\uB839 \uB610\uB294 \uACF5\uC11C\uC591\uC18D\uC5D0 \uC704\uBC18\uB418\uB294 \uD589\uC704"), /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC \uB610\uB294 \uC81C3\uC790\uC758 \uAD8C\uB9AC\uB97C \uCE68\uD574\uD558\uB294 \uD589\uC704"))), /*#__PURE__*/React.createElement("li", null, "\uC704 \uC758\uBB34\uB97C \uC704\uBC18\uD55C \uC774\uC6A9\uC790\uB294 \uADF8\uB85C \uC778\uD574 \uBC1C\uC0DD\uD55C \uBAA8\uB4E0 \uBC95\uC801 \uCC45\uC784\uC744 \uBD80\uB2F4\uD558\uBA70, \uD68C\uC0AC\uB294 \uD574\uB2F9 \uC774\uC6A9\uC790\uC758 \uC11C\uBE44\uC2A4 \uC774\uC6A9\uC744 \uC81C\uD55C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C7\uC870 (\uC815\uBCF4\uC758 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uC758 \uC815\uC815 \uB610\uB294 \uC0AD\uC81C\uB97C \uC6D0\uD558\uB294 \uACBD\uC6B0, \uB2E4\uC74C \uBC29\uBC95\uC73C\uB85C \uC694\uCCAD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC0AC\uC774\uD2B8 \uB0B4 \uC2E0\uACE0 \uD3FC: [\uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD] (\uC11C\uBE44\uC2A4 \uB0B4 \uBCC4\uB3C4 \uD398\uC774\uC9C0)"), /*#__PURE__*/React.createElement("li", null, "\uC774\uBA54\uC77C: privacy@avk-agency.com"))), /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uB294 \uC694\uCCAD\uC744 \uC811\uC218\uD55C \uD6C4 \uC601\uC5C5\uC77C \uAE30\uC900 5\uC77C \uC774\uB0B4\uC5D0 \uAC80\uD1A0 \uBC0F \uCC98\uB9AC\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uB2E4\uC74C\uC758 \uACBD\uC6B0 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD\uC774 \uAC70\uBD80\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uBC95\uB839\uC5D0\uC11C \uACF5\uAC1C\uB97C \uC758\uBB34\uD654\uD55C \uC815\uBCF4"), /*#__PURE__*/React.createElement("li", null, "\uC774\uBBF8 \uACF5\uACF5\uB370\uC774\uD130\uB85C \uACF5\uAC1C\uB41C \uC815\uBCF4 (\uC774 \uACBD\uC6B0 \uC6D0\uBCF8 \uCD9C\uCC98\uC5D0 \uC815\uC815 \uC694\uCCAD \uC548\uB0B4)"), /*#__PURE__*/React.createElement("li", null, "\uC694\uCCAD\uC790\uAC00 \uC815\uBCF4 \uC8FC\uCCB4\uC784\uC744 \uC99D\uBA85\uD558\uC9C0 \uBABB\uD558\uB294 \uACBD\uC6B0"))))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C8\uC870 (\uC11C\uBE44\uC2A4\uC758 \uC81C\uACF5 \uBC0F \uC911\uB2E8)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uB294 \uC5F0\uC911\uBB34\uD734, 1\uC77C 24\uC2DC\uAC04 \uC11C\uBE44\uC2A4\uB97C \uC81C\uACF5\uD568\uC744 \uC6D0\uCE59\uC73C\uB85C \uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uB2E4\uC74C\uC758 \uACBD\uC6B0 \uC0AC\uC804 \uACF5\uC9C0 \uC5C6\uC774 \uC11C\uBE44\uC2A4\uAC00 \uC77C\uC2DC \uC911\uB2E8\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC2DC\uC2A4\uD15C \uC810\uAC80, \uBCF4\uC218, \uAD50\uCCB4"), /*#__PURE__*/React.createElement("li", null, "\uCC9C\uC7AC\uC9C0\uBCC0, \uC815\uC804, \uD1B5\uC2E0 \uC7A5\uC560 \uB4F1 \uBD88\uAC00\uD56D\uB825\uC801 \uC0AC\uC720"), /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uAC00 \uD569\uB9AC\uC801\uC73C\uB85C \uD310\uB2E8\uD55C \uC0AC\uC815\uC0C1 \uC11C\uBE44\uC2A4 \uC81C\uACF5\uC774 \uBD88\uAC00\uB2A5\uD55C \uACBD\uC6B0"))))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C9\uC870 (\uCC45\uC784\uC758 \uC81C\uD55C)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uB294 \uBCF8 \uC11C\uBE44\uC2A4\uB97C \uD1B5\uD574 \uC81C\uACF5\uB418\uB294 \uC815\uBCF4\uC758 \uC815\uD655\uC131, \uC644\uC804\uC131\uC5D0 \uB300\uD574 \uD569\uB9AC\uC801\uC778 \uB178\uB825\uC744 \uB2E4\uD558\uB098, \uC815\uBCF4\uC758 \uC808\uB300\uC801 \uC815\uD655\uC131\uC744 \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uAC00 \uBCF8 \uC11C\uBE44\uC2A4\uC758 \uC815\uBCF4\uB97C \uC2E0\uB8B0\uD558\uC5EC \uBC1C\uC0DD\uD55C \uC190\uD574\uC5D0 \uB300\uD574 \uD68C\uC0AC\uB294 \uB2E4\uC74C\uC758 \uACBD\uC6B0 \uCC45\uC784\uC744 \uC9C0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uACF5\uACF5\uB370\uC774\uD130\uC758 \uC6D0\uBCF8 \uC790\uCCB4\uC5D0 \uC624\uB958\uAC00 \uC788\uB294 \uACBD\uC6B0"), /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uAC00 \uC815\uBCF4\uB97C \uBCF8 \uC57D\uAD00\uC758 \uBAA9\uC801 \uC678\uB85C \uC0AC\uC6A9\uD558\uC5EC \uBC1C\uC0DD\uD55C \uC190\uD574"), /*#__PURE__*/React.createElement("li", null, "\uAC70\uB798 \uB2F9\uC0AC\uC790 \uAC04 \uBD84\uC7C1\uC5D0 \uD68C\uC0AC\uAC00 \uAC1C\uC785\uD558\uC9C0 \uC54A\uC740 \uACBD\uC6B0"))), /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC11C\uBE44\uC2A4\uB294 \uAC70\uB798 \uB9E4\uCE6D \uD50C\uB7AB\uD3FC\uC774\uBA70, \uD68C\uC0AC\uB294 \uC774\uC6A9\uC790 \uAC04 \uAC70\uB798\uC758 \uB2F9\uC0AC\uC790\uAC00 \uC544\uB2D9\uB2C8\uB2E4. \uAC70\uB798 \uACB0\uACFC\uC5D0 \uB300\uD55C \uCC45\uC784\uC740 \uAC70\uB798 \uB2F9\uC0AC\uC790\uC5D0\uAC8C \uC788\uC2B5\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C10\uC870 (\uC9C0\uC801\uC7AC\uC0B0\uAD8C)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC11C\uBE44\uC2A4\uC758 \uB514\uC790\uC778, \uB85C\uACE0, \uCF58\uD150\uCE20 \uAD6C\uC131, \uB9E4\uCE6D \uC54C\uACE0\uB9AC\uC998 \uB4F1\uC5D0 \uB300\uD55C \uC800\uC791\uAD8C\uC740 \uD68C\uC0AC\uC5D0 \uADC0\uC18D\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uB294 \uD68C\uC0AC\uC758 \uC0AC\uC804 \uB3D9\uC758 \uC5C6\uC774 \uBCF8 \uC11C\uBE44\uC2A4\uC758 \uCF58\uD150\uCE20\uB97C \uBCF5\uC81C, \uBC30\uD3EC, \uC0C1\uC5C5\uC801 \uC774\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C11\uC870 (\uBD84\uC7C1\uC758 \uD574\uACB0)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC57D\uAD00\uACFC \uAD00\uB828\uB41C \uBD84\uC7C1\uC740 \uB300\uD55C\uBBFC\uAD6D \uBC95\uB839\uC744 \uC801\uC6A9\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uC11C\uBE44\uC2A4 \uC774\uC6A9\uC73C\uB85C \uBC1C\uC0DD\uD55C \uBD84\uC7C1\uC758 \uAD00\uD560 \uBC95\uC6D0\uC740 \uD68C\uC0AC \uBCF8\uC0AC \uC18C\uC7AC\uC9C0 \uAD00\uD560 \uBC95\uC6D0\uC73C\uB85C \uD569\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C12\uC870 (\uD68C\uC0AC \uC815\uBCF4)"), /*#__PURE__*/React.createElement("ul", {
    className: "legal-company-info"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uD68C\uC0AC\uBA85:"), " \uC8FC\uC2DD\uD68C\uC0AC \uC62C\uBDF0\uCF54\uB9AC\uC544 (AVK)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uC11C\uBE44\uC2A4\uBA85:"), " \uACF5\uC7A5\uB9E4\uCE6D(FactoryMatch)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uB300\uD45C \uC774\uBA54\uC77C:"), " ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:privacy@avk-agency.com"
  }, "privacy@avk-agency.com")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uC6F9\uC0AC\uC774\uD2B8:"), " [\uBCF8 \uC11C\uBE44\uC2A4 URL]"))), /*#__PURE__*/React.createElement("p", {
    className: "legal-page-footer"
  }, "\uBCF8 \uC57D\uAD00\uC740 2026\uB144 5\uC6D4 6\uC77C\uBD80\uD130 \uC2DC\uD589\uB429\uB2C8\uB2E4.")));
};

// ──────────────────────────────────────────────────────────
// PrivacyPage — 개인정보처리방침
// ──────────────────────────────────────────────────────────
const PrivacyPage = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "legal-page-container"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "legal-page-title"
  }, "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68"), /*#__PURE__*/React.createElement("p", {
    className: "legal-page-meta"
  }, "\uC2DC\uD589\uC77C: 2026\uB144 5\uC6D4 6\uC77C", /*#__PURE__*/React.createElement("br", null), "\uCD5C\uC885 \uC218\uC815\uC77C: 2026\uB144 5\uC6D4 6\uC77C"), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C1\uC870 (\uCD1D\uCE59)"), /*#__PURE__*/React.createElement("p", null, "\uC8FC\uC2DD\uD68C\uC0AC \uC62C\uBDF0\uCF54\uB9AC\uC544(\uC774\uD558 \"\uD68C\uC0AC\")\uB294 \uACF5\uC7A5\uB9E4\uCE6D(FactoryMatch, \uC774\uD558 \"\uC11C\uBE44\uC2A4\")\uC744 \uC6B4\uC601\uD568\uC5D0 \uC788\uC5B4 \uC774\uC6A9\uC790\uC758 \uAC1C\uC778\uC815\uBCF4\uB97C \uC911\uC694\uC2DC\uD558\uBA70, \u300C\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638\uBC95\u300D \uB4F1 \uAD00\uB828 \uBC95\uB839\uC744 \uC900\uC218\uD558\uAE30 \uC704\uD558\uC5EC \uB178\uB825\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uBCF8 \uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68\uC740 \uD68C\uC0AC\uAC00 \uC81C\uACF5\uD558\uB294 \uC11C\uBE44\uC2A4 \uC774\uC6A9\uACFC \uAD00\uB828\uD558\uC5EC \uC774\uC6A9\uC790\uC758 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uC5D0 \uAD00\uD55C \uC0AC\uD56D\uC744 \uADDC\uC815\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C2\uC870 (\uC218\uC9D1\uD558\uB294 \uAC1C\uC778\uC815\uBCF4\uC758 \uD56D\uBAA9 \uBC0F \uC218\uC9D1 \uBC29\uBC95)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uB2E4\uC74C \uD56D\uBAA9\uC744 \uC218\uC9D1\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '15px',
      marginTop: '16px',
      marginBottom: '8px',
      fontWeight: '600'
    }
  }, "1. \uC790\uB3D9 \uC218\uC9D1 \uD56D\uBAA9"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC811\uC18D IP \uC8FC\uC18C, \uCFE0\uD0A4, \uC811\uC18D \uC77C\uC2DC, \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uAE30\uB85D"), /*#__PURE__*/React.createElement("li", null, "\uBE0C\uB77C\uC6B0\uC800 \uC885\uB958, OS, \uB514\uBC14\uC774\uC2A4 \uC815\uBCF4")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '15px',
      marginTop: '16px',
      marginBottom: '8px',
      fontWeight: '600'
    }
  }, "2. \uACAC\uC801 \uC694\uCCAD(RFQ) \uC2DC \uC218\uC9D1 \uD56D\uBAA9"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uD544\uC218: \uD68C\uC0AC\uBA85, \uB2F4\uB2F9\uC790\uBA85, \uC5F0\uB77D\uCC98(\uC774\uBA54\uC77C \uB610\uB294 \uC804\uD654\uBC88\uD638), \uC694\uCCAD \uB0B4\uC6A9"), /*#__PURE__*/React.createElement("li", null, "\uC120\uD0DD: \uCCA8\uBD80 \uD30C\uC77C, \uCD94\uAC00 \uC694\uAD6C\uC0AC\uD56D")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '15px',
      marginTop: '16px',
      marginBottom: '8px',
      fontWeight: '600'
    }
  }, "3. \uC2E0\uACE0\xB7\uBB38\uC758 \uC2DC \uC218\uC9D1 \uD56D\uBAA9"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uD544\uC218: \uD68C\uC0AC\uBA85, \uB2F4\uB2F9\uC790\uBA85, \uC5F0\uB77D\uCC98, \uC2E0\uACE0 \uC0AC\uC720"), /*#__PURE__*/React.createElement("li", null, "\uC120\uD0DD: \uC99D\uBE59 \uC790\uB8CC, \uCD94\uAC00 \uC758\uACAC")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '15px',
      marginTop: '16px',
      marginBottom: '8px',
      fontWeight: '600'
    }
  }, "4. \uC218\uC9D1 \uBC29\uBC95"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uAC00 \uC11C\uBE44\uC2A4 \uD654\uBA74\uC5D0\uC11C \uC9C1\uC811 \uC785\uB825"), /*#__PURE__*/React.createElement("li", null, "\uC774\uBA54\uC77C\uC744 \uD1B5\uD55C \uC218\uC2E0"), /*#__PURE__*/React.createElement("li", null, "\uC811\uC18D \uC2DC \uC790\uB3D9 \uC0DD\uC131\uB418\uB294 \uC815\uBCF4\uC758 \uC790\uB3D9 \uC218\uC9D1"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C3\uC870 (\uAC1C\uC778\uC815\uBCF4\uC758 \uCC98\uB9AC \uBAA9\uC801)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC218\uC9D1\uD55C \uAC1C\uC778\uC815\uBCF4\uB97C \uB2E4\uC74C \uBAA9\uC801\uC5D0\uB9CC \uC0AC\uC6A9\uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uACAC\uC801 \uC694\uCCAD(RFQ) \uCC98\uB9AC \uBC0F \uB9E4\uCE6D \uC11C\uBE44\uC2A4 \uC81C\uACF5"), /*#__PURE__*/React.createElement("li", null, "\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uC758 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD \uCC98\uB9AC"), /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790 \uBB38\uC758 \uC751\uB300 \uBC0F \uACE0\uAC1D \uC9C0\uC6D0"), /*#__PURE__*/React.createElement("li", null, "\uC11C\uBE44\uC2A4 \uC774\uC6A9 \uD1B5\uACC4 \uBD84\uC11D \uBC0F \uD488\uC9C8 \uAC1C\uC120 (\uAC1C\uC778 \uC2DD\uBCC4 \uBD88\uAC00\uB2A5\uD55C \uD615\uD0DC)"), /*#__PURE__*/React.createElement("li", null, "\uBC95\uB839\uC0C1 \uC758\uBB34 \uC774\uD589")), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC704 \uBAA9\uC801 \uC678 \uB2E4\uB978 \uBAA9\uC801\uC73C\uB85C \uAC1C\uC778\uC815\uBCF4\uB97C \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC73C\uBA70, \uC0AC\uC6A9 \uBAA9\uC801\uC774 \uBCC0\uACBD\uB420 \uACBD\uC6B0 \uC0AC\uC804\uC5D0 \uB3D9\uC758\uB97C \uBC1B\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C4\uC870 (\uAC1C\uC778\uC815\uBCF4\uC758 \uBCF4\uC720 \uBC0F \uC774\uC6A9 \uAE30\uAC04)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9 \uBAA9\uC801\uC774 \uB2EC\uC131\uB41C \uD6C4\uC5D0\uB294 \uD574\uB2F9 \uC815\uBCF4\uB97C \uC9C0\uCCB4 \uC5C6\uC774 \uD30C\uAE30\uD569\uB2C8\uB2E4. \uB2E8, \uB2E4\uC74C\uC758 \uACBD\uC6B0 \uAD00\uB828 \uBC95\uB839\uC5D0 \uB530\uB77C \uC77C\uC815 \uAE30\uAC04 \uBCF4\uAD00\uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uACAC\uC801 \uC694\uCCAD \uAE30\uB85D:"), " \uCC98\uB9AC \uC644\uB8CC \uD6C4 3\uB144 (\uC804\uC790\uC0C1\uAC70\uB798\uBC95)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uC774\uC6A9\uC790 \uBB38\uC758\xB7\uC2E0\uACE0 \uAE30\uB85D:"), " \uCC98\uB9AC \uC644\uB8CC \uD6C4 3\uB144 (\uC804\uC790\uC0C1\uAC70\uB798\uBC95)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uC811\uC18D \uB85C\uADF8:"), " 3\uAC1C\uC6D4 (\uD1B5\uC2E0\uBE44\uBC00\uBCF4\uD638\uBC95)"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uBD80\uC815 \uC774\uC6A9 \uAE30\uB85D:"), " 1\uB144"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C5\uC870 (\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uC758 \uCD9C\uCC98 \uBC0F \uCC98\uB9AC)"), /*#__PURE__*/React.createElement("p", null, "\uBCF8 \uC11C\uBE44\uC2A4\uC5D0 \uD45C\uC2DC\uB418\uB294 \uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uB294 \uB2E4\uC74C \uACF5\uAC1C \uB370\uC774\uD130\uB97C \uAE30\uBC18\uC73C\uB85C \uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uACF5\uACF5\uB370\uC774\uD130\uD3EC\uD138(data.go.kr)\uC5D0 \uACF5\uAC1C\uB41C \uACF5\uC7A5 \uB4F1\uB85D \uC815\uBCF4"), /*#__PURE__*/React.createElement("li", null, "\uAD6D\uC138\uCCAD \uC0AC\uC5C5\uC790\uB4F1\uB85D\uC815\uBCF4 \uC9C4\uC704\uD655\uC778 \uBC0F \uC0C1\uD0DC\uC870\uD68C \uC11C\uBE44\uC2A4"), /*#__PURE__*/React.createElement("li", null, "\uAE08\uC735\uC704\uC6D0\uD68C \uAE30\uC5C5 \uAE30\uBCF8\uC815\uBCF4 \uBC0F \uC7AC\uBB34\uC815\uBCF4"), /*#__PURE__*/React.createElement("li", null, "\uAC01 \uC9C0\uBC29\uC790\uCE58\uB2E8\uCCB4\uAC00 \uACF5\uAC1C\uD55C \uACF5\uC7A5 \uC815\uBCF4")), /*#__PURE__*/React.createElement("p", null, "\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uB294 \u300C\uACF5\uACF5\uB370\uC774\uD130\uC758 \uC81C\uACF5 \uBC0F \uC774\uC6A9 \uD65C\uC131\uD654\uC5D0 \uAD00\uD55C \uBC95\uB960\u300D\uC5D0 \uB530\uB77C \uACF5\uAC1C\uB41C \uC815\uBCF4\uC774\uBA70, B2B \uAC70\uB798 \uB9E4\uCE6D \uBC0F \uC2E0\uB8B0\uB3C4 \uAC80\uC99D \uBAA9\uC801\uC73C\uB85C\uB9CC \uD65C\uC6A9\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uB2E4\uC74C\uACFC \uAC19\uC740 \uC815\uBCF4\uB97C \uCC98\uB9AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC8FC\uBBFC\uB4F1\uB85D\uBC88\uD638"), /*#__PURE__*/React.createElement("li", null, "\uAC1C\uC778 \uD734\uB300\uD3F0 \uBC88\uD638 (\uBC95\uC778 \uB300\uD45C \uC5F0\uB77D\uCC98\uAC00 \uC544\uB2CC \uACBD\uC6B0)"), /*#__PURE__*/React.createElement("li", null, "\uB300\uD45C\uC790 \uAC1C\uC778 \uAC70\uC8FC\uC9C0 \uC8FC\uC18C"), /*#__PURE__*/React.createElement("li", null, "\uAE30\uD0C0 \uAC1C\uC778 \uC2DD\uBCC4 \uAC00\uB2A5\uD55C \uBBFC\uAC10 \uC815\uBCF4"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C6\uC870 (\uAC1C\uC778\uC815\uBCF4\uC758 \uC81C3\uC790 \uC81C\uACF5)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC774\uC6A9\uC790\uC758 \uAC1C\uC778\uC815\uBCF4\uB97C \uC81C3\uC790\uC5D0\uAC8C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uB2E8, \uB2E4\uC74C\uC758 \uACBD\uC6B0\uC5D0\uB294 \uC608\uC678\uB85C \uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uC774\uC6A9\uC790\uAC00 \uC0AC\uC804\uC5D0 \uB3D9\uC758\uD55C \uACBD\uC6B0"), /*#__PURE__*/React.createElement("li", null, "\uBC95\uB839\uC5D0 \uC758\uD574 \uC81C\uACF5\uC774 \uC758\uBB34\uD654\uB41C \uACBD\uC6B0"), /*#__PURE__*/React.createElement("li", null, "\uACAC\uC801 \uC694\uCCAD \uC2DC \uC774\uC6A9\uC790\uAC00 \uC120\uD0DD\uD55C \uC81C\uC870\uC5C5\uCCB4\uC5D0 \uD55C\uD558\uC5EC \uACAC\uC801 \uCC98\uB9AC\uC5D0 \uD544\uC694\uD55C \uCD5C\uC18C\uD55C\uC758 \uC815\uBCF4 \uC81C\uACF5"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C7\uC870 (\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uC758 \uC704\uD0C1)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC11C\uBE44\uC2A4 \uC6B4\uC601\uC744 \uC704\uD574 \uB2E4\uC74C\uACFC \uAC19\uC774 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uB97C \uC704\uD0C1\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", {
    className: "legal-company-info"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Resend (resend.com):"), " \uC774\uBA54\uC77C \uBC1C\uC1A1 \uC11C\uBE44\uC2A4"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Supabase:"), " \uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uC6B4\uC601 \uBC0F \uD638\uC2A4\uD305"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Netlify:"), " \uC6F9\uC0AC\uC774\uD2B8 \uD638\uC2A4\uD305 \uBC0F \uC11C\uBC84\uB9AC\uC2A4 \uD568\uC218 \uC2E4\uD589"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Anthropic (anthropic.com):"), " AI \uB9E4\uCE6D \uBD84\uC11D \uC11C\uBE44\uC2A4")), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC704\uD0C1 \uACC4\uC57D \uC2DC \uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638\uC640 \uAD00\uB828\uB41C \uC758\uBB34\uB97C \uBA85\uC2DC\uD558\uACE0, \uC704\uD0C1 \uC5C5\uBB34\uB97C \uC548\uC804\uD558\uAC8C \uAD00\uB9AC\uD558\uAE30 \uC704\uD574 \uD544\uC694\uD55C \uC0AC\uD56D\uC744 \uADDC\uC815\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C8\uC870 (\uC774\uC6A9\uC790\uC758 \uAD8C\uB9AC\uC640 \uD589\uC0AC \uBC29\uBC95)"), /*#__PURE__*/React.createElement("p", null, "\uC774\uC6A9\uC790\uB294 \uB2E4\uC74C \uAD8C\uB9AC\uB97C \uD589\uC0AC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uAC1C\uC778\uC815\uBCF4 \uC5F4\uB78C \uC694\uAD6C"), /*#__PURE__*/React.createElement("li", null, "\uAC1C\uC778\uC815\uBCF4 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uAD6C"), /*#__PURE__*/React.createElement("li", null, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC \uC815\uC9C0 \uC694\uAD6C"), /*#__PURE__*/React.createElement("li", null, "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uC5D0 \uB300\uD55C \uB3D9\uC758 \uCCA0\uD68C")), /*#__PURE__*/React.createElement("p", null, "\uC704 \uAD8C\uB9AC \uD589\uC0AC\uB294 \uB2E4\uC74C \uBC29\uBC95\uC73C\uB85C \uAC00\uB2A5\uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uC0AC\uC774\uD2B8 \uB0B4 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD \uD3FC (\uC11C\uBE44\uC2A4 \uB0B4 \uBCC4\uB3C4 \uD398\uC774\uC9C0)"), /*#__PURE__*/React.createElement("li", null, "\uC774\uBA54\uC77C: ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:privacy@avk-agency.com"
  }, "privacy@avk-agency.com"))), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC694\uCCAD \uC811\uC218 \uD6C4 \uC601\uC5C5\uC77C \uAE30\uC900 5\uC77C \uC774\uB0B4\uC5D0 \uCC98\uB9AC\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C9\uC870 (\uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD)"), /*#__PURE__*/React.createElement("p", null, "\uBCF8 \uC11C\uBE44\uC2A4\uC5D0 \uAC8C\uC2DC\uB41C \uC81C\uC870\uC5C5\uCCB4 \uC815\uBCF4\uC758 \uC815\uC815 \uB610\uB294 \uC0AD\uC81C\uB97C \uC6D0\uD558\uB294 \uACBD\uC6B0 \uB2E4\uC74C \uBC29\uBC95\uC73C\uB85C \uC694\uCCAD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uC0AC\uC774\uD2B8 \uB0B4 \uC2E0\uACE0 \uD3FC: \uBCC4\uB3C4 \uD398\uC774\uC9C0\uC5D0\uC11C \uC2E0\uCCAD"), /*#__PURE__*/React.createElement("li", null, "\uC774\uBA54\uC77C: ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:privacy@avk-agency.com"
  }, "privacy@avk-agency.com"))), /*#__PURE__*/React.createElement("p", null, "\uC694\uCCAD \uC2DC \uB2E4\uC74C \uC815\uBCF4\uB97C \uD3EC\uD568\uD574\uC8FC\uC138\uC694:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "\uD68C\uC0AC\uBA85 \uBC0F \uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638"), /*#__PURE__*/React.createElement("li", null, "\uC694\uCCAD \uC0AC\uC720 (\uC608: \uC815\uBCF4 \uC624\uB958, \uD3D0\uC5C5, \uC815\uBCF4 \uBE44\uACF5\uAC1C \uC694\uCCAD \uB4F1)"), /*#__PURE__*/React.createElement("li", null, "\uC694\uCCAD\uC790 \uC815\uBCF4 \uBC0F \uAD8C\uD55C \uC99D\uBE59 (\uD574\uB2F9 \uD68C\uC0AC \uAD00\uACC4\uC790 \uD655\uC778\uC6A9)")), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC694\uCCAD \uC811\uC218 \uD6C4 \uC601\uC5C5\uC77C \uAE30\uC900 5\uC77C \uC774\uB0B4 \uAC80\uD1A0\uD558\uC5EC \uCC98\uB9AC\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C10\uC870 (\uAC1C\uC778\uC815\uBCF4\uC758 \uC548\uC804\uC131 \uD655\uBCF4 \uC870\uCE58)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638\uB97C \uC704\uD574 \uB2E4\uC74C \uC870\uCE58\uB97C \uC2DC\uD589\uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uAD00\uB9AC\uC801 \uC870\uCE58:"), " \uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uCC45\uC784\uC790 \uC9C0\uC815, \uC815\uAE30\uC801\uC778 \uBCF4\uC548 \uAD50\uC721"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uAE30\uC220\uC801 \uC870\uCE58:"), " HTTPS \uC554\uD638\uD654 \uD1B5\uC2E0, \uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uC811\uADFC \uAD8C\uD55C \uAD00\uB9AC"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uBB3C\uB9AC\uC801 \uC870\uCE58:"), " \uC704\uD0C1 \uC11C\uBE44\uC2A4 \uC81C\uACF5\uC790(Supabase, Netlify \uB4F1)\uC758 \uBCF4\uC548 \uC778\uC99D \uD655\uC778"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C11\uC870 (\uCFE0\uD0A4\uC758 \uC6B4\uC601)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uC11C\uBE44\uC2A4 \uC81C\uACF5\uC744 \uC704\uD574 \uCFE0\uD0A4(Cookie)\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uC0AC\uC6A9 \uBAA9\uC801:"), " \uC774\uC6A9\uC790\uC758 \uAC80\uC0C9 \uAE30\uB85D \uC720\uC9C0, \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uBD84\uC11D"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uAC70\uBD80 \uBC29\uBC95:"), " \uBE0C\uB77C\uC6B0\uC800 \uC124\uC815\uC5D0\uC11C \uCFE0\uD0A4 \uC800\uC7A5 \uAC70\uBD80 \uAC00\uB2A5 (\uB2E8, \uC77C\uBD80 \uAE30\uB2A5 \uC774\uC6A9 \uC81C\uD55C \uAC00\uB2A5)"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C12\uC870 (\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uCC45\uC784\uC790)"), /*#__PURE__*/React.createElement("p", null, "\uD68C\uC0AC\uB294 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uC5D0 \uAD00\uD55C \uC5C5\uBB34\uB97C \uCD1D\uAD04\uD558\uC5EC \uCC45\uC784\uC9C0\uACE0, \uAD00\uB828 \uBD88\uB9CC \uCC98\uB9AC \uBC0F \uD53C\uD574 \uAD6C\uC81C\uB97C \uC704\uD574 \uB2E4\uC74C\uACFC \uAC19\uC774 \uCC45\uC784\uC790\uB97C \uC9C0\uC815\uD569\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", {
    className: "legal-company-info"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uD68C\uC0AC\uBA85:"), " \uC8FC\uC2DD\uD68C\uC0AC \uC62C\uBDF0\uCF54\uB9AC\uC544"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uCC45\uC784\uC790:"), " \uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uB2F4\uB2F9\uC790"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uC774\uBA54\uC77C:"), " ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:privacy@avk-agency.com"
  }, "privacy@avk-agency.com")))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C13\uC870 (\uAC1C\uC778\uC815\uBCF4 \uCE68\uD574 \uC2E0\uACE0)"), /*#__PURE__*/React.createElement("p", null, "\uAC1C\uC778\uC815\uBCF4 \uCE68\uD574\uC5D0 \uB300\uD55C \uC2E0\uACE0\uB098 \uC0C1\uB2F4\uC774 \uD544\uC694\uD55C \uACBD\uC6B0 \uB2E4\uC74C \uAE30\uAD00\uC5D0 \uBB38\uC758\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uAC1C\uC778\uC815\uBCF4\uBCF4\uD638 \uC885\uD569\uC9C0\uC6D0 \uD3EC\uD138:"), " privacy.go.kr / \uAD6D\uBC88\uC5C6\uC774 182"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uAC1C\uC778\uC815\uBCF4 \uBD84\uC7C1\uC870\uC815\uC704\uC6D0\uD68C:"), " kopico.go.kr / 1833-6972"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uB300\uAC80\uCC30\uCCAD \uC0AC\uC774\uBC84\uC218\uC0AC\uACFC:"), " spo.go.kr / 02-3480-3573"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "\uACBD\uCC30\uCCAD \uC0AC\uC774\uBC84\uC218\uC0AC\uAD6D:"), " ecrm.cyber.go.kr / \uAD6D\uBC88\uC5C6\uC774 182"))), /*#__PURE__*/React.createElement("section", {
    className: "legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "\uC81C14\uC870 (\uBC29\uCE68\uC758 \uBCC0\uACBD)"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, "\uBCF8 \uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68\uC740 \uC2DC\uD589\uC77C\uB85C\uBD80\uD130 \uC801\uC6A9\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("li", null, "\uBC95\uB839, \uC815\uCC45 \uB610\uB294 \uBCF4\uC548 \uAE30\uC220\uC758 \uBCC0\uACBD\uC5D0 \uB530\uB77C \uB0B4\uC6A9 \uCD94\uAC00\xB7\uC0AD\uC81C\xB7\uC218\uC815\uC774 \uC788\uC744 \uC2DC, \uC0AC\uC774\uD2B8 \uB0B4 \uACF5\uC9C0\uC0AC\uD56D\uC744 \uD1B5\uD574 \uC0AC\uC804\uC5D0 \uC54C\uB9BD\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement("p", {
    className: "legal-page-footer"
  }, "\uBCF8 \uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68\uC740 2026\uB144 5\uC6D4 6\uC77C\uBD80\uD130 \uC2DC\uD589\uB429\uB2C8\uB2E4.")));
};

// ReportPage — 정정·삭제 요청 / 신고 / 일반 문의
// ──────────────────────────────────────────────────────────
// AI 상담 페이지
// ──────────────────────────────────────────────────────────
const AI_INIT_MSG = {
  role: 'ai',
  text: '안녕하세요! 어떤 제품을 만들고 싶으신가요? 편하게 말씀해 주세요.'
};
const AiConsultPage = ({
  onOpenFactory,
  authed,
  onGate,
  factoryContext
}) => {
  const [messages, setMessages] = React.useState(() => {
    const saved = window._aiConsultSession?.messages;
    if (saved && saved.length > 0) return saved;
    return []; // 빈 배열로 시작 - 렌더링 시 표시 메시지 결정
  });
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [factories, setFactories] = React.useState(() => window._aiConsultSession?.factories || []);
  const [resolvedFactories, setResolvedFactories] = React.useState(() => window._aiConsultSession?.resolvedFactories || []);
  // factoryContext 변경 감지 - 처음 진입이든 전환이든 메시지 추가
  const prevFactoryIdRef = React.useRef(null); // 항상 null로 시작
  React.useEffect(() => {
    if (!factoryContext) return;
    if (prevFactoryIdRef.current === factoryContext.id) return;
    const isFirst = prevFactoryIdRef.current === null;
    prevFactoryIdRef.current = factoryContext.id;
    const msg = isFirst ? {
      role: 'ai',
      text: `${factoryContext.name}로 상담을 시작할게요. 어떤 점이 궁금하신가요?`
    } : {
      role: 'ai',
      text: `${factoryContext.name}로 변경되어 상담 이어갈게요. 어떤 점이 궁금하신가요?`
    };
    setMessages(prev => [...prev, msg]);
    if (!isFirst) {
      setFactories([]);
      setResolvedFactories([]);
    }
  }, [factoryContext?.id]);
  const msgsEndRef = React.useRef(null);
  const msgsContainerRef = React.useRef(null);

  // 마운트 시 window 스크롤 잠금 (AI 페이지는 내부 컨테이너만 스크롤)
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 메시지 변경 시 채팅 컨테이너 안에서만 스크롤 (window 전체 스크롤 방지)
  React.useEffect(() => {
    if (msgsContainerRef.current) {
      msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Fix 2: 상태가 바뀔 때마다 window에 저장
  React.useEffect(() => {
    window._aiConsultSession = {
      messages,
      factories,
      resolvedFactories,
      factoryContext
    };
  }, [messages, factories, resolvedFactories]);

  // 매칭된 factory id 목록이 바뀌면 Supabase에서 상세 조회
  React.useEffect(() => {
    if (factories.length === 0) {
      setResolvedFactories([]);
      return;
    }
    const ids = factories.map(f => f.id);
    // 이미 resolvedFactories에 동일 ids가 있으면 재조회 스킵
    const currentIds = resolvedFactories.map(r => r.id).sort().join(',');
    if (currentIds === [...ids].sort().join(',')) return;
    window._sb.from('factories').select('*').in('id', ids).then(({
      data
    }) => {
      if (!data) return;
      const ordered = ids.map(id => data.find(r => r.id === id)).filter(Boolean).map(r => window._dbRowToFactory(r));
      setResolvedFactories(ordered);
    });
  }, [factories]);
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    // 비로그인 시 사용자 메시지 3턴 초과하면 게이트 표시
    const userTurnCount = messages.filter(m => m.role === 'user').length;
    if (!authed && userTurnCount >= 3) {
      onGate?.('ai_consult');
      return;
    }
    window.logVisitor?.('ai_consult', {
      query: text
    });
    setInput('');
    const userMsg = {
      role: 'user',
      text
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    // messages 배열을 Claude API 형식으로 변환
    const apiMessages = nextMessages.filter(m => m !== AI_INIT_MSG).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    const fullApiMessages = [{
      role: 'assistant',
      content: AI_INIT_MSG.text
    }, ...apiMessages];
    try {
      const resp = await fetch('/.netlify/functions/ai-consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: fullApiMessages,
          factoryContext: factoryContext || null
        })
      });
      const data = await resp.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: data.reply
        }]);
      }
      if (data.matchedFactories && data.matchedFactories.length > 0) {
        setFactories(data.matchedFactories);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }]);
    }
    setLoading(false);
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "aic-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-chat-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-ai-avatar"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    width: "20",
    height: "20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
    fill: "currentColor",
    opacity: "0.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v3M12 19v3M2 12h3M19 12h3",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "aic-chat-title"
  }, "\uACF5\uC7A5\uB9E4\uCE6D AI \uCEE8\uC124\uD134\uD2B8"), /*#__PURE__*/React.createElement("div", {
    className: "aic-chat-subtitle"
  }, "\uC81C\uD488 \uC815\uBCF4\uB97C \uC54C\uB824\uC8FC\uC2DC\uBA74 \uCD5C\uC801\uC758 \uACF5\uC7A5\uC744 \uCC3E\uC544\uB4DC\uB9BD\uB2C8\uB2E4"))), /*#__PURE__*/React.createElement("div", {
    className: "aic-messages",
    ref: msgsContainerRef
  }, (() => {
    // 저장된 메시지 없으면 첫 메시지 결정
    const displayMessages = messages.length > 0 ? messages : [factoryContext ? {
      role: 'ai',
      text: `${factoryContext.name} 관련해서 궁금하신 점을 말씀해 주세요. 회사 정보 조사, 제품·공정 문의, 유사 제조사 추천까지 도와드리겠습니다.`
    } : AI_INIT_MSG];
    return displayMessages.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `aic-msg ${m.role === 'user' ? 'aic-msg-user' : 'aic-msg-ai'}`
    }, m.role === 'ai' && /*#__PURE__*/React.createElement("div", {
      className: "aic-msg-avatar"
    }, "AI"), /*#__PURE__*/React.createElement("div", {
      className: "aic-msg-bubble"
    }, m.text)));
  })(), loading && /*#__PURE__*/React.createElement("div", {
    className: "aic-msg aic-msg-ai"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-msg-avatar"
  }, "AI"), /*#__PURE__*/React.createElement("div", {
    className: "aic-msg-bubble aic-typing"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("div", {
    ref: msgsEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "aic-input-row"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "aic-input",
    placeholder: "\uC81C\uD488\uBA85, \uC18C\uC7AC, \uC218\uB7C9 \uB4F1\uC744 \uC785\uB825\uD558\uC138\uC694\u2026",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: handleKeyDown,
    rows: 1
  }), /*#__PURE__*/React.createElement("button", {
    className: "aic-send-btn",
    onClick: sendMessage,
    disabled: !input.trim() || loading,
    "aria-label": "\uC804\uC1A1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 18,
    stroke: 2.2
  })))), /*#__PURE__*/React.createElement("div", {
    className: "aic-results"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-panel-scroll"
  }, factoryContext && (resolvedFactories.length === 0 ?
  /*#__PURE__*/
  /* 확장 상태 - 상세 내용 표시 */
  React.createElement("div", {
    className: "aic-context-expanded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-context-label"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "buildings",
    size: 13,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", null, "\uC0C1\uB2F4 \uC911\uC778 \uC81C\uC870\uC0AC")), /*#__PURE__*/React.createElement("button", {
    className: "aic-context-full-card",
    onClick: () => onOpenFactory?.(factoryContext.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-context-full-thumb",
    style: {
      background: getCardBg(factoryContext)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-img-stripes"
  }), /*#__PURE__*/React.createElement("div", {
    className: "aic-context-icon-lg"
  }, getCardIcon(factoryContext)), /*#__PURE__*/React.createElement("div", {
    className: "aic-context-full-name-overlay"
  }, factoryContext.name)), /*#__PURE__*/React.createElement("div", {
    className: "aic-context-full-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-context-full-row"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "aic-context-name-lg"
  }, factoryContext.name)), /*#__PURE__*/React.createElement("span", {
    className: "aic-context-city-lg"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 11,
    stroke: 2
  }), " ", factoryContext.city || ''), factoryContext.summary && /*#__PURE__*/React.createElement("p", {
    className: "aic-context-summary-lg"
  }, factoryContext.summary), /*#__PURE__*/React.createElement("span", {
    className: "aic-context-link"
  }, "\uC0C1\uC138\uD398\uC774\uC9C0 \uBCF4\uAE30 \u2192")))) :
  /*#__PURE__*/
  /* 축소 상태 - 버튼형태 */
  React.createElement("button", {
    className: "aic-context-collapsed",
    onClick: () => onOpenFactory?.(factoryContext.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-context-mini-thumb",
    style: {
      background: getCardBg(factoryContext)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcard-img-stripes"
  })), /*#__PURE__*/React.createElement("div", {
    className: "aic-context-mini-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "aic-context-mini-label"
  }, "\uC0C1\uB2F4 \uC911\uC778 \uC81C\uC870\uC0AC"), /*#__PURE__*/React.createElement("strong", {
    className: "aic-context-mini-name"
  }, factoryContext.name)), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_right",
    size: 14,
    stroke: 2,
    style: {
      flexShrink: 0,
      color: '#94a3b8'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: `aic-recommend-wrap${resolvedFactories.length > 0 ? ' has-results' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-results-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 16,
    stroke: 1.8
  }), /*#__PURE__*/React.createElement("span", null, "AI \uCD94\uCC9C \uC81C\uC870\uC0AC"), resolvedFactories.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "aic-results-count"
  }, resolvedFactories.length, "\uACF3")), resolvedFactories.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "aic-results-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "aic-empty-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 32,
    stroke: 1.2
  })), /*#__PURE__*/React.createElement("p", null, "AI\uC640 \uB300\uD654\uD558\uBA74", /*#__PURE__*/React.createElement("br", null), "\uC801\uD569\uD55C \uACF5\uC7A5\uC744 \uCC3E\uC544\uB4DC\uB9BD\uB2C8\uB2E4")) : /*#__PURE__*/React.createElement("div", {
    className: "aic-cards"
  }, resolvedFactories.map(f => {
    const match = factories.find(x => x.id === f.id);
    return /*#__PURE__*/React.createElement("div", {
      key: f.id,
      className: "aic-card-wrap"
    }, match && /*#__PURE__*/React.createElement("div", {
      className: "aic-match-badge"
    }, match.matchPct, "% \uB9E4\uCE6D"), /*#__PURE__*/React.createElement(ManufacturerCard, {
      f: f,
      onOpen: id => {
        if (!window._factoryCache) window._factoryCache = {};
        window._factoryCache[id] = f;
        onOpenFactory?.(id);
      }
    }));
  })))))));
};
Object.assign(window, {
  AiConsultPage
});

// ──────────────────────────────────────────────────────────
const ReportPage = ({
  params,
  onNav
}) => {
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
    if (error) {
      setErrorMsg(error);
      return;
    }
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
        const {
          error: dbError
        } = await window._sb.from('factory_reports').insert(payload);
        if (dbError) throw new Error('데이터 저장에 실패했습니다.');
      }
      const emailResp = await fetch('/.netlify/functions/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
    return /*#__PURE__*/React.createElement("div", {
      className: "report-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "report-page-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "report-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: "report-success-icon"
    }, "\u2713"), /*#__PURE__*/React.createElement("h1", null, "\uC811\uC218\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", null, "\uC694\uCCAD \uB0B4\uC6A9\uC740 \uC601\uC5C5\uC77C \uAE30\uC900 5\uC77C \uC774\uB0B4\uC5D0 \uAC80\uD1A0 \uD6C4 \uCC98\uB9AC\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uCC98\uB9AC \uACB0\uACFC\uB294 ", /*#__PURE__*/React.createElement("strong", null, reporterEmail), "\uB85C \uD68C\uC2E0\uB4DC\uB9BD\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
      className: "report-success-actions"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNav?.('home')
    }, "\uD648\uC73C\uB85C")))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "report-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "report-page-container"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "report-page-title"
  }, "\uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD / \uBB38\uC758"), /*#__PURE__*/React.createElement("p", {
    className: "report-page-meta"
  }, "\uACF5\uC7A5 \uC815\uBCF4\uC758 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD \uB610\uB294 \uC77C\uBC18 \uBB38\uC758\uB97C \uBC1B\uC2B5\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\uC601\uC5C5\uC77C \uAE30\uC900 5\uC77C \uC774\uB0B4\uC5D0 \uAC80\uD1A0 \uD6C4 \uD68C\uC2E0\uB4DC\uB9BD\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    className: "report-section"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uC694\uCCAD \uC885\uB958 ", /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "report-type-options"
  }, [{
    value: 'factory_issue',
    title: '공장 정보 신고',
    desc: '제3자가 다른 공장 정보의 오류·문제를 신고'
  }, {
    value: 'self_correction',
    title: '자사 정보 정정·삭제',
    desc: '본인 회사 정보의 정정 또는 삭제 요청'
  }, {
    value: 'general_inquiry',
    title: '일반 문의',
    desc: '서비스 이용 문의·제휴·기타'
  }].map(opt => /*#__PURE__*/React.createElement("label", {
    key: opt.value,
    className: `report-type-option ${reportType === opt.value ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "reportType",
    value: opt.value,
    checked: reportType === opt.value,
    onChange: e => setReportType(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "report-type-content"
  }, /*#__PURE__*/React.createElement("strong", null, opt.title), /*#__PURE__*/React.createElement("span", null, opt.desc)))))), (reportType === 'factory_issue' || reportType === 'self_correction') && /*#__PURE__*/React.createElement("div", {
    className: "report-section"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uB300\uC0C1 \uACF5\uC7A5\uBA85 ", /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "report-input",
    placeholder: "\uACF5\uC7A5\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694",
    value: targetFactoryName,
    onChange: e => setTargetFactoryName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "report-section"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "report-section-title"
  }, "\uC2E0\uCCAD\uC790 \uC815\uBCF4"), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uD68C\uC0AC\uBA85 ", /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "report-input",
    placeholder: "\uD68C\uC0AC\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694",
    value: reporterCompany,
    onChange: e => setReporterCompany(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uC0AC\uC5C5\uC790\uBC88\uD638"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "report-input",
    placeholder: "000-00-00000 (\uC120\uD0DD)",
    value: reporterBusinessNumber,
    onChange: e => setReporterBusinessNumber(e.target.value)
  }), /*#__PURE__*/React.createElement("span", {
    className: "report-hint"
  }, "\uC790\uC0AC \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD \uC2DC \uAD8C\uD55C \uD655\uC778\uC6A9 (\uC120\uD0DD)")), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uB2F4\uB2F9\uC790\uBA85 ", /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "report-input",
    placeholder: "\uB2F4\uB2F9\uC790 \uC131\uD568",
    value: reporterName,
    onChange: e => setReporterName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uC774\uBA54\uC77C ", /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "email",
    className: "report-input",
    placeholder: "\uD68C\uC2E0 \uBC1B\uC744 \uC774\uBA54\uC77C",
    value: reporterEmail,
    onChange: e => setReporterEmail(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uC5F0\uB77D\uCC98"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    className: "report-input",
    placeholder: "000-0000-0000 (\uC120\uD0DD)",
    value: reporterPhone,
    onChange: e => setReporterPhone(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "report-section"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "report-section-title"
  }, "\uC694\uCCAD \uB0B4\uC6A9"), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uC0AC\uC720 ", /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "report-input",
    placeholder: "\uAC04\uB2E8\uD55C \uC0AC\uC720 (\uC608: \uD3D0\uC5C5, \uC815\uBCF4 \uC624\uB958, \uB178\uCD9C \uAC70\uBD80 \uB4F1)",
    value: reason,
    onChange: e => setReason(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "report-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "report-label"
  }, "\uC0C1\uC138 \uB0B4\uC6A9"), /*#__PURE__*/React.createElement("textarea", {
    className: "report-textarea",
    rows: "6",
    placeholder: "\uAD6C\uCCB4\uC801\uC778 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694 (\uC120\uD0DD)",
    value: description,
    onChange: e => setDescription(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "report-notice"
  }, /*#__PURE__*/React.createElement("p", null, "\u203B \uBCF8 \uD3FC\uC744 \uD1B5\uD574 \uC218\uC9D1\uB41C \uC815\uBCF4\uB294 \uC694\uCCAD \uCC98\uB9AC \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9\uB418\uBA70, \uCC98\uB9AC \uC644\uB8CC \uD6C4 3\uB144\uAC04 \uBCF4\uAD00 \uD6C4 \uD30C\uAE30\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\u203B \uC790\uC138\uD55C \uB0B4\uC6A9\uC740 ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav?.('privacy');
    }
  }, "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68"), "\uC744 \uCC38\uC870\uD558\uC138\uC694.")), errorMsg && /*#__PURE__*/React.createElement("div", {
    className: "report-error"
  }, errorMsg), /*#__PURE__*/React.createElement("div", {
    className: "report-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "report-cancel-btn",
    onClick: () => onNav?.('home'),
    disabled: submitting
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement("button", {
    className: "report-submit-btn",
    onClick: handleSubmit,
    disabled: submitting
  }, submitting ? '제출 중...' : '제출하기'))));
};

// ══════════════════════════════════════════════════════════
// GRANTS PAGE — 정부지원사업 전체 목록
// ══════════════════════════════════════════════════════════
// ─── 정부지원금 상세 페이지 ───────────────────────────────────
const GrantDetailPage = ({
  item,
  onBack,
  authed,
  onNav
}) => {
  const f = _biz(item);
  const dday = calcDday(f.endDate);
  const catStyle = f.cat ? BIZINFO_CAT_COLOR[f.cat] || {
    bg: '#f1f5f9',
    color: '#475569'
  } : null;
  const status = !dday || dday.expired ? {
    label: '마감',
    cls: 'status-closed'
  } : dday.urgent ? {
    label: '마감임박',
    cls: 'status-urgent'
  } : {
    label: '진행중',
    cls: 'status-active'
  };
  const desc = _stripHtml(f.desc);
  const method = _stripHtml(f.method);
  const contact = _stripHtml(f.contact);
  const [toast, setToast] = React.useState('');
  const [scraped, setScraped] = React.useState(false);
  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => showToast('링크가 복사됐습니다')).catch(() => showToast('복사에 실패했습니다'));
  };
  const period = f.sttDate && f.endDate ? `${_fmtDate8(f.sttDate)} ~ ${_fmtDate8(f.endDate)}` : f.endDate ? `~ ${_fmtDate8(f.endDate)}` : '';
  return /*#__PURE__*/React.createElement("div", {
    className: "page grants-detail-page"
  }, toast && /*#__PURE__*/React.createElement("div", {
    className: "grants-toast"
  }, toast), /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-badges"
  }, catStyle && /*#__PURE__*/React.createElement("span", {
    className: "grant-cat-badge",
    style: {
      background: catStyle.bg,
      color: catStyle.color
    }
  }, f.cat), /*#__PURE__*/React.createElement("span", {
    className: `grants-status-badge ${status.cls}`
  }, status.label), dday && !dday.expired && /*#__PURE__*/React.createElement("span", {
    className: `grant-dday${dday.urgent ? ' is-urgent' : ''}`
  }, dday.label)), /*#__PURE__*/React.createElement("h1", {
    className: "grants-detail-title"
  }, f.title), f.org && /*#__PURE__*/React.createElement("p", {
    className: "grants-detail-org"
  }, f.org)), /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-section"
  }, /*#__PURE__*/React.createElement("table", {
    className: "grants-detail-info-table"
  }, /*#__PURE__*/React.createElement("tbody", null, f.org && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC18C\uAD00\uBD80\uCC98"), /*#__PURE__*/React.createElement("td", null, f.org)), f.execOrg && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC0AC\uC5C5\uC218\uD589\uAE30\uAD00"), /*#__PURE__*/React.createElement("td", null, f.execOrg)), period && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC2E0\uCCAD\uAE30\uAC04"), /*#__PURE__*/React.createElement("td", null, period)), f.target && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uC9C0\uC6D0\uB300\uC0C1"), /*#__PURE__*/React.createElement("td", null, f.target)), f.cat && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "\uBD84\uC57C"), /*#__PURE__*/React.createElement("td", null, f.cat))))), desc && /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-section"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "grants-detail-section-title"
  }, "\uC0AC\uC5C5\uAC1C\uC694"), /*#__PURE__*/React.createElement("p", {
    className: "grants-detail-text"
  }, desc)), method && /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-section"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "grants-detail-section-title"
  }, "\uC0AC\uC5C5\uC2E0\uCCAD\uBC29\uBC95"), /*#__PURE__*/React.createElement("p", {
    className: "grants-detail-text"
  }, method)), contact && /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-section"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "grants-detail-section-title"
  }, "\uBB38\uC758\uCC98"), /*#__PURE__*/React.createElement("p", {
    className: "grants-detail-text"
  }, contact)), /*#__PURE__*/React.createElement("div", {
    className: "grants-detail-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: `grants-detail-btn grants-detail-btn-ghost${scraped ? ' is-scraped' : ''}`,
    onClick: () => {
      setScraped(s => !s);
      showToast(scraped ? '스크랩이 취소됐습니다' : '스크랩됐습니다');
    }
  }, scraped ? '★ 스크랩됨' : '☆ 스크랩'), /*#__PURE__*/React.createElement("button", {
    className: "grants-detail-btn grants-detail-btn-ghost",
    onClick: copyLink
  }, "\uB9C1\uD06C \uBCF5\uC0AC"), /*#__PURE__*/React.createElement("button", {
    className: "grants-detail-btn grants-detail-btn-ghost",
    onClick: onBack
  }, "\uBAA9\uB85D\uC73C\uB85C"), f.viewUrl && /*#__PURE__*/React.createElement("a", {
    href: f.viewUrl,
    target: "_blank",
    rel: "noreferrer",
    className: "grants-detail-btn grants-detail-btn-outline"
  }, "\uC6D0\uBB38 \uBCF4\uAE30"), f.applyUrl && /*#__PURE__*/React.createElement("a", {
    href: f.applyUrl,
    target: "_blank",
    rel: "noreferrer",
    className: "grants-detail-btn grants-detail-btn-primary"
  }, "\uC2E0\uCCAD\uD558\uAE30")), /*#__PURE__*/React.createElement("p", {
    className: "biz-grant-source",
    style: {
      marginTop: 24
    }
  }, "\uCD9C\uCC98: \uC911\uC18C\uBCA4\uCC98\uAE30\uC5C5\uBD80 \uAE30\uC5C5\uB9C8\uB2F9 (bizinfo.go.kr)")));
};

// ─── 정부지원금 목록 페이지 ───────────────────────────────────
const GrantsPage = ({
  onNav,
  authed
}) => {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [catIdx, setCatIdx] = React.useState(0);
  const [rgnIdx, setRgnIdx] = React.useState(0);
  const [pageNo, setPageNo] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('smart');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pinnedItems, setPinnedItems] = React.useState([]); // 진행중/마감임박 전체
  const numOfRows = 20;
  const cat = BIZINFO_CATS[catIdx];
  const rgn = BIZINFO_RGNS[rgnIdx];

  // 진행중/마감임박 전체 수집 (최대 5페이지 = 100건)
  React.useEffect(() => {
    setPinnedItems([]);
    const fetchAllActive = async () => {
      const collected = [];
      // 1페이지로 전체 건수 파악
      let totalPages = 1;
      try {
        const first = await fetchBizInfo({
          pageNo: 1,
          numOfRows: 20,
          searchLclasId: cat.id,
          searchRgnCode: rgn.code
        });
        totalPages = Math.ceil(first.total / 20) || 1;
        first.items.forEach(item => {
          const d = calcDday(_biz(item).endDate);
          if (d && !d.expired) collected.push(item);
        });
      } catch (e) {
        return;
      }

      // 나머지 페이지 병렬로 순회 (5개씩 묶어서)
      for (let p = 2; p <= totalPages; p += 5) {
        const batch = [];
        for (let i = p; i < p + 5 && i <= totalPages; i++) {
          batch.push(fetchBizInfo({
            pageNo: i,
            numOfRows: 20,
            searchLclasId: cat.id,
            searchRgnCode: rgn.code
          }).catch(() => ({
            items: []
          })));
        }
        const results = await Promise.all(batch);
        results.forEach(({
          items
        }) => {
          items.forEach(item => {
            const d = calcDday(_biz(item).endDate);
            if (d && !d.expired) collected.push(item);
          });
        });
        // 수집될 때마다 실시간 반영
        if (collected.length > 0) {
          const sorted = [...collected].sort((a, b) => {
            const da = calcDday(_biz(a).endDate),
              db = calcDday(_biz(b).endDate);
            const score = d => {
              if (!d || d.expired) return 9999;
              if (d.label === 'D-day') return 0;
              if (d.urgent) return parseInt(d.label.replace('D-', '')) || 1;
              return 1000 + (parseInt(_biz(a).endDate) || 99999999);
            };
            return score(da) - score(db);
          });
          setPinnedItems([...sorted]);
        }
      }
    };
    fetchAllActive();
  }, [catIdx, rgnIdx]);
  React.useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(false);
    setSelectedItem(null);
    fetchBizInfo({
      pageNo,
      numOfRows,
      searchLclasId: cat.id,
      searchRgnCode: rgn.code
    }).then(({
      items,
      total
    }) => {
      setItems(items);
      setTotal(total);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [catIdx, rgnIdx, pageNo]);
  const totalPages = Math.max(1, Math.ceil(total / numOfRows));
  const handleCat = idx => {
    setCatIdx(idx);
    setPageNo(1);
  };
  const handleRgn = idx => {
    setRgnIdx(idx);
    setPageNo(1);
  };

  // ── 진행중/마감임박(pinnedItems) 상단 고정 + 현재 페이지 마감 목록 하단 ──
  // 검색어/탭 필터 적용
  const applyFilters = list => {
    let r = list;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      r = r.filter(item => {
        const f = _biz(item);
        return (f.title || '').toLowerCase().includes(q) || (f.org || '').toLowerCase().includes(q);
      });
    }
    if (statusFilter === 'urgent') r = r.filter(item => {
      const d = calcDday(_biz(item).endDate);
      return d && !d.expired && d.urgent;
    });
    if (statusFilter === 'closed') r = r.filter(item => {
      const d = calcDday(_biz(item).endDate);
      return !d || d.expired;
    });
    return r;
  };

  // 현재 페이지에서 마감 항목만 추출 (진행중은 pinnedItems로 대체)
  const pageClosedItems = items.filter(item => {
    const d = calcDday(_biz(item).endDate);
    return !d || d.expired;
  });
  let displayItems;
  if (statusFilter === 'active') {
    displayItems = applyFilters(pinnedItems);
  } else if (statusFilter === 'closed') {
    displayItems = applyFilters(pageClosedItems);
  } else if (statusFilter === 'urgent') {
    displayItems = applyFilters(pinnedItems).filter(item => {
      const d = calcDday(_biz(item).endDate);
      return d && d.urgent;
    });
  } else {
    // 전체: 진행중 상단 고정 + 마감 하단
    const filteredPinned = applyFilters(pinnedItems);
    const filteredClosed = applyFilters(pageClosedItems);
    // 최신순이면 마감도 no 기준 내림차순
    if (sortBy === 'latest') {
      filteredClosed.sort((a, b) => {
        const ra = _biz(a).no || '',
          rb = _biz(b).no || '';
        return rb > ra ? 1 : rb < ra ? -1 : 0;
      });
    }
    displayItems = [...filteredPinned, ...filteredClosed];
  }
  if (selectedItem) {
    return /*#__PURE__*/React.createElement(GrantDetailPage, {
      item: selectedItem,
      onBack: () => {
        setSelectedItem(null);
        window.scrollTo(0, 0);
      },
      authed: authed,
      onNav: onNav
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "page grants-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-page-head"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "grants-page-title"
  }, "\uC815\uBD80\uC9C0\uC6D0\uC0AC\uC5C5"), /*#__PURE__*/React.createElement("p", {
    className: "grants-page-sub"
  }, "\uC81C\uC870\uAE30\uC5C5\uC744 \uC704\uD55C \uC815\uBD80\uC9C0\uC6D0\uAE08 \xB7 \uBCF4\uC870\uAE08 \uC815\uBCF4\uB97C \uD655\uC778\uD558\uC138\uC694")), /*#__PURE__*/React.createElement("div", {
    className: "grants-page-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-search-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-search-box"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "grants-search-icon",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "6",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 13.5L17 17",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    className: "grants-search-input",
    type: "text",
    placeholder: "\uC0AC\uC5C5\uBA85 \uB610\uB294 \uAE30\uAD00\uBA85\uC73C\uB85C \uAC80\uC0C9...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value)
  }), searchQuery && /*#__PURE__*/React.createElement("button", {
    className: "grants-search-clear",
    onClick: () => setSearchQuery('')
  }, "\u2715"))), /*#__PURE__*/React.createElement("div", {
    className: "grants-filter-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "grants-filter-label"
  }, "\uBD84\uC57C"), /*#__PURE__*/React.createElement("div", {
    className: "grants-cat-tabs"
  }, BIZINFO_CATS.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: `grants-cat-tab${catIdx === i ? ' is-active' : ''}`,
    onClick: () => handleCat(i)
  }, c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "grants-filter-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "grants-filter-label"
  }, "\uC9C0\uC5ED"), /*#__PURE__*/React.createElement("div", {
    className: "grants-cat-tabs"
  }, BIZINFO_RGNS.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.label,
    className: `grants-cat-tab${rgnIdx === i ? ' is-active' : ''}`,
    onClick: () => handleRgn(i)
  }, r.label)))), /*#__PURE__*/React.createElement("div", {
    className: "grants-filter-row grants-extra-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grants-status-tabs"
  }, STATUS_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: `grants-status-tab${statusFilter === f.id ? ' is-active' : ''}`,
    onClick: () => setStatusFilter(f.id)
  }, f.label))), /*#__PURE__*/React.createElement("select", {
    className: "grants-sort-sel",
    value: sortBy,
    onChange: e => setSortBy(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "smart"
  }, "\uC784\uBC15\uC21C"), /*#__PURE__*/React.createElement("option", {
    value: "latest"
  }, "\uCD5C\uC2E0\uC21C")))), loading ? /*#__PURE__*/React.createElement("div", {
    className: "grants-loading"
  }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026") : error ? /*#__PURE__*/React.createElement("div", {
    className: "grants-empty"
  }, "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.") : displayItems.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "grants-empty"
  }, "\uD574\uB2F9 \uC870\uAC74\uC758 \uC9C0\uC6D0\uC0AC\uC5C5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grants-list-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "grants-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "gt-no"
  }, "\uC21C\uBC88"), /*#__PURE__*/React.createElement("th", {
    className: "gt-cat"
  }, "\uBD84\uC57C"), /*#__PURE__*/React.createElement("th", {
    className: "gt-title"
  }, "\uC81C\uBAA9"), /*#__PURE__*/React.createElement("th", {
    className: "gt-period"
  }, "\uC2E0\uCCAD\uAE30\uAC04"), /*#__PURE__*/React.createElement("th", {
    className: "gt-org"
  }, "\uC18C\uAD00\uAE30\uAD00"), /*#__PURE__*/React.createElement("th", {
    className: "gt-views"
  }, "\uC870\uD68C\uC218"), /*#__PURE__*/React.createElement("th", {
    className: "gt-status"
  }, "\uC0C1\uD0DC"))), /*#__PURE__*/React.createElement("tbody", null, displayItems.map((item, i) => {
    const f = _biz(item);
    const dday = calcDday(f.endDate);
    const catLabel = f.cat;
    const catStyle = catLabel ? BIZINFO_CAT_COLOR[catLabel] || {
      bg: '#f1f5f9',
      color: '#475569'
    } : null;
    const status = !dday || dday.expired ? {
      label: '마감',
      cls: 'status-closed'
    } : dday.urgent ? {
      label: '마감임박',
      cls: 'status-urgent'
    } : {
      label: '진행중',
      cls: 'status-active'
    };
    const rowNum = total ? total - (pageNo - 1) * numOfRows - i : (pageNo - 1) * numOfRows + i + 1;
    const period = f.sttDate && f.endDate ? `${_fmtDate8(f.sttDate)} ~ ${_fmtDate8(f.endDate)}` : f.endDate ? `~ ${_fmtDate8(f.endDate)}` : f.regDate ? `등록 ${_fmtDate8(f.regDate)}` : '-';
    const views = _hashViews(f.no).toLocaleString();
    return /*#__PURE__*/React.createElement("tr", {
      key: f.no || i,
      className: `grants-table-row${!dday || dday.expired ? " is-closed" : ""}`,
      onClick: () => setSelectedItem(item)
    }, /*#__PURE__*/React.createElement("td", {
      className: "gt-no"
    }, rowNum), /*#__PURE__*/React.createElement("td", {
      className: "gt-cat"
    }, catStyle && /*#__PURE__*/React.createElement("span", {
      className: "grant-cat-badge",
      style: {
        background: catStyle.bg,
        color: catStyle.color
      }
    }, catLabel)), /*#__PURE__*/React.createElement("td", {
      className: "gt-title"
    }, f.title || '(제목 없음)'), /*#__PURE__*/React.createElement("td", {
      className: "gt-period"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", null, period), dday && !dday.expired && /*#__PURE__*/React.createElement("span", {
      className: `grant-dday${dday.urgent ? ' is-urgent' : ''}`,
      style: {
        fontSize: 11,
        width: 'fit-content'
      }
    }, dday.label))), /*#__PURE__*/React.createElement("td", {
      className: "gt-org"
    }, f.org), /*#__PURE__*/React.createElement("td", {
      className: "gt-views"
    }, views), /*#__PURE__*/React.createElement("td", {
      className: "gt-status"
    }, /*#__PURE__*/React.createElement("span", {
      className: `grants-status-badge ${status.cls}`
    }, status.label)));
  })))), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    className: "grants-pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "grants-page-btn",
    disabled: pageNo <= 1,
    onClick: () => {
      setPageNo(p => p - 1);
      window.scrollTo(0, 0);
    }
  }, "\uC774\uC804"), /*#__PURE__*/React.createElement("span", {
    className: "grants-page-info"
  }, pageNo, " / ", totalPages), /*#__PURE__*/React.createElement("button", {
    className: "grants-page-btn",
    disabled: pageNo >= totalPages,
    onClick: () => {
      setPageNo(p => p + 1);
      window.scrollTo(0, 0);
    }
  }, "\uB2E4\uC74C"))));
};
Object.assign(window, {
  GrantsHomeSection,
  GrantsPage,
  GrantCard,
  BizGrantCard,
  GrantDetailPage
});

// SiteFooter — 출처 표기 + 법적 링크
// ──────────────────────────────────────────────────────────
const SiteFooter = ({
  onNav
}) => /*#__PURE__*/React.createElement("footer", {
  className: "site-footer"
}, /*#__PURE__*/React.createElement("div", {
  className: "site-footer-content"
}, /*#__PURE__*/React.createElement("div", {
  className: "site-footer-info"
}, /*#__PURE__*/React.createElement("p", null, "\uBCF8 \uC0AC\uC774\uD2B8\uB294 \uACF5\uACF5\uB370\uC774\uD130\uD3EC\uD138\uC758 \uACF5\uAC1C\uC815\uBCF4\uB97C \uAE30\uBC18\uC73C\uB85C \uC6B4\uC601\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", null, "\uC815\uBCF4\uC758 \uC815\uC815\xB7\uC0AD\uC81C \uC694\uCCAD\uC740 ", /*#__PURE__*/React.createElement("a", {
  href: "#",
  onClick: e => {
    e.preventDefault();
    onNav?.('report');
  }
}, "\uC5EC\uAE30"), "\uC5D0\uC11C \uAC00\uB2A5\uD569\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement("div", {
  className: "site-footer-meta"
}, /*#__PURE__*/React.createElement("p", null, "\uC8FC\uC2DD\uD68C\uC0AC \uC62C\uBDF0\uCF54\uB9AC\uC544 \xA9 2026"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
  href: "#",
  onClick: e => {
    e.preventDefault();
    onNav?.('terms');
  }
}, "\uC774\uC6A9\uC57D\uAD00"), ' · ', /*#__PURE__*/React.createElement("a", {
  href: "#",
  onClick: e => {
    e.preventDefault();
    onNav?.('privacy');
  }
}, "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68"), ' · ', /*#__PURE__*/React.createElement("a", {
  href: "#",
  onClick: e => {
    e.preventDefault();
    onNav?.('report');
  }
}, "\uC815\uC815/\uC0AD\uC81C \uC694\uCCAD")))));
Object.assign(window, {
  TermsPage,
  PrivacyPage,
  ReportPage,
  SiteFooter
});

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
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
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
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
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
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
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
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});