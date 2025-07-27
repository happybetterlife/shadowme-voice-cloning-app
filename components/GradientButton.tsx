import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export function GradientButton({
  children,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = '',
  type = 'button',
  style
}: GradientButtonProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-sm min-h-[40px]';
      case 'lg': return 'px-8 py-4 text-lg min-h-[56px]';
      default: return 'px-6 py-3 text-base min-h-[48px]';
    }
  };

  const getVariantClasses = () => {
    if (variant === 'primary') {
      return 'bg-gradient-to-r from-app-gradient-from to-app-gradient-to hover:from-app-gradient-from-dark hover:to-app-gradient-to-dark text-white shadow-lg hover:shadow-xl';
    }
    return 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 dark:text-gray-100 dark:border-gray-600';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-xl font-medium
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        relative z-50
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${className}
      `}
      style={{ position: 'relative', zIndex: 9999, isolation: 'isolate', ...style }}
    >
      {children}
    </button>
  );
}