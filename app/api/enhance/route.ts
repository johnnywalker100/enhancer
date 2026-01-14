import { NextRequest, NextResponse } from 'next/server';
import { validateAndReadFile } from '@/lib/upload';
import { getPreset } from '@/lib/presets';
import { injectVariables, validateVariables } from '@/lib/variable-injection';
import { compilePrompt } from '@/lib/compiler';
import { enhanceImage } from '@/lib/fal';
import { getOrCreateSessionId, setSessionCookie } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max for Vercel Hobby plan

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
    
    // Validate and read the uploaded file (no filesystem operations)
    const validatedFile = await validateAndReadFile(imageFile);
    
    // For MVP: synchronous processing (can upgrade to async/queue later)
    try {
      // Upload image directly to fal.ai storage (no local file system needed)
      const falResult = await enhanceImage({
        prompt: compiled.prompt_string,
        image_buffer: validatedFile.buffer,
        image_mimetype: validatedFile.mimetype,
        ...compiled.fal_options,
      });
      
      // Get output image URL
      const outputImageUrl = falResult.images?.[0]?.url || null;
      
      if (!outputImageUrl) {
        throw new Error('No output image URL returned from fal.ai');
      }
      
      // Return response
      const response = NextResponse.json({
        output_url: outputImageUrl,
        status: 'complete',
        request_id: falResult.request_id,
      });
      
      // Set session cookie if needed
      response.headers.set('Set-Cookie', setSessionCookie(sessionId));
      
      return response;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      console.error('Enhancement error:', errorMessage);
      console.error('Full error:', error);
      
      return NextResponse.json({
        error: 'Enhancement failed',
        message: errorMessage,
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
