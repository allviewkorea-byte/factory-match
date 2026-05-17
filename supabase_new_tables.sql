-- ① 공장 이메일 수집 알림 신청 테이블
CREATE TABLE IF NOT EXISTS factory_email_alerts (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  factory_id  text NOT NULL,
  user_email  text NOT NULL,
  factory_name text,
  notified    boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_factory_email_alerts_factory ON factory_email_alerts(factory_id);
CREATE INDEX IF NOT EXISTS idx_factory_email_alerts_notified ON factory_email_alerts(notified);
ALTER TABLE factory_email_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "본인만 조회/추가/삭제" ON factory_email_alerts
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ② 커뮤니티 게시판 (바이어 제조 의뢰 공개 게시)
CREATE TABLE IF NOT EXISTS community_posts (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text,
  title       text NOT NULL,
  content     text,
  process     text,           -- 가공 방식
  quantity    text,           -- 수량
  deadline    text,           -- 납기
  budget      text,           -- 예산
  region      text,           -- 희망 지역
  status      text DEFAULT 'open',  -- open / closed
  views       int  DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "전체 조회 가능" ON community_posts FOR SELECT USING (true);
CREATE POLICY "본인만 작성/수정" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인만 수정" ON community_posts FOR UPDATE USING (auth.uid() = user_id);

-- ③ 커뮤니티 댓글 (제조사/누구나 답변)
CREATE TABLE IF NOT EXISTS community_replies (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text,
  content     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "전체 조회 가능" ON community_replies FOR SELECT USING (true);
CREATE POLICY "본인만 작성" ON community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인만 삭제" ON community_replies FOR DELETE USING (auth.uid() = user_id);
