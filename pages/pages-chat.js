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
