// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure it's a POST request
  if (req.method === 'POST') {
    // Set the token cookie with Max-Age=0 to expire it
    res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict;Secure');

    // Respond with a success message
    return res.status(200).json({
      message: 'Logged out successfully. Please clear the cart on the client side.',
    });
  }

  // If it's not a POST request, return an error
  return res.status(405).json({ message: 'Method Not Allowed' });
}
