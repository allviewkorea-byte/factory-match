-- 한국 영토 범위 벗어나는 좌표 NULL 처리
-- (북한·해외로 오geocode된 데이터 정리)
-- 위도: 33.0 ~ 38.9, 경도: 124.5 ~ 132.0
--
-- Supabase Dashboard → SQL Editor 에서 실행

-- 1. 범위 벗어나는 데이터 사전 확인
SELECT id, name, coord_y AS lat, coord_x AS lng
FROM factories
WHERE coord_x IS NOT NULL AND coord_y IS NOT NULL
  AND NOT (
    coord_y BETWEEN 33.0 AND 38.9
    AND coord_x BETWEEN 124.5 AND 132.0
  );

-- 2. 범위 벗어나는 좌표 NULL 처리 (위 SELECT 결과 확인 후 실행)
UPDATE factories
SET coord_x = NULL,
    coord_y = NULL
WHERE coord_x IS NOT NULL AND coord_y IS NOT NULL
  AND NOT (
    coord_y BETWEEN 33.0 AND 38.9
    AND coord_x BETWEEN 124.5 AND 132.0
  );
