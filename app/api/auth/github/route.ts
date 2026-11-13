import { NextResponse, type NextRequest } from 'next/server';
import {
  OAUTH_CALLBACK_COOKIE,
  OAUTH_STATE_COOKIE,
  getAppUrl,
  getRedirectUri,
  oauthCookieOptions,
  safeCallbackUrl,
} from '@/lib/oauth';

/** Step 1: send the visitor to GitHub to approve ArtisanLink. */
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=config', getAppUrl(request)));
  }

  // Random value we check on the way back, so another site can't forge a sign-in (CSRF).
  const state = crypto.randomUUID();
  const callbackUrl = safeCallbackUrl(request.nextUrl.searchParams.get('callbackUrl'));

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', getRedirectUri(request));
  authorizeUrl.searchParams.set('state', state);
  // No scope: we only need the public profile (id, username, name, avatar).

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, oauthCookieOptions);
  response.cookies.set(OAUTH_CALLBACK_COOKIE, callbackUrl, oauthCookieOptions);
  return response;
}
