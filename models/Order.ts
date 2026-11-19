import { model, models, Schema, Types } from 'mongoose';

export interface Order {
  buyerId: Types.ObjectId;
  productId: Types.ObjectId;
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema<Order>({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export const OrderModel = models.Order ?? model<Order>('Order', OrderSchema);
