import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GradientButton } from './GradientButton';
import { WaveformVisualizer } from './WaveformVisualizer';

interface LevelSelectionScreenProps {
  onNext: (level: string, purpose: string) => void;
  onBack: () => void;
}

export function LevelSelectionScreen({ onNext, onBack }: LevelSelectionScreenProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');

  const levels = [
    {
      id: 'beginner',
      title: '초급',
      description: '기본적인 단어와 문장을 배우고 싶어요',
      features: ['기본 단어 300개', '간단한 일상 표현', '발음 기초']
    },
    {
      id: 'intermediate',
      title: '중급',
      description: '어느 정도 대화가 가능하지만 더 자연스럽게 말하고 싶어요',
      features: ['복잡한 문장 구조', '다양한 표현', '연음 연습']
    },
    {
      id: 'advanced',
      title: '고급',
      description: '유창하게 말할 수 있지만 완벽한 발음을 원해요',
      features: ['고급 어휘', '미묘한 발음 차이', '원어민 수준']
    }
  ];

  const purposes = [
    {
      id: 'conversation',
      title: '일상 대화',
      description: '친구들과 자연스럽게 대화하고 싶어요',
      icon: '💬'
    },
    {
      id: 'business',
      title: '비즈니스',
      description: '업무에서 전문적으로 소통하고 싶어요',
      icon: '💼'
    },
    {
      id: 'exam',
      title: '시험 준비',
      description: 'TOEFL, IELTS 등 시험을 준비하고 있어요',
      icon: '📚'
    }
  ];

  const handleNext = () => {
    if (selectedLevel && selectedPurpose) {
      onNext(selectedLevel, selectedPurpose);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8 flex flex-col min-h-screen">
        
        {/* Title */}
        <div className="text-center mb-8 flex-shrink-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            학습 설정
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 px-2">
            당신의 레벨과 목적을 선택해주세요
          </p>
          
          {/* Waveform Animation */}
          <div className="mt-6">
            <WaveformVisualizer isActive={true} className="opacity-60" />
          </div>
        </div>
        
        {/* 레벨 선택 */}
        <div className="space-y-4 mb-8 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">현재 영어 레벨</h3>
          <div className="grid gap-4">
            {levels.map((level) => (
              <div 
                key={level.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border cursor-pointer transition-all ${
                  selectedLevel === level.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-blue-300'
                }`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{level.title}</h4>
                      {selectedLevel === level.id && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">선택됨</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {level.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {level.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 목적 선택 */}
        <div className="space-y-4 mb-8 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">학습 목적</h3>
          <div className="grid gap-4">
            {purposes.map((purpose) => (
              <div 
                key={purpose.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border cursor-pointer transition-all ${
                  selectedPurpose === purpose.id 
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-cyan-300'
                }`}
                onClick={() => setSelectedPurpose(purpose.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{purpose.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{purpose.title}</h4>
                      {selectedPurpose === purpose.id && (
                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">선택됨</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {purpose.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4 flex-shrink-0 relative" style={{ zIndex: 9999 }}>
          <GradientButton onClick={handleNext} disabled={!selectedLevel || !selectedPurpose} className="w-full" size="lg" style={{ position: 'relative', zIndex: 9999 }}>
            테스트 시작하기
          </GradientButton>
          
          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              이전
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}