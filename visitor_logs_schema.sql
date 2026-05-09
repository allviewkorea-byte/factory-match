-- visitor_logs: 비회원 활동 로그
CREATE TABLE IF NOT EXISTS visitor_logs (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text        NOT NULL,
  event_type text        NOT NULL,
  -- 'search'            검색 시도
  -- 'factory_view'      공장 상세 클릭
  -- 'rfq_attempt'       견적 요청 시도
  -- 'ai_consult'        AI 상담 시도
  -- 'signup_triggered'  가입 유도 팝업 노출
  -- 'signup_completed'  가입 완료
  -- 'tab_click'         탭 클릭
  event_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- 인덱스: 세션별, 이벤트 유형별, 시간별 조회 최적화
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session   ON visitor_logs (session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_event     ON visitor_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created   ON visitor_logs (created_at);

-- RLS: anon 사용자 INSERT만 허용, SELECT는 service_role만
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert visitor_logs"
  ON visitor_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "service_role can select visitor_logs"
  ON visitor_logs FOR SELECT
  TO service_role
  USING (true);
