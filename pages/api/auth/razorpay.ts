import { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// API route handler for Razorpay order creation
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Ensure the necessary environment variables are present
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Missing Razorpay credentials in environment variables.");
    return res.status(500).json({ message: "Internal server error: Razorpay credentials not found." });
  }

  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    const options = {
      amount: amount * 100, // Convert to paise (Razorpay accepts amounts in paise)
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).slice(2)}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error instanceof Error ? error.message : error,
    });
  }
}
