import { Preset, CompilerRules, FalDefaults } from './types';

export interface CompiledPrompt {
  prompt_string: string;
  fal_options: Record<string, any>;
}

/**
 * Compiles the final JSON prompt into fal.ai input format.
 * Follows compiler_rules from the preset to determine how to extract
 * the prompt string and fal options.
 */
export function compilePrompt(
  preset: Preset,
  finalPromptJson: any
): CompiledPrompt {
  const rules = preset.compiler_rules || {};
  const defaults = preset.fal_defaults || {};
  
  let prompt_string = '';
  const fal_options: Record<string, any> = { ...defaults };
  
  // Extract prompt string based on compiler rules
  if (rules.use_fal_prompt_field && rules.fal_prompt_field_path) {
    // Extract prompt from a specific field path (e.g., 'fal.prompt')
    const pathParts = rules.fal_prompt_field_path.split('.');
    let value: any = finalPromptJson;
    for (const part of pathParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        throw new Error(`Prompt field path '${rules.fal_prompt_field_path}' not found in compiled JSON`);
      }
    }
    prompt_string = String(value);
  } else if (rules.stringify_with_wrapper) {
    // Stringify entire JSON with a wrapper template
    const jsonString = JSON.stringify(finalPromptJson, null, 2);
    prompt_string = rules.wrapper_template
      ? rules.wrapper_template.replace('<json>', jsonString)
      : `Use this JSON spec exactly:\n${jsonString}`;
  } else if (rules.field_mappings) {
    // Map specific fields to natural language (if explicitly defined)
    const parts: string[] = [];
    for (const [field, instruction] of Object.entries(rules.field_mappings)) {
      const value = getNestedValue(finalPromptJson, field);
      if (value !== undefined) {
        parts.push(`${instruction}: ${value}`);
      }
    }
    prompt_string = parts.join('\n');
  } else {
    if (rules.strict) {
      throw new Error('Compiler rules are strict but no prompt extraction mode was configured.');
    }
    // Non-strict fallback (kept for backwards compatibility)
    if (finalPromptJson.fal?.prompt) prompt_string = String(finalPromptJson.fal.prompt);
    else prompt_string = JSON.stringify(finalPromptJson);
  }
  
  // Deterministic fal options:
  // - If you want values to flow from JSON -> fal options, put them in preset.fal_defaults
  //   or pass them as variables that you then merge into fal_defaults upstream.
  // - We do NOT guess options from arbitrary JSON unless non-strict.
  if (!rules.strict) {
    // Non-strict legacy behavior: pull common fields if present
    if (finalPromptJson.fal) {
      const falData = finalPromptJson.fal;
      if (falData.output_format) fal_options.output_format = falData.output_format;
      if (falData.resolution) fal_options.resolution = falData.resolution;
      if (falData.num_images) fal_options.num_images = falData.num_images;
      if (falData.aspect_ratio) fal_options.aspect_ratio = falData.aspect_ratio;
      for (const [key, value] of Object.entries(falData)) {
        if (!['prompt'].includes(key)) fal_options[key] = value;
      }
    }
  }
  
  return {
    prompt_string,
    fal_options,
  };
}

function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.');
  let value: any = obj;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return value;
}
