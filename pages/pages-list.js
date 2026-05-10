// ══════════════════════════════════════════════════════════
// GRANTS SHARED
// ══════════════════════════════════════════════════════════

const GRANT_CATS = ['전체', '설비투자', '수출지원', '고용', '기술개발', '기타'];
const GRANT_CAT_COLOR = {
  설비투자: { bg: '#eff6ff', color: '#1d4ed8' },
  수출지원: { bg: '#f0fdf4', color: '#15803d' },
  고용:     { bg: '#fdf4ff', color: '#7e22ce' },
  기술개발: { bg: '#fff7ed', color: '#c2410c' },
  기타:     { bg: '#f1f5f9', color: '#64748b' },
};

function calcDday(deadline) {
  if (!deadline) return null;
  // Handle both YYYY-MM-DD and YYYYMMDD
  const normalized = String(deadline).length === 8
    ? `${deadline.slice(0,4)}-${deadline.slice(4,6)}-${deadline.slice(6,8)}`
    : deadline;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(normalized + 'T00:00:00'); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff < 0) return { label: '마감', urgent: false, expired: true };
  if (diff === 0) return { label: 'D-day', urgent: true, expired: false };
  return { label: `D-${diff}`, urgent: diff <= 7, expired: false };
}

function _stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 날짜 문자열을 YYYYMMDD 8자리로 정규화 (YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD 모두 처리)
function _normDate(v) {
  if (!v) return '';
  const s = String(v).trim();
  // YYYY-MM-DD 또는 YYYY/MM/DD
  const m = s.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})/);
  if (m) return m[1] + m[2] + m[3];
  // YYYYMMDD
  if (/^\d{8}$/.test(s)) return s;
  return '';
}

function _biz(item) {
  // reqstBeginEndDe: "20260101~20260531" 또는 "2026.01.01~2026.05.31" 형태 파싱
  let combinedStt = '', combinedEnd = '';
  if (item.reqstBeginEndDe) {
    const raw = String(item.reqstBeginEndDe);
    const parts = raw.split(/[~\-]/);
    if (parts.length >= 2) {
      combinedStt = _normDate(parts[0].trim());
      combinedEnd = _normDate(parts[parts.length - 1].trim());
    } else {
      combinedEnd = _normDate(raw.trim());
    }
  }

  // 날짜 자동 탐지: YYYYMMDD or YYYY-MM-DD 형식의 필드를 오름차순 정렬해 시작/종료일 추정
  const dateFlds = Object.entries(item)
    .map(([k, v]) => [k, _normDate(v)])
    .filter(([, v]) => v.length === 8)
    .sort(([, a], [, b]) => a < b ? -1 : 1);
  const autoStt = dateFlds[0]?.[1] || '';
  const autoEnd = dateFlds[dateFlds.length - 1]?.[1] || '';

  // 날짜 필드 추출 헬퍼
  const _d = (...keys) => { for (const k of keys) { const v = _normDate(item[k]); if (v) return v; } return ''; };

  return {
    title:    item.pblancNm    || item.pbancNm      || item.bizNm       || item.sprtBizNm   || '',
    org:      item.mnofcDeptNm || item.jrsdInsttNm  || item.instNm      || item.sprtInsttNm || item.orgnNm    || item.deptNm || '',
    execOrg:  item.rcvAcptInsttNm || item.prgrsInsttNm || item.operInsttNm || item.execInsttNm || '',
    cat:      item.bizSectCdNm || item.sprtFldNm    || item.lclasNm     || item.lclasSe     || item.sectNm    || item.fldNm || item.ctgryNm || '',
    desc:     item.bsnsSumryCn || item.pblancDtlCn  || item.smryCn      || item.bizDtlCn    || item.dtlCn     || item.bizOvrvcCn || '',
    method:   item.rcptMthdCdNm|| item.applyMthdNm  || item.rcptMthd    || item.applyMthd   || '',
    contact:  item.mainCntcInsttNm || item.chargerNm || item.cntcNm      || item.telNm       || item.cntcTelno || '',
    target:   item.sprtTrgetNm || item.trgetNm      || item.sprtObjNm   || item.sprtTrget   || '',
    // 신청기간: reqstBeginEndDe(합산필드) 최우선 → 개별 필드 → 자동 탐지
    sttDate:  combinedStt || _d('rcptBgnDe','pbancBgngDt','bizPbancBgngDe','rcptSttDate','sprtSttDate','applyBgngDe','applyStDt','rcptBgngDe','pbancBgngDe','bizApplyBgngDe') || autoStt,
    endDate:  combinedEnd || _d('rcptEndDe','pbancEndDt','bizPbancEndDe','rcptEndDate','sprtEndDate','applyEndDe','applyEdDt','pbancEndDe','bizApplyEndDe') || autoEnd,
    applyUrl: item.pbancUrl    || item.pblancUrl    || item.applyUrl    || item.detailUrl    || item.hmpgUrl   || '',
    viewUrl:  item.pblancUrl   || item.pbancUrl     || item.hmpgUrl     || '',
    no:       item.pblancNo    || item.pblancId     || item.bizId       || item.pbancId      || '',
    regDate:  _d('rgstDt','rgstDate','registDt','creatDt','frstRegistDt'),
  };
}

function _hashViews(id) {
  if (!id) return 120;
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  // 10% 확률로 인기글 (1100~1300), 나머지 50~800
  if (h % 10 === 0) return (h % 200) + 1100;
  return (h % 751) + 50;
}

