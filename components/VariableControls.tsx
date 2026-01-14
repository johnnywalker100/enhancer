'use client';

import { Preset, VariableValues, VariableSchema } from '@/lib/types';

interface VariableControlsProps {
  preset: Preset;
  variables: VariableValues;
  onChange: (key: string, value: any) => void;
}

export default function VariableControls({ preset, variables, onChange }: VariableControlsProps) {
  const renderControl = (varSchema: VariableSchema) => {
    const value = variables[varSchema.key] ?? varSchema.default;
    const key = varSchema.key;

    switch (varSchema.type) {
      case 'color':
        return (
          <div key={key} className="form-group">
            <label className="form-label">{varSchema.label}</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(key, e.target.value)}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />
              <input
                type="text"
                className="form-input"
                value={value || ''}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder="#000000"
                style={{ flex: 1 }}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={key} className="form-group">
            <label className="form-label">{varSchema.label}</label>
            <input
              type="text"
              className="form-input"
              value={value || ''}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={varSchema.default ? String(varSchema.default) : ''}
            />
          </div>
        );

      case 'number':
        return (
          <div key={key} className="form-group">
            <label className="form-label">
              {varSchema.label}
              {varSchema.min !== undefined && varSchema.max !== undefined && (
                <span style={{ color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                  ({varSchema.min} - {varSchema.max})
                </span>
              )}
            </label>
            <input
              type="number"
              className="form-input"
              value={value ?? varSchema.default ?? ''}
              onChange={(e) => onChange(key, Number(e.target.value))}
              min={varSchema.min}
              max={varSchema.max}
              step={varSchema.step}
            />
          </div>
        );

      case 'slider':
        return (
          <div key={key} className="form-group">
            <label className="form-label">
              {varSchema.label}: {value ?? varSchema.default ?? 0}
              {varSchema.min !== undefined && varSchema.max !== undefined && (
                <span style={{ color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                  ({varSchema.min} - {varSchema.max})
                </span>
              )}
            </label>
            <input
              type="range"
              className="form-slider"
              value={value ?? varSchema.default ?? 0}
              onChange={(e) => onChange(key, Number(e.target.value))}
              min={varSchema.min ?? 0}
              max={varSchema.max ?? 100}
              step={varSchema.step ?? 1}
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                className="form-checkbox"
                checked={value ?? varSchema.default ?? false}
                onChange={(e) => onChange(key, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              <span className="form-label" style={{ margin: 0 }}>
                {varSchema.label}
              </span>
            </label>
          </div>
        );

      case 'select':
        return (
          <div key={key} className="form-group">
            <label className="form-label">{varSchema.label}</label>
            <select
              className="form-select"
              value={value ?? varSchema.default ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
            >
              {varSchema.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {preset.variables_schema.map((varSchema) => renderControl(varSchema))}
    </div>
  );
}
