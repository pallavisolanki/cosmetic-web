// pages/api/auth/me.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import connectDB from "../../../utils/db";
import User from "../../../models/User";

interface JwtPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId).select("fullName email role lastLogin");
    console.log("user info in ProfileSidebar:", user);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    });

  } catch (err) {
    // Check if token error is specifically "jwt expired"
    if (err instanceof jwt.TokenExpiredError) {
      // Clear the expired cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: -1, // deletes the cookie
        })
      );
      console.warn("JWT expired – clearing cookie");
    }

    return res.status(401).json({ error: "Invalid or expired token" });
  }
}


