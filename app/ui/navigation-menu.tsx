import { Suspense } from 'react';
import { MobileNav } from './mobile-nav';
import { ActiveNavLinks, NavLinkList } from './nav-links';

type NavigationMenuProps = {
  /**
   * `desktop`: inline links, shown from the `md` breakpoint up, with the current page highlighted.
   * `mobile`: a menu button that opens the same links, shown below `md`.
   */
  variant: 'desktop' | 'mobile';
};

/**
 * Main site navigation (Products, Orders). The links live in NAV_LINKS in
 * nav-links.tsx, so both variants always show the same pages.
 *
 * @example
 * <NavigationMenu variant="desktop" />  // next to the logo
 * <NavigationMenu variant="mobile" />   // at the end of the header
 */
export function NavigationMenu({ variant }: NavigationMenuProps) {
  if (variant === 'mobile') return <MobileNav />;

  return (
    <nav aria-label="Main" className="hidden md:block">
      {/* usePathname suspends on routes like /products/[id]; the fallback shows the same links unhighlighted. */}
      <Suspense fallback={<NavLinkList pathname={null} />}>
        <ActiveNavLinks />
      </Suspense>
    </nav>
  );
}
