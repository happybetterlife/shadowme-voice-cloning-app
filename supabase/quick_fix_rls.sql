-- 빠른 RLS 수정 (모든 테이블에 RLS 활성화만)
-- 보안을 위해 최소한 RLS는 활성화해야 합니다

-- 1. RLS 활성화
ALTER TABLE public.sentence_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentence_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentence_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- 2. 임시로 모든 작업 허용 (개발 중에만 사용)
-- 주의: 프로덕션에서는 위의 enable_rls.sql의 정책을 사용하세요
CREATE POLICY "Temporary allow all" ON public.sentence_categories FOR ALL USING (true);
CREATE POLICY "Temporary allow all" ON public.sentences FOR ALL USING (true);
CREATE POLICY "Temporary allow all" ON public.sentence_tag_relations FOR ALL USING (true);
CREATE POLICY "Temporary allow all" ON public.sentence_tags FOR ALL USING (true);
CREATE POLICY "Temporary allow all" ON public.daily_progress FOR ALL USING (true);
CREATE POLICY "Temporary allow all" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Temporary allow all" ON public.user_sessions FOR ALL USING (true);