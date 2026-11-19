import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { UserMenu } from './user-menu';

/**
 * Header account area: "Sign in" for visitors, the avatar menu for signed-in users.
 * Reads the session cookie, so always render it inside <Suspense>.
 */
export async function AuthStatus() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-10 items-center rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-ink hover:bg-indigo-tint"
      >
        Sign in
      </Link>
    );
  }

  // Only the fields the menu displays are sent to the browser.
  return <UserMenu name={user.name} login={user.login} avatarUrl={user.avatarUrl} />;
}

/** Same size as the Sign in button, so the header doesn't jump while the session loads. */
export function AuthStatusSkeleton() {
  return <div className="h-10 w-24 animate-pulse rounded-lg bg-line/60" aria-hidden="true" />;
}
