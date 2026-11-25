'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ProductView } from '@/lib/types';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then(async (response) => {
        if (!response.ok) {
          const result = (await response.json()) as { error?: string };
          throw new Error(result.error || 'Products are temporarily unavailable.');
        }
        return (await response.json()) as ProductView[];
      })
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : 'Products are temporarily unavailable.'
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

  return (
    <section aria-labelledby="catalog-heading">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#77765d]">
            The collection
          </p>
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl" id="catalog-heading">
            Find something meaningful
          </h2>
        </div>
        {!loading && !error && (
          <p className="text-sm text-stone-500">
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </p>
        )}
      </div>

      {loading ? (
        <p className="rounded-2xl border border-stone-200 bg-white p-8 text-stone-500">
          Finding handmade pieces...
        </p>
      ) : error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error}</p>
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-stone-200 bg-white p-8 text-stone-600">
          No products are available yet. Check back soon to discover work from our makers.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              key={product.id}
            >
              <Link
                aria-label={`View ${product.title}`}
                className="relative block aspect-[4/3] overflow-hidden bg-[#e8e4d8]"
                href={`/products/${product.id}`}
              >
                {product.imageUrl ? (
                  <Image
                    alt={product.title}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={product.imageUrl}
                    unoptimized
                  />
                ) : (
                  <div
                    aria-label={`${product.title} handmade product`}
                    className="flex h-full items-center justify-center font-serif text-5xl text-[#8c9078]"
                    role="img"
                  >
                    A
                  </div>
                )}
              </Link>
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
                  By {product.artisanName}
                </p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl leading-tight">{product.title}</h3>
                  <span className="shrink-0 pt-1 text-sm font-semibold text-[#173d34]">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-stone-600">
                  {product.description}
                </p>
                <Link
                  className="mt-5 inline-flex rounded-full border border-[#173d34] px-5 py-2.5 text-sm font-semibold text-[#173d34] transition hover:bg-[#173d34] hover:text-white"
                  href={`/products/${product.id}`}
                >
                  View piece
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
