"use client";

import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export function TextShimmer({
  children,
  className,
  shimmerWidth = 100,
}: TextShimmerProps) {
  return (
    <span
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        "mx-auto inline-flex items-center justify-center",
        "animate-text-shimmer bg-clip-text",
        "bg-[linear-gradient(110deg,transparent,45%,rgba(120,119,198,0.8),55%,transparent)]",
        "bg-[length:250%_100%] bg-no-repeat",
        className
      )}
    >
      {children}
    </span>
  );
}
