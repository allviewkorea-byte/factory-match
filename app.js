
const { useState, useEffect, useRef } = React;

// ── 사용자 행동 로그 시스템 ──
const _sessionId = (() => {
  try {
    let sid = sessionStorage.getItem('fm-sid');
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('fm-sid', sid); }
    return sid;
  } catch { return 'unknown'; }
})();

window.logActivity = async (action, targetId, targetType, meta) => {
  try {
    if (!window._sb) return;
    const { data: { user } } = await window._sb.auth.getUser();
    await window._sb.from('user_activity_logs').insert({
      user_id: user?.id || null,
      session_id: _sessionId,
      action,
      target_id: targetId ? String(targetId) : null,
      target_type: targetType || null,
      meta: meta || null,
    });
  } catch {}
};

// 비밀 관리자 접근 URL: ?k=030209
(function() {
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.get('k') === '030209') {
      localStorage.setItem('fm-admin-secret', '030209');
      // URL에서 파라미터 제거
      const clean = window.location.pathname;
      window.history.replaceState({}, '', clean);
    }
  } catch {}
})();

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "heroVariant": "split"
}/*EDITMODE-END*/;

const APP_ROUTES = ['home', 'ai', 'list', 'rfq', 'chat', 'detail', 'mypage', 'admin', 'terms', 'privacy', 'report', 'search', 'landing', 'grants'];
const AUTH_ROUTES = ['login', 'signup', 'verify', 'forgot'];

