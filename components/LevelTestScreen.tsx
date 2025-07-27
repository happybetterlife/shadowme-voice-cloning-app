import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { GradientButton } from './GradientButton';
import { Progress } from './ui/progress';
import { WaveformVisualizer } from './WaveformVisualizer';
import { AccuracyBadge, getAccuracyColor } from './AccuracyBadge';
import { AccuracyColorBar } from './AccuracyColorBar';
import { Card } from './ui/card';
import { Mic, RotateCcw, Play, Pause } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';
import { voiceApi } from '../utils/voiceApi';

interface LevelTestScreenProps {
  level: string;
  purpose: string;
  clonedVoiceData?: { url: string; sampleText: string; audioBlob?: Blob; sessionId?: string } | null;
  onComplete: (results: any, clonedVoiceUrl?: string) => void;
}

// 현실적인 점수 생성 함수
const generateRealisticScore = (text: string, level: string): number => {
  let baseScore = 70;
  let variation = 25;
  
  switch (level) {
    case 'beginner':
      baseScore = 75;
      variation = 20;
      break;
    case 'intermediate':
      baseScore = 70;
      variation = 25;
      break;
    case 'advanced':
      baseScore = 65;
      variation = 30;
      break;
  }
  
  const wordCount = text.split(' ').length;
  if (wordCount > 8) {
    baseScore -= 5;
  } else if (wordCount < 4) {
    baseScore += 5;
  }
  
  const randomVariation = (Math.random() - 0.5) * variation;
  const finalScore = Math.round(baseScore + randomVariation);
  
  return Math.max(50, Math.min(100, finalScore));
};

