import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/jobs.db';
const dbDir = path.dirname(dbPath);

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    preset_id TEXT NOT NULL,
    input_image_url TEXT NOT NULL,
    output_image_url TEXT,
    status TEXT NOT NULL CHECK(status IN ('queued', 'processing', 'complete', 'failed')),
    variables_json TEXT NOT NULL,
    compiled_prompt_string TEXT NOT NULL,
    fal_request_id TEXT,
    error_message TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_jobs_session ON jobs(session_id);
  CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
`);

export interface Job {
  id: string;
  created_at: number;
  session_id: string;
  preset_id: string;
  input_image_url: string;
  output_image_url: string | null;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  variables_json: string;
  compiled_prompt_string: string;
  fal_request_id: string | null;
  error_message: string | null;
}

export const dbOperations = {
  createJob: (job: Omit<Job, 'id' | 'created_at'>) => {
    const id = require('uuid').v4();
    const created_at = Date.now();
    db.prepare(`
      INSERT INTO jobs (id, created_at, session_id, preset_id, input_image_url, output_image_url, status, variables_json, compiled_prompt_string, fal_request_id, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      created_at,
      job.session_id,
      job.preset_id,
      job.input_image_url,
      job.output_image_url,
      job.status,
      job.variables_json,
      job.compiled_prompt_string,
      job.fal_request_id,
      job.error_message
    );
    return { id, created_at };
  },

  updateJob: (id: string, updates: Partial<Pick<Job, 'status' | 'output_image_url' | 'fal_request_id' | 'error_message'>>) => {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.output_image_url !== undefined) {
      fields.push('output_image_url = ?');
      values.push(updates.output_image_url);
    }
    if (updates.fal_request_id !== undefined) {
      fields.push('fal_request_id = ?');
      values.push(updates.fal_request_id);
    }
    if (updates.error_message !== undefined) {
      fields.push('error_message = ?');
      values.push(updates.error_message);
    }
    
    if (fields.length === 0) return;
    
    values.push(id);
    db.prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  getJob: (id: string, sessionId: string): Job | null => {
    const row = db.prepare('SELECT * FROM jobs WHERE id = ? AND session_id = ?').get(id, sessionId) as any;
    if (!row) return null;
    return {
      ...row,
      created_at: row.created_at,
    };
  },

  getJobsBySession: (sessionId: string): Job[] => {
    const rows = db.prepare('SELECT * FROM jobs WHERE session_id = ? ORDER BY created_at DESC').all(sessionId) as any[];
    return rows.map(row => ({
      ...row,
      created_at: row.created_at,
    }));
  },
};

export default db;
