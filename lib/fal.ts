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
    
    // Map aspect_ratio to fal.ai image_size with explicit dimensions
    if (options.aspect_ratio && options.aspect_ratio !== 'auto') {
      const aspectRatioMap: Record<string, { width: number; height: number }> = {
        // Always use explicit dimensions for precise control
        '1:1': { width: 1024, height: 1024 },    // square
        '4:3': { width: 1365, height: 1024 },    // landscape
        '16:9': { width: 1820, height: 1024 },   // widescreen
        '3:4': { width: 1024, height: 1365 },    // portrait
        '9:16': { width: 1024, height: 1820 },   // vertical video
        '21:9': { width: 2048, height: 878 },    // ultrawide
        '5:4': { width: 1280, height: 1024 },    // classic
        '3:2': { width: 1536, height: 1024 },    // photo
        '2:3': { width: 1024, height: 1536 },    // portrait photo
        '4:5': { width: 1024, height: 1280 },    // Instagram portrait
      };
      
      const imageSize = aspectRatioMap[options.aspect_ratio] || { width: 1024, height: 1024 };
      input.image_size = imageSize;
      console.log('Image size set in fal.ai input:', JSON.stringify(imageSize), 'for aspect ratio:', options.aspect_ratio);
    } else {
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
