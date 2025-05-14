// pages/api/admin/order/[orderId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../utils/db';
import Order from '../../../../models/Order';
import { verifyTokenFromRequest } from '../../../../utils/auth';
import { OrderStatus } from '../../../../src/types';

const allowedStatuses: OrderStatus[] = ['Pending', 'Shipped', 'Delivered'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await verifyTokenFromRequest(req);
  if (!isAdmin) return res.status(403).json({ error: 'Not authorized' });

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Failed to update order status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
