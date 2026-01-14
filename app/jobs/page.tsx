'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/db';

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
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Job History</h1>
          <Link href="/" className="btn btn-primary">
            Create New Enhancement
          </Link>
        </div>
      </header>

      {error && (
        <div className="card" style={{ background: '#f8d7da', color: '#721c24' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            No jobs yet. Create your first enhancement!
          </p>
          <Link href="/" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="card"
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '20px', alignItems: 'center' }}>
                <div>
                  {job.output_image_url ? (
                    <img
                      src={job.output_image_url}
                      alt="Output"
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '80px',
                        background: '#f0f0f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                      }}
                    >
                      {job.status === 'processing' ? 'Processing...' : 'No image'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px' }}>Job {job.id.slice(0, 8)}</h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                    Preset: {job.preset_id}
                  </p>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Created: {formatDate(job.created_at)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={getStatusBadgeClass(job.status)}>
                    {job.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
