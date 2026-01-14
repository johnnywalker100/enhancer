'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/db';
import { Navigation, Footer } from '@/components/Navigation';
import { AnimatedGradientBackground } from '@/components/magicui/animated-gradient-background';
import { MagicCard } from '@/components/magicui/magic-card';
import { cn } from '@/lib/utils';
import { Plus, Clock, CheckCircle, XCircle, Loader2, ImageIcon, ArrowRight } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs');
      }
      
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string | number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'complete':
        return { 
          icon: CheckCircle, 
          className: 'status-complete', 
          label: 'Complete' 
        };
      case 'processing':
        return { 
          icon: Loader2, 
          className: 'status-processing', 
          label: 'Processing' 
        };
      case 'failed':
        return { 
          icon: XCircle, 
          className: 'status-failed', 
          label: 'Failed' 
        };
      default:
        return { 
          icon: Clock, 
          className: 'status-queued', 
          label: 'Queued' 
        };
    }
  };

  return (
    <AnimatedGradientBackground>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 container py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">
                Job History
              </h1>
              <p className="text-muted-foreground text-sm">
                View and manage your enhancement jobs
              </p>
            </div>
            <Link href="/">
              <button className="btn-magic-primary">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Enhancement</span>
                <span className="sm:hidden">New</span>
              </button>
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <MagicCard className="p-6 mb-6 border-destructive/30 bg-destructive/5 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error loading jobs</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </MagicCard>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="magic-card p-5 animate-pulse">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-1/3 bg-muted rounded" />
                      <div className="h-4 w-1/4 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-20 bg-muted rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && jobs.length === 0 && !error && (
            <MagicCard className="text-center py-16 animate-in fade-in duration-200">
              <div className="max-w-sm mx-auto space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">No jobs yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first enhancement to get started
                  </p>
                </div>
                <Link href="/">
                  <button className="btn-magic-primary">
                    <Plus className="w-4 h-4" />
                    Get Started
                  </button>
                </Link>
              </div>
            </MagicCard>
          )}

          {/* Jobs List */}
          {!loading && jobs.length > 0 && (
            <div className="space-y-4">
              {jobs.map((job, index) => {
                const statusConfig = getStatusConfig(job.status);
                const StatusIcon = statusConfig.icon;
                const isProcessing = job.status === 'processing';
                
                return (
                  <div
                    key={job.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link href={`/jobs/${job.id}`} className="block group">
                      <MagicCard className="p-5">
                        <div className="flex gap-4 items-center">
                          {/* Thumbnail */}
                          <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted/50 border border-border/30">
                            {job.output_image_url ? (
                              <img
                                src={job.output_image_url}
                                alt="Enhanced result"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                {isProcessing ? (
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                  <Clock className="w-6 h-6" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                                  {job.preset_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {formatDate(job.created_at)}
                                </p>
                                <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                                  {job.id.slice(0, 8)}
                                </p>
                              </div>
                              
                              <div className="shrink-0 flex items-center gap-3">
                                <span className={cn("status-badge", statusConfig.className)}>
                                  {isProcessing ? (
                                    <StatusIcon className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <StatusIcon className="w-3 h-3" />
                                  )}
                                  {statusConfig.label}
                                </span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </MagicCard>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </AnimatedGradientBackground>
  );
}
