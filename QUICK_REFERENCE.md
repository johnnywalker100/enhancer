# 🚀 Quick Reference - API易 Integration

## 📝 ONE-STEP Setup

Create `.env.local` file:
```bash
APIYI_API_KEY=sk-PdxXimrir1GeS1t9Bb155f9a61664c9fAcDc9427BbD83784
```

## 🧪 Test Commands

```bash
# Test API connection
node test-apiyi.js

# Start development
npm run dev

# Build for production
npm run build
```

## 🔑 Key Information

| Item | Value |
|------|-------|
| **API Provider** | API易 (apiyi.com) |
| **Model** | Nano Banana Pro (gemini-3-pro-image-preview) |
| **Endpoint** | `https://api.apiyi.com/v1beta/models/gemini-3-pro-image-preview:generateContent` |
| **API Key** | `sk-PdxXimrir1GeS1t9Bb155f9a61664c9fAcDc9427BbD83784` |
| **Format** | Google native (JSON + Base64) |
| **Auth** | Bearer token |

## 📂 Files Changed

```
✅ lib/fal.ts                 - API client (rewritten)
✅ app/api/enhance/route.ts   - Comments updated
✅ package.json               - Removed @fal-ai/client
✅ README.md                  - Documentation updated
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `FINAL_SETUP_INSTRUCTIONS.md` | ⭐ **Start here!** Complete setup guide |
| `MIGRATION_COMPLETE.md` | Migration details and troubleshooting |
| `MIGRATION_SUMMARY.md` | Technical comparison and statistics |
| `APIYI_SETUP.md` | API易 specific setup |
| `QUICK_REFERENCE.md` | This file |

## 🎯 Supported Features

### Resolutions
- 1K (1024×1024)
- 2K (2048×2048)
- 4K (4096×4096)

### Aspect Ratios
- 21:9 (Ultrawide)
- 16:9 (HD)
- 3:2 (Classic)
- 4:3 (Standard)
- 5:4 (Monitor)
- 1:1 (Square) ⭐ Default
- 4:5 (Portrait)
- 3:4 (Portrait)
- 2:3 (Portrait)
- 9:16 (Mobile)

### Output Formats
- PNG ✅
- JPEG ✅
- WebP ✅

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| `APIYI_API_KEY is not set` | Create `.env.local` with API key |
| `403 Forbidden` | Check API key and account balance |
| `429 Rate Limit` | Wait and retry, or upgrade plan |
| `No image data` | Check prompt for policy violations |

## 📊 Request Example

```bash
curl -X POST https://api.apiyi.com/v1beta/models/gemini-3-pro-image-preview:generateContent \
  -H "Authorization: Bearer sk-PdxXimrir1GeS1t9Bb155f9a61664c9fAcDc9427BbD83784" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "A beautiful product photo"},
        {"inlineData": {"mimeType": "image/jpeg", "data": "base64..."}}
      ]
    }],
    "generationConfig": {
      "responseModalities": ["IMAGE"],
      "imageConfig": {"aspectRatio": "1:1", "imageSize": "2K"}
    }
  }'
```

## 🌐 Links

- **Console**: https://api.apiyi.com/console
- **Docs**: https://docs.apiyi.com/api-manual
- **Nano Banana**: https://docs.apiyi.com/api-capabilities/nano-banana-image

## ✅ Checklist

- [ ] Created `.env.local` with API key
- [ ] Ran `node test-apiyi.js` successfully
- [ ] Started dev server with `npm run dev`
- [ ] Tested image upload and enhancement
- [ ] Verified enhanced image displays correctly
- [ ] Checked job history page works

## 💡 Pro Tips

1. **Test first**: Always run `node test-apiyi.js` before full testing
2. **Check logs**: Console logs show detailed API interactions
3. **Monitor usage**: Check API易 console for credit usage
4. **Save prompts**: Reuse successful prompts for consistent results
5. **Optimize resolution**: Use 1K for testing, 2K/4K for production

## 🎨 Example Prompts

```
"Professional product photo on white background"
"Product on seamless gray studio backdrop"
"Isolated product with natural shadow"
"Transparent background product cutout"
"E-commerce style product image"
```

## 📱 Testing Flow

```
1. npm run dev          → Start server
2. Open localhost:3000  → View app
3. Upload image         → Drag & drop
4. Select preset        → Choose enhancement
5. Adjust variables     → Customize
6. Click "Enhance"      → Process
7. View result          → Success!
```

## 🚨 Common Mistakes

❌ **Don't:**
- Forget to create `.env.local`
- Use spaces in API key
- Expose API key in client code
- Skip the test script

✅ **Do:**
- Create `.env.local` first
- Copy exact API key
- Keep keys server-side only
- Run test script before deploying

## 📈 Performance Tips

- Use **1K** for fast previews
- Use **2K** for production (balance)
- Use **4K** only when needed (slower)
- Cache results to avoid re-processing
- Monitor API usage in console

---

**Last Updated**: 2026-01-15
**Status**: ✅ Ready to use
**Support**: Check `MIGRATION_COMPLETE.md` for detailed troubleshooting
