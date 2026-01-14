// Upload validation utilities (no filesystem operations for Vercel compatibility)

const maxFileSize = 10 * 1024 * 1024; // 10MB

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
    throw new Error(`File too large: ${file.size} bytes. Max: ${maxFileSize} bytes`);
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
