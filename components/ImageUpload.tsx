'use client';

import { useState, useCallback, DragEvent } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const openFilePicker = () => {
    if (!disabled) {
      document.getElementById('file-input')?.click();
    }
  };

  // Show preview when image is selected
  if (preview) {
    return (
      <div className="space-y-3 animate-in fade-in duration-200">
        <div 
          className={cn(
            "relative group cursor-pointer rounded-xl overflow-hidden bg-muted/20 border border-border/50",
            "transition-all duration-200 hover:border-border",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={openFilePicker}
        >
          <img 
            src={preview} 
            alt="Selected product" 
            className="w-full max-h-64 object-contain"
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                <RefreshCw className="w-4 h-4" />
                Replace image
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Click image to replace
        </p>
        
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

  // Empty upload zone
  return (
    <div>
      <div
        className={cn(
          "upload-zone p-8 text-center cursor-pointer min-h-[180px] flex items-center justify-center",
          "transition-all duration-200",
          isDragging && "dragging",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Upload icon */}
          <div 
            className={cn(
              "rounded-2xl p-4 transition-all duration-200",
              isDragging ? "bg-primary/20 scale-110" : "bg-muted/50"
            )}
          >
            <Upload className={cn(
              "w-8 h-8 transition-colors duration-200",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="space-y-2">
            <p className="text-base font-medium text-foreground">
              Drop your product image here
            </p>
            <p className="text-sm text-muted-foreground">
              or <span className="text-primary font-medium cursor-pointer hover:underline">browse</span> to upload
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground/80">
            JPEG, PNG, or WebP • Max 10MB
          </p>
        </div>
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
