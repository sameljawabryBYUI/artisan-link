import Link from 'next/link';

type ProductLoadError = {
  message: string;
  status?: number;
};

export function ProductLoadingState() {
  return (
    <p
      className="rounded-xl border border-[#d9dde4] bg-white px-5 py-8 text-sm text-[#586274]"
      role="status"
    >
      Loading your products…
    </p>
  );
}

export function ProductLoadErrorState({ error }: { error: ProductLoadError }) {
  return (
    <section
      className="rounded-xl border border-[#d9dde4] bg-white px-5 py-8"
      aria-labelledby="products-error-title"
    >
      <h2 id="products-error-title" className="font-display text-lg font-semibold text-[#1b2433]">
        We couldn&apos;t load your products
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#586274]" role="alert">
        {error.message}
      </p>
      {error.status === 401 && (
        <p className="mt-4 text-sm text-[#586274]">
          Sign in with an artisan account to continue.{' '}
          <Link
            href="/login?callbackUrl=%2Fdashboard%2Fproducts"
            className="font-semibold text-[#24427a] underline underline-offset-2"
          >
            Sign in
          </Link>
          .
        </p>
      )}
      {error.status === 403 && (
        <p className="mt-4 text-sm text-[#586274]">Your account does not have artisan access.</p>
      )}
    </section>
  );
}

export function ProductEmptyState() {
  return (
    <section className="rounded-xl border border-[#d9dde4] bg-white px-5 py-10 text-center">
      <h2 className="font-display text-xl font-semibold text-[#1b2433]">
        Your product list is empty
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#586274]">
        Add your first handmade piece and it will appear here for you to manage.
      </p>
      <Link
        href="/dashboard/products/new"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#24427a] px-4 text-sm font-semibold text-white hover:bg-[#1a3360]"
      >
        Create your first product
      </Link>
    </section>
  );
}
