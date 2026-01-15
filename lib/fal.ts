// API易 (apiyi.com) Nano Banana Pro Image Generation Client

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
 * Calls apiyi.com's Nano Banana Pro image generation endpoint
 */
export async function enhanceImage(options: FalEnhanceOptions): Promise<FalEnhanceResult> {
  if (!process.env.APIYI_API_KEY) {
    throw new Error('APIYI_API_KEY environment variable is not set');
  }
  
  try {
    // Convert image buffer to base64 for API request
    let imageBase64 = '';
    if (options.image_buffer) {
      console.log('Converting image to base64...');
      imageBase64 = options.image_buffer.toString('base64');
      console.log('Image converted, size:', imageBase64.length, 'characters');
    } else if (options.image_urls && options.image_urls.length > 0) {
      // If image URL is provided, fetch it and convert to base64
      console.log('Fetching image from URL:', options.image_urls[0]);
      const response = await fetch(options.image_urls[0]);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageBase64 = buffer.toString('base64');
    } else {
      throw new Error('No image provided (buffer or URL)');
    }
    
    console.log('Calling apiyi.com with prompt:', options.prompt.substring(0, 100) + '...');
    
    // Determine aspect ratio - map to apiyi.com format
    let aspectRatio = '1:1'; // default
    if (options.aspect_ratio && options.aspect_ratio !== 'auto') {
      aspectRatio = options.aspect_ratio;
      console.log('Setting aspect_ratio:', aspectRatio);
    }
    
    // Determine resolution
    const resolution = options.resolution || '2K';
    console.log('Using resolution:', resolution);
    
    // Build request payload using Google native format
    const payload = {
      contents: [
        {
          parts: [
            {
              text: options.prompt
            },
            {
              inlineData: {
                mimeType: options.image_mimetype || 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution
        }
      }
    };
    
    console.log('Calling apiyi.com API...');
    
    // Call API易 endpoint
    const apiUrl = 'https://api.apiyi.com/v1beta/models/gemini-3-pro-image-preview:generateContent';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.APIYI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API易 error response:', errorText);
      throw new Error(`API易 request failed with status ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API易 response received');
    
    // Extract base64 image data from response
    const candidate = result.candidates?.[0];
    if (!candidate) {
      throw new Error('No candidates in API response');
    }
    
    // Check finish reason
    if (candidate.finishReason !== 'STOP') {
      throw new Error(`Image generation failed: ${candidate.finishReason || 'Unknown reason'}`);
    }
    
    const imageData = candidate.content?.parts?.[0]?.inlineData?.data;
    if (!imageData) {
      throw new Error('No image data in API response');
    }
    
    // Convert base64 back to a data URL
    const mimeType = candidate.content?.parts?.[0]?.inlineData?.mimeType || 'image/png';
    const dataUrl = `data:${mimeType};base64,${imageData}`;
    
    console.log('Image generated successfully');
    
    // Return in the same format as FAL AI for compatibility
    return {
      images: [{
        url: dataUrl,
        width: 1024, // Default dimensions, adjust based on resolution if needed
        height: 1024
      }],
      request_id: result.promptFeedback?.blockReason || 'success',
    };
  } catch (error: any) {
    console.error('API易 error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Check for specific error types
    if (error?.status === 403 || error?.message?.includes('403')) {
      throw new Error(`API易 authentication failed: Invalid API key or insufficient permissions`);
    }
    
    if (error?.status === 429 || error?.message?.includes('429')) {
      throw new Error(`API易 rate limit exceeded: Please try again later`);
    }
    
    const errorMessage = error?.message || error?.error?.message || error?.toString() || 'Unknown error';
    throw new Error(`API易 enhancement failed: ${errorMessage}`);
  }
}
