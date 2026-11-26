'use client';

import { useEffect, useState } from 'react';
import ProductList from './ProductList';
import ProductManagementHeader from './ProductManagementHeader';
import {
  ProductEmptyState,
  ProductLoadErrorState,
  ProductLoadingState,
} from './ProductManagementStates';
import type { Product } from './ProductTypes';

type LoadError = {
  message: string;
  status?: number;
};

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

const PRODUCTS_ENDPOINT = '/api/products/mine';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value._id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    (value.category === undefined || typeof value.category === 'string') &&
    (value.country === undefined || typeof value.country === 'string') &&
    (value.artisanName === undefined || typeof value.artisanName === 'string') &&
    (value.price === undefined || typeof value.price === 'number') &&
    (value.imageUrl === undefined || typeof value.imageUrl === 'string')
  );
}

async function responseError(response: Response): Promise<string> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return `Request failed (${response.status}). Please try again.`;
  }

  if (isRecord(body) && typeof body.error === 'string') {
    return body.error;
  }

  return `Request failed (${response.status}). Please try again.`;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<LoadError | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_ENDPOINT, { cache: 'no-store' });
        if (!response.ok) {
          throw new ApiError(await responseError(response), response.status);
        }

        const body: unknown = await response.json();
        if (!Array.isArray(body) || !body.every(isProduct)) {
          throw new Error('The product list response was invalid. Please try again.');
        }

        if (active) setProducts(body);
      } catch (error) {
        if (active) {
          setLoadingError({
            message:
              error instanceof Error
                ? error.message
                : 'Unable to load your products. Please try again.',
            status: error instanceof ApiError ? error.status : undefined,
          });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete "${product.title}"? This action cannot be undone.`)) {
      return;
    }

    setActionError(null);
    setDeletingId(product._id);
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(product._id)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }

      setProducts((current) => current.filter((item) => item._id !== product._id));
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Unable to delete this product. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main>
      {!isLoading && !loadingError && <ProductManagementHeader />}
      {actionError && (
        <p
          className="mb-5 rounded-lg border border-[#a23b32]/30 bg-white px-4 py-3 text-sm text-[#a23b32]"
          role="alert"
        >
          {actionError}
        </p>
      )}
      {isLoading ? (
        <ProductLoadingState />
      ) : loadingError ? (
        <ProductLoadErrorState error={loadingError} />
      ) : products.length === 0 ? (
        <ProductEmptyState />
      ) : (
        <ProductList products={products} deletingId={deletingId} onDelete={deleteProduct} />
      )}
    </main>
  );
}
