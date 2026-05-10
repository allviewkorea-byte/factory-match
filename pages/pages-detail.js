// ══════════════════════════════════════════════════════════
// FACTORY DETAIL
// ══════════════════════════════════════════════════════════

// Module-level Maps key cache (fetched once per page session)
let _mapsKey = null;
let _mapsKeyFetch = null;

function useMapsKey() {
  const [key, setKey] = React.useState(_mapsKey);
  React.useEffect(() => {
    if (_mapsKey !== null) { setKey(_mapsKey); return; }
    if (!_mapsKeyFetch) {
      _mapsKeyFetch = fetch('/.netlify/functions/get-maps-key')
        .then(r => r.json())
        .then(d => { _mapsKey = d.key || ''; return _mapsKey; })
        .catch(() => { _mapsKey = ''; return ''; });
    }
    _mapsKeyFetch.then(k => setKey(k));
  }, []);
  return key;
}

const MAPS_ENABLED = true; // Set to true when Maps API is authorized

function FactoryMap({ addr, name, lat, lng }) {
  const key = useMapsKey();
  if (MAPS_ENABLED && key) {
    // 좌표가 있으면 정확한 핀 고정 (주소 텍스트는 인근 장소로 오인될 수 있음)
    const q = (lat != null && lng != null)
      ? encodeURIComponent(`${lat},${lng}`)
      : encodeURIComponent(addr || name);
    const mapsLink = (lat != null && lng != null)
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr || name)}`;
    return (
      <div className="factory-map">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&language=ko`}
          className="factory-map-iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${name} 위치`}
        />
        <a href={mapsLink} target="_blank" rel="noreferrer" className="factory-map-link">
          Google 지도에서 보기
        </a>
      </div>
    );
  }
  return (
    <div className="factory-map-placeholder">
      <Icon name="pin" size={16} stroke={1.6}/>
      <span>지도 준비 중</span>
    </div>
  );
}

// ── 공장 히어로 이미지: Street View → Static Map → 색상 박스 ─────────────────
const GMAPS_KEY = (window._env || {}).GOOGLE_MAPS_API_KEY || '';

const FactoryHeroImg = ({ f }) => {
  const addr = (f.address || '').trim();
  const [src,  setSrc]  = React.useState(null);   // null=로딩중
  const [type, setType] = React.useState(null);   // 'sv'|'map'|'color'

  React.useEffect(() => {
    if (!addr) { setType('color'); return; }
    let cancelled = false;

    // Street View 메타데이터로 영상 존재 여부 확인 (무료 API)
    fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${encodeURIComponent(addr)}&key=${GMAPS_KEY}`
    )
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        if (d.status === 'OK') {
          setSrc(`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(addr)}&fov=90&pitch=0&key=${GMAPS_KEY}`);
          setType('sv');
        } else {
          setSrc(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(addr)}&zoom=16&size=800x400&maptype=roadmap&markers=color:0x3b82f6|${encodeURIComponent(addr)}&scale=2&key=${GMAPS_KEY}`);
          setType('map');
        }
      })
      .catch(() => { if (!cancelled) setType('color'); });

    return () => { cancelled = true; };
  }, [addr]);

  // Street View 로드 실패 시 지도로 폴백
  const onImgError = () => {
    if (type === 'sv') {
      setSrc(`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(addr)}&zoom=16&size=800x400&maptype=roadmap&markers=color:0x3b82f6|${encodeURIComponent(addr)}&scale=2&key=${GMAPS_KEY}`);
      setType('map');
    } else {
      setType('color');
    }
  };

  if (type === 'color' || (!addr && type !== 'sv' && type !== 'map')) {
    return (
      <div className="detail-hero-img" style={{ background: getCardBg(f) }}>
        <div className="mcard-icon detail-hero-icon">{getCardIcon(f)}</div>
        <div className="mcard-img-stripes"/>
      </div>
    );
  }

  // 로딩 중 (메타데이터 확인 전) — 색상 박스 임시 표시
  if (!src) {
    return (
      <div className="detail-hero-img" style={{ background: getCardBg(f) }}>
        <div className="mcard-icon detail-hero-icon">{getCardIcon(f)}</div>
        <div className="mcard-img-stripes"/>
      </div>
    );
  }

  return (
    <div className="detail-hero-img" style={{ background: '#e8edf2', padding: 0 }}>
      <img
        src={src}
        alt={f.name}
        onError={onImgError}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div className="detail-hero-img-label">
        {type === 'sv' ? 'STREET VIEW' : '지도'}
      </div>
    </div>
  );
};

