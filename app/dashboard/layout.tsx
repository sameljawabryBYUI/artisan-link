import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import DashboardShell from '@/components/dashboard/DashboardLayout';
import { requireArtisan } from '@/lib/product-auth';

export const metadata: Metadata = {
  title: {
    default: 'Artisan dashboard',
    template: '%s | ArtisanLink',
  },
  description: 'Manage your ArtisanLink product listings.',
  robots: {
    index: false,
    follow: false,
  },
};

async function AuthorizedDashboard({ children }: { children: ReactNode }) {
  const authorization = await requireArtisan();
  if (!authorization.authorized) {
    if (authorization.response.status === 401) {
      redirect('/login?callbackUrl=%2Fdashboard%2Fproducts');
    }
    redirect('/login?error=artisan-required&callbackUrl=%2Fdashboard%2Fproducts');
  }

  return <DashboardShell>{children}</DashboardShell>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <p
          className="mx-auto w-full max-w-6xl px-4 py-12 text-sm text-[#586274] sm:px-6 lg:px-8"
          role="status"
        >
          Checking artisan access…
        </p>
      }
    >
      <AuthorizedDashboard>{children}</AuthorizedDashboard>
    </Suspense>
  );
}
