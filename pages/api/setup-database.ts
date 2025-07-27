import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Supabase 서비스 키 (관리자 권한 필요)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || publicAnonKey;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      `https://${projectId}.supabase.co`,
      SUPABASE_SERVICE_KEY
    );

    console.log('🚀 Setting up ShadowME database tables...');

    // 1. 사용자 프로필 테이블 생성
    const { error: profileError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT auth.uid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
          purpose TEXT DEFAULT 'conversation' CHECK (purpose IN ('conversation', 'business', 'exam')),
          total_sessions INTEGER DEFAULT 0,
          total_practice_time INTEGER DEFAULT 0,
          average_accuracy DECIMAL(5,2) DEFAULT 0.0,
          streak_count INTEGER DEFAULT 0,
          last_practice TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (profileError) {
      console.error('Profile table error:', profileError);
      // 테이블이 이미 존재할 수 있으므로 에러 무시하고 계속 진행
    }

    // 2. 학습 세션 테이블 생성
    const { error: sessionError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          session_type TEXT NOT NULL CHECK (session_type IN ('level_test', 'practice', 'tutorial')),
          level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
          purpose TEXT CHECK (purpose IN ('conversation', 'business', 'exam')),
          practice_time INTEGER DEFAULT 0,
          overall_accuracy DECIMAL(5,2) DEFAULT 0.0,
          sentences_completed INTEGER DEFAULT 0,
          total_sentences INTEGER DEFAULT 0,
          sentence_results JSONB,
          voice_analysis JSONB,
          completed_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (sessionError) {
      console.error('Session table error:', sessionError);
    }

    // 3. 일별 진행도 테이블 생성
    const { error: progressError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS daily_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          date DATE NOT NULL,
          practice_time INTEGER DEFAULT 0,
          lessons_completed INTEGER DEFAULT 0,
          total_sessions INTEGER DEFAULT 0,
          accuracy_scores DECIMAL(5,2)[] DEFAULT '{}',
          average_accuracy DECIMAL(5,2) DEFAULT 0.0,
          daily_goal_achieved BOOLEAN DEFAULT FALSE,
          streak_maintained BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, date)
        );
      `
    });

    if (progressError) {
      console.error('Progress table error:', progressError);
    }

    // 4. 인덱스 생성
    const { error: indexError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);
      `
    });

    if (indexError) {
      console.error('Index creation error:', indexError);
    }

    console.log('✅ Database setup completed successfully');

    return res.json({
      success: true,
      message: 'Database tables created successfully',
      tables: ['user_profiles', 'user_sessions', 'daily_progress'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Database setup failed:', error);
    return res.status(500).json({
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}