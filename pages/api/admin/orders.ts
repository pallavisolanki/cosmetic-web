// pages/api/admin/orders.ts
import Order from "../../../models/Order"; // assuming you have this
import connectDB from '../../../utils/db';
import { verifyTokenFromRequest } from "../../../utils/auth";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await verifyTokenFromRequest(req);
  
  if (req.method !== 'GET') return res.status(405).end();

  if (!isAdmin) return res.status(403).json({ error: "Not authorized" });

  await connectDB();
  const orders = await Order.find({});
  const delivered = orders.filter(o => o.status === "Delivered").length;
  res.status(200).json({ total: orders.length, delivered, orders });
}
