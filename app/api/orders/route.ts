import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (session.user.role !== 'buyer') {
    return NextResponse.json({ error: 'Only buyers can view purchases.' }, { status: 403 });
  }

  await connectToDatabase();
  const orders = await Order.find({ buyerId: session.user.id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'productId',
      populate: { path: 'artisanId', select: 'name' },
    })
    .lean();

  return NextResponse.json(
    orders.map((order) => {
      const product = order.productId as unknown as {
        _id: mongoose.Types.ObjectId;
        title: string;
        description: string;
        price: number;
        imageUrl?: string;
        artisanId?: { name?: string };
      } | null;

      return {
        id: order._id.toString(),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        product: product
          ? {
              id: product._id.toString(),
              title: product.title,
              description: product.description,
              price: product.price,
              imageUrl: product.imageUrl ?? null,
              artisanName: product.artisanId?.name ?? 'Artisan',
            }
          : null,
      };
    })
  );
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (session.user.role !== 'buyer') {
    return NextResponse.json({ error: 'Only buyers can place orders.' }, { status: 403 });
  }

  let body: { productId?: unknown };
  try {
    body = (await request.json()) as { productId?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body.productId !== 'string' || !mongoose.isObjectIdOrHexString(body.productId)) {
    return NextResponse.json({ error: 'A valid productId is required.' }, { status: 400 });
  }

  await connectToDatabase();
  const buyer = await User.findById(session.user.id);
  if (!buyer || buyer.role !== 'buyer') {
    return NextResponse.json({ error: 'Buyer account is required.' }, { status: 403 });
  }

  const product = await Product.findById(body.productId).select('_id');
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  const order = await Order.create({
    buyerId: buyer._id,
    productId: product._id,
    status: 'pending',
  });

  return NextResponse.json({ id: order._id.toString() }, { status: 201 });
}
