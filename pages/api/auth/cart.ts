//page/api/auth/cart.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/db';
import CartModel from '../../../models/Cart';
import { verifyTokenFromRequest } from '../../../utils/auth';

interface DecodedUser {
  _id: string;
  email: string;
  fullName: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const user = verifyTokenFromRequest(req) as DecodedUser | null;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === 'POST') {
    const { cartItems, savedItems } = req.body;

    try {
      await CartModel.findOneAndUpdate(
        { userId: user._id },
        { items: cartItems, savedItems },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error updating cart:", err);
      return res.status(500).json({ error: "Failed to update cart" });
    }
  }

  if (req.method === 'GET') {
    try {
      const cart = await CartModel.findOne({ userId: user._id });
      return res.status(200).json({
        cartItems: cart?.items || [],
        savedItems: cart?.savedItems || [],
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({ error: "Failed to fetch cart" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
