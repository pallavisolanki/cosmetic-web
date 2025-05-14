//pages\api\auth\orders.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OrderModel from '../../../models/Order';
import connectDB from '../../../utils/db';
import { verifyTokenFromRequest } from '../../../utils/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { razorpayOrderId, razorpayPaymentId, totalAmount, products } = req.body;

    // Call verifyTokenFromRequest and check for null
    const decodedToken = verifyTokenFromRequest(req);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Now TypeScript knows that decodedToken has the userId property
    const userId: string = decodedToken.userId;

    try {
      await connectDB();

      // Create a new order
      const newOrder = new OrderModel({
        user: userId, 
        products,
        totalAmount,
        paymentStatus: 'pending',
        razorpayOrderId,
        razorpayPaymentId,
      });

      const order = await newOrder.save();
      return res.status(200).json(order);
    } catch (error) {
      console.error('Error saving order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
