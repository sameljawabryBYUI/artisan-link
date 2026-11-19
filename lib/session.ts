import 'server-only';
import { cookies } from 'next/headers';
import { sealData, unsealData } from 'iron-session';

/** The GitHub profile fields we keep for a signed-in artisan. */
export type SessionUser = {
  /** GitHub numeric user id, stored as a string. Stable even if the username changes. */
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
};

type SessionData = {
  user?: SessionUser;
};

export const SESSION_COOKIE = 'artisan_session';

/** Sessions last 7 days. */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  // Expire the cookie slightly before the seal so the browser never sends an expired seal.
  maxAge: SESSION_TTL_SECONDS - 60,
};

function getPassword(): string {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error('SESSION_SECRET must be set in .env.local and be at least 32 characters long.');
  }
  return password;
}

/** Encrypts the user into a cookie value. Set it on a response with `sessionCookieOptions`. */
export async function sealSession(user: SessionUser): Promise<string> {
  return sealData({ user } satisfies SessionData, {
    password: getPassword(),
    ttl: SESSION_TTL_SECONDS,
  });
}

/** Reads and decrypts the session cookie. Returns an empty session if it is missing, expired or tampered with. */
export async function getSession(): Promise<SessionData> {
  const seal = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!seal) return {};

  try {
    return await unsealData<SessionData>(seal, {
      password: getPassword(),
      ttl: SESSION_TTL_SECONDS,
    });
  } catch {
    return {};
  }
}

/** Removes the session cookie. Only works in a Server Action or Route Handler. */
export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
