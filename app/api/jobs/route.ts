import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { getOrCreateSessionId, setSessionCookie } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sessionId = getOrCreateSessionId(request);
    const jobs = await dbOperations.getJobsBySession(sessionId);
    
    // Remove sensitive internal data before sending to client
    const publicJobs = jobs.map(({ compiled_prompt_string, ...publicJob }) => publicJob);
    
    const response = NextResponse.json({ jobs: publicJobs });
    response.headers.set('Set-Cookie', setSessionCookie(sessionId));
    
    return response;
  } catch (error: any) {
    console.error('Jobs API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message,
    }, { status: 500 });
  }
}
