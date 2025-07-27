-- 음성 클로닝 세션 테이블 (추가)
CREATE TABLE IF NOT EXISTS voice_cloning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL UNIQUE,
    elevenlabs_voice_id TEXT,
    sample_text TEXT,
    audio_data_size INTEGER,
    quality_score DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_session_id UNIQUE(session_id)
);

-- 문장별 연습 기록 테이블 (추가)
CREATE TABLE IF NOT EXISTS sentence_practice_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    sentence_id TEXT NOT NULL,
    sentence_text TEXT NOT NULL,
    sentence_level TEXT CHECK (sentence_level IN ('beginner', 'intermediate', 'advanced')),
    sentence_purpose TEXT CHECK (sentence_purpose IN ('conversation', 'business', 'exam')),
    attempt_number INTEGER DEFAULT 1,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    fluency_score DECIMAL(5,2) DEFAULT 0.0,
    pronunciation_score DECIMAL(5,2) DEFAULT 0.0,
    word_accuracies JSONB,
    audio_url TEXT,
    cloned_audio_url TEXT,
    use_cloned_voice BOOLEAN DEFAULT FALSE,
    recording_duration INTEGER DEFAULT 0,
    error_details JSONB,
    practiced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_voice_sessions_user ON voice_cloning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_session ON voice_cloning_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_practice_records_user ON sentence_practice_records(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_records_session ON sentence_practice_records(session_id);
CREATE INDEX IF NOT EXISTS idx_practice_records_sentence ON sentence_practice_records(sentence_id);
CREATE INDEX IF NOT EXISTS idx_practice_records_date ON sentence_practice_records(practiced_at);

-- RPC 함수: 사용자 통계 업데이트
CREATE OR REPLACE FUNCTION update_user_stats(
    p_user_id UUID,
    p_practice_time INTEGER,
    p_accuracy DECIMAL
) RETURNS VOID AS $$
BEGIN
    UPDATE user_profiles
    SET 
        total_sessions = total_sessions + 1,
        total_practice_time = total_practice_time + p_practice_time,
        average_accuracy = CASE 
            WHEN total_sessions = 0 THEN p_accuracy
            ELSE ((average_accuracy * total_sessions) + p_accuracy) / (total_sessions + 1)
        END,
        last_practice = NOW(),
        streak_count = CASE
            WHEN last_practice IS NULL THEN 1
            WHEN DATE(last_practice) = CURRENT_DATE - INTERVAL '1 day' THEN streak_count + 1
            WHEN DATE(last_practice) < CURRENT_DATE - INTERVAL '1 day' THEN 1
            ELSE streak_count
        END,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- RPC 함수: 문장별 통계 조회
CREATE OR REPLACE FUNCTION get_sentence_statistics(
    p_user_id UUID,
    p_sentence_id TEXT DEFAULT NULL
) RETURNS TABLE (
    sentence_id TEXT,
    sentence_text TEXT,
    total_attempts BIGINT,
    best_accuracy DECIMAL(5,2),
    average_accuracy DECIMAL(5,2),
    last_practiced TIMESTAMPTZ,
    improvement_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH sentence_stats AS (
        SELECT 
            spr.sentence_id,
            spr.sentence_text,
            COUNT(*) as total_attempts,
            MAX(spr.accuracy_score) as best_accuracy,
            AVG(spr.accuracy_score) as average_accuracy,
            MAX(spr.practiced_at) as last_practiced,
            CASE 
                WHEN COUNT(*) > 1 THEN 
                    (MAX(spr.accuracy_score) - MIN(spr.accuracy_score)) / NULLIF(COUNT(*) - 1, 0)
                ELSE 0
            END as improvement_rate
        FROM sentence_practice_records spr
        WHERE spr.user_id = p_user_id
          AND (p_sentence_id IS NULL OR spr.sentence_id = p_sentence_id)
        GROUP BY spr.sentence_id, spr.sentence_text
    )
    SELECT * FROM sentence_stats
    ORDER BY last_practiced DESC;
END;
$$ LANGUAGE plpgsql;

-- RPC 함수: 주간 학습 히트맵 데이터
CREATE OR REPLACE FUNCTION get_weekly_heatmap(
    p_user_id UUID,
    p_weeks INTEGER DEFAULT 12
) RETURNS TABLE (
    week_date DATE,
    day_of_week INTEGER,
    practice_time INTEGER,
    sessions_count INTEGER,
    average_accuracy DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE - INTERVAL '1 week' * p_weeks,
            CURRENT_DATE,
            '1 day'::interval
        )::DATE as date
    )
    SELECT 
        ds.date as week_date,
        EXTRACT(DOW FROM ds.date)::INTEGER as day_of_week,
        COALESCE(dp.practice_time, 0) as practice_time,
        COALESCE(dp.total_sessions, 0) as sessions_count,
        COALESCE(dp.average_accuracy, 0) as average_accuracy
    FROM date_series ds
    LEFT JOIN daily_progress dp 
        ON dp.user_id = p_user_id 
        AND dp.date = ds.date
    ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) 정책
ALTER TABLE voice_cloning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_practice_records ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 음성 클로닝 세션만 볼 수 있음
CREATE POLICY "Users can view own voice sessions" ON voice_cloning_sessions
    FOR ALL USING (auth.uid() = user_id);

-- 사용자는 자신의 연습 기록만 볼 수 있음
CREATE POLICY "Users can view own practice records" ON sentence_practice_records
    FOR ALL USING (auth.uid() = user_id);

-- 트리거: 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_voice_sessions_updated_at BEFORE UPDATE ON voice_cloning_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_records_updated_at BEFORE UPDATE ON sentence_practice_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();