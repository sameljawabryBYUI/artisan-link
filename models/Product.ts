import { model, models, Schema, Types } from 'mongoose';

export interface Product {
  artisanId: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductSchema = new Schema<Product>({
  artisanId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
});

export const ProductModel =
  models.Product ?? model<Product>('Product', ProductSchema);
