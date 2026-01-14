'use client';

import * as React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

const DEFAULT_COLORS = [
  '#ffffff',
  '#f5f5f5',
  '#e0e0e0',
  '#c0c0c0',
  '#4397EB',
  '#2563eb',
  '#111827',
  '#16a34a',
  '#dc2626',
];

const STORAGE_KEY = 'colorpicker-saved-colors';

function normalizeHex(input: string) {
  let v = input.trim();
  if (!v.startsWith('#')) v = `#${v}`;
  return v;
}
function isValidHex6(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}

export function ColorPicker({ value, onChange, disabled, label }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [savedColors, setSavedColors] = React.useState<string[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  // Load saved colors from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedColors(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load saved colors:', e);
    }
  }, []);

  React.useEffect(() => setDraft(value), [value]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const setColor = (hex: string) => {
    const v = normalizeHex(hex);
    setDraft(v);
    if (isValidHex6(v)) onChange(v);
  };

  const addCurrentColor = () => {
    if (!isValidHex6(value)) return;
    const normalized = value.toLowerCase();
    
    // Check if color already exists in saved or default colors
    if (savedColors.includes(normalized) || DEFAULT_COLORS.map(c => c.toLowerCase()).includes(normalized)) {
      return;
    }

    const newSaved = [...savedColors, normalized];
    setSavedColors(newSaved);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
    } catch (e) {
      console.error('Failed to save color:', e);
    }
  };

  // Combine default and saved colors
  const allColors = [...DEFAULT_COLORS, ...savedColors];

  return (
    <div className="w-full" ref={ref}>
      {label ? (
        <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
      ) : null}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'w-full h-11 rounded-xl border bg-background px-3',
          'flex items-center gap-3',
          'transition focus:outline-none focus:ring-2 focus:ring-primary/20',
          open ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/60',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className="h-6 w-6 rounded-md border border-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <span className="flex-1 text-left text-sm font-medium text-foreground">
          {value.toUpperCase()}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition', open && 'rotate-180')} />
      </button>

      {/* Popover */}
      {open && (
        <div
          className={cn(
            'mt-2 w-full rounded-2xl border border-border bg-background shadow-xl',
            'p-4',
            'animate-in fade-in slide-in-from-top-2 duration-150'
          )}
        >
          {/* Picker row */}
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-border p-3">
              <HexColorPicker color={isValidHex6(value) ? value : '#000000'} onChange={setColor} />
              {/* Make react-colorful fit your UI */}
              <style jsx global>{`
                .react-colorful {
                  width: 100%;
                  height: 190px;
                }
                .react-colorful__saturation {
                  border-radius: 12px;
                }
                .react-colorful__hue {
                  height: 14px;
                  border-radius: 9999px;
                  margin-top: 12px;
                }
                .react-colorful__pointer {
                  width: 16px;
                  height: 16px;
                  border: 2px solid white;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
                }
              `}</style>
            </div>

            <div className="space-y-3">
              {/* Hex input */}
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Hex</div>
                <input
                  value={draft}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#000000"
                  maxLength={7}
                  className={cn(
                    'h-10 w-full rounded-xl border border-border bg-background px-3',
                    'text-sm font-mono text-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  )}
                />
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Format: #RRGGBB
                </div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">Recent Colors</div>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80 transition',
                  !isValidHex6(value) && 'opacity-50 cursor-not-allowed'
                )}
                onClick={addCurrentColor}
                disabled={!isValidHex6(value)}
                title="Add current color to recent colors"
              >
                <Plus className="h-3 w-3" />
                Add new color
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {allColors.map((c, idx) => {
                const active = value.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={`${c}-${idx}`}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'aspect-square w-full rounded-lg border transition',
                      'hover:scale-[1.06] hover:shadow-sm',
                      active ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    )}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="h-10 rounded-xl px-4 text-sm font-medium text-foreground hover:bg-muted transition"
              onClick={() => {
                setDraft(value);
                setOpen(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
