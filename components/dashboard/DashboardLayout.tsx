import Link from 'next/link';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 bg-[#f6f6f3]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8 lg:py-12">
        <aside aria-label="Dashboard navigation" className="shrink-0 lg:w-56">
          <p className="mb-3 text-xs font-semibold tracking-wider text-[#586274] uppercase">
            Artisan dashboard
          </p>
          <nav className="flex gap-2 lg:flex-col">
            <Link
              href="/dashboard/products"
              className="rounded-lg bg-[#e8edf6] px-4 py-2.5 text-sm font-semibold text-[#24427a]"
              aria-current="page"
            >
              My products
            </Link>
            <Link
              href="/products"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#586274] hover:bg-white hover:text-[#1b2433]"
            >
              Browse marketplace
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
