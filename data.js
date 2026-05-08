// 제조 카테고리 + 제조사 데이터 픽스처

const INDUSTRIES = [
  { id: 'machine', label: '기계 / 부품', en: 'Machinery' },
  { id: 'electronics', label: '전자 / 전기', en: 'Electronics' },
  { id: 'chemical', label: '화학 / 소재', en: 'Materials' },
  { id: 'food', label: '식품 / 패키징', en: 'Food & Packaging' },
  { id: 'textile', label: '섬유 / 의류', en: 'Textile' },
];

const PROCESSES = [
  { id: 'cnc', label: 'CNC 가공', en: 'CNC Machining' },
  { id: 'injection', label: '사출', en: 'Injection Molding' },
  { id: 'press', label: '프레스', en: 'Pressing' },
  { id: 'mold', label: '금형', en: 'Mold' },
  { id: 'cutting', label: '절삭', en: 'Cutting' },
  { id: 'welding', label: '용접', en: 'Welding' },
  { id: 'painting', label: '도장', en: 'Painting' },
  { id: 'assembly', label: '조립', en: 'Assembly' },
];

const PRODUCTS = [
  { id: 'auto', label: '자동차 부품' },
  { id: 'case', label: '케이스' },
  { id: 'pcb', label: 'PCB' },
  { id: 'package', label: '포장용기' },
  { id: 'machine_parts', label: '기계부품' },
];

