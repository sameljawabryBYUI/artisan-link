import { NextResponse, type NextRequest } from 'next/server';
import {
  OAUTH_CALLBACK_COOKIE,
  OAUTH_STATE_COOKIE,
  getAppUrl,
  getRedirectUri,
  oauthCookieOptions,
  safeCallbackUrl,
} from '@/lib/oauth';
import { SESSION_COOKIE, sealSession, sessionCookieOptions } from '@/lib/session';

type GitHubTokenResponse = {
  access_token?: string;
  error?: string;
};

type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

function clearOAuthCookies(response: NextResponse) {
  response.cookies.set(OAUTH_STATE_COOKIE, '', { ...oauthCookieOptions, maxAge: 0 });
  response.cookies.set(OAUTH_CALLBACK_COOKIE, '', { ...oauthCookieOptions, maxAge: 0 });
  return response;
}

/** Step 2: GitHub sends the visitor back here with a one-time code. */
export async function GET(request: NextRequest) {
  const appUrl = getAppUrl(request);
  const fail = (reason: string) =>
    clearOAuthCookies(NextResponse.redirect(new URL(`/login?error=${reason}`, appUrl)));

  const params = request.nextUrl.searchParams;
  if (params.get('error') === 'access_denied') return fail('access_denied');

  const code = params.get('code');
  const state = params.get('state');
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!code || !state || !expectedState || state !== expectedState) return fail('state');

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail('config');

  try {
    // Trade the one-time code for an access token.
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: getRedirectUri(request),
      }),
      cache: 'no-store',
    });
    const token = (await tokenResponse.json()) as GitHubTokenResponse;
    if (!tokenResponse.ok || !token.access_token) return fail('github');

    // Read the GitHub profile. The token is used once here and never stored.
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.access_token}`,
        'User-Agent': 'ArtisanLink',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });
    if (!userResponse.ok) return fail('github');
    const profile = (await userResponse.json()) as GitHubUser;

    const seal = await sealSession({
      id: String(profile.id),
      login: profile.login,
      name: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
    });

    const callbackUrl = safeCallbackUrl(request.cookies.get(OAUTH_CALLBACK_COOKIE)?.value);
    const response = NextResponse.redirect(new URL(callbackUrl, appUrl));
    response.cookies.set(SESSION_COOKIE, seal, sessionCookieOptions);
    return clearOAuthCookies(response);
  } catch (error) {
    console.error('GitHub sign-in failed', error);
    return fail('github');
  }
}
