import Link from 'next/link';
import { Logo } from './logo';

const EXPLORE_LINKS = [
  { href: '/products', label: 'Browse products' },
  { href: '/dashboard/products', label: 'Sell your crafts' },
  { href: '/login', label: 'Sign in' },
] as const;

const TEAM = [
  'Samar El Jawabry',
  'Shania Esguerra',
  'Martha Itohan Otasowie',
  'Daniel Paulino',
] as const;

/** Site footer: ink background, three columns that stack on mobile. */
export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3 md:py-16">
        <section className="space-y-3">
          <Logo tone="light" />
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            A showcase for handmade crafts from local artisans around the world. Find a piece you
            love and contact its maker directly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-wider text-ink-muted uppercase">Explore</h2>
          <ul className="space-y-2">
            {EXPLORE_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white hover:text-saffron hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-wider text-ink-muted uppercase">Team</h2>
          <ul className="space-y-2 text-sm">
            {TEAM.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-ink-muted">
          © 2026 ArtisanLink · WDD 430 Web Full-Stack Development team project
        </p>
      </div>
    </footer>
  );
}
