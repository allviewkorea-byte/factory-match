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
const FACTORIES = [];

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
  industries: Array.isArray(row.industries) ? row.industries : (row.industries ? [String(row.industries)] : []),
  processes:  Array.isArray(row.processes)  ? row.processes  : (row.processes  ? [String(row.processes)]  : []),
  products:   Array.isArray(row.products)   ? row.products   : (row.products   ? [String(row.products)]   : []),
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
  representative: row.representative || '',
  industrial_complex: row.industrial_complex || '',
  building_area: row.building_area ?? null,
  ai_summary: row.ai_summary || null,
  completeness_score: row.completeness_score || 0,
  bizrno: row.bizrno || '',
  dart_corp_code: row.dart_corp_code || '',
  dart_revenue: row.dart_revenue ?? null,
  dart_op_income: row.dart_op_income ?? null,
  dart_net_income: row.dart_net_income ?? null,
  dart_assets: row.dart_assets ?? null,
  dart_equity: row.dart_equity ?? null,
  dart_year: row.dart_year || '',
}); };