const GrantCard = ({ g, authed, onNav }) => {
  const dday = calcDday(g.deadline);
  const catStyle = GRANT_CAT_COLOR[g.category] || GRANT_CAT_COLOR['기타'];
  const [gateOpen, setGateOpen] = React.useState(false);

  return (
    <div className="grant-card">
      <div className="grant-card-head">
        <span className="grant-org">{g.organization}</span>
        <span className="grant-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>{g.category}</span>
      </div>
      <h3 className="grant-title">{g.title}</h3>
      <div className="grant-card-foot">
        <div className="grant-meta">
          {g.amount && <span className="grant-amount">{g.amount}</span>}
        </div>
        <div className="grant-foot-right">
          {dday && !dday.expired && (
            <span className={`grant-dday${dday.urgent ? ' is-urgent' : ''}`}>{dday.label}</span>
          )}
          {g.url && (
            authed
              ? <a href={g.url} target="_blank" rel="noreferrer" className="grant-link-btn">자세히 보기</a>
              : <button className="grant-link-btn" onClick={() => setGateOpen(true)}>자세히 보기</button>
          )}
        </div>
      </div>

      {gateOpen && (
        <div className="grant-gate-veil" onClick={() => setGateOpen(false)}>
          <div className="grant-gate-card" onClick={e => e.stopPropagation()}>
            <button className="grant-gate-close" onClick={() => setGateOpen(false)}>✕</button>
            <div className="grant-gate-icon">🔒</div>
            <p className="grant-gate-msg">지원사업 상세 정보는<br/>회원만 확인 가능합니다</p>
            <div className="grant-gate-btns">
              <button className="grant-gate-signup" onClick={() => { setGateOpen(false); onNav?.('signup'); }}>무료로 시작하기</button>
              <button className="grant-gate-login"  onClick={() => { setGateOpen(false); onNav?.('login');  }}>로그인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// 공공데이터 기업마당 API (bizinfo.go.kr)
// ──────────────────────────────────────────────────────────
const _BIZINFO_KEY = '2ca93f3d623e0992d77686cd49e603aa5227eb3bd6ad66243300e10cc6b2b1b7';
const _BIZINFO_URL = 'https://apis.data.go.kr/1421000/bizinfo/pblancBsnsService';

const BIZINFO_CATS = [
  { label: '전체', id: '' },
  { label: '기술', id: '01' },
  { label: '수출', id: '02' },
  { label: '금융', id: '03' },
  { label: '인력', id: '04' },
  { label: '창업', id: '05' },
  { label: '경영', id: '06' },
];

const BIZINFO_CAT_COLOR = {
  '기술': { bg: '#fff7ed', color: '#c2410c' },
  '수출': { bg: '#f0fdf4', color: '#15803d' },
  '금융': { bg: '#eff6ff', color: '#1d4ed8' },
  '인력': { bg: '#fdf4ff', color: '#7e22ce' },
  '창업': { bg: '#fef9c3', color: '#854d0e' },
  '경영': { bg: '#f1f5f9', color: '#475569' },
  '기타': { bg: '#f1f5f9', color: '#475569' },
};

const BIZINFO_RGNS = [
  { label: '전국', code: '' },
  { label: '서울', code: '11' },
  { label: '경기', code: '41' },
  { label: '인천', code: '28' },
  { label: '부산', code: '26' },
  { label: '대구', code: '27' },
  { label: '광주', code: '29' },
  { label: '대전', code: '30' },
  { label: '울산', code: '31' },
  { label: '경남', code: '48' },
  { label: '경북', code: '47' },
  { label: '전남', code: '46' },
  { label: '전북', code: '45' },
  { label: '충남', code: '44' },
  { label: '충북', code: '43' },
  { label: '강원', code: '42' },
  { label: '제주', code: '50' },
];

const STATUS_FILTERS = [
  { id: 'active', label: '진행중' },
  { id: 'urgent', label: '마감임박' },
  { id: 'all',    label: '전체' },
  { id: 'closed', label: '마감' },
];

function _fmtDate8(s) {
  if (!s || String(s).length < 8) return s || '';
  return `${s.slice(0,4)}.${s.slice(4,6)}.${s.slice(6,8)}`;
}

async function fetchBizInfo({ pageNo = 1, numOfRows = 10, searchLclasId = '', searchRgnCode = '' } = {}) {
  const params = new URLSearchParams({
    serviceKey: _BIZINFO_KEY,
    dataType: 'json',
    pageNo: String(pageNo),
    numOfRows: String(numOfRows),
  });
  if (searchLclasId) params.set('searchLclasId', searchLclasId);
  if (searchRgnCode) params.set('searchRgnCode', searchRgnCode);
  const res = await fetch(`${_BIZINFO_URL}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const body = json?.response?.body;
  // body.items.item / body.items / body.item 세 가지 구조 모두 처리
  const raw = body?.items ?? body?.item;
  let items = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw?.item) {
    items = Array.isArray(raw.item) ? raw.item : [raw.item];
  } else if (raw && typeof raw === 'object') {
    items = [raw];
  }
  if (items.length > 0) {
    window._bizInfoRaw = items[0]; // 브라우저 콘솔: _bizInfoRaw 로 확인
    console.log('[BizInfo] 필드명:', Object.keys(items[0]));
    console.log('[BizInfo] 첫 아이템:', items[0]);
  }
  // 마감일 기준 내림차순 정렬: 진행중(미래) 공고가 먼저, 마감(과거) 공고가 나중
  items.sort((a, b) => {
    const ea = _normDate(a.rcptEndDe || a.pbancEndDt || a.rcptEndDate || a.sprtEndDate || '');
    const eb = _normDate(b.rcptEndDe || b.pbancEndDt || b.rcptEndDate || b.sprtEndDate || '');
    if (!ea && !eb) return 0;
    if (!ea) return 1;
    if (!eb) return -1;
    return ea > eb ? -1 : 1;
  });
  return { total: Number(body?.totalCount ?? 0), items };
}

const BizGrantCard = ({ item, authed, onNav, compact }) => {
  // 필드명 변형 대응: 공공데이터포털 API 응답 필드는 버전마다 다를 수 있음
  const title   = item.pblancNm   || item.pbancNm    || item.bizNm      || item.sprtBizNm  || '(제목 없음)';
  const org     = item.mnofcDeptNm|| item.jrsdInsttNm|| item.instNm     || item.sprtInsttNm|| '';
  const catName = item.bizSectCdNm|| item.sprtFldNm  || item.lclasNm    || item.sectNm     || '';
  const desc    = item.bsnsSumryCn|| item.pblancDtlCn|| item.smryCn     || item.bizDtlCn   || '';
  const sttDate = item.rcptSttDate|| item.sprtSttDate|| item.applyStDt  || '';
  const endDate = item.rcptEndDate|| item.sprtEndDate|| item.applyEdDt  || item.pbancEndDt || '';
  const url     = item.pbancUrl   || item.pblancUrl  || item.detailUrl  || item.hmpgUrl    || '';
  const pblancNo= item.pblancNo   || item.pblancId   || item.bizId      || '';

  const dday = calcDday(endDate);
  const catStyle = BIZINFO_CAT_COLOR[catName] || { bg: '#f1f5f9', color: '#475569' };
  const [gateOpen, setGateOpen] = React.useState(false);

  return (
    <div className="grant-card">
      <div className="grant-card-head">
        <span className="grant-org">{org || '중소벤처기업부'}</span>
        {catName && (
          <span className="grant-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>{catName}</span>
        )}
      </div>
      <h3 className="grant-title">{title}</h3>
      {!compact && desc && (
        <p className="grant-desc biz-grant-desc">{desc}</p>
      )}
      {!compact && (sttDate || endDate) && (
        <p className="biz-grant-period">
          {sttDate && endDate
            ? `신청기간: ${_fmtDate8(sttDate)} ~ ${_fmtDate8(endDate)}`
            : endDate ? `마감: ${_fmtDate8(endDate)}` : ''}
        </p>
      )}
      <div className="grant-card-foot">
        <div className="grant-meta"/>
        <div className="grant-foot-right">
          {dday && !dday.expired && (
            <span className={`grant-dday${dday.urgent ? ' is-urgent' : ''}`}>{dday.label}</span>
          )}
          {url && (
            authed
              ? <a href={url} target="_blank" rel="noreferrer" className="grant-link-btn">자세히 보기</a>
              : <button className="grant-link-btn" onClick={() => setGateOpen(true)}>자세히 보기</button>
          )}
        </div>
      </div>
      {!compact && <p className="biz-grant-source">출처: 중소벤처기업부 기업마당 (bizinfo.go.kr)</p>}

      {gateOpen && (
        <div className="grant-gate-veil" onClick={() => setGateOpen(false)}>
          <div className="grant-gate-card" onClick={e => e.stopPropagation()}>
            <button className="grant-gate-close" onClick={() => setGateOpen(false)}>✕</button>
            <div className="grant-gate-icon">🔒</div>
            <p className="grant-gate-msg">지원사업 상세 정보는<br/>회원만 확인 가능합니다</p>
            <div className="grant-gate-btns">
              <button className="grant-gate-signup" onClick={() => { setGateOpen(false); onNav?.('signup'); }}>무료로 시작하기</button>
              <button className="grant-gate-login"  onClick={() => { setGateOpen(false); onNav?.('login'); }}>로그인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GrantsHomeSection = ({ onNav, authed, compact }) => {
  const [items, setItems] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    fetchBizInfo({ pageNo: 1, numOfRows: 10 })
      .then(({ items }) => {
        const getEnd = it => it.rcptEndDate || it.sprtEndDate || it.applyEdDt || it.pbancEndDt || '';
        const sorted = [...items]
          .filter(it => getEnd(it))
          .sort((a, b) => String(getEnd(a)).localeCompare(String(getEnd(b))));
        setItems((sorted.length ? sorted : items).slice(0, 3));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || items.length === 0) return null;
  return (
    <section className={`grants-home-section${compact ? ' is-compact' : ''}`}>
      <div className="grants-home-inner">
        <div className="grants-home-head">
          <h2 className="grants-home-title">제조기업을 위한 정부지원금 · 보조금 정보</h2>
          <button className="grants-all-btn" onClick={() => onNav('grants')}>전체 지원사업 보기 →</button>
        </div>
        <div className="grants-card-grid">
          {items.map((item, i) => (
            <BizGrantCard key={item.pblancNo || i} item={item} authed={authed} onNav={onNav} compact />
          ))}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════
// LIST + MAP
// ══════════════════════════════════════════════════════════

// Persists filter state across unmount/remount (e.g. List → Detail → List)
let _listStateCache = null;

const INDUSTRY_CATS = [
  { id: 'metal',     label: '금속/기계',   industryId: 'machine',
    korKws: ['금속', '기계', '장비', '철강', '1차 금속', '주조', '단조', '프레스', '용접', '도장', '도금', '표면처리', '조선', '자동차', '금형'],
    subs: [
    { id: 'cnc',      label: 'CNC 가공',   pids: ['cnc', 'cutting'] },
    { id: 'press',    label: '프레스',     pids: ['press'] },
    { id: 'welding',  label: '용접',       pids: ['welding'] },
    { id: 'forging',  label: '단조',       pids: [] },
    { id: 'casting',  label: '주조',       pids: [] },
    { id: 'heat',     label: '열처리',     pids: [] },
    { id: 'painting', label: '도장',       pids: ['painting'] },
  ]},
  { id: 'electronics', label: '전자/PCB', industryId: 'electronics',
    korKws: ['전자', '반도체', 'PCB', '전기', '전장', '컴퓨터', '영상', '음향', '통신', '광학기기'],
    subs: [
    { id: 'pcb',      label: 'PCB 조립',  pids: [] },
    { id: 'smt',      label: 'SMT',       pids: [] },
    { id: 'semicon',  label: '반도체',    pids: [] },
    { id: 'eparts',   label: '전장부품',  pids: [] },
  ]},
  { id: 'plastic',   label: '플라스틱/고무', industryId: null,
    korKws: ['플라스틱', '고무', '합성수지', '사출', '압출', '실리콘', '비금속', '유리', '도자'],
    subs: [
    { id: 'injection',label: '사출',      pids: ['injection'] },
    { id: 'mold',     label: '금형',      pids: ['mold'] },
    { id: 'extrusion',label: '압출',      pids: [] },
    { id: 'silicone', label: '실리콘',    pids: [] },
  ]},
  { id: 'textile',   label: '섬유/봉제',  industryId: 'textile',
    korKws: ['섬유', '봉제', '직물', '의류', '의복', '신발', '가죽', '모피', '편직'],
    subs: [
    { id: 'sewing',   label: '봉제',      pids: [] },
    { id: 'dyeing',   label: '나염',      pids: [] },
    { id: 'embroid',  label: '자수',      pids: [] },
    { id: 'notions',  label: '단추/부자재', pids: [] },
    { id: 'knit',     label: '니트',      pids: [] },
  ]},
  { id: 'food',      label: '식품',       industryId: 'food',
    korKws: ['식료품', '식품', '음료', '주류', '담배', '제과', '도축', '수산'],
    subs: [
    { id: 'foodproc', label: '식품가공',  pids: [] },
    { id: 'foodpack', label: '포장',      pids: [] },
    { id: 'foodoem',  label: 'OEM식품',   pids: [] },
    { id: 'haccp',    label: 'HACCP',     pids: [] },
  ]},
  { id: 'chemical',  label: '화학/소재',  industryId: 'chemical',
    korKws: ['화학', '도료', '비료', '의약', '석유', '코크스', '접착', '화장품', '세제'],
    subs: [
    { id: 'plating',  label: '도금',      pids: [] },
    { id: 'coating',  label: '코팅',      pids: [] },
    { id: 'chemproc', label: '화학처리',  pids: [] },
  ]},
  { id: 'wood',      label: '목재/가구',  industryId: null,
    korKws: ['목재', '가구', '나무', '종이', '펄프', '인테리어'],
    subs: [
    { id: 'woodwork', label: '목공',      pids: [] },
    { id: 'furniture',label: '가구',      pids: [] },
    { id: 'interior', label: '인테리어 자재', pids: [] },
  ]},
  { id: 'print',     label: '인쇄/포장',  industryId: null,
    korKws: ['인쇄', '출판', '포장', '라벨'],
    subs: [
    { id: 'printing', label: '인쇄',      pids: [] },
    { id: 'packaging',label: '패키지',    pids: [] },
    { id: 'label',    label: '라벨',      pids: [] },
  ]},
  { id: 'other',     label: '기타',       industryId: null,
    korKws: ['재활용', '폐기물', '수리', '조립'],
    subs: [
    { id: 'assemblyX',label: '조립',      pids: ['assembly'] },
    { id: 'logistics',label: '물류포장',  pids: [] },
    { id: 'etcX',     label: '기타',      pids: [] },
  ]},
];

// Region ID → DB region column values (for Supabase server-side filter)
const _REGION_TO_DB_VALS = {
  seoul:     ['서울특별시'],
  gyeonggi:  ['경기도', 'gyeonggi'],
  incheon:   ['인천광역시'],
  busan:     ['부산광역시'],
  daegu:     ['대구광역시'],
  gyeongnam: ['경상남도', 'gyeongnam'],
  gyeongbuk: ['경상북도'],
  chungnam:  ['충청남도'],
  chungbuk:  ['충청북도'],
  daejeon:   ['대전광역시'],
  sejong:    ['세종특별자치시'],
  gwangju:   ['광주광역시'],
  jeonnam:   ['전라남도'],
  jeonbuk:   ['전북특별자치도', '전라북도'],
  gangwon:   ['강원특별자치도', '강원도'],
  ulsan:     ['울산광역시'],
  jeju:      ['제주특별자치도', '제주도'],
};
const _applyRegionFilter = (q, regionId) => {
  if (regionId === 'other') return q.is('region', null);
  const vals = _REGION_TO_DB_VALS[regionId];
  if (!vals) return q;
  return vals.length === 1 ? q.eq('region', vals[0]) : q.in('region', vals);
};

const _scrollListToTop = () => {
  requestAnimationFrame(() => {
    const el = document.querySelector('.list-results');
    if (el) el.scrollTop = 0;
    else window.scrollTo(0, 0);
  });
};

const ListPage = ({ onOpenFactory, onAddRFQ, rfqIds, density, initialQuery }) => {
  const { PROCESSES } = window.MFG_DATA;
  const [factories, setFactories] = useStateP(() => window._listFactoriesCache || []);
  const [dbLoading, setDbLoading] = useStateP(() => !(window._listFactoriesCache?.length > 0));
  const [dbError, setDbError] = useStateP(null);
  const [dbTotalCount, setDbTotalCount] = useStateP(null);
  const [regionCounts, setRegionCounts] = useStateP({});
  const [geoFactories, setGeoFactories] = useStateP([]);   // geocoded 공장 지도용
  const [regionRows, setRegionRows] = useStateP([]);         // 지역 선택 시 서버사이드 로드
  const [regionLoading, setRegionLoading] = useStateP(false);
  const [showAllRegions, setShowAllRegions] = useStateP(false);
  const mapsKey = useMapsKey();

  // Restore filter state from cache, unless this is a fresh search from home
  const _prevInitialQuery = _listStateCache?.initialQuery;
  const _freshSearch = !!(initialQuery && initialQuery !== _prevInitialQuery);
  const [query, setQuery] = useStateP(_freshSearch ? initialQuery : (_listStateCache?.query ?? initialQuery ?? ''));
  const [activeProcess, setActiveProcess] = useStateP(_freshSearch ? 'all' : (_listStateCache?.activeProcess ?? 'all'));
  const [activeRegion, setActiveRegion] = useStateP(_freshSearch ? 'all' : (_listStateCache?.activeRegion ?? 'all'));
  const [moqMax, setMoqMax] = useStateP(_freshSearch ? 10000 : (_listStateCache?.moqMax ?? 10000));
  const [oemOnly, setOemOnly] = useStateP(_freshSearch ? false : (_listStateCache?.oemOnly ?? false));
  const [exportOnly, setExportOnly] = useStateP(_freshSearch ? false : (_listStateCache?.exportOnly ?? false));
  const [sort, setSort] = useStateP(_freshSearch ? 'match' : (_listStateCache?.sort ?? 'match'));
  const [hovered, setHovered] = useStateP(null);
  const [selected, setSelected] = useStateP(null);
  const [page, setPage] = useStateP(_freshSearch ? 1 : (_listStateCache?.page ?? 1));
  const PAGE_SIZE = 20;

  // Accordion state: which sections are open
  const [openSections, setOpenSections] = useStateP(() => new Set(['region', 'industry']));
  const toggleSection = (id) => setOpenSections(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  // Industry filter & category expand state
  const [activeIndustry, setActiveIndustry] = useStateP('all');
  const [openCats, setOpenCats] = useStateP(() => new Set());
  const toggleCat = (id) => setOpenCats(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const selectIndustry = (id) => {
    setActiveIndustry(prev => prev === id ? 'all' : id);
    // auto-expand the parent category when picking a subcategory
    for (const c of INDUSTRY_CATS) {
      if (c.id === id) { setOpenCats(prev => { const n = new Set(prev); n.add(id); return n; }); break; }
      if (c.subs.some(s => s.id === id)) { setOpenCats(prev => { const n = new Set(prev); n.add(c.id); return n; }); break; }
    }
  };

  useEffectP(() => {
    if (!window._sb) { setDbLoading(false); return; }
    let mounted = true;
    const PAGE = 1000;
    const MAX_LOAD = 2000; // 2페이지 로드 (쿼리 횟수 감소)

    // Fetch total DB count separately
    window._sb.from('factories').select('id', { count: 'estimated', head: true })
      .then(({ count }) => { if (mounted && count != null) setDbTotalCount(count); })
      .catch(() => {});

    const loadPage = async (from, acc) => {
      // WHERE 절 없이 PK 순 정렬 → 플래너가 반드시 PK 인덱스 사용
      // hidden 필터는 클라이언트에서 처리
      const { data, error } = await window._sb
        .from('factories').select('*')
        .order('completeness_score', { ascending: false })
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1);
      if (!mounted) return;
      if (error) { setDbError(error.message); setDbLoading(false); return; }
      if (!data || data.length === 0) {
        setFactories(acc.length > 0 ? acc : window.MFG_DATA.FACTORIES);
        setDbLoading(false);
        return;
      }
      // hidden=true 클라이언트 필터링
      const mapped = data.filter(r => !r.hidden).map(window._dbRowToFactory);
      const next = [...acc, ...mapped];
      if (data.length < PAGE || next.length >= MAX_LOAD) {
        const sorted = next.slice().sort((a, b) =>
          (b.completeness_score || 0) - (a.completeness_score || 0) ||
          (b.enrichedScore || 0) - (a.enrichedScore || 0) ||
          (b.rating || 0) - (a.rating || 0)
        );
        setFactories(sorted);
        setDbLoading(false);
        if (mounted) {
          const counts = {};
          sorted.forEach(f => { if (f.region) counts[f.region] = (counts[f.region] || 0) + 1; });
          setRegionCounts(counts);
        }
      } else {
        loadPage(from + PAGE, next);
      }
    };

    loadPage(0, []);
    return () => { mounted = false; };
  }, []);

  // 지도 핀 로드 — activeRegion 변경 시 재쿼리
  // 지역 선택: region + coord_x IS NOT NULL 조건으로 전체 페이지네이션 (제한 없음)
  // 전체 보기: 1,000개 제한 (전체 DB 규모 대비 합리적 샘플)
  useEffectP(() => {
    if (!window._sb) return;
    let mounted = true;
    setGeoFactories([]);

    if (activeRegion === 'all') {
      window._sb.from('factories').select('*')
        .not('coord_x', 'is', null).not('coord_y', 'is', null)
        .limit(1000)
        .then(({ data }) => {
          if (mounted && data) setGeoFactories(data.map(window._dbRowToFactory).filter(f => f.coord != null));
        }).catch(() => {});
    } else {
      const GEO_PAGE = 1000;
      const loadGeoPage = async (from, acc) => {
        let q = window._sb.from('factories').select('*')
          .not('coord_x', 'is', null).not('coord_y', 'is', null)
          .order('completeness_score', { ascending: false })
          .order('id', { ascending: true })
          .range(from, from + GEO_PAGE - 1);
        q = _applyRegionFilter(q, activeRegion);
        const { data, error } = await q;
        if (!mounted) return;
        if (error || !data || data.length === 0) {
          setGeoFactories(acc.map(window._dbRowToFactory).filter(f => f.coord != null));
          return;
        }
        const next = [...acc, ...data];
        if (data.length < GEO_PAGE) {
          setGeoFactories(next.map(window._dbRowToFactory).filter(f => f.coord != null));
        } else {
          loadGeoPage(from + GEO_PAGE, next);
        }
      };
      loadGeoPage(0, []);
    }

    return () => { mounted = false; };
  }, [activeRegion]);

  // 지역 필터 선택 시 서버사이드 데이터 로드 (최대 5,000개)
  useEffectP(() => {
    if (!window._sb || activeRegion === 'all') {
      setRegionRows([]);
      setRegionLoading(false);
      return;
    }
    let mounted = true;
    setRegionLoading(true);
    setRegionRows([]);
    const PAGE = 1000;
    const MAX = 5000;
    const loadPage = async (from, acc) => {
      let q = window._sb.from('factories').select('*')
        .eq('hidden', false)
        .order('completeness_score', { ascending: false })
        .order('id', { ascending: true })
        .range(from, from + PAGE - 1);
      q = _applyRegionFilter(q, activeRegion);
      const { data, error } = await q;
      if (!mounted) return;
      if (error || !data || data.length === 0) {
        setRegionRows(acc.map(window._dbRowToFactory));
        setRegionLoading(false);
        return;
      }
      const next = [...acc, ...data];
      if (data.length < PAGE || next.length >= MAX) {
        setRegionRows(next.map(window._dbRowToFactory));
        setRegionLoading(false);
      } else {
        loadPage(from + PAGE, next);
      }
    };
    loadPage(0, []);
    return () => { mounted = false; };
  }, [activeRegion]);

  // 지역별 카운트 — get_region_counts() RPC 함수 단일 호출 (정확한 집계)
  useEffectP(() => {
    if (!window._sb) return;
    window._sb.rpc('get_region_counts')
      .then(({ data, error }) => {
        if (error || !data) return;
        const counts = {};
        data.forEach(row => { counts[row.region_id] = Number(row.cnt); });
        setRegionCounts(counts);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemoP(() => {
    // Resolve industry filter
    let industryPids = null;
    let industryId   = null;
    let catKorKws    = [];   // 한글 키워드 (KICOX 공장 매칭용)
    if (activeIndustry !== 'all') {
      const cat = INDUSTRY_CATS.find(c => c.id === activeIndustry);
      if (cat) {
        industryPids = cat.subs.flatMap(s => s.pids);
        industryId   = cat.industryId;
        catKorKws    = cat.korKws || [];
      } else {
        for (const c of INDUSTRY_CATS) {
          const sub = c.subs.find(s => s.id === activeIndustry);
          if (sub) {
            industryPids = sub.pids;
            industryId   = null;
            catKorKws    = c.korKws || [];   // 서브카테고리는 부모 키워드 사용
            break;
          }
        }
      }
    }

    const KNOWN_REGIONS = new Set(['seoul','gyeonggi','incheon','busan','daegu','gyeongnam','gyeongbuk','chungnam','chungbuk','daejeon','sejong','gwangju','jeonnam','jeonbuk','gangwon','ulsan','jeju']);
    // 지역 선택 시 서버사이드 로드된 regionRows 사용, 전체는 클라이언트 캐시 factories 사용
    const source = activeRegion !== 'all' ? regionRows : factories;
    let arr = source.filter(f => {
      if (f.hidden) return false;
      if (activeProcess !== 'all' && !f.processes.includes(activeProcess)) return false;
      if (activeRegion === 'other') {
        if (KNOWN_REGIONS.has(f.region)) return false;
      } else if (activeRegion !== 'all' && f.region !== activeRegion) return false;
      if (f.moq > moqMax) return false;
      if (oemOnly && !f.oem) return false;
      if (exportOnly && !f.export) return false;
      if (industryPids !== null || industryId !== null || catKorKws.length > 0) {
        // 1) process ID 매칭 (영문 샘플 공장)
        const pidMatch = industryPids && industryPids.length > 0
          && industryPids.some(p => (f.processes || []).includes(p));
        // 2) industries 영문 ID 매칭 (영문 샘플 공장)
        const indMatch = industryId && (f.industries || []).includes(industryId);
        // 3) 한글 키워드 매칭: industries 배열 또는 summary 텍스트 (KICOX 공장)
        const korMatch = catKorKws.length > 0 && (
          (f.industries || []).some(ind => catKorKws.some(kw => ind.includes(kw))) ||
          catKorKws.some(kw => (f.summary || '').includes(kw))
        );
        if (!pidMatch && !indMatch && !korMatch) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const hay = ((f.name || '') + (f.en || '') + (f.city || '') + (f.summary || '') + (f.materials || []).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sort === 'response') arr.sort((a, b) => a.responseHr - b.responseHr);
    else if (sort === 'deals') arr.sort((a, b) => b.deals - a.deals);
    else arr.sort((a, b) => (b.rating * 50 + b.deals / 10) - (a.rating * 50 + a.deals / 10));
    return arr;
  }, [factories, regionRows, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query, activeIndustry]);

  // 지도 핀: 현재 페이지에 보이는 공장만 표시 + 결과 없으면 빈 배열
  const filteredGeoFactories = React.useMemo(() => {
    if (filtered.length === 0) return []; // 결과 없으면 핀 없애기
    // 현재 페이지 공장 중 좌표 있는 것 + geoFactories에서 현재 필터된 공장만
    const filteredIds = new Set(filtered.map(f => f.id));
    return geoFactories.filter(f => filteredIds.has(f.id));
  }, [geoFactories, filtered]);

  useEffectP(() => { setPage(1); }, [activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, query, activeIndustry]);

  useEffectP(() => {
    _listStateCache = { initialQuery, query, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, page };
  }, [query, activeProcess, activeRegion, moqMax, oemOnly, exportOnly, sort, page]);

  // factories 데이터 캐시 저장
  useEffectP(() => {
    if (factories.length > 0) window._listFactoriesCache = factories;
  }, [factories]);

  // 목록으로 돌아왔을 때 페이지 번호 복원
  useEffectP(() => {
    if (window._listPageCache && window._listPageCache > 1) {
      setPage(window._listPageCache);
      window._listPageCache = null;
    } else {
      _scrollListToTop();
    }
  }, []);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedFactory = selected ? filtered.find(f => f.id === selected) : null;

  const hasFilter = !!(query || activeProcess !== 'all' || activeRegion !== 'all' || oemOnly || exportOnly || activeIndustry !== 'all');
  const otherFiltersActive = !!(query || activeProcess !== 'all' || oemOnly || exportOnly || activeIndustry !== 'all');
  // 지역만 선택됐을 때 → RPC 집계 카운트 표시 (DB 전체 기준)
  // 지역 + 다른 필터 → 클라이언트 필터된 카운트
  const displayTotal = (activeRegion !== 'all' && !otherFiltersActive)
    ? (regionCounts[activeRegion] ?? filtered.length)
    : hasFilter ? filtered.length : (dbTotalCount ?? factories.length);

  return (
    <div className="page page-list">
      {/* Sub-search bar */}
      <div className="list-search">
        <div className="list-search-input">
          <Icon name="search" size={16} stroke={2}/>
          <input
            placeholder="가공방식 · 소재 · 제품 · 회사명"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="ls-clear" onClick={() => setQuery('')}>
              <Icon name="close" size={12} stroke={2}/>
            </button>
          )}
        </div>
        <div className="list-search-chips">
          <Chip active={activeProcess === 'all'} onClick={() => setActiveProcess('all')}>전체</Chip>
          {PROCESSES.slice(0, 6).map(p => (
            <Chip
              key={p.id}
              active={activeProcess === p.id}
              onClick={() => setActiveProcess(activeProcess === p.id ? 'all' : p.id)}
            >
              {p.label}
            </Chip>
          ))}
          <div className="chip-sep"/>
          <Chip active={oemOnly} onClick={() => setOemOnly(!oemOnly)}>OEM</Chip>
          <Chip active={exportOnly} onClick={() => setExportOnly(!exportOnly)}>수출 가능</Chip>
        </div>
      </div>

      <div className="list-shell">
        {/* Left: filters + list */}
        <div className="list-left">
          <aside className="filters acc-filters">

            {/* ── 지역 ── */}
            <div className={`acc-section ${openSections.has('region') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('region')}>
                <span className="acc-title">지역</span>
                {activeRegion !== 'all' && <span className="acc-active-dot"/>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  <button className="acc-reset-link" onClick={() => setActiveRegion('all')} disabled={activeRegion === 'all'}>초기화</button>
                  <div className="filters-radios">
                    {(() => {
                      const ALL_REGIONS = [
                        { id: 'all',       label: '전국' },
                        { id: 'seoul',     label: '서울' },
                        { id: 'gyeonggi',  label: '경기' },
                        { id: 'incheon',   label: '인천' },
                        { id: 'busan',     label: '부산' },
                        { id: 'daegu',     label: '대구' },
                        { id: 'gyeongnam', label: '경남' },
                        { id: 'gyeongbuk', label: '경북' },
                        { id: 'chungnam',  label: '충남' },
                        { id: 'chungbuk',  label: '충북' },
                        { id: 'daejeon',   label: '대전' },
                        { id: 'sejong',    label: '세종' },
                        { id: 'gwangju',   label: '광주' },
                        { id: 'jeonnam',   label: '전남' },
                        { id: 'jeonbuk',   label: '전북' },
                        { id: 'gangwon',   label: '강원' },
                        { id: 'ulsan',     label: '울산' },
                        { id: 'jeju',      label: '제주' },
                        { id: 'other',     label: '기타' },
                      ];
                      const DEFAULT_COUNT = 6; // 전국 포함 기본 표시 개수
                      const needExpand = !showAllRegions && !ALL_REGIONS.slice(0, DEFAULT_COUNT).some(r => r.id === activeRegion);
                      const expanded = showAllRegions || needExpand;
                      const visible = expanded ? ALL_REGIONS : ALL_REGIONS.slice(0, DEFAULT_COUNT);
                      const otherCount = dbTotalCount != null
                        ? Math.max(0, dbTotalCount - Object.values(regionCounts).reduce((s, c) => s + c, 0))
                        : null;
                      return (<>
                        {visible.map(r => (
                      <label key={r.id} className={`filter-radio ${activeRegion === r.id ? 'is-active' : ''}`}>
                        <input type="radio" checked={activeRegion === r.id} onChange={() => setActiveRegion(r.id)}/>
                        <span className="filter-radio-dot"/>
                        <span>{r.label}</span>
                        <span className="filter-radio-count">
                          {r.id === 'all'
                            ? (dbTotalCount ?? factories.length).toLocaleString()
                            : r.id === 'other'
                              ? (otherCount ?? '').toLocaleString()
                              : (regionCounts[r.id] ?? factories.filter(f => f.region === r.id).length).toLocaleString()
                          }
                        </span>
                      </label>
                        ))}
                        <button
                          className="acc-reset-link"
                          style={{ marginTop: 4 }}
                          onClick={() => setShowAllRegions(v => !v)}
                        >
                          {expanded ? '접기 ▲' : `더보기 ▼ (${ALL_REGIONS.length - DEFAULT_COUNT}개)`}
                        </button>
                      </>);
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 업종/공장 종류 ── */}
            <div className={`acc-section ${openSections.has('industry') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('industry')}>
                <span className="acc-title">업종/공장 종류</span>
                {activeIndustry !== 'all' && <span className="acc-active-dot"/>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  {activeIndustry !== 'all' && (
                    <button className="acc-reset-link" onClick={() => setActiveIndustry('all')}>전체 보기</button>
                  )}
                  {INDUSTRY_CATS.map(cat => (
                    <div key={cat.id} className="ind-cat">
                      <div className="ind-cat-header">
                        <button
                          className={`ind-cat-label ${activeIndustry === cat.id ? 'is-active' : ''}`}
                          onClick={() => selectIndustry(cat.id)}
                        >
                          {cat.label}
                        </button>
                        <button
                          className={`ind-cat-expand ${openCats.has(cat.id) ? 'is-open' : ''}`}
                          onClick={() => toggleCat(cat.id)}
                          aria-label="소분류 펼치기"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                      </div>
                      <div className={`ind-subs ${openCats.has(cat.id) ? 'is-open' : ''}`}>
                        <div className="ind-subs-inner">
                          {cat.subs.map(sub => (
                            <button
                              key={sub.id}
                              className={`ind-sub ${activeIndustry === sub.id ? 'is-active' : ''}`}
                              onClick={() => selectIndustry(sub.id)}
                            >
                              <span className="ind-sub-dot"/>
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── MOQ ── */}
            <div className={`acc-section ${openSections.has('moq') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('moq')}>
                <span className="acc-title">최소 주문 수량 (MOQ)</span>
                {moqMax < 10000 && <span className="acc-val-badge">≤ {moqMax.toLocaleString()}</span>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  <div className="acc-moq-val">≤ {moqMax.toLocaleString()}</div>
                  <input
                    type="range"
                    className="filter-range"
                    min="50" max="10000" step="50"
                    value={moqMax}
                    onChange={(e) => setMoqMax(+e.target.value)}
                  />
                  <div className="filter-range-labels">
                    <span>50</span><span>10,000+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 인증 ── */}
            <div className={`acc-section ${openSections.has('cert') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('cert')}>
                <span className="acc-title">인증</span>
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  {['ISO 9001', 'IATF 16949', 'KC', 'CE', 'HACCP'].map(c => (
                    <label key={c} className="filter-check">
                      <input type="checkbox"/>
                      <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 리드타임 ── */}
            <div className={`acc-section ${openSections.has('lead') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('lead')}>
                <span className="acc-title">리드타임</span>
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  {['7일 이내', '14일 이내', '30일 이내', '협의'].map(c => (
                    <label key={c} className="filter-check">
                      <input type="checkbox"/>
                      <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 기타 필터 ── */}
            <div className={`acc-section ${openSections.has('misc') ? 'acc-open' : ''}`}>
              <button className="acc-header" onClick={() => toggleSection('misc')}>
                <span className="acc-title">기타 필터</span>
                {(oemOnly || exportOnly) && <span className="acc-active-dot"/>}
                <svg className="acc-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className="acc-body">
                <div className="acc-body-inner">
                  <label className="filter-check">
                    <input type="checkbox" checked={oemOnly} onChange={() => setOemOnly(!oemOnly)}/>
                    <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                    <span>OEM 가능</span>
                  </label>
                  <label className="filter-check">
                    <input type="checkbox" checked={exportOnly} onChange={() => setExportOnly(!exportOnly)}/>
                    <span className="filter-check-box"><Icon name="check" size={10} stroke={3}/></span>
                    <span>수출 가능</span>
                  </label>
                </div>
              </div>
            </div>

          </aside>

          <div className="list-results">
            {dbError && (
              <div className="list-db-error">Supabase 오류: {dbError}</div>
            )}
            <div className="list-results-head">
              <div>
                <strong>{(dbLoading || regionLoading) ? '…' : displayTotal.toLocaleString()}</strong>개 중{' '}
                <span className="results-range">
                  {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                </span>
              </div>
              <div className="list-results-sort">
                <span>정렬</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="match">매칭도순</option>
                  <option value="rating">평점순</option>
                  <option value="response">응답속도순</option>
                  <option value="deals">거래량순</option>
                </select>
              </div>
            </div>
            <div className="list-results-grid">
              {dbLoading && paginated.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="list-result-wrap">
                      <ManufacturerCardSkeleton />
                    </div>
                  ))
                : paginated.map(f => (
                    <div
                      key={f.id}
                      onMouseEnter={() => setHovered(f.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(f.id)}
                      className={`list-result-wrap ${selected === f.id ? 'is-active' : ''}`}
                    >
                      <ManufacturerCard
                        f={f}
                        onOpen={(id) => {
                          if (!window._factoryCache) window._factoryCache = {};
                          window._factoryCache[id] = f;
                          window._listPageCache = page;
                          onOpenFactory(id);
                        }}
                        density={density}
                        simplified
                        onAddRFQ={onAddRFQ}
                        rfqIds={rfqIds}
                      />
                    </div>
                  ))
              }
            </div>
            {!dbLoading && filtered.length === 0 && (
              <div className="list-empty">
                <Icon name="search" size={36} stroke={1.4}/>
                <p className="list-empty-msg">
                  {query ? `'${query}'에 해당하는 제조사가 없습니다.` : '조건에 맞는 제조사가 없습니다.'}
                </p>
                <p className="list-empty-sub">찾으시는 제조사가 없으신가요? 견적 요청을 남겨주시면 전문 매칭팀이 직접 찾아드립니다.</p>
                <div className="list-empty-actions">
                  <button className="btn btn-primary" onClick={() => { window.location.hash = 'rfq'; }}>견적 요청하기</button>
                  {query && (
                    <button className="btn btn-ghost" onClick={() => setQuery('')}>검색어 초기화</button>
                  )}
                </div>
              </div>
            )}
            {pageCount > 1 && (
              <div className="list-pagination">
                <button className="pg-btn" onClick={() => { setPage(p => Math.max(1, p - 1)); _scrollListToTop(); }} disabled={page === 1}>
                  <Icon name="arrow_left" size={14} stroke={2}/>
                  이전
                </button>
                <div className="pg-nums">
                  {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
                    const n = pageCount <= 7 ? i + 1
                      : page <= 4 ? i + 1
                      : page >= pageCount - 3 ? pageCount - 6 + i
                      : page - 3 + i;
                    return (
                      <button key={n} className={`pg-num ${page === n ? 'is-active' : ''}`} onClick={() => { setPage(n); _scrollListToTop(); }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
                <button className="pg-btn" onClick={() => { setPage(p => Math.min(pageCount, p + 1)); _scrollListToTop(); }} disabled={page === pageCount}>
                  다음
                  <Icon name="arrow_right" size={14} stroke={2}/>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: map */}
        <div className="list-map">
          <ListMapPanel
            geoFactories={filteredGeoFactories}
            pagedFactories={paginated}
            selectedFactory={selectedFactory}
            mapsKey={mapsKey}
            onOpenFactory={onOpenFactory}
          />
          {selectedFactory && (
            <div className="map-side">
              <div className="map-side-body">
                <div className="map-side-row">
                  <h3>{selectedFactory.name}</h3>
                  {selectedFactory.rating > 0 && (
                    <div className="mcard-rating">
                      <Icon name="star" size={11} stroke={2}/>
                      <strong>{selectedFactory.rating}</strong>
                    </div>
                  )}
                </div>
                <p className="map-side-sub">
                  <Icon name="pin" size={11} stroke={2}/>
                  {_addrCity(selectedFactory.roadAddress) || selectedFactory.city}
                </p>
                <p className="map-side-desc">{selectedFactory.summary || '견적 문의 가능한 제조사입니다'}</p>
                <div className="map-side-stats">
                  <div><span>MOQ</span><strong>{(selectedFactory.moq ?? 0).toLocaleString()} {selectedFactory.moqUnit || '피스'}</strong></div>
                  <div><span>리드타임</span><strong>{selectedFactory.leadDays > 0 ? selectedFactory.leadDays + '일' : '−'}</strong></div>
                  {selectedFactory.responseHr > 0 && selectedFactory.responseHr < 24 && (
                    <div><span>응답</span><strong>{selectedFactory.responseHr}h</strong></div>
                  )}
                </div>
                <div className="map-side-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    if (!window._factoryCache) window._factoryCache = {};
                    window._factoryCache[selectedFactory.id] = selectedFactory;
                    onOpenFactory(selectedFactory.id);
                  }}>
                    상세 보기
                  </button>
                  <button
                    className={`btn btn-primary ${rfqIds.includes(selectedFactory.id) ? 'is-added' : ''}`}
                    onClick={() => onAddRFQ(selectedFactory.id)}
                  >
                    {rfqIds.includes(selectedFactory.id) ? <><Icon name="check" size={13} stroke={2.4}/> 견적함</> : <><Icon name="plus" size={13} stroke={2.4}/> 견적 요청</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

