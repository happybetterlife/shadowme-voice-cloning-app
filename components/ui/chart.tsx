import React from 'react';

// 임시로 빈 chart 컴포넌트들 (사용하지 않는 경우)
export const ChartContainer = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

export const ChartTooltip = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

export const ChartTooltipContent = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

export const ChartLegend = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

export const ChartLegendContent = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};