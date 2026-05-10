// ══════════════════════════════════════════════════════════
// RFQ
// ══════════════════════════════════════════════════════════
const RfqPage = ({ rfqIds, setRfqIds, onOpenFactory, onNav }) => {
  const { FACTORIES, PROCESSES } = window.MFG_DATA;
  const selected = FACTORIES.filter(f => rfqIds.includes(f.id));
  const [step, setStep] = useStateP(1);
  const [form, setForm] = useStateP({
    title: '',
    qty: '',
    process: 'injection',
    material: '',
    deadline: '',
    budget: '',
    notes: '',
    file: '',
    email: '',
  });
  const [rfqShowExtra, setRfqShowExtra] = useStateP(false);
  const [sending, setSending] = useStateP(false);
  const [sendResult, setSendResult] = useStateP(null);
  const [sentSnapshot, setSentSnapshot] = useStateP(null);

  const dispCount = sendResult?.ok ? sendResult?.count : selected.length;
  const step2Valid = !!(form.title && form.qty && form.deadline && form.email);

  return (
    <div className="page page-rfq">
      <div className="rfq-head">
        <div>
          <h1>견적 요청 (RFQ)</h1>
          <p className="rfq-sub">
            선택한 제조사에 동일한 조건으로 동시 견적을 요청합니다
          </p>
        </div>
        <div className="rfq-stepper">
          {[
            { n: 1, label: '제조사 선택' },
            { n: 2, label: '요청 조건' },
            { n: 3, label: '검토 · 발송' },
          ].map(s => (
            <div key={s.n} className={`rfq-step ${step >= s.n ? 'is-done' : ''} ${step === s.n ? 'is-current' : ''}`}>
              <span className="rfq-step-n">{step > s.n ? <Icon name="check" size={11} stroke={3}/> : s.n}</span>
              <span className="rfq-step-l">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rfq-shell">
        {/* Step body */}
        <div className="rfq-body">
          {step === 1 && (
            <div className="rfq-section">
              <div className="rfq-section-head">
                <h3>선택된 제조사 ({selected.length})</h3>
                <button className="link-btn" onClick={() => onNav('list')}>
                  <Icon name="plus" size={13} stroke={2.2}/> 더 추가하기
                </button>
              </div>
              {selected.length === 0 ? (
                <div className="rfq-empty">
                  <Icon name="factory" size={28} stroke={1.4}/>
                  <h4>아직 선택된 제조사가 없습니다</h4>
                  <p>제조사 탐색에서 카드 좌측 상단의 체크박스로 추가하세요. 최대 10개사까지 동시 요청 가능합니다.</p>
                  <button className="btn btn-primary" onClick={() => onNav('list')}>제조사 탐색으로 이동</button>
                </div>
              ) : (
                <div className="rfq-selected">
                  {selected.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      className="rfq-row rfq-row-clickable"
                      onClick={() => onOpenFactory?.(f.id)}
                    >
                      <div className="rfq-row-img" style={{ background: f.image }}>
                        <div className="mcard-img-stripes"/>
                      </div>
                      <div className="rfq-row-body">
                        <div className="rfq-row-head">
                          <h4>{f.name}</h4>
                          <span className="rfq-row-city">{f.city}</span>
                        </div>
                        <div className="rfq-row-tags">
                          {f.processes.slice(0, 3).map(pid => {
                            const p = PROCESSES.find(x => x.id === pid);
                            return <span key={pid} className="mtag mtag-sm">{p?.label}</span>;
                          })}
                        </div>
                        <div className="rfq-row-stats">
                          {f.moq > 0 && <span>MOQ {f.moq.toLocaleString()} {f.moqUnit || '피스'}</span>}
                          {f.leadDays > 0 && <span>리드 {f.leadDays}일</span>}
                          {f.responseHr > 0 && f.responseHr < 24 && <span>응답 {f.responseHr}h</span>}
                          {f.rating > 0 && <span><Icon name="star" size={10} stroke={2}/> {f.rating}</span>}
                        </div>
                        <div className="rfq-row-cta">
                          <Icon name="arrow_up_right" size={11} stroke={2.2}/> 상세 보기
                        </div>
                      </div>
                      <span
                        className="rfq-row-remove"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRfqIds(rfqIds.filter(x => x !== f.id));
                        }}
                      >
                        <Icon name="close" size={14} stroke={2}/>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="rfq-section">
              <div className="rfq-section-head">
                <h3>요청 조건</h3>
              </div>
              <div className="rfq-form">
                <div className="rfq-field rfq-field-full">
                  <label>제품명 <span className="rfq-required">*</span></label>
                  <input
                    placeholder="예: 알루미늄 CNC 가공 브라켓"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="rfq-field">
                  <label>수량 <span className="rfq-required">*</span></label>
                  <input
                    type="number"
                    placeholder="예: 1000"
                    value={form.qty}
                    onChange={e => setForm({ ...form, qty: e.target.value })}
                  />
                </div>
                <div className="rfq-field">
                  <label>희망 납기 <span className="rfq-required">*</span></label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}/>
                </div>
                <div className="rfq-field rfq-field-full">
                  <label>답변 받을 이메일 <span className="rfq-required">*</span></label>
                  <input
                    type="email"
                    placeholder="company@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="rfq-field rfq-field-full">
                  <button
                    type="button"
                    className="rfq-optional-toggle"
                    onClick={() => setRfqShowExtra(!rfqShowExtra)}
                  >
                    <Icon name={rfqShowExtra ? 'chevron_down' : 'chevron_right'} size={13} stroke={2}/>
                    추가 정보 입력하기 (선택)
                  </button>
                </div>
                {rfqShowExtra && (
                  <>
                    <div className="rfq-field">
                      <label>가공 방식</label>
                      <select value={form.process} onChange={e => setForm({ ...form, process: e.target.value })}>
                        {PROCESSES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                    </div>
                    <div className="rfq-field">
                      <label>주요 소재</label>
                      <input
                        placeholder="예: 알루미늄 6061, ABS"
                        value={form.material}
                        onChange={e => setForm({ ...form, material: e.target.value })}
                      />
                    </div>
                    <div className="rfq-field rfq-field-full">
                      <label>예산 범위</label>
                      <input
                        placeholder="예: ₩5,000,000 — ₩10,000,000"
                        value={form.budget}
                        onChange={e => setForm({ ...form, budget: e.target.value })}
                      />
                    </div>
                    <div className="rfq-field rfq-field-full">
                      <label>요청 내용 / 도면 메모</label>
                      <textarea
                        rows={4}
                        placeholder="표면 처리, 공차 요건, 기타 요청사항을 적어주세요"
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>
                    <div className="rfq-field rfq-field-full">
                      <label>도면 / 시방서 첨부</label>
                      <div className="rfq-file">
                        <Icon name="upload" size={16} stroke={2}/>
                        {form.file
                          ? <>
                              <span className="rfq-file-name">{form.file}</span>
                              <span className="rfq-file-status">
                                <Icon name="check" size={11} stroke={2.4}/> 업로드 완료
                              </span>
                              <button className="rfq-file-replace">교체</button>
                            </>
                          : <span className="rfq-file-name" style={{ color: 'var(--ink-4)' }}>파일 선택 (PDF, STEP, DWG)</span>
                        }
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rfq-section">
              <div className="rfq-section-head">
                <h3>검토 · 발송</h3>
              </div>
              <div className="rfq-review">
                <div className="rfq-review-card">
                  <h4>요청 요약</h4>
                  <dl className="rfq-dl">
                    <dt>제품명</dt><dd>{form.title}</dd>
                    <dt>수량</dt><dd>{form.qty} 피스</dd>
                    <dt>납기</dt><dd>{form.deadline}</dd>
                    {form.material && <><dt>소재</dt><dd>{form.material}</dd></>}
                    {form.budget && <><dt>예산</dt><dd>{form.budget}</dd></>}
                    {form.file && <><dt>첨부</dt><dd>{form.file}</dd></>}
                  </dl>
                </div>
                <div className="rfq-review-card">
                  <h4>발송 대상 ({selected.length}개사)</h4>
                  <ul className="rfq-review-list">
                    {selected.map(f => (
                      <li key={f.id}>
                        <span>{f.name}</span>
                        {f.responseHr > 0 && f.responseHr < 24 && (
                          <span className="hint">예상 응답 {f.responseHr}h 내</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rfq-disclaimer">
                  <Icon name="shield" size={14} stroke={2}/>
                  <span>제조사에는 회사명·연락처가 자동 마스킹된 상태로 발송되며, 응답 후 양 당사자 동의 시 공개됩니다.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <aside className="rfq-side">
          <div className="rfq-side-card">
            <h4>요청 요약</h4>
            <div className="rfq-side-stat">
              <span>선택 제조사</span>
              <strong>{dispCount}곳</strong>
            </div>
            <div className="rfq-side-divider"/>
            <div className="rfq-side-actions">
              {sendResult?.ok ? (
                <button className="btn btn-sent" disabled>
                  <Icon name="check" size={14} stroke={2.4}/> {sendResult?.count}개사 발송완료
                </button>
              ) : (
                <>
                  {step > 1 && (
                    <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                      이전
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      className="btn btn-primary"
                      disabled={step === 1 ? selected.length === 0 : !step2Valid}
                      onClick={() => setStep(step + 1)}
                    >
                      다음 단계 <Icon name="arrow_right" size={14} stroke={2.4}/>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-send"
                      disabled={sending}
                      onClick={async () => {
                        const snap = { count: selected.length };
                        setSending(true);
                        setSendResult(null);
                        try {
                          const resp = await fetch('/.netlify/functions/send-rfq', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              factoryIds: rfqIds,
                              buyerEmail: form.email,
                              productName: form.title,
                              quantity: form.qty ? String(form.qty) + ' 피스' : '수량 미정',
                              deadline: form.deadline,
                              message: [
                                form.material ? '소재: ' + form.material : '',
                                form.budget ? '예산: ' + form.budget : '',
                                form.notes || '',
                              ].filter(Boolean).join('\n') || undefined,
                            }),
                          });
                          if (resp.ok) {
                            await resp.json();
                            setSentSnapshot(snap);
                            setSendResult({ ok: true, count: snap.count });
                            setRfqIds([]);
                          } else {
                            setSendResult({ ok: false });
                          }
                        } catch {
                          setSendResult({ ok: false });
                        } finally {
                          setSending(false);
                        }
                      }}
                    >
                      {sending
                        ? <><span className="rfq-sending-spinner"/>발송 중…</>
                        : <><Icon name="check" size={14} stroke={2.4}/> {dispCount}개사에 발송</>
                      }
                    </button>
                  )}
                  {sendResult?.ok === false && (
                    <div className="rfq-send-result rfq-send-err">
                      발송 중 오류가 발생했습니다. 다시 시도해주세요.
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="rfq-side-tip">
              {sendResult?.ok ? (
                <>
                  <Icon name="clock" size={11} stroke={2}/>
                  <span>영업일 기준 1~2일 내 답변을 받으실 수 있습니다</span>
                </>
              ) : (
                <>
                  <Icon name="sparkle" size={11} stroke={2}/>
                  <span>3개사 이상에 동시 요청 시 평균 단가 <strong>12% 절감</strong></span>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

Object.assign(window, { HomePage, ListPage, DetailPage, RfqPage });


// ──────────────────────────────────────────────────────────
// 검색 UX · 자동추천 ON/OFF 토글 페이지
// ──────────────────────────────────────────────────────────
const { useState: useStateSX, useMemo: useMemoSX, useEffect: useEffectSX, useRef: useRefSX } = React;

// Module-level cache: persists across unmount/remount within the same page session
let _sxStateCache = null;

const SX_RECOMMEND_3 = [
  {
    id: 'metal',
    title: '금속 가공',
    en: 'Metal Fabrication',
    desc: '자판기 외관 캐비닛, 내부 프레임, 동전·지폐 모듈 하우징 등 강판 절단·절곡·용접 일괄 처리.',
    count: 184, match: 96, glyph: 'metal',
    tags: ['프레스', '절곡', '용접', '도장'],
    avgLead: '14일', avgPrice: '₩180k~',
  },
  {
    id: 'electronic',
    title: '전자 제어',
    en: 'Electronic Control',
    desc: '자판기 메인 컨트롤러 PCB, 결제 단말 연동 모듈, 센서·디스플레이 제어 보드 설계·양산.',
    count: 92, match: 91, glyph: 'electronic',
    tags: ['PCB', 'SMT', '펌웨어', 'IoT'],
    avgLead: '21일', avgPrice: '₩4.5k~',
  },
  {
    id: 'assembly',
    title: '기계 조립',
    en: 'Mechanical Assembly',
    desc: '컨베이어·서보모터·솔레노이드 등 구동부 조립 + 최종 자판기 완성품 통합 조립·QA.',
    count: 67, match: 88, glyph: 'assembly',
    tags: ['조립', '검사', '포장', 'OEM'],
    avgLead: '18일', avgPrice: '협의',
  },
];

const SX_ALL_CATEGORIES = [
  { ...SX_RECOMMEND_3[0], rel: 96, popular: true },
  { ...SX_RECOMMEND_3[1], rel: 91, popular: true },
  { ...SX_RECOMMEND_3[2], rel: 88, popular: false },
  { id: 'plastic', title: '플라스틱 사출', en: 'Plastic Injection', desc: '내부 부품 트레이, 컵 디스펜서, 외관 트림 등 ABS·PC 사출 부품.', count: 142, rel: 78, popular: true, glyph: 'plastic', tags: ['사출', '금형', 'ABS', 'PC'] },
  { id: 'cooling', title: '냉각·열교환', en: 'Refrigeration', desc: '음료 냉각 모듈, 컴프레서 유닛, 냉매 시스템 설계·제작 전문.', count: 38, rel: 74, popular: false, glyph: 'cooling', tags: ['냉각기', '열교환기', '컴프레서'] },
  { id: 'sheet', title: '판금 가공', en: 'Sheet Metal', desc: '레이저 절단·절곡·펀칭 기반 자판기 외관 판넬 및 도어 패널.', count: 211, rel: 71, popular: true, glyph: 'sheet', tags: ['레이저', '절곡', '펀칭'] },
  { id: 'display', title: '디스플레이·UI', en: 'Display & UI', desc: '터치 디스플레이, LCD/LED 보드, 키패드 모듈 공급 및 통합.', count: 54, rel: 67, popular: false, glyph: 'display', tags: ['LCD', '터치', '키패드'] },
  { id: 'payment', title: '결제 모듈', en: 'Payment Module', desc: '동전·지폐 인식기, NFC/QR 결제 단말, 카드 리더 모듈 OEM.', count: 23, rel: 62, popular: false, glyph: 'payment', tags: ['NFC', 'QR', '동전인식'] },
  { id: 'paint', title: '도장·코팅', en: 'Painting & Coating', desc: '분체도장, 우레탄 코팅, 실내·옥외용 자판기 외관 마감.', count: 88, rel: 58, popular: false, glyph: 'paint', tags: ['분체도장', '우레탄', '옥외용'] },
];

const SX_RELATED_KEYWORDS = ['제조문의', 'OEM', 'ODM', '샘플제작', '소량생산', '견적요청'];

function scoreFactory(factory, searchTerms) {
  const st = searchTerms || {};
  let score = 0;
  (st.industries || []).forEach(ind => { if ((factory.industries || []).includes(ind)) score += 30; });
  (st.processes || []).forEach(proc => { if ((factory.processes || []).includes(proc)) score += 25; });
  (st.materials || []).forEach(mat => {
    const m = mat.toLowerCase();
    if ((factory.materials || []).some(fm => fm.toLowerCase().includes(m) || m.includes(fm.toLowerCase()))) score += 15;
  });
  (st.keywords || []).forEach(kw => {
    const k = kw.toLowerCase();
    if ((factory.summary || '').toLowerCase().includes(k) || (factory.name || '').includes(kw)) score += 8;
    if ((factory.products || []).some(p => (p || '').toLowerCase().includes(k))) score += 10;
  });
  return score;
}

