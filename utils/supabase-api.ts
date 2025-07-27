import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export class SupabaseApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      supabase.auth.setSession({
        access_token: token,
        refresh_token: token
      } as any);
    }
  }

  // 사용자 프로필 생성/업데이트
  async saveUserProfile(profileData: {
    email: string;
    name: string;
    level?: string;
    purpose?: string;
  }) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.user.id,
          email: profileData.email,
          name: profileData.name,
          level: profileData.level || 'beginner',
          purpose: profileData.purpose || 'conversation',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { profile: data };
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  // 사용자 프로필 조회
  async getUserProfile() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (error) throw error;
      return { profile: data };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  // 학습 세션 저장
  async saveSession(sessionData: {
    session_type: 'level_test' | 'practice' | 'tutorial';
    level: string;
    purpose?: string;
    practice_time?: number;
    overall_accuracy?: number;
    sentences_completed?: number;
    total_sentences?: number;
    sentence_results?: any;
    voice_analysis?: any;
  }) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // 1. 세션 저장
      const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.user.id,
          ...sessionData,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // 2. 사용자 프로필 통계 업데이트
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          total_sessions: 1, // 간단히 1로 설정
          total_practice_time: sessionData.practice_time || 0,
          average_accuracy: sessionData.overall_accuracy,
          last_practice: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.user.id);

      if (profileError) console.warn('Profile update failed:', profileError);

      // 3. 일별 진행도 업데이트
      await this.updateDailyProgress({
        practiceTime: sessionData.practice_time || 0,
        lessonsCompleted: 1,
        accuracyScore: sessionData.overall_accuracy || 0
      });

      return { session_id: session.id, message: 'Session saved successfully' };
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  // 일별 진행도 업데이트
  async updateDailyProgress(progressData: {
    practiceTime: number;
    lessonsCompleted: number;
    accuracyScore: number;
  }) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // 기존 일별 진행도 조회
      const { data: existing, error: selectError } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('date', today)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        // 기존 데이터 업데이트
        const newAccuracyScores = [...(existing.accuracy_scores || []), progressData.accuracyScore];
        const avgAccuracy = newAccuracyScores.reduce((a, b) => a + b, 0) / newAccuracyScores.length;

        const { error: updateError } = await supabase
          .from('daily_progress')
          .update({
            practice_time: existing.practice_time + progressData.practiceTime,
            lessons_completed: existing.lessons_completed + progressData.lessonsCompleted,
            total_sessions: existing.total_sessions + 1,
            accuracy_scores: newAccuracyScores,
            average_accuracy: Math.round(avgAccuracy * 100) / 100,
            daily_goal_achieved: (existing.practice_time + progressData.practiceTime) >= (15 * 60), // 15분 목표
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // 새 데이터 생성
        const { error: insertError } = await supabase
          .from('daily_progress')
          .insert({
            user_id: user.user.id,
            date: today,
            practice_time: progressData.practiceTime,
            lessons_completed: progressData.lessonsCompleted,
            total_sessions: 1,
            accuracy_scores: [progressData.accuracyScore],
            average_accuracy: progressData.accuracyScore,
            daily_goal_achieved: progressData.practiceTime >= (15 * 60)
          });

        if (insertError) throw insertError;
      }

      return { message: 'Daily progress updated successfully' };
    } catch (error) {
      console.error('Failed to update daily progress:', error);
      throw error;
    }
  }

  // 일별 진행도 조회
  async getDailyProgress(date?: string) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const targetDate = date || new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('date', targetDate)
        .maybeSingle();

      if (error) throw error;

      return data || {
        date: targetDate,
        practice_time: 0,
        lessons_completed: 0,
        total_sessions: 0,
        accuracy_scores: [],
        average_accuracy: 0,
        daily_goal_achieved: false
      };
    } catch (error) {
      console.error('Failed to get daily progress:', error);
      return {
        date: date || new Date().toISOString().split('T')[0],
        practice_time: 0,
        lessons_completed: 0,
        total_sessions: 0,
        accuracy_scores: [],
        average_accuracy: 0,
        daily_goal_achieved: false
      };
    }
  }

  // 주별 진행도 조회
  async getWeeklyProgress() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);

      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      // 7일 데이터 채우기 (빈 날짜는 기본값으로)
      const weekProgress: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayData = data?.find(d => d.date === dateString) || {
          date: dateString,
          practice_time: 0,
          lessons_completed: 0,
          total_sessions: 0,
          accuracy_scores: [],
          average_accuracy: 0,
          daily_goal_achieved: false
        };
        
        weekProgress.push(dayData);
      }

      return weekProgress;
    } catch (error) {
      console.error('Failed to get weekly progress:', error);
      return [];
    }
  }
}

export const supabaseApiClient = new SupabaseApiClient();