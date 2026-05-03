
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "heroVariant": "split"
}/*EDITMODE-END*/;

const APP_ROUTES = ['home', 'list', 'rfq', 'chat', 'detail', 'search', 'mypage', 'admin'];
const AUTH_ROUTES = ['landing', 'login', 'signup', 'verify', 'onboarding', 'welcome'];

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

  const [route, setRoute] = useState(() => {
    const p = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (APP_ROUTES.includes(p)) return p;
    if (AUTH_ROUTES.includes(p)) return p;
    const h = (window.location.hash || '').replace('#', '');
    if (AUTH_ROUTES.includes(h)) return h;
    if (APP_ROUTES.includes(h)) return h;
    try {
      return localStorage.getItem('fm-authed') === '1' ? 'home' : 'landing';
    } catch { return 'landing'; }
  });
  const [factoryId, setFactoryId] = useState(null);
  const [rfqIds, setRfqIds] = useState([]);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    if (route === 'list') setRfqIds([]);
  }, [route]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.density]);

  useEffect(() => {
    const target = route === 'home' ? '' : route;
    if ((window.location.hash || '').replace('#', '') !== target) {
      window.location.hash = target;
    }
  }, [route]);

  useEffect(() => {
    const h = (e) => nav(e.detail);
    window.addEventListener('auth-nav', h);
    return () => window.removeEventListener('auth-nav', h);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const h = (window.location.hash || '').replace('#', '');
      const r = h || 'home';
      if (APP_ROUTES.includes(r) || AUTH_ROUTES.includes(r)) setRoute(r);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const nav = (r) => {
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
    nav('landing');
  };
  const [detailFrom, setDetailFrom] = useState('list');
  const [chatTarget, setChatTarget] = useState(null);

  const openFactory = (id, fromRoute) => {
    setFactoryId(id);
    setDetailFrom(fromRoute || (APP_ROUTES.includes(route) ? route : 'list'));
    setRoute('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openChat = (fid) => {
    setChatTarget(fid || null);
    setRoute('chat');
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
        {route === 'landing' && <LandingPage onNav={nav}/>}
        {route === 'login' && <AuthFormPage mode="login" onNav={nav} onSubmit={handleAuthSubmit}/>}
        {route === 'signup' && <AuthFormPage mode="signup" onNav={nav} onSubmit={handleAuthSubmit}/>}
        {route === 'verify' && <VerifyPage email={pendingEmail || 'user@company.com'} onNav={nav} onComplete={handleVerifyComplete}/>}
        {route === 'onboarding' && <OnboardingPage onNav={nav} onComplete={handleOnboardingComplete}/>}
        {route === 'welcome' && <WelcomePage data={profile} onEnter={handleEnterApp}/>}
      </>
    );
  }

  return (
    <>
      <Header route={route} onNav={nav} density={tweaks.density} onLogout={handleLogout} authed={authed}/>
      {route === 'home' && (
        <HomePage
          onNav={nav}
          onOpenFactory={(id) => openFactory(id, 'home')}
          onSearch={handleSearch}
          density={tweaks.density}
          heroVariant={tweaks.heroVariant}
        />
      )}
      {route === 'list' && (
        <ListPage
          onOpenFactory={(id) => openFactory(id, 'list')}
          onAddRFQ={addRFQ}
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
            : '제조사 목록으로'
          }
          onAddRFQ={addRFQ}
          rfqIds={rfqIds}
          onChat={openChat}
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
      {route === 'search' && (
        <SearchUXPage
          onOpenFactory={(id) => openFactory(id, 'search')}
          onSearch={handleSearch}
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