// Parse route and factoryId from current URL once at startup
function _parseInitialUrl() {
  // pathname 기반: /factory/xxx (Netlify redirect 후 도달)
  const p = window.location.pathname.replace(/\/$/, '');
  const pm = p.match(/^\/factory\/(.+)$/);
  if (pm) return { route: 'detail', factoryId: pm[1] };
  const cleanP = p.replace(/^\//, '');
  if (APP_ROUTES.includes(cleanP)) return { route: cleanP, factoryId: null };
  if (AUTH_ROUTES.includes(cleanP)) return { route: cleanP, factoryId: null };

  // hash 기반: #/factory/xxx (기존 방식)
  const h = (window.location.hash || '').replace('#', '');
  const m = h.match(/^\/factory\/(.+)$/);
  if (m) return { route: 'detail', factoryId: m[1] };
  const cleanH = h.replace(/^\//, '');
  if (AUTH_ROUTES.includes(cleanH)) return { route: cleanH, factoryId: null };
  if (APP_ROUTES.includes(cleanH)) return { route: cleanH, factoryId: null };

  return { route: 'home', factoryId: null };
}

// Parse route/factoryId from any hash string
function _parseHash(h) {
  const m = h.match(/^\/factory\/(.+)$/);
  if (m) return { route: 'detail', factoryId: m[1] };
  const clean = h.replace(/^\//, '');
  if (APP_ROUTES.includes(clean) || AUTH_ROUTES.includes(clean)) return { route: clean, factoryId: null };
  return null;
}

// Build URL for route + factoryId
// detail 페이지는 pathname 방식(/factory/xxx)으로 공유 가능한 URL 생성
function _buildHash(route, factoryId) {
  if (route === 'detail' && factoryId) return `/factory/${factoryId}`;
  if (route === 'home') return '';
  return route;
}

// detail 페이지 URL: pathname 기반으로 생성 (공유 가능)
function _buildUrl(route, factoryId) {
  if (route === 'detail' && factoryId) return `/factory/${factoryId}`;
  if (route === 'home') return '/';
  return `/#${route}`;
}

const _INITIAL = _parseInitialUrl();

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem('fm-authed') === '1' || localStorage.getItem('fm-admin-secret') === '030209'; } catch { return false; }
  });
  const [pendingEmail, setPendingEmail] = useState('');
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fm-profile') || 'null'); }
    catch { return null; }
  });

  // OAuth 콜백 처리 중 로딩 오버레이용 - URL에 ?code= 있으면 즉시 로딩 표시
  const [authProcessing, setAuthProcessing] = useState(() => {
    try { return !!(new URLSearchParams(window.location.search).get('code')); }
    catch { return false; }
  });

  const [route, setRoute] = useState(_INITIAL.route);
  const [factoryId, setFactoryId] = useState(_INITIAL.factoryId);

  const initialMount = useRef(true);
  const [rfqIds, setRfqIds] = useState([]);
  const [searchQ, setSearchQ] = useState('');

  // 소셜 로그인 후 user_profiles 없으면 onboarding으로 연결
  useEffect(() => {
    // OAuth 리다이렉트 콜백 처리
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    if (code) {
      // URL에서 code/state 제거 (재처리 방지)
      window.history.replaceState({}, '', window.location.pathname);

      if (state === 'kakao_login') {
        // 카카오 OAuth: Netlify Function으로 id_token 교환 → signInWithIdToken
        (async () => {
          try {
            const res = await fetch('/.netlify/functions/kakao-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code, redirect_uri: window.location.origin + '/' }),
            });
            const tok = await res.json();
            if (!res.ok || !tok.id_token) {
              console.error('Kakao token exchange failed:', tok);
              alert('카카오 로그인 실패: ' + (tok.error || '토큰 교환 실패'));
              return;
            }
            const { data, error } = await window._sb.auth.signInWithIdToken({
              provider: 'kakao',
              token: tok.id_token,
            });
            if (error) {
              console.error('signInWithIdToken error:', error);
              alert('카카오 로그인 실패: ' + (error.message || '세션 생성 실패'));
              return;
            }
            // 성공: 세션을 직접 받아서 handleSession 호출 (SIGNED_IN 이벤트가 안 와도 동작)
            if (data?.session?.user) {
              await handleSession(data.session);
            }
          } catch (e) {
            console.error('Kakao callback error:', e);
            alert('카카오 로그인 오류: ' + e.message);
          } finally {
            setAuthProcessing(false);
          }
        })();
      } else {
        // 그 외 OAuth (구글, 향후 네이버 등) - Supabase 표준 흐름
        window._sb.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (error) { console.error('exchangeCodeForSession error:', error); }
          setAuthProcessing(false);
        });
      }
    } else {
      // URL에 code 없으면 로딩 끔 (안전망)
      setAuthProcessing(false);
    }

    const handleSession = async (session) => {
      if (!session?.user) return;
      const { data } = await window._sb
        .from('user_profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();
      if (!data) {
        // 신규 소셜 유저 → 온보딩 팝업
        try { localStorage.setItem('fm-authed', '1'); } catch {}
        setAuthed(true);
        nav('onboarding');
      } else {
        try { localStorage.setItem('fm-authed', '1'); } catch {}
        setAuthed(true);
        const cur = window.location.hash.replace('#/', '').replace('#', '') || 'home';
        if (['auth', 'signup', 'onboarding'].includes(cur)) {
          nav('home');
        }
      }
    };

    const { data: { subscription } } = window._sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await handleSession(session);
      } else if (event === 'SIGNED_OUT') {
        try { localStorage.removeItem('fm-authed'); localStorage.removeItem('fm-profile'); } catch {}
        setAuthed(false);
        setProfile(null);
      }
    });

    // 페이지 로드 시 기존 세션 복원 (새로고침/재방문 대응)
    window._sb.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        try { localStorage.setItem('fm-authed', '1'); } catch {}
        setAuthed(true);
      }
    }).catch(() => {});

    return () => subscription.unsubscribe();
  }, []);


  useEffect(() => {
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.density]);

  // Keep URL in sync with route + factoryId
  // detail 페이지는 /factory/xxx (pathname) 방식으로 공유 가능한 URL 사용
  useEffect(() => {
    let url;
    if (route === 'detail' && factoryId) {
      url = `/factory/${factoryId}`;
    } else if (route === 'home') {
      url = '/';
    } else {
      url = `/#${route}`;
    }

    // 현재 URL과 목표 URL이 같으면 pushState 스킵
    const currentPath = window.location.pathname + window.location.hash;
    const urlMatchesState = currentPath === url || currentPath === url + '/';

    if (initialMount.current) {
      history.replaceState({ route, factoryId, detailFrom }, '', url);
      initialMount.current = false;
    } else if (!urlMatchesState) {
      history.pushState({ route, factoryId, detailFrom }, '', url);
    }
  }, [route, factoryId]);

  useEffect(() => {
    const h = (e) => nav(e.detail);
    window.addEventListener('auth-nav', h);
    return () => window.removeEventListener('auth-nav', h);
  }, []);

  // 페이지뷰 추적 — route 변경 시 Supabase page_views에 INSERT
  useEffect(() => {
    if (!window._sb || route === 'admin') return;
    window._sb.from('page_views').insert({
      path: route,
      referrer: document.referrer || null,
    }).then(() => {});
  }, [route]);

  useEffect(() => {
    const onPopState = (e) => {
      // pathname 방식 먼저 체크 (/factory/xxx)
      const p = window.location.pathname.replace(/\/$/, '');
      const pm = p.match(/^\/factory\/(.+)$/);
      if (pm) {
        setFactoryId(pm[1]);
        setRoute('detail');
        return;
      }
      // hash 방식 fallback
      const h = (window.location.hash || '').replace('#', '');
      const parsed = _parseHash(h);
      if (parsed) {
        if (parsed.factoryId) setFactoryId(parsed.factoryId);
        setRoute(parsed.route);
      } else {
        const r = e.state?.route || h.replace(/^\//, '') || 'home';
        if (APP_ROUTES.includes(r) || AUTH_ROUTES.includes(r)) setRoute(r);
        else setRoute('home');
        if (e.state?.factoryId) setFactoryId(e.state.factoryId);
      }
      // 뒤로가기 시 detailFrom 복원
      if (e.state?.detailFrom) setDetailFrom(e.state.detailFrom);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 제조사 탐색 페이지에서 body 스크롤 고정
  React.useEffect(() => {
    if (route === 'list') {
      document.body.classList.add('no-body-scroll');
    } else {
      document.body.classList.remove('no-body-scroll');
    }
    return () => document.body.classList.remove('no-body-scroll');
  }, [route]);

  const nav = (r) => {
    if (r === 'ai') setAiFactoryContext(null); // 상단 탭 클릭 시 컨텍스트 초기화
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSubmit = async ({ email, google, isLogin }) => {
    setPendingEmail(email);
    if (google) {
      const existed = !!profile;
      if (existed) {
        try { localStorage.setItem('fm-authed', '1'); } catch {}
        setAuthed(true);
        nav('home');
      } else {
        nav('onboarding');
      }
      return;
    }
    // 로그인이면 바로 Supabase 인증 후 홈으로
    if (isLogin) {
      try {
        const { error } = await window._sb.auth.signInWithPassword({ email, password: '' });
        // 비밀번호는 AuthFormPage에서 이미 검증됨, 여기선 세션 확인만
      } catch {}
      try { localStorage.setItem('fm-authed', '1'); } catch {}
      setAuthed(true);
      nav('home');
      return;
    }
    // 가입이면 verify로
    nav('verify');
  };
  const handleVerifyComplete = () => {
    try { localStorage.setItem('fm-authed', '1'); } catch {}
    setAuthed(true);
    nav('home');
  };
  const handleOnboardingComplete = (data) => {
    setProfile(data);
    try { localStorage.setItem('fm-profile', JSON.stringify(data || {})); } catch {}
    nav('welcome');
  };
  const handleEnterApp = () => {
    window.logVisitor?.('signup_completed');
    try { localStorage.setItem('fm-authed', '1'); } catch {}
    setAuthed(true);
    nav('home');
  };
  const handleLogout = () => {
    // 1) UI 즉시 로그아웃 상태로 (signOut이 hang해도 UI는 반응)
    try {
      Object.keys(localStorage).filter(k => k.startsWith('sb-')).forEach(k => localStorage.removeItem(k));
      localStorage.removeItem('fm-authed');
      localStorage.removeItem('fm-profile');
      localStorage.removeItem('fm-admin-secret');
      sessionStorage.removeItem('fm-admin-auth');
    } catch {}
    setAuthed(false);
    setProfile(null);
    nav('home');
    // 2) Supabase signOut은 백그라운드로 (await 안 함)
    try { window._sb.auth.signOut().catch(() => {}); } catch {}
  };
  const [detailFrom, setDetailFrom] = useState('list');
  const [chatTarget, setChatTarget] = useState(null);
  const [aiFactoryContext, setAiFactoryContext] = useState(null);
  const [reportParams, setReportParams] = useState(null);
  const [gateReason, setGateReason] = useState(null); // null = 닫힘

  const showGate = (reason) => {
    window.logVisitor?.('signup_triggered', { trigger: reason });
    setGateReason(reason);
  };
  const closeGate = () => setGateReason(null);
  const gateToSignup = () => { closeGate(); nav('signup'); };
  const gateToLogin  = () => { closeGate(); nav('login'); };

  const _factoryViewCount = React.useRef(0);
  const openFactory = (id, fromRoute) => {
    _factoryViewCount.current += 1;
    window.logVisitor?.('factory_view', { factory_id: id, count: _factoryViewCount.current });
    const _isAdmin = localStorage.getItem('fm-admin-secret') === '030209';
    if (!authed && !_isAdmin && _factoryViewCount.current >= 3) {
      showGate('factory_view');
      return;
    }
    setFactoryId(id);
    setDetailFrom(fromRoute || (APP_ROUTES.includes(route) ? route : 'list'));
    setRoute('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openChat = (fid, factory) => {
    if (factory) {
      // 상세페이지에서 AI 상담 → AI 탭으로 이동 + 제조사 컨텍스트 전달
      setAiFactoryContext(factory);
      setRoute('ai');
    } else {
      setChatTarget(fid || null);
      setRoute('chat');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openReport = (params) => {
    setReportParams(params || null);
    setRoute('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const addRFQ = (id) => {
    window.logActivity?.('rfq_add', id, 'factory');
    setRfqIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleSearch = (q) => {
    setSearchQ(q);
    setRoute('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (AUTH_ROUTES.includes(route)) {
    return (
      <>
        {route === 'login' && <AuthFormPage mode="login" onNav={nav} onSubmit={handleAuthSubmit}/>}
        {route === 'forgot' && <ForgotPasswordPage onNav={nav}/>}
        {route === 'signup' && <SignupPage onNav={nav}/>}
        {route === 'verify' && <VerifyPage email={pendingEmail || 'user@company.com'} onNav={nav} onComplete={handleVerifyComplete}/>}
      </>
    );
  }

  return (
    <>
      <Header route={route} onNav={nav} density={tweaks.density} onLogout={handleLogout} authed={authed} rfqCount={rfqIds.length} profile={profile}/>
      {(route === 'landing' || route === 'onboarding' || route === 'welcome' || (route === 'home' && !authed)) && <LandingPage onNav={nav} authed={authed}/>}
      {route === 'home' && authed && (
        <HomePage
          onNav={nav}
          onOpenFactory={(id) => openFactory(id, 'home')}
          onSearch={handleSearch}
          density={tweaks.density}
          heroVariant={tweaks.heroVariant}
          authed={authed}
          onGate={showGate}
        />
      )}
      <div style={{ display: (route === 'ai') ? 'flex' : 'none', flex: 1, flexDirection: 'column', overflow: 'hidden', height: '100vh' }}>
        <AiConsultPage
          onOpenFactory={(id) => openFactory(id, 'ai')}
          authed={authed}
          onGate={showGate}
          factoryContext={aiFactoryContext}
          onClearContext={() => setAiFactoryContext(null)}
          userProfile={profile}
        />
      </div>
      {route === 'search' && (
        <SearchUXPage
          initialQuery={searchQ}
          onOpenFactory={(id) => openFactory(id, 'search')}
          onSearch={handleSearch}
          onNav={nav}
        />
      )}
      {route === 'list' && (
        <ListPage
          onOpenFactory={(id) => openFactory(id, 'list')}
          onAddRFQ={authed ? addRFQ : () => showGate('rfq')}
          rfqIds={rfqIds}
          density={tweaks.density}
          initialQuery={searchQ}
        />
      )}
      {route === 'detail' && (
        <DetailPage
          factoryId={factoryId}
          onBack={() => nav(detailFrom || 'list')}
          backLabel={
            detailFrom === 'rfq' ? '견적 요청서로 돌아가기'
            : detailFrom === 'home' ? '홈으로 돌아가기'
            : detailFrom === 'search' ? '검색 결과로 돌아가기'
            : '제조사 목록으로'
          }
          onAddRFQ={authed ? addRFQ : () => showGate('rfq')}
          rfqIds={rfqIds}
          onChat={openChat}
          onReport={openReport}
          authed={authed}
          onGate={showGate}
        />
      )}
      {route === 'rfq' && (
        <RfqPage
          rfqIds={rfqIds}
          setRfqIds={setRfqIds}
          onOpenFactory={(id) => openFactory(id, 'rfq')}
          onNav={nav}
        />
      )}
      {route === 'chat' && (
        <ChatPage
          initialFactoryId={chatTarget}
          onBack={() => nav('list')}
          onOpenFactory={(id) => openFactory(id, 'chat')}
        />
      )}
      {route === 'mypage' && (
        authed ? (
          <MyPage
            profile={profile}
            onSwitchRole={(r) => setProfile(p => ({ ...(p || {}), role: r }))}
            onOpenFactory={(id) => openFactory(id, 'mypage')}
            onNav={nav}
          />
        ) : (
          <>{nav('login')}</>
        )
      )}
      {route === 'admin' && (
        <AdminPage onOpenFactory={(id) => openFactory(id, 'admin')} onAdminAuth={() => { setAuthed(true); }}/>
      )}
      {route === 'grants' && <GrantsPage onNav={nav} authed={authed} onGate={showGate}/>}
      {route === 'terms' && <TermsPage />}
      {route === 'privacy' && <PrivacyPage />}
      {route === 'report' && <ReportPage params={reportParams} onNav={nav}/>}

      <SiteFooter onNav={nav}/>

      {gateReason && (
        <GateModal
          reason={gateReason}
          onClose={closeGate}
          onSignup={gateToSignup}
          onLogin={gateToLogin}
        />
      )}

      {route === 'onboarding' && <OnboardingPage onNav={nav} onComplete={handleOnboardingComplete}/>}
      {route === 'welcome' && <WelcomePage data={profile} onEnter={handleEnterApp}/>}

      {/* 카카오 OAuth 처리 중 로딩 오버레이 */}
      {authProcessing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <style>{`@keyframes fmKakaoSpin{to{transform:rotate(360deg)}}`}</style>
          <div style={{background:'#fff',borderRadius:16,padding:'28px 36px',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <div style={{width:36,height:36,border:'3px solid #e5e7eb',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'fmKakaoSpin 0.8s linear infinite',margin:'0 auto 14px'}}/>
            <div style={{fontSize:14,fontWeight:600,color:'#374151'}}>로그인 처리 중...</div>
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="밀도 (Density)">
          <TweakRadio
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
        </TweakSection>
        <TweakSection title="히어로 레이아웃">
          <TweakRadio
            value={tweaks.heroVariant}
            onChange={(v) => setTweak('heroVariant', v)}
            options={[
              { value: 'split', label: 'Default' },
              { value: 'centered', label: 'Centered' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App/>);
