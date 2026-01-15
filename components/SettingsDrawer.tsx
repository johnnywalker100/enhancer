'use client';

import * as React from 'react';
import { Preset, VariableValues } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Settings, ChevronDown, Info } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/Accordion';
import { Tooltip } from './ui/Tooltip';

interface SettingsDrawerProps {
  preset: Preset;
  variables: VariableValues;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  disabled?: boolean;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  resolution: string;
  onResolutionChange: (value: string) => void;
  children: React.ReactNode; // The detailed controls (from VariableControls)
}

export function SettingsDrawer({
  preset,
  variables,
  aspectRatio,
  resolution,
  disabled,
  children,
}: SettingsDrawerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Get background color value
  const backgroundColor = variables.background_color || '#ffffff';
  
  // Get active look & finish options
  const activeLooks = preset.variables_schema
    .filter(v => v.type === 'boolean' && variables[v.key])
    .map(v => {
      const labels: Record<string, string> = {
        soft_shadow_beneath_product: 'Contact Shadow',
        floating_product_with_drop_shadow: 'Floating',
        luxury_brand_aesthetic: 'Premium',
        ecommerce_ready: 'Marketplace',
        minimal_apple_style_lighting: 'Minimal',
      };
      return labels[v.key] || v.label;
    });

  const lookSummary = activeLooks.length > 0 ? activeLooks.join(', ') : 'None';

  // Format aspect ratio for display
  const aspectRatioDisplay = aspectRatio === 'auto' ? 'Auto' : aspectRatio;

  return (
    <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header / Collapsed Summary */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={cn(
          'w-full px-6 py-4 flex items-center justify-between',
          'hover:bg-secondary/30 transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-foreground">Settings</h3>
            {!isExpanded && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {resolution} • {aspectRatioDisplay} • {lookSummary}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="pt-6 space-y-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
