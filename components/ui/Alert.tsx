import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'info';
  children: React.ReactNode;
}

const iconMap = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  info: Info,
};

export function Alert({ variant = 'default', children, className, ...props }: AlertProps) {
  const Icon = iconMap[variant];
  
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-xl border p-4',
        'animate-in fade-in slide-in-from-top-2 duration-200 ease-out',
        variant === 'destructive' && 'border-destructive/30 bg-destructive/5 text-destructive',
        variant === 'success' && 'border-emerald-200/50 bg-emerald-50 text-emerald-900',
        variant === 'info' && 'border-blue-200/50 bg-blue-50 text-blue-900',
        variant === 'default' && 'border-border bg-card text-foreground',
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export function AlertTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h5 className={cn('font-medium leading-none tracking-tight mb-1', className)}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('text-sm opacity-90', className)}>
      {children}
    </div>
  );
}
