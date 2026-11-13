import 'server-only';
import { redirect } from 'next/navigation';
import { getSession, type SessionUser } from './session';

export type { SessionUser };

/**
 * For Server Components (pages, layouts, the header).
 * Returns the signed-in artisan, or null for visitors.
 *
 * Decrypting the session checks its expiry against the current time, which
 * Cache Components won't allow during prerendering. 'use cache: private'
 * runs it per request and keeps the result only in the visitor's browser.
 * Render the component that calls this inside <Suspense>.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  'use cache: private';
  const { user } = await getSession();
  return user ?? null;
}

/**
 * For Route Handlers (e.g. POST /api/items) and Server Actions.
 * Reads the cookie fresh on every call, so the request authorizes itself.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const { user } = await getSession();
  return user ?? null;
}

/**
 * For pages that need a signed-in artisan, such as /items/new (FR-002).
 * Sends visitors to /login and brings them back afterwards.
 *
 * @param returnTo Path to come back to after signing in, e.g. '/items/new'.
 */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(returnTo ? `/login?callbackUrl=${encodeURIComponent(returnTo)}` : '/login');
  }
  return user;
}
