import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-secondary',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/50',
  destructive: 'bg-red-50 text-red-700 border-red-200/50',
  outline: 'bg-transparent text-foreground border-border',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ 
  variant = 'default', 
  size = 'md',
  className = '', 
  children, 
  ...props 
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
