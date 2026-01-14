'use client';

import { Preset, VariableValues, VariableSchema } from '@/lib/types';
import { Switch } from './ui/Switch';
import { Sparkles } from 'lucide-react';

interface VariableControlsProps {
  preset: Preset;
  variables: VariableValues;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
}

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
    helper: 'Slightly richer contrast and controlled highlights for a high-end look.',
  },
  ecommerce_ready: {
    label: 'Listing Ready (Marketplace Clean)',
    helper: 'Neutral color, clean edges, simple background for e-commerce listings.',
  },
  minimal_apple_style_lighting: {
    label: 'Minimal Soft Studio (Tech-Ad Look)',
    helper: 'Even, soft lighting with smooth highlights and a minimal feel.',
  },
};

export default function VariableControls({ preset, variables, onChange, disabled }: VariableControlsProps) {
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

  const renderControl = (varSchema: VariableSchema) => {
    const value = variables[varSchema.key] ?? varSchema.default;
    const key = varSchema.key;
    const settingInfo = SETTING_INFO[key] || { label: varSchema.label, helper: '' };

    if (varSchema.type === 'boolean') {
      return (
        <div key={key} className="space-y-2 py-3 border-b border-gray-100 last:border-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label htmlFor={key} className="text-sm font-medium text-gray-900 cursor-pointer">
                {settingInfo.label}
              </label>
              {settingInfo.helper && (
                <p className="text-xs text-gray-600 mt-1">{settingInfo.helper}</p>
              )}
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

    // Handle other types if needed (for future extensibility)
    return null;
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-gray-600" />
        <h3 className="text-base font-semibold text-gray-900">Look & Finish</h3>
      </div>
      <p className="text-xs text-gray-600 mb-4">
        Edits lighting and background only. Product shape and branding are preserved.
      </p>
      <div className="space-y-0">
        {preset.variables_schema.map((varSchema) => renderControl(varSchema))}
      </div>
    </div>
  );
}
