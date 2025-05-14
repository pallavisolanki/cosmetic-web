// pages/api/admin/users.ts
import connectDB from '../../../utils/db';
import User from "../../../models/User";
import { verifyTokenFromRequest } from "../../../utils/auth";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const isAdmin = await verifyTokenFromRequest(req);
  if (!isAdmin) return res.status(403).json({ error: "Not authorized" });

  await connectDB();

  const users = await User.find({},'fullName email role lastLogin');

  const usersData = users.map(user => ({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    lastLogin: user.lastLogin,
  }));

  res.status(200).json({ total: users.length, users: usersData });
}

