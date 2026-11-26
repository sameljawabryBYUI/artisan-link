import Checkout from '@/components/Checkout';
import { Suspense } from 'react';

export default function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf8f3] px-6 py-16 text-stone-500">
          Preparing checkout...
        </main>
      }
    >
      <CheckoutContent params={params} />
    </Suspense>
  );
}

async function CheckoutContent({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return <Checkout productId={productId} />;
}
