# Migration to Supabase - Completed ✅

## What Changed

We've successfully migrated from SQLite to Supabase PostgreSQL for production-ready deployment on Vercel.

### Files Updated

1. **`lib/supabase.ts`** (NEW)
   - Supabase client initialization
   - Exports both `supabase` (client) and `supabaseAdmin` (service role)

2. **`lib/db.ts`** (MODIFIED)
   - Replaced `better-sqlite3` with Supabase client
   - All operations now async (return Promises)
   - `variables_json` now stored as JSONB (object) instead of string
   - `created_at` now ISO timestamp string instead of Unix milliseconds

3. **`app/api/jobs/route.ts`** (MODIFIED)
   - Added `await` to `getJobsBySession()`

4. **`app/api/jobs/[id]/route.ts`** (MODIFIED)
   - Added `await` to `getJob()`

5. **`package.json`** (MODIFIED)
   - Removed: `better-sqlite3`, `@types/better-sqlite3`
   - Added: `@supabase/supabase-js`

6. **`.env.local`** (CREATED)
   - Added Supabase credentials

7. **`supabase-schema.sql`** (NEW)
   - PostgreSQL schema with indexes and RLS policies

8. **`README.md`** (UPDATED)
   - Updated setup instructions
   - Updated tech stack
   - Updated production considerations

### Database Schema Changes

#### SQLite → PostgreSQL Type Mappings

| SQLite | PostgreSQL | Notes |
|--------|-----------|-------|
| `TEXT PRIMARY KEY` | `UUID PRIMARY KEY DEFAULT gen_random_uuid()` | Auto-generated UUIDs |
| `INTEGER created_at` | `TIMESTAMPTZ created_at DEFAULT NOW()` | ISO timestamps with timezone |
| `TEXT variables_json` | `JSONB variables_json` | Native JSON support |
| `CHECK(status IN (...))` | `CHECK(status IN (...))` | Same constraint syntax |

### API Breaking Changes

⚠️ **Frontend Impact:**

If you have any frontend code parsing `created_at`, update it:

**Before (SQLite):**
```typescript
const timestamp = job.created_at; // number (Unix ms)
const date = new Date(timestamp);
```

**After (Supabase):**
```typescript
const timestamp = job.created_at; // string (ISO 8601)
const date = new Date(timestamp);
```

Good news: `new Date()` accepts both formats, so most code should work unchanged.

### Security Improvements

1. **Row Level Security (RLS)**
   - Jobs are isolated by `session_id`
   - Users can only see their own jobs
   - Service role bypasses RLS for server operations

2. **Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe for frontend (RLS protected)
   - `SUPABASE_SERVICE_ROLE_KEY`: Server-side only (bypasses RLS)

## Setup Instructions

### 1. Run SQL Schema

1. Go to your Supabase dashboard: https://hcuyihqbflhldmuequms.supabase.co
2. Navigate to SQL Editor
3. Copy contents of `supabase-schema.sql`
4. Paste and click "Run"

### 2. Verify Environment Variables

Check `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hcuyihqbflhldmuequms.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FAL_KEY=your_actual_fal_key
```

### 3. Test Locally

```bash
npm run dev
```

- Upload an image
- Check if job is created
- Verify job appears in Supabase dashboard (Table Editor → jobs)

### 4. Deploy to Vercel

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FAL_KEY`

Then deploy:
```bash
vercel --prod
```

## Rollback Instructions (if needed)

If you need to rollback to SQLite:

```bash
git revert HEAD
npm install better-sqlite3 @types/better-sqlite3
npm uninstall @supabase/supabase-js
```

## Future Enhancements

Now that you're on Supabase, you can easily add:

1. **Supabase Auth** - Replace cookie sessions with real user accounts
2. **Supabase Storage** - Store uploaded images in Supabase instead of local filesystem
3. **Real-time Updates** - Live job status updates using Supabase Realtime
4. **Database Functions** - Add PostgreSQL functions for complex queries
5. **Edge Functions** - Serverless functions alongside your database

## Testing Checklist

- [ ] SQL schema runs without errors
- [ ] Environment variables are set
- [ ] App starts with `npm run dev`
- [ ] Can upload image and create job
- [ ] Job appears in `/api/jobs` endpoint
- [ ] Job appears in Supabase Table Editor
- [ ] Job details load at `/api/jobs/[id]`
- [ ] Session isolation works (open in incognito, shouldn't see other session's jobs)
- [ ] Build succeeds: `npm run build`
- [ ] Vercel deployment works

## Troubleshooting

### Error: "Missing NEXT_PUBLIC_SUPABASE_URL"
- Check `.env.local` exists in project root
- Restart dev server after creating `.env.local`

### Error: "Failed to create job"
- Verify SQL schema was run in Supabase
- Check Supabase dashboard → Table Editor → jobs table exists
- Check browser console for detailed error

### Error: "row level security policy violation"
- This means RLS is working! 
- Ensure you're using `supabaseAdmin` in server-side operations
- Check `lib/db.ts` imports `supabaseAdmin`, not `supabase`

### Jobs not appearing
- Check Supabase dashboard → Table Editor → jobs
- If jobs exist but API returns empty, check session cookie is being set
- Try in incognito mode to get fresh session

## Performance Notes

Supabase is hosted on AWS in the region you selected. For optimal performance:
- Choose a region close to your users
- Use connection pooling (already configured in Supabase)
- Add indexes for common queries (already in schema)
- Consider Supabase's Edge Network for global distribution

## Cost Considerations

Supabase Free Tier includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

This is plenty for MVP/testing. Upgrade to Pro ($25/mo) when you're ready to scale.
