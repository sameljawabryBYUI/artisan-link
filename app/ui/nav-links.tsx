'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Main site sections shown in the header (desktop) and the mobile menu. */
export const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
] as const;

function isActive(pathname: string | null, href: string) {
  return pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));
}

/** Plain list of links. Pass `pathname={null}` to render without a highlighted link. */
export function NavLinkList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {NAV_LINKS.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`relative inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition-colors ${
                active
                  ? 'text-indigo after:absolute after:inset-x-3 after:-bottom-3 after:h-0.5 after:rounded-full after:bg-indigo'
                  : 'text-muted hover:bg-indigo-tint hover:text-ink'
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Highlights the current section. usePathname suspends on routes with unknown
 * dynamic params (e.g. /products/[id]), so render this inside <Suspense> with
 * <NavLinkList pathname={null} /> as the fallback.
 */
export function ActiveNavLinks() {
  const pathname = usePathname();
  return <NavLinkList pathname={pathname} />;
}
