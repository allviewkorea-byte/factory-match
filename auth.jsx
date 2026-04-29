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
