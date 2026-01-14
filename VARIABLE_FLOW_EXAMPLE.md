# How Settings Adjustments Affect Your JSON Prompt

## Step-by-Step Flow

### Step 1: Original JSON Template (Your Base Prompt)

```json
{
  "task": "studio_quality_product_photo_enhancement",
  "description": "Transform any given input image...",
  "preserve": { ... },
  "lighting": { ... },
  "optional_modifiers": {
    "soft_shadow_beneath_product": false,
    "floating_product_with_drop_shadow": false,
    "luxury_brand_aesthetic": false,
    "ecommerce_ready": false,
    "minimal_apple_style_lighting": false
  }
}
```

### Step 2: User Adjusts Settings in UI (Step 3)

The user can toggle these 5 checkboxes:
- ✅ **Soft Shadow Beneath Product** → `soft_shadow_beneath_product: true`
- ❌ **Floating Product With Drop Shadow** → `floating_product_with_drop_shadow: false`
- ✅ **Luxury Brand Aesthetic** → `luxury_brand_aesthetic: true`
- ✅ **Ecommerce Ready** → `ecommerce_ready: true`
- ❌ **Minimal Apple-Style Lighting** → `minimal_apple_style_lighting: false`

**Variables sent to API:**
```json
{
  "soft_shadow_beneath_product": true,
  "floating_product_with_drop_shadow": false,
  "luxury_brand_aesthetic": true,
  "ecommerce_ready": true,
  "minimal_apple_style_lighting": false
}
```

### Step 3: JSONPath Patches Applied

The system applies these patches (from `lib/presets.ts`):

```javascript
jsonpath_patches: [
  { op: 'set', path: '$.optional_modifiers.soft_shadow_beneath_product', var: 'soft_shadow_beneath_product' },
  { op: 'set', path: '$.optional_modifiers.floating_product_with_drop_shadow', var: 'floating_product_with_drop_shadow' },
  { op: 'set', path: '$.optional_modifiers.luxury_brand_aesthetic', var: 'luxury_brand_aesthetic' },
  { op: 'set', path: '$.optional_modifiers.ecommerce_ready', var: 'ecommerce_ready' },
  { op: 'set', path: '$.optional_modifiers.minimal_apple_style_lighting', var: 'minimal_apple_style_lighting' },
]
```

**What each patch does:**
- `$.optional_modifiers.soft_shadow_beneath_product` → Sets that field to `true` (from user's toggle)
- `$.optional_modifiers.floating_product_with_drop_shadow` → Sets that field to `false` (from user's toggle)
- etc.

### Step 4: Final JSON After Variable Injection

```json
{
  "task": "studio_quality_product_photo_enhancement",
  "description": "Transform any given input image...",
  "preserve": { ... },
  "lighting": { ... },
  "optional_modifiers": {
    "soft_shadow_beneath_product": true,        // ← Changed from false
    "floating_product_with_drop_shadow": false, // ← Kept false
    "luxury_brand_aesthetic": true,              // ← Changed from false
    "ecommerce_ready": true,                     // ← Changed from false
    "minimal_apple_style_lighting": false        // ← Kept false
  }
}
```

**Only the `optional_modifiers` section changes** - everything else stays exactly as you defined it.

### Step 5: JSON Compiled to Prompt String

Your preset uses `compiler_rules.stringify_with_wrapper`, so the entire JSON becomes the prompt:

```
Use this JSON spec exactly. Do not deviate:
<json>
{
  "task": "studio_quality_product_photo_enhancement",
  "description": "Transform any given input image...",
  "preserve": { ... },
  "lighting": { ... },
  "optional_modifiers": {
    "soft_shadow_beneath_product": true,
    "floating_product_with_drop_shadow": false,
    "luxury_brand_aesthetic": true,
    "ecommerce_ready": true,
    "minimal_apple_style_lighting": false
  }
}
```

This prompt string is sent to fal.ai along with your image.

---

## Complete Example

### Scenario: User enables "Soft Shadow" and "Ecommerce Ready"

**Before (Default):**
```json
"optional_modifiers": {
  "soft_shadow_beneath_product": false,
  "ecommerce_ready": false
}
```

**After (User toggles both ON):**
```json
"optional_modifiers": {
  "soft_shadow_beneath_product": true,   // ← User enabled
  "ecommerce_ready": true                // ← User enabled
}
```

**JSONPath patches that made this happen:**
1. `set('$.optional_modifiers.soft_shadow_beneath_product', true)` 
2. `set('$.optional_modifiers.ecommerce_ready', true)`

**Final prompt sent to fal.ai:**
```
Use this JSON spec exactly. Do not deviate:
<json>
{
  ...
  "optional_modifiers": {
    "soft_shadow_beneath_product": true,
    "ecommerce_ready": true,
    ...
  }
}
```

---

## Code Flow Summary

1. **UI (Step 3)** → User toggles checkboxes
2. **Variables** → `{ soft_shadow_beneath_product: true, ... }`
3. **JSONPath Patches** → Modify `$.optional_modifiers.*` fields
4. **Final JSON** → Your template with updated `optional_modifiers`
5. **Compiler** → Stringifies entire JSON with wrapper
6. **fal.ai API** → Receives prompt string + image

---

## Key Points

✅ **Only `optional_modifiers` changes** - Your core JSON structure is untouched
✅ **Deterministic** - Same variables always produce same JSON
✅ **No guessing** - The compiler follows your exact rules
✅ **Your JSON is the source of truth** - We only patch what you allow
