# API易 (apiyi.com) Setup Instructions

This project has been migrated from FAL AI to API易's Nano Banana Pro image generation service.

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
APIYI_API_KEY=sk-PdxXimrir1GeS1t9Bb155f9a61664c9fAcDc9427BbD83784
```

## API Documentation

- **Nano Banana Pro API**: https://docs.apiyi.com/api-capabilities/nano-banana-image
- **API Manual**: https://docs.apiyi.com/api-manual
- **API Console**: https://api.apiyi.com/console

## Changes Made

1. **Replaced** `@fal-ai/client` dependency with native fetch-based API calls
2. **Updated** `lib/fal.ts` to use API易's Nano Banana Pro endpoint
3. **Environment Variable**: Changed from `FAL_KEY` to `APIYI_API_KEY`

## API Features

- **Model**: gemini-3-pro-image-preview
- **Endpoint**: https://api.apiyi.com/v1beta/models/gemini-3-pro-image-preview:generateContent
- **Authentication**: Bearer token
- **Supported Resolutions**: 1K, 2K, 4K
- **Aspect Ratios**: 21:9, 16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16

## Installation

After adding the environment variable, run:

```bash
npm install
npm run dev
```

## Testing

The API can be tested through the existing `/api/enhance` endpoint. The response format remains compatible with the previous FAL AI implementation.
