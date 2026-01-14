'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { cn } from '@/lib/utils';

interface ExampleShowcaseProps {
  beforeImage: string;
  afterImage: string;
  title?: string;
  description?: string;
}

export function ExampleShowcase({ 
  beforeImage, 
  afterImage, 
  title = "See the transformation",
  description = "Real example showing how we enhance product photos"
}: ExampleShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Example Container */}
        <div className="bg-white border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm">
          {/* Toggle Tabs */}
          <div className="max-w-md mx-auto mb-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'before' | 'after')}>
              <TabsList className="w-full grid grid-cols-2 h-12">
                <TabsTrigger value="before" className="text-sm md:text-base font-semibold">
                  Before
                </TabsTrigger>
                <TabsTrigger value="after" className="text-sm md:text-base font-semibold">
                  After
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Image Display */}
          <div className="relative">
            {/* Before Image */}
            <div
              className={cn(
                "transition-opacity duration-300 ease-in-out",
                activeTab === 'before' ? 'opacity-100' : 'opacity-0 absolute inset-0'
              )}
            >
              <div className="aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden bg-muted/20 border border-border/30">
                <img
                  src={beforeImage}
                  alt="Before enhancement - original product photo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Original phone photo
                </p>
              </div>
            </div>

            {/* After Image */}
            <div
              className={cn(
                "transition-opacity duration-300 ease-in-out",
                activeTab === 'after' ? 'opacity-100' : 'opacity-0 absolute inset-0'
              )}
            >
              <div className="aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden bg-muted/20 border border-border/30 relative group">
                <img
                  src={afterImage}
                  alt="After enhancement - professional studio quality"
                  className="w-full h-full object-contain"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-200" />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Enhanced with professional lighting
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-border/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm mb-1">Details Preserved</h4>
                <p className="text-xs text-muted-foreground">All product details remain sharp</p>
              </div>
              
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm mb-1">Studio Lighting</h4>
                <p className="text-xs text-muted-foreground">Professional grade lighting added</p>
              </div>
              
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm mb-1">Clean Background</h4>
                <p className="text-xs text-muted-foreground">Distractions removed automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <button
            onClick={() => {
              document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 text-base font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-colors duration-200 shadow-lg inline-flex items-center gap-2"
          >
            Try with your photo
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
