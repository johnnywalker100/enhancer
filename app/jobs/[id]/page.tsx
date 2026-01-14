'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/db';
import { getPreset } from '@/lib/presets';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
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
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="card" style={{ background: '#f8d7da', color: '#721c24' }}>
          <strong>Error:</strong> {error || 'Job not found'}
        </div>
        <div style={{ marginTop: '20px' }}>
          <Link href="/jobs" className="btn btn-secondary">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const preset = getPreset(job.preset_id);
  const variables = JSON.parse(job.variables_json);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Job Details</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/jobs" className="btn btn-secondary">
              Back to Jobs
            </Link>
            <Link href="/" className="btn btn-primary">
              Create New
            </Link>
          </div>
        </div>
      </header>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ marginBottom: '8px' }}>Job {job.id.slice(0, 8)}</h2>
            <p style={{ color: '#666' }}>Created: {formatDate(job.created_at)}</p>
          </div>
          <span className={getStatusBadgeClass(job.status)}>
            {job.status}
          </span>
        </div>

        {job.error_message && (
          <div style={{ 
            padding: '12px', 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '6px',
            marginBottom: '24px'
          }}>
            <strong>Error:</strong> {job.error_message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <h3 style={{ marginBottom: '12px' }}>Input Image</h3>
            <img
              src={job.input_image_url}
              alt="Input"
              className="image-preview"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <h3 style={{ marginBottom: '12px' }}>Output Image</h3>
            {job.output_image_url ? (
              <>
                <img
                  src={job.output_image_url}
                  alt="Output"
                  className="image-preview"
                  style={{ width: '100%' }}
                />
                <div style={{ marginTop: '12px' }}>
                  <a
                    href={job.output_image_url}
                    download
                    className="btn btn-primary"
                  >
                    Download Enhanced Image
                  </a>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  minHeight: '200px',
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                {job.status === 'processing' ? 'Processing...' : 'No output yet'}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '16px' }}>Job Information</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <strong>Preset:</strong> {preset?.name || job.preset_id}
            </div>
            {preset?.description && (
              <div>
                <strong>Description:</strong> {preset.description}
              </div>
            )}
            {job.fal_request_id && (
              <div>
                <strong>Fal Request ID:</strong> {job.fal_request_id}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '16px' }}>Variables Used</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '6px', 
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify(variables, null, 2)}
          </pre>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '16px' }}>Compiled Prompt</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '6px', 
            overflow: 'auto',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {job.compiled_prompt_string}
          </pre>
        </div>
      </div>
    </div>
  );
}
