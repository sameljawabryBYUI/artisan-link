import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import type { ProductCardData } from '@/app/ui/product-card';

export type FeaturedProducts = {
  products: ProductCardData[];
  /** True while the home page shows example listings instead of real ones. */
  isSample: boolean;
};

/*
 * Example listings, shown until the database models are merged into main.
 * The people and products are fictional; the photos are CC0 (docs/image-credits.md).
 */
const SAMPLE_PRODUCTS: ProductCardData[] = [
  {
    _id: 'sample-textiles',
    title: 'Hand cross-stitched table runner',
    price: 48,
    imageUrl: '/images/categories/textiles.webp',
    category: 'textiles',
    country: 'Guatemala',
    artisanName: 'Ana Lucía Flores',
  },
  {
    _id: 'sample-ceramics',
    title: 'Wheel-thrown terracotta vase',
    price: 35,
    imageUrl: '/images/categories/ceramics.webp',
    category: 'ceramics',
    country: 'India',
    artisanName: 'Ravi Prajapati',
  },
  {
    _id: 'sample-woodwork',
    title: 'Hand-carved walnut wall panel',
    price: 220,
    imageUrl: '/images/categories/woodwork.jpg',
    category: 'woodwork',
    country: 'Türkiye',
    artisanName: 'Mehmet Yıldız',
  },
  {
    _id: 'sample-jewelry',
    title: 'Felted berry bead necklace',
    price: 28,
    imageUrl: '/images/categories/jewelry.webp',
    category: 'jewelry',
    country: 'Finland',
    artisanName: 'Elina Virtanen',
  },
];

/**
 * The newest products for the home page.
 *
 * Cached so the home page stays prerendered; tagged 'products' so the product
 * API can refresh it with updateTag('products') after a create, edit or delete.
 *
 * TODO(after feature-database-setup is merged): replace the return below with
 *
 *   await connectToDatabase();               // from '@/lib/mongoose'
 *   const docs = await ProductModel.find()   // from '@/models/Product'
 *     .sort({ createdAt: -1 })
 *     .limit(limit)
 *     .lean();
 *   return {
 *     products: docs.map((doc) => ({ ...doc, _id: String(doc._id), artisanId: String(doc.artisanId) })),
 *     isSample: false,
 *   };
 *
 * and delete SAMPLE_PRODUCTS. Nothing else on the home page changes.
 */
export async function getFeaturedProducts(limit = 4): Promise<FeaturedProducts> {
  'use cache';
  cacheLife('hours');
  cacheTag('products');

  return { products: SAMPLE_PRODUCTS.slice(0, limit), isSample: true };
}
