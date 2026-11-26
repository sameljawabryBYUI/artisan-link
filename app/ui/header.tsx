import { Suspense } from 'react';
import { AuthStatus, AuthStatusSkeleton } from './auth-status';
import { Logo } from './logo';
import { NavigationMenu } from './navigation-menu';

/**
 * Site header: sticky, 64px, white surface with a bottom border.
 * The logo and links prerender into the static shell; only the account
 * area waits for the session (inside <Suspense>).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="container-page relative flex h-16 items-center gap-6">
        <Logo />
        <NavigationMenu variant="desktop" />

        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<AuthStatusSkeleton />}>
            <AuthStatus />
          </Suspense>
          <NavigationMenu variant="mobile" />
        </div>
      </div>
    </header>
  );
}
