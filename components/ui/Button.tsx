import * as React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: `
    bg-primary text-primary-foreground shadow-md shadow-primary/20
    hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25
    focus-visible:ring-primary
    disabled:shadow-none
  `,
  secondary: `
    bg-secondary text-secondary-foreground border border-border
    hover:bg-secondary/80
    focus-visible:ring-secondary
  `,
  ghost: `
    text-muted-foreground 
    hover:text-foreground hover:bg-secondary
    focus-visible:ring-secondary
  `,
  destructive: `
    bg-destructive text-destructive-foreground shadow-sm
    hover:bg-destructive/90
    focus-visible:ring-destructive
  `,
  outline: `
    border border-border bg-transparent text-foreground
    hover:bg-secondary
    focus-visible:ring-primary
  `,
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2',
  icon: 'h-10 w-10 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
