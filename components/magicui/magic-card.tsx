"use client";

import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagicCard({
  children,
  className,
}: MagicCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card border border-border/60",
        "transition-all duration-200",
        "hover:border-border/80 hover:shadow-lg",
        className
      )}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Simple card without hover effects
export function SimpleCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/60 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
