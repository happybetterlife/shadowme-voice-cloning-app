import { Button } from './ui/button';
import { GradientButton } from './GradientButton';
import { WaveformVisualizer } from './WaveformVisualizer';
import { Play, User, Volume2, Brain, Zap, ArrowDown } from 'lucide-react';

interface ExplanationScreenProps {
  onNext: () => void;
}

export function ExplanationScreen({ onNext }: ExplanationScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8 flex flex-col justify-center min-h-screen">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            AI 음성 복제 기술
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 px-2">
            당신의 목소리가 원어민이 되는 마법을 경험해보세요
          </p>
          
          {/* Waveform Animation */}
          <div className="mt-6">
            <WaveformVisualizer isActive={true} className="opacity-60" />
          </div>
        </div>
        
        {/* Key Features */}
        <div className="space-y-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  1. 당신의 목소리
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  한국어 억양이 있는 영어 발음
                </p>
              </div>
              <WaveformVisualizer size="sm" />
            </div>
          </div>
          
          <div className="flex justify-center py-2">
            <ArrowDown className="w-6 h-6 text-blue-500 animate-bounce" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  2. AI 음성 변환
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  원어민 발음으로 실시간 변환
                </p>
              </div>
              <WaveformVisualizer isActive size="sm" />
            </div>
          </div>
          
          <div className="flex justify-center py-2">
            <ArrowDown className="w-6 h-6 text-green-500 animate-bounce" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
                  3. 완벽한 원어민 발음
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  당신의 목소리로 듣는 원어민 영어
                </p>
              </div>
              <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                <Play className="w-4 h-4 mr-1" />
                듣기
              </Button>
            </div>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">왜 효과적일까요?</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">친숙함</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">자신의 목소리로 듣기 때문에 집중도가 높아집니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">정확성</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">원어민 수준의 정확한 발음을 학습할 수 있습니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Volume2 className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">동기부여</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">내 목소리가 원어민이 되는 신기한 경험</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <GradientButton onClick={onNext} className="w-full" size="lg">
            학습 설정 하기
          </GradientButton>
          {/* 삭제됨 */}
        </div>
      </div>
    </div>
  );
}