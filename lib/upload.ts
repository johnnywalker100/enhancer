// Upload validation utilities (no filesystem operations for Vercel compatibility)

// Vercel serverless functions have a ~4.5MB body limit on Hobby plan
// We set this slightly lower to account for form data overhead
const maxFileSize = 4 * 1024 * 1024; // 4MB

export interface ValidatedFile {
  buffer: Buffer;
  originalFilename: string;
  mimetype: string;
  size: number;
}

export async function validateAndReadFile(file: File): Promise<ValidatedFile> {
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  // Validate file size
  if (file.size > maxFileSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const maxMB = (maxFileSize / (1024 * 1024)).toFixed(0);
    throw new Error(`File too large (${sizeMB}MB). Maximum allowed is ${maxMB}MB. Please compress or resize your image.`);
  }
  
  // Read file into buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  return {
    buffer,
    originalFilename: file.name,
    mimetype: file.type,
    size: file.size,
  };
}
