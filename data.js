// 제조 카테고리 + 제조사 데이터 픽스처

const INDUSTRIES = [
  { id: 'machine', label: '기계 / 부품', en: 'Machinery' },
  { id: 'electronics', label: '전자 / 전기', en: 'Electronics' },
  { id: 'chemical', label: '화학 / 소재', en: 'Materials' },
  { id: 'food', label: '식품 / 패키징', en: 'Food & Packaging' },
  { id: 'textile', label: '섬유 / 의류', en: 'Textile' },
];

// 공정 대분류+소분류 구조
const PROCESS_CATEGORIES = [
  {
    id: 'cutting_machining', label: '절삭/기계가공',
    items: [
      { id: 'cnc', label: 'CNC 가공' },
      { id: 'cutting', label: '절삭 가공' },
      { id: 'lathe', label: '선반 가공' },
      { id: 'milling', label: '밀링 가공' },
      { id: 'grinding', label: '연삭 가공' },
      { id: 'edm', label: '방전 가공(EDM)' },
      { id: 'laser_cut', label: '레이저 커팅' },
      { id: 'waterjet', label: '워터젯' },
      { id: 'plasma_cut', label: '플라즈마 커팅' },
    ]
  },
  {
    id: 'forming', label: '성형/변형',
    items: [
      { id: 'press', label: '프레스' },
      { id: 'forging', label: '단조' },
      { id: 'casting', label: '주조' },
      { id: 'die_casting', label: '다이캐스팅' },
      { id: 'extrusion', label: '압출' },
      { id: 'drawing', label: '인발' },
      { id: 'rolling', label: '압연' },
      { id: 'stamping', label: '스탬핑' },
    ]
  },
  {
    id: 'plastic', label: '플라스틱/고무 가공',
    items: [
      { id: 'injection', label: '사출 성형' },
      { id: 'injection_multi', label: '다색 사출' },
      { id: 'injection_insert', label: '인서트 사출' },
      { id: 'blow_molding', label: '블로우 성형' },
      { id: 'vacuum_forming', label: '진공 성형' },
      { id: 'roto_molding', label: '회전 성형' },
      { id: 'rubber_molding', label: '고무 성형' },
      { id: 'silicone_molding', label: '실리콘 성형' },
    ]
  },
  {
    id: 'mold_tool', label: '금형/툴링',
    items: [
      { id: 'mold', label: '금형 제작' },
      { id: 'jig_fixture', label: '지그/픽스처' },
      { id: 'die_making', label: '다이 제작' },
    ]
  },
  {
    id: 'joining', label: '접합/용접',
    items: [
      { id: 'welding', label: '용접 (일반)' },
      { id: 'tig_welding', label: 'TIG 용접' },
      { id: 'mig_welding', label: 'MIG 용접' },
      { id: 'laser_welding', label: '레이저 용접' },
      { id: 'spot_welding', label: '스폿 용접' },
      { id: 'brazing', label: '브레이징/납땜' },
      { id: 'adhesive', label: '접착/본딩' },
    ]
  },
  {
    id: 'surface', label: '표면처리/도장',
    items: [
      { id: 'painting', label: '도장 (일반)' },
      { id: 'powder_coating', label: '분체 도장' },
      { id: 'anodizing', label: '아노다이징' },
      { id: 'plating', label: '도금' },
      { id: 'heat_treat', label: '열처리' },
      { id: 'sandblasting', label: '샌드블라스팅' },
      { id: 'polishing', label: '연마/폴리싱' },
      { id: 'coating', label: '코팅 (특수)' },
    ]
  },
  {
    id: 'electronics_pcb', label: '전자/PCB',
    items: [
      { id: 'pcb_mfg', label: 'PCB 제조' },
      { id: 'smt', label: 'SMT 실장' },
      { id: 'pcb_assembly', label: 'PCB 조립' },
      { id: 'wire_harness', label: '와이어 하네스' },
      { id: 'potting', label: '포팅/몰딩' },
    ]
  },
  {
    id: 'textile_sewing', label: '섬유/봉제',
    items: [
      { id: 'sewing', label: '봉제' },
      { id: 'cutting_fabric', label: '재단' },
      { id: 'knitting', label: '편직' },
      { id: 'dyeing', label: '염색' },
      { id: 'embroidery', label: '자수' },
      { id: 'printing_fabric', label: '원단 인쇄' },
    ]
  },
  {
    id: 'additive', label: '적층/3D프린팅',
    items: [
      { id: '3d_fdm', label: 'FDM 3D프린팅' },
      { id: '3d_sla', label: 'SLA 3D프린팅' },
      { id: '3d_sls', label: 'SLS 3D프린팅' },
      { id: '3d_metal', label: '금속 3D프린팅' },
    ]
  },
  {
    id: 'food_pharma', label: '식품/제약 제조',
    items: [
      { id: 'food_processing', label: '식품 가공' },
      { id: 'packaging', label: '패키징/포장' },
      { id: 'filling', label: '충전/충전 포장' },
      { id: 'pharma', label: '제약/의약품 제조' },
    ]
  },
  {
    id: 'finishing', label: '마감/조립',
    items: [
      { id: 'assembly', label: '조립' },
      { id: 'inspection', label: '검사/검수' },
      { id: 'packing', label: '포장/출하' },
      { id: 'printing', label: '인쇄/실크' },
      { id: 'laser_marking', label: '레이저 마킹' },
    ]
  },
];