export function LevelTestScreen({ level, purpose, clonedVoiceData, onComplete }: LevelTestScreenProps) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordAccuracies, setWordAccuracies] = useState<any[]>([]);
  const { isRecording, startRecording, stopRecording } = useRecorder();

  // 테스트 문장들 (API에서 가져오기)
  const [testSentences, setTestSentences] = useState<string[]>([]);
  const [isLoadingSentences, setIsLoadingSentences] = useState(true);

  // 컴포넌트 마운트 시 문장 로드
  useEffect(() => {
    const loadSentences = async () => {
      try {
        setIsLoadingSentences(true);
        console.log('📚 레벨테스트 문장 로딩:', { level, purpose });
        
        const response = await fetch(`/api/sentences?level=${level}&purpose=${purpose}&limit=5&random=true`);
        const data = await response.json();
        
        if (data.sentences && data.sentences.length > 0) {
          const sentences = data.sentences.map((s: any) => s.text);
          setTestSentences(sentences);
          console.log('✅ API에서 문장 로딩 완료:', sentences.length);
        } else {
          // 폴백: 하드코딩된 문장 사용
          const fallbackSentences = getFallbackSentences();
          setTestSentences(fallbackSentences);
          console.log('⚠️ API 실패, 하드코딩된 문장 사용:', fallbackSentences.length);
        }
      } catch (error) {
        console.error('❌ 문장 로딩 실패:', error);
        // 에러 시 하드코딩된 문장 사용
        const fallbackSentences = getFallbackSentences();
        setTestSentences(fallbackSentences);
      } finally {
        setIsLoadingSentences(false);
      }
    };

    loadSentences();
  }, [level, purpose]);

  // 하드코딩된 문장들 (폴백용)
  const getFallbackSentences = () => {
    const sentences = {
      beginner: {
        conversation: [
          "We call it bear.",
          "It is a nice day.",
          "I like to read books.",
          "She has a red car.",
          "The cat is sleeping."
        ],
        business: [
          "Good morning everyone.",
          "Please take a seat.",
          "Thank you for coming.",
          "Let's start the meeting.",
          "Have a great day."
        ],
        exam: [
          "Education is important.",
          "Study hard every day.",
          "Knowledge is power.",
          "Learning never stops.",
          "Books are our friends."
        ]
      },
      intermediate: {
        conversation: [
          "I'm planning to visit my family next weekend.",
          "The restaurant we went to last night was amazing.",
          "I've been learning English for about two years now.",
          "Would you mind if I joined your conversation?",
          "I completely agree with your opinion on this matter."
        ],
        business: [
          "I'd like to discuss the project timeline with you.",
          "Our quarterly results exceeded expectations significantly.",
          "We need to implement new strategies for better efficiency.",
          "The presentation went smoothly thanks to everyone's effort.",
          "I'm confident that we can achieve our goals together."
        ],
        exam: [
          "Academic success requires consistent effort and dedication.",
          "The research methodology was thoroughly explained in the paper.",
          "Environmental conservation is becoming increasingly important globally.",
          "Technology has revolutionized the way we communicate.",
          "Critical thinking skills are essential for problem-solving."
        ]
      },
      advanced: {
        conversation: [
          "I find it fascinating how different cultures approach hospitality.",
          "The nuances in his speech patterns suggest he's quite sophisticated.",
          "I'm particularly intrigued by the philosophical implications of that statement.",
          "The conversation meandered through various topics before settling on politics.",
          "His articulate explanation clarified several misconceptions I had."
        ],
        business: [
          "We need to leverage our competitive advantages strategically.",
          "The market volatility requires us to diversify our portfolio.",
          "Stakeholder engagement is crucial for sustainable growth.",
          "Our organizational restructuring will optimize operational efficiency.",
          "The comprehensive analysis reveals significant opportunities for expansion."
        ],
        exam: [
          "The intricate relationship between socioeconomic factors and educational outcomes.",
          "Contemporary literature reflects the complexities of modern society.",
          "Empirical evidence substantiates the hypothesis proposed in the study.",
          "The paradigm shift necessitates a fundamental reevaluation of our assumptions.",
          "Interdisciplinary approaches yield more comprehensive solutions to complex problems."
        ]
      }
    };
    
    return sentences[level as keyof typeof sentences][purpose as keyof typeof sentences.beginner] || sentences.beginner.conversation;
  };
  const progress = ((currentSentence + (currentResult !== null ? 1 : 0)) / testSentences.length) * 100;

  // 단어별 정확도와 함께 문장 렌더링
  const renderSentenceWithFeedback = () => {
    const currentText = testSentences[currentSentence];
    
    if (!currentResult || wordAccuracies.length === 0) {
      return (
        <p className="text-lg leading-relaxed text-center">
          "{currentText}"
        </p>
      );
    }

    const words = currentText.split(' ');
    return (
      <p className="text-lg leading-relaxed text-center">
        "
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,!?]/g, '');
          const wordAccuracy = wordAccuracies.find(w => w.text === cleanWord);
          const accuracy = wordAccuracy?.accuracy || 0;
          const colorClass = getAccuracyColor(accuracy);
          
          return (
            <span 
              key={index}
              className={`inline-block mx-1 px-1 rounded ${colorClass} transition-all duration-300`}
            >
              {word}
            </span>
          );
        })}
        "
      </p>
    );
  };

  // 클로닝된 음성으로 현재 문장 재생
  const playClonedVoice = async () => {
    if (isPlaying) return;
    
    const currentText = testSentences[currentSentence];
    
    if (!clonedVoiceData?.audioBlob || !clonedVoiceData?.sessionId) {
      console.log('❌ 클로닝된 음성 데이터가 없습니다');
      alert('먼저 튜토리얼에서 음성을 녹음해주세요.');
      return;
    }

    setIsPlaying(true);
    
    try {
      console.log('🎯 클로닝된 음성으로 재생:', currentText);
      
      const result = await voiceApi.cloneVoice(clonedVoiceData.audioBlob, currentText, clonedVoiceData.sessionId);
      
      const audio = new Audio(result.url);
      
      audio.onended = () => {
        console.log('✅ 클로닝된 음성 재생 완료');
        setIsPlaying(false);
      };
      
      audio.onerror = (e) => {
        console.error('❌ 클로닝된 음성 재생 에러:', e);
        setIsPlaying(false);
        alert('음성 재생에 실패했습니다.');
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('❌ 클로닝된 음성 생성/재생 실패:', error);
      setIsPlaying(false);
      alert('음성 생성에 실패했습니다. 네트워크 연결을 확인해주세요.');
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      setIsProcessing(true);

      try {
        const recordedBlob = await stopRecording();
        
        if (recordedBlob) {
          // 음성 분석 (실제로는 더미 점수 생성)
          const currentText = testSentences[currentSentence];
          const score = generateRealisticScore(currentText, level);
          
          // 단어별 정확도 생성
          const words = currentText.split(' ').map(word => word.replace(/[.,!?]/g, ''));
          const wordScores = words.map(word => ({
            text: word,
            accuracy: Math.floor(Math.random() * 30) + 70 // 70-99%
          }));
          
          setCurrentResult(score);
          setResults([...results, score]);
          setWordAccuracies(wordScores);
        }
      } catch (error) {
        console.error('Recording analysis failed:', error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      startRecording();
    }
  };

  const handleNext = () => {
    if (currentSentence < testSentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setCurrentResult(null);
      setWordAccuracies([]);
    } else {
      // 테스트 완료
      const averageScore = results.reduce((sum, score) => sum + score, 0) / results.length;
      onComplete({ averageScore, results, adjustedLevel: level });
    }
  };

  const handleRetry = () => {
    setCurrentResult(null);
    setWordAccuracies([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-6 flex flex-col justify-center min-h-screen">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            레벨 테스트
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              문장 {currentSentence + 1} / {testSentences.length}
            </p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
          </div>
        </div>
        
        {/* 현재 문장 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
          {renderSentenceWithFeedback()}
        </div>

        {/* 내 원어민 발음 듣기 버튼 */}
        <div className="text-center space-y-4 mb-6">
          {clonedVoiceData?.audioBlob && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                샘플 녹음으로 클로닝된 당신의 목소리를 들어보세요
              </p>
              <GradientButton
                onClick={playClonedVoice}
                disabled={isPlaying || isRecording}
                className="mt-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    재생 중...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    내 원어민 발음 듣기
                  </>
                )}
              </GradientButton>
            </div>
          )}
        </div>

        {/* 처리 중 표시 */}
        {isProcessing && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">음성을 분석하고 있습니다...</p>
            </div>
          </div>
        )}
        
        {/* 결과 */}
        <div className="space-y-4 mb-6">
          
          {currentResult !== null && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
              <div className="flex justify-center">
                <AccuracyBadge accuracy={currentResult} className="text-lg px-4 py-2" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {currentResult >= 90 ? '완벽해요!' :
                 currentResult >= 80 ? '잘했어요!' :
                 currentResult >= 70 ? '좋아요!' :
                 currentResult >= 60 ? '연습하면 더 좋아질 거예요!' :
                 '다시 한번 해보세요!'}
              </p>
              
              {/* 색상 가이드 */}
              <AccuracyColorBar className="mt-4" showLabels={false} />
            </div>
          )}
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="space-y-3">
          {currentResult === null ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                이제 같은 문장을 따라 말해보세요
              </p>
              <GradientButton 
                onClick={handleRecord}
                disabled={isProcessing || isPlaying}
                className={`w-full shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0'}`}
                size="lg"
              >
                {isRecording ? (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    녹음 중지
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    녹음 시작
                  </>
                )}
              </GradientButton>
            </div>
          ) : (
            <div className="space-y-3">
              <GradientButton 
                onClick={handleNext} 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg" 
                size="lg"
              >
                {currentSentence === testSentences.length - 1 ? '테스트 완료' : '다음 문장'}
              </GradientButton>
              <GradientButton 
                onClick={handleRetry} 
                variant="secondary"
                className="w-full shadow-lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                다시 시도
              </GradientButton>
            </div>
          )}
        </div>
        
        {/* 지금까지의 점수 */}
        {results.length > 0 && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">지금까지의 점수</h4>
            <div className="flex flex-wrap gap-2">
              {results.map((score, index) => (
                <AccuracyBadge key={index} accuracy={score} className="text-xs" />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}