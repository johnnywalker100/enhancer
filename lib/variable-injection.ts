import { Preset, VariableValues } from './types';

/**
 * Injects variable values into a JSON template.
 * Supports two modes:
 * 1. Placeholder mode: {{var_name}} strings
 * 2. JSONPath mode: patch operations (not implemented yet, but structure ready)
 */

export function injectVariables(
  preset: Preset,
  variables: VariableValues
): any {
  const template = JSON.parse(JSON.stringify(preset.prompt_template_json)); // Deep clone
  
  if (preset.injection_mode === 'placeholder') {
    return injectPlaceholders(template, variables, preset.variables_schema);
  } else if (preset.injection_mode === 'jsonpath') {
    if (!preset.jsonpath_patches || preset.jsonpath_patches.length === 0) {
      throw new Error('JSONPath injection mode requires preset.jsonpath_patches');
    }
    return applyJsonPathPatches(template, variables, preset);
  } else {
    // Default to placeholder mode
    return injectPlaceholders(template, variables, preset.variables_schema);
  }
}

function injectPlaceholders(
  obj: any,
  variables: VariableValues,
  schema: Preset['variables_schema']
): any {
  if (typeof obj === 'string') {
    // Replace {{var}} placeholders
    return obj.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      if (varName in variables) {
        return variables[varName];
      }
      // Check if it's required
      const varSchema = schema.find(v => v.key === varName);
      if (varSchema?.required) {
        throw new Error(`Required variable '${varName}' is missing`);
      }
      // Return default or empty string
      return varSchema?.default ?? '';
    });
  } else if (Array.isArray(obj)) {
    return obj.map(item => injectPlaceholders(item, variables, schema));
  } else if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = injectPlaceholders(value, variables, schema);
    }
    return result;
  }
  return obj;
}

export function validateVariables(
  preset: Preset,
  variables: VariableValues
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const varSchema of preset.variables_schema) {
    const value = variables[varSchema.key];
    
    if (varSchema.required && (value === undefined || value === null || value === '')) {
      errors.push(`Required variable '${varSchema.label}' (${varSchema.key}) is missing`);
      continue;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      // Type validation
      if (varSchema.type === 'number' || varSchema.type === 'slider') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`Variable '${varSchema.label}' must be a number`);
        } else {
          if (varSchema.min !== undefined && num < varSchema.min) {
            errors.push(`Variable '${varSchema.label}' must be >= ${varSchema.min}`);
          }
          if (varSchema.max !== undefined && num > varSchema.max) {
            errors.push(`Variable '${varSchema.label}' must be <= ${varSchema.max}`);
          }
        }
      } else if (varSchema.type === 'boolean') {
        if (typeof value !== 'boolean') {
          errors.push(`Variable '${varSchema.label}' must be a boolean`);
        }
      } else if (varSchema.type === 'select') {
        const validValues = varSchema.options?.map(o => o.value) || [];
        if (!validValues.includes(value)) {
          errors.push(`Variable '${varSchema.label}' must be one of: ${validValues.join(', ')}`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

function applyJsonPathPatches(obj: any, variables: VariableValues, preset: Preset): any {
  const out = obj;
  for (const patch of preset.jsonpath_patches || []) {
    if (patch.op !== 'set') continue;
    if (!(patch.var in variables)) {
      const varSchema = preset.variables_schema.find(v => v.key === patch.var);
      if (varSchema?.required) {
        throw new Error(`Required variable '${patch.var}' is missing`);
      }
      // If not provided, skip patch (or use default if present)
      if (varSchema?.default !== undefined) {
        setBySimpleJsonPath(out, patch.path, varSchema.default);
      }
      continue;
    }
    setBySimpleJsonPath(out, patch.path, variables[patch.var]);
  }
  return out;
}

/**
 * Minimal JSONPath setter supporting paths like:
 * - $.a.b.c
 * - $.a.b[0].c
 * This is intentionally small and deterministic for MVP.
 */
function setBySimpleJsonPath(root: any, path: string, value: any) {
  if (!path.startsWith('$.')) {
    throw new Error(`Unsupported JSONPath '${path}'. Must start with '$.'`);
  }

  const tokens: Array<string | number> = [];
  const re = /(?:\.([a-zA-Z0-9_]+))|(?:\[(\d+)\])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[1]) tokens.push(m[1]);
    else if (m[2]) tokens.push(Number(m[2]));
  }
  if (tokens.length === 0) throw new Error(`Invalid JSONPath '${path}'`);

  let cur: any = root;
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i];
    const next = tokens[i + 1];
    if (typeof t === 'number') {
      if (!Array.isArray(cur)) throw new Error(`JSONPath '${path}' expected array at [${t}]`);
      if (cur[t] === undefined) {
        cur[t] = typeof next === 'number' ? [] : {};
      }
      cur = cur[t];
    } else {
      if (cur[t] === undefined) {
        cur[t] = typeof next === 'number' ? [] : {};
      }
      cur = cur[t];
    }
  }

  const last = tokens[tokens.length - 1];
  if (typeof last === 'number') {
    if (!Array.isArray(cur)) throw new Error(`JSONPath '${path}' expected array at final index`);
    cur[last] = value;
  } else {
    cur[last] = value;
  }
}
