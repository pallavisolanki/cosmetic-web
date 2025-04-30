// pages/api/auth/me.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import connectDB from "../../../utils/db";
import User from "../../../models/User";

// ✅ Define the expected shape of JWT payload
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
      console.warn("No token found in cookies.");
      return res.status(401).json({ error: "Not authenticated" });
    }

    // ✅ Use the correct type for decoded token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.warn("User not found for decoded token:", decoded);
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    // ✅ Use 'unknown' then narrow down to Error safely
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
