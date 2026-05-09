-- factories 테이블에 DART 재무정보 컬럼 추가
-- Supabase Dashboard → SQL Editor에서 실행

ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_corp_code TEXT DEFAULT '';
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_revenue     BIGINT;   -- 매출액
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_op_income   BIGINT;   -- 영업이익
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_net_income  BIGINT;   -- 당기순이익
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_assets      BIGINT;   -- 자산총계
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_equity      BIGINT;   -- 자본총계
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_year        TEXT;     -- 결산연도 (예: 2024)
ALTER TABLE factories ADD COLUMN IF NOT EXISTS dart_updated_at  TIMESTAMPTZ;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_factories_dart_corp_code ON factories (dart_corp_code) WHERE dart_corp_code != '';
CREATE INDEX IF NOT EXISTS idx_factories_bizrno ON factories (bizrno) WHERE bizrno != '';

-- 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'factories'
  AND column_name IN ('bizrno','dart_corp_code','dart_revenue','dart_op_income','dart_net_income','dart_assets','dart_equity','dart_year')
ORDER BY ordinal_position;
