export const voiceApi = {
  // 음성 클로닝
  async cloneVoice(audioBlob: Blob, text?: string, sessionId?: string): Promise<{ url: string }> {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
      
      const base64Audio = await base64Promise;
      
      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text || 'Hello, how are you today?',
          audioData: base64Audio,
          sessionId: sessionId,
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { url };
      } else {
        throw new Error('Voice cloning failed');
      }
    } catch (error) {
      console.error('Voice cloning error:', error);
      throw new Error('Voice cloning failed');
    }
  },

  // 음성 분석
  async analyzeVoice(audioBlob: Blob, targetText: string): Promise<{
    accuracy: number;
    fluency: number;
    pronunciation: number;
    suggestions: string[];
    overall_accuracy: number;
    word_analysis: Array<{
      word: string;
      accuracy: number;
      start_time: number;
      end_time: number;
    }>;
  }> {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
      
      const base64Audio = await base64Promise;
      
      const response = await fetch('/api/analyze-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: targetText,
          audioData: base64Audio,
        }),
      });
      
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Voice analysis failed');
      }
    } catch (error) {
      console.error('Voice analysis error:', error);
      throw new Error('Voice analysis failed');
    }
  },

  // 오디오 재생
  playAudio(url: string): HTMLAudioElement {
    const audio = new Audio(url);
    audio.play();
    return audio;
  }
};