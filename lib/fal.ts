import { fal } from '@fal-ai/client';

// Initialize fal client
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY,
  });
}

export interface FalEnhanceOptions {
  prompt: string;
  image_urls?: string[];
  image_buffer?: Buffer; // In-memory buffer to upload
  image_mimetype?: string;
  num_images?: number;
  output_format?: 'png' | 'jpeg' | 'webp';
  resolution?: '1K' | '2K' | '4K';
  aspect_ratio?: 'auto' | '21:9' | '16:9' | '3:2' | '4:3' | '5:4' | '1:1' | '4:5' | '3:4' | '2:3' | '9:16';
  image_size?: string | { width: number; height: number };
  [key: string]: any;
}

export interface FalEnhanceResult {
  images: Array<{ url: string; width: number; height: number }>;
  request_id?: string;
}

/**
 * Calls fal.ai's nano-banana-pro/edit endpoint
 */
export async function enhanceImage(options: FalEnhanceOptions): Promise<FalEnhanceResult> {
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY environment variable is not set');
  }
  
  try {
    // Upload image to fal.ai storage if buffer provided
    let imageUrls = options.image_urls || [];
    if (options.image_buffer) {
      console.log('Uploading image to fal.ai storage...');
      const mimetype = options.image_mimetype || 'image/png';
      // Convert Buffer to Uint8Array for Blob compatibility
      const uint8Array = new Uint8Array(options.image_buffer);
      const blob = new Blob([uint8Array], { type: mimetype });
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('Image uploaded to:', uploadedUrl);
      imageUrls = [uploadedUrl];
    }
    
    if (imageUrls.length === 0) {
      throw new Error('No image URLs provided and no buffer specified');
    }
    
    console.log('Calling fal.ai with prompt:', options.prompt.substring(0, 100) + '...');
    console.log('Image URLs:', imageUrls);
    
    const input: any = {
      prompt: options.prompt,
      image_urls: imageUrls,
      num_images: options.num_images || 1,
      output_format: options.output_format || 'png',
    };
    
    // Add aspect_ratio directly to the input (FAL API supports it directly)
    if (options.aspect_ratio && options.aspect_ratio !== 'auto') {
      input.aspect_ratio = options.aspect_ratio;
      console.log('Setting aspect_ratio in fal.ai input:', options.aspect_ratio);
    } else {
      // When no aspect ratio is specified, use resolution mode
      input.resolution = options.resolution || '2K';
      console.log('Using resolution mode:', input.resolution);
    }
    
    console.log('Full fal.ai input:', JSON.stringify(input, null, 2));
    
    const result = await fal.subscribe('fal-ai/nano-banana-pro/edit', {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Enhancement in progress...');
          if (update.logs) {
            update.logs.map((log: any) => log.message).forEach((msg: string) => console.log(msg));
          }
        }
      },
    });
    
    console.log('Fal.ai result:', JSON.stringify(result, null, 2));
    
    const data: any = (result as any).data ?? result;
    return {
      images: data.images || [],
      request_id: (result as any).requestId,
    };
  } catch (error: any) {
    console.error('Fal.ai error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Check for specific error types
    if (error?.status === 403) {
      const detail = error?.body?.detail || error?.detail || '';
      if (detail.includes('balance') || detail.includes('locked')) {
        throw new Error(`Fal.ai account issue: ${detail}. Please check your balance at fal.ai/dashboard/billing`);
      }
      throw new Error(`Fal.ai authentication failed: ${detail || 'Invalid API key or insufficient permissions'}`);
    }
    
    const errorMessage = error?.message || error?.error?.message || error?.body?.detail || error?.toString() || 'Unknown error';
    throw new Error(`Fal.ai enhancement failed: ${errorMessage}`);
  }
}
