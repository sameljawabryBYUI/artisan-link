import { connection, NextResponse } from 'next/server';
import { requireArtisan } from '@/lib/product-auth';
import { serializeProduct } from '@/lib/product-response';
import { ProductModel } from '@/models/Product';

export async function GET() {
  await connection();

  try {
    const authorization = await requireArtisan();
    if (!authorization.authorized) return authorization.response;

    const products = await ProductModel.find({
      artisanId: authorization.artisanId,
    })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(products.map(serializeProduct), {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error('Failed to list artisan products.', error);
    return NextResponse.json({ error: 'Unable to list your products.' }, { status: 500 });
  }
}
