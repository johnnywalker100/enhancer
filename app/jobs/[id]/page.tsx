'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/db';
import { getPreset } from '@/lib/presets';
import { Navigation, Footer } from '@/components/Navigation';
import { AnimatedGradientBackground } from '@/components/magicui/animated-gradient-background';
import { MagicCard } from '@/components/magicui/magic-card';
import { BeforeAfterPreview } from '@/components/BeforeAfterPreview';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Calendar, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Plus,
  FileText
} from 'lucide-react';

// Mapping for improved labels
const SETTING_LABELS: Record<string, string> = {
  soft_shadow_beneath_product: 'Contact Shadow',
  floating_product_with_drop_shadow: 'Floating Look',
  luxury_brand_aesthetic: 'Premium Lighting',
  ecommerce_ready: 'Listing Ready',
  minimal_apple_style_lighting: 'Minimal Studio',
};

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
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
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId, fetchJob]);

  const formatDate = (timestamp: string | number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'complete':
        return { icon: CheckCircle, className: 'status-complete', label: 'Complete' };
      case 'processing':
        return { icon: Loader2, className: 'status-processing', label: 'Processing' };
      case 'failed':
        return { icon: XCircle, className: 'status-failed', label: 'Failed' };
      default:
        return { icon: Clock, className: 'status-queued', label: 'Queued' };
    }
  };

  // Loading State
  if (loading) {
    return (
      <AnimatedGradientBackground>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 container py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-32 bg-muted rounded-xl animate-pulse" />
            </div>
            <div className="h-24 w-full bg-muted rounded-2xl animate-pulse mb-6" />
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-96 bg-muted rounded-2xl animate-pulse" />
              <div className="h-96 bg-muted rounded-2xl animate-pulse" />
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedGradientBackground>
    );
  }

  // Error State
  if (error || !job) {
    return (
      <AnimatedGradientBackground>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 container py-8">
            <MagicCard className="p-6 border-destructive/30 bg-destructive/5 mb-6 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error loading job</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {error || 'Job not found'}
                  </p>
                </div>
              </div>
            </MagicCard>
            <Link href="/jobs">
              <button className="btn-secondary">
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </button>
            </Link>
          </main>
          <Footer />
        </div>
      </AnimatedGradientBackground>
    );
  }

  const preset = getPreset(job.preset_id);
  // Supabase returns JSONB as objects, no need to parse
  const variables = typeof job.variables_json === 'string' 
    ? JSON.parse(job.variables_json) 
    : (job.variables_json || {});
  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;
  const isProcessing = job.status === 'processing';

  const enabledSettings = Object.entries(variables)
    .filter(([, value]) => value === true)
    .map(([key]) => SETTING_LABELS[key] || key.replace(/_/g, ' '));

  const handleDownload = async () => {
    if (job.output_image_url) {
      try {
        // Use the download API to properly handle cross-origin images
        const downloadUrl = `/api/download?url=${encodeURIComponent(job.output_image_url)}&filename=enhanced-image.png`;
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
  };

  return (
    <AnimatedGradientBackground>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 container py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Link href="/jobs">
              <button className="btn-ghost">
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </button>
            </Link>
            <Link href="/">
              <button className="btn-magic-primary">
                <Plus className="w-4 h-4" />
                Create New
              </button>
            </Link>
          </div>

          {/* Job Header Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
            <MagicCard className="p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                      Job {job.id.slice(0, 8)}
                    </h1>
                    <span className={cn("status-badge", statusConfig.className)}>
                      {isProcessing ? (
                        <StatusIcon className="w-3 h-3 animate-spin" />
                      ) : (
                        <StatusIcon className="w-3 h-3" />
                      )}
                      {statusConfig.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(job.created_at)}
                    </div>
                  </div>
                </div>

                {/* Settings badges */}
                {enabledSettings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {enabledSettings.map((setting) => (
                      <span 
                        key={setting} 
                        className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {setting}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {job.error_message && (
                <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive text-sm">Error Details</p>
                      <p className="text-sm text-muted-foreground mt-1">{job.error_message}</p>
                    </div>
                  </div>
                </div>
              )}
            </MagicCard>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Preview - Takes 2 columns on desktop */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-150">
              <BeforeAfterPreview
                beforeUrl={job.input_image_url}
                afterUrl={job.output_image_url || null}
                onDownload={job.output_image_url ? handleDownload : undefined}
                isProcessing={isProcessing}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
              {/* Settings Card */}
              <MagicCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10">
                    <Settings className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">Settings Used</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(variables).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {SETTING_LABELS[key] || key.replace(/_/g, ' ')}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        value 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {value ? 'On' : 'Off'}
                      </span>
                    </div>
                  ))}
                </div>
              </MagicCard>

              {/* Job Info Card */}
              <MagicCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">Job Details</h2>
                </div>
                <div className="space-y-4">
                  {job.fal_request_id && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Request ID</p>
                      <p className="text-xs font-mono text-muted-foreground break-all bg-muted/30 p-2 rounded-lg">
                        {job.fal_request_id}
                      </p>
                    </div>
                  )}
                </div>
              </MagicCard>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedGradientBackground>
  );
}
