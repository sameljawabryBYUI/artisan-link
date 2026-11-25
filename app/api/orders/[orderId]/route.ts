import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Order from '@/lib/models/Order';

const allowedStatuses = ['pending', 'shipped', 'completed'] as const;

function isValidStatus(value: unknown): value is (typeof allowedStatuses)[number] {
  return typeof value === 'string' && allowedStatuses.includes(value as (typeof allowedStatuses)[number]);
}

async function getAuthorizedOrder(orderId: string, userId: string) {
  await connectToDatabase();
  if (!mongoose.isObjectIdOrHexString(orderId)) return null;

  const order = await Order.findById(orderId).populate({
    path: 'productId',
    select: 'artisanId',
  });
  if (!order) return null;

  const buyerId = order.buyerId.toString();
  const product = order.productId as unknown as { artisanId: mongoose.Types.ObjectId };
  const isBuyer = buyerId === userId;
  const isArtisan = product?.artisanId?.toString() === userId;

  if (!isBuyer && !isArtisan) return null;
  return order;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const { orderId } = await params;
  const order = await getAuthorizedOrder(orderId, session.user.id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found or access denied.' }, { status: 404 });
  }

  const populated = await order.populate({
    path: 'productId',
    populate: { path: 'artisanId', select: 'name' },
  });
  const product = populated.productId as unknown as {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    artisanId?: { name?: string };
  } | null;

  return NextResponse.json({
    id: populated._id.toString(),
    status: populated.status,
    createdAt: populated.createdAt.toISOString(),
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
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: { status?: unknown };
  try {
    body = (await request.json()) as { status?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  if (!isValidStatus(body.status)) {
    return NextResponse.json(
      { error: 'Status must be pending, shipped, or completed.' },
      { status: 400 }
    );
  }

  const { orderId } = await params;
  const order = await getAuthorizedOrder(orderId, session.user.id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found or access denied.' }, { status: 404 });
  }

  order.status = body.status;
  await order.save();

  return NextResponse.json({
    id: order._id.toString(),
    status: order.status,
  });
}
