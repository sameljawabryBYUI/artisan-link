import Image from 'next/image';
import Link from 'next/link';

/**
 * The fields a card needs. Same names as `ProductDTO` in types/index.ts
 * (feature-database-setup), so a ProductDTO can be passed in directly.
 * `category`, `country` and `artisanName` are optional until the Product
 * model has them (see the "Add category and country" issue).
 */
export type ProductCardData = {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  country?: string;
  artisanName?: string;
};

const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** One product in a grid. The whole card links to the product's detail page. */
export function ProductCard({ product }: { product: ProductCardData }) {
  // Local images (/images/...) go through Next's optimizer. Remote URLs skip it until
  // their host is added to images.remotePatterns in next.config.ts.
  const isLocalImage = product.imageUrl.startsWith('/');

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cotton">
        <Image
          src={product.imageUrl}
          alt=""
          fill
          unoptimized={!isLocalImage}
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {(product.category || product.country) && (
          <div className="flex flex-wrap gap-1.5">
            {product.category && (
              <span className="rounded-full bg-indigo-tint px-2.5 py-0.5 text-xs font-semibold text-indigo">
                {capitalize(product.category)}
              </span>
            )}
            {product.country && (
              <span className="rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-semibold text-ink">
                {product.country}
              </span>
            )}
          </div>
        )}
        <h3 className="font-display text-lg leading-snug font-semibold group-hover:text-indigo">
          {product.title}
        </h3>
        {product.artisanName && <p className="text-sm text-muted">by {product.artisanName}</p>}
        <p className="mt-auto pt-2 font-semibold tabular-nums">
          {priceFormat.format(product.price)}
        </p>
      </div>
    </Link>
  );
}
