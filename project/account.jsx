// ──────────────────────────────────────────────────────────
// Chat / MyPage / Admin
// ──────────────────────────────────────────────────────────

const { useState, useMemo, useRef, useEffect } = React;
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
              <div className="chat-msg-bubble">
                <div className="chat-msg-text">{m.text}</div>
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
        <div className="modal-veil" onClick={() => setShowUpload(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h3>엑셀 일괄 업로드</h3>
              <button className="modal-close" onClick={() => setShowUpload(false)}>
                <Icon name="close" size={16} stroke={2}/>
              </button>
            </header>

            <div className="upload-drop">
              <Icon name="upload" size={28} stroke={1.4}/>
              <strong>엑셀 파일을 끌어다 놓으세요</strong>
              <span>.xlsx, .csv · 최대 10MB · 한 번에 1,000개까지</span>
              <button className="btn btn-primary btn-sm">
                <Icon name="plus" size={12} stroke={2.2}/>
                파일 선택
              </button>
            </div>

            <div className="upload-template">
              <Icon name="info" size={13} stroke={2}/>
              <div>
                <strong>템플릿 양식 사용</strong>
                <span>제조사명·도시·공정·MOQ·리드타임·인증 등 14개 필드를 정해진 형식으로 입력해주세요.</span>
              </div>
              <button className="link-btn">템플릿 다운로드</button>
            </div>

            <div className="upload-rules">
              <h4>업로드 후 자동 검증</h4>
              <ul>
                <li><Icon name="check" size={11} stroke={2.4}/> 사업자번호 중복 확인</li>
                <li><Icon name="check" size={11} stroke={2.4}/> 공정 코드 유효성 검사</li>
                <li><Icon name="check" size={11} stroke={2.4}/> 인증서 만료일 점검</li>
                <li><Icon name="check" size={11} stroke={2.4}/> 비공개 상태로 등록 후 운영자가 공개 전환</li>
              </ul>
            </div>

            <footer className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setShowUpload(false)}>취소</button>
              <button className="btn btn-primary" onClick={() => setShowUpload(false)}>
                <Icon name="upload" size={13} stroke={2.2}/>
                업로드 시작
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

Object.assign(window, { ChatPage, MyPage, AdminPage });
