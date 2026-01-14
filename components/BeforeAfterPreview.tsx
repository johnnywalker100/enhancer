'use client';

import { useState } from 'react';
import { Download, Eye, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { cn } from '@/lib/utils';

interface BeforeAfterPreviewProps {
  beforeUrl: string | null;
  afterUrl: string | null;
  onDownload?: () => void;
  isProcessing?: boolean;
}

export function BeforeAfterPreview({ beforeUrl, afterUrl, onDownload, isProcessing }: BeforeAfterPreviewProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  // Processing state with loading animation
  if (isProcessing) {
    return (
      <div className="magic-card p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Preview</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Generating your enhanced image...</p>
        </div>
        
        <div className="relative aspect-[4/3] sm:aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-5">
            {/* Animated loader */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin" />
              </div>
            </div>
            
            <div className="text-center px-4">
              <p className="text-xs sm:text-sm font-medium text-foreground">Enhancing your photo</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">This usually takes 10-15 seconds</p>
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
        
        <div className="aspect-[4/3] sm:aspect-square rounded-lg sm:rounded-xl bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50 flex flex-col items-center justify-center">
          <div className="text-center space-y-3 sm:space-y-4 px-4">
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
              <div className="image-preview-container aspect-[4/3] sm:aspect-square rounded-lg sm:rounded-xl">
                <img
                  src={beforeUrl}
                  alt="Before enhancement"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="after" className="mt-3 sm:mt-4 animate-in fade-in duration-150">
            <div className="image-preview-container aspect-[4/3] sm:aspect-square rounded-lg sm:rounded-xl relative group">
              <img
                src={afterUrl}
                alt="After enhancement"
                className="w-full h-full object-contain"
              />
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-200" />
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
