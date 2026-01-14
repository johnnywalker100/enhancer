/**
 * Client-side image compression utility
 * Compresses images that exceed the size limit while maintaining quality
 */

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_DIMENSION = 2048; // Max width/height for compressed images
const INITIAL_QUALITY = 0.85; // Start with high quality
const MIN_QUALITY = 0.6; // Minimum acceptable quality

export interface CompressionResult {
  file: File;
  wasCompressed: boolean;
  originalSize: number;
  finalSize: number;
}

/**
 * Compress an image file if needed to fit within size limits
 */
export async function compressImageIfNeeded(file: File): Promise<CompressionResult> {
  const originalSize = file.size;
  
  // If already under limit, no compression needed
  if (originalSize <= MAX_FILE_SIZE) {
    return {
      file,
      wasCompressed: false,
      originalSize,
      finalSize: originalSize,
    };
  }
  
  // Need to compress
  try {
    const compressedFile = await compressImage(file);
    return {
      file: compressedFile,
      wasCompressed: true,
      originalSize,
      finalSize: compressedFile.size,
    };
  } catch (error) {
    console.error('Compression failed:', error);
    // If compression fails, return original and let server validation handle it
    return {
      file,
      wasCompressed: false,
      originalSize,
      finalSize: originalSize,
    };
  }
}

/**
 * Compress an image using Canvas API
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = async () => {
        try {
          // Calculate new dimensions maintaining aspect ratio
          let { width, height } = img;
          
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Use high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try progressively lower quality until we hit the size target
          let quality = INITIAL_QUALITY;
          let blob: Blob | null = null;
          
          while (quality >= MIN_QUALITY) {
            blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/jpeg', quality);
            });
            
            if (!blob) break;
            
            // Check if we're under the limit
            if (blob.size <= MAX_FILE_SIZE) break;
            
            // Reduce quality and try again
            quality -= 0.05;
          }
          
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          // If still too large, try reducing dimensions more aggressively
          if (blob.size > MAX_FILE_SIZE) {
            const scaleFactor = Math.sqrt(MAX_FILE_SIZE / blob.size) * 0.9; // 0.9 for safety margin
            canvas.width = Math.floor(width * scaleFactor);
            canvas.height = Math.floor(height * scaleFactor);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob(resolve, 'image/jpeg', MIN_QUALITY);
            });
            
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
          }
          
          // Convert blob to File
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, '.jpg'), // Change extension to .jpg
            { type: 'image/jpeg', lastModified: Date.now() }
          );
          
          resolve(compressedFile);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
