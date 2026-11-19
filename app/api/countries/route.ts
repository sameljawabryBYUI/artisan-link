import { connection } from 'next/server';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { ProductModel } from '@/models/Product';

export async function GET() {
  await connection();

  try {
    await connectToDatabase();
    const countries = await ProductModel.distinct('country');
    return NextResponse.json(countries.sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    console.error('Failed to list product countries.', error);
    return NextResponse.json({ error: 'Unable to list product countries.' }, { status: 500 });
  }
}
