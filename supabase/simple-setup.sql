-- ShadowME 간단한 테이블 설정
-- Supabase SQL Editor에서 실행하세요: https://supabase.com/dashboard/project/zxyvqsevekrhwzjulyaq/sql

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    level TEXT DEFAULT 'beginner',
    purpose TEXT DEFAULT 'conversation', 
    total_sessions INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0.0,
    streak_count INTEGER DEFAULT 0,
    last_practice TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 학습 세션 테이블  
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    session_type TEXT NOT NULL,
    level TEXT NOT NULL,
    purpose TEXT,
    practice_time INTEGER DEFAULT 0,
    overall_accuracy DECIMAL(5,2) DEFAULT 0.0,
    sentences_completed INTEGER DEFAULT 0,
    total_sentences INTEGER DEFAULT 0,
    sentence_results JSONB,
    voice_analysis JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 일별 진행도 테이블
CREATE TABLE IF NOT EXISTS daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    date DATE NOT NULL,
    practice_time INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0.0,
    daily_goal_achieved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 4. 음성 클로닝 세션 테이블
CREATE TABLE IF NOT EXISTS voice_cloning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    session_id TEXT NOT NULL,
    sample_text TEXT NOT NULL,
    voice_model_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    UNIQUE(user_id, session_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_voice_cloning_sessions_user_session ON voice_cloning_sessions(user_id, session_id);

-- RLS (Row Level Security) 활성화 (선택사항)
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE voice_cloning_sessions ENABLE ROW LEVEL SECURITY;