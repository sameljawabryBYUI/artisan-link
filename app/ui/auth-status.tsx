import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { signOut } from '@/lib/actions/auth';

/**
 * Shows "Sign in" for visitors, or the GitHub avatar and a sign-out button for artisans.
 * Reads the session cookie, so always render it inside <Suspense>.
 */
export async function AuthStatus() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src={user.avatarUrl}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-full border border-zinc-200"
      />
      <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

/** Placeholder with the same size as the button, so the header doesn't jump while loading. */
export function AuthStatusSkeleton() {
  return <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-200" aria-hidden="true" />;
}
