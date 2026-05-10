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
function LandingPage({ onNav, authed }) {
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

      <main className="ldg2-main">
        <section className="ldg2-hero">
          <h1 className="ldg2-headline">AI가 찾아주는 우리 회사에 딱 맞는 <span className="ldg2-headline-accent">제조공장</span></h1>
          <p className="ldg2-sub">공정과 소재만 입력하세요. 매칭부터 견적까지.</p>

          <div className="ldg2-search-wrap">
            <input
              type="text"
              className="ldg2-search-input"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="예: CNC 알루미늄 가공"
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
              <button className="ldg2-modal-signup-btn" onClick={() => { window.logVisitor?.('signup_triggered', { trigger: 'landing_search_modal' }); onNav('signup'); }}>무료로 시작하기</button>
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
          <button className="auth-back-btn" onClick={() => onNav('home')}>
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
    else onNav('home');
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
