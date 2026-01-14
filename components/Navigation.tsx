'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const isJobsPage = pathname === '/jobs' || pathname.startsWith('/jobs/');

  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-opacity duration-200"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Enhancer</span>
          </Link>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-4">
            <Link 
              href="/jobs"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                isJobsPage 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              Jobs
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-white mt-auto">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">Enhancer</span>
          </div>
          <p className="text-xs md:text-sm">
            © 2026 • Powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
}
