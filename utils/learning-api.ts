// 학습 진도 관련 API 클라이언트
export class LearningApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || '/api';
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken || ''}`
    };
  }

  // 학습 진도 API
  async getDailyProgress(date?: string) {
    const params = new URLSearchParams({ type: 'daily' });
    if (date) params.append('date', date);
    
    const response = await fetch(`${this.baseUrl}/learning-progress?${params}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get daily progress');
    const data = await response.json();
    return data.progress;
  }

  async getWeeklyProgress() {
    const response = await fetch(`${this.baseUrl}/learning-progress?type=weekly`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get weekly progress');
    const data = await response.json();
    return data.progress;
  }

  async getMonthlyStats() {
    const response = await fetch(`${this.baseUrl}/learning-progress?type=monthly`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get monthly stats');
    const data = await response.json();
    return data.stats;
  }

  async getLearningSummary() {
    const response = await fetch(`${this.baseUrl}/learning-progress?type=summary`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get learning summary');
    const data = await response.json();
    return data.summary;
  }

  async updateProgress(progressData: {
    practiceTime: number;
    lessonsCompleted: number;
    accuracyScore: number;
  }) {
    const response = await fetch(`${this.baseUrl}/learning-progress`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(progressData)
    });
    
    if (!response.ok) throw new Error('Failed to update progress');
    const data = await response.json();
    return data.progress;
  }

  async createSession(sessionData: any) {
    const response = await fetch(`${this.baseUrl}/learning-progress`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(sessionData)
    });
    
    if (!response.ok) throw new Error('Failed to create session');
    return await response.json();
  }

  // 음성 클론 관리 API
  async getVoiceClones() {
    const response = await fetch(`${this.baseUrl}/voice-clones`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get voice clones');
    const data = await response.json();
    return data.voices;
  }

  async saveVoiceClone(voiceData: {
    sessionId: string;
    voiceId: string;
    sampleText: string;
    audioDataSize?: number;
    quality_score?: number;
  }) {
    const response = await fetch(`${this.baseUrl}/voice-clones`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(voiceData)
    });
    
    if (!response.ok) throw new Error('Failed to save voice clone');
    const data = await response.json();
    return data.voice_clone;
  }

  async deleteVoiceClone(voiceId: string) {
    const response = await fetch(`${this.baseUrl}/voice-clones?voiceId=${voiceId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to delete voice clone');
    return await response.json();
  }

  // 연습 기록 API
  async getPracticeRecords(options?: {
    sessionId?: string;
    sentenceId?: string;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams();
    if (options?.sessionId) params.append('sessionId', options.sessionId);
    if (options?.sentenceId) params.append('sentenceId', options.sentenceId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    
    const response = await fetch(`${this.baseUrl}/practice-records?${params}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get practice records');
    return await response.json();
  }

  async createPracticeRecord(recordData: {
    sessionId: string;
    sentenceId: string;
    sentenceText: string;
    sentenceLevel: string;
    sentencePurpose: string;
    attemptNumber: number;
    accuracyScore: number;
    fluencyScore?: number;
    pronunciationScore?: number;
    wordAccuracies?: any[];
    audioUrl?: string;
    clonedAudioUrl?: string;
    useClonedVoice?: boolean;
    recordingDuration?: number;
    errorDetails?: any;
  }) {
    const response = await fetch(`${this.baseUrl}/practice-records`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(recordData)
    });
    
    if (!response.ok) throw new Error('Failed to create practice record');
    const data = await response.json();
    return data.record;
  }

  async updatePracticeRecord(recordId: string, updates: any) {
    const response = await fetch(`${this.baseUrl}/practice-records?recordId=${recordId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) throw new Error('Failed to update practice record');
    const data = await response.json();
    return data.record;
  }

  // 학습 통계 헬퍼 메서드
  async getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    const [progress, records] = await Promise.all([
      this.getDailyProgress(today),
      this.getPracticeRecords({ 
        startDate: today, 
        endDate: today 
      })
    ]);
    
    return {
      progress,
      practiceRecords: records.records,
      sentenceStats: records.stats
    };
  }

  async getWeeklyStats() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const [weeklyProgress, records] = await Promise.all([
      this.getWeeklyProgress(),
      this.getPracticeRecords({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      })
    ]);
    
    return {
      weeklyProgress,
      practiceRecords: records.records,
      sentenceStats: records.stats
    };
  }
}

// 싱글톤 인스턴스
export const learningApiClient = new LearningApiClient();