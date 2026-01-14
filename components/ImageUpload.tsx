'use client';

import { useState, useCallback, DragEvent } from 'react';
import { Upload, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { compressImageIfNeeded, formatFileSize } from '@/lib/image-compression';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB - must match server limit

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string | null;
  disabled?: boolean;
}

export default function ImageUpload({ onFileSelect, preview, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const validateAndSelectFile = useCallback(async (file: File) => {
    setError(null);
    setCompressionInfo(null);
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, or WebP)');
      return;
    }
    
    // Check if compression is needed
    if (file.size > MAX_FILE_SIZE) {
      setIsCompressing(true);
      try {
        const result = await compressImageIfNeeded(file);
        
        if (result.wasCompressed) {
          setCompressionInfo(
            `Compressed from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.finalSize)}`
          );
          
          // Check if compression was successful enough
          if (result.finalSize > MAX_FILE_SIZE) {
            setError(`Image still too large after compression (${formatFileSize(result.finalSize)}). Please use a smaller image.`);
            setIsCompressing(false);
            return;
          }
          
          onFileSelect(result.file);
        } else {
          onFileSelect(result.file);
        }
      } catch (err) {
        console.error('Compression error:', err);
        setError('Failed to compress image. Please try a different image.');
      } finally {
        setIsCompressing(false);
      }
    } else {
      // File is already small enough
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isCompressing) setIsDragging(true);
  }, [disabled, isCompressing]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isCompressing) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  }, [validateAndSelectFile, disabled, isCompressing]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled && !isCompressing) {
      validateAndSelectFile(file);
    }
  }, [validateAndSelectFile, disabled, isCompressing]);

  const openFilePicker = () => {
    if (!disabled && !isCompressing) {
      document.getElementById('file-input')?.click();
    }
  };
  
  const isDisabled = disabled || isCompressing;

  // Show preview when image is selected
  if (preview) {
    return (
      <div className="space-y-3 animate-in fade-in duration-200">
        <div 
          className={cn(
            "relative group cursor-pointer rounded-xl overflow-hidden bg-muted/20 border border-border/50",
            "transition-all duration-200 hover:border-border",
            isDisabled && "opacity-50 cursor-not-allowed"
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
        
        {compressionInfo && (
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
            <span>✓ {compressionInfo}</span>
          </div>
        )}
        
        <p className="text-center text-sm text-muted-foreground">
          Click image to replace
        </p>
        
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          disabled={isDisabled}
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
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Upload icon or loading spinner */}
          <div 
            className={cn(
              "rounded-2xl p-4 transition-all duration-200",
              isCompressing ? "bg-primary/10" : isDragging ? "bg-primary/20 scale-110" : "bg-muted/50"
            )}
          >
            {isCompressing ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <Upload className={cn(
                "w-8 h-8 transition-colors duration-200",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-base font-medium text-foreground">
              {isCompressing ? 'Compressing image...' : 'Drop your product image here'}
            </p>
            {!isCompressing && (
              <p className="text-sm text-muted-foreground">
                or <span className="text-primary font-medium cursor-pointer hover:underline">browse</span> to upload
              </p>
            )}
          </div>
          
          {!isCompressing && (
            <p className="text-xs text-muted-foreground/80">
              JPEG, PNG, or WebP • Max 4MB • Large images auto-compressed
            </p>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
      
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={isDisabled}
        className="hidden"
        aria-label="Upload image file"
      />
    </div>
  );
}
