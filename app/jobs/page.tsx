'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/db';
import { Navigation, Footer } from '@/components/Navigation';
import { Card } from '@/components/ui/Card';
import { Plus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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

  const formatDate = (timestamp: number) => {
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
        return { icon: CheckCircle, className: 'status-complete', label: 'Complete' };
      case 'processing':
        return { icon: Loader2, className: 'status-processing', label: 'Processing' };
      case 'failed':
        return { icon: XCircle, className: 'status-failed', label: 'Failed' };
      default:
        return { icon: Clock, className: 'status-queued', label: 'Queued' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job History</h1>
            <p className="text-gray-600 text-sm">View and manage your enhancement jobs</p>
          </div>
          <Link href="/" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Enhancement</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="text-red-900">
              <strong>Error:</strong> {error}
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No jobs yet. Create your first enhancement!</p>
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Get Started
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex gap-4 items-center">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {job.output_image_url ? (
                          <img
                            src={job.output_image_url}
                            alt="Output"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {job.status === 'processing' ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <Clock className="w-6 h-6" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {job.preset_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(job.created_at)}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`status-badge ${statusConfig.className} flex items-center gap-1.5`}>
                              {statusConfig.icon === Loader2 ? (
                                <StatusIcon className="w-3 h-3 animate-spin" />
                              ) : (
                                <StatusIcon className="w-3 h-3" />
                              )}
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          Job ID: {job.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
