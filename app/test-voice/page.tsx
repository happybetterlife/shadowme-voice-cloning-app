'use client';

import { useState } from 'react';

export default function TestVoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [clonedUrl, setClonedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        console.log('✅ Recording completed, blob size:', blob.size);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 3초 후 자동 중지
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      }, 3000);

    } catch (err) {
      console.error('❌ Recording failed:', err);
      setError('마이크 권한이 필요합니다.');
    }
  };

  const testVoiceCloning = async () => {
    if (!audioBlob) {
      setError('먼저 음성을 녹음해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🎯 Starting voice cloning test...');
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
      
      const base64Audio = await base64Promise;
      console.log('📝 Base64 audio length:', base64Audio.length);

      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello, this is a test.',
          audioData: base64Audio,
          sessionId: 'test_session_' + Date.now()
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setClonedUrl(url);
        console.log('✅ Voice cloning successful!');
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        setError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Voice cloning failed:', err);
      setError('음성 클로닝에 실패했습니다: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  const playClonedVoice = () => {
    if (clonedUrl) {
      const audio = new Audio(clonedUrl);
      audio.play().catch(err => {
        console.error('❌ Playback failed:', err);
        setError('재생에 실패했습니다.');
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>음성 클로닝 테스트</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={startRecording} 
          disabled={isRecording}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px',
            backgroundColor: isRecording ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isRecording ? 'not-allowed' : 'pointer'
          }}
        >
          {isRecording ? '녹음 중... (3초)' : '음성 녹음 시작'}
        </button>
      </div>

      {audioBlob && (
        <div style={{ marginBottom: '20px' }}>
          <p>✅ 녹음 완료! (크기: {audioBlob.size} bytes)</p>
          <button 
            onClick={testVoiceCloning}
            disabled={isProcessing}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px',
              backgroundColor: isProcessing ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isProcessing ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessing ? '처리 중...' : '음성 클로닝 테스트'}
          </button>
        </div>
      )}

      {clonedUrl && (
        <div style={{ marginBottom: '20px' }}>
          <p>✅ 음성 클로닝 성공!</p>
          <button 
            onClick={playClonedVoice}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            클로닝된 음성 재생
          </button>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p>이 페이지는 음성 클로닝 기능을 직접 테스트하기 위한 페이지입니다.</p>
        <p>브라우저 개발자 도구(F12)의 Console 탭에서 자세한 로그를 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}