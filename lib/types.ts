// Variable schema types
export type VariableType = 'color' | 'text' | 'number' | 'boolean' | 'select' | 'slider';

export interface VariableSchema {
  key: string;
  type: VariableType;
  label: string;
  default?: any;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: any }>;
}

export interface FalDefaults {
  output_format?: 'png' | 'jpeg' | 'webp';
  resolution?: '1K' | '2K' | '4K';
  num_images?: number;
  aspect_ratio?: string;
  [key: string]: any;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  prompt_template_json: any; // The user's JSON prompt template
  variables_schema: VariableSchema[];
  fal_defaults?: FalDefaults;
  injection_mode?: 'placeholder' | 'jsonpath'; // How to inject variables
  /**
   * For injection_mode === 'jsonpath':
   * A list of patch operations that deterministically set values in the JSON.
   */
  jsonpath_patches?: Array<{
    op: 'set';
    path: string; // e.g. $.optional_modifiers.soft_shadow_beneath_product
    var: string; // variable key
  }>;
  compiler_rules?: CompilerRules; // How to convert JSON to fal prompt
}

export interface CompilerRules {
  // If prompt_template_json contains a field like 'fal.prompt', use it directly
  use_fal_prompt_field?: boolean;
  fal_prompt_field_path?: string; // e.g., 'fal.prompt'
  
  // Or stringify the JSON with a wrapper
  stringify_with_wrapper?: boolean;
  wrapper_template?: string; // e.g., "Use this JSON spec exactly:\n<json>"
  
  // Or map fields to natural language (only if explicitly defined)
  field_mappings?: Record<string, string>; // JSON field -> prompt instruction

  /**
   * If true, compiler must NOT guess/fallback; it must follow explicit rules
   * and throw if they are insufficient.
   */
  strict?: boolean;
}

export interface VariableValues {
  [key: string]: any;
}
