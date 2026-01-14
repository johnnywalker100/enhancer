'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import VariableControls from '@/components/VariableControls';
import ImageUpload from '@/components/ImageUpload';
import { BeforeAfterPreview } from '@/components/BeforeAfterPreview';
import { ExampleShowcase } from '@/components/ExampleShowcase';
import { Navigation, Footer } from '@/components/Navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { getPreset } from '@/lib/presets';
import type { Preset } from '@/lib/types';
import { VariableValues } from '@/lib/types';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  Lightbulb, 
  CheckCircle,
  RotateCcw,
  Loader2
} from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [preset] = useState<Preset | null>(() => getPreset('luxury-studio-mvp') ?? null);
  const [variables, setVariables] = useState<VariableValues>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ outputUrl: string; requestId?: string } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize variables with defaults when preset loads
  useEffect(() => {
    if (preset) {
      const defaults: VariableValues = {};
      for (const varSchema of preset.variables_schema) {
        if (varSchema.default !== undefined) {
          defaults[varSchema.key] = varSchema.default;
        }
      }
      setVariables(defaults);
    }
  }, [preset]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleVariableChange = useCallback((key: string, value: any) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetVariables = useCallback(() => {
    if (preset) {
      const defaults: VariableValues = {};
      for (const varSchema of preset.variables_schema) {
        if (varSchema.default !== undefined) {
          defaults[varSchema.key] = varSchema.default;
        }
      }
      setVariables(defaults);
    }
  }, [preset]);

  const handleEnhance = useCallback(async () => {
    if (!selectedFile || !preset) {
      setError('Please select an image');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('preset_id', preset.id);
      formData.append('variables', JSON.stringify(variables));

      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Server returned ${response.status} ${response.statusText}`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setResult({
        outputUrl: data.output_url,
        requestId: data.request_id,
      });

      // Scroll to results on mobile
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, preset, variables]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
    resetVariables();
    setResult(null);
    setError(null);
  }, [resetVariables]);

  const handleDownload = useCallback(async () => {
    if (result?.outputUrl) {
      try {
        // Use the download API to properly handle cross-origin images
        const downloadUrl = `/api/download?url=${encodeURIComponent(result.outputUrl)}&filename=enhanced-image.png`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'enhanced-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section - Mobbin Style */}
        <section className="container pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Icon */}
            <div className="flex justify-center mb-8 md:mb-12">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-[28px] md:rounded-[38px] bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/25">
                <Sparkles className="w-10 h-10 md:w-14 md:h-14 text-white" />
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight mb-6 md:mb-8 leading-[1.1]">
              Turn any photos into studio shots.
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
              AI-powered product enhancement that preserves details, adds professional lighting, and removes backgrounds.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-24">
              <button
                onClick={() => {
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-colors duration-200 shadow-lg"
              >
                Try for free
              </button>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-full border-2 border-border text-foreground hover:bg-secondary/50 transition-colors duration-200 inline-flex items-center justify-center gap-2"
              >
                See how it works
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="container py-20 md:py-32 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 md:mb-20">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                  Simple process.
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Four steps to professional product photos
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
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
            </div>
          </section>

          {/* Example Showcase Section */}
          <ExampleShowcase
            beforeImage="/uploads/example-before.jpeg"
            afterImage="/uploads/example-after.jpeg"
            title="See the transformation"
            description="Real example showing how we enhance product photos"
          />

          {/* Main Tool Section */}
          <section id="upload-section" className="container py-20 md:py-32">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                  Try it now
                </h2>
                <p className="text-lg text-muted-foreground">
                  Upload a product photo and see the transformation
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-8 max-w-3xl mx-auto">
                  <Alert variant="destructive">
                    <AlertTitle>Something went wrong</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column: Controls */}
                <div className="space-y-6">
                  {/* Upload Card */}
                  <div className="bg-white border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Upload className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Upload Photo</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        JPEG, PNG, or WebP • Max 10MB
                      </p>
                    </div>
                    <ImageUpload
                      onFileSelect={handleFileSelect}
                      preview={filePreview}
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Settings Card */}
                  {preset && (
                    <div className="bg-white border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
                      <VariableControls
                        preset={preset}
                        variables={variables}
                        onChange={handleVariableChange}
                        onReset={resetVariables}
                        disabled={isProcessing}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleEnhance}
                      disabled={!selectedFile || !preset || isProcessing}
                      className={cn(
                        "w-full h-14 text-base font-semibold rounded-full inline-flex items-center justify-center gap-2",
                        "bg-black text-white hover:bg-black/90 transition-all duration-200 shadow-lg",
                        (!selectedFile || !preset || isProcessing) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Enhance Photo
                        </>
                      )}
                    </button>

                    {result && (
                      <button
                        onClick={handleReset}
                        className="w-full h-12 text-base font-medium rounded-full border-2 border-border hover:bg-secondary/50 transition-colors duration-200 inline-flex items-center justify-center gap-2"
                        disabled={isProcessing}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Create Another
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Results */}
                <div ref={resultsRef}>
                  <BeforeAfterPreview
                    beforeUrl={filePreview}
                    afterUrl={result?.outputUrl || null}
                    onDownload={result ? handleDownload : undefined}
                    isProcessing={isProcessing}
                  />
                  
                  {/* Download Link */}
                  {result && (
                    <div className="mt-6 text-center">
                      <a
                        href={result.outputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Open full resolution
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="container py-20 md:py-32 border-t border-border/50">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-muted-foreground mb-6">Trusted features</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-muted-foreground/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">Detail Preservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  <span className="text-sm font-medium">Studio Lighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">No Distortions</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
  );
}
