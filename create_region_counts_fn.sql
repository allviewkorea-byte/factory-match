-- ============================================================
-- get_region_counts() : 지역별 공장 수 집계 함수
-- Supabase Dashboard → SQL Editor 에서 실행
-- ============================================================
-- 실제 DB region 컬럼 값 기준 정확 매칭 (ILIKE 아님)
-- ============================================================

CREATE OR REPLACE FUNCTION get_region_counts()
RETURNS TABLE(region_id TEXT, cnt BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    CASE region
      WHEN '서울특별시'                         THEN 'seoul'
      WHEN '경기도'                             THEN 'gyeonggi'
      WHEN 'gyeonggi'                           THEN 'gyeonggi'
      WHEN '인천광역시'                         THEN 'incheon'
      WHEN '부산광역시'                         THEN 'busan'
      WHEN '대구광역시'                         THEN 'daegu'
      WHEN '경상남도'                           THEN 'gyeongnam'
      WHEN 'gyeongnam'                          THEN 'gyeongnam'
      WHEN '경상북도'                           THEN 'gyeongbuk'
      WHEN '충청남도'                           THEN 'chungnam'
      WHEN '충청북도'                           THEN 'chungbuk'
      WHEN '대전광역시'                         THEN 'daejeon'
      WHEN '세종특별자치시'                     THEN 'sejong'
      WHEN '광주광역시'                         THEN 'gwangju'
      WHEN '전라남도'                           THEN 'jeonnam'
      WHEN '전북특별자치도'                     THEN 'jeonbuk'
      WHEN '전라북도'                           THEN 'jeonbuk'
      WHEN '강원특별자치도'                     THEN 'gangwon'
      WHEN '강원도'                             THEN 'gangwon'
      WHEN '울산광역시'                         THEN 'ulsan'
      WHEN '제주특별자치도'                     THEN 'jeju'
      WHEN '제주도'                             THEN 'jeju'
      ELSE                                      'other'  -- NULL 포함
    END AS region_id,
    COUNT(*) AS cnt
  FROM factories
  WHERE hidden = false
  GROUP BY 1;
$$;

-- 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_region_counts() TO anon;

-- 확인
SELECT * FROM get_region_counts() ORDER BY cnt DESC;
