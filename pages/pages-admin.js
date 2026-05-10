// ── 공공데이터 CSV 업로드 헬퍼 ──────────────────────────────
function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const buf = new Uint8Array(e.target.result);
      // UTF-8 BOM?
      if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        resolve(new TextDecoder('utf-8').decode(buf.slice(3)));
        return;
      }
      // Try strict UTF-8 first (throws on bad sequences = EUC-KR file)
      try {
        resolve(new TextDecoder('utf-8', { fatal: true }).decode(buf));
      } catch (_) {
        // Fall back to EUC-KR / CP949
        try { resolve(new TextDecoder('euc-kr').decode(buf)); }
        catch (e2) { reject(new Error('UTF-8 또는 EUC-KR 파일만 지원합니다.')); }
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function parseCSVLine(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur.trim()); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function extractRegion(addr) {
  if (!addr) return 'etc';
  if (addr.includes('서울'))                              return 'seoul';
  if (addr.includes('경기'))                              return 'gyeonggi';
  if (addr.includes('인천'))                              return 'incheon';
  if (addr.includes('부산'))                              return 'busan';
  if (addr.includes('울산'))                              return 'ulsan';
  if (addr.includes('경남'))                              return 'gyeongnam';
  if (addr.includes('대구') || addr.includes('경북'))     return 'daegu';
  if (addr.includes('광주') || addr.includes('전남') || addr.includes('전북')) return 'jeonla';
  if (addr.includes('대전') || addr.includes('충남') || addr.includes('충북') || addr.includes('세종')) return 'chungcheong';
  if (addr.includes('강원'))                              return 'gangwon';
  if (addr.includes('제주'))                              return 'jeju';
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
  const [counts, setCounts] = useState({ pending: 0, processing: 0, resolved: 0, rejected: 0 });

  const loadReports = async (status) => {
    setLoading(true);
    setError('');
    try {
      const { data, error: dbError } = await window._sb
        .from('factory_reports')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
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
      const results = await Promise.all(
        statuses.map(s =>
          window._sb
            .from('factory_reports')
            .select('id', { count: 'estimated', head: true })
            .eq('status', s)
        )
      );
      const newCounts = {};
      statuses.forEach((s, i) => { newCounts[s] = results[i].count || 0; });
      setCounts(newCounts);
    } catch (err) {
      console.error('Load counts error:', err);
    }
  };

  useEffect(() => {
    if (!window._sb) { setLoading(false); setError('Supabase 연결이 필요합니다.'); return; }
    loadReports(activeStatus);
    loadCounts();
  }, [activeStatus]);

  const handleStatusChange = async (reportId, newStatus, adminNote = '') => {
    try {
      const updates = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === 'resolved' || newStatus === 'rejected') {
        updates.resolved_at = new Date().toISOString();
      }
      if (adminNote) updates.admin_note = adminNote;
      const { error: dbError } = await window._sb
        .from('factory_reports')
        .update(updates)
        .eq('id', reportId);
      if (dbError) throw dbError;
      await loadReports(activeStatus);
      await loadCounts();
      setSelectedReport(null);
    } catch (err) {
      console.error('Status change error:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const STATUS_LABELS = { pending: '접수', processing: '처리중', resolved: '완료', rejected: '거절' };
  const TYPE_LABELS = { factory_issue: '공장 신고', self_correction: '자사 정정', general_inquiry: '일반 문의' };

  const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  return (
    <div className="admin-reports-tab">
      <div className="admin-reports-status-tabs">
        {['pending', 'processing', 'resolved', 'rejected'].map(s => (
          <button
            key={s}
            className={`admin-reports-status-tab ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {STATUS_LABELS[s]}
            {counts[s] > 0 && <span className="admin-reports-count-badge">{counts[s]}</span>}
          </button>
        ))}
      </div>

      <div className="admin-reports-list">
        {loading && <div className="admin-reports-loading">로딩 중...</div>}
        {error && <div className="admin-reports-error">{error}</div>}
        {!loading && !error && reports.length === 0 && (
          <div className="admin-reports-empty">{STATUS_LABELS[activeStatus]} 상태의 신고가 없습니다.</div>
        )}
        {!loading && !error && reports.length > 0 && (
          <table className="admin-reports-table">
            <thead>
              <tr>
                <th>접수일시</th><th>종류</th><th>대상 공장</th>
                <th>신청자</th><th>회사명</th><th>사유</th><th>액션</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <span className={`admin-reports-type-badge type-${r.report_type}`}>
                      {TYPE_LABELS[r.report_type] || r.report_type}
                    </span>
                  </td>
                  <td>{r.target_factory_name || '-'}</td>
                  <td>{r.reporter_name}</td>
                  <td>{r.reporter_company}</td>
                  <td className="admin-reports-reason-cell">{r.reason}</td>
                  <td>
                    <button className="admin-reports-detail-btn" onClick={() => setSelectedReport(r)}>
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedReport && (
        <div className="admin-reports-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="admin-reports-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-reports-modal-header">
              <h2>신고 상세</h2>
              <button className="admin-reports-modal-close" onClick={() => setSelectedReport(null)}>×</button>
            </div>

            <div className="admin-reports-modal-body">
              <div className="admin-reports-detail-section">
                <h3>요청 정보</h3>
                <div className="admin-reports-detail-row"><strong>접수번호:</strong> #{selectedReport.id}</div>
                <div className="admin-reports-detail-row"><strong>접수일시:</strong> {formatDate(selectedReport.created_at)}</div>
                <div className="admin-reports-detail-row"><strong>종류:</strong> {TYPE_LABELS[selectedReport.report_type]}</div>
                <div className="admin-reports-detail-row">
                  <strong>현재 상태:</strong>
                  <span className={`admin-reports-status-badge status-${selectedReport.status}`}>
                    {STATUS_LABELS[selectedReport.status]}
                  </span>
                </div>
                {selectedReport.target_factory_name && (
                  <div className="admin-reports-detail-row">
                    <strong>대상 공장:</strong> {selectedReport.target_factory_name}
                    {selectedReport.target_factory_id && (
                      <span style={{color:'#888',fontSize:'12px'}}> (ID: {selectedReport.target_factory_id})</span>
                    )}
                  </div>
                )}
              </div>

              <div className="admin-reports-detail-section">
                <h3>신청자 정보</h3>
                <div className="admin-reports-detail-row"><strong>회사명:</strong> {selectedReport.reporter_company}</div>
                {selectedReport.reporter_business_number && (
                  <div className="admin-reports-detail-row"><strong>사업자번호:</strong> {selectedReport.reporter_business_number}</div>
                )}
                <div className="admin-reports-detail-row"><strong>담당자:</strong> {selectedReport.reporter_name}</div>
                <div className="admin-reports-detail-row">
                  <strong>이메일:</strong>
                  <a href={`mailto:${selectedReport.reporter_email}`}>{selectedReport.reporter_email}</a>
                </div>
                {selectedReport.reporter_phone && (
                  <div className="admin-reports-detail-row"><strong>연락처:</strong> {selectedReport.reporter_phone}</div>
                )}
              </div>

              <div className="admin-reports-detail-section">
                <h3>요청 내용</h3>
                <div className="admin-reports-detail-row"><strong>사유:</strong> {selectedReport.reason}</div>
                {selectedReport.description && (
                  <div className="admin-reports-detail-description">
                    <strong>상세:</strong>
                    <div className="admin-reports-detail-text">{selectedReport.description}</div>
                  </div>
                )}
              </div>

              {selectedReport.admin_note && (
                <div className="admin-reports-detail-section">
                  <h3>관리자 메모</h3>
                  <div className="admin-reports-detail-text">{selectedReport.admin_note}</div>
                </div>
              )}

              {selectedReport.resolved_at && (
                <div className="admin-reports-detail-section">
                  <h3>처리 정보</h3>
                  <div className="admin-reports-detail-row"><strong>처리일시:</strong> {formatDate(selectedReport.resolved_at)}</div>
                </div>
              )}
            </div>

            <div className="admin-reports-modal-actions">
              {selectedReport.status === 'pending' && (<>
                <button className="admin-reports-action-btn primary"
                  onClick={() => handleStatusChange(selectedReport.id, 'processing')}>
                  처리 시작
                </button>
                <button className="admin-reports-action-btn"
                  onClick={() => { const n = prompt('거절 사유를 입력하세요:'); if (n) handleStatusChange(selectedReport.id, 'rejected', n); }}>
                  거절
                </button>
              </>)}
              {selectedReport.status === 'processing' && (<>
                <button className="admin-reports-action-btn primary"
                  onClick={() => { const n = prompt('처리 내용을 입력하세요 (선택):') || ''; handleStatusChange(selectedReport.id, 'resolved', n); }}>
                  완료 처리
                </button>
                <button className="admin-reports-action-btn"
                  onClick={() => { const n = prompt('거절 사유를 입력하세요:'); if (n) handleStatusChange(selectedReport.id, 'rejected', n); }}>
                  거절
                </button>
              </>)}
              {(selectedReport.status === 'resolved' || selectedReport.status === 'rejected') && (
                <button className="admin-reports-action-btn"
                  onClick={() => handleStatusChange(selectedReport.id, 'pending')}>
                  접수 상태로 되돌리기
                </button>
              )}
              <button className="admin-reports-action-btn cancel" onClick={() => setSelectedReport(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });

  const loadSignups = async (status) => {
    setLoading(true);
    setError('');
    try {
      let q = window._sb.from('user_profiles').select('*').order('created_at', { ascending: false });
      if (status !== 'all') q = q.eq('status', status);
      const { data, error: dbErr } = await q;
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
      const [allRes, ...results] = await Promise.all([
        window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }),
        ...statuses.map(s =>
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }).eq('status', s)
        ),
      ]);
      const c = { all: allRes.count || 0 };
      statuses.forEach((s, i) => { c[s] = results[i].count || 0; });
      setCounts(c);
    } catch (err) {
      console.error('AdminSignupTab count error:', err);
    }
  };

  useEffect(() => {
    if (!window._sb) { setLoading(false); setError('Supabase 연결이 필요합니다.'); return; }
    loadSignups(activeStatus);
    loadCounts();
  }, [activeStatus]);

  const openDetail = (row) => {
    setSelected(row);
    setMemo(row.admin_memo || '');
    setEmailStatus('');
  };

  const handleApprove = async () => {
    if (!selected || actionLoading) return;
    setActionLoading(true);
    try {
      const now = new Date().toISOString();
      const updates = { status: 'approved', approved_at: now, updated_at: now };
      if (memo.trim()) updates.admin_memo = memo.trim();
      const { error: dbErr } = await window._sb.from('user_profiles').update(updates).eq('id', selected.id);
      if (dbErr) throw dbErr;

      if (selected.role === 'manufacturer' && selected.business_number) {
        const bizNum = selected.business_number.replace(/\D/g, '');
        const { data: matched } = await window._sb.from('factories').select('id, business_number').limit(200);
        if (matched) {
          const hit = matched.find(f => f.business_number && f.business_number.replace(/\D/g, '') === bizNum);
          if (hit) {
            await window._sb.from('factories').update({ owner_user_id: selected.id }).eq('id', hit.id);
          }
        }
      }

      setEmailStatus('sending');
      try {
        const res = await fetch('/.netlify/functions/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'approved', email: selected.email, name: selected.contact_name, company: selected.company_name }),
        });
        setEmailStatus(res.ok ? 'sent' : 'failed');
      } catch { setEmailStatus('failed'); }

      await loadSignups(activeStatus);
      await loadCounts();
      setSelected(s => s ? { ...s, status: 'approved', approved_at: now, admin_memo: memo.trim() || s.admin_memo } : null);
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
      const updates = { status: 'rejected', updated_at: now };
      if (finalMemo) updates.admin_memo = finalMemo;
      const { error: dbErr } = await window._sb.from('user_profiles').update(updates).eq('id', selected.id);
      if (dbErr) throw dbErr;

      setEmailStatus('sending');
      try {
        const res = await fetch('/.netlify/functions/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'rejected', email: selected.email, name: selected.contact_name, company: selected.company_name, reason: finalMemo }),
        });
        setEmailStatus(res.ok ? 'sent' : 'failed');
      } catch { setEmailStatus('failed'); }

      await loadSignups(activeStatus);
      await loadCounts();
      setSelected(s => s ? { ...s, status: 'rejected', admin_memo: finalMemo || s.admin_memo } : null);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected.status === 'approved' ? 'approved' : 'rejected', email: selected.email, name: selected.contact_name, company: selected.company_name }),
      });
      setEmailStatus(res.ok ? 'sent' : 'failed');
    } catch { setEmailStatus('failed'); }
  };

  const saveMemo = async () => {
    if (!selected) return;
    try {
      await window._sb.from('user_profiles').update({ admin_memo: memo, updated_at: new Date().toISOString() }).eq('id', selected.id);
      setSignups(prev => prev.map(r => r.id === selected.id ? { ...r, admin_memo: memo } : r));
    } catch (err) { alert('메모 저장 실패: ' + (err.message || err)); }
  };

  const fmtDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const STATUS_LABELS = { all: '전체', pending: '대기중', approved: '승인됨', rejected: '거절됨' };
  const ROLE_LABELS = { buyer: '바이어', manufacturer: '제조사' };

  return (
    <div className="asgn-wrap">
      <div className="asgn-status-tabs">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            className={`asgn-status-tab ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {STATUS_LABELS[s]}
            {counts[s] > 0 && <span className="asgn-count-badge">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {loading && <div className="asgn-state-msg">로딩 중…</div>}
      {error && <div className="asgn-state-msg asgn-error">{error}</div>}
      {!loading && !error && signups.length === 0 && (
        <div className="asgn-state-msg">해당 상태의 신청이 없습니다.</div>
      )}
      {!loading && !error && signups.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table asgn-table">
            <thead>
              <tr>
                <th>신청일</th><th>유형</th><th>회사명</th><th>사업자번호</th>
                <th>담당자</th><th>연락처</th><th>상태</th><th></th>
              </tr>
            </thead>
            <tbody>
              {signups.map(r => (
                <tr key={r.id}>
                  <td className="mono">{fmtDate(r.created_at)}</td>
                  <td><span className={`asgn-role-badge role-${r.role}`}>{ROLE_LABELS[r.role] || r.role || '-'}</span></td>
                  <td><strong>{r.company_name || '-'}</strong></td>
                  <td className="mono">{r.business_number || '-'}</td>
                  <td>{r.contact_name || '-'}</td>
                  <td className="mono">{r.phone || '-'}</td>
                  <td><span className={`asgn-status-badge status-${r.status}`}>{STATUS_LABELS[r.status] || r.status}</span></td>
                  <td><button className="admin-reports-detail-btn" onClick={() => openDetail(r)}>상세</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-reports-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-reports-modal asgn-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-reports-modal-header">
              <h2>가입 신청 상세</h2>
              <button className="admin-reports-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="admin-reports-modal-body">
              <div className="admin-reports-detail-section">
                <h3>기본 정보</h3>
                <div className="admin-reports-detail-row"><strong>신청일:</strong> {fmtDate(selected.created_at)}</div>
                <div className="admin-reports-detail-row">
                  <strong>유형:</strong>
                  <span className={`asgn-role-badge role-${selected.role}`}>{ROLE_LABELS[selected.role] || selected.role}</span>
                </div>
                <div className="admin-reports-detail-row">
                  <strong>상태:</strong>
                  <span className={`asgn-status-badge status-${selected.status}`}>{STATUS_LABELS[selected.status]}</span>
                </div>
                {selected.approved_at && (
                  <div className="admin-reports-detail-row"><strong>처리일:</strong> {fmtDate(selected.approved_at)}</div>
                )}
              </div>
              <div className="admin-reports-detail-section">
                <h3>회사 정보</h3>
                <div className="admin-reports-detail-row"><strong>회사명:</strong> {selected.company_name || '-'}</div>
                <div className="admin-reports-detail-row"><strong>사업자번호:</strong> <span className="mono">{selected.business_number || '-'}</span></div>
                <div className="admin-reports-detail-row"><strong>담당자:</strong> {selected.contact_name || '-'}</div>
                <div className="admin-reports-detail-row">
                  <strong>이메일:</strong>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
                <div className="admin-reports-detail-row"><strong>연락처:</strong> <span className="mono">{selected.phone || '-'}</span></div>
              </div>
              {selected.interests && selected.interests.length > 0 && (
                <div className="admin-reports-detail-section">
                  <h3>관심 분야</h3>
                  <div className="asgn-interests">
                    {(Array.isArray(selected.interests) ? selected.interests : []).map(t => (
                      <span key={t} className="asgn-interest-chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.document_url && (
                <div className="admin-reports-detail-section">
                  <h3>제출 서류</h3>
                  <a className="asgn-doc-link" href={selected.document_url} target="_blank" rel="noopener noreferrer">
                    <Icon name="file" size={14} stroke={2}/> 서류 보기 (새 탭)
                  </a>
                </div>
              )}
              <div className="admin-reports-detail-section">
                <h3>관리자 메모</h3>
                <div className="asgn-memo-wrap">
                  <textarea
                    className="asgn-memo-textarea"
                    rows={3}
                    placeholder="내부 메모를 입력하세요…"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                  />
                  <button className="asgn-memo-save-btn" onClick={saveMemo}>메모 저장</button>
                </div>
              </div>
              {emailStatus && (
                <div className={`asgn-email-status ${emailStatus}`}>
                  {emailStatus === 'sending' && '이메일 발송 중…'}
                  {emailStatus === 'sent' && '이메일 발송 완료'}
                  {emailStatus === 'failed' && '이메일 발송 실패 (Netlify 함수 확인 필요)'}
                </div>
              )}
            </div>
            <div className="admin-reports-modal-actions">
              {selected.status === 'pending' && (<>
                <button className="admin-reports-action-btn primary" disabled={actionLoading} onClick={handleApprove}>
                  {actionLoading ? '처리 중…' : '승인'}
                </button>
                <button className="admin-reports-action-btn" disabled={actionLoading} onClick={handleReject}>거절</button>
              </>)}
              {(selected.status === 'approved' || selected.status === 'rejected') && (
                <button className="admin-reports-action-btn" disabled={actionLoading} onClick={handleResendEmail}>이메일 재발송</button>
              )}
              <button className="admin-reports-action-btn cancel" onClick={() => setSelected(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AdminPasswordGate
// ──────────────────────────────────────────────────────────
const ADMIN_SESSION_KEY = 'fm-admin-auth';

const AdminPasswordGate = ({ onAuth }) => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });
      const data = await res.json();
      if (data.ok) {
        try { sessionStorage.setItem(ADMIN_SESSION_KEY, '1'); } catch {}
        onAuth();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
    setLoading(false);
  };

  return (
    <main className="page admin-gate-page">
      <div className="admin-gate-box">
        <div className="admin-gate-icon">
          <Icon name="shield" size={28} stroke={1.8}/>
        </div>
        <h1 className="admin-gate-title">관리자 인증</h1>
        <p className="admin-gate-sub">접근하려면 관리자 비밀번호가 필요합니다.</p>
        <div className="admin-gate-form">
          <input
            type="password"
            className="admin-gate-input"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="비밀번호"
            autoFocus
          />
          {error && <p className="admin-gate-error">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
            {loading ? '확인중…' : '확인'}
          </button>
        </div>
      </div>
    </main>
  );
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
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

        const { data: views } = await window._sb
          .from('page_views')
          .select('path, referrer, created_at')
          .gte('created_at', since)
          .order('created_at', { ascending: true })
          .limit(5000);

        if (views) {
          setTodayViews(views.filter(v => v.created_at >= todayStart.toISOString()).length);

          const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0);
            return d;
          });
          setDayChart(days.map(d => {
            const next = new Date(d); next.setDate(next.getDate() + 1);
            const v = views.filter(x => x.created_at >= d.toISOString() && x.created_at < next.toISOString()).length;
            return { label: `${d.getMonth() + 1}/${d.getDate()}`, v };
          }));

          const ref = { direct: 0, search: 0, social: 0, other: 0 };
          views.forEach(v => {
            if (!v.referrer) ref.direct++;
            else if (/google|naver|daum|bing|yahoo/i.test(v.referrer)) ref.search++;
            else if (/facebook|twitter|instagram|kakao|linkedin/i.test(v.referrer)) ref.social++;
            else ref.other++;
          });
          setRefBreakdown(ref);
        }

        // 전체 누적
        const { count: total } = await window._sb
          .from('page_views').select('id', { count: 'estimated', head: true });
        setTotalViews(total ?? 0);

        // 유저 통계
        const [
          { count: uAll },
          { count: uPending },
          { count: uApproved },
        ] = await Promise.all([
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }),
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }).eq('status', 'pending'),
          window._sb.from('user_profiles').select('id', { count: 'estimated', head: true }).eq('status', 'approved'),
        ]);
        setUserStats({ total: uAll ?? 0, pending: uPending ?? 0, approved: uApproved ?? 0 });
      } catch {}
      setLoading(false);
    })();
  }, []);

  const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.v), 1);
    const cols = data.length;
    const W = 420, H = 100;
    const colW = W / cols;
    const barW = Math.max(6, colW - 8);
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: 'visible', display: 'block' }}>
        {data.map((d, i) => {
          const bh = Math.max(2, (d.v / max) * H);
          const x = i * colW + (colW - barW) / 2;
          return (
            <g key={i}>
              <rect x={x} y={H - bh} width={barW} height={bh} fill="#3b82f6" rx="3" opacity="0.85"/>
              {d.v > 0 && (
                <text x={x + barW / 2} y={H - bh - 4} textAnchor="middle" fontSize="9" fill="#555">{d.v}</text>
              )}
              <text x={x + barW / 2} y={H + 16} textAnchor="middle" fontSize="9" fill="#999">{d.label}</text>
            </g>
          );
        })}
        <line x1={0} y1={H} x2={W} y2={H} stroke="#eee" strokeWidth="1"/>
      </svg>
    );
  };

  const Metric = ({ label, value, sub }) => (
    <div className="an-metric">
      <div className="an-metric-v">{value ?? '—'}</div>
      <div className="an-metric-k">{label}</div>
      {sub && <div className="an-metric-sub">{sub}</div>}
    </div>
  );

  if (loading) return <div className="an-loading">데이터를 불러오는 중…</div>;

  const totalRef = refBreakdown ? Object.values(refBreakdown).reduce((a, b) => a + b, 0) : 1;
  const refPct = (n) => totalRef ? Math.round((n / totalRef) * 100) : 0;

  return (
    <div className="an-grid">
      {/* 방문자 요약 */}
      <div className="an-card an-card-wide">
        <h3 className="an-card-title">방문자 통계</h3>
        <div className="an-metrics-row">
          <Metric label="오늘 방문자" value={todayViews}/>
          <Metric label="누적 방문자 (전체)" value={totalViews?.toLocaleString()}/>
          <Metric label="최근 7일" value={dayChart.reduce((s, d) => s + d.v, 0)}/>
        </div>
      </div>

      {/* 7일 바 차트 */}
      <div className="an-card an-card-wide">
        <h3 className="an-card-title">최근 7일 일별 방문</h3>
        {dayChart.length > 0 ? (
          <div className="an-chart-wrap">
            <BarChart data={dayChart}/>
          </div>
        ) : (
          <p className="an-empty">데이터가 없습니다.</p>
        )}
      </div>

      {/* 유입 경로 */}
      <div className="an-card">
        <h3 className="an-card-title">유입 경로 (최근 7일)</h3>
        {refBreakdown ? (
          <div className="an-ref-list">
            {[
              { label: '직접 접속', key: 'direct', color: '#3b82f6' },
              { label: '검색엔진', key: 'search', color: '#10b981' },
              { label: '소셜',     key: 'social', color: '#8b5cf6' },
              { label: '기타',     key: 'other',  color: '#f59e0b' },
            ].map(({ label, key, color }) => (
              <div key={key} className="an-ref-row">
                <div className="an-ref-label">
                  <span className="an-ref-dot" style={{ background: color }}/>
                  {label}
                </div>
                <div className="an-ref-bar-wrap">
                  <div className="an-ref-bar" style={{ width: refPct(refBreakdown[key]) + '%', background: color }}/>
                </div>
                <span className="an-ref-val">{refBreakdown[key]}</span>
                <span className="an-ref-pct">({refPct(refBreakdown[key])}%)</span>
              </div>
            ))}
          </div>
        ) : <p className="an-empty">데이터가 없습니다.</p>}
      </div>

      {/* 주요 지표 */}
      <div className="an-card">
        <h3 className="an-card-title">주요 지표</h3>
        {userStats ? (
          <div className="an-kpi-list">
            <div className="an-kpi-row">
              <span>전체 가입 신청</span>
              <strong>{userStats.total}</strong>
            </div>
            <div className="an-kpi-row">
              <span>승인 대기</span>
              <strong className="an-kpi-pending">{userStats.pending}</strong>
            </div>
            <div className="an-kpi-row">
              <span>승인 완료</span>
              <strong className="an-kpi-ok">{userStats.approved}</strong>
            </div>
          </div>
        ) : <p className="an-empty">데이터가 없습니다.</p>}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// AdminVisitorTab — 비회원 활동 현황
// ──────────────────────────────────────────────────────────
const VISITOR_PERIODS = [
  { id: 'today', label: '오늘' },
  { id: 'week',  label: '이번 주' },
  { id: 'month', label: '이번 달' },
];

const AdminVisitorTab = () => {
  const [period, setPeriod] = useState('today');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const periodStart = (p) => {
    const d = new Date();
    if (p === 'today') { d.setHours(0, 0, 0, 0); }
    else if (p === 'week') { d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); }
    else { d.setDate(1); d.setHours(0, 0, 0, 0); }
    return d.toISOString();
  };

  useEffect(() => {
    setLoading(true);
    setData(null);
    (async () => {
      if (!window._sb) { setLoading(false); return; }
      try {
        const since = periodStart(period);
        const { data: rows } = await window._sb
          .from('visitor_logs')
          .select('session_id, event_type, event_data, created_at')
          .gte('created_at', since)
          .order('created_at', { ascending: false })
          .limit(5000);

        if (!rows) { setData({}); setLoading(false); return; }

        const sessions = new Set(rows.map(r => r.session_id));
        const byType = (t) => rows.filter(r => r.event_type === t);

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
        const topQueries = Object.entries(qCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([q, n]) => ({ q, n }));

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
          pct: completedCount > 0 ? Math.round((completedCount / n) * 100) : 0,
        }));

        setData({
          sessions: sessions.size,
          searches: searches.length,
          factoryViews: factoryViews.length,
          rfqAttempts: rfqAttempts.length,
          aiConsults: aiConsults.length,
          triggered: triggered.length,
          completed: completedCount,
          convRate: triggered.length > 0 ? ((completedCount / triggered.length) * 100).toFixed(1) : '0.0',
          topQueries,
          triggerConversion,
        });
      } catch (e) {
        console.error('visitor_logs fetch error:', e);
        setData({});
      }
      setLoading(false);
    })();
  }, [period]);

  const Stat = ({ label, value, highlight }) => (
    <div className={`vst-stat ${highlight ? 'vst-stat-hi' : ''}`}>
      <div className="vst-stat-v">{value ?? '—'}</div>
      <div className="vst-stat-k">{label}</div>
    </div>
  );

  const BarRow = ({ label, value, max, color }) => (
    <div className="vst-bar-row">
      <div className="vst-bar-label">{label}</div>
      <div className="vst-bar-track">
        <div className="vst-bar-fill" style={{ width: max ? `${Math.round((value / max) * 100)}%` : '0%', background: color || '#3b6ef5' }}/>
      </div>
      <div className="vst-bar-val">{value}</div>
    </div>
  );

  return (
    <div className="vst-wrap">
      {/* 기간 필터 */}
      <div className="vst-period-row">
        {VISITOR_PERIODS.map(p => (
          <button
            key={p.id}
            className={`vst-period-btn ${period === p.id ? 'is-active' : ''}`}
            onClick={() => setPeriod(p.id)}
          >{p.label}</button>
        ))}
      </div>

      {loading && <div className="an-loading">데이터를 불러오는 중…</div>}

      {!loading && data && (
        <>
          {/* 요약 지표 */}
          <div className="vst-stats-grid">
            <Stat label="비회원 세션 수"     value={data.sessions}     highlight/>
            <Stat label="검색 시도"          value={data.searches}/>
            <Stat label="공장 상세 클릭"     value={data.factoryViews}/>
            <Stat label="견적 요청 시도"     value={data.rfqAttempts}/>
            <Stat label="AI 상담 시도"       value={data.aiConsults}/>
            <Stat label="가입 유도 노출"     value={data.triggered}/>
            <Stat label="가입 완료"          value={data.completed}     highlight/>
            <Stat label="전환율"             value={`${data.convRate}%`} highlight/>
          </div>

          {/* 트리거별 전환율 */}
          {data.triggerConversion?.length > 0 && (
            <div className="vst-card">
              <h4 className="vst-card-title">가입 유도 트리거별 현황</h4>
              <div className="vst-trigger-list">
                {data.triggerConversion.map(({ trigger, shown, pct }) => (
                  <div key={trigger} className="vst-trigger-row">
                    <div className="vst-trigger-label">{trigger}</div>
                    <div className="vst-trigger-bar-wrap">
                      <div className="vst-trigger-bar" style={{ width: `${Math.min(pct, 100)}%` }}/>
                    </div>
                    <div className="vst-trigger-meta">{shown}회 노출 · 전환 {pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 인기 검색어 Top 10 */}
          {data.topQueries?.length > 0 && (
            <div className="vst-card">
              <h4 className="vst-card-title">인기 검색어 Top 10</h4>
              <div className="vst-query-list">
                {data.topQueries.map(({ q, n }, i) => (
                  <BarRow
                    key={q}
                    label={`${i + 1}. ${q}`}
                    value={n}
                    max={data.topQueries[0].n}
                    color={i === 0 ? '#3b6ef5' : i < 3 ? '#6366f1' : '#94a3b8'}
                  />
                ))}
              </div>
            </div>
          )}

          {!data.sessions && (
            <div className="an-empty" style={{ marginTop: 40 }}>해당 기간 비회원 활동 데이터가 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
};

// AdminFactoriesTab — 제조사 관리 (서버사이드 페이지네이션 + 검색 + 편집)
const AdminFactoriesTab = ({ onOpenFactory }) => {
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

  useEffect(() => { setPage(1); }, [debouncedQ, filterVisible, filterWebsite, filterContact]);

  useEffect(() => {
    if (!window._sb) return;
    let mounted = true;
    setLoading(true);
    let sq = window._sb.from('factories').select('*', { count: 'exact' });
    if (debouncedQ) sq = sq.or(`name.ilike.%${debouncedQ}%,city.ilike.%${debouncedQ}%`);
    if (filterVisible === 'public')  sq = sq.eq('hidden', false);
    if (filterVisible === 'private') sq = sq.eq('hidden', true);
    if (filterWebsite === 'yes') sq = sq.not('website', 'is', null);
    if (filterWebsite === 'no')  sq = sq.is('website', null);
    if (filterContact === 'yes') sq = sq.not('phone', 'is', null);
    if (filterContact === 'no')  sq = sq.is('phone', null);
    const from = (page - 1) * PAGE_SIZE;
    sq.order('id', { ascending: true }).range(from, from + PAGE_SIZE - 1)
      .then(({ data, count, error }) => {
        if (!mounted) return;
        if (!error) { setRows(data || []); setTotalCount(count); }
        setLoading(false);
      }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [page, debouncedQ, filterVisible, filterWebsite, filterContact]);

  const openEdit = (row) => {
    setEditTarget(row);
    setEditDraft({
      name:      row.name || '',
      summary:   row.summary || '',
      region:    row.region || '',
      city:      row.city || '',
      phone:     row.phone || '',
      website:   row.website || '',
      employees: row.employees ?? '',
      founded:   row.founded ?? '',
      hidden:    !!row.hidden,
    });
  };

  const saveEdit = async () => {
    if (!editTarget || saving) return;
    setSaving(true);
    const updates = {
      name:      editDraft.name.trim(),
      summary:   editDraft.summary.trim(),
      region:    editDraft.region.trim(),
      city:      editDraft.city.trim(),
      phone:     editDraft.phone.trim() || null,
      website:   editDraft.website.trim() || null,
      employees: editDraft.employees === '' ? null : Number(editDraft.employees),
      founded:   editDraft.founded === '' ? null : Number(editDraft.founded),
      hidden:    editDraft.hidden,
    };
    const { error } = await window._sb.from('factories').update(updates).eq('id', editTarget.id);
    setSaving(false);
    if (error) { alert('저장 실패: ' + error.message); return; }
    setRows(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...updates } : r));
    setEditTarget(null);
  };

  const pageCount = totalCount != null ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const EDIT_FIELDS = [
    { key: 'name',      label: '회사명',     type: 'text'   },
    { key: 'city',      label: '도시/주소',   type: 'text'   },
    { key: 'region',    label: '지역 (DB값)', type: 'text'   },
    { key: 'phone',     label: '연락처',      type: 'text'   },
    { key: 'website',   label: '웹사이트',    type: 'text'   },
    { key: 'employees', label: '임직원 수',   type: 'number' },
    { key: 'founded',   label: '설립연도',    type: 'number' },
  ];

  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Icon name="search" size={14} stroke={2}/>
          <input placeholder="제조사명, 도시로 검색" value={q} onChange={e => setQ(e.target.value)}/>
          {q && <button className="ls-clear" onClick={() => setQ('')}><Icon name="close" size={12} stroke={2}/></button>}
        </div>
        <div className="admin-segmented">
          {[{id:'all',label:'전체'},{id:'public',label:'공개'},{id:'private',label:'비공개'}].map(s => (
            <button key={s.id} className={'seg-btn '+(filterVisible===s.id?'is-active':'')} onClick={() => setFilterVisible(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="admin-segmented">
          {[{id:'all',label:'웹사이트'},{id:'yes',label:'있음'},{id:'no',label:'없음'}].map(s => (
            <button key={s.id} className={'seg-btn '+(filterWebsite===s.id?'is-active':'')} onClick={() => setFilterWebsite(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="admin-segmented">
          {[{id:'all',label:'연락처'},{id:'yes',label:'있음'},{id:'no',label:'없음'}].map(s => (
            <button key={s.id} className={'seg-btn '+(filterContact===s.id?'is-active':'')} onClick={() => setFilterContact(s.id)}>{s.label}</button>
          ))}
        </div>
        <span className="admin-toolbar-count">{loading ? '…' : (totalCount ?? 0).toLocaleString()}곳</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>제조사명</th>
              <th>도시</th>
              <th>연락처</th>
              <th>웹사이트</th>
              <th>공개</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr><td colSpan="6" className="admin-table-empty">로딩 중…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="6" className="admin-table-empty">검색 결과가 없습니다</td></tr>
            ) : rows.map(f => (
              <tr key={f.id}>
                <td>
                  <div className="admin-name">
                    <div className="admin-name-dot"/>
                    <strong>{f.name}</strong>
                    <span className="mono">#{String(f.id).slice(0, 12)}</span>
                  </div>
                </td>
                <td>{f.city || '—'}</td>
                <td>{f.phone || '—'}</td>
                <td>
                  {f.website
                    ? <span className="admin-link-cell" title={f.website}>{f.website.replace(/^https?:\/\//, '').slice(0, 28)}</span>
                    : '—'}
                </td>
                <td>
                  <span className={'admin-visible-badge ' + (f.hidden ? 'is-hidden' : 'is-public')}>
                    {f.hidden ? '비공개' : '공개'}
                  </span>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <button className="link-btn" onClick={() => openEdit(f)}>수정</button>
                    <button className="link-btn" onClick={() => onOpenFactory && onOpenFactory(f.id)}>보기</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="admin-pagination">
          <button className="pg-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {(() => {
            const start = Math.max(1, Math.min(page - 3, pageCount - 6));
            const end = Math.min(pageCount, start + 6);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(n => (
              <button key={n} className={'pg-num ' + (page === n ? 'is-active' : '')} onClick={() => setPage(n)}>{n}</button>
            ));
          })()}
          <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === pageCount}>›</button>
          <button className="pg-btn" onClick={() => setPage(pageCount)} disabled={page === pageCount}>»</button>
          <span className="admin-page-info">{page.toLocaleString()} / {pageCount.toLocaleString()} 페이지</span>
        </div>
      )}

      {editTarget && (
        <div className="admin-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>제조사 편집</h3>
              <button className="admin-modal-close" onClick={() => setEditTarget(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              {EDIT_FIELDS.map(({ key, label, type }) => (
                <div key={key} className="admin-form-row">
                  <label className="admin-form-label">{label}</label>
                  <input
                    className="admin-form-input"
                    type={type}
                    value={editDraft[key]}
                    onChange={e => setEditDraft(d => ({ ...d, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="admin-form-row">
                <label className="admin-form-label">한줄 소개</label>
                <textarea
                  className="admin-form-input"
                  rows={3}
                  value={editDraft.summary}
                  onChange={e => setEditDraft(d => ({ ...d, summary: e.target.value }))}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-form-label">공개 여부</label>
                <label className="admin-form-check">
                  <input
                    type="checkbox"
                    checked={!editDraft.hidden}
                    onChange={e => setEditDraft(d => ({ ...d, hidden: !e.target.checked }))}
                  />
                  <span>공개 (체크 해제 시 비공개)</span>
                </label>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditTarget(null)}>취소</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                {saving ? '저장 중…' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
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

  const BLANK = { title: '', organization: '', category: '설비투자', description: '', target: '', amount: '', deadline: '', url: '', is_active: true };

  const load = () => {
    setLoading(true);
    if (!window._sb) { setLoading(false); return; }
    window._sb.from('government_support').select('*').order('deadline', { ascending: true })
      .then(({ data }) => { if (data) setGrants(data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setEditGrant(null); setForm({ ...BLANK }); setShowModal(true); };
  const openEdit = (g) => { setEditGrant(g); setForm({ ...g }); setShowModal(true); };

  const save = async () => {
    if (!form.title?.trim() || !form.organization?.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(), organization: form.organization.trim(),
      category: form.category || '기타', description: form.description || null,
      target: form.target || null, amount: form.amount || null,
      deadline: form.deadline || null, url: form.url || null,
      is_active: !!form.is_active,
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

  const del = async (id) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await window._sb.from('government_support').delete().eq('id', id);
    setGrants(prev => prev.filter(g => g.id !== id));
  };

  const setF = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const filtered = grants.filter(g => catFilter === '전체' || g.category === catFilter);

  return (
    <section className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>지원사업 관리</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="grants-cat-tabs">
            {GRANT_CATS.map(c => (
              <button key={c} className={`grants-cat-tab${catFilter === c ? ' is-active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ 추가</button>
        </div>
      </div>

      {loading ? <p style={{ color: 'var(--ink-3)', fontSize: 13 }}>불러오는 중…</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>사업명</th><th>기관</th><th>카테고리</th><th>지원금액</th><th>마감일</th><th>D-day</th><th>상태</th><th>관리</th></tr></thead>
            <tbody>
              {filtered.map(g => {
                const dday = calcDday(g.deadline);
                return (
                  <tr key={g.id}>
                    <td style={{ maxWidth: 180 }}>{g.title}</td>
                    <td>{g.organization}</td>
                    <td><span className="grant-cat-badge" style={{ background: (GRANT_CAT_COLOR[g.category]||GRANT_CAT_COLOR['기타']).bg, color: (GRANT_CAT_COLOR[g.category]||GRANT_CAT_COLOR['기타']).color }}>{g.category}</span></td>
                    <td>{g.amount || '—'}</td>
                    <td>{g.deadline || '—'}</td>
                    <td>{dday ? <span className={`grant-dday${dday.urgent ? ' is-urgent' : ''}`}>{dday.label}</span> : '—'}</td>
                    <td><span style={{ color: g.is_active ? '#16a34a' : '#94a3b8', fontSize: 12, fontWeight: 600 }}>{g.is_active ? '공개' : '비공개'}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => openEdit(g)}>수정</button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--rose)', marginLeft: 4 }} onClick={() => del(g.id)}>삭제</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan="8" className="admin-table-empty">지원사업이 없습니다</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-veil" onClick={() => setShowModal(false)}>
          <div className="modal-card" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <header className="modal-head">
              <h3>{editGrant ? '지원사업 수정' : '지원사업 추가'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </header>
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'title',        label: '사업명 *' },
                { key: 'organization', label: '기관명 *' },
                { key: 'description',  label: '요약' },
                { key: 'target',       label: '지원대상' },
                { key: 'amount',       label: '지원금액' },
                { key: 'url',          label: '링크 URL' },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--ink-2)' }}>
                  {label}
                  <input className="admin-form-input" value={form[key] || ''} onChange={e => setF(key, e.target.value)} />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--ink-2)' }}>
                카테고리
                <select className="admin-form-input" value={form.category || '기타'} onChange={e => setF('category', e.target.value)}>
                  {GRANT_CATS.filter(c => c !== '전체').map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--ink-2)' }}>
                마감일
                <input type="date" className="admin-form-input" value={form.deadline || ''} onChange={e => setF('deadline', e.target.value)} />
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-2)' }}>
                <input type="checkbox" checked={!!form.is_active} onChange={e => setF('is_active', e.target.checked)} />
                공개 여부
              </label>
            </div>
            <footer className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>취소</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? '저장 중…' : '저장'}</button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
};

// AdminPage — 운영자 대시보드
// ──────────────────────────────────────────────────────────
const AdminPage = ({ onOpenFactory }) => {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; } catch { return false; }
  });
  const [totalCount, setTotalCount] = useState(null);
  const [tab, setTab] = useState('factories');

  useEffect(() => {
    if (!window._sb) return;
    window._sb.from('factories').select('*', { count: 'estimated', head: true })
      .then(({ count }) => { if (count != null) setTotalCount(count); });
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
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = React.useRef(null);

  const MAPPING_FIELDS = [
    { field: 'id_src',     label: 'ID 번호', required: false },
    { field: 'name',       label: '회사명',   required: true  },
    { field: 'city',       label: '주소',     required: false },
    { field: 'products',   label: '생산품',   required: false },
    { field: 'summary',    label: '단지명',   required: false },
    { field: 'industries', label: '업종명',   required: false },
  ];
  const FIELD_KEYWORDS = {
    name:       ['회사명', '사업체명', '업체명', '공장명', '상호', '법인명', '회사', '기업명', '업체', '사업자명', '공장', '업체'],
    city:       ['공장주소', '주소', '본사소재지', '소재지', '주소지', '사업장주소', '도로명주소', '지번주소', '위치', '공장대표주소', '사업장소재지', 'address'],
    products:   ['생산품', '주생산품', '제품', '생산제품', '품목', '주요생산품', '생산물', '취급품목', '주력제품', '생산품목'],
    id_src:     ['연번', '순번', '번호', 'id', 'no', '일련번호'],
    summary:    ['단지명', '산업단지명', '단지', '지구', '구역', '입주단지'],
    industries: ['업종명', '업종', '업태', '산업분류', '업종코드', '주업종', '제조업종'],
  };
  const autoMap = (headers) => {
    const result = { name: -1, city: -1, products: -1, id_src: -1, summary: -1, industries: -1 };
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
    setUploadProgress({ done: 0, total: 0 });
    setUploadResult(null);
  };
  const closeUpload = () => { setShowUpload(false); resetUpload(); };

  const downloadTemplate = () => {
    const hdr = 'id,name,en,city,region,coord_x,coord_y,industries,processes,products,materials,moq,moq_unit,lead_days,price_range,employees,founded,certs,oem,odm,export,rating,reviews,response_hr,deals,summary,image';
    const ex  = 'f_ex1,예시정밀,Example Precision,경기 안산시,gyeonggi,38,32,machine,cnc;cutting,auto;machine_parts,알루미늄;SUS304,100,피스,14,₩2500~₩18000,42,2008,ISO 9001;IATF 16949,true,true,false,4.5,80,3,200,자동차 정밀부품 전문입니다.,#a8b4c8';
    const blob = new Blob([hdr + '\n' + ex], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'factories_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Step 1: Read file → detect headers → show mapping phase
  const parseFileHeaders = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { alert('.csv 파일만 업로드할 수 있습니다.'); return; }
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
    const get = (vals, idx) => (idx >= 0 && idx < vals.length ? (vals[idx] || '').trim() : '');
    const ts = Date.now();
    const rows = [], errors = [];
    rawLines.forEach((vals, i) => {
      const name = get(vals, colMap.name);
      if (!name) { errors.push({ rowNum: i + 2, msg: '회사명 없음' }); return; }
      const seqRaw = get(vals, colMap.id_src);
      const id = seqRaw || ('upload_' + ts + '_' + (i + 1));
      const city = get(vals, colMap.city);
      rows.push({
        id,
        name,
        en:          '',
        city,
        region:      extractRegion(city),
        coord_x:     50,
        coord_y:     50,
        industries:  get(vals, colMap.industries).split(/[,;／、]/).map(s => s.trim()).filter(Boolean),
        processes:   [],
        products:    get(vals, colMap.products).split(/[,;／、]/).map(s => s.trim()).filter(Boolean),
        materials:   [],
        moq:         1,
        moq_unit:    '협의',
        lead_days:   0,
        price_range: '',
        employees:   0,
        founded:     0,
        certs:       [],
        oem:         false,
        odm:         false,
        export:      false,
        rating:      0,
        reviews:     0,
        response_hr: 24,
        deals:       0,
        hidden:      false,
        summary:     get(vals, colMap.summary),
        image:       '#a8b4c8',
      });
    });
    setParsedRows(rows);
    setParseErrors(errors);
    setUploadPhase('preview');
  };

  // Step 3: 1000-row batch upsert
  const confirmUpload = async () => {
    if (!window._sb) { alert('Supabase 연결이 없습니다.'); return; }
    setUploadPhase('uploading');
    const BATCH = 1000;
    let ok = 0, fail = 0;
    const failedRows = [];
    setUploadProgress({ done: 0, total: parsedRows.length });
    for (let i = 0; i < parsedRows.length; i += BATCH) {
      const chunk = parsedRows.slice(i, i + BATCH);
      const { error } = await window._sb.from('factories').upsert(chunk, { onConflict: 'id' });
      if (!error) {
        ok += chunk.length;
      } else {
        fail += chunk.length;
        failedRows.push({ id: `${i+1}~${Math.min(i+BATCH,parsedRows.length)}행`, name: '', msg: error.message });
      }
      setUploadProgress({ done: Math.min(i + BATCH, parsedRows.length), total: parsedRows.length });
      await new Promise(r => setTimeout(r, 0));
    }
    setUploadResult({ ok, fail, failedRows });
    setUploadPhase('result');
    try {
      const { count } = await window._sb.from('factories').select('*', { count: 'estimated', head: true });
      if (count != null) setTotalCount(count);
    } catch (_) {}
  };

  const [userCount, setUserCount] = useState(null);
  const [rfqMonthCount, setRfqMonthCount] = useState(null);

  useEffect(() => {
    if (!window._sb) return;
    // 전체 사용자 수: user_profiles (anon key로 접근 가능한 public 테이블)
    window._sb.from('user_profiles').select('*', { count: 'exact', head: true })
      .then(({ count, error }) => { if (!error && count != null) setUserCount(count); })
      .catch(() => {});
    // RFQ 이번달 건수
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    window._sb.from('rfq').select('*', { count: 'exact', head: true })
      .gte('created_at', firstDay)
      .then(({ count, error }) => { setRfqMonthCount(!error && count != null ? count : 0); })
      .catch(() => setRfqMonthCount(0));
  }, []);

  const stats = {
    total: totalCount ?? '…',
    users: userCount ?? '…',
    rfq:   rfqMonthCount ?? '…',
  };

  const PREVIEW_COLS = [
    { key: 'id',       label: 'ID' },
    { key: 'name',     label: '회사명' },
    { key: 'city',     label: '주소', render: v => v ? v.slice(0, 22) + (v.length > 22 ? '…' : '') : '—' },
    { key: 'products', label: '생산품', render: v => (v || []).slice(0, 3).join(', ') || '—' },
    { key: 'summary',  label: '단지명' },
  ];

  // 비밀번호 게이트 — 모든 훅 선언 이후에 위치
  if (!authed) return <AdminPasswordGate onAuth={() => setAuthed(true)}/>;

  const handleLogout = () => {
    try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch {}
    setAuthed(false);
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
          <p>CSV로 일괄 업로드하고, 검증 완료된 제조사만 공개로 전환하세요.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="btn btn-secondary" onClick={handleLogout}>
            <Icon name="lock" size={14} stroke={2}/>
            로그아웃
          </button>
          <button className="btn btn-secondary" onClick={downloadTemplate}>
            <Icon name="arrow_up_right" size={14} stroke={2}/>
            템플릿 다운로드
          </button>
          <button className="btn btn-primary" onClick={() => { resetUpload(); setShowUpload(true); }}>
            <Icon name="upload" size={14} stroke={2}/>
            CSV 업로드
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <div className="astat"><div className="astat-k">전체 제조사</div><div className="astat-v">{typeof stats.total === 'number' ? stats.total.toLocaleString() : stats.total}</div></div>
        <div className="astat"><div className="astat-k">전체 사용자</div><div className="astat-v">{typeof stats.users === 'number' ? stats.users.toLocaleString() : stats.users}</div></div>
        <div className="astat"><div className="astat-k">RFQ (이번달)</div><div className="astat-v">{stats.rfq}</div></div>
        <div className="astat"><div className="astat-k">활성 채팅</div><div className="astat-v" style={{ color: 'var(--ink-4)', fontSize: 13 }}>준비 중</div></div>
      </section>

      <nav className="admin-tabs">
        {[
          { id: 'factories', label: '제조사 관리' },
          { id: 'users',     label: '사용자' },
          { id: 'rfq',       label: 'RFQ 모니터링' },
          { id: 'logs',      label: '업로드 이력' },
          { id: 'reports',   label: '신고 관리' },
          { id: 'signups',   label: '가입 신청' },
          { id: 'analytics', label: '통계' },
          { id: 'visitors',  label: '비회원 활동' },
          { id: 'grants',    label: '지원사업 관리' },
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

      {tab === 'factories' && <AdminFactoriesTab onOpenFactory={onOpenFactory}/>}

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
                <tr><th>일시</th><th>파일명</th><th>전체</th><th>성공</th><th>실패</th><th>결과</th></tr>
              </thead>
              <tbody>
                <tr><td className="mono">2025-01-06 14:23</td><td>factories_2025_01.csv</td><td>184</td><td>179</td><td>5</td><td><span className="status-pill status-진행중">검증중</span></td></tr>
                <tr><td className="mono">2024-12-28 09:14</td><td>factories_dec.csv</td><td>241</td><td>241</td><td>0</td><td><span className="status-pill status-완료">완료</span></td></tr>
                <tr><td className="mono">2024-12-15 16:42</td><td>cnc_extra.csv</td><td>72</td><td>72</td><td>0</td><td><span className="status-pill status-완료">완료</span></td></tr>
                <tr><td className="mono">2024-11-29 11:08</td><td>busan_factories.csv</td><td>56</td><td>54</td><td>2</td><td><span className="status-pill status-완료">완료</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'reports' && (
        <section className="admin-panel">
          <AdminReportsTab />
        </section>
      )}

      {tab === 'signups' && (
        <section className="admin-panel">
          <AdminSignupTab />
        </section>
      )}

      {tab === 'analytics' && (
        <section className="admin-panel">
          <AdminAnalyticsTab />
        </section>
      )}

      {tab === 'visitors' && (
        <section className="admin-panel">
          <AdminVisitorTab />
        </section>
      )}

      {tab === 'grants' && <AdminGrantsTab />}

      {/* ── CSV 업로드 모달 ── */}
      {showUpload && (
        <div className="modal-veil" onClick={closeUpload}>
          <div className="modal-card upload-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h3>
                {uploadPhase === 'idle'      && 'CSV 일괄 업로드'}
                {uploadPhase === 'mapping'   && `컬럼 매핑 · ${rawHeaders.length}개 감지`}
                {uploadPhase === 'preview'   && `미리보기 · ${parsedRows.length.toLocaleString()}행`}
                {uploadPhase === 'uploading' && '업로드 중…'}
                {uploadPhase === 'result'    && '업로드 완료'}
              </h3>
              <button className="modal-close" onClick={closeUpload}>
                <Icon name="close" size={16} stroke={2}/>
              </button>
            </header>

            {/* Phase: idle — drop zone */}
            {uploadPhase === 'idle' && (
              <>
                <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files[0]; if (f) parseFileHeaders(f); e.target.value = ''; }}
                />
                <div
                  className={'upload-drop' + (dragOver ? ' is-drag' : '')}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) parseFileHeaders(f); }}
                >
                  <Icon name="upload" size={32} stroke={1.4}/>
                  <strong>CSV 파일을 끌어다 놓으세요</strong>
                  <span>.csv · UTF-8 / EUC-KR · 컬럼명 자동 인식</span>
                  <button className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
                    <Icon name="plus" size={12} stroke={2.2}/>
                    파일 선택
                  </button>
                </div>
                <div className="upload-template">
                  <Icon name="info" size={13} stroke={2}/>
                  <div>
                    <strong>어떤 CSV든 OK</strong>
                    <span>컬럼명을 자동 분석해 매핑합니다. 공공데이터·자체 양식 모두 지원.</span>
                  </div>
                  <button className="link-btn" onClick={downloadTemplate}>기본 템플릿</button>
                </div>
              </>
            )}

            {/* Phase: mapping — review/adjust column mapping */}
            {uploadPhase === 'mapping' && (
              <>
                <div className="mapping-info">
                  <Icon name="layers" size={14} stroke={2}/>
                  <span><strong>{rawHeaders.length}개 컬럼</strong> 감지 · <strong>{rawLines.length.toLocaleString()}행</strong></span>
                </div>
                <div className="mapping-table">
                  {MAPPING_FIELDS.map(({ field, label, required }) => {
                    const idx = colMap[field] ?? -1;
                    return (
                      <div key={field} className={`mapping-row ${idx >= 0 ? 'is-matched' : 'is-unmatched'}`}>
                        <div className="mapping-target">
                          {label}
                          {required && <span className="mapping-required">필수</span>}
                        </div>
                        <div className="mapping-status">
                          {idx >= 0
                            ? <><Icon name="check" size={12} stroke={2.4}/><span className="mapping-col-name">{rawHeaders[idx]}</span></>
                            : <><Icon name="info"  size={12} stroke={2}/> <span className="mapping-col-none">미감지</span></>
                          }
                        </div>
                        <select
                          className="mapping-select"
                          value={idx >= 0 ? idx : ''}
                          onChange={(e) => setColMap(m => ({ ...m, [field]: e.target.value === '' ? -1 : parseInt(e.target.value) }))}
                        >
                          <option value="">— 매핑 안 함 —</option>
                          {rawHeaders.map((h, i) => <option key={i} value={i}>{h}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>
                {(colMap.name ?? -1) < 0 && (
                  <div className="mapping-warn">
                    <Icon name="info" size={13} stroke={2}/> 회사명 컬럼을 반드시 지정해주세요.
                  </div>
                )}
                <footer className="modal-foot">
                  <button className="btn btn-secondary" onClick={resetUpload}>다시 선택</button>
                  <button className="btn btn-primary" onClick={applyMapping} disabled={(colMap.name ?? -1) < 0}>
                    <Icon name="check" size={13} stroke={2.2}/>
                    매핑 확인 · 미리보기
                  </button>
                </footer>
              </>
            )}

            {/* Phase: preview — table of first 10 rows */}
            {uploadPhase === 'preview' && (
              <>
                <div className="upload-preview-summary">
                  <div className="upload-preview-stat upload-stat-ok">
                    <Icon name="check" size={14} stroke={2.4}/>
                    유효 <strong>{parsedRows.length}행</strong>
                  </div>
                  {parseErrors.length > 0 && (
                    <div className="upload-preview-stat upload-stat-fail">
                      <Icon name="info" size={14} stroke={2}/>
                      건너뜀 <strong>{parseErrors.length}행</strong>
                    </div>
                  )}
                  <span className="upload-preview-hint">처음 10행 미리보기</span>
                </div>

                <div className="admin-table-wrap upload-preview-table">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        {PREVIEW_COLS.map(c => <th key={c.key}>{c.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          {PREVIEW_COLS.map(c => (
                            <td key={c.key} className={c.key === 'id' ? 'mono' : ''}>
                              {c.render ? c.render(row[c.key]) : (row[c.key] ?? '—')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedRows.length > 10 && (
                    <div className="upload-preview-more">… 외 {parsedRows.length - 10}행</div>
                  )}
                </div>

                {parseErrors.length > 0 && (
                  <div className="upload-parse-errors">
                    <strong>건너뛴 행 ({parseErrors.length}개)</strong>
                    <ul>
                      {parseErrors.slice(0, 5).map((e, i) => (
                        <li key={i}>{e.rowNum}행 · id:{e.id} · {e.msg}</li>
                      ))}
                      {parseErrors.length > 5 && <li>… 외 {parseErrors.length - 5}건</li>}
                    </ul>
                  </div>
                )}

                <footer className="modal-foot">
                  <button className="btn btn-secondary" onClick={() => setUploadPhase('mapping')}>다시 선택</button>
                  <button className="btn btn-primary" onClick={confirmUpload} disabled={parsedRows.length === 0}>
                    <Icon name="upload" size={13} stroke={2.2}/>
                    {parsedRows.length.toLocaleString()}개 업로드 시작
                  </button>
                </footer>
              </>
            )}

            {/* Phase: uploading — progress bar */}
            {uploadPhase === 'uploading' && (
              <div className="upload-progress-wrap">
                <div className="upload-spinner"/>
                <strong>Supabase에 저장하는 중…</strong>
                <div className="upload-progress-bar-wrap">
                  <div
                    className="upload-progress-bar-fill"
                    style={{ width: uploadProgress.total > 0 ? `${Math.round(uploadProgress.done / uploadProgress.total * 100)}%` : '0%' }}
                  />
                </div>
                <span className="upload-progress-label">
                  {uploadProgress.done.toLocaleString()} / {uploadProgress.total.toLocaleString()} 처리 중…
                  {uploadProgress.total > 0 && ` (${Math.round(uploadProgress.done / uploadProgress.total * 100)}%)`}
                </span>
              </div>
            )}

            {/* Phase: result — success/fail counts */}
            {uploadPhase === 'result' && uploadResult && (
              <>
                <div className="upload-result-summary">
                  <div className="upload-result-stat upload-stat-ok">
                    <Icon name="check" size={20} stroke={2.4}/>
                    <span className="upload-result-n">{uploadResult.ok}</span>
                    <span className="upload-result-label">성공</span>
                  </div>
                  {uploadResult.fail > 0 && (
                    <div className="upload-result-stat upload-stat-fail">
                      <Icon name="info" size={20} stroke={1.8}/>
                      <span className="upload-result-n">{uploadResult.fail}</span>
                      <span className="upload-result-label">실패</span>
                    </div>
                  )}
                </div>

                {uploadResult.failedRows.length > 0 && (
                  <div className="upload-parse-errors">
                    <strong>실패한 행</strong>
                    <ul>
                      {uploadResult.failedRows.slice(0, 8).map((e, i) => (
                        <li key={i}>id:{e.id} · {e.name || '이름없음'} · {e.msg}</li>
                      ))}
                      {uploadResult.failedRows.length > 8 && <li>… 외 {uploadResult.failedRows.length - 8}건</li>}
                    </ul>
                  </div>
                )}

                <footer className="modal-foot">
                  <button className="btn btn-secondary" onClick={resetUpload}>
                    <Icon name="upload" size={13} stroke={2}/>
                    다른 파일 업로드
                  </button>
                  <button className="btn btn-primary" onClick={closeUpload}>닫기</button>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
Object.assign(window, { ChatPage, MyPage, AdminPage, AdminReportsTab, AdminSignupTab, AdminVisitorTab, AdminGrantsTab, GateModal });
