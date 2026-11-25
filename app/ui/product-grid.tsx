import type { ReactNode } from 'react';
import { ProductCard, type ProductCardData } from './product-card';

type ProductGridProps = {
  products: ProductCardData[];
  /** 3 for the catalog (/products), 4 for compact rows like the home page. */
  columns?: 3 | 4;
  /** Shown instead of the grid when there are no products (FR-009). */
  emptyState?: ReactNode;
};

const columnClasses = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

/** Responsive grid of ProductCards: 1 column on phones, 2 from `sm`, 3 or 4 from `lg`. */
export function ProductGrid({ products, columns = 3, emptyState }: ProductGridProps) {
  if (products.length === 0) return <>{emptyState ?? null}</>;

  return (
    <ul className={`grid gap-6 ${columnClasses[columns]}`}>
      {products.map((product) => (
        <li key={product._id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
