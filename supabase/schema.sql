-- ShadowME 학습 데이터 테이블 스키마
-- Supabase 데이터베이스에 실행할 SQL

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    purpose TEXT DEFAULT 'conversation' CHECK (purpose IN ('conversation', 'business', 'exam')),
    total_sessions INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0, -- 초 단위
    average_accuracy DECIMAL(5,2) DEFAULT 0.0,
    streak_count INTEGER DEFAULT 0,
    last_practice TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- RLS (Row Level Security) 활성화
    CONSTRAINT fk_user_profiles_id FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. 학습 세션 테이블
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('level_test', 'practice', 'tutorial')),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    purpose TEXT CHECK (purpose IN ('conversation', 'business', 'exam')),
    
    -- 세션 결과 데이터
    practice_time INTEGER DEFAULT 0, -- 초 단위
    overall_accuracy DECIMAL(5,2) DEFAULT 0.0,
    sentences_completed INTEGER DEFAULT 0,
    total_sentences INTEGER DEFAULT 0,
    
    -- 상세 결과 (JSON)
    sentence_results JSONB, -- 문장별 정확도, 소요시간 등
    voice_analysis JSONB,   -- 음성 분석 결과
    
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 일별 학습 진행도 테이블
CREATE TABLE IF NOT EXISTS daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- 일일 통계
    practice_time INTEGER DEFAULT 0, -- 초 단위
    lessons_completed INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    accuracy_scores DECIMAL(5,2)[] DEFAULT '{}', -- 당일 모든 정확도 점수
    average_accuracy DECIMAL(5,2) DEFAULT 0.0,
    
    -- 학습 목표 달성 여부
    daily_goal_achieved BOOLEAN DEFAULT FALSE,
    streak_maintained BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 유니크 제약: 사용자당 하루 하나의 레코드
    UNIQUE(user_id, date)
);

-- 4. 음성 클로닝 세션 테이블
CREATE TABLE IF NOT EXISTS voice_cloning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL, -- 앱에서 생성한 sessionId
    
    -- 클로닝 정보
    sample_text TEXT NOT NULL,
    voice_model_id TEXT, -- ElevenLabs voice ID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'), -- 24시간 후 만료
    
    UNIQUE(user_id, session_id)
);

-- 5. 문장 연습 기록 테이블 (SpeechOcean762 추적용)
CREATE TABLE IF NOT EXISTS sentence_practice_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
    
    -- 문장 정보
    sentence_id TEXT NOT NULL, -- speechocean762 ID 또는 커스텀 ID
    sentence_text TEXT NOT NULL,
    source TEXT DEFAULT 'custom' CHECK (source IN ('speechocean762', 'custom')),
    
    -- 연습 결과
    accuracy_score DECIMAL(5,2) NOT NULL,
    fluency_score DECIMAL(5,2),
    pronunciation_score DECIMAL(5,2),
    attempt_count INTEGER DEFAULT 1,
    time_spent INTEGER DEFAULT 0, -- 초 단위
    
    -- 단어별 분석 결과
    word_analysis JSONB, -- 단어별 정확도 등
    
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (쿼리 성능 향상)
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_completed_at ON user_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_voice_cloning_sessions_user_session ON voice_cloning_sessions(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_sentence_practice_user_sentence ON sentence_practice_records(user_id, sentence_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_cloning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_practice_records ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON daily_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own voice sessions" ON voice_cloning_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own practice records" ON sentence_practice_records
    FOR ALL USING (auth.uid() = user_id);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_progress_updated_at 
    BEFORE UPDATE ON daily_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();