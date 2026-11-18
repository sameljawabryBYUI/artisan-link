import Link from 'next/link';

/**
 * ArtisanLink wordmark. The mark is a small woven square: indigo warp
 * threads crossed by a saffron weft, from the design direction.
 */
export function Logo({ tone = 'indigo' }: { tone?: 'indigo' | 'light' }) {
  const text = tone === 'light' ? 'text-white' : 'text-indigo';
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 rounded-lg font-display text-xl font-bold tracking-tight ${text}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0">
        <rect width="24" height="24" rx="6" className="fill-indigo" />
        <path d="M7 5v14M12 5v14M17 5v14" className="stroke-white/70" strokeWidth="2" />
        <path d="M4 12h16" className="stroke-saffron" strokeWidth="3" />
      </svg>
      ArtisanLink
    </Link>
  );
}
