import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { requireArtisan } from '@/lib/product-auth';
import { readProductInput } from '@/lib/product-validation';
import { serializeProduct } from '@/lib/product-response';
import { ProductModel } from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const filter: { category?: string; country?: string } = {};
    const category = searchParams.get('category')?.trim();
    const country = searchParams.get('country')?.trim();

    if (category) filter.category = category;
    if (country) filter.country = country;

    const products = await ProductModel.find(filter).sort({ createdAt: -1 }).exec();
    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    console.error('Failed to list products.', error);
    return NextResponse.json({ error: 'Unable to list products.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authorization = await requireArtisan();
    if (!authorization.authorized) return authorization.response;

    const input = await readProductInput(request, false);
    if (!input.ok) return input.response;

    const product = await ProductModel.create({
      ...input.value,
      artisanId: authorization.artisanId,
      artisanName: authorization.artisanName,
      email: input.value.email || undefined,
      whatsapp: input.value.whatsapp || undefined,
    });

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error('Failed to create product.', error);
    return NextResponse.json({ error: 'Unable to create product.' }, { status: 500 });
  }
}
