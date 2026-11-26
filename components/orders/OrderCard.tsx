import Image from 'next/image';
import type { OrderView } from '@/lib/types';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function OrderCard({ order }: { order: OrderView }) {
  const createdAt = new Date(order.createdAt);

  return (
    <article className="grid gap-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-[9rem_1fr] sm:p-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8e4d8] sm:aspect-square">
        {order.product?.imageUrl ? (
          <Image
            alt={order.product.title}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, 144px"
            src={order.product.imageUrl}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-4xl text-[#8c9078]">
            A
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
            Ordered{' '}
            {Number.isNaN(createdAt.getTime())
              ? 'date unavailable'
              : createdAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
        <h2 className="mt-3 font-serif text-2xl">
          {order.product?.title || 'Product no longer available'}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {order.product?.artisanName || 'Artisan information unavailable'}
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-stone-600">Order #{order.id.slice(-8)}</p>
          {order.product && (
            <p className="font-semibold text-[#173d34]">{formatPrice(order.product.price)}</p>
          )}
        </div>
      </div>
    </article>
  );
}