// 소재 대분류+소분류 구조
const MATERIAL_CATEGORIES = [
  {
    id: 'metal_common', label: '일반 금속',
    items: [
      { id: 'aluminum', label: '알루미늄' },
      { id: 'ss400', label: 'SS400 (일반강)' },
      { id: 'sus304', label: 'SUS304 (스테인리스)' },
      { id: 'sus316', label: 'SUS316' },
      { id: 'carbon_steel', label: '탄소강' },
      { id: 'alloy_steel', label: '합금강' },
      { id: 'iron_cast', label: '주철' },
    ]
  },
  {
    id: 'metal_special', label: '특수 금속',
    items: [
      { id: 'titanium', label: '티타늄' },
      { id: 'copper', label: '구리' },
      { id: 'brass', label: '황동' },
      { id: 'magnesium', label: '마그네슘' },
      { id: 'zinc', label: '아연' },
      { id: 'nickel', label: '니켈' },
      { id: 'tungsten', label: '텅스텐' },
      { id: 'inconel', label: '인코넬' },
    ]
  },
  {
    id: 'plastic_hard', label: '경질 플라스틱',
    items: [
      { id: 'abs', label: 'ABS' },
      { id: 'pc', label: 'PC (폴리카보네이트)' },
      { id: 'pp', label: 'PP (폴리프로필렌)' },
      { id: 'pet', label: 'PET' },
      { id: 'pa', label: 'PA (나일론)' },
      { id: 'pom', label: 'POM (아세탈)' },
      { id: 'pmma', label: 'PMMA (아크릴)' },
      { id: 'pe', label: 'PE (폴리에틸렌)' },
      { id: 'pps', label: 'PPS' },
      { id: 'peek', label: 'PEEK' },
    ]
  },
  {
    id: 'rubber_soft', label: '고무/연질',
    items: [
      { id: 'nbr', label: 'NBR 고무' },
      { id: 'silicone', label: '실리콘' },
      { id: 'epdm', label: 'EPDM' },
      { id: 'pu', label: 'PU (폴리우레탄)' },
      { id: 'tpe', label: 'TPE' },
    ]
  },
  {
    id: 'electronics_mat', label: '전자/기판',
    items: [
      { id: 'fr4', label: 'FR-4 (PCB 기판)' },
      { id: 'ceramic', label: '세라믹' },
      { id: 'glass', label: '유리' },
      { id: 'silicon', label: '실리콘 웨이퍼' },
    ]
  },
  {
    id: 'textile_mat', label: '섬유/원단',
    items: [
      { id: 'cotton', label: '면 (Cotton)' },
      { id: 'polyester', label: '폴리에스터' },
      { id: 'nylon_fabric', label: '나일론 원단' },
      { id: 'spandex', label: '스판덱스' },
      { id: 'leather', label: '가죽' },
      { id: 'nonwoven', label: '부직포' },
    ]
  },
  {
    id: 'composite', label: '복합재/기타',
    items: [
      { id: 'cfrp', label: '탄소섬유 (CFRP)' },
      { id: 'gfrp', label: '유리섬유 (GFRP)' },
      { id: 'wood', label: '목재/MDF' },
      { id: 'foam', label: '폼/스펀지' },
      { id: 'paper', label: '종이/판지' },
    ]
  },
];

// 기존 호환용 flat 배열 (DB 검색, 필터 등에서 사용)
const PROCESSES = PROCESS_CATEGORIES.flatMap(cat =>
  cat.items.map(item => ({ id: item.id, label: item.label, en: item.label, category: cat.id, categoryLabel: cat.label }))
);

const MATERIALS_FLAT = MATERIAL_CATEGORIES.flatMap(cat =>
  cat.items.map(item => ({ id: item.id, label: item.label, category: cat.id, categoryLabel: cat.label }))
);

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
  PROCESS_CATEGORIES, MATERIAL_CATEGORIES, MATERIALS_FLAT,
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
  if (row.lat != null && row.lng != null) {
    const lat = Number(row.lat);
    const lng = Number(row.lng);
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
  google_place_id: row.google_place_id || null,
  google_rating: row.google_rating ?? null,
  google_reviews: row.google_reviews ?? null,
  google_photos: (() => {
    const p = row.google_photos;
    if (!p) return [];
    if (Array.isArray(p)) return p;
    try { return JSON.parse(p); } catch(e) { return []; }
  })(),
  google_hours: (() => {
    const h = row.google_hours;
    if (!h) return [];
    if (Array.isArray(h)) return h;
    try { return JSON.parse(h); } catch(e) { return []; }
  })(),
  google_review_texts: (() => {
    const r = row.google_review_texts;
    if (!r) return [];
    if (Array.isArray(r)) return r;
    try { return JSON.parse(r); } catch(e) { return []; }
  })(),
}); };

