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
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Two Column Layout: Steps + Example */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Steps */}
          <div className="flex flex-col justify-center space-y-8 lg:pr-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload a photo</h3>
                <p className="text-muted-foreground">
                  Drop in a phone photo. We keep all fine details intact.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose the finish</h3>
                <p className="text-muted-foreground">
                  Pick shadows and lighting style that fits your brand.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enhance</h3>
                <p className="text-muted-foreground">
                  AI generates studio-quality lighting and background.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Download</h3>
                <p className="text-muted-foreground">
                  High-resolution PNG ready for any platform.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Example Container */}
          <div className="bg-white border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold mb-2">See it in action</h3>
              <p className="text-sm text-muted-foreground">Real example of enhancement</p>
            </div>

            {/* Toggle Tabs */}
            <div className="mb-6">
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
            <div className="relative flex justify-center flex-1 min-h-[350px]">
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
                    style={{ maxHeight: '500px' }}
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
                  "transition-opacity duration-300 ease-in-out flex flex-col",
                  activeTab === 'after' ? 'opacity-100' : 'opacity-0 absolute inset-0'
                )}
              >
                <div className="flex justify-center items-center rounded-2xl overflow-hidden bg-muted/20 border border-border/30 relative group flex-1">
                  <img
                    src={afterImage}
                    alt="After enhancement - professional studio quality"
                    className="max-w-full h-auto object-contain rounded-2xl"
                    style={{ maxHeight: '500px' }}
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
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16">
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
