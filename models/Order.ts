//models\Order.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Order extends Document {
  userId: string;
  products: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: Date;
}

const OrderSchema = new Schema<Order>({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true, enum: ['pending', 'completed', 'failed'] },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;
