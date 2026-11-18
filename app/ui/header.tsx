import { Suspense } from 'react';
import { AuthStatus, AuthStatusSkeleton } from './auth-status';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';
import { ActiveNavLinks, NavLinkList } from './nav-links';

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

        <nav aria-label="Main" className="hidden md:block">
          <Suspense fallback={<NavLinkList pathname={null} />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<AuthStatusSkeleton />}>
            <AuthStatus />
          </Suspense>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
