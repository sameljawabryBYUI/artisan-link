import Image from 'next/image';
import type { ProductView } from '@/lib/types';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function OrderSummary({
  product,
  onConfirm,
  submitting,
}: {
  product: ProductView;
  onConfirm: () => void;
  submitting: boolean;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-2xl">Your order</h2>
      <div className="mt-6 flex gap-4 border-b border-stone-200 pb-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#e8e4d8]">
          {product.imageUrl ? (
            <Image
              alt={product.title}
              className="object-cover"
              fill
              sizes="96px"
              src={product.imageUrl}
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-3xl text-[#8c9078]">
              A
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="font-serif text-xl">{product.title}</h3>
          <p className="mt-1 text-sm text-stone-500">By {product.artisanName}</p>
        </div>
        <p className="shrink-0 pt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
      </div>
      <div className="space-y-3 py-5 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatPrice(product.price)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Shipping</span>
          <span>Arranged with the artisan</span>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-4 text-base font-semibold text-stone-900">
          <span>Order total</span>
          <span>{formatPrice(product.price)}</span>
        </div>
      </div>
      <p className="mb-5 text-xs leading-5 text-stone-500">
        This request reserves your purchase. The artisan will follow up to arrange delivery and
        payment.
      </p>
      <button
        className="w-full rounded-full bg-[#173d34] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24594c] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={submitting}
        onClick={onConfirm}
        type="button"
      >
        {submitting ? 'Placing your order...' : 'Place order'}
      </button>
    </section>
  );
}
