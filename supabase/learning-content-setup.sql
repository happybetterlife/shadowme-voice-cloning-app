-- ShadowME 학습 콘텐츠 테이블 설정
-- Supabase SQL Editor에서 실행하세요: https://supabase.com/dashboard/project/zxyvqsevekrhwzjulyaq/sql

-- 1. 학습 문장 카테고리 테이블
CREATE TABLE IF NOT EXISTS sentence_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    purpose TEXT NOT NULL CHECK (purpose IN ('conversation', 'business', 'exam')),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(level, purpose)
);

-- 2. 학습 문장 테이블
CREATE TABLE IF NOT EXISTS sentences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES sentence_categories(id),
    text TEXT NOT NULL,
    translation_ko TEXT, -- 한국어 번역
    difficulty_score INTEGER DEFAULT 50 CHECK (difficulty_score >= 0 AND difficulty_score <= 100),
    word_count INTEGER GENERATED ALWAYS AS (array_length(string_to_array(text, ' '), 1)) STORED,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 문장 태그 테이블 (추가 분류용)
CREATE TABLE IF NOT EXISTS sentence_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 문장-태그 연결 테이블
CREATE TABLE IF NOT EXISTS sentence_tag_relations (
    sentence_id UUID NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES sentence_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (sentence_id, tag_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sentences_category_id ON sentences(category_id);
CREATE INDEX IF NOT EXISTS idx_sentences_is_active ON sentences(is_active);
CREATE INDEX IF NOT EXISTS idx_sentences_difficulty ON sentences(difficulty_score);
CREATE INDEX IF NOT EXISTS idx_sentence_categories_level_purpose ON sentence_categories(level, purpose);

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sentence_categories_updated_at BEFORE UPDATE
    ON sentence_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sentences_updated_at BEFORE UPDATE
    ON sentences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 카테고리 기본 데이터 삽입
INSERT INTO sentence_categories (level, purpose, name, description)
VALUES
    ('beginner', 'conversation', 'Beginner Conversation', '초급 일상 대화'),
    ('beginner', 'business', 'Beginner Business', '초급 비즈니스 영어'),
    ('beginner', 'exam', 'Beginner Academic', '초급 학술/시험 영어'),
    ('intermediate', 'conversation', 'Intermediate Conversation', '중급 일상 대화'),
    ('intermediate', 'business', 'Intermediate Business', '중급 비즈니스 영어'),
    ('intermediate', 'exam', 'Intermediate Academic', '중급 학술/시험 영어'),
    ('advanced', 'conversation', 'Advanced Conversation', '고급 일상 대화'),
    ('advanced', 'business', 'Advanced Business', '고급 비즈니스 영어'),
    ('advanced', 'exam', 'Advanced Academic', '고급 학술/시험 영어')
ON CONFLICT (level, purpose) DO NOTHING;

-- 문장 사용 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_sentence_stats(
    p_sentence_id UUID,
    p_accuracy DECIMAL
)
RETURNS void AS $$
BEGIN
    UPDATE sentences
    SET 
        usage_count = usage_count + 1,
        average_accuracy = (
            (average_accuracy * usage_count + p_accuracy) / (usage_count + 1)
        )
    WHERE id = p_sentence_id;
END;
$$ language 'plpgsql';

-- RLS 정책 (필요시 활성화)
-- ALTER TABLE sentence_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sentences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sentence_tags ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sentence_tag_relations ENABLE ROW LEVEL SECURITY;

-- 읽기 권한은 모든 사용자에게 허용
-- CREATE POLICY "Enable read access for all users" ON sentences
--     FOR SELECT USING (true);

-- CREATE POLICY "Enable read access for all users" ON sentence_categories
--     FOR SELECT USING (true);