// models/Cart.ts
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        id: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    savedItems: [
      {
        id: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
