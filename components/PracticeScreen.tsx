import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { GradientButton } from './GradientButton';
import { Card } from './ui/card';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, Mic, MicOff, AlertCircle, Home } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { getAccuracyColor } from './AccuracyBadge';
import { AccuracyColorBar } from './AccuracyColorBar';
import { Progress } from './ui/progress';
import { apiClient } from '../utils/api';
import { voiceApi } from '../utils/voiceApi';
import { useWavRecorder } from '../hooks/useWavRecorder';
import { speechOceanSentences, calculateRealisticScore } from '../data/speechocean-sentences';

// 마이크 상태 확인 함수
const getMicrophonePermissionStatus = async (): Promise<string> => {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return result.state;
  } catch {
    return 'prompt';
  }
};

interface Word {
  text: string;
  accuracy: number;
  startTime: number;
  endTime: number;
}

interface Sentence {
  text: string;
  pronunciation: string;
  difficulty: string;
}

interface PracticeScreenProps {
  userProfile?: any;
  clonedVoiceData?: { url: string; sampleText: string; audioBlob?: Blob; sessionId?: string } | null;
  onBack: () => void;
  onComplete: (sessionData: any) => void;
}

// 레벨별 문장 샘플링 함수
const getSampleSentences = (level: string, purpose: string): Sentence[] => {
  // SpeechOcean762 데이터에서 레벨과 목적에 맞는 문장들 가져오기
  const levelKey = level as keyof typeof speechOceanSentences;
  const purposeKey = purpose === 'business' ? 'business' : 'conversation';
  
  let sentences: any[] = [];
  
  if (speechOceanSentences[levelKey] && speechOceanSentences[levelKey][purposeKey]) {
    sentences = speechOceanSentences[levelKey][purposeKey].slice(0, 8);
  } else if (speechOceanSentences.beginner && speechOceanSentences.beginner.conversation) {
    // fallback to beginner conversation
    sentences = speechOceanSentences.beginner.conversation.slice(0, 8);
  }

  // Convert to expected format
  return sentences.map(s => ({
    text: s.text,
    pronunciation: s.text.toLowerCase(), // Simple fallback for pronunciation
    difficulty: s.level
  }));
};

