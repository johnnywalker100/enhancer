import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { getOrCreateSessionId, setSessionCookie } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = getOrCreateSessionId(request);
    const jobId = params.id;
    
    const job = dbOperations.getJob(jobId, sessionId);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    const response = NextResponse.json({ job });
    response.headers.set('Set-Cookie', setSessionCookie(sessionId));
    
    return response;
  } catch (error: any) {
    console.error('Job detail API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message,
    }, { status: 500 });
  }
}
