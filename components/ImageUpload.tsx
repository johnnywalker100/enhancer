'use client';

import { useState, useCallback, DragEvent } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string | null;
  disabled?: boolean;
}

export default function ImageUpload({ onFileSelect, preview, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) {
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  return (
    <div>
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${preview ? 'p-4' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        {preview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-w-full max-h-64 rounded-lg mx-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-600">
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="rounded-full bg-gray-100 p-3">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div>
              <p className="text-base font-medium text-gray-900 mb-1">
                Drag and drop your image here
              </p>
              <p className="text-sm text-gray-600 mb-2">or click to browse</p>
              <p className="text-xs text-gray-500">
                Supports: JPEG, PNG, WebP (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
        className="hidden"
        aria-label="Upload image file"
      />
    </div>
  );
}
