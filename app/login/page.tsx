import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { safeCallbackUrl } from '@/lib/oauth';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in with GitHub to list your crafts on ArtisanLink.',
};

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'You cancelled the GitHub sign-in. Try again when you are ready.',
  state: 'Your sign-in link expired or was opened in another browser. Please try again.',
  github: "We couldn't reach GitHub to finish signing you in. Please try again.",
  config: 'GitHub sign-in is not set up on this server yet. Check the .env.local file.',
};

export default function LoginPage({ searchParams }: PageProps<'/login'>) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-16">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-line bg-surface p-8">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Sign in to list your crafts
          </h1>
          <p className="text-muted">Artisans use their GitHub account to sign in.</p>
        </div>

        <Suspense fallback={<GitHubButton href="/api/auth/github" />}>
          <SignInOptions searchParams={searchParams} />
        </Suspense>

        <p className="text-center text-sm text-muted">
          Just browsing?{' '}
          <Link href="/products" className="font-semibold text-indigo underline">
            You don&apos;t need an account
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

async function SignInOptions({ searchParams }: Pick<PageProps<'/login'>, 'searchParams'>) {
  const params = await searchParams;
  const rawCallback = typeof params.callbackUrl === 'string' ? params.callbackUrl : undefined;
  const callbackUrl = safeCallbackUrl(rawCallback);
  const errorCode = typeof params.error === 'string' ? params.error : undefined;

  // Already signed in: go straight to where they were heading.
  const user = await getCurrentUser();
  if (user) redirect(callbackUrl);

  const href =
    callbackUrl === '/'
      ? '/api/auth/github'
      : `/api/auth/github?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="space-y-4">
      {errorCode && (
        <p
          role="alert"
          className="rounded-lg border border-madder/30 bg-madder/5 p-3 text-sm font-medium text-madder"
        >
          {ERROR_MESSAGES[errorCode] ?? 'Something went wrong while signing in. Please try again.'}
        </p>
      )}
      <GitHubButton href={href} />
    </div>
  );
}

function GitHubButton({ href }: { href: string }) {
  // A plain <a>, not <Link>: this goes to a Route Handler that redirects to github.com.
  return (
    <a
      href={href}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 font-semibold text-white transition-colors hover:bg-ink/90"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      Continue with GitHub
    </a>
  );
}
