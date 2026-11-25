import AccountHeader from '@/components/AccountHeader';
import ProductDetail from '@/components/ProductDetail';
import { Suspense } from 'react';

export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf8f3] px-6 py-16 text-stone-500">
          Loading product...
        </main>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return (
    <div className="min-h-screen bg-[#faf8f3] text-stone-900">
      <AccountHeader />
      <ProductDetail productId={productId} />
    </div>
  );
}
