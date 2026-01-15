'use client';

import { useState, useEffect } from 'react';
import { Download, Eye, Loader2, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { cn } from '@/lib/utils';

interface BeforeAfterPreviewProps {
  beforeUrl: string | null;
  afterUrl: string | null;
  onDownload?: () => void;
  isProcessing?: boolean;
  resolution?: string;
}

export function BeforeAfterPreview({ beforeUrl, afterUrl, onDownload, isProcessing, resolution = '2K' }: BeforeAfterPreviewProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');
  const [progress, setProgress] = useState(0);

  // Simulate progress animation based on resolution
  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      
      // Expected time based on resolution
      const expectedTime = resolution === '1K' ? 10000 : resolution === '2K' ? 20000 : 30000; // ms
      const updateInterval = 300; // Update every 300ms for smooth animation
      const totalSteps = expectedTime / updateInterval;
      const progressPerStep = 95 / totalSteps; // Go up to 95% (leave 5% for final step)
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev; // Cap at 95% until actual completion
          const increment = progressPerStep + (Math.random() * 0.5 - 0.25); // Small random variation
          return Math.min(prev + increment, 95);
        });
      }, updateInterval);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isProcessing, resolution]);

  // Processing state with loading animation
  if (isProcessing) {
    const circumference = 2 * Math.PI * 54; // radius = 54
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="magic-card p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Preview</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Generating your enhanced image...</p>
        </div>
        
        <div className="relative w-full min-h-[300px] sm:min-h-[400px] rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 py-12">
            {/* Circular Progress Ring */}
            <div className="relative">
              {/* Outer glow effect */}
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
              
              {/* SVG Progress Circle */}
              <div className="relative">
                <svg className="w-28 h-28 sm:w-36 sm:h-36 transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-500 ease-out"
                  />
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" />
                  <div className="mt-2 text-xl sm:text-2xl font-bold text-foreground">
                    {Math.round(progress)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center px-4 space-y-2">
              <p className="text-xs sm:text-sm font-medium text-foreground">
                Enhancing your photo at {resolution}
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {progress < 25 && 'Analyzing image...'}
                {progress >= 25 && progress < 50 && 'Applying enhancements...'}
                {progress >= 50 && progress < 75 && 'Refining details...'}
                {progress >= 75 && progress < 95 && 'Finalizing output...'}
                {progress >= 95 && 'Almost done...'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground/60 mt-1">
                {resolution === '1K' && '~10 seconds'}
                {resolution === '2K' && '~20 seconds'}
                {resolution === '4K' && '~30 seconds'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!afterUrl) {
    return (
      <div className="magic-card p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Preview</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Your enhanced image will appear here</p>
        </div>
        
        <div className="w-full min-h-[300px] sm:min-h-[400px] rounded-lg sm:rounded-xl bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50 flex flex-col items-center justify-center">
          <div className="text-center space-y-3 sm:space-y-4 px-4 py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-muted/50">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-foreground/80">No preview yet</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 max-w-[200px]">
                Upload an image and tap &quot;Enhance&quot; to see results
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result state with animate-in
  return (
    <div className="magic-card p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out">
      <div className="mb-3 sm:mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Preview</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground">PNG • High Resolution</p>
        </div>
      </div>

      {/* Toggle between Before/After */}
      <div className="mb-3 sm:mb-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'before' | 'after')}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="before" className="flex-1 text-xs sm:text-sm">Before</TabsTrigger>
            <TabsTrigger value="after" className="flex-1 text-xs sm:text-sm">After</TabsTrigger>
          </TabsList>
          <TabsContent value="before" className="mt-3 sm:mt-4 animate-in fade-in duration-150">
            {beforeUrl && (
              <div className="image-preview-container w-full rounded-lg sm:rounded-xl bg-muted/5 border border-border/30 overflow-hidden">
                <img
                  src={beforeUrl}
                  alt="Before enhancement"
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="after" className="mt-3 sm:mt-4 animate-in fade-in duration-150">
            <div className="image-preview-container w-full rounded-lg sm:rounded-xl bg-muted/5 border border-border/30 overflow-hidden relative group">
              <img
                src={afterUrl}
                alt="After enhancement"
                className="w-full h-auto object-contain max-h-[500px]"
              />
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-200 pointer-events-none" />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {onDownload && (
        <button
          onClick={onDownload}
          className="w-full btn-magic-primary text-sm animate-in fade-in duration-200 delay-100"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download Enhanced Image</span>
          <span className="sm:hidden">Download</span>
        </button>
      )}
    </div>
  );
}
