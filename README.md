# Product Photo Enhancer SaaS

A full-stack SaaS application that enhances product photos using AI-powered editing via fal.ai's nano-banana-pro/edit model.

## Features

- **Image Upload**: Drag-and-drop or click to upload product photos
- **Preset System**: Choose from multiple enhancement presets (Studio Gray, Pure White, Transparent Cutout)
- **Dynamic Variables**: Adjust settings like background color, shadow strength, output format, and resolution
- **Variable Injection**: Supports placeholder-based (`{{var}}`) variable injection into JSON prompt templates
- **Job History**: Track all enhancement jobs with status, input/output images, and settings
- **Server-Side Processing**: All fal.ai API calls are made server-side to protect your API key

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **SQLite** (via better-sqlite3) for job storage
- **fal.ai** for image enhancement
- **React** for UI components

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   FAL_KEY=your_fal_api_key_here
   DATABASE_PATH=./data/jobs.db
   UPLOAD_DIR=./public/uploads
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Create necessary directories:**
   ```bash
   mkdir -p public/uploads data
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
nano/
├── app/
│   ├── api/
│   │   ├── enhance/route.ts      # POST endpoint for image enhancement
│   │   └── jobs/                 # GET endpoints for job history
│   ├── jobs/                     # Jobs list and detail pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/enhancement page
│   └── globals.css               # Global styles
├── components/
│   ├── ImageUpload.tsx           # File upload component
│   └── VariableControls.tsx      # Dynamic variable form generator
├── lib/
│   ├── db.ts                     # Database operations
│   ├── presets.ts                # ⭐ YOUR PRESET CONFIGURATIONS GO HERE
│   ├── variable-injection.ts     # Variable injection logic
│   ├── compiler.ts               # JSON-to-fal prompt compiler
│   ├── fal.ts                    # fal.ai client integration
│   ├── session.ts                # Session management
│   ├── types.ts                  # TypeScript types
│   └── upload.ts                 # File upload utilities
└── public/
    └── uploads/                  # Uploaded images (gitignored)
```

## Adding Your Own Presets

**This is the key file:** `lib/presets.ts`

Edit this file to add your own JSON prompt templates. Each preset includes:

1. **`prompt_template_json`**: Your JSON prompt with `{{variable}}` placeholders
2. **`variables_schema`**: Definition of what variables exist and how to render them in the UI
3. **`injection_mode`**: Currently supports `'placeholder'` (JSONPath coming soon)
4. **`compiler_rules`**: How to convert your JSON into fal.ai's prompt format

### Example Preset Structure

```typescript
{
  id: 'my-preset',
  name: 'My Custom Preset',
  description: 'Description of what this preset does',
  prompt_template_json: {
    look: {
      background: '{{background_color}}',
      shadow_strength: '{{shadow_strength}}',
    },
    fal: {
      prompt: 'Your prompt instruction here',
      output_format: '{{output_format}}',
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
    // ... more variables
  ],
  injection_mode: 'placeholder',
  compiler_rules: {
    use_fal_prompt_field: true,
    fal_prompt_field_path: 'fal.prompt',
  },
}
```

### Variable Types Supported

- `color`: Color picker + hex input
- `text`: Text input
- `number`: Number input with min/max
- `slider`: Range slider with min/max/step
- `boolean`: Checkbox toggle
- `select`: Dropdown with options

## How Variable Injection Works

### Placeholder Mode (Current)

Your JSON template can include placeholders like `{{variable_name}}`:

```json
{
  "background": "{{background_color}}",
  "shadow": "{{shadow_strength}}"
}
```

When a user selects `background_color = "#ffffff"` and `shadow_strength = 0.5`, the system replaces:

```json
{
  "background": "#ffffff",
  "shadow": 0.5
}
```

### JSONPath Mode (Coming Soon)

Will support patch operations like:
- `set("$.look.background", background_color)`
- `set("$.look.shadow", shadow_strength)`

## How Compilation Works

The compiler converts your final JSON (after variable injection) into fal.ai's required format.

**Current rules:**
- If `compiler_rules.use_fal_prompt_field` is true, extracts the prompt from the specified path (e.g., `fal.prompt`)
- Extracts fal options (output_format, resolution, etc.) from the JSON
- Falls back to stringifying the entire JSON if no rules are specified

You can customize this in `lib/compiler.ts` or extend `compiler_rules` in your presets.

## API Endpoints

### `POST /api/enhance`

Enhances an image using a preset and variables.

**Request:**
- `image`: File (multipart/form-data)
- `preset_id`: string
- `variables`: JSON string

**Response:**
```json
{
  "job_id": "uuid",
  "output_url": "https://...",
  "status": "complete"
}
```

### `GET /api/jobs`

Returns all jobs for the current session.

**Response:**
```json
{
  "jobs": [
    {
      "id": "uuid",
      "created_at": 1234567890,
      "preset_id": "studio-gray",
      "status": "complete",
      "input_image_url": "/uploads/...",
      "output_image_url": "https://...",
      ...
    }
  ]
}
```

### `GET /api/jobs/[id]`

Returns a specific job's details.

## Database Schema

Jobs are stored in SQLite with the following fields:
- `id`: UUID
- `created_at`: Timestamp
- `session_id`: Anonymous session identifier
- `preset_id`: Preset used
- `input_image_url`: Local path to uploaded image
- `output_image_url`: fal.ai returned URL
- `status`: queued | processing | complete | failed
- `variables_json`: JSON string of user-selected variables
- `compiled_prompt_string`: Final prompt sent to fal.ai
- `fal_request_id`: fal.ai request ID
- `error_message`: Error message if failed

## Production Considerations

1. **File Storage**: Currently uses local filesystem. For production, upload to S3/Cloudflare R2/etc. before calling fal.ai
2. **Database**: SQLite is fine for MVP. Consider PostgreSQL for production
3. **Async Processing**: Currently synchronous. Consider queue system (Bull, BullMQ) for production
4. **Session Management**: Currently cookie-based. Consider user authentication
5. **Rate Limiting**: Add rate limiting to API endpoints
6. **Error Handling**: Enhance error messages and retry logic
7. **Image Optimization**: Add image compression/resizing before upload

## License

MIT
