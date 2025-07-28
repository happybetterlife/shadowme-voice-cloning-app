import { useState, useRef } from 'react';
import { GradientButton } from './GradientButton';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Mic, Play, Square, RotateCcw, Pause } from 'lucide-react';
import { Progress } from './ui/progress';
import { useRecorder } from '../hooks/useRecorder';
import { voiceApi } from '../utils/voiceApi';
import { useTranslation } from '../hooks/useTranslation';

interface TutorialScreenProps {
  onComplete: (clonedVoiceData?: { url: string; sampleText: string; audioBlob?: Blob; sessionId?: string }) => void;
}

export function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const { t } = useTranslation();
  const { isRecording, startRecording, stopRecording, resetRecording } = useRecorder();
  const [sessionId] = useState(() => `tutorial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clonedAudioUrl, setClonedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const sampleSentence = "Hello, my name is Sarah and I love learning English.";

  const handleRecord = async () => {
    if (isRecording) {
      setHasRecorded(true);
      setIsProcessing(true);
      
      // 실제 음성 처리
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 20;
        setProcessingProgress(Math.min(progress, 90)); // 90%까지만
      }, 200);
      
      try {
        // 녹음 정지하고 blob 받기
        console.log('Stopping recording...');
        const recordedBlob = await stopRecording();
        console.log('Recording stopped, blob:', recordedBlob);
        
        if (recordedBlob) {
          // 녹음된 오디오 blob 저장
          setRecordedAudioBlob(recordedBlob);
          
          try {
            console.log('🎤 Starting voice cloning process...');
            console.log('📝 Text to clone:', sampleSentence);
            console.log('🎵 Audio blob size:', recordedBlob.size, 'bytes');
            console.log('🎵 Audio blob type:', recordedBlob.type);
            
            // 🚨 EMERGENCY: 로컬스토리지에 음성 데이터 저장
            try {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Audio = reader.result as string;
                localStorage.setItem('userVoiceData', JSON.stringify({
                  sessionId,
                  sampleText: sampleSentence,
                  audioSize: recordedBlob.size,
                  audioType: recordedBlob.type,
                  timestamp: Date.now()
                }));
                localStorage.setItem('userAudioBlob', base64Audio);
                console.log('🚨 EMERGENCY: 음성 데이터 로컬 저장 완료');
              };
              reader.readAsDataURL(recordedBlob);
            } catch (storageError) {
              console.warn('로컬 저장 실패:', storageError);
            }
            
            // 실제 음성 클로닝 API 호출 (sessionId 포함)
            const result = await voiceApi.cloneVoice(recordedBlob, sampleSentence, sessionId);
            console.log('✅ Voice cloning API response:', result);
            console.log('🔗 Result URL type:', typeof result.url);
            console.log('🔗 Result URL value:', result.url);
            
            // 클로닝 결과가 blob이면 URL 생성, 이미 URL이면 그대로 사용
            if (result.url) {
              console.log('🎯 Setting cloned audio URL:', result.url);
              setClonedAudioUrl(result.url);
              
              // URL이 유효한지 테스트
              try {
                const testAudio = new Audio(result.url);
                testAudio.onloadeddata = () => {
                  console.log('✅ Audio URL is valid and loadable');
                };
                testAudio.onerror = (error) => {
                  console.error('❌ Audio URL test failed:', error);
                };
              } catch (testError) {
                console.error('❌ Could not test audio URL:', testError);
              }
            } else {
              console.log('⚠️  No URL in result, creating fallback from original blob');
              const fallbackUrl = URL.createObjectURL(recordedBlob);
              console.log('🔄 Fallback URL created:', fallbackUrl);
              setClonedAudioUrl(fallbackUrl);
            }
            
          } catch (apiError) {
            console.error('❌ Voice cloning API failed:', apiError);
            console.error('❌ API error details:', apiError instanceof Error ? apiError.message : String(apiError));
            console.log('📱 Using fallback: playing original recording');
            
            // API 실패시 원본 녹음 사용 (폴백)
            const fallbackUrl = URL.createObjectURL(recordedBlob);
            console.log('🔄 Fallback URL created:', fallbackUrl);
            setClonedAudioUrl(fallbackUrl);
          }
        } else {
          console.error('No audio blob received');
          setClonedAudioUrl(null);
        }
      } catch (error) {
        console.error('Recording failed:', error);
        setClonedAudioUrl(null);
      } finally {
        clearInterval(progressInterval);
        setProcessingProgress(100);
        setTimeout(() => setIsProcessing(false), 500);
      }
    } else {
      await startRecording();
      setHasRecorded(false);
    }
  };

  const handleRetry = () => {
    resetRecording();
    setHasRecorded(false);
    setIsProcessing(false);
    setProcessingProgress(0);
    setClonedAudioUrl(null);
    setRecordedAudioBlob(null);
  };

  const handlePlay = async () => {
    console.log('🔊 Play button clicked');
    console.log('🎵 Cloned audio URL:', clonedAudioUrl);
    
    if (!clonedAudioUrl) {
      console.log('❌ No audio URL available');
      alert(t('voiceNotReady'));
      return;
    }
    
    try {
      // 기존 재생 중이면 정지
      if (isPlaying) {
        console.log('⏸️ Stopping current playback');
        setIsPlaying(false);
        return;
      }
      
      console.log('🎯 Starting audio playback');
      console.log('🔗 Audio URL:', clonedAudioUrl);
      
      // 간단한 오디오 재생 방식 사용
      const audio = new Audio(clonedAudioUrl);
      
      // 재생 시작 전에 상태 업데이트
      setIsPlaying(true);
      
      // 이벤트 리스너 설정
      audio.addEventListener('ended', () => {
        console.log('⏹️ Audio playback ended');
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Audio error:', e);
        setIsPlaying(false);
        alert('음성 재생 중 오류가 발생했습니다.');
      });
      
      // 재생 시도
      console.log('🎵 Playing audio...');
      await audio.play();
      console.log('✅ Audio started successfully');
      
    } catch (error) {
      console.error('❌ Audio play failed:', error);
      setIsPlaying(false);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error details:', errorMessage);
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('🔊 ' + t('autoplayBlocked'));
      } else {
        alert(t('playbackFailed') + ': ' + errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8 flex flex-col justify-center min-h-screen">
        
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {t('recordSample')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 px-2">
            {t('readSentence')}
          </p>
        </div>
        
        {/* 샘플 문장 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
          <p className="text-lg leading-relaxed text-center text-gray-800 dark:text-gray-200">
            "{sampleSentence}"
          </p>
        </div>
        
        {/* 파형 시각화 */}
        <div className="flex justify-center mb-6">
          <WaveformVisualizer 
            isActive={isRecording} 
            size="lg"
          />
        </div>

        {/* 녹음 상태 */}
        <div className="space-y-4 mb-6">
          
          {/* 상태 표시 */}
          {isRecording && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto animate-pulse mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('recordingNow')}</p>
            </div>
          )}
          
          {isProcessing && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-3">
                {t('processingVoiceToNative')}
              </p>
              <Progress value={processingProgress} className="w-full mb-2" />
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {processingProgress}{t('percentComplete')}
              </p>
            </div>
          )}
          
          {(() => {
            console.log('Render conditions:', { hasRecorded, isProcessing, clonedAudioUrl });
            return hasRecorded && !isProcessing;
          })() && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <div>
                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                  {t('nativeConversionComplete')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {t('yourVoiceSoundsNative')}
                </p>
              </div>
              
              <div className="space-y-2">
                <GradientButton 
                  variant="secondary"
                  onClick={handlePlay}
                  disabled={!clonedAudioUrl}
                  className="w-full min-h-[48px]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      {t('pausePlayback')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {t('listenNativePronunciation')}
                    </>
                  )}
                </GradientButton>
              </div>
            </div>
          )}
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="space-y-3 mb-6">
          {!hasRecorded || isProcessing ? (
            <GradientButton 
              onClick={handleRecord}
              disabled={isProcessing}
              className={`w-full min-h-[56px] ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
              size="lg"
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  {t('stopRecording')}
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  {t('startRecordingAction')}
                </>
              )}
            </GradientButton>
          ) : (
            <div className="space-y-3">
              <GradientButton 
                onClick={() => onComplete(clonedAudioUrl ? { url: clonedAudioUrl, sampleText: sampleSentence, audioBlob: recordedAudioBlob || undefined, sessionId: sessionId } : undefined)} 
                className="w-full min-h-[56px]" 
                size="lg"
              >
                {t('continue')}
              </GradientButton>
              <GradientButton 
                onClick={handleRetry} 
                variant="secondary"
                className="w-full min-h-[56px]"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('reRecordTutorial')}
              </GradientButton>
            </div>
          )}
        </div>
        
        {/* 도움말 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('recordingTips')}</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>{t('tip1')}</li>
            <li>{t('tip2')}</li>
            <li>{t('tip3')}</li>
          </ul>
        </div>
        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
            {t('privacyFooter')}
          </p>
        </div>
      </div>
      
      {/* 오디오 엘리먼트 */}
      {clonedAudioUrl && (
        <audio
          ref={audioRef}
          src={clonedAudioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          preload="auto"
        />
      )}
    </div>
  );
}