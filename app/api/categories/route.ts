import { connection } from 'next/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { ProductModel } from '@/models/Product';

export async function GET() {
  await connection();

  try {
    await connectToDatabase();
    const categories = await ProductModel.distinct('category');
    return NextResponse.json(categories.sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    console.error('Failed to list product categories.', error);
    return NextResponse.json({ error: 'Unable to list product categories.' }, { status: 500 });
  }
}
