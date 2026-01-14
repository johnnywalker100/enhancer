import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE_NAME = 'nano_session_id';
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function getOrCreateSessionId(request: NextRequest): string {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (cookie?.value) {
    return cookie.value;
  }
  
  const sessionId = uuidv4();
  return sessionId;
}

export function setSessionCookie(sessionId: string): string {
  return `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax; HttpOnly`;
}
