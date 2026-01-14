'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import VariableControls from '@/components/VariableControls';
import ImageUpload from '@/components/ImageUpload';
import { BeforeAfterPreview } from '@/components/BeforeAfterPreview';
import { Navigation, Footer } from '@/components/Navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { getPreset } from '@/lib/presets';
import type { Preset } from '@/lib/types';
import { VariableValues } from '@/lib/types';
import { Wand2, Loader2 } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [preset] = useState<Preset | null>(() => getPreset('luxury-studio-mvp') ?? null);
  const [variables, setVariables] = useState<VariableValues>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ jobId: string; outputUrl: string } | null>(null);
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Enhancement failed');
      }

      setResult({
        jobId: data.job_id,
        outputUrl: data.output_url,
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
    // Reset variables to defaults
    if (preset) {
      const defaults: VariableValues = {};
      for (const varSchema of preset.variables_schema) {
        if (varSchema.default !== undefined) {
          defaults[varSchema.key] = varSchema.default;
        }
      }
      setVariables(defaults);
    }
    setResult(null);
    setError(null);
  }, [preset]);

  const handleDownload = useCallback(() => {
    if (result?.outputUrl) {
      const link = document.createElement('a');
      link.href = result.outputUrl;
      link.download = 'enhanced-image.png';
      link.click();
    }
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Product Photo Enhancer
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Transform your product photos with AI-powered editing
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* 2-Column Layout: Desktop, Stacked: Mobile */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Product Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onFileSelect={handleFileSelect}
                  preview={filePreview}
                  disabled={isProcessing}
                />
              </CardContent>
            </Card>

            {/* Settings Card */}
            {preset && (
              <Card>
                <CardContent className="pt-6">
                  <VariableControls
                    preset={preset}
                    variables={variables}
                    onChange={handleVariableChange}
                    disabled={isProcessing}
                  />
                </CardContent>
              </Card>
            )}

            {/* Enhance Button */}
            <button
              onClick={handleEnhance}
              disabled={!selectedFile || !preset || isProcessing}
              className="w-full btn btn-primary flex items-center justify-center gap-2 h-12 text-base font-medium"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Enhance Photo
                </>
              )}
            </button>

            {/* Reset Button (only show when there's a result) */}
            {result && (
              <button
                onClick={handleReset}
                className="w-full btn btn-secondary"
                disabled={isProcessing}
              >
                Create Another
              </button>
            )}
          </div>

          {/* Right Column: Results */}
          <div ref={resultsRef}>
            <BeforeAfterPreview
              beforeUrl={filePreview}
              afterUrl={result?.outputUrl || null}
              onDownload={result ? handleDownload : undefined}
              isProcessing={isProcessing}
            />
            
            {/* Job Link */}
            {result && (
              <div className="mt-4 text-center">
                <Link
                  href={`/jobs/${result.jobId}`}
                  className="text-sm text-primary hover:underline"
                >
                  View job details →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
