import { Preset } from './types';

/**
 * This is the file where YOU (the user) will plug in your JSON prompt templates.
 * 
 * Structure:
 * - Each preset has a prompt_template_json (your JSON)
 * - variables_schema defines what variables exist and how to render them
 * - injection_mode: 'placeholder' ({{var}}) or 'jsonpath' (patch operations)
 * - compiler_rules: how to convert your JSON into fal's prompt string
 */

// Example presets - REPLACE THESE WITH YOUR ACTUAL JSON PROMPTS
export const presets: Preset[] = [
  {
    id: 'luxury-studio-mvp',
    name: 'Luxury Studio (Your JSON)',
    description: 'Your studio-quality product photo enhancement JSON (deterministic JSONPath injection + strict compiler)',
    prompt_template_json: {
      task: 'studio_quality_product_photo_enhancement',
      description:
        'Transform any given input image into a flawless, studio-quality, high-end product photograph suitable for luxury advertising and e-commerce.',
      preserve: {
        shape: true,
        proportions: true,
        branding: true,
        logos: true,
        materials: true,
        fine_details: true,
      },
      lighting: {
        type: 'professional studio lighting',
        setup: ['softbox', 'three-point lighting'],
        characteristics: {
          soft: true,
          diffused: true,
          controlled_highlights: true,
          gentle_shadows: true,
          no_harsh_reflections: true,
          no_color_casts: true,
          even_exposure: true,
          realistic_depth: true,
        },
      },
      surface_and_texture: {
        enhancement: 'high realism',
        supported_materials: [
          'metal',
          'glass',
          'plastic',
          'fabric',
          'leather',
          'wood',
          'liquid',
          'matte',
          'gloss',
        ],
        retouching: {
          remove_dust: true,
          remove_scratches: true,
          remove_fingerprints: true,
          remove_dents: true,
          remove_noise: true,
          maintain_realism: true,
        },
      },
      color_and_tone: {
        color_correction: 'neutral and accurate',
        white_balance: 'clean whites',
        black_levels: 'deep blacks',
        saturation: 'rich but realistic',
        brand_color_accuracy: true,
      },
      background: {
        type: 'seamless studio background',
        color: 'pure white',
        qualities: {
          distraction_free: true,
          smooth: true,
          professionally_lit: true,
          no_banding: true,
          no_artifacts: true,
        },
      },
      composition: {
        alignment: 'perfectly straight',
        framing: 'optimal for product focus',
        layout: ['centered', 'rule_of_thirds'],
        negative_space: 'balanced',
      },
      sharpness_and_quality: {
        focus: 'ultra-sharp across entire product',
        micro_contrast: 'high',
        no_motion_blur: true,
        no_noise: true,
        no_compression_artifacts: true,
      },
      post_processing: {
        style: 'professional retouching only',
        no_artistic_filters: true,
        no_stylization: true,
        photorealistic: true,
      },
      output: {
        resolution: 'ultra-high-resolution',
        quality: 'studio-grade',
        use_cases: ['luxury advertising', 'e-commerce hero image', 'product catalogs', 'brand marketing'],
      },
      optional_modifiers: {
        soft_shadow_beneath_product: false,
        floating_product_with_drop_shadow: false,
        luxury_brand_aesthetic: false,
        ecommerce_ready: false,
        minimal_apple_style_lighting: false,
      },
    },
    injection_mode: 'jsonpath',
    variables_schema: [
      {
        key: 'background_color',
        type: 'color',
        label: 'Background Color',
        default: '#ffffff',
      },
      {
        key: 'soft_shadow_beneath_product',
        type: 'boolean',
        label: 'Soft Shadow Beneath Product',
        default: false,
      },
      {
        key: 'floating_product_with_drop_shadow',
        type: 'boolean',
        label: 'Floating Product With Drop Shadow',
        default: false,
      },
      {
        key: 'luxury_brand_aesthetic',
        type: 'boolean',
        label: 'Luxury Brand Aesthetic',
        default: false,
      },
      {
        key: 'ecommerce_ready',
        type: 'boolean',
        label: 'Ecommerce Ready',
        default: false,
      },
      {
        key: 'minimal_apple_style_lighting',
        type: 'boolean',
        label: 'Minimal Apple-Style Lighting',
        default: false,
      },
    ],
    jsonpath_patches: [
      { op: 'set', path: '$.background.color', var: 'background_color' },
      { op: 'set', path: '$.optional_modifiers.soft_shadow_beneath_product', var: 'soft_shadow_beneath_product' },
      {
        op: 'set',
        path: '$.optional_modifiers.floating_product_with_drop_shadow',
        var: 'floating_product_with_drop_shadow',
      },
      { op: 'set', path: '$.optional_modifiers.luxury_brand_aesthetic', var: 'luxury_brand_aesthetic' },
      { op: 'set', path: '$.optional_modifiers.ecommerce_ready', var: 'ecommerce_ready' },
      { op: 'set', path: '$.optional_modifiers.minimal_apple_style_lighting', var: 'minimal_apple_style_lighting' },
    ],
    fal_defaults: {
      num_images: 1,
      output_format: 'png',
      resolution: '1K',
    },
    compiler_rules: {
      strict: true,
      stringify_with_wrapper: true,
      wrapper_template: 'Use this JSON spec exactly. Do not deviate:\\n<json>',
    },
  },
];

export function getPreset(id: string): Preset | undefined {
  return presets.find(p => p.id === id);
}

export function getAllPresets(): Preset[] {
  return presets;
}
