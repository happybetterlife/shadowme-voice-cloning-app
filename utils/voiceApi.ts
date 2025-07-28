export const voiceApi = {
  // 음성 클로닝
  async cloneVoice(audioBlob: Blob, text?: string, sessionId?: string): Promise<{ url: string }> {
    try {
      console.log('🎤 Starting voice cloning...');
      console.log('🎵 Blob size:', audioBlob.size);
      console.log('🎵 Blob type:', audioBlob.type);
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          console.log('✅ FileReader completed');
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          console.error('❌ FileReader error');
          reject(new Error('FileReader failed'));
        };
        reader.readAsDataURL(audioBlob);
      });
      
      const base64Audio = await base64Promise;
      console.log('📝 Base64 audio length:', base64Audio.length);
      console.log('📝 Base64 starts with:', base64Audio.substring(0, 50));
      
      console.log('🌐 Making API request to /api/clone-voice...');
      console.log('📦 Request body keys:', ['text', 'audioData', 'sessionId']);
      console.log('📦 Request body sizes:', {
        text: (text || 'Hello, how are you today?').length,
        audioData: base64Audio.length,
        sessionId: sessionId?.length || 0
      });
      
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
      
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response statusText:', response.statusText);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));
      
      // 서버에서 어떤 음성이 사용되었는지 확인하기 위한 힌트
      const contentDisposition = response.headers.get('content-disposition');
      const fallbackReason = response.headers.get('x-fallback-reason');
      
      if (contentDisposition) {
        console.log('📁 Content-Disposition:', contentDisposition);
        
        if (contentDisposition.includes('fallback_voice.mp3')) {
          console.warn('🚨 SERVER IS USING FALLBACK VOICE - NOT YOUR VOICE!');
          console.warn('🔍 Fallback Reason:', fallbackReason || 'Unknown reason');
          alert(`⚠️ 음성 클로닝이 실패했습니다!\n\n실패 이유: ${fallbackReason || '알 수 없는 오류'}\n\n기본 음성이 사용됩니다.`);
        } else if (contentDisposition.includes('cloned_voice.mp3') || contentDisposition.includes('cached_cloned_voice.mp3')) {
          console.log('🎉 SERVER IS USING YOUR CLONED VOICE!');
          alert('✅ 음성 클로닝이 성공했습니다! 당신의 목소리로 변환되었습니다.');
        }
      }
      
      if (response.ok) {
        console.log('✅ Response OK, creating blob from response...');
        const blob = await response.blob();
        console.log('🎵 Response blob size:', blob.size);
        console.log('🎵 Response blob type:', blob.type);
        
        // Vercel 환경에서 blob URL 생성 문제 체크
        try {
          const url = URL.createObjectURL(blob);
          console.log('🔗 Created object URL:', url);
          
          // URL 유효성 테스트
          const testAudio = new Audio(url);
          await new Promise((resolve, reject) => {
            testAudio.onloadeddata = () => {
              console.log('✅ Audio URL is valid and playable');
              resolve(true);
            };
            testAudio.onerror = (e) => {
              console.error('❌ Audio URL validation failed:', e);
              reject(e);
            };
            // 타임아웃 설정
            setTimeout(() => reject(new Error('Audio load timeout')), 5000);
          });
          
          return { url };
        } catch (urlError) {
          console.error('❌ Failed to create or validate object URL:', urlError);
          throw new Error('Failed to create audio URL');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        
        // API 키 문제인지 확인
        if (errorText.includes('API key not configured') || response.status === 500) {
          console.error('🔑 API key may not be configured in Vercel environment variables');
          alert('음성 클로닝 서비스가 일시적으로 사용할 수 없습니다. 환경 설정을 확인해주세요.');
        }
        
        throw new Error(`Voice cloning failed: ${response.status} ${errorText}`);
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