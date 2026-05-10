
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "heroVariant": "split"
}/*EDITMODE-END*/;

const APP_ROUTES = ['home', 'ai', 'list', 'rfq', 'chat', 'detail', 'mypage', 'admin', 'terms', 'privacy', 'report', 'search', 'landing', 'grants'];
const AUTH_ROUTES = ['login', 'signup', 'verify', 'onboarding', 'welcome'];

// Parse route and factoryId from current URL once at startup
function _parseInitialUrl() {
  const p = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  if (APP_ROUTES.includes(p) || AUTH_ROUTES.includes(p)) return { route: p, factoryId: null };
  const h = (window.location.hash || '').replace('#', '');
  const m = h.match(/^\/factory\/(.+)$/);
  if (m) return { route: 'detail', factoryId: m[1] };
  const cleanH = h.replace(/^\//, '');
  if (AUTH_ROUTES.includes(cleanH)) return { route: cleanH, factoryId: null };
  if (APP_ROUTES.includes(cleanH)) return { route: cleanH, factoryId: null };
  try {
    return { route: 'home', factoryId: null };
  } catch { return { route: 'home', factoryId: null }; }
}

// Parse route/factoryId from any hash string
function _parseHash(h) {
  const m = h.match(/^\/factory\/(.+)$/);
  if (m) return { route: 'detail', factoryId: m[1] };
  const clean = h.replace(/^\//, '');
  if (APP_ROUTES.includes(clean) || AUTH_ROUTES.includes(clean)) return { route: clean, factoryId: null };
  return null;
}

// Build hash string from route + factoryId
function _buildHash(route, factoryId) {
  if (route === 'detail' && factoryId) return `/factory/${factoryId}`;
  if (route === 'home') return '';
  return route;
}

const _INITIAL = _parseInitialUrl();

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem('fm-authed') === '1'; } catch { return false; }
  });
  const [pendingEmail, setPendingEmail] = useState('');
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fm-profile') || 'null'); }
    catch { return null; }
  });

  const [route, setRoute] = useState(_INITIAL.route);
  const [factoryId, setFactoryId] = useState(_INITIAL.factoryId);

  const initialMount = useRef(true);
  const [rfqIds, setRfqIds] = useState([]);
  const [searchQ, setSearchQ] = useState('');

  // 소셜 로그인 후 user_profiles 없으면 signup으로 연결
  useEffect(() => {
    const { data: { subscription } } = window._sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await window._sb
          .from('user_profiles')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        if (!data) {
          // 신규 소셜 유저 → 가입 온보딩으로
          setAuthed(false);
          nav('signup');
        } else {
          try { localStorage.setItem('fm-authed', '1'); } catch {}
          setAuthed(true);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.density]);

  // Keep URL in sync with route + factoryId
  useEffect(() => {
    const hashPart = _buildHash(route, factoryId);
    const url = hashPart ? `#${hashPart}` : (window.location.pathname + window.location.search);
    const currentHash = (window.location.hash || '').replace('#', '');
    const parsed = _parseHash(currentHash);
    const currentRoute = parsed ? parsed.route : (currentHash.replace(/^\//, '') || 'home');
    const currentFactoryId = parsed?.factoryId ?? null;
    const urlMatchesState = currentRoute === route && (route !== 'detail' || currentFactoryId === factoryId);

    if (initialMount.current) {
      history.replaceState({ route, factoryId }, '', url);
      initialMount.current = false;
    } else if (!urlMatchesState) {
      history.pushState({ route, factoryId }, '', url);
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
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const nav = (r) => {
    if (r === 'ai') setAiFactoryContext(null); // 상단 탭 클릭 시 컨텍스트 초기화
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSubmit = ({ email, google }) => {
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
    nav('verify');
  };
  const handleVerifyComplete = () => nav('onboarding');
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
    try {
      localStorage.removeItem('fm-authed');
      localStorage.removeItem('fm-profile');
    } catch {}
    setAuthed(false);
    setProfile(null);
    nav('home');
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
    if (!authed && _factoryViewCount.current >= 3) {
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
        {route === 'signup' && <SignupPage onNav={nav}/>}
        {route === 'verify' && <VerifyPage email={pendingEmail || 'user@company.com'} onNav={nav} onComplete={handleVerifyComplete}/>}
        {route === 'onboarding' && <OnboardingPage onNav={nav} onComplete={handleOnboardingComplete}/>}
        {route === 'welcome' && <WelcomePage data={profile} onEnter={handleEnterApp}/>}
      </>
    );
  }

  return (
    <>
      <Header route={route} onNav={nav} density={tweaks.density} onLogout={handleLogout} authed={authed} rfqCount={rfqIds.length}/>
      {(route === 'landing' || (route === 'home' && !authed)) && <LandingPage onNav={nav} authed={authed}/>}
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
      {route === 'ai' && (
        <AiConsultPage
          onOpenFactory={(id) => openFactory(id, 'ai')}
          authed={authed}
          onGate={showGate}
          factoryContext={aiFactoryContext}
          onClearContext={() => setAiFactoryContext(null)}
        />
      )}
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
        <MyPage
          profile={profile}
          onSwitchRole={(r) => setProfile(p => ({ ...(p || {}), role: r }))}
          onOpenFactory={(id) => openFactory(id, 'mypage')}
          onNav={nav}
        />
      )}
      {route === 'admin' && (
        <AdminPage onOpenFactory={(id) => openFactory(id, 'admin')}/>
      )}
      {route === 'grants' && <GrantsPage onNav={nav} authed={authed}/>}
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
