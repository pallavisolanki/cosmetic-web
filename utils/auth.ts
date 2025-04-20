// utils/auth.ts

import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export function verifyTokenFromRequest(req: NextApiRequest) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  const token = tokenMatch[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}