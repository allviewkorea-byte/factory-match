-- factories 테이블에 address 컬럼 추가
-- Supabase Dashboard → SQL Editor에서 실행

ALTER TABLE factories ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';

-- 인덱스 (주소 검색용 trigram)
CREATE INDEX IF NOT EXISTS idx_factories_address_trgm
  ON factories USING GIN (address gin_trgm_ops);

-- 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'factories'
ORDER BY ordinal_position;
