// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Order extends Document {
  user: mongoose.Types.ObjectId;
  products: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: 'Pending' | 'Shipped' | 'Delivered';  // ✅ Added
  createdAt: Date;
}

const OrderSchema = new Schema<Order>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
  },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],  // ✅ Allowed values
    default: 'Pending',                         // ✅ Default value
  },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;