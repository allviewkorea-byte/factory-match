-- ============================================================
-- factories 테이블 성능 인덱스
-- Supabase Dashboard → SQL Editor 에서 실행
-- ============================================================

-- 0. trigram 확장 활성화 (summary 인덱스에 필요)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. hidden 필터 (모든 목록 쿼리에 사용)
CREATE INDEX IF NOT EXISTS idx_factories_hidden
  ON factories (hidden);

-- 2. hidden + rating 복합 인덱스 (목록 기본 정렬 쿼리 최적화)
CREATE INDEX IF NOT EXISTS idx_factories_hidden_rating
  ON factories (hidden, rating DESC NULLS LAST);

-- 3. region 필터
CREATE INDEX IF NOT EXISTS idx_factories_region
  ON factories (region);

-- 4. industries GIN 인덱스 (jsonb 배열 포함 검색)
--    industries 컬럼이 jsonb 타입인 경우:
CREATE INDEX IF NOT EXISTS idx_factories_industries
  ON factories USING GIN (industries jsonb_path_ops);

--    industries 컬럼이 text 타입인 경우 위 인덱스 대신 아래 사용:
-- CREATE INDEX IF NOT EXISTS idx_factories_industries
--   ON factories USING GIN ((industries::jsonb) jsonb_path_ops);

-- 5. processes GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_factories_processes
  ON factories USING GIN (processes jsonb_path_ops);

--    processes 컬럼이 text 타입인 경우 위 인덱스 대신 아래 사용:
-- CREATE INDEX IF NOT EXISTS idx_factories_processes
--   ON factories USING GIN ((processes::jsonb) jsonb_path_ops);

-- 6. summary trigram 인덱스 (ILIKE 쿼리 가속)
CREATE INDEX IF NOT EXISTS idx_factories_summary_trgm
  ON factories USING GIN (summary gin_trgm_ops);

-- ============================================================
-- 인덱스 생성 확인
-- ============================================================
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'factories'
ORDER BY indexname;
