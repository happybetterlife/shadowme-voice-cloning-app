interface AccuracyBadgeProps {
  accuracy: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const getAccuracyColor = (score: number) => {
  if (score >= 90) return 'text-green-700 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-700'; // 90-100% 초록색
  if (score >= 80) return 'text-lime-700 bg-lime-100 border-lime-200 dark:bg-lime-900/30 dark:border-lime-700'; // 80-89% 연두색  
  if (score >= 70) return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700'; // 70-79% 노란색
  if (score >= 60) return 'text-orange-700 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-700'; // 60-69% 주황색
  return 'text-red-700 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-700'; // 60% 미만 빨간색
};

export const getAccuracyColorInfo = () => [
  { range: '90-100%', color: 'bg-green-500', label: '완벽', description: '완벽한 발음' },
  { range: '80-89%', color: 'bg-lime-500', label: '우수', description: '우수한 발음' },
  { range: '70-79%', color: 'bg-yellow-500', label: '양호', description: '양호한 발음' },
  { range: '60-69%', color: 'bg-orange-500', label: '보통', description: '개선 필요' },
  { range: '60% 미만', color: 'bg-red-500', label: '미흡', description: '연습 필요' }
];

export function AccuracyBadge({ 
  accuracy, 
  size = 'md', 
  showText = true,
  className = "" 
}: AccuracyBadgeProps) {

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'lg': return 'px-4 py-2 text-base';
      default: return 'px-3 py-1.5 text-sm';
    }
  };

  return (
    <div className={`
      inline-flex items-center gap-1 rounded-full border font-medium
      ${getAccuracyColor(accuracy)}
      ${getSizeClasses()}
      ${className}
    `}>
      <div className="w-2 h-2 rounded-full bg-current" />
      {showText && <span>{accuracy}%</span>}
    </div>
  );
}