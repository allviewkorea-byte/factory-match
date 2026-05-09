-- 1. completeness_score 컬럼 추가
ALTER TABLE factories ADD COLUMN IF NOT EXISTS completeness_score INTEGER DEFAULT 0;

-- 2. 점수 계산 함수 생성
CREATE OR REPLACE FUNCTION calc_completeness_score(f factories)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  IF f.ai_summary    IS NOT NULL AND f.ai_summary != 'null' THEN score := score + 40; END IF;
  IF f.website       IS NOT NULL AND f.website    != ''     THEN score := score + 20; END IF;
  IF f.dart_revenue  IS NOT NULL                            THEN score := score + 15; END IF;
  IF f.phone         IS NOT NULL AND f.phone      != ''     THEN score := score + 10; END IF;
  IF f.summary       IS NOT NULL AND f.summary    != ''     THEN score := score +  5; END IF;
  IF f.coord_x       IS NOT NULL                            THEN score := score +  5; END IF;
  IF f.image         IS NOT NULL AND f.image      != ''     THEN score := score +  5; END IF;
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- 3. 전체 점수 일괄 업데이트 (최초 1회 실행)
UPDATE factories SET completeness_score = (
  CASE WHEN ai_summary   IS NOT NULL AND ai_summary != 'null' THEN 40 ELSE 0 END +
  CASE WHEN website      IS NOT NULL AND website    != ''     THEN 20 ELSE 0 END +
  CASE WHEN dart_revenue IS NOT NULL                          THEN 15 ELSE 0 END +
  CASE WHEN phone        IS NOT NULL AND phone      != ''     THEN 10 ELSE 0 END +
  CASE WHEN summary      IS NOT NULL AND summary    != ''     THEN  5 ELSE 0 END +
  CASE WHEN coord_x      IS NOT NULL                          THEN  5 ELSE 0 END +
  CASE WHEN image        IS NOT NULL AND image      != ''     THEN  5 ELSE 0 END
);

-- 4. 인덱스 생성 (정렬 성능)
CREATE INDEX IF NOT EXISTS idx_factories_completeness
  ON factories (completeness_score DESC, id ASC);

-- 5. 결과 확인
SELECT
  completeness_score,
  COUNT(*) as cnt
FROM factories
GROUP BY completeness_score
ORDER BY completeness_score DESC
LIMIT 20;
