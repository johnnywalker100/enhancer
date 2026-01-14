# Quick Start Guide

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your fal.ai API key:
   ```env
   FAL_KEY=your_fal_api_key_here
   DATABASE_PATH=./data/jobs.db
   UPLOAD_DIR=./public/uploads
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. Create directories:
   ```bash
   mkdir -p public/uploads data
   ```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Adding Your First Preset

1. Open `lib/presets.ts`
2. Add your preset following the structure in `PRESET_CONFIGURATION.md`
3. Your JSON prompt goes in `prompt_template_json`
4. Define variables in `variables_schema`
5. Save and refresh the browser

## Project Structure

- **`lib/presets.ts`** - ⭐ **EDIT THIS FILE** to add your JSON prompts
- **`app/page.tsx`** - Main enhancement page
- **`app/jobs/`** - Job history pages
- **`app/api/`** - Backend API endpoints
- **`components/`** - React components

## Key Files to Customize

1. **`lib/presets.ts`** - Add your JSON prompt templates here
2. **`lib/compiler.ts`** - Customize how JSON becomes fal.ai prompts (if needed)
3. **`lib/variable-injection.ts`** - Customize variable injection logic (if needed)

## Testing

1. Upload an image
2. Select a preset
3. Adjust variables
4. Click "Enhance Image"
5. View result and check job history

## Troubleshooting

### "FAL_KEY is not set"
- Make sure `.env.local` exists and has `FAL_KEY=your_key`

### "Database error"
- Make sure `data/` directory exists and is writable

### "Upload failed"
- Make sure `public/uploads/` directory exists
- Check file size (max 10MB)
- Check file type (JPEG, PNG, WebP only)

### "Preset not found"
- Make sure preset ID matches exactly
- Check `lib/presets.ts` for typos

## Next Steps

1. Add your JSON prompt templates to `lib/presets.ts`
2. Test with your images
3. Customize variables and UI as needed
4. Deploy to production (Vercel, Railway, etc.)
