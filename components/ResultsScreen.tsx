import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, RotateCcw, Home, Share2, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { getAccuracyColor } from './AccuracyBadge';

interface ResultsScreenProps {
  results: {
    totalSentences: number;
    averageAccuracy: number;
    totalAttempts: number;
    results: Array<{
      sentence: { text: string };
      attempts: number;
      finalAccuracy: number;
      wordAccuracies: Array<{ text: string; accuracy: number }>;
    }>;
    completedAt: Date;
  };
  onRetry: () => void;
  onHome: () => void;
  onShare?: () => void;
}

export function ResultsScreen({ results, onRetry, onHome, onShare }: ResultsScreenProps) {
  const { totalSentences, averageAccuracy, totalAttempts, results: sentenceResults } = results;
  
  // 성과 분석
  const perfectSentences = sentenceResults.filter(r => r.finalAccuracy >= 90).length;
  const goodSentences = sentenceResults.filter(r => r.finalAccuracy >= 80 && r.finalAccuracy < 90).length;
  const needsImprovementSentences = sentenceResults.filter(r => r.finalAccuracy < 80).length;
  
  // 가장 어려웠던 단어들 찾기
  const allWordAccuracies = sentenceResults.flatMap(r => r.wordAccuracies);
  const difficultWords = allWordAccuracies
    .filter(w => w.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  // 성취 배지 결정
  const getAchievementBadge = () => {
    if (averageAccuracy >= 95) return { icon: '🏆', title: '완벽주의자', desc: '95% 이상의 정확도!' };
    if (averageAccuracy >= 90) return { icon: '⭐', title: '우수한 발음', desc: '90% 이상의 정확도!' };
    if (averageAccuracy >= 80) return { icon: '👍', title: '좋은 진전', desc: '80% 이상의 정확도!' };
    if (averageAccuracy >= 70) return { icon: '📈', title: '꾸준한 학습', desc: '계속 연습하세요!' };
    return { icon: '💪', title: '도전 정신', desc: '포기하지 마세요!' };
  };

  const achievement = getAchievementBadge();

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <Button variant="ghost" size="icon" onClick={onHome}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">연습 결과</h1>
        {onShare && (
          <Button variant="ghost" size="icon" onClick={onShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* 전체 점수 */}
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-0">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl font-bold">
              {Math.round(averageAccuracy)}%
            </div>
            <div>
              <h2 className="text-2xl font-bold">전체 정확도</h2>
              <p className="text-muted-foreground">
                {totalSentences}개 문장 완료 • {totalAttempts}회 시도
              </p>
            </div>
            
            {/* 성취 배지 */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 inline-block">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.desc}</p>
            </div>
          </div>
        </Card>

        {/* 성과 요약 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-green-700 dark:text-green-300">{perfectSentences}</div>
            <div className="text-xs text-green-600 dark:text-green-400">완벽 (90%+)</div>
          </Card>
          
          <Card className="p-4 text-center bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{goodSentences}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">우수 (80-89%)</div>
          </Card>
          
          <Card className="p-4 text-center bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{needsImprovementSentences}</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">개선 필요</div>
          </Card>
        </div>

        {/* 문장별 상세 결과 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            문장별 결과
          </h3>
          <div className="space-y-4">
            {sentenceResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-sm flex-1 mr-4">{result.sentence.text}</p>
                  <div className="text-right">
                    <Badge 
                      variant="secondary" 
                      className={`${getAccuracyColor(result.finalAccuracy)} text-white`}
                    >
                      {result.finalAccuracy}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.attempts}회 시도
                    </p>
                  </div>
                </div>
                
                {/* 단어별 정확도 시각화 */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">단어별 정확도:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.wordAccuracies.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={`px-2 py-1 rounded text-xs ${getAccuracyColor(word.accuracy)} text-white`}
                        title={`${word.text}: ${word.accuracy}%`}
                      >
                        {word.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 어려운 단어 분석 */}
        {difficultWords.length > 0 && (
          <Card className="p-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
              💡 집중 연습이 필요한 단어들
            </h3>
            <div className="space-y-2">
              {difficultWords.map((word, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{word.text}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={word.accuracy} className="w-16 h-2" />
                    <span className="text-sm text-muted-foreground w-12">
                      {Math.round(word.accuracy)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
              이 단어들을 중점적으로 연습하면 발음이 더욱 향상될 것입니다.
            </p>
          </Card>
        )}

        {/* 개선 팁 */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
            🎯 발음 개선 팁
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            {averageAccuracy < 70 && (
              <li>• 먼저 AI 음성을 여러 번 듣고 입 모양과 혀의 위치를 의식하며 따라하세요.</li>
            )}
            {averageAccuracy < 80 && (
              <li>• 각 단어를 천천히 정확하게 발음한 후, 자연스러운 속도로 연결하세요.</li>
            )}
            {averageAccuracy < 90 && (
              <li>• 강세와 리듬에 주의하며 문장 전체의 흐름을 의식하세요.</li>
            )}
            <li>• 매일 꾸준히 연습하는 것이 가장 효과적입니다.</li>
            <li>• 녹음된 자신의 음성을 AI 음성과 비교해보며 차이점을 찾아보세요.</li>
          </ul>
        </Card>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Button 
            onClick={onRetry} 
            className="w-full h-12 gradient-primary"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            다시 연습하기
          </Button>
          
          <Button 
            onClick={onHome} 
            variant="outline" 
            className="w-full h-12"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            홈으로 돌아가기
          </Button>
        </div>

        {/* 격려 메시지 */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
            🌟 잘하고 있어요!
          </h3>
          <p className="text-sm text-purple-600 dark:text-purple-300">
            {averageAccuracy >= 85 ? 
              '훌륭한 발음입니다! 계속해서 네이티브 수준에 도달해보세요.' :
              '꾸준한 연습으로 반드시 향상될 것입니다. 포기하지 마세요!'
            }
          </p>
        </div>
      </div>
    </div>
  );
}