import Link from 'next/link';
import type { Product } from './ProductTypes';

const priceFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductListProps = {
  products: Product[];
  deletingId: string | null;
  onDelete: (product: Product) => void;
};

export default function ProductList({ products, deletingId, onDelete }: ProductListProps) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-[#d9dde4] bg-white"
      aria-labelledby="product-list-title"
    >
      <div className="flex items-center justify-between border-b border-[#d9dde4] px-5 py-4">
        <h2 id="product-list-title" className="font-display text-lg font-semibold text-[#1b2433]">
          Your listings
        </h2>
        <span className="text-sm text-[#586274]">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </span>
      </div>
      <ul className="divide-y divide-[#d9dde4]">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-[#1b2433]">{product.title}</h3>
              {product.price !== undefined && (
                <p className="mt-1 text-sm font-semibold tabular-nums text-[#1b2433]">
                  {priceFormat.format(product.price)}
                </p>
              )}
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#586274]">
                {product.description}
              </p>
              {(product.category || product.country) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.category && (
                    <span className="rounded-full bg-[#e8edf6] px-2.5 py-1 text-xs font-semibold text-[#24427a]">
                      {product.category}
                    </span>
                  )}
                  {product.country && (
                    <span className="rounded-full bg-[#fbefd3] px-2.5 py-1 text-xs font-semibold text-[#1b2433]">
                      {product.country}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/dashboard/products/${encodeURIComponent(product._id)}/edit`}
                aria-label={`Edit ${product.title}`}
                className="inline-flex h-9 items-center rounded-lg border border-[#d9dde4] px-3 text-sm font-semibold text-[#1b2433] hover:bg-[#f6f6f3]"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete(product)}
                disabled={deletingId === product._id}
                aria-label={`Delete ${product.title}`}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-[#a23b32] hover:bg-[#a23b32]/10 disabled:cursor-wait disabled:opacity-60"
              >
                {deletingId === product._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
