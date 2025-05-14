// utils/auth.ts

import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

// Define the interface for the decoded token
export interface DecodedToken {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export function verifyTokenFromRequest(req: NextApiRequest): DecodedToken | null {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return null;

  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  const token = tokenMatch[1];

  try {
    // Ensure that the token is verified and cast to the correct type
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
