//baackend
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import connectDB from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Compare Password Using Schema Method
    console.log("Comparing Password using Schema Method...");
    const isMatch = await user.comparePassword(password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token, message: 'Login successful' });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
