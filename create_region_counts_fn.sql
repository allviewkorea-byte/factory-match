-- ============================================================
-- get_region_counts() : 지역별 공장 수 집계 함수
-- Supabase Dashboard → SQL Editor 에서 실행
-- ============================================================
-- 역할: KICOX region 컬럼("경상남도 창원시" 형식)을 서버에서
--       CASE WHEN + ILIKE로 분류해 17개 시/도별 카운트 반환.
--       17개 병렬 쿼리 대신 단일 RPC로 정확한 집계.
-- ============================================================

CREATE OR REPLACE FUNCTION get_region_counts()
RETURNS TABLE(region_id TEXT, cnt BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    CASE
      WHEN region ILIKE '서울%'                    THEN 'seoul'
      WHEN region ILIKE '경기%'                    THEN 'gyeonggi'
      WHEN region ILIKE '인천%'                    THEN 'incheon'
      WHEN region ILIKE '부산%'                    THEN 'busan'
      WHEN region ILIKE '대구%'                    THEN 'daegu'
      WHEN region ILIKE '경상남도%' OR region ILIKE '경남%' THEN 'gyeongnam'
      WHEN region ILIKE '경상북도%' OR region ILIKE '경북%' THEN 'gyeongbuk'
      WHEN region ILIKE '충청남도%' OR region ILIKE '충남%' THEN 'chungnam'
      WHEN region ILIKE '충청북도%' OR region ILIKE '충북%' THEN 'chungbuk'
      WHEN region ILIKE '대전%'                    THEN 'daejeon'
      WHEN region ILIKE '세종%'                    THEN 'sejong'
      WHEN region ILIKE '광주%'                    THEN 'gwangju'
      WHEN region ILIKE '전라남도%' OR region ILIKE '전남%' THEN 'jeonnam'
      WHEN region ILIKE '전라북도%' OR region ILIKE '전북%' OR region ILIKE '전북특별자치%' THEN 'jeonbuk'
      WHEN region ILIKE '강원%'                    THEN 'gangwon'
      WHEN region ILIKE '울산%'                    THEN 'ulsan'
      WHEN region ILIKE '제주%'                    THEN 'jeju'
      ELSE                                          'other'
    END AS region_id,
    COUNT(*) AS cnt
  FROM factories
  WHERE hidden = false
  GROUP BY 1;
$$;

-- 실행 권한 부여 (anon 역할에서 호출 가능하도록)
GRANT EXECUTE ON FUNCTION get_region_counts() TO anon;

-- 확인
SELECT * FROM get_region_counts() ORDER BY cnt DESC;