// 제조사 데이터 — 안산/시흥/김해/창원/인천 등 한국 제조 도시
// 좌표는 한국 지도 placeholder 안 (0~100 정규화)에 핀 찍을 용도로 단순화
const FACTORIES = [
  {
    id: 'f1', name: '대성정밀공업', en: 'Daesung Precision',
    city: '경기 안산시', region: 'gyeonggi',
    coord: { x: 38, y: 32 }, // placeholder map coord
    industries: ['machine'],
    processes: ['cnc', 'cutting', 'assembly'],
    products: ['auto', 'machine_parts'],
    materials: ['알루미늄', 'SUS304', '황동'],
    moq: 100, moqUnit: '피스', leadDays: 14,
    priceRange: '₩2,500 — ₩18,000',
    employees: 42, founded: 2008,
    certs: ['ISO 9001', 'IATF 16949'],
    oem: true, odm: true, export: true,
    rating: 4.8, reviews: 124, responseHr: 2,
    deals: 312,
    hidden: false,
    summary: '자동차 정밀부품 18년차. 현대모비스·한국타이어 협력사. 알루미늄·SUS 5축 가공 전문.',
    image: '#a8b4c8',
  },
  {
    id: 'f2', name: '한울사출', en: 'Hanwool Injection',
    city: '경기 시흥시', region: 'gyeonggi',
    coord: { x: 36, y: 35 },
    industries: ['electronics', 'machine'],
    processes: ['injection', 'mold', 'assembly'],
    products: ['case', 'package'],
    materials: ['ABS', 'PC', 'PP', 'POM'],
    moq: 1000, moqUnit: '피스', leadDays: 21,
    priceRange: '₩180 — ₩2,400',
    employees: 28, founded: 2012,
    certs: ['ISO 9001', 'KC'],
    oem: true, odm: false, export: true,
    rating: 4.6, reviews: 87, responseHr: 4,
    deals: 198,
    hidden: false,
    summary: '소형 가전 케이스·전자제품 하우징 전문. 자체 금형실 보유. 100t~450t 사출기 12대 운영.',
    image: '#b8c0a8',
  },
  {
    id: 'f3', name: '진영금속', en: 'Jinyoung Metal',
    city: '경남 창원시', region: 'gyeongnam',
    coord: { x: 64, y: 76 },
    industries: ['machine'],
    processes: ['press', 'welding', 'painting'],
    products: ['auto', 'machine_parts'],
    materials: ['SS400', 'SUS304', '냉연강판'],
    moq: 500, moqUnit: '피스', leadDays: 18,
    priceRange: '₩800 — ₩9,500',
    employees: 65, founded: 1998,
    certs: ['ISO 9001', 'ISO 14001', 'IATF 16949'],
    oem: true, odm: true, export: true,
    rating: 4.7, reviews: 156, responseHr: 3,
    deals: 421,
    hidden: false,
    summary: '창원 산업단지 28년 프레스·용접 전문. 200t~600t 프레스 8대. 자동차 차체부품 주력.',
    image: '#c8b8a8',
  },
  {
    id: 'f4', name: '코리아PCB', en: 'Korea PCB',
    city: '인천 남동구', region: 'incheon',
    coord: { x: 32, y: 33 },
    industries: ['electronics'],
    processes: ['assembly', 'cnc'],
    products: ['pcb'],
    materials: ['FR-4', 'CEM-3', '알루미늄 PCB'],
    moq: 50, moqUnit: '피스', leadDays: 10,
    priceRange: '₩1,200 — ₩45,000',
    employees: 38, founded: 2015,
    certs: ['ISO 9001', 'UL', 'KC'],
    oem: true, odm: true, export: true,
    rating: 4.9, reviews: 92, responseHr: 1,
    deals: 245,
    hidden: false,
    summary: '양면·다층 PCB 전문. SMT 라인 4개. 시제품 5일 양산 10일.',
    image: '#a8c0b8',
  },
  {
    id: 'f5', name: '동방화학', en: 'Dongbang Chemical',
    city: '울산 남구', region: 'ulsan',
    coord: { x: 73, y: 70 },
    industries: ['chemical'],
    processes: ['painting'],
    products: ['package', 'machine_parts'],
    materials: ['에폭시', '우레탄', '아크릴'],
    moq: 200, moqUnit: 'kg', leadDays: 12,
    priceRange: '₩3,200 — ₩12,000',
    employees: 22, founded: 2010,
    certs: ['ISO 14001'],
    oem: false, odm: true, export: false,
    rating: 4.4, reviews: 41, responseHr: 6,
    deals: 89,
    hidden: false,
    summary: '산업용 도장·코팅 전문. 분체도장 라인 3대. 자동차·산업기계 부품 도장.',
    image: '#c0a8b8',
  },
  {
    id: 'f6', name: '신한패키지', en: 'Shinhan Package',
    city: '경기 안산시', region: 'gyeonggi',
    coord: { x: 39, y: 33 },
    industries: ['food'],
    processes: ['injection', 'press'],
    products: ['package'],
    materials: ['PET', 'PP', 'PE', '종이'],
    moq: 5000, moqUnit: '피스', leadDays: 14,
    priceRange: '₩45 — ₩890',
    employees: 31, founded: 2005,
    certs: ['HACCP', 'ISO 22000', 'KC'],
    oem: true, odm: true, export: true,
    rating: 4.5, reviews: 73, responseHr: 5,
    deals: 167,
    hidden: false,
    summary: '식품용 포장용기 21년. HACCP 인증. 화장품·식품 OEM 다수.',
    image: '#b0a8c0',
  },
  {
    id: 'f7', name: '대한섬유', en: 'Daehan Textile',
    city: '경기 양주시', region: 'gyeonggi',
    coord: { x: 41, y: 28 },
    industries: ['textile'],
    processes: ['cutting', 'assembly'],
    products: ['case'],
    materials: ['면', '폴리에스터', '나일론'],
    moq: 300, moqUnit: '벌', leadDays: 21,
    priceRange: '₩2,800 — ₩28,000',
    employees: 19, founded: 2014,
    certs: ['OEKO-TEX'],
    oem: true, odm: true, export: true,
    rating: 4.3, reviews: 38, responseHr: 8,
    deals: 64,
    hidden: true,
    summary: '의류·가방 OEM. 소량 다품종 가능. 샘플 5일.',
    image: '#a8b0c0',
  },
  {
    id: 'f8', name: '경남CNC', en: 'Gyeongnam CNC',
    city: '경남 김해시', region: 'gyeongnam',
    coord: { x: 71, y: 78 },
    industries: ['machine'],
    processes: ['cnc', 'cutting'],
    products: ['machine_parts', 'auto'],
    materials: ['알루미늄', 'SUS304', 'SUS316', '티타늄'],
    moq: 50, moqUnit: '피스', leadDays: 12,
    priceRange: '₩4,500 — ₩45,000',
    employees: 17, founded: 2016,
    certs: ['ISO 9001'],
    oem: true, odm: false, export: true,
    rating: 4.7, reviews: 56, responseHr: 2,
    deals: 142,
    hidden: false,
    summary: '5축 CNC 6대. 항공·의료기기 정밀부품. 시제품 3일.',
    image: '#b8c8b0',
  },
  {
    id: 'f9', name: '서원몰드', en: 'Seowon Mold',
    city: '경기 부천시', region: 'gyeonggi',
    coord: { x: 35, y: 31 },
    industries: ['machine', 'electronics'],
    processes: ['mold', 'cnc', 'injection'],
    products: ['case', 'machine_parts'],
    materials: ['NAK80', 'SKD61', 'P20'],
    moq: 1, moqUnit: '세트', leadDays: 35,
    priceRange: '₩2,800,000 — ₩45,000,000',
    employees: 24, founded: 2002,
    certs: ['ISO 9001'],
    oem: true, odm: true, export: true,
    rating: 4.8, reviews: 64, responseHr: 4,
    deals: 178,
    hidden: false,
    summary: '플라스틱 사출 금형 24년. 가전·전장 금형 주력. 일본 수출 실적.',
    image: '#c8b0a8',
  },
  {
    id: 'f10', name: '광명용접', en: 'Gwangmyeong Welding',
    city: '경기 광명시', region: 'gyeonggi',
    coord: { x: 37, y: 32 },
    industries: ['machine'],
    processes: ['welding', 'cutting', 'assembly'],
    products: ['machine_parts'],
    materials: ['SS400', 'SUS304', 'AL6061'],
    moq: 10, moqUnit: '피스', leadDays: 7,
    priceRange: '₩12,000 — ₩280,000',
    employees: 14, founded: 2018,
    certs: ['KS B 0885'],
    oem: true, odm: false, export: false,
    rating: 4.5, reviews: 29, responseHr: 3,
    deals: 87,
    hidden: true,
    summary: 'TIG·MIG·로봇용접. 산업기계 프레임·구조물. 소량 단납기 강점.',
    image: '#b0c0a8',
  },
  {
    id: 'f11', name: '부산전자', en: 'Busan Electronics',
    city: '부산 강서구', region: 'busan',
    coord: { x: 70, y: 80 },
    industries: ['electronics'],
    processes: ['assembly', 'injection'],
    products: ['pcb', 'case'],
    materials: ['FR-4', 'ABS', 'PC'],
    moq: 100, moqUnit: '피스', leadDays: 18,
    priceRange: '₩3,500 — ₩38,000',
    employees: 47, founded: 2007,
    certs: ['ISO 9001', 'KC', 'CE', 'FCC'],
    oem: true, odm: true, export: true,
    rating: 4.6, reviews: 108, responseHr: 3,
    deals: 256,
    hidden: false,
    summary: 'IoT 디바이스·소형가전 EMS. PCBA + 케이스 + 조립 일괄. 글로벌 인증 다수.',
    image: '#a8c8c0',
  },
  {
    id: 'f12', name: '평택프레스', en: 'Pyeongtaek Press',
    city: '경기 평택시', region: 'gyeonggi',
    coord: { x: 41, y: 38 },
    industries: ['machine'],
    processes: ['press', 'mold', 'painting'],
    products: ['auto'],
    materials: ['SPCC', 'SPHC', 'SUS304'],
    moq: 1000, moqUnit: '피스', leadDays: 21,
    priceRange: '₩320 — ₩4,800',
    employees: 53, founded: 2003,
    certs: ['ISO 9001', 'IATF 16949', 'ISO 14001'],
    oem: true, odm: false, export: true,
    rating: 4.7, reviews: 134, responseHr: 4,
    deals: 389,
    hidden: false,
    summary: '자동차 부품 프레스 23년. 100t~800t 프레스 14대. 현대·기아 1차벤더.',
    image: '#c0c8a8',
  },
];

