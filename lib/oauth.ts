import 'server-only';
import type { NextRequest } from 'next/server';

export const OAUTH_STATE_COOKIE = 'github_oauth_state';
export const OAUTH_CALLBACK_COOKIE = 'github_oauth_callback';

/** Short-lived cookies used only during the GitHub round trip. */
export const oauthCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth/github',
  maxAge: 60 * 10,
};

/** Base URL of this app. Set APP_URL in production if the app runs behind a proxy. */
export function getAppUrl(request: NextRequest): string {
  return (process.env.APP_URL || request.nextUrl.origin).replace(/\/$/, '');
}

export function getRedirectUri(request: NextRequest): string {
  return `${getAppUrl(request)}/api/auth/github/callback`;
}

/**
 * Only allows same-site paths like "/items/new", so a crafted link
 * can't send people to another website after they sign in.
 */
export function safeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/';
  }
  if (value === '/login' || value.startsWith('/login?') || value.startsWith('/api/auth')) {
    return '/';
  }
  return value;
}