const DetailPage = ({ factoryId, onBack, onAddRFQ, rfqIds, onChat, onReport, backLabel }) => {
  const { FACTORIES, PROCESSES, PRODUCTS, INDUSTRIES } = window.MFG_DATA;

  const _fromCacheOrFixture = (id) =>
    (window._factoryCache?.[id]) || FACTORIES.find(x => x.id === id) || null;

  const [resolvedFactory, setResolvedFactory] = useStateP(() => _fromCacheOrFixture(factoryId));
  const [detailLoading, setDetailLoading] = useStateP(() => !_fromCacheOrFixture(factoryId));

  useEffectP(() => {
    // 캐시는 초기 렌더용으로만 사용, 항상 DB에서 최신 데이터 재조회
    let cancelled = false;
    window._sb.from('factories').select('*').eq('id', factoryId).single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (data && !error) {
          const factory = window._dbRowToFactory(data);
          if (!window._factoryCache) window._factoryCache = {};
          window._factoryCache[factoryId] = factory;
          setResolvedFactory(factory);
        } else {
          const fallback = _fromCacheOrFixture(factoryId);
          if (fallback) setResolvedFactory(fallback);
        }
        setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [factoryId]);

  const f = resolvedFactory || FACTORIES[0];
  const [tab, setTab] = useStateP('overview');
  const isSample = /^f(\d+)$/.test(f.id) && parseInt(f.id.slice(1)) <= 14;

  const procLabels = f.processes.map(p => PROCESSES.find(x => x.id === p)?.label).filter(Boolean);
  const prodLabels = f.products.map(p => PRODUCTS.find(x => x.id === p)?.label).filter(Boolean);
  const indLabels = f.industries.map(p => INDUSTRIES.find(x => x.id === p)?.label).filter(Boolean);
  const inRfq = rfqIds.includes(f.id);

  // ── 소유자 편집 상태 ──
  const [isOwner, setIsOwner] = useStateP(false);
  const [showEditModal, setShowEditModal] = useStateP(false);
  const [editForm, setEditForm] = useStateP({});
  const [matInput, setMatInput] = useStateP('');
  const [certInput, setCertInput] = useStateP('');
  const [editSaving, setEditSaving] = useStateP(false);
  const [editToast, setEditToast] = useStateP('');

  // 소유자 확인
  useEffectP(() => {
    setIsOwner(false);
    (async () => {
      try {
        const { data: { user } } = await window._sb.auth.getUser();
        if (!user) return;
        const { data } = await window._sb
          .from('user_profiles')
          .select('factory_id, status')
          .eq('id', user.id)
          .maybeSingle();
        if (data?.factory_id === f.id && data?.status === 'approved') setIsOwner(true);
      } catch {}
    })();
  }, [f.id]);

  const openEditModal = () => {
    setEditForm({
      summary: f.summary || '',
      processes: [...(f.processes || [])],
      materials: [...(f.materials || [])],
      products: [...(f.products || [])],
      moq: f.moq || 1,
      moqUnit: f.moqUnit || '피스',
      leadDays: f.leadDays || 14,
      certs: [...(f.certs || [])],
      oem: !!f.oem,
      odm: !!f.odm,
      export: !!f.export,
      image: f.image || '#a8b4c8',
    });
    setMatInput('');
    setCertInput('');
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      const updates = {
        summary: editForm.summary,
        processes: editForm.processes,
        materials: editForm.materials,
        products: editForm.products,
        moq: Number(editForm.moq) || 1,
        moq_unit: editForm.moqUnit,
        lead_days: Number(editForm.leadDays) || 14,
        certs: editForm.certs,
        oem: editForm.oem,
        odm: editForm.odm,
        export: editForm.export,
        image: editForm.image,
      };
      const { error } = await window._sb.from('factories').update(updates).eq('id', f.id);
      if (error) throw error;
      const updated = {
        ...f,
        summary: editForm.summary,
        processes: editForm.processes,
        materials: editForm.materials,
        products: editForm.products,
        moq: Number(editForm.moq) || 1,
        moqUnit: editForm.moqUnit,
        leadDays: Number(editForm.leadDays) || 14,
        certs: editForm.certs,
        oem: editForm.oem,
        odm: editForm.odm,
        export: editForm.export,
        image: editForm.image,
      };
      setResolvedFactory(updated);
      if (window._factoryCache) window._factoryCache[f.id] = updated;
      setShowEditModal(false);
      setEditToast('공장 정보가 업데이트되었습니다');
      setTimeout(() => setEditToast(''), 3200);
    } catch (e) {
      setEditToast('저장 실패: ' + (e.message || '오류'));
      setTimeout(() => setEditToast(''), 4000);
    }
    setEditSaving(false);
  };

  const toggleChip = (field, id) => setEditForm(prev => ({
    ...prev,
    [field]: prev[field].includes(id) ? prev[field].filter(x => x !== id) : [...prev[field], id],
  }));
  const addFreeChip = (field, val, clearFn) => {
    const v = val.trim();
    if (!v) return;
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].includes(v) ? prev[field] : [...prev[field], v],
    }));
    clearFn('');
  };
  const removeFreeChip = (field, val) => setEditForm(prev => ({
    ...prev,
    [field]: prev[field].filter(x => x !== val),
  }));

  useEffect(() => {
    if (tab === 'reviews' && !isSample) setTab('overview');
    if (tab === 'certs' && f.certs.length === 0 && !isSample) setTab('overview');
    if (tab === 'capability' && procLabels.length === 0 && (f.materials || []).length === 0 && prodLabels.length === 0) setTab('overview');
  }, [factoryId]);

  if (detailLoading) {
    return (
      <div className="page page-detail">
        <div className="detail-loading">
          <div className="detail-loading-spinner"/>
          <span className="detail-loading-text">공장 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-detail">
      <div className="detail-bar">
        <button className="back-btn" onClick={() => { onBack?.(); }}>
          <Icon name="chevron_right" size={14} stroke={2} className="back-arrow"/>
          {backLabel || '제조사 목록으로'}
        </button>
        <div className="detail-bar-actions">
          <button className="icon-btn">
            <Icon name="heart" size={14} stroke={2}/>
            관심 제조사
          </button>
          <button className="icon-btn" onClick={() => onChat?.(f.id)}>
            <Icon name="chat" size={14} stroke={2}/>
            채팅 시작
          </button>
          {isOwner && (
            <button className="icon-btn detail-edit-btn" onClick={openEditModal}>
              <Icon name="user" size={14} stroke={2}/>
              내 공장 정보 수정
            </button>
          )}
          <button className="detail-report-btn" onClick={() => onReport?.({ type: 'factory_issue', factoryId: f.id, factoryName: f.name })}>
            ⚠ 이 정보 신고
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="detail-hero">
        <FactoryHeroImg f={f}/>
        <div className="detail-hero-info">
          <div className="detail-hero-head">
            {f.certs.includes('IATF 16949') && (
              <Badge tone="indigo" icon="badge_check">자동차 인증</Badge>
            )}
            {f.export && (
              <Badge tone="slate" icon="globe">수출 가능</Badge>
            )}
          </div>
          <h1 className="detail-name">{f.name}</h1>
          {f.isCorporate && f.businessNumber && (
            <div className="detail-business-number">
              <span style={{color:'#555'}}>사업자번호 </span>
              {f.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}
              {f.businessStatus === 'active' && (
                <span style={{background:'#e6f4ea',color:'#2d7a3a',borderRadius:'4px',padding:'2px 8px',fontSize:'11px',marginLeft:'8px',fontWeight:'600'}}>등록법인</span>
              )}
            </div>
          )}
          {f.en && <div className="detail-name-en">{f.en}</div>}
          <div className="detail-hero-meta">
            <span><Icon name="pin" size={13} stroke={2}/> {_addrCity(f.roadAddress) || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || f.city || '—'}</span>
            {isSample && f.founded > 0 && (
              <>
                <span className="dot">·</span>
                <span>{f.founded}년 설립 · 직원 {f.employees}명</span>
              </>
            )}
          </div>
          {isSample && (
            <div className="detail-rating">
              <div className="detail-rating-big">
                <Icon name="star" size={16} stroke={2.4}/>
                <strong>{f.rating}</strong>
                <span>/ 5.0</span>
              </div>
              <div className="detail-rating-meta">
                <span>리뷰 {f.reviews}건</span>
                <span className="dot">·</span>
                <span>거래 {f.deals}건</span>
                <span className="dot">·</span>
                <span>응답 평균 {f.responseHr}시간</span>
              </div>
            </div>
          )}

          {isSample && (
            <div className="detail-stats">
              <div className="dstat">
                <Icon name="box" size={14} stroke={2}/>
                <div>
                  <div className="dstat-k">MOQ</div>
                  <div className="dstat-v">{(f.moq ?? 0).toLocaleString()} {f.moqUnit || '피스'}</div>
                </div>
              </div>
              <div className="dstat">
                <Icon name="clock" size={14} stroke={2}/>
                <div>
                  <div className="dstat-k">리드타임</div>
                  <div className="dstat-v">{f.leadDays}일</div>
                </div>
              </div>
              {f.priceRange && (
                <div className="dstat">
                  <Icon name="won" size={14} stroke={2}/>
                  <div>
                    <div className="dstat-k">단가 범위</div>
                    <div className="dstat-v">{f.priceRange}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="detail-cta">
            <button
              className={`btn btn-primary btn-lg ${inRfq ? 'is-added' : ''}`}
              onClick={() => onAddRFQ(f.id)}
            >
              {inRfq ? <><Icon name="check" size={15} stroke={2.4}/> 견적함에 추가됨</> : <><Icon name="plus" size={15} stroke={2.4}/> 견적 요청하기</>}
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => onChat?.(f.id, f)}>
              <Icon name="chat" size={15} stroke={2}/>
              AI 상담
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="detail-tabs">
        {[
          { id: 'overview', label: '회사 개요' },
          ...(procLabels.length > 0 || (f.materials || []).length > 0 || prodLabels.length > 0
            ? [{ id: 'capability', label: '제조 역량' }] : []),
          ...(f.certs.length > 0 || isSample ? [{ id: 'certs', label: '인증·신뢰도' }] : []),
          ...(isSample ? [{ id: 'reviews', label: `리뷰 ${f.reviews}` }] : []),
        ].map(t => (
          <button
            key={t.id}
            className={`detail-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <section className="detail-section">
          {(() => {
            let aiData = null;
            try { aiData = f.ai_summary ? (typeof f.ai_summary === 'string' ? JSON.parse(f.ai_summary) : f.ai_summary) : null; } catch(e) {}
            const intro = aiData?.intro || f.summary;
            const hasAiExtra = aiData && (aiData.products?.length || aiData.equipment?.length || aiData.clients?.length || aiData.certifications?.length || aiData.strengths?.length);
            return (
          <div className={intro || hasAiExtra ? 'detail-grid' : ''}>
            {intro && (
              <div>
                <h3>회사 소개</h3>
                <p className="detail-desc">{intro}</p>
                {hasAiExtra && (
                  <div className="ai-summary-wrap">
                    {aiData.products?.length > 0 && (
                      <div className="ai-summary-block">
                        <span className="ai-summary-label">주요 제품</span>
                        <div className="ai-summary-tags">
                          {aiData.products.map((p,i) => <span key={i} className="ai-tag ai-tag-blue">{p}</span>)}
                        </div>
                      </div>
                    )}
                    {aiData.equipment?.length > 0 && (
                      <div className="ai-summary-block">
                        <span className="ai-summary-label">보유 장비</span>
                        <div className="ai-summary-tags">
                          {aiData.equipment.map((e,i) => <span key={i} className="ai-tag ai-tag-gray">{e}</span>)}
                        </div>
                      </div>
                    )}
                    {aiData.clients?.length > 0 && (
                      <div className="ai-summary-block">
                        <span className="ai-summary-label">납품처</span>
                        <div className="ai-summary-tags">
                          {aiData.clients.map((c,i) => <span key={i} className="ai-tag ai-tag-amber">{c}</span>)}
                        </div>
                      </div>
                    )}
                    {aiData.certifications?.length > 0 && (
                      <div className="ai-summary-block">
                        <span className="ai-summary-label">인증</span>
                        <div className="ai-summary-tags">
                          {aiData.certifications.map((c,i) => <span key={i} className="ai-tag ai-tag-green">{c}</span>)}
                        </div>
                      </div>
                    )}
                    {aiData.strengths?.length > 0 && (
                      <div className="ai-summary-block">
                        <span className="ai-summary-label">강점</span>
                        <div className="ai-summary-tags">
                          {aiData.strengths.map((s,i) => <span key={i} className="ai-tag ai-tag-purple">{s}</span>)}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
            {!intro && !hasAiExtra && null}
            <div className="detail-side">
              <h4>기본 정보</h4>
              <dl className="detail-dl">
                {(f.roadAddress || f.address || f.city) && (
                  <><dt>주소</dt><dd>{f.roadAddress || f.address || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ')}</dd></>
                )}
                {f.phone && <><dt>전화번호</dt><dd>{f.phone}</dd></>}
                {f.website && (
                  <><dt>홈페이지</dt><dd><a href={f.website} target="_blank" rel="noreferrer" className="detail-link">{f.website.replace(/^https?:\/\//, '')}</a></dd></>
                )}
                {f.representative && <><dt>대표자</dt><dd>{f.representative}</dd></>}
                {f.industrial_complex && <><dt>산업단지</dt><dd>{f.industrial_complex}</dd></>}
                {f.building_area != null && <><dt>건축면적</dt><dd>{f.building_area.toLocaleString()} ㎡</dd></>}
                {f.employees > 0 && <><dt>직원수</dt><dd>{f.employees}명</dd></>}
                {f.founded > 0 && <><dt>설립연도</dt><dd>{f.founded}년 ({2026 - f.founded}년차)</dd></>}
                {indLabels.length > 0 && <><dt>산업군</dt><dd>{indLabels.join(', ')}</dd></>}
                {(f.oem || f.odm || f.export) && (
                  <><dt>거래 형태</dt>
                  <dd>
                    {f.oem && <span className="flag">OEM</span>}
                    {f.odm && <span className="flag">ODM</span>}
                    {f.export && <span className="flag flag-export">수출</span>}
                  </dd></>
                )}
              </dl>

              {/* ── DART 재무정보 (데이터 있을 때만 표시) ── */}
              {(f.dart_revenue || f.dart_op_income || f.dart_net_income || f.dart_assets || f.dart_equity) && (
                <div className="dart-finance-wrap">
                  <div className="dart-finance-header">
                    <span className="dart-finance-title">📊 재무정보</span>
                    {f.dart_year && <span className="dart-finance-year">{f.dart_year}년 기준</span>}
                  </div>
                  <dl className="dart-finance-dl">
                    {f.dart_revenue != null && (
                      <div className="dart-finance-item">
                        <dt>매출액</dt>
                        <dd className="dart-finance-val dart-val-blue">
                          {f.dart_revenue >= 1e8
                            ? `${(f.dart_revenue / 1e8).toFixed(1)}억원`
                            : `${(f.dart_revenue / 1e4).toFixed(0)}만원`}
                        </dd>
                      </div>
                    )}
                    {f.dart_op_income != null && (
                      <div className="dart-finance-item">
                        <dt>영업이익</dt>
                        <dd className={`dart-finance-val ${f.dart_op_income >= 0 ? 'dart-val-green' : 'dart-val-red'}`}>
                          {f.dart_op_income >= 0 ? '' : '▼ '}
                          {Math.abs(f.dart_op_income) >= 1e8
                            ? `${(Math.abs(f.dart_op_income) / 1e8).toFixed(1)}억원`
                            : `${(Math.abs(f.dart_op_income) / 1e4).toFixed(0)}만원`}
                        </dd>
                      </div>
                    )}
                    {f.dart_net_income != null && (
                      <div className="dart-finance-item">
                        <dt>당기순이익</dt>
                        <dd className={`dart-finance-val ${f.dart_net_income >= 0 ? 'dart-val-green' : 'dart-val-red'}`}>
                          {f.dart_net_income >= 0 ? '' : '▼ '}
                          {Math.abs(f.dart_net_income) >= 1e8
                            ? `${(Math.abs(f.dart_net_income) / 1e8).toFixed(1)}억원`
                            : `${(Math.abs(f.dart_net_income) / 1e4).toFixed(0)}만원`}
                        </dd>
                      </div>
                    )}
                    {f.dart_assets != null && (
                      <div className="dart-finance-item">
                        <dt>자산총계</dt>
                        <dd className="dart-finance-val">
                          {f.dart_assets >= 1e8
                            ? `${(f.dart_assets / 1e8).toFixed(1)}억원`
                            : `${(f.dart_assets / 1e4).toFixed(0)}만원`}
                        </dd>
                      </div>
                    )}
                    {f.dart_equity != null && (
                      <div className="dart-finance-item">
                        <dt>자본총계</dt>
                        <dd className="dart-finance-val">
                          {f.dart_equity >= 1e8
                            ? `${(f.dart_equity / 1e8).toFixed(1)}억원`
                            : `${(f.dart_equity / 1e4).toFixed(0)}만원`}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <p className="dart-finance-source">출처: 금융감독원 DART 공시정보</p>
                </div>
              )}

              <FactoryMap addr={f.roadAddress || f.address} name={f.name} lat={f.lat} lng={f.lng} />
            </div>

          </div>
            );
          })()}
        </section>
      )}

      {tab === 'capability' && (
        <section className="detail-section">
          <div className="cap-grid">
            {procLabels.length > 0 && (
              <div className="cap-block">
                <h3>가공 방식</h3>
                <div className="cap-tags">
                  {procLabels.map(p => <span key={p} className="cap-tag cap-tag-blue">{p}</span>)}
                </div>
              </div>
            )}
            {(f.materials || []).length > 0 && (
              <div className="cap-block">
                <h3>소재</h3>
                <div className="cap-tags">
                  {f.materials.map(m => <span key={m} className="cap-tag">{m}</span>)}
                </div>
              </div>
            )}
            {prodLabels.length > 0 && (
              <div className="cap-block">
                <h3>생산 가능 제품</h3>
                <div className="cap-tags">
                  {prodLabels.map(p => <span key={p} className="cap-tag cap-tag-amber">{p}</span>)}
                </div>
              </div>
            )}
            {isSample && (
              <div className="cap-block">
                <h3>주요 생산 조건</h3>
                <table className="cap-table">
                  <tbody>
                    <tr><th>최소 주문 (MOQ)</th><td>{(f.moq ?? 0).toLocaleString()} {f.moqUnit || '피스'}</td></tr>
                    <tr><th>리드타임</th><td>{f.leadDays ?? '−'}일 (시제품 별도)</td></tr>
                    {f.priceRange && <tr><th>단가 범위</th><td>{f.priceRange}</td></tr>}
                    <tr><th>샘플</th><td>유료 / 3~5일</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === 'certs' && (
        <section className="detail-section">
          <div className="trust-grid">
            {f.certs.length > 0 && (
              <div className="trust-card">
                <h3>보유 인증</h3>
                <div className="cert-list">
                  {f.certs.map(c => (
                    <div key={c} className="cert-item">
                      <Icon name="badge_check" size={16} stroke={2}/>
                      <div>
                        <div className="cert-item-k">{c}</div>
                        <div className="cert-item-v">유효 · 2027.12 갱신 예정</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isSample && (
              <div className="trust-card">
                <h3>응답·거래 지표</h3>
                <div className="trust-stat">
                  <div className="trust-stat-k">평균 응답 시간</div>
                  <div className="trust-stat-bar">
                    <div className="trust-stat-fill" style={{ width: `${100 - f.responseHr * 10}%` }}/>
                  </div>
                  <div className="trust-stat-v"><strong>{f.responseHr}시간</strong> · 상위 {f.responseHr <= 2 ? '5%' : f.responseHr <= 4 ? '15%' : '30%'}</div>
                </div>
                <div className="trust-stat">
                  <div className="trust-stat-k">누적 거래</div>
                  <div className="trust-stat-bar">
                    <div className="trust-stat-fill" style={{ width: `${Math.min(100, f.deals / 4)}%` }}/>
                  </div>
                  <div className="trust-stat-v"><strong>{f.deals}건</strong> · 최근 12개월 활성</div>
                </div>
                <div className="trust-stat">
                  <div className="trust-stat-k">리뷰 평점</div>
                  <div className="trust-stat-bar">
                    <div className="trust-stat-fill" style={{ width: `${(f.rating / 5) * 100}%` }}/>
                  </div>
                  <div className="trust-stat-v"><strong>{f.rating}/5.0</strong> · {f.reviews}건 검증</div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 토스트 ── */}
      {editToast && (
        <div className={'fe-toast ' + (editToast.includes('실패') ? 'fe-toast-err' : 'fe-toast-ok')}>
          {editToast}
        </div>
      )}

      {/* ── 공장 정보 수정 모달 ── */}
      {showEditModal && (
        <div className="fe-overlay" onClick={() => setShowEditModal(false)}>
          <div className="fe-modal" onClick={e => e.stopPropagation()}>
            <div className="fe-head">
              <h2>내 공장 정보 수정</h2>
              <button className="fe-close" onClick={() => setShowEditModal(false)}>
                <Icon name="close" size={18} stroke={2}/>
              </button>
            </div>

            <div className="fe-body">
              {/* 수정 불가 섹션 */}
              <div className="fe-section">
                <h3 className="fe-section-title">기본 정보 (수정 불가)</h3>
                <div className="fe-readonly-grid">
                  <div className="fe-ro-item">
                    <span className="fe-ro-label">회사명</span>
                    <span className="fe-ro-value">{f.name}</span>
                  </div>
                  {f.businessNumber && (
                    <div className="fe-ro-item">
                      <span className="fe-ro-label">사업자번호</span>
                      <span className="fe-ro-value">{f.businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}</span>
                    </div>
                  )}
                  <div className="fe-ro-item">
                    <span className="fe-ro-label">주소</span>
                    <span className="fe-ro-value">{f.roadAddress || f.address || [f.regionRaw, f.city].filter(s => s && s.trim()).join(' ') || '—'}</span>
                  </div>
                </div>
              </div>

              {/* 회사 소개 */}
              <div className="fe-section">
                <h3 className="fe-section-title">회사 소개</h3>
                <textarea
                  className="fe-textarea"
                  rows={4}
                  value={editForm.summary}
                  onChange={e => setEditForm(p => ({ ...p, summary: e.target.value }))}
                  placeholder="회사 소개를 입력하세요 (100~300자 권장)"
                />
              </div>

              {/* 주요 공정 */}
              <div className="fe-section">
                <h3 className="fe-section-title">주요 공정</h3>
                <div className="fe-chip-grid">
                  {PROCESSES.map(p => (
                    <button
                      key={p.id}
                      className={'fe-chip ' + (editForm.processes?.includes(p.id) ? 'is-on' : '')}
                      onClick={() => toggleChip('processes', p.id)}
                      type="button"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 소재 */}
              <div className="fe-section">
                <h3 className="fe-section-title">주요 소재</h3>
                <div className="fe-free-chips">
                  {(editForm.materials || []).map(m => (
                    <span key={m} className="fe-free-chip">
                      {m}
                      <button className="fe-free-chip-x" onClick={() => removeFreeChip('materials', m)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="fe-chip-input-row">
                  <input
                    className="fe-input"
                    value={matInput}
                    onChange={e => setMatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFreeChip('materials', matInput, setMatInput); } }}
                    placeholder="소재 입력 후 Enter (예: 알루미늄)"
                  />
                  <button className="fe-chip-add-btn" onClick={() => addFreeChip('materials', matInput, setMatInput)}>추가</button>
                </div>
              </div>

              {/* 주요 제품 */}
              <div className="fe-section">
                <h3 className="fe-section-title">주요 제품</h3>
                <div className="fe-chip-grid">
                  {PRODUCTS.map(p => (
                    <button
                      key={p.id}
                      className={'fe-chip ' + (editForm.products?.includes(p.id) ? 'is-on' : '')}
                      onClick={() => toggleChip('products', p.id)}
                      type="button"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 생산 조건 */}
              <div className="fe-section">
                <h3 className="fe-section-title">생산 조건</h3>
                <div className="fe-cond-grid">
                  <label className="fe-field">
                    <span>최소 주문 수량 (MOQ)</span>
                    <input
                      className="fe-input"
                      type="number"
                      min="1"
                      value={editForm.moq}
                      onChange={e => setEditForm(p => ({ ...p, moq: e.target.value }))}
                    />
                  </label>
                  <label className="fe-field">
                    <span>단위</span>
                    <input
                      className="fe-input"
                      value={editForm.moqUnit}
                      onChange={e => setEditForm(p => ({ ...p, moqUnit: e.target.value }))}
                      placeholder="피스"
                    />
                  </label>
                  <label className="fe-field">
                    <span>리드타임 (일)</span>
                    <input
                      className="fe-input"
                      type="number"
                      min="1"
                      value={editForm.leadDays}
                      onChange={e => setEditForm(p => ({ ...p, leadDays: e.target.value }))}
                    />
                  </label>
                </div>
              </div>

              {/* 인증 */}
              <div className="fe-section">
                <h3 className="fe-section-title">보유 인증</h3>
                <div className="fe-free-chips">
                  {(editForm.certs || []).map(c => (
                    <span key={c} className="fe-free-chip">
                      {c}
                      <button className="fe-free-chip-x" onClick={() => removeFreeChip('certs', c)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="fe-chip-input-row">
                  <input
                    className="fe-input"
                    value={certInput}
                    onChange={e => setCertInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFreeChip('certs', certInput, setCertInput); } }}
                    placeholder="인증명 입력 후 Enter (예: ISO 9001)"
                  />
                  <button className="fe-chip-add-btn" onClick={() => addFreeChip('certs', certInput, setCertInput)}>추가</button>
                </div>
              </div>

              {/* 거래 형태 */}
              <div className="fe-section">
                <h3 className="fe-section-title">거래 형태</h3>
                <div className="fe-toggle-row">
                  {[['oem', 'OEM'], ['odm', 'ODM'], ['export', '수출 가능']].map(([key, label]) => (
                    <button
                      key={key}
                      className={'fe-toggle ' + (editForm[key] ? 'is-on' : '')}
                      onClick={() => setEditForm(p => ({ ...p, [key]: !p[key] }))}
                      type="button"
                    >
                      <span className="fe-toggle-dot"/>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 대표 이미지 (색상 코드) */}
              <div className="fe-section">
                <h3 className="fe-section-title">대표 이미지 색상</h3>
                <div className="fe-image-row">
                  <div className="fe-color-preview" style={{ background: editForm.image }}/>
                  <input
                    className="fe-input"
                    value={editForm.image}
                    onChange={e => setEditForm(p => ({ ...p, image: e.target.value }))}
                    placeholder="#a8b4c8"
                  />
                </div>
              </div>
            </div>

            <div className="fe-foot">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>취소</button>
              <button className="btn btn-primary" onClick={saveEdit} disabled={editSaving}>
                {editSaving ? '저장중…' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <section className="detail-section">
          {isSample ? (
            <div className="reviews">
              {[
                { name: '김○○ (전자부품 바이어)', date: '2026.03.18', rating: 5, body: '리드타임 정확하게 지켜주시고, 도면 수정 요청에도 빠르게 대응해주셨습니다. 단가도 합리적이고 다음 발주 예정.', deal: '5,000pcs · ₩12,400,000' },
                { name: '박○○ (가전 OEM)', date: '2026.02.04', rating: 5, body: '소량 시제품도 거절 없이 받아주셔서 좋았습니다. 마감 품질이 특히 만족스럽습니다.', deal: '120pcs · ₩980,000' },
                { name: '이○○ (자동차 부품)', date: '2026.01.22', rating: 4, body: '기본 품질은 좋으나 초기 커뮤니케이션이 다소 느렸습니다. 본 양산은 안정적이었음.', deal: '2,400pcs · ₩4,800,000' },
              ].map((r, i) => (
                <div key={i} className="review">
                  <div className="review-head">
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div className="review-date">{r.date}</div>
                    </div>
                    <div className="review-rating">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Icon key={k} name="star" size={12} stroke={2} className={k < r.rating ? 'star-on' : 'star-off'}/>
                      ))}
                    </div>
                  </div>
                  <p className="review-body">{r.body}</p>
                  <div className="review-deal">{r.deal}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="detail-empty">
              <Icon name="star" size={32} stroke={1.4}/>
              <p>아직 리뷰가 없습니다</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

