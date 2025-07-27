import { projectId, publicAnonKey } from './supabase/info';
import { supabaseApiClient } from './supabase-api';
import { learningApiClient } from './learning-api';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-2238568e`;

export class ApiClient {
  private accessToken: string | null = null;
  private userId: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
    // Supabase API 클라이언트에도 토큰 설정
    supabaseApiClient.setAccessToken(token);
    // Learning API 클라이언트에도 토큰 설정
    learningApiClient.setAccessToken(token);
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
    };
  }

  async signup(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  }

  async getProfile() {
    try {
      // 먼저 Supabase에서 프로필 가져오기
      return await supabaseApiClient.getUserProfile();
    } catch (error) {
      console.warn('Supabase profile fetch failed, falling back to localStorage:', error);
      
      // 폴백: 로컬 스토리지에서 프로필 가져오기
      if (this.userId) {
        const profile = localStorage.getItem(`user_profile_${this.userId}`);
        if (profile) {
          return { profile: JSON.parse(profile) };
        }
      }
      
      throw new Error('Profile not found');
    }
  }

  async saveSession(sessionData: any) {
    try {
      // 먼저 Supabase에 저장 시도
      return await supabaseApiClient.saveSession({
        session_type: sessionData.type || 'practice',
        level: sessionData.level || 'beginner',
        purpose: sessionData.purpose,
        practice_time: sessionData.practice_time || 0,
        overall_accuracy: sessionData.overall_accuracy || 0,
        sentences_completed: sessionData.sentences_completed,
        total_sentences: sessionData.total_sentences,
        sentence_results: sessionData.sentence_results,
        voice_analysis: sessionData.voice_analysis
      });
    } catch (error) {
      console.warn('Supabase session save failed, falling back to localStorage:', error);
      
      // 폴백: 로컬 스토리지에 저장
      if (!this.userId) return { error: 'User not logged in' };
      
      const sessionId = `session_${this.userId}_${Date.now()}`;
      const session = {
        id: sessionId,
        user_id: this.userId,
        ...sessionData,
        completed_at: new Date().toISOString()
      };
      
      localStorage.setItem(sessionId, JSON.stringify(session));
      
      // 사용자 프로필 업데이트
      const profileKey = `user_profile_${this.userId}`;
      const profileData = localStorage.getItem(profileKey);
      if (profileData) {
        const profile = JSON.parse(profileData);
        const updatedProfile = {
          ...profile,
          total_sessions: (profile.total_sessions || 0) + 1,
          total_practice_time: (profile.total_practice_time || 0) + (sessionData.practice_time || 0),
          average_accuracy: sessionData.overall_accuracy || profile.average_accuracy,
          last_practice: new Date().toISOString(),
          streak_count: this.calculateStreak(profile.last_practice)
        };
        localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      }
      
      return { message: 'Session saved successfully', session_id: sessionId };
    }
  }

  private calculateStreak(lastPractice?: string): number {
    if (!lastPractice) return 1;
    
    const today = new Date();
    const lastDate = new Date(lastPractice);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // 연속 학습
      return this.getCurrentStreak() + 1;
    } else if (diffDays > 1) {
      // 중단됨, 다시 시작
      return 1;
    } else {
      // 같은 날
      return this.getCurrentStreak();
    }
  }

  private getCurrentStreak(): number {
    if (!this.userId) return 0;
    const profileKey = `user_profile_${this.userId}`;
    const profileData = localStorage.getItem(profileKey);
    if (profileData) {
      const profile = JSON.parse(profileData);
      return profile.streak_count || 0;
    }
    return 0;
  }

  async updateDailyProgress(progressData: {
    practiceTime: number;
    lessonsCompleted: number;
    accuracyScore: number;
  }) {
    if (!this.userId) return null;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const progressKey = `daily_progress_${this.userId}_${today}`;
    
    const existingProgress = localStorage.getItem(progressKey);
    const currentProgress = existingProgress ? JSON.parse(existingProgress) : {
      date: today,
      practiceTime: 0,
      lessonsCompleted: 0,
      accuracyScores: [],
      totalSessions: 0
    };

    const updatedProgress = {
      ...currentProgress,
      practiceTime: currentProgress.practiceTime + progressData.practiceTime,
      lessonsCompleted: currentProgress.lessonsCompleted + progressData.lessonsCompleted,
      accuracyScores: [...currentProgress.accuracyScores, progressData.accuracyScore],
      totalSessions: currentProgress.totalSessions + 1,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
    
    return updatedProgress;
  }

  async getDailyProgress(date?: string) {
    try {
      // 먼저 Supabase에서 가져오기
      return await supabaseApiClient.getDailyProgress(date);
    } catch (error) {
      console.warn('Supabase daily progress fetch failed, falling back to localStorage:', error);
      
      // 폴백: 로컬 스토리지
      if (!this.userId) return null;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const progressKey = `daily_progress_${this.userId}_${targetDate}`;
      
      const progressData = localStorage.getItem(progressKey);
      return progressData ? JSON.parse(progressData) : {
        date: targetDate,
        practiceTime: 0,
        lessonsCompleted: 0,
        accuracyScores: [],
        totalSessions: 0
      };
    }
  }

  async getWeeklyProgress() {
    try {
      // 먼저 Supabase에서 가져오기
      return await supabaseApiClient.getWeeklyProgress();
    } catch (error) {
      console.warn('Supabase weekly progress fetch failed, falling back to localStorage:', error);
      
      // 폴백: 로컬 스토리지
      const weekProgress: any[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const progress = await this.getDailyProgress(dateString);
        weekProgress.push(progress);
      }
      
      return weekProgress;
    }
  }
}

export const apiClient = new ApiClient();