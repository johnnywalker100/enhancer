"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SparklesProps {
  className?: string;
}

export function Sparkles({ className }: SparklesProps) {
  return (
    <motion.span
      className={cn("inline-flex", className)}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      ✨
    </motion.span>
  );
}

interface PulseBeamProps {
  className?: string;
}

export function PulseBeam({ className }: PulseBeamProps) {
  return (
    <span className={cn("relative flex h-3 w-3", className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
    </span>
  );
}
