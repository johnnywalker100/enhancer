import * as React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text';
}

export function Skeleton({ 
  variant = 'default', 
  className = '', 
  ...props 
}: SkeletonProps) {
  const variantStyles = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={`
        animate-pulse bg-muted
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonImage({ className = '' }: { className?: string }) {
  return (
    <Skeleton 
      className={`aspect-square w-full ${className}`}
    />
  );
}
