'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

// Preset colors to display
const PRESET_COLORS = [
  '#ffffff', // white
  '#f5f5f5', // light gray
  '#e0e0e0', // gray
  '#c0c0c0', // medium gray
  '#4397EB', // blue
  '#2563eb', // darker blue
  '#000000', // black
  '#16a34a', // green
  '#dc2626', // red
];

export function ColorPicker({ value, onChange, disabled, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexInput(newValue);
    
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setHexInput(color);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Color Display Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-12 rounded-xl border-2 border-border flex items-center gap-3 px-4",
          "transition-all duration-200",
          "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-primary ring-2 ring-primary/20"
        )}
      >
        {/* Color Swatch */}
        <div 
          className="w-8 h-8 rounded-lg border-2 border-border shadow-sm flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        
        {/* Color Value */}
        <span className="text-sm font-medium text-foreground flex-1 text-left">
          {value.toUpperCase()}
        </span>
        
        {/* Pipette Icon */}
        <Pipette className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Dropdown Picker */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-border rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Hex Input */}
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Hex Color
            </label>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              className={cn(
                "w-full h-10 px-3 rounded-lg border-2 border-border",
                "text-sm font-mono text-foreground",
                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200"
              )}
              placeholder="#000000"
              maxLength={7}
            />
          </div>

          {/* Native Color Picker */}
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Pick a Color
            </label>
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setHexInput(e.target.value);
              }}
              className="w-full h-32 rounded-lg cursor-pointer border-2 border-border"
            />
          </div>

          {/* Preset Colors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground">
                Saved Colors
              </label>
            </div>
            <div className="grid grid-cols-9 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all duration-200",
                    "hover:scale-110 hover:shadow-md",
                    value.toLowerCase() === color.toLowerCase() 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
