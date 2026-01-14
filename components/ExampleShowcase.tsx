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
  title = "Simple process.",
  description = "Four steps to professional product photos"
}: ExampleShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="container py-20 md:py-32 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 text-primary font-bold text-xl md:text-2xl mb-4">
              1
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Upload a photo</h3>
            <p className="text-muted-foreground">
              Drop in a phone photo. We keep all fine details intact.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 text-primary font-bold text-xl md:text-2xl mb-4">
              2
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Choose the finish</h3>
            <p className="text-muted-foreground">
              Pick shadows and lighting style that fits your brand.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 text-primary font-bold text-xl md:text-2xl mb-4">
              3
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Enhance</h3>
            <p className="text-muted-foreground">
              AI generates studio-quality lighting and background.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 text-primary font-bold text-xl md:text-2xl mb-4">
              4
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Download</h3>
            <p className="text-muted-foreground">
              High-resolution PNG ready for any platform.
            </p>
          </div>
        </div>

        {/* Example Container */}
        <div className="bg-white border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">See it in action</h3>
            <p className="text-sm text-muted-foreground">Real example of product photo enhancement</p>
          </div>

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

          {/* Image Display - No forced aspect ratio, fits image size */}
          <div className="relative flex justify-center">
            {/* Before Image */}
            <div
              className={cn(
                "transition-opacity duration-300 ease-in-out",
                activeTab === 'before' ? 'opacity-100' : 'opacity-0 absolute inset-0'
              )}
            >
              <div className="flex justify-center items-center rounded-2xl overflow-hidden bg-muted/20 border border-border/30">
                <img
                  src={beforeImage}
                  alt="Before enhancement - original product photo"
                  className="max-w-full h-auto object-contain rounded-2xl"
                  style={{ maxHeight: '600px' }}
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
              <div className="flex justify-center items-center rounded-2xl overflow-hidden bg-muted/20 border border-border/30 relative group">
                <img
                  src={afterImage}
                  alt="After enhancement - professional studio quality"
                  className="max-w-full h-auto object-contain rounded-2xl"
                  style={{ maxHeight: '600px' }}
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
