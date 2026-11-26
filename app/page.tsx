import ProductCatalog from '@/components/ProductCatalog';
import AccountHeader from '@/components/AccountHeader';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-stone-900">
      <AccountHeader />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-14 sm:px-10">
        <section className="mb-14 grid gap-8 rounded-[2rem] bg-[#173d34] px-8 py-12 text-white sm:px-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Made by hand, found by you
            </p>
            <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl">
              Keep a little craft in your everyday.
            </h1>
          </div>
          <p className="max-w-md text-base leading-7 text-emerald-50/80 lg:justify-self-end">
            Discover thoughtful work from independent makers and bring something made with care into
            your home.
          </p>
        </section>
        <ProductCatalog />
      </main>
    </div>
  );
}
