'use client';

import { Preset, VariableValues, VariableSchema } from '@/lib/types';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { cn } from '@/lib/utils';
import { Sparkles, RotateCcw, Ratio } from 'lucide-react';

interface VariableControlsProps {
  preset: Preset;
  variables: VariableValues;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  disabled?: boolean;
  aspectRatio?: string;
  onAspectRatioChange?: (value: string) => void;
}

const ASPECT_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:3', label: '4:3' },
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '21:9', label: '21:9 (Ultrawide)' },
  { value: '5:4', label: '5:4' },
  { value: '3:2', label: '3:2' },
  { value: '2:3', label: '2:3 (Portrait)' },
  { value: '9:16', label: '9:16 (Vertical)' },
  { value: '3:4', label: '3:4' },
  { value: '4:5', label: '4:5' },
];

// Mapping for improved labels and helper text
const SETTING_INFO: Record<string, { label: string; helper: string }> = {
  soft_shadow_beneath_product: {
    label: 'Contact Shadow (Subtle)',
    helper: 'Adds a soft grounding shadow under the product.',
  },
  floating_product_with_drop_shadow: {
    label: 'Floating Look (Drop Shadow)',
    helper: 'Makes the product appear lifted with a defined drop shadow.',
  },
  luxury_brand_aesthetic: {
    label: 'Premium Lighting & Contrast',
    helper: 'Richer highlights and deeper contrast for a high-end look.',
  },
  ecommerce_ready: {
    label: 'Listing Ready (Marketplace Clean)',
    helper: 'Neutral color, clean edges, simple background for e-commerce.',
  },
  minimal_apple_style_lighting: {
    label: 'Minimal Soft Studio (Tech-Ad Look)',
    helper: 'Even lighting and smooth highlights for a minimal product-page feel.',
  },
};

export default function VariableControls({ 
  preset, 
  variables, 
  onChange, 
  onReset, 
  disabled,
  aspectRatio = 'auto',
  onAspectRatioChange
}: VariableControlsProps) {
  const handleToggle = (key: string, checked: boolean) => {
    // Mutual exclusivity: if enabling floating shadow, disable contact shadow and vice versa
    if (key === 'floating_product_with_drop_shadow' && checked) {
      onChange('soft_shadow_beneath_product', false);
    }
    if (key === 'soft_shadow_beneath_product' && checked) {
      onChange('floating_product_with_drop_shadow', false);
    }
    onChange(key, checked);
  };

  const renderControl = (varSchema: VariableSchema, index: number) => {
    const value = variables[varSchema.key] ?? varSchema.default;
    const key = varSchema.key;
    const settingInfo = SETTING_INFO[key] || { label: varSchema.label, helper: '' };

    if (varSchema.type === 'boolean') {
      return (
        <div 
          key={key} 
          className="py-4 border-b border-border/40 last:border-0 last:pb-0 first:pt-0 animate-in fade-in duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <label 
                htmlFor={key} 
                className={cn(
                  "text-sm font-medium cursor-pointer leading-tight transition-colors duration-200",
                  value ? "text-foreground" : "text-foreground/80"
                )}
              >
                {settingInfo.label}
              </label>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {settingInfo.helper}
              </p>
            </div>
            <Switch
              id={key}
              checked={value ?? varSchema.default ?? false}
              onCheckedChange={(checked) => handleToggle(key, checked)}
              disabled={disabled}
              aria-label={settingInfo.label}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Look & Finish</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Lighting & background only. Product shape and branding are preserved.
        </p>
      </div>

      {/* Aspect Ratio Selector */}
      {onAspectRatioChange && (
        <div className="pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <Ratio className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Aspect Ratio
            </label>
          </div>
          <Select
            value={aspectRatio}
            onValueChange={onAspectRatioChange}
            options={ASPECT_RATIO_OPTIONS}
            disabled={disabled}
            placeholder="Select aspect ratio"
          />
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Choose the output image dimensions. Auto maintains original aspect ratio.
          </p>
        </div>
      )}

      {/* Controls */}
      <div>
        {preset.variables_schema.map((varSchema, index) => renderControl(varSchema, index))}
      </div>

      {/* Reset Button */}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 text-xs text-muted-foreground",
            "hover:text-foreground transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <RotateCcw className="w-3 h-3" />
          Reset to defaults
        </button>
      )}
    </div>
  );
}
