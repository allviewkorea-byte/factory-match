
// ──────────────────────────────────────────────────────────
const ReportPage = ({ params, onNav }) => {
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
    if (error) { setErrorMsg(error); return; }
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
        const { error: dbError } = await window._sb.from('factory_reports').insert(payload);
        if (dbError) throw new Error('데이터 저장에 실패했습니다.');
      }

      const emailResp = await fetch('/.netlify/functions/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    return (
      <div className="report-page">
        <div className="report-page-container">
          <div className="report-success">
            <div className="report-success-icon">✓</div>
            <h1>접수가 완료되었습니다</h1>
            <p>요청 내용은 영업일 기준 5일 이내에 검토 후 처리됩니다.</p>
            <p>처리 결과는 <strong>{reporterEmail}</strong>로 회신드립니다.</p>
            <div className="report-success-actions">
              <button onClick={() => onNav?.('home')}>홈으로</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-page-container">
        <h1 className="report-page-title">정정·삭제 요청 / 문의</h1>
        <p className="report-page-meta">
          공장 정보의 정정·삭제 요청 또는 일반 문의를 받습니다.<br/>
          영업일 기준 5일 이내에 검토 후 회신드립니다.
        </p>

        <div className="report-section">
          <label className="report-label">요청 종류 <span className="required">*</span></label>
          <div className="report-type-options">
            {[
              { value: 'factory_issue', title: '공장 정보 신고', desc: '제3자가 다른 공장 정보의 오류·문제를 신고' },
              { value: 'self_correction', title: '자사 정보 정정·삭제', desc: '본인 회사 정보의 정정 또는 삭제 요청' },
              { value: 'general_inquiry', title: '일반 문의', desc: '서비스 이용 문의·제휴·기타' },
            ].map(opt => (
              <label key={opt.value} className={`report-type-option ${reportType === opt.value ? 'active' : ''}`}>
                <input type="radio" name="reportType" value={opt.value}
                  checked={reportType === opt.value}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <div className="report-type-content">
                  <strong>{opt.title}</strong>
                  <span>{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {(reportType === 'factory_issue' || reportType === 'self_correction') && (
          <div className="report-section">
            <label className="report-label">대상 공장명 <span className="required">*</span></label>
            <input type="text" className="report-input"
              placeholder="공장명을 입력하세요"
              value={targetFactoryName}
              onChange={(e) => setTargetFactoryName(e.target.value)}
            />
          </div>
        )}

        <div className="report-section">
          <h2 className="report-section-title">신청자 정보</h2>
          <div className="report-field">
            <label className="report-label">회사명 <span className="required">*</span></label>
            <input type="text" className="report-input" placeholder="회사명을 입력하세요"
              value={reporterCompany} onChange={(e) => setReporterCompany(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">사업자번호</label>
            <input type="text" className="report-input" placeholder="000-00-00000 (선택)"
              value={reporterBusinessNumber} onChange={(e) => setReporterBusinessNumber(e.target.value)}/>
            <span className="report-hint">자사 정정·삭제 요청 시 권한 확인용 (선택)</span>
          </div>
          <div className="report-field">
            <label className="report-label">담당자명 <span className="required">*</span></label>
            <input type="text" className="report-input" placeholder="담당자 성함"
              value={reporterName} onChange={(e) => setReporterName(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">이메일 <span className="required">*</span></label>
            <input type="email" className="report-input" placeholder="회신 받을 이메일"
              value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">연락처</label>
            <input type="tel" className="report-input" placeholder="000-0000-0000 (선택)"
              value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)}/>
          </div>
        </div>

        <div className="report-section">
          <h2 className="report-section-title">요청 내용</h2>
          <div className="report-field">
            <label className="report-label">사유 <span className="required">*</span></label>
            <input type="text" className="report-input"
              placeholder="간단한 사유 (예: 폐업, 정보 오류, 노출 거부 등)"
              value={reason} onChange={(e) => setReason(e.target.value)}/>
          </div>
          <div className="report-field">
            <label className="report-label">상세 내용</label>
            <textarea className="report-textarea" rows="6"
              placeholder="구체적인 내용을 입력해주세요 (선택)"
              value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
        </div>

        <div className="report-notice">
          <p>※ 본 폼을 통해 수집된 정보는 요청 처리 목적으로만 사용되며, 처리 완료 후 3년간 보관 후 파기됩니다.</p>
          <p>※ 자세한 내용은 <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('privacy'); }}>개인정보처리방침</a>을 참조하세요.</p>
        </div>

        {errorMsg && <div className="report-error">{errorMsg}</div>}

        <div className="report-actions">
          <button className="report-cancel-btn" onClick={() => onNav?.('home')} disabled={submitting}>취소</button>
          <button className="report-submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '제출 중...' : '제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// GRANTS PAGE — 정부지원사업 전체 목록
// ══════════════════════════════════════════════════════════
// ─── 정부지원금 상세 페이지 ───────────────────────────────────
const GrantDetailPage = ({ item, onBack, authed, onNav }) => {
  const f = _biz(item);
  const dday = calcDday(f.endDate);
  const catStyle = f.cat ? (BIZINFO_CAT_COLOR[f.cat] || { bg: '#f1f5f9', color: '#475569' }) : null;
  const status = !dday || dday.expired
    ? { label: '마감', cls: 'status-closed' }
    : dday.urgent ? { label: '마감임박', cls: 'status-urgent' }
    : { label: '진행중', cls: 'status-active' };
  const desc    = _stripHtml(f.desc);
  const method  = _stripHtml(f.method);
  const contact = _stripHtml(f.contact);
  const [toast, setToast] = React.useState('');
  const [scraped, setScraped] = React.useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => showToast('링크가 복사됐습니다')).catch(() => showToast('복사에 실패했습니다'));
  };

  const period = f.sttDate && f.endDate
    ? `${_fmtDate8(f.sttDate)} ~ ${_fmtDate8(f.endDate)}`
    : f.endDate ? `~ ${_fmtDate8(f.endDate)}` : '';

  return (
    <div className="page grants-detail-page">
      {toast && <div className="grants-toast">{toast}</div>}

      <div className="grants-detail-header">
        <div className="grants-detail-badges">
          {catStyle && <span className="grant-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>{f.cat}</span>}
          <span className={`grants-status-badge ${status.cls}`}>{status.label}</span>
          {dday && !dday.expired && (
            <span className={`grant-dday${dday.urgent ? ' is-urgent' : ''}`}>{dday.label}</span>
          )}
        </div>
        <h1 className="grants-detail-title">{f.title}</h1>
        {f.org && <p className="grants-detail-org">{f.org}</p>}
      </div>

      <div className="grants-detail-body">
        <div className="grants-detail-section">
          <table className="grants-detail-info-table">
            <tbody>
              {f.org     && <tr><th>소관부처</th><td>{f.org}</td></tr>}
              {f.execOrg && <tr><th>사업수행기관</th><td>{f.execOrg}</td></tr>}
              {period    && <tr><th>신청기간</th><td>{period}</td></tr>}
              {f.target  && <tr><th>지원대상</th><td>{f.target}</td></tr>}
              {f.cat     && <tr><th>분야</th><td>{f.cat}</td></tr>}
            </tbody>
          </table>
        </div>

        {desc && (
          <div className="grants-detail-section">
            <h2 className="grants-detail-section-title">사업개요</h2>
            <p className="grants-detail-text">{desc}</p>
          </div>
        )}

        {method && (
          <div className="grants-detail-section">
            <h2 className="grants-detail-section-title">사업신청방법</h2>
            <p className="grants-detail-text">{method}</p>
          </div>
        )}

        {contact && (
          <div className="grants-detail-section">
            <h2 className="grants-detail-section-title">문의처</h2>
            <p className="grants-detail-text">{contact}</p>
          </div>
        )}

        <div className="grants-detail-actions">
          <button className={`grants-detail-btn grants-detail-btn-ghost${scraped ? ' is-scraped' : ''}`} onClick={() => { setScraped(s => !s); showToast(scraped ? '스크랩이 취소됐습니다' : '스크랩됐습니다'); }}>
            {scraped ? '★ 스크랩됨' : '☆ 스크랩'}
          </button>
          <button className="grants-detail-btn grants-detail-btn-ghost" onClick={copyLink}>링크 복사</button>
          <button className="grants-detail-btn grants-detail-btn-ghost" onClick={onBack}>목록으로</button>
          {f.viewUrl && (
            <a href={f.viewUrl} target="_blank" rel="noreferrer" className="grants-detail-btn grants-detail-btn-outline">원문 보기</a>
          )}
          {f.applyUrl && (
            <a href={f.applyUrl} target="_blank" rel="noreferrer" className="grants-detail-btn grants-detail-btn-primary">신청하기</a>
          )}
        </div>
        <p className="biz-grant-source" style={{ marginTop: 24 }}>출처: 중소벤처기업부 기업마당 (bizinfo.go.kr)</p>
      </div>
    </div>
  );
};

// ─── 정부지원금 목록 페이지 ───────────────────────────────────
const GrantsPage = ({ onNav, authed }) => {
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
        const first = await fetchBizInfo({ pageNo: 1, numOfRows: 20, searchLclasId: cat.id, searchRgnCode: rgn.code });
        totalPages = Math.ceil(first.total / 20) || 1;
        first.items.forEach(item => {
          const d = calcDday(_biz(item).endDate);
          if (d && !d.expired) collected.push(item);
        });
      } catch(e) { return; }

      // 나머지 페이지 병렬로 순회 (5개씩 묶어서)
      for (let p = 2; p <= totalPages; p += 5) {
        const batch = [];
        for (let i = p; i < p + 5 && i <= totalPages; i++) {
          batch.push(fetchBizInfo({ pageNo: i, numOfRows: 20, searchLclasId: cat.id, searchRgnCode: rgn.code }).catch(() => ({ items: [] })));
        }
        const results = await Promise.all(batch);
        results.forEach(({ items }) => {
          items.forEach(item => {
            const d = calcDday(_biz(item).endDate);
            if (d && !d.expired) collected.push(item);
          });
        });
        // 수집될 때마다 실시간 반영
        if (collected.length > 0) {
          const sorted = [...collected].sort((a, b) => {
            const da = calcDday(_biz(a).endDate), db = calcDday(_biz(b).endDate);
            const score = d => {
              if (!d || d.expired) return 9999;
              if (d.label === 'D-day') return 0;
              if (d.urgent) return parseInt(d.label.replace('D-','')) || 1;
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
    fetchBizInfo({ pageNo, numOfRows, searchLclasId: cat.id, searchRgnCode: rgn.code })
      .then(({ items, total }) => { setItems(items); setTotal(total); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [catIdx, rgnIdx, pageNo]);

  const totalPages = Math.max(1, Math.ceil(total / numOfRows));
  const handleCat = (idx) => { setCatIdx(idx); setPageNo(1); };
  const handleRgn = (idx) => { setRgnIdx(idx); setPageNo(1); };

  // ── 진행중/마감임박(pinnedItems) 상단 고정 + 현재 페이지 마감 목록 하단 ──
  // 검색어/탭 필터 적용
  const applyFilters = (list) => {
    let r = list;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      r = r.filter(item => {
        const f = _biz(item);
        return (f.title||'').toLowerCase().includes(q) || (f.org||'').toLowerCase().includes(q);
      });
    }
    if (statusFilter === 'urgent') r = r.filter(item => { const d = calcDday(_biz(item).endDate); return d && !d.expired && d.urgent; });
    if (statusFilter === 'closed') r = r.filter(item => { const d = calcDday(_biz(item).endDate); return !d || d.expired; });
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
    displayItems = applyFilters(pinnedItems).filter(item => { const d = calcDday(_biz(item).endDate); return d && d.urgent; });
  } else {
    // 전체: 진행중 상단 고정 + 마감 하단
    const filteredPinned = applyFilters(pinnedItems);
    const filteredClosed = applyFilters(pageClosedItems);
    // 최신순이면 마감도 no 기준 내림차순
    if (sortBy === 'latest') {
      filteredClosed.sort((a,b) => { const ra=_biz(a).no||'', rb=_biz(b).no||''; return rb>ra?1:rb<ra?-1:0; });
    }
    displayItems = [...filteredPinned, ...filteredClosed];
  }

  if (selectedItem) {
    return <GrantDetailPage item={selectedItem} onBack={() => { setSelectedItem(null); window.scrollTo(0, 0); }} authed={authed} onNav={onNav} />;
  }

  return (
    <div className="page grants-page">
      <div className="grants-page-head">
        <h1 className="grants-page-title">정부지원사업</h1>
        <p className="grants-page-sub">제조기업을 위한 정부지원금 · 보조금 정보를 확인하세요</p>
      </div>

      <div className="grants-page-controls">
        {/* 검색창 */}
        <div className="grants-search-wrap">
          <div className="grants-search-box">
            <svg className="grants-search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              className="grants-search-input"
              type="text"
              placeholder="사업명 또는 기관명으로 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="grants-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>
        <div className="grants-filter-row">
          <span className="grants-filter-label">분야</span>
          <div className="grants-cat-tabs">
            {BIZINFO_CATS.map((c, i) => (
              <button key={c.label} className={`grants-cat-tab${catIdx === i ? ' is-active' : ''}`} onClick={() => handleCat(i)}>{c.label}</button>
            ))}
          </div>
        </div>
        <div className="grants-filter-row">
          <span className="grants-filter-label">지역</span>
          <div className="grants-cat-tabs">
            {BIZINFO_RGNS.map((r, i) => (
              <button key={r.label} className={`grants-cat-tab${rgnIdx === i ? ' is-active' : ''}`} onClick={() => handleRgn(i)}>{r.label}</button>
            ))}
          </div>
        </div>
        <div className="grants-filter-row grants-extra-row">
          <div className="grants-status-tabs">
            {STATUS_FILTERS.map(f => (
              <button key={f.id} className={`grants-status-tab${statusFilter === f.id ? ' is-active' : ''}`} onClick={() => setStatusFilter(f.id)}>{f.label}</button>
            ))}
          </div>
          <select className="grants-sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="smart">임박순</option>
            <option value="latest">최신순</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grants-loading">불러오는 중…</div>
      ) : error ? (
        <div className="grants-empty">데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>
      ) : displayItems.length === 0 ? (
        <div className="grants-empty">해당 조건의 지원사업이 없습니다.</div>
      ) : (
        <>
          <div className="grants-list-wrap">
            <table className="grants-table">
              <thead>
                <tr>
                  <th className="gt-no">순번</th>
                  <th className="gt-cat">분야</th>
                  <th className="gt-title">제목</th>
                  <th className="gt-period">신청기간</th>
                  <th className="gt-org">소관기관</th>
                  <th className="gt-views">조회수</th>
                  <th className="gt-status">상태</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, i) => {
                  const f = _biz(item);
                  const dday = calcDday(f.endDate);
                  const catLabel = f.cat;
                  const catStyle = catLabel ? (BIZINFO_CAT_COLOR[catLabel] || { bg: '#f1f5f9', color: '#475569' }) : null;
                  const status = !dday || dday.expired
                    ? { label: '마감', cls: 'status-closed' }
                    : dday.urgent ? { label: '마감임박', cls: 'status-urgent' }
                    : { label: '진행중', cls: 'status-active' };
                  const rowNum = total ? total - (pageNo - 1) * numOfRows - i : (pageNo - 1) * numOfRows + i + 1;
                  const period = f.sttDate && f.endDate
                    ? `${_fmtDate8(f.sttDate)} ~ ${_fmtDate8(f.endDate)}`
                    : f.endDate
                      ? `~ ${_fmtDate8(f.endDate)}`
                      : f.regDate
                        ? `등록 ${_fmtDate8(f.regDate)}`
                        : '-';
                  const views = _hashViews(f.no).toLocaleString();
                  return (
                    <tr key={f.no || i} className={`grants-table-row${(!dday || dday.expired) ? " is-closed" : ""}`} onClick={() => setSelectedItem(item)}>
                      <td className="gt-no">{rowNum}</td>
                      <td className="gt-cat">
                        {catStyle && <span className="grant-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>{catLabel}</span>}
                      </td>
                      <td className="gt-title">{f.title || '(제목 없음)'}</td>
                      <td className="gt-period">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <span>{period}</span>
                          {dday && !dday.expired && (
                            <span className={`grant-dday${dday.urgent ? ' is-urgent' : ''}`} style={{ fontSize: 11, width: 'fit-content' }}>{dday.label}</span>
                          )}
                        </div>
                      </td>
                      <td className="gt-org">{f.org}</td>
                      <td className="gt-views">{views}</td>
                      <td className="gt-status">
                        <span className={`grants-status-badge ${status.cls}`}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="grants-pagination">
              <button className="grants-page-btn" disabled={pageNo <= 1}
                onClick={() => { setPageNo(p => p - 1); window.scrollTo(0, 0); }}>이전</button>
              <span className="grants-page-info">{pageNo} / {totalPages}</span>
              <button className="grants-page-btn" disabled={pageNo >= totalPages}
                onClick={() => { setPageNo(p => p + 1); window.scrollTo(0, 0); }}>다음</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

Object.assign(window, { GrantsHomeSection, GrantsPage, GrantCard, BizGrantCard, GrantDetailPage });

// SiteFooter — 출처 표기 + 법적 링크
// ──────────────────────────────────────────────────────────
const SiteFooter = ({ onNav }) => (
  <footer className="site-footer">
    <div className="site-footer-content">
      <div className="site-footer-info">
        <p>본 사이트는 공공데이터포털의 공개정보를 기반으로 운영됩니다.</p>
        <p>정보의 정정·삭제 요청은 <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('report'); }}>여기</a>에서 가능합니다.</p>
      </div>
      <div className="site-footer-meta">
        <p>주식회사 올뷰코리아 © 2026</p>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('terms'); }}>이용약관</a>
          {' · '}
          <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('privacy'); }}>개인정보처리방침</a>
          {' · '}
          <a href="#" onClick={(e) => { e.preventDefault(); onNav?.('report'); }}>정정/삭제 요청</a>
        </p>
      </div>
    </div>
  </footer>
);

Object.assign(window, { TermsPage, PrivacyPage, ReportPage, SiteFooter });

