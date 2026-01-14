import fs from 'fs';
import path from 'path';

const uploadDir = process.env.UPLOAD_DIR || './public/uploads';
const maxFileSize = 10 * 1024 * 1024; // 10MB

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

export async function handleFileUpload(file: File): Promise<UploadedFile> {
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
  
  // Save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filepath = path.join(uploadDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  
  return {
    filepath,
    originalFilename: file.name,
    mimetype: file.type,
    size: file.size,
  };
}

export function getPublicUrl(filepath: string): string {
  const filename = path.basename(filepath);
  return `/uploads/${filename}`;
}
