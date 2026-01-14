'use client';

import { useState, useCallback, DragEvent } from 'react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string | null;
}

export default function ImageUpload({ onFileSelect, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div>
      <div
        className={`upload-area ${isDragging ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {preview ? (
          <div>
            <img src={preview} alt="Preview" className="image-preview" />
            <p style={{ marginTop: '12px', color: '#666' }}>
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>
              📸 Drag and drop your image here
            </p>
            <p style={{ color: '#666' }}>or click to browse</p>
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#999' }}>
              Supports: JPEG, PNG, WebP (max 10MB)
            </p>
          </div>
        )}
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
}
