'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/db';
import { getPreset } from '@/lib/presets';
import { Navigation, Footer } from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BeforeAfterPreview } from '@/components/BeforeAfterPreview';
import { ArrowLeft, Download, Calendar, Tag, Code } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch job');
      }
      
      setJob(data.job);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-red-200 bg-red-50 mb-6">
            <div className="text-red-900">
              <strong>Error:</strong> {error || 'Job not found'}
            </div>
          </Card>
          <Link href="/jobs" className="btn btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const preset = getPreset(job.preset_id);
  const variables = JSON.parse(job.variables_json);

  const handleDownload = () => {
    if (job.output_image_url) {
      const link = document.createElement('a');
      link.href = job.output_image_url;
      link.download = 'enhanced-image.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/jobs" className="btn btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
          <Link href="/" className="btn btn-primary">
            Create New
          </Link>
        </div>

        {/* Job Info Header */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Job {job.id.slice(0, 8)}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(job.created_at)}
                </div>
                {preset && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {preset.name}
                  </div>
                )}
              </div>
            </div>
            <span className={getStatusBadgeClass(job.status)}>
              {job.status}
            </span>
          </div>

          {job.error_message && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 text-sm">
              <strong>Error:</strong> {job.error_message}
            </div>
          )}
        </Card>

        {/* Before/After Preview */}
        <div className="mb-6">
          <BeforeAfterPreview
            beforeUrl={job.input_image_url}
            afterUrl={job.output_image_url || null}
            onDownload={job.output_image_url ? handleDownload : undefined}
            isProcessing={job.status === 'processing'}
          />
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Variables Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Settings Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Preset</p>
                <p className="text-sm font-medium text-gray-900">
                  {preset?.name || job.preset_id}
                </p>
              </div>
              {preset?.description && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{preset.description}</p>
                </div>
              )}
              {job.fal_request_id && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Request ID</p>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {job.fal_request_id}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Compiled Prompt (Collapsible or always visible) */}
        {job.compiled_prompt_string && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Compiled Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs font-mono text-gray-700 whitespace-pre-wrap break-words border border-gray-200">
                {job.compiled_prompt_string}
              </pre>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
