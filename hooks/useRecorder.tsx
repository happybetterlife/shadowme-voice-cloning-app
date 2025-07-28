import { useState, useRef } from 'react';

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // ElevenLabs 호환성을 위해 WebM을 우선적으로 사용
      let options: MediaRecorderOptions = {};
      
      // 1순위: WebM with Opus (가장 호환성 좋음)
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus' };
        console.log('🎤 Using WebM with Opus codec for ElevenLabs compatibility');
      } 
      // 2순위: WebM 기본
      else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
        console.log('🎤 Using WebM for ElevenLabs compatibility');
      }
      // 3순위: MP4 (Safari 등에서 WebM 지원 안 할 때만)
      else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
        console.log('⚠️ Using MP4 - may have ElevenLabs compatibility issues');
      }
      // 마지막: AAC
      else if (MediaRecorder.isTypeSupported('audio/aac')) {
        options = { mimeType: 'audio/aac' };
        console.log('⚠️ Using AAC - may have ElevenLabs compatibility issues');
      }
      
      console.log('🎤 Recording with options:', options);
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        const mediaRecorder = mediaRecorderRef.current;
        
        mediaRecorder.onstop = () => {
          // 실제 녹음된 형식을 사용
          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: mimeType });
          console.log('🎵 Created audio blob:', { size: blob.size, type: blob.type });
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          
          // 스트림 정리
          const stream = mediaRecorder.stream;
          stream.getTracks().forEach(track => track.stop());
          
          resolve(blob);
        };
        
        mediaRecorder.stop();
        setIsRecording(false);
      } else {
        resolve(null);
      }
    });
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  return {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording
  };
}