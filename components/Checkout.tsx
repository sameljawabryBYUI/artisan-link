'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AccountHeader from '@/components/AccountHeader';
import OrderSummary from '@/components/orders/OrderSummary';
import type { ProductView } from '@/lib/types';

export default function Checkout({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductView | null>(null);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${encodeURIComponent(productId)}`)
      .then(async (response) => {
        const result = (await response.json()) as ProductView | { error?: string };
        if (!response.ok) {
          throw new Error('error' in result ? result.error : 'This product is unavailable.');
        }
        return result as ProductView;
      })
      .then((item) => {
        if (active) setProduct(item);
      })
      .catch((cause: unknown) => {
        if (active) {
          setProductError(cause instanceof Error ? cause.message : 'Unable to load checkout.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  async function placeOrder() {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sign in with a buyer account before placing an order.');
        }
        throw new Error(result.error || 'Your order could not be placed.');
      }
      router.push('/orders?placed=1');
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Your order could not be placed. Please try again.'
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] text-stone-900">
      <AccountHeader />
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
        <Link
          className="text-sm font-semibold text-[#315e50] hover:underline"
          href={product ? `/products/${product.id}` : '/'}
        >
          Back to product
        </Link>
        <div className="mt-7 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#77765d]">
            Checkout
          </p>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Make it yours</h1>
          <p className="mt-3 text-stone-600">
            Review your selection before sending your order to the artisan.
          </p>
        </div>

        {productError ? (
          <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            {productError}
          </p>
        ) : !product || loading ? (
          <p className="mt-8 text-stone-500">Preparing your order...</p>
        ) : (
          <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <section className="rounded-3xl bg-[#eeeae0] p-7 sm:p-9">
              <p className="text-sm font-semibold text-[#173d34]">A note about ordering</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">
                Direct from the hands that made it.
              </h2>
              <p className="mt-4 leading-7 text-stone-600">
                Place your order and the artisan will get in touch to confirm availability,
                delivery, and payment details.
              </p>
              <p className="mt-6 text-sm text-stone-500">
                You must be signed in with a buyer account to place an order.
              </p>
            </section>
            <div>
              {error && (
                <p
                  aria-live="polite"
                  className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                  {error}
                </p>
              )}
              <OrderSummary onConfirm={placeOrder} product={product} submitting={submitting} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
