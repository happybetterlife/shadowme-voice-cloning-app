interface WaveformVisualizerProps {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WaveformVisualizer({ 
  isActive = false, 
  size = 'md',
  className = '' 
}: WaveformVisualizerProps) {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-8', 
    lg: 'h-12'
  };

  const barCount = size === 'sm' ? 5 : size === 'md' ? 8 : 12;
  
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-app-gradient-from to-app-gradient-to rounded-full transition-all duration-300 ${
            sizeClasses[size]
          } ${
            isActive ? 'waveform-bar opacity-100' : 'opacity-30 scale-y-50'
          }`}
          style={{
            animationDelay: isActive ? `${i * 0.1}s` : '0s'
          }}
        />
      ))}
    </div>
  );
}