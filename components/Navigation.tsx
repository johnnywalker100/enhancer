'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, History, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const isJobsPage = pathname === '/jobs' || pathname.startsWith('/jobs/');

  return (
    <header className="glass-header">
      <div className="container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 text-foreground transition-opacity active:opacity-80 group min-h-[44px]"
          >
            {/* Logo icon with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="font-semibold text-base sm:text-lg tracking-tight">Enhancer</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                AI Photo
              </span>
            </div>
          </Link>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/jobs">
              <button 
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm font-medium",
                  "transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "min-h-[44px] min-w-[44px]",
                  isJobsPage 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground active:bg-secondary/80"
                )}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Jobs</span>
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 mt-auto pb-safe">
      <div className="container py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/60" />
            <span>Product Photo Enhancer</span>
          </div>
          <p className="text-[11px] sm:text-xs">
            Powered by AI • Studio-quality results
          </p>
        </div>
      </div>
    </footer>
  );
}
