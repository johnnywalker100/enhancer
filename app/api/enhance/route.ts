import { NextRequest, NextResponse } from 'next/server';
import { handleFileUpload, getPublicUrl } from '@/lib/upload';
import { getPreset } from '@/lib/presets';
import { injectVariables, validateVariables } from '@/lib/variable-injection';
import { compilePrompt } from '@/lib/compiler';
import { enhanceImage } from '@/lib/fal';
import { dbOperations } from '@/lib/db';
import { getOrCreateSessionId, setSessionCookie } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get or create session ID
    const sessionId = getOrCreateSessionId(request);
    
    // Parse form data
    const formData = await request.formData();
    const presetId = formData.get('preset_id') as string;
    const variablesJson = formData.get('variables') as string;
    const imageFile = formData.get('image') as File;
    
    if (!presetId) {
      return NextResponse.json({ error: 'preset_id is required' }, { status: 400 });
    }
    
    if (!imageFile) {
      return NextResponse.json({ error: 'image file is required' }, { status: 400 });
    }
    
    // Get preset
    const preset = getPreset(presetId);
    if (!preset) {
      return NextResponse.json({ error: `Preset '${presetId}' not found` }, { status: 404 });
    }
    
    // Parse variables
    let variables: Record<string, any> = {};
    if (variablesJson) {
      try {
        variables = JSON.parse(variablesJson);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid variables JSON' }, { status: 400 });
      }
    }
    
    // Validate variables
    const validation = validateVariables(preset, variables);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: 'Variable validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    // Inject variables into template
    const finalPromptJson = injectVariables(preset, variables);
    
    // Compile to fal format
    const compiled = compilePrompt(preset, finalPromptJson);

    // Fal options are fixed: resolution=1K, num_images=1, output_format=png
    // (set in preset.fal_defaults, no variables needed)
    
    // Save uploaded file
    const uploadedFile = await handleFileUpload(imageFile);
    const inputImageUrl = getPublicUrl(uploadedFile.filepath);
    
    // Create job record (status: queued)
    const { id: jobId } = dbOperations.createJob({
      session_id: sessionId,
      preset_id: presetId,
      input_image_url: inputImageUrl,
      output_image_url: null,
      status: 'queued',
      variables_json: JSON.stringify(variables),
      compiled_prompt_string: compiled.prompt_string,
      fal_request_id: null,
      error_message: null,
    });
    
    // Update status to processing
    dbOperations.updateJob(jobId, { status: 'processing' });
    
    // For MVP: synchronous processing (can upgrade to async/queue later)
    try {
      // Upload image to fal.ai storage (they can't access localhost URLs)
      // Pass the local file path so fal client can upload it
      const falResult = await enhanceImage({
        prompt: compiled.prompt_string,
        image_filepath: uploadedFile.filepath, // Upload via fal.storage.upload()
        ...compiled.fal_options,
      });
      
      // Get output image URL
      const outputImageUrl = falResult.images?.[0]?.url || null;
      
      if (!outputImageUrl) {
        throw new Error('No output image URL returned from fal.ai');
      }
      
      // Update job with result
      dbOperations.updateJob(jobId, {
        status: 'complete',
        output_image_url: outputImageUrl,
        fal_request_id: falResult.request_id,
      });
      
      // Return response
      const response = NextResponse.json({
        job_id: jobId,
        output_url: outputImageUrl,
        status: 'complete',
      });
      
      // Set session cookie if needed
      response.headers.set('Set-Cookie', setSessionCookie(sessionId));
      
      return response;
    } catch (error: any) {
      // Update job with error
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      console.error('Enhancement error:', errorMessage);
      console.error('Full error:', error);
      
      dbOperations.updateJob(jobId, {
        status: 'failed',
        error_message: errorMessage,
      });
      
      return NextResponse.json({
        error: 'Enhancement failed',
        message: errorMessage,
        job_id: jobId,
        details: error?.stack || error,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Enhance API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message,
    }, { status: 500 });
  }
}
