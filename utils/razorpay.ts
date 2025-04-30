//utils\razorpay.ts
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (amount: number) => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `order_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Error creating Razorpay order');
  }
};
