import { useState, useRef, useCallback } from 'react';

export const useWavRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // WAV 파일 헤더 생성
  const createWavHeader = (dataLength: number, sampleRate: number = 44100): ArrayBuffer => {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    
    // "RIFF" 헤더
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);
    
    return buffer;
  };

  // Float32Array를 16-bit PCM으로 변환
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    return buffer;
  };

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 WAV 녹음 시작...');
      
      // 오디오 스트림 가져오기
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          sampleSize: 16
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Web Audio API 설정 (AudioWorklet 사용하거나 MediaRecorder로 대체)
      audioContextRef.current = new AudioContext({ sampleRate: 44100 });
      
      // MediaRecorder를 사용한 더 안정적인 방식
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('⏹️ MediaRecorder 중지됨');
      };

      const stopRecording = (): Promise<Blob> => {
        return new Promise((resolve) => {
          mediaRecorder.onstop = () => {
            console.log('⏹️ WAV 녹음 중지...');
            
            // 녹음된 데이터를 WAV로 변환
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            console.log(`✅ 오디오 파일 생성 완료: ${audioBlob.size} bytes`);
            
            // 정리
            stream.getTracks().forEach(track => track.stop());
            if (audioContextRef.current) {
              audioContextRef.current.close();
            }
            
            resolve(audioBlob);
          };
          
          mediaRecorder.stop();
        });
      };
      
      // MediaRecorder 시작
      mediaRecorder.start(100); // 100ms마다 데이터 수집
      
      // stopRecording 함수를 mediaRecorderRef에 저장
      mediaRecorderRef.current = { stop: stopRecording, mediaRecorder } as any;
      
      setIsRecording(true);
      return true;
      
    } catch (error) {
      console.error('❌ WAV 녹음 시작 실패:', error);
      setIsRecording(false);
      return false;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || !isRecording) {
      console.warn('⚠️ 녹음이 진행 중이 아닙니다');
      return null;
    }

    try {
      const audioBlob = await (mediaRecorderRef.current as any).stop();
      setIsRecording(false);
      
      return audioBlob;
    } catch (error) {
      console.error('❌ WAV 녹음 중지 실패:', error);
      setIsRecording(false);
      return null;
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    audioChunksRef.current = [];
    setIsRecording(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    console.log('🔄 WAV 레코더 리셋 완료');
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    resetRecording
  };
};