"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = "rgba(255, 255, 255, 0.2)",
  shimmerSize = "0.1em",
  borderRadius = "0.75rem",
  shimmerDuration = "2s",
  background = "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)",
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap",
        "px-6 py-3 font-medium text-primary-foreground",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25",
        "active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      style={{
        borderRadius,
        background,
      }}
      {...props}
    >
      {/* Shimmer effect */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <span
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            animationDuration: shimmerDuration,
          }}
        />
      </span>
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
