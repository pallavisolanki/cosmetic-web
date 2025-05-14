//pages\api\auth\razorpay.ts
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
    console.log("Received amount:", amount);

    // Validate the amount parameter
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    // Razorpay expects the amount in paise (1 INR = 100 paise)
    const amountInPaise = amount * 100;

    const options = {
      amount: amountInPaise, // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).slice(2)}`,
    };

    // Attempt to create a Razorpay order
    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    // Log the error more clearly
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Return a more descriptive error message
    return res.status(500).json({
      message: "Failed to create Razorpay order",
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined, // Optional for debugging
    });
  }
}
