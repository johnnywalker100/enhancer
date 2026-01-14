'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, History } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-lg">Product Enhancer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/jobs"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${pathname === '/jobs' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Jobs</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-xs text-gray-600 text-center">
          Powered by{' '}
          <span className="font-medium">Nano Banana Pro</span>
        </p>
      </div>
    </footer>
  );
}
