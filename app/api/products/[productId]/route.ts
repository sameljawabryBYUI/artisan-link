import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { requireArtisan } from '@/lib/product-auth';
import { hasContactMethod, readProductInput } from '@/lib/product-validation';
import { serializeProduct } from '@/lib/product-response';
import { ProductModel } from '@/models/Product';

type RouteContext = {
  params: Promise<{ productId: string }>;
};

function parseProductId(value: string): string | null {
  if (!/^[a-f\d]{24}$/i.test(value)) return null;
  return value;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { productId } = await params;
  const id = parseProductId(productId);
  if (!id) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const product = await ProductModel.findById(id).exec();
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error('Failed to retrieve product.', error);
    return NextResponse.json({ error: 'Unable to retrieve product.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { productId } = await params;
  const id = parseProductId(productId);
  if (!id) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  try {
    const authorization = await requireArtisan();
    if (!authorization.authorized) return authorization.response;

    const input = await readProductInput(request, true);
    if (!input.ok) return input.response;

    const product = await ProductModel.findOne({
      _id: id,
      artisanId: authorization.artisanId,
    }).exec();
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const email = input.value.email === undefined ? product.email : input.value.email || undefined;
    const whatsapp =
      input.value.whatsapp === undefined ? product.whatsapp : input.value.whatsapp || undefined;

    if (!hasContactMethod(email, whatsapp)) {
      return NextResponse.json(
        {
          error: 'Product validation failed.',
          fields: { contact: 'A valid WhatsApp number or email address must remain.' },
        },
        { status: 400 }
      );
    }

    const update = { ...input.value };
    const unset: Record<string, 1> = {};
    if (update.email === '') {
      delete update.email;
      unset.email = 1;
    }
    if (update.whatsapp === '') {
      delete update.whatsapp;
      unset.whatsapp = 1;
    }

    const updateDocument: {
      $set?: Record<string, string>;
      $unset?: Record<string, 1>;
      $inc: { __v: number };
    } = { $inc: { __v: 1 } };
    if (Object.keys(update).length > 0) updateDocument.$set = update;
    if (Object.keys(unset).length > 0) updateDocument.$unset = unset;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id, artisanId: authorization.artisanId, __v: product.__v },
      updateDocument,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product changed while it was being updated. Reload and try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(serializeProduct(updatedProduct));
  } catch (error) {
    console.error('Failed to update product.', error);
    return NextResponse.json({ error: 'Unable to update product.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { productId } = await params;
  const id = parseProductId(productId);
  if (!id) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  try {
    const authorization = await requireArtisan();
    if (!authorization.authorized) return authorization.response;

    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: id,
      artisanId: authorization.artisanId,
    }).exec();

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete product.', error);
    return NextResponse.json({ error: 'Unable to delete product.' }, { status: 500 });
  }
}
