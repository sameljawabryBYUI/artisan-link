'use client';

// Image provides Next.js image optimization and responsive image rendering.
import Image from 'next/image';
// Link provides client-side navigation between pages.
import Link from 'next/link';
// useEffect runs the product request after mounting; useState stores component data.
import { useEffect, useState } from 'react';
// ProductView defines the product fields returned by the API.
import type { ProductView } from '@/lib/types';

// formatPrice converts a numeric price into a US-dollar currency string.
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// ProductDetail receives a product ID and renders that product's details.
export default function ProductDetail({ productId }: { productId: string }) {
  // product holds the loaded product or null while it is unavailable.
  const [product, setProduct] = useState<ProductView | null>(null);
  // error stores a message when loading or displaying the product fails.
  const [error, setError] = useState('');

  // useEffect loads the product whenever the productId prop changes.
  useEffect(() => {
    // active prevents state updates if the component unmounts before the request finishes.
    let active = true;
    // fetch requests the product record from the product API route.
    fetch(`/api/products/${encodeURIComponent(productId)}`)
      .then(async (response) => {
        // Parse the JSON response and narrow its expected shape.
        const result = (await response.json()) as ProductView | { error?: string };
        // Throw an API error message when the response is not successful.
        if (!response.ok) {
          throw new Error('error' in result ? result.error : 'This product is unavailable.');
        }
        // Return the successful product data for the next promise handler.
        return result as ProductView;
      })
      .then((item) => {
        // Store the product only if this request is still active.
        if (active) setProduct(item);
      })
      .catch((cause: unknown) => {
        // Store an Error message or a fallback when loading fails.
        if (active) {
          setError(cause instanceof Error ? cause.message : 'This product is unavailable.');
        }
      });

    // Cleanup marks the request inactive when the component unmounts or productId changes.
    return () => {
      active = false;
    };
  }, [productId]);

  // Render the page structure for navigation and product states.
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
      {/* Link returns the shopper to the collection page. */}
      <Link className="text-sm font-semibold text-[#315e50] hover:underline" href="/">
        Back to the collection
      </Link>
      {/* These conditional branches render the error, loading, or success state. */}
      {error ? (
        <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">{error}</p>
      ) : !product ? (
        <p className="mt-8 text-stone-500">Loading product details...</p>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
          {/* This image panel renders the product image or a text fallback. */}
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#e8e4d8]">
            {/* This branch renders the image or a fallback letter. */}
            {product.imageUrl ? (
              <Image
                alt={product.title}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                src={product.imageUrl}
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center font-serif text-8xl text-[#8c9078]">
                A
              </div>
            )}
          </div>
          {/* This details section presents the artisan, name, description, and purchase link. */}
          <section>
            {/* Artisan name identifies who created the product. */}
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#77765d]">
              Crafted by {product.artisanName}
            </p>
            {/* h1 renders the product title as the page heading. */}
            <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              {product.title}
            </h1>
            {/* This paragraph preserves line breaks in the product description. */}
            <p className="mt-5 whitespace-pre-line leading-7 text-stone-600">
              {product.description}
            </p>
            {/* formatPrice formats and renders the product's numeric price. */}
            <p className="mt-8 font-serif text-3xl text-[#173d34]">{formatPrice(product.price)}</p>
            {/* This checkout link starts the purchase flow for the current product. */}
            <Link
              className="mt-7 inline-flex rounded-full bg-[#173d34] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24594c]"
              href={`/checkout/${product.id}`}
            >
              Continue to checkout
            </Link>
          </section>
        </div>
      )}
    </main>
  );
}
