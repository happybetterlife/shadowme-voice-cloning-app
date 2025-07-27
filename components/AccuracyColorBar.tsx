import { getAccuracyColorInfo } from './AccuracyBadge';

interface AccuracyColorBarProps {
  className?: string;
  showLabels?: boolean;
}

export function AccuracyColorBar({ className = "", showLabels = true }: AccuracyColorBarProps) {
  const colorInfo = getAccuracyColorInfo();

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        발음 정확도 가이드
      </h4>
      
      <div className="space-y-2">
        {colorInfo.map((info, index) => (
          <div key={index} className="flex items-center gap-3 text-xs">
            <div className={`w-4 h-4 rounded-full ${info.color} flex-shrink-0`} />
            <div className="flex-1 flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400 min-w-[60px]">
                {info.range}
              </span>
              {showLabels && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {info.label}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {info.description}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}