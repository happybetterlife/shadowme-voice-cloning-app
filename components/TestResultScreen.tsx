import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Trophy } from 'lucide-react';

interface TestResultScreenProps {
  results: any;
  onComplete: () => void;
}

export function TestResultScreen({ results, onComplete }: TestResultScreenProps) {
  // results가 없거나 잘못된 형태일 때 기본값 제공
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-full px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600 dark:text-gray-300">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  const { 
    scores = results.results || [75, 80, 85, 78, 82], 
    averageScore = results.averageScore || 80, 
    level = 'intermediate', 
    adjustedLevel = results.adjustedLevel || 'intermediate' 
  } = results;
  
  const getLevelText = (level: string) => {
    const levels = {
      beginner: '초급',
      intermediate: '중급', 
      advanced: '고급'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getOverallColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 80) return 'bg-green-400 text-white';
    if (score >= 70) return 'bg-yellow-500 text-white';
    return 'bg-orange-500 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full px-4 py-8 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            테스트 완료!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            분석 결과를 확인해보세요
          </p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          
          {/* Overall Score */}
          <Card className="p-6 text-center bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              전체 평균 점수
            </h3>
            
            <div className={`inline-flex items-center justify-center w-20 h-10 rounded-full text-lg font-bold ${getOverallColor(averageScore)} mb-4`}>
              {averageScore}%
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gray-800 h-2 rounded-full transition-all duration-500"
                style={{ width: `${averageScore}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">
              우수한 실력입니다!
            </p>
          </Card>

          {/* Individual Scores */}
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              문장별 점수
            </h3>
            
            <div className="flex justify-between items-center mb-2">
              {scores.map((score: number, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getScoreColor(score)} mb-1`}>
                    {score}
                  </div>
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Level Recommendation */}
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  레벨 조정
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  선택하신 {getLevelText(level)} 레벨이 적절합니다.
                </p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {getLevelText(adjustedLevel)}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Learning Stats */}
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  맞춤형 학습 계획
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">일일 목표:</span>
                    <span className="font-medium">15분 연습</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">주간 목표:</span>
                    <span className="font-medium">30개 문장</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">예상 향상 시간:</span>
                    <span className="font-medium">2-3주</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Start Learning Button */}
          <Button 
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            size="lg"
          >
            학습 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}