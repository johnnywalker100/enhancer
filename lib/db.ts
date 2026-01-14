import { supabaseAdmin } from './supabase';

export interface Job {
  id: string;
  created_at: string; // ISO timestamp from Supabase
  session_id: string;
  preset_id: string;
  input_image_url: string;
  output_image_url: string | null;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  variables_json: any; // JSONB in Supabase, object in JS
  compiled_prompt_string: string;
  fal_request_id: string | null;
  error_message: string | null;
}

export const dbOperations = {
  createJob: async (job: Omit<Job, 'id' | 'created_at'>) => {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert({
        session_id: job.session_id,
        preset_id: job.preset_id,
        input_image_url: job.input_image_url,
        output_image_url: job.output_image_url,
        status: job.status,
        variables_json: job.variables_json, // Pass as object, Supabase handles JSONB
        compiled_prompt_string: job.compiled_prompt_string,
        fal_request_id: job.fal_request_id,
        error_message: job.error_message,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return { id: data.id, created_at: data.created_at };
  },

  updateJob: async (id: string, updates: Partial<Pick<Job, 'status' | 'output_image_url' | 'fal_request_id' | 'error_message'>>) => {
    const updateData: any = {};
    
    if (updates.status !== undefined) {
      updateData.status = updates.status;
    }
    if (updates.output_image_url !== undefined) {
      updateData.output_image_url = updates.output_image_url;
    }
    if (updates.fal_request_id !== undefined) {
      updateData.fal_request_id = updates.fal_request_id;
    }
    if (updates.error_message !== undefined) {
      updateData.error_message = updates.error_message;
    }
    
    if (Object.keys(updateData).length === 0) return;
    
    const { error } = await supabaseAdmin
      .from('jobs')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update job: ${error.message}`);
    }
  },

  getJob: async (id: string, sessionId: string): Promise<Job | null> => {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      throw new Error(`Failed to get job: ${error.message}`);
    }

    return data as Job;
  },

  getJobsBySession: async (sessionId: string): Promise<Job[]> => {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get jobs: ${error.message}`);
    }

    return (data || []) as Job[];
  },
};
