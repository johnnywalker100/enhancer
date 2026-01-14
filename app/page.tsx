'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import VariableControls from '@/components/VariableControls';
import ImageUpload from '@/components/ImageUpload';
import { getPreset } from '@/lib/presets';
import type { Preset } from '@/lib/types';
import { VariableValues } from '@/lib/types';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [preset] = useState<Preset | null>(() => getPreset('luxury-studio-mvp'));
  const [variables, setVariables] = useState<VariableValues>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ jobId: string; outputUrl: string } | null>(null);

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

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          Product Photo Enhancer
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Transform your product photos with AI-powered editing
        </p>
        <div style={{ marginTop: '16px' }}>
          <Link href="/jobs" className="btn btn-secondary" style={{ marginRight: '8px' }}>
            View Jobs
          </Link>
        </div>
      </header>

      {error && (
        <div className="card" style={{ background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result ? (
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Enhancement Complete!</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ marginBottom: '12px' }}>Original</h3>
              {filePreview && (
                <img src={filePreview} alt="Original" className="image-preview" />
              )}
            </div>
            <div>
              <h3 style={{ marginBottom: '12px' }}>Enhanced</h3>
              <img src={result.outputUrl} alt="Enhanced" className="image-preview" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={result.outputUrl}
              download
              className="btn btn-primary"
            >
              Download Enhanced Image
            </a>
            <Link href={`/jobs/${result.jobId}`} className="btn btn-secondary">
              View Job Details
            </Link>
            <button onClick={handleReset} className="btn btn-secondary">
              Create Another
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>1. Upload Product Photo</h2>
            <ImageUpload
              onFileSelect={handleFileSelect}
              preview={filePreview}
            />
          </div>

          {preset && (
            <div className="card">
              <h2 style={{ marginBottom: '20px' }}>2. Adjust Settings</h2>
              <VariableControls
                preset={preset}
                variables={variables}
                onChange={handleVariableChange}
              />
            </div>
          )}

          <div className="card">
            <button
              className="btn btn-primary"
              onClick={handleEnhance}
              disabled={!selectedFile || !preset || isProcessing}
              style={{ width: '100%', fontSize: '18px', padding: '16px' }}
            >
              {isProcessing ? 'Enhancing...' : 'Enhance Image'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
