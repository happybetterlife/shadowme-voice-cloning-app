import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GradientButton } from './GradientButton';
import { AccuracyBadge } from './AccuracyBadge';
import { Progress } from './ui/progress';
import { Calendar, Target, Trophy, TrendingUp, Play, Settings } from 'lucide-react';
import { apiClient } from '../utils/api';

interface DashboardProps {
  onStartPractice: () => void;
  onSettings: () => void;
  userProfile?: any;
  clonedVoiceData?: { url: string; sampleText: string; audioBlob?: Blob; sessionId?: string } | null;
}

export function Dashboard({ onStartPractice, onSettings, userProfile, clonedVoiceData }: DashboardProps) {
  const [dailyProgress, setDailyProgress] = useState<any>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const [daily, weekly] = await Promise.all([
        apiClient.getDailyProgress(),
        apiClient.getWeeklyProgress()
      ]);
      
      setDailyProgress(daily);
      setWeeklyProgress(weekly);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLesson = async (lessonType: string) => {
    if (lessonType === 'shadowing') {
      // 쉐도잉 연습으로 먼저 이동
      onStartPractice();
      
      // 연습 시작을 기록 (백그라운드에서 처리)
      try {
        await apiClient.updateDailyProgress({
          practiceTime: 0, // 실제 시간은 연습 완료 후 업데이트
          lessonsCompleted: 0, // 완료 후 업데이트
          accuracyScore: 0 // 완료 후 업데이트
        });
        console.log('✅ Practice session started');
      } catch (error) {
        console.error('❌ Failed to record practice start:', error);
      }
    } else {
      // 다른 연습 타입들은 추후 구현
      console.log(`Starting ${lessonType} practice...`);
    }
  };

  // 오늘의 목표 달성률 계산
  const dailyGoal = { practiceTime: 15, lessonsCompleted: 3 }; // 15분, 3개 레슨
  const todayProgressPercent = dailyProgress ? 
    Math.min(
      ((dailyProgress.practiceTime / dailyGoal.practiceTime) + 
       (dailyProgress.lessonsCompleted / dailyGoal.lessonsCompleted)) / 2 * 100,
      100
    ) : 0;

  // 주간 목표 달성률
  const weeklyCompletedDays = weeklyProgress.filter(day => day.lessonsCompleted > 0).length;
  const weeklyProgressPercent = (weeklyCompletedDays / 7) * 100;

  const stats = {
    streak: userProfile?.streak_count || 0,
    accuracy: userProfile?.average_accuracy || 0,
    practiceTime: userProfile?.total_practice_time || 0,
    level: userProfile?.level || '초급',
    todayProgress: Math.round(todayProgressPercent),
    weeklyGoal: Math.round(weeklyProgressPercent)
  };

  const todayLessons = [
    { id: 1, title: '쉐도잉 연습', difficulty: stats.level, duration: '15분', completed: false, type: 'shadowing' },
    { id: 2, title: '발음 교정', difficulty: stats.level, duration: '10분', completed: dailyProgress?.lessonsCompleted > 0, type: 'pronunciation' },
    { id: 3, title: '유창성 훈련', difficulty: stats.level, duration: '20분', completed: dailyProgress?.lessonsCompleted > 1, type: 'fluency' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl text-gray-800 dark:text-gray-200">
                안녕하세요! 👋
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                오늘도 발음 연습을 시작해보세요
              </p>
            </div>
            <button
              onClick={onSettings}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">연속 학습</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.streak}일
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">평균 정확도</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.accuracy}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">레벨</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">총 연습시간</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {stats.practiceTime}분
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Progress */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">오늘의 진행상황</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  일일 목표 ({stats.weeklyGoal}회 연습)
                </span>
                <AccuracyBadge accuracy={stats.todayProgress} showText={false} size="sm" />
              </div>
              <Progress value={stats.todayProgress} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.todayProgress}% 완료 (목표까지 {100 - stats.todayProgress}% 남음)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Lessons */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">오늘의 레슨</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {todayLessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className={`p-3 rounded-lg border transition-all ${
                    lesson.completed 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {lesson.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.completed && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      {!lesson.completed && (
                        <button 
                          onClick={() => handleStartLesson(lesson.type)}
                          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          <Play className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <GradientButton 
            size="lg" 
            onClick={() => handleStartLesson('shadowing')}
            className="w-full min-h-[56px]"
          >
            <Play className="w-5 h-5 mr-2" />
            쉐도잉 연습 시작
          </GradientButton>
        </div>
      </div>
    </div>
  );
}