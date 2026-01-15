'use client';

import * as React from 'react';
import { Preset, VariableValues, VariableSchema } from '@/lib/types';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { ColorPicker } from './ui/ColorPicker';
import { Tooltip } from './ui/Tooltip';
import { cn } from '@/lib/utils';
import { Sparkles, RotateCcw, Ratio, Maximize, Palette, Info } from 'lucide-react';

interface VariableControlsProps {
  preset: Preset;
  variables: VariableValues;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  disabled?: boolean;
  aspectRatio?: string;
  onAspectRatioChange?: (value: string) => void;
  resolution?: string;
  onResolutionChange?: (value: string) => void;
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
          className="border-2 border-dashed border-current opacity-60 rounded-[1px]"
          style={{ width: dim.width, height: dim.height }}
        />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <div 
        className="border-[2.5px] border-current rounded-[1px]"
        style={{ width: dim.width, height: dim.height }}
      />
    </div>
  );
};

const ASPECT_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto', icon: <AspectRatioIcon ratio="auto" /> },
  { value: '1:1', label: '1:1 Square', icon: <AspectRatioIcon ratio="1:1" /> },
  { value: '16:9', label: '16:9', icon: <AspectRatioIcon ratio="16:9" /> },
  { value: '9:16', label: '9:16', icon: <AspectRatioIcon ratio="9:16" /> },
  { value: '4:5', label: '4:5', icon: <AspectRatioIcon ratio="4:5" /> },
  { value: '4:3', label: '4:3', icon: <AspectRatioIcon ratio="4:3" /> },
  { value: '3:2', label: '3:2', icon: <AspectRatioIcon ratio="3:2" /> },
  { value: '3:4', label: '3:4', icon: <AspectRatioIcon ratio="3:4" /> },
  { value: '2:3', label: '2:3', icon: <AspectRatioIcon ratio="2:3" /> },
  { value: '21:9', label: '21:9', icon: <AspectRatioIcon ratio="21:9" /> },
  { value: '5:4', label: '5:4', icon: <AspectRatioIcon ratio="5:4" /> },
];

// Simplified labels with tooltips
const SETTING_INFO: Record<string, { label: string; tooltip: string }> = {
  background_color: {
    label: 'Background',
    tooltip: 'Choose the background color for your product photo',
  },
  soft_shadow_beneath_product: {
    label: 'Contact Shadow',
    tooltip: 'Adds a soft grounding shadow under the product',
  },
  floating_product_with_drop_shadow: {
    label: 'Floating Look',
    tooltip: 'Makes the product appear lifted with a drop shadow',
  },
  luxury_brand_aesthetic: {
    label: 'Premium Finish',
    tooltip: 'Richer highlights and deeper contrast for a high-end look',
  },
  ecommerce_ready: {
    label: 'Marketplace Clean',
    tooltip: 'Neutral color and clean edges optimized for e-commerce',
  },
  minimal_apple_style_lighting: {
    label: 'Minimal Studio',
    tooltip: 'Even lighting and smooth highlights for a clean product-page feel',
  },
};

export default function VariableControls({ 
  preset, 
  variables, 
  onChange, 
  onReset, 
  disabled,
  aspectRatio = 'auto',
  onAspectRatioChange,
  resolution = '2K',
  onResolutionChange
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

  // Separate variables by type
  const colorVariables = preset.variables_schema.filter(v => v.type === 'color');
  const booleanVariables = preset.variables_schema.filter(v => v.type === 'boolean');

  return (
    <div className="space-y-6">
      {/* SIZE & RATIO GROUP */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Maximize className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Size & Ratio</h3>
        </div>

        {/* Resolution */}
        {onResolutionChange && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-sm font-medium text-foreground">Resolution</label>
              <Tooltip content="Higher resolution = better quality but slower" side="top">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1K', '2K', '4K'].map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => onResolutionChange(res)}
                  disabled={disabled}
                  className={cn(
                    "relative px-3 py-2.5 rounded-lg border-2 transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    resolution === res
                      ? "border-primary bg-primary/10 font-semibold text-foreground"
                      : "border-border/50 text-muted-foreground font-medium"
                  )}
                >
                  <div className="text-center">
                    <div className={cn("text-base font-bold", resolution === res ? "text-foreground" : "text-foreground/70")}>
                      {res}
                    </div>
                    <div className="text-[9px] mt-0.5 uppercase tracking-wider">
                      {res === '1K' && 'Fast'}
                      {res === '2K' && 'Balanced'}
                      {res === '4K' && 'Best'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        {onAspectRatioChange && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="text-sm font-medium text-foreground">Aspect Ratio</label>
              <Tooltip content="Auto keeps original proportions" side="top">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </Tooltip>
            </div>
            <Select
              value={aspectRatio}
              onValueChange={onAspectRatioChange}
              options={ASPECT_RATIO_OPTIONS}
              disabled={disabled}
              placeholder="Select aspect ratio"
            />
          </div>
        )}
      </div>

      {/* APPEARANCE GROUP */}
      <div className="space-y-4 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Palette className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Appearance</h3>
        </div>

        {/* Background Color */}
        {colorVariables.map((varSchema) => {
          const value = variables[varSchema.key] ?? varSchema.default;
          const settingInfo = SETTING_INFO[varSchema.key] || { label: varSchema.label, tooltip: '' };
          
          return (
            <div key={varSchema.key}>
              <div className="flex items-center gap-1.5 mb-2">
                <label className="text-sm font-medium text-foreground">
                  {settingInfo.label}
                </label>
                {settingInfo.tooltip && (
                  <Tooltip content={settingInfo.tooltip} side="top">
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </Tooltip>
                )}
              </div>
              <ColorPicker
                value={value ?? varSchema.default ?? '#ffffff'}
                onChange={(newValue) => onChange(varSchema.key, newValue)}
                disabled={disabled}
              />
            </div>
          );
        })}

        {/* Look & Finish Presets */}
        {booleanVariables.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <label className="text-sm font-medium text-foreground">Look & Finish</label>
              <Tooltip content="Enhance lighting and style without changing the product" side="top">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </Tooltip>
            </div>
            <div className="space-y-2.5">
              {booleanVariables.map((varSchema) => {
                const value = variables[varSchema.key] ?? varSchema.default;
                const settingInfo = SETTING_INFO[varSchema.key] || { label: varSchema.label, tooltip: '' };
                
                return (
                  <div 
                    key={varSchema.key}
                    className={cn(
                      "flex items-center justify-between gap-3 p-3 rounded-lg border transition-all duration-200",
                      value 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-muted/30 border-border/50 hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <label 
                        htmlFor={varSchema.key}
                        className={cn(
                          "text-sm font-medium cursor-pointer transition-colors",
                          value ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {settingInfo.label}
                      </label>
                      {settingInfo.tooltip && (
                        <Tooltip content={settingInfo.tooltip} side="top">
                          <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        </Tooltip>
                      )}
                    </div>
                    <Switch
                      id={varSchema.key}
                      checked={value ?? varSchema.default ?? false}
                      onCheckedChange={(checked) => handleToggle(varSchema.key, checked)}
                      disabled={disabled}
                      aria-label={settingInfo.label}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {onReset && (
        <div className="pt-2 border-t border-border/50">
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground",
              "hover:text-foreground transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all settings
          </button>
        </div>
      )}
    </div>
  );
}