export function PracticeScreen({ userProfile, clonedVoiceData, onBack, onComplete }: PracticeScreenProps) {
  const [sessionId] = useState(() => {
    // 클로닝된 음성 데이터에 sessionId가 있으면 그것을 사용, 없으면 새로 생성
    if (clonedVoiceData?.sessionId) {
      console.log('✅ 튜토리얼에서 전달받은 sessionId 사용:', clonedVoiceData.sessionId);
      return clonedVoiceData.sessionId;
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('⚠️ 새로운 sessionId 생성 (클로닝된 음성 사용 불가):', newSessionId);
      return newSessionId;
    }
  });
  const [sentences] = useState<Sentence[]>(getSampleSentences(userProfile?.level || 'beginner', userProfile?.purpose || 'conversation'));
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [userPronunciations, setUserPronunciations] = useState<(Word[] | null)[]>(Array(8).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clonedAudioUrl, setClonedAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [originalRecordingUrl, setOriginalRecordingUrl] = useState<string | null>(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [lastRecordingBlob, setLastRecordingBlob] = useState<Blob | null>(null);

  const { isRecording, startRecording, stopRecording, resetRecording } = useWavRecorder();

  useEffect(() => {
    // Generate cloned audio for the first sentence when component mounts
    if (clonedVoiceData?.audioBlob && sentences.length > 0) {
      generateClonedAudio(sentences[0].text);
    }
  }, [clonedVoiceData, sentences]);

  const checkMicrophoneAvailable = async () => {
    setIsLoading(true);
    
    try {
      // 간단하게 권한 체크 - 실패하면 에러 표시
      const status = await getMicrophonePermissionStatus();
      console.log('Microphone permission status:', status);
      
      // 권한이 거부된 경우에만 에러 표시
      if (status === 'denied') {
        setHasError(true);
        setErrorMessage('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
        setIsLoading(false);
        return false;
      }
      
      setHasError(false);
      setErrorMessage('');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Microphone check failed:', error);
      // 에러가 발생해도 일단 진행 (권한 프롬프트는 녹음 시작할 때 나타남)
      setHasError(false);
      setIsLoading(false);
      return true;
    }
  };

  const generateClonedAudio = async (text: string) => {
    if (!clonedVoiceData?.audioBlob) return;
    
    setIsGeneratingAudio(true);
    try {
      const result = await voiceApi.cloneVoice(clonedVoiceData.audioBlob, text, sessionId);
      setClonedAudioUrl(result.url);
    } catch (error) {
      console.error('Failed to generate cloned audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playAudio = async () => {
    if (isPlaying) {
      currentAudio?.pause();
      setIsPlaying(false);
      return;
    }

    const currentText = sentences[currentSentenceIndex]?.text;
    if (!currentText) return;

    setIsLoading(true);
    try {
      let audioUrl: string;
      
      // If we have cloned voice data, use it
      if (clonedVoiceData?.audioBlob && clonedAudioUrl) {
        audioUrl = clonedAudioUrl;
      } else {
        // Fallback to default TTS - use clone voice API without cloned audio
        const result = await voiceApi.cloneVoice(new Blob(), currentText);
        audioUrl = result.url;
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setHasError(true);
        setErrorMessage('오디오 재생에 실패했습니다.');
      };

      await audio.play();
    } catch (error) {
      console.error('Audio generation/playback failed:', error);
      setHasError(true);
      setErrorMessage('음성 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const startPronunciationRecording = async () => {
    const micAvailable = await checkMicrophoneAvailable();
    if (!micAvailable) return;

    const success = await startRecording();
    if (!success) {
      setHasError(true);
      setErrorMessage('녹음을 시작할 수 없습니다. 마이크 연결을 확인해주세요.');
    }
  };

  const stopPronunciationRecording = async () => {
    const audioBlob = await stopRecording();
    if (!audioBlob) {
      setHasError(true);
      setErrorMessage('녹음 데이터를 가져올 수 없습니다.');
      return;
    }

    setLastRecordingBlob(audioBlob);
    const recordingUrl = URL.createObjectURL(audioBlob);
    setOriginalRecordingUrl(recordingUrl);

    setIsLoading(true);
    try {
      const result = await voiceApi.analyzeVoice(audioBlob, sentences[currentSentenceIndex].text);
      
      // Use actual analysis results from API
      const words = result.word_analysis?.map((wordData: any) => ({
        text: wordData.word.replace(/[.,!?]/g, ''), // Remove punctuation
        accuracy: wordData.accuracy,
        startTime: wordData.start_time,
        endTime: wordData.end_time
      })) || sentences[currentSentenceIndex].text.split(' ').map((word, index) => ({
        text: word.replace(/[.,!?]/g, ''),
        accuracy: 85, // Fallback accuracy
        startTime: index * 0.5,
        endTime: (index + 1) * 0.5
      }));
      
      const newPronunciations = [...userPronunciations];
      newPronunciations[currentSentenceIndex] = words;
      setUserPronunciations(newPronunciations);
      setHasError(false);
    } catch (error) {
      console.error('Pronunciation analysis failed:', error);
      setHasError(true);
      setErrorMessage('발음 분석에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      
      // Generate cloned audio for the next sentence
      if (clonedVoiceData?.audioBlob && sentences[nextIndex]) {
        generateClonedAudio(sentences[nextIndex].text);
      }

      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
      }
    } else {
      // 마지막 문장에서 다음을 누르면 학습 완료
      completePractice();
    }
  };

  const goToPreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      const prevIndex = currentSentenceIndex - 1;
      setCurrentSentenceIndex(prevIndex);
      
      // Generate cloned audio for the previous sentence
      if (clonedVoiceData?.audioBlob && sentences[prevIndex]) {
        generateClonedAudio(sentences[prevIndex].text);
      }

      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
      }
    }
  };

  const completePractice = () => {
    // Calculate session statistics
    const completedSentences = userPronunciations.filter(p => p !== null).length;
    const totalWords = userPronunciations
      .filter(p => p !== null)
      .reduce((sum, words) => sum + (words?.length || 0), 0);
    
    const totalAccuracy = userPronunciations
      .filter(p => p !== null)
      .reduce((sum, words) => {
        if (!words) return sum;
        const avgAccuracy = words.reduce((acc, word) => acc + word.accuracy, 0) / words.length;
        return sum + avgAccuracy;
      }, 0);

    const averageAccuracy = completedSentences > 0 ? totalAccuracy / completedSentences : 0;

    const sessionData = {
      sessionId: sessionId,
      completedSentences,
      totalSentences: sentences.length,
      averageAccuracy: Math.round(averageAccuracy),
      practiceTime: 300, // 5 minutes estimated
      sentences: sentences.map((sentence, index) => ({
        text: sentence.text,
        pronunciation: sentence.pronunciation,
        userPronunciation: userPronunciations[index],
        completed: userPronunciations[index] !== null
      }))
    };

    onComplete(sessionData);
  };

  const resetCurrentSentence = () => {
    const newPronunciations = [...userPronunciations];
    newPronunciations[currentSentenceIndex] = null;
    setUserPronunciations(newPronunciations);
    setHasError(false);
    resetRecording();
    if (originalRecordingUrl) {
      URL.revokeObjectURL(originalRecordingUrl);
      setOriginalRecordingUrl(null);
    }
    setLastRecordingBlob(null);
  };

  const currentSentence = sentences[currentSentenceIndex];
  const currentPronunciation = userPronunciations[currentSentenceIndex];
  const canGoNext = currentSentenceIndex < sentences.length - 1;
  const canGoPrevious = currentSentenceIndex > 0;
  const hasCompletedAll = userPronunciations.every(p => p !== null);

  if (!currentSentence) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">문장을 로드할 수 없습니다.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <div className="w-full max-w-sm mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">발음 연습</h1>
            <Button variant="ghost" onClick={onBack} className="p-2">
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>진행률</span>
            <span>{currentSentenceIndex + 1} / {sentences.length}</span>
          </div>
          <Progress value={(currentSentenceIndex + 1) / sentences.length * 100} className="h-2" />
        </div>

        {/* Main Content Area */}
        <div className="bg-gradient-to-b from-blue-100 via-green-100 to-yellow-100 rounded-lg p-6 mb-6">
          {/* Sentence with word highlighting */}
          <div className="text-center mb-6">
            {currentPronunciation ? (
              <div className="text-lg font-medium leading-relaxed">
                {currentSentence.text.split(' ').map((word, index) => {
                  const cleanWord = word.replace(/[.,!?]/g, '');
                  const wordData = currentPronunciation.find(w => w.text === cleanWord);
                  const accuracy = wordData?.accuracy || 0;
                  
                  let bgColor = '';
                  if (accuracy >= 90) bgColor = 'bg-green-200';
                  else if (accuracy >= 80) bgColor = 'bg-yellow-200';
                  else if (accuracy >= 70) bgColor = 'bg-orange-200';
                  else bgColor = 'bg-red-200';
                  
                  return (
                    <span
                      key={index}
                      className={`inline-block mx-1 px-2 py-1 rounded ${bgColor}`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-lg font-medium text-gray-800 mb-3">
                {currentSentence.text}
              </p>
            )}
          </div>

          {/* Waveform Visualization */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-blue-500 rounded-full transition-all duration-300 ${
                    isRecording ? 'h-8 animate-pulse' : 'h-4'
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center space-x-3 mb-4">
            <Button
              onClick={playAudio}
              disabled={isLoading || isGeneratingAudio}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isGeneratingAudio ? '생성 중...' : isPlaying ? '일시정지' : '듣기'}
            </Button>
          </div>

          {/* Overall Score Display */}
          {currentPronunciation && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-xl font-bold">
                {Math.round(currentPronunciation.reduce((sum, word) => sum + word.accuracy, 0) / currentPronunciation.length)}%
              </div>
              <p className="text-sm text-gray-600 mt-2">발음 정확도</p>
              <p className="text-xs text-gray-500">좋아해요!</p>
              <p className="text-xs text-gray-400 mt-1">시도 횟수: {currentSentenceIndex + 1}/5</p>
              
              {/* 색상 가이드 */}
              <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">발음 정확도 가이드</p>
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
                    <span>90%+</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-200 rounded mr-1"></div>
                    <span>80-89%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-200 rounded mr-1"></div>
                    <span>70-79%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-200 rounded mr-1"></div>
                    <span>~69%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="space-y-3 mb-6">
          <GradientButton
            onClick={isRecording ? stopPronunciationRecording : startPronunciationRecording}
            disabled={isLoading}
            className="w-full"
          >
            {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isRecording ? '녹음 중지' : '발음 녹음'}
          </GradientButton>

          {currentPronunciation && (
            <Button
              onClick={resetCurrentSentence}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              다시 시도
            </Button>
          )}
        </div>

        {/* Error Display */}
        {hasError && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between space-x-3 mb-6">
          <Button
            onClick={goToPreviousSentence}
            disabled={!canGoPrevious}
            variant="outline"
            className="flex-1"
          >
            이전
          </Button>
          
          {currentSentenceIndex === sentences.length - 1 ? (
            <GradientButton
              onClick={completePractice}
              className="flex-1"
            >
              연습 완료
            </GradientButton>
          ) : (
            <Button
              onClick={goToNextSentence}
              disabled={!canGoNext}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              다음 문장
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Complete Practice */}
        {hasCompletedAll && (
          <GradientButton
            onClick={completePractice}
            className="w-full"
          >
            연습 완료
          </GradientButton>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}