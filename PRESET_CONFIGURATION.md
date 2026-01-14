# Preset Configuration Guide

This guide explains how to add your own JSON prompt templates to the application.

## File Location

**Edit this file:** `lib/presets.ts`

This is where you define all your presets with their JSON prompt templates, variable schemas, and compiler rules.

## Preset Structure

Each preset is an object with the following structure:

```typescript
{
  id: string;                    // Unique identifier (e.g., 'studio-gray')
  name: string;                  // Display name (e.g., 'Studio Gray')
  description: string;           // Description shown to users
  prompt_template_json: any;     // YOUR JSON PROMPT TEMPLATE
  variables_schema: VariableSchema[];  // Variable definitions
  fal_defaults?: FalDefaults;    // Default fal.ai options
  injection_mode?: 'placeholder' | 'jsonpath';  // How to inject variables
  compiler_rules?: CompilerRules; // How to compile JSON to fal prompt
}
```

## Your JSON Prompt Template

The `prompt_template_json` field contains your JSON prompt with variable placeholders.

### Placeholder Mode (Current)

Use `{{variable_name}}` placeholders in your JSON:

```json
{
  "look": {
    "background": "{{background_color}}",
    "shadow_strength": "{{shadow_strength}}"
  },
  "constraints": {
    "keep_framing": "{{keep_framing}}"
  },
  "fal": {
    "prompt": "Your instruction prompt here",
    "output_format": "{{output_format}}"
  }
}
```

When a user selects:
- `background_color = "#ffffff"`
- `shadow_strength = 0.5`
- `keep_framing = true`
- `output_format = "png"`

The system will replace placeholders to produce:

```json
{
  "look": {
    "background": "#ffffff",
    "shadow_strength": 0.5
  },
  "constraints": {
    "keep_framing": true
  },
  "fal": {
    "prompt": "Your instruction prompt here",
    "output_format": "png"
  }
}
```

## Variable Schema

Define what variables exist and how they're rendered in the UI:

```typescript
variables_schema: [
  {
    key: 'background_color',        // Variable name (matches {{variable_name}})
    type: 'color',                  // UI control type
    label: 'Background Color',      // Display label
    default: '#ececec',             // Default value
    required: true,                 // Is this required?
  },
  {
    key: 'shadow_strength',
    type: 'slider',
    label: 'Shadow Strength',
    default: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    required: false,
  },
  // ... more variables
]
```

### Variable Types

- **`color`**: Color picker + hex input
- **`text`**: Text input field
- **`number`**: Number input with min/max validation
- **`slider`**: Range slider (min/max/step)
- **`boolean`**: Checkbox toggle
- **`select`**: Dropdown menu

### Select Type Example

```typescript
{
  key: 'output_format',
  type: 'select',
  label: 'Output Format',
  default: 'png',
  options: [
    { label: 'PNG', value: 'png' },
    { label: 'JPEG', value: 'jpeg' },
    { label: 'WebP', value: 'webp' },
  ],
  required: true,
}
```

## Compiler Rules

Tell the system how to convert your final JSON into fal.ai's prompt format:

```typescript
compiler_rules: {
  // Option 1: Extract prompt from a specific field
  use_fal_prompt_field: true,
  fal_prompt_field_path: 'fal.prompt',  // Path to prompt in your JSON
  
  // Option 2: Stringify entire JSON with wrapper
  // stringify_with_wrapper: true,
  // wrapper_template: "Use this JSON spec exactly:\n<json>",
  
  // Option 3: Map specific fields to natural language
  // field_mappings: {
  //   'look.background': 'Set background color to',
  //   'look.shadow': 'Set shadow strength to',
  // }
}
```

### Current Default Behavior

If `use_fal_prompt_field` is true:
- Extracts the prompt string from the specified path (e.g., `fal.prompt`)
- Extracts fal options (output_format, resolution, etc.) from the JSON
- Uses these to call fal.ai

## Complete Example

```typescript
{
  id: 'my-custom-preset',
  name: 'My Custom Preset',
  description: 'A custom enhancement preset',
  prompt_template_json: {
    look: {
      background: '{{background_color}}',
      shadow_strength: '{{shadow_strength}}',
      material: '{{material_override}}',
    },
    constraints: {
      keep_framing: '{{keep_framing}}',
      keep_view: '{{keep_view}}',
      keep_scale: '{{keep_scale}}',
    },
    fal: {
      prompt: 'Enhance this product photo with professional studio lighting',
      output_format: '{{output_format}}',
      resolution: '{{resolution}}',
    },
  },
  variables_schema: [
    {
      key: 'background_color',
      type: 'color',
      label: 'Background Color',
      default: '#ffffff',
      required: true,
    },
    {
      key: 'shadow_strength',
      type: 'slider',
      label: 'Shadow Strength',
      default: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
    },
    {
      key: 'material_override',
      type: 'text',
      label: 'Material Override',
      default: '',
      required: false,
    },
    {
      key: 'keep_framing',
      type: 'boolean',
      label: 'Keep Framing',
      default: true,
    },
    {
      key: 'keep_view',
      type: 'boolean',
      label: 'Keep View',
      default: true,
    },
    {
      key: 'keep_scale',
      type: 'boolean',
      label: 'Keep Scale',
      default: true,
    },
    {
      key: 'output_format',
      type: 'select',
      label: 'Output Format',
      default: 'png',
      options: [
        { label: 'PNG', value: 'png' },
        { label: 'JPEG', value: 'jpeg' },
        { label: 'WebP', value: 'webp' },
      ],
      required: true,
    },
    {
      key: 'resolution',
      type: 'select',
      label: 'Resolution',
      default: '2K',
      options: [
        { label: '1K', value: '1K' },
        { label: '2K', value: '2K' },
        { label: '4K', value: '4K' },
      ],
      required: true,
    },
  ],
  injection_mode: 'placeholder',
  fal_defaults: {
    num_images: 1,
  },
  compiler_rules: {
    use_fal_prompt_field: true,
    fal_prompt_field_path: 'fal.prompt',
  },
}
```

## Testing Your Preset

1. Add your preset to `lib/presets.ts`
2. Start the dev server: `npm run dev`
3. Go to http://localhost:3000
4. Select your preset from the dropdown
5. Adjust variables and test enhancement

## Notes

- **Variable names must match**: The `key` in `variables_schema` must match the placeholder name in your JSON (without the `{{}}`)
- **Required variables**: If a variable is marked `required: true`, users must provide a value
- **Default values**: Always provide sensible defaults
- **Type validation**: The system validates variable types (number ranges, select options, etc.)
- **JSON structure**: Your JSON can be nested arbitrarily deep - the placeholder replacement works recursively

## Advanced: Custom Compiler Rules

If you need custom compilation logic, edit `lib/compiler.ts`. The `compilePrompt` function:
1. Takes your final JSON (after variable injection)
2. Applies compiler rules
3. Returns `{ prompt_string, fal_options }`

You can extend `CompilerRules` type in `lib/types.ts` to add new compilation modes.
