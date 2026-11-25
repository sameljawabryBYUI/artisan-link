'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { OrderView } from '@/lib/types';
import OrderCard from '@/components/orders/OrderCard';

export default function OrderList() {
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsSignIn, setNeedsSignIn] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/orders')
      .then(async (response) => {
        const result = (await response.json()) as OrderView[] | { error?: string };
        if (response.status === 401) {
          if (active) setNeedsSignIn(true);
          return [];
        }
        if (!response.ok) {
          throw new Error(
            !Array.isArray(result) && result.error
              ? result.error
              : 'Your orders are temporarily unavailable.'
          );
        }
        return result as OrderView[];
      })
      .then((items) => {
        if (active) setOrders(items);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : 'Your orders are temporarily unavailable.'
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="text-stone-500">Loading your orders...</p>;
  }
  if (needsSignIn) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-8">
        <h2 className="font-serif text-2xl">Sign in to see your purchases</h2>
        <p className="mt-2 text-stone-600">
          Sign in with your buyer account, then refresh this page to load your order history.
        </p>
      </div>
    );
  }
  if (error) {
    return <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error}</p>;
  }
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-8">
        <h2 className="font-serif text-2xl">Your story starts with a maker</h2>
        <p className="mt-2 text-stone-600">
          You haven&apos;t placed an order yet. Explore the collection to find something you love.
        </p>
        <Link
          className="mt-5 inline-flex rounded-full bg-[#173d34] px-6 py-3 text-sm font-semibold text-white hover:bg-[#24594c]"
          href="/"
        >
          Discover the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
