'use client';

import { Preset, VariableValues, VariableSchema } from '@/lib/types';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { ColorPicker } from './ui/ColorPicker';
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

// Aspect ratio icon component
const AspectRatioIcon = ({ ratio }: { ratio: string }) => {
  const dimensions: Record<string, { width: number; height: number }> = {
    'auto': { width: 18, height: 18 },
    '1:1': { width: 18, height: 18 },
    '4:3': { width: 20, height: 15 },
    '16:9': { width: 24, height: 13.5 },
    '21:9': { width: 26, height: 11 },
    '5:4': { width: 20, height: 16 },
    '3:2': { width: 21, height: 14 },
    '2:3': { width: 14, height: 21 },
    '9:16': { width: 13.5, height: 24 },
    '3:4': { width: 15, height: 20 },
    '4:5': { width: 16, height: 20 },
  };

  const dim = dimensions[ratio] || { width: 18, height: 18 };

  // Auto gets a special icon with dashed border
  if (ratio === 'auto') {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <div 
          className="border-2 border-dashed border-current opacity-60"
          style={{ width: dim.width, height: dim.height }}
        />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <div 
        className="border-[2.5px] border-current"
        style={{ width: dim.width, height: dim.height }}
      />
    </div>
  );
};

const ASPECT_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto (Original)', icon: <AspectRatioIcon ratio="auto" /> },
  { value: '1:1', label: '1:1 Square', icon: <AspectRatioIcon ratio="1:1" /> },
  { value: '16:9', label: '16:9 Landscape', icon: <AspectRatioIcon ratio="16:9" /> },
  { value: '4:3', label: '4:3 Landscape', icon: <AspectRatioIcon ratio="4:3" /> },
  { value: '3:2', label: '3:2 Landscape', icon: <AspectRatioIcon ratio="3:2" /> },
  { value: '5:4', label: '5:4 Landscape', icon: <AspectRatioIcon ratio="5:4" /> },
  { value: '21:9', label: '21:9 Ultrawide', icon: <AspectRatioIcon ratio="21:9" /> },
  { value: '9:16', label: '9:16 Portrait', icon: <AspectRatioIcon ratio="9:16" /> },
  { value: '4:5', label: '4:5 Portrait', icon: <AspectRatioIcon ratio="4:5" /> },
  { value: '3:4', label: '3:4 Portrait', icon: <AspectRatioIcon ratio="3:4" /> },
  { value: '2:3', label: '2:3 Portrait', icon: <AspectRatioIcon ratio="2:3" /> },
];

// Mapping for improved labels and helper text
const SETTING_INFO: Record<string, { label: string; helper: string }> = {
  background_color: {
    label: 'Background Color',
    helper: 'Choose the background color for your product photo.',
  },
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

    if (varSchema.type === 'color') {
      return (
        <div 
          key={key} 
          className="pb-5 border-b border-border/40 last:border-0 last:pb-0 first:pt-0 animate-in fade-in duration-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <label className="text-sm font-semibold text-foreground block mb-1.5">
            {settingInfo.label || varSchema.label}
          </label>
          {settingInfo.helper && (
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {settingInfo.helper}
            </p>
          )}
          <ColorPicker
            value={value ?? varSchema.default ?? '#ffffff'}
            onChange={(newValue) => onChange(key, newValue)}
            disabled={disabled}
          />
        </div>
      );
    }

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
        <div className="pb-5 border-b border-border/40">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10">
              <Ratio className="w-3.5 h-3.5 text-primary" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Output Dimensions
            </label>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Choose the output image aspect ratio. Auto keeps the original proportions.
          </p>
          <Select
            value={aspectRatio}
            onValueChange={onAspectRatioChange}
            options={ASPECT_RATIO_OPTIONS}
            disabled={disabled}
            placeholder="Select aspect ratio"
          />
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