// 카테고리 카드용 (메인 페이지)
const CATEGORY_CARDS = [
  { process: 'cnc', count: 284, hot: true },
  { process: 'injection', count: 196, hot: true },
  { process: 'press', count: 142, hot: false },
  { process: 'mold', count: 87, hot: false },
  { process: 'welding', count: 118, hot: false },
  { process: 'painting', count: 64, hot: false },
];

// 인기 검색어
const TRENDING_SEARCHES = [
  'CNC + 알루미늄', '사출 + 케이스', '금형 + 자동차 부품',
  'PCB + SMT', '프레스 + SUS', '도장 + 분체',
];

window.MFG_DATA = {
  INDUSTRIES, PROCESSES, PRODUCTS, FACTORIES, CATEGORY_CARDS, TRENDING_SEARCHES,
};

// Supabase DB row → JS factory object
window._latLngToSvg = (lat, lng) => {
  // 실제 위경도(한국 범위) → SVG 0-100 좌표 변환
  const x = Math.max(0, Math.min(100, (lng - 124.0) / (130.5 - 124.0) * 100));
  const y = Math.max(0, Math.min(100, (38.6 - lat) / (38.6 - 33.0) * 100));
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
};

// DB에 저장된 한글 지역명 → 영문 필터 ID 변환 (시/도 단위 세분화)
window._REGION_NORM = {
  // ── 실제 DB 저장값 (정확 매칭) ──────────────────────────────
  '서울특별시':     'seoul',
  '경기도':         'gyeonggi',
  '인천광역시':     'incheon',
  '부산광역시':     'busan',
  '대구광역시':     'daegu',
  '경상남도':       'gyeongnam',
  '경상북도':       'gyeongbuk',
  '충청남도':       'chungnam',
  '충청북도':       'chungbuk',
  '대전광역시':     'daejeon',
  '세종특별자치시': 'sejong',
  '광주광역시':     'gwangju',
  '전라남도':       'jeonnam',
  '전북특별자치도': 'jeonbuk',   // 구 전라북도 → 2023년 특별자치도로 개편
  '강원특별자치도': 'gangwon',
  '울산광역시':     'ulsan',
  '제주특별자치도': 'jeju',
  // ── DB에 소수 존재하는 레거시 영문 값 ────────────────────────
  'gyeonggi':       'gyeonggi',
  'gyeongnam':      'gyeongnam',
  // ── 구 행정명 (데이터 혼재 대비) ─────────────────────────────
  '전라북도':       'jeonbuk',
  '강원도':         'gangwon',
  '제주도':         'jeju',
};

