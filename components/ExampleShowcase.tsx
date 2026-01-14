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
    <section className="container py-12 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Two Column Layout: Steps + Example */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Steps */}
          <div className="flex flex-col space-y-5 lg:pr-4 py-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Upload a photo</h3>
                <p className="text-sm text-muted-foreground">
                  Drop in a phone photo. We keep all fine details intact.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Choose the finish</h3>
                <p className="text-sm text-muted-foreground">
                  Pick shadows and lighting style that fits your brand.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Enhance</h3>
                <p className="text-sm text-muted-foreground">
                  AI generates studio-quality lighting and background.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Download</h3>
                <p className="text-sm text-muted-foreground">
                  High-resolution PNG ready for any platform.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Example Container */}
          <div className="bg-white border border-border/50 rounded-3xl p-4 md:p-5 shadow-sm flex flex-col h-full">
            <div className="text-center mb-3">
              <h3 className="text-base md:text-lg font-semibold mb-1">See it in action</h3>
              <p className="text-xs text-muted-foreground">Real example of enhancement</p>
            </div>

            {/* Toggle Tabs */}
            <div className="mb-4">
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
            <div className="relative flex justify-center flex-1 min-h-[250px]">
              {/* Before Image */}
              <div
                className={cn(
                  "transition-opacity duration-300 ease-in-out flex flex-col",
                  activeTab === 'before' ? 'opacity-100' : 'opacity-0 absolute inset-0'
                )}
              >
                <div className="flex justify-center items-center rounded-2xl overflow-hidden bg-muted/20 border border-border/30 flex-1">
                  <img
                    src={beforeImage}
                    alt="Before enhancement - original product photo"
                    className="max-w-full h-auto object-contain rounded-2xl"
                    style={{ maxHeight: '350px' }}
                  />
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Original phone photo
                  </p>
                </div>
              </div>

              {/* After Image */}
              <div
                className={cn(
                  "transition-opacity duration-300 ease-in-out flex flex-col",
                  activeTab === 'after' ? 'opacity-100' : 'opacity-0 absolute inset-0'
                )}
              >
                <div className="flex justify-center items-center rounded-2xl overflow-hidden bg-muted/20 border border-border/30 relative group flex-1">
                  <img
                    src={afterImage}
                    alt="After enhancement - professional studio quality"
                    className="max-w-full h-auto object-contain rounded-2xl"
                    style={{ maxHeight: '350px' }}
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-200" />
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Enhanced with professional lighting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-10">
          <button
            onClick={() => {
              document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 text-sm font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-colors duration-200 shadow-lg inline-flex items-center gap-2"
          >
            Try with your photo
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
