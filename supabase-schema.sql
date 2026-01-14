-- Create jobs table with PostgreSQL types matching your SQLite schema
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id TEXT NOT NULL,
  preset_id TEXT NOT NULL,
  input_image_url TEXT NOT NULL,
  output_image_url TEXT,
  status TEXT NOT NULL CHECK(status IN ('queued', 'processing', 'complete', 'failed')),
  variables_json JSONB NOT NULL,
  compiled_prompt_string TEXT NOT NULL,
  fal_request_id TEXT,
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_session ON jobs(session_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access jobs for their session
CREATE POLICY "Users can view their own jobs"
  ON jobs
  FOR SELECT
  USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id'::text
         OR session_id = current_setting('app.session_id', true));

-- RLS Policy: Allow inserts with session_id
CREATE POLICY "Users can insert their own jobs"
  ON jobs
  FOR INSERT
  WITH CHECK (session_id = current_setting('app.session_id', true));

-- RLS Policy: Users can update their own jobs
CREATE POLICY "Users can update their own jobs"
  ON jobs
  FOR UPDATE
  USING (session_id = current_setting('app.session_id', true));

-- Service role can bypass RLS (for server-side operations)
-- This is automatically handled by Supabase when using the service role key

-- Optional: Create a storage bucket for uploaded images
-- Run this in the Supabase Storage UI or via API:
-- Bucket name: "uploads"
-- Public: true (or false if you want signed URLs)

-- Optional: Function to clean up old jobs (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_jobs()
RETURNS void AS $$
BEGIN
  DELETE FROM jobs
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND status IN ('complete', 'failed');
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE jobs IS 'Stores image enhancement jobs with their processing status';
COMMENT ON COLUMN jobs.variables_json IS 'JSONB field containing user-defined preset variables';
COMMENT ON COLUMN jobs.compiled_prompt_string IS 'Final prompt sent to fal.ai after variable injection';
