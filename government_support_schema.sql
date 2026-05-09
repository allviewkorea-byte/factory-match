-- government_support: 정부지원사업 정보
CREATE TABLE IF NOT EXISTS government_support (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text        NOT NULL,
  organization text        NOT NULL,
  category     text        NOT NULL DEFAULT '기타',
  -- categories: 설비투자 | 수출지원 | 고용 | 기술개발 | 기타
  description  text,
  target       text,
  amount       text,
  deadline     date,
  url          text,
  is_active    boolean     DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gov_support_deadline  ON government_support (deadline);
CREATE INDEX IF NOT EXISTS idx_gov_support_active    ON government_support (is_active);
CREATE INDEX IF NOT EXISTS idx_gov_support_category  ON government_support (category);

-- RLS
ALTER TABLE government_support ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can select active government_support"
  ON government_support FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "authenticated can select all government_support"
  ON government_support FOR SELECT TO authenticated
  USING (true);

-- 관리자 콘솔은 자체 비밀번호 게이트로 보호됨 (anon에게 write 허용)
CREATE POLICY "anon can insert government_support"
  ON government_support FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon can update government_support"
  ON government_support FOR UPDATE TO anon
  USING (true);

CREATE POLICY "anon can delete government_support"
  ON government_support FOR DELETE TO anon
  USING (true);

-- 샘플 데이터
INSERT INTO government_support (title, organization, category, description, target, amount, deadline, url, is_active) VALUES
(
  '스마트공장 구축 지원',
  '중소벤처기업부',
  '설비투자',
  'IoT·AI 기반 스마트공장 구축 비용을 최대 50% 지원합니다.',
  '제조 중소기업',
  '최대 1억원',
  '2026-06-30',
  'https://www.mss.go.kr',
  true
),
(
  '수출 바우처 지원사업',
  'KOTRA',
  '수출지원',
  '해외시장 진출을 위한 마케팅·컨설팅·전시회 비용을 지원합니다.',
  '수출 중소기업',
  '최대 5천만원',
  '2026-07-15',
  'https://www.kotra.or.kr',
  true
),
(
  '제조업 고용장려금',
  '고용노동부',
  '고용',
  '제조업 신규 채용 시 인건비 일부를 장려금으로 지원합니다.',
  '제조업 전체',
  '1인당 월 80만원',
  '2026-12-31',
  'https://www.moel.go.kr',
  true
);
