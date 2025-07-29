-- Enable RLS on all public tables
ALTER TABLE public.sentence_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentence_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentence_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (sentences are public content)
CREATE POLICY "Allow public read access" ON public.sentence_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.sentences
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.sentence_tag_relations
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.sentence_tags
  FOR SELECT USING (true);

-- Create policies for user-specific tables
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON public.daily_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.daily_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.daily_progress
  FOR UPDATE USING (auth.uid() = user_id);