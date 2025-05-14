// pages/api/admin/check.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '../../../adminMiddleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await verifyAdmin(req, res);
  if (!isAdmin) return;
  res.status(200).json({ message: 'Authorized as admin' });
}
