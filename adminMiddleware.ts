// utils/adminMiddleware.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import User from './models/User';
import connectDB from './utils/db';

function sendError(res: NextApiResponse, code: number, message: string) {
  if (!res.headersSent) {
    res.status(code).json({ message });
  }
  return false;
}

export async function verifyAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  await connectDB();

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) return sendError(res, 401, 'Unauthorized: No token provided');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) return sendError(res, 404, 'User not found');

    if (user.role !== 'admin') return sendError(res, 403, 'Forbidden: Admins only');

    return true;
  } catch (err) {
    console.error('JWT verification error:', err);
    return sendError(res, 401, 'Invalid or expired token');
  }
}

