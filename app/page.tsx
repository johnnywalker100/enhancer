'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import VariableControls from '@/components/VariableControls';
import ImageUpload from '@/components/ImageUpload';
import { BeforeAfterPreview } from '@/components/BeforeAfterPreview';
import { Navigation, Footer } from '@/components/Navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
import { AnimatedGradientBackground } from '@/components/magicui/animated-gradient-background';
import { MagicCard } from '@/components/magicui/magic-card';
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

  const handleDownload = useCallback(() => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = 'enhanced-image.png';
      link.click();
    }
  }, [result]);

  return (
    <AnimatedGradientBackground>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="container pt-12 pb-8 md:pt-16 md:pb-10">
            <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                Product Photo Enhancer
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Turn quick phone photos into clean studio product images.
              </p>
              
              {/* Trust Bullets */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-in fade-in duration-500 delay-150">
                <div className="trust-bullet">
                  <ShieldCheck className="trust-bullet-icon" />
                  <span>Preserves logos & details</span>
                </div>
                <div className="trust-bullet">
                  <Lightbulb className="trust-bullet-icon" />
                  <span>Studio lighting</span>
                </div>
                <div className="trust-bullet">
                  <CheckCircle className="trust-bullet-icon" />
                  <span>No distortions</span>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Accordion */}
          <section className="container pb-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <MagicCard className="max-w-2xl mx-auto p-6">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-foreground">How it works</h2>
                  <p className="text-xs text-muted-foreground mt-1">Simple 4-step process to studio-quality images</p>
                </div>
                
                <Accordion type="single">
                  <AccordionItem value="upload">
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                        <span>Upload a photo</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground pl-9">
                        Drop in a phone photo. We keep the product's shape, logos, and all fine details intact.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="settings">
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                        <span>Choose the finish</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground pl-9">
                        Pick shadows and lighting style. These only affect the look, not the product geometry.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="enhance">
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                        <span>Enhance</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground pl-9">
                        We generate a clean studio version with controlled lighting and a seamless background.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="download">
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                        <span>Download</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground pl-9">
                        Grab the final image for listings, ads, or catalogs. High-resolution PNG ready to use.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </MagicCard>
            </div>
          </section>

          {/* Main Content Grid */}
          <section className="container pb-12">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 max-w-6xl mx-auto">
                <Alert variant="destructive">
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column: Controls */}
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                {/* Upload Card */}
                <MagicCard className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <h2 className="text-base font-semibold text-foreground">Upload Product Photo</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, or WebP • Max 10MB
                    </p>
                  </div>
                  <ImageUpload
                    onFileSelect={handleFileSelect}
                    preview={filePreview}
                    disabled={isProcessing}
                  />
                </MagicCard>

                {/* Settings Card */}
                {preset && (
                  <MagicCard className="p-6">
                    <VariableControls
                      preset={preset}
                      variables={variables}
                      onChange={handleVariableChange}
                      onReset={resetVariables}
                      disabled={isProcessing}
                    />
                  </MagicCard>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleEnhance}
                    disabled={!selectedFile || !preset || isProcessing}
                    className={cn(
                      "w-full h-12 text-base btn-magic-primary",
                      "transition-opacity duration-200",
                      (!selectedFile || !preset || isProcessing) && "opacity-50"
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
                      className="w-full btn-secondary h-11 animate-in fade-in duration-200"
                      disabled={isProcessing}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Create Another
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Results */}
              <div 
                ref={resultsRef}
                className="animate-in fade-in slide-in-from-right-4 duration-500 delay-400"
              >
                <BeforeAfterPreview
                  beforeUrl={filePreview}
                  afterUrl={result?.outputUrl || null}
                  onDownload={result ? handleDownload : undefined}
                  isProcessing={isProcessing}
                />
                
                {/* Download Link */}
                {result && (
                  <div className="mt-4 text-center animate-in fade-in duration-200 delay-200">
                    <a
                      href={result.outputUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open full resolution
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </AnimatedGradientBackground>
  );
}
