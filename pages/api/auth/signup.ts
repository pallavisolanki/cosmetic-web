//pages\api\auth\signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import connectDB from '../../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  const { fullName, email, password, role = 'user' } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Let Mongoose Middleware Handle Hashing
    const newUser = new User({ fullName, email, password, role });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return res.status(201).json({
      token,
      message: 'Signup successful',
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
