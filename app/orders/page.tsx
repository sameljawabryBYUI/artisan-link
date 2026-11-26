import AccountHeader from '@/components/AccountHeader';
import OrderList from '@/components/orders/OrderList';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-stone-900">
      <AccountHeader />
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10 sm:py-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#77765d]">
          Your account
        </p>
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Your purchases</h1>
        <p className="mb-9 mt-3 text-stone-600">
          Keep track of the pieces you&apos;ve chosen and their progress.
        </p>
        <OrderList />
      </main>
    </div>
  );
}
