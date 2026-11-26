import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
};

/**
 * Shown for any URL that doesn't exist, and when a page calls notFound()
 * (e.g. an unknown product or artisan id, FR-009). Renders inside the root
 * layout, so it keeps the header, footer and design styles.
 */
export default function NotFound() {
  return (
    <main className="container-page flex flex-1 items-center justify-center py-16 md:py-24">
      <div className="max-w-md space-y-6 text-center">
        <p className="font-display text-7xl font-bold text-indigo-tint" aria-hidden="true">
          404
        </p>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="text-muted">
            The link may be broken, or the product may have been removed by its artisan.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo px-6 font-semibold text-white transition-colors hover:bg-indigo-dark"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-line-strong bg-surface px-6 font-semibold text-ink transition-colors hover:bg-indigo-tint"
          >
            Go to home
          </Link>
        </div>
      </div>
    </main>
  );
}
