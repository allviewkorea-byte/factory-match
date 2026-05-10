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
