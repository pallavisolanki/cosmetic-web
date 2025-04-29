//pages\api\auth\me.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import connectDB from "../../../utils/db";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  
  try {
    // ✅Parse cookies from the request header
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

    // 🔒If no token, user is not authenticated
    if (!token) {
      console.warn("No token found in cookies.");
      return res.status(401).json({ error: "Not authenticated" });
    }

    // ✅Verify token and decode payload
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // ✅Fetch user from DB using ID in token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.warn("User not found for decoded token:", decoded);
      return res.status(404).json({ error: "User not found" });
    }

    // ✅Send user data
    return res.status(200).json({
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err: any) {
    console.error("Token verification failed:", err.message || err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