window._dbRowToFactory = (row) => {
  let coord = null;
  let geoLat = null;
  let geoLng = null;
  if (row.coord_x != null && row.coord_y != null) {
    // enrich_geocode.py 기준: coord_x=경도(lng), coord_y=위도(lat)
    const lat = Number(row.coord_y);
    const lng = Number(row.coord_x);
    const inKorea = lat >= 33.0 && lat <= 38.9 && lng >= 124.5 && lng <= 132.0;
    if (inKorea) {
      geoLat = lat;
      geoLng = lng;
      coord = lng > 100
        ? window._latLngToSvg(lat, lng)
        : { x: lng, y: lat };
    }
  }
  const rawRegion = row.region || '';
  let regionId = window._REGION_NORM[rawRegion];
  if (!regionId && rawRegion) {
    // 혹시 "경기도 수원시" 형태로 저장된 경우 프리픽스 매칭 (안전망)
    const keys = Object.keys(window._REGION_NORM).sort((a, b) => b.length - a.length);
    const hit = keys.find(k => rawRegion.startsWith(k + ' '));
    regionId = hit ? window._REGION_NORM[hit] : '';  // 미매핑 → '' (기타)
  }
  regionId = regionId || '';  // null/undefined → '' (기타)
  return ({
  id: row.id,
  name: row.name || '',
  en: row.en || '',
  city: row.city || '',
  region: regionId,       // 영문 필터 ID (gyeonggi, busan 등)
  regionRaw: rawRegion,   // 원본 한글 (카드 표시용)
  coord,
  lat: geoLat,
  lng: geoLng,
  address: row.address || '',
  roadAddress: row.road_address || '',
  phone: row.phone || '',
  website: row.website || '',
  industries: row.industries || [],
  processes: row.processes || [],
  products: row.products || [],
  materials: row.materials || [],
  moq: row.moq ?? null,
  moqUnit: row.moq_unit || '피스',
  leadDays: row.lead_days ?? null,
  priceRange: row.price_range || '',
  employees: row.employees ?? null,
  founded: row.founded ?? null,
  certs: row.certs || [],
  oem: !!row.oem,
  odm: !!row.odm,
  export: !!row.export,
  rating: row.rating || 0,
  reviews: row.reviews || 0,
  responseHr: row.response_hr || 24,
  deals: row.deals || 0,
  enrichedScore: row.enriched_score || 0,
  hidden: !!row.hidden,
  summary: row.summary || '',
  image: row.image || '#a8b4c8',
  businessNumber: row.business_number || '',
  isCorporate: !!row.is_corporate,
  businessStatus: row.business_status || '',
}); };

