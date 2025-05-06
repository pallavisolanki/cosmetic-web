// utils/paymentHandler.ts

import { Dispatch } from "redux";
import { saveOrderToRedux } from "../src/store/orderSlice";  
import { replaceCart } from "../src/store/cartSlice"; 

const loadRazorpayScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById("razorpay-script")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
};

export const handlePayment = async ({
  total,
  cartItems,
  product,
  quantity,
  dispatch,
  router,
  isBuyNow = true,
}: {
  total: number;
  cartItems: any[];
  product?: any;
  quantity?: number;
  dispatch: Dispatch;
  router: any;
  isBuyNow?: boolean;
}) => {
  const buyNowItem = isBuyNow ? { ...product, quantity } : null;

  const payload = isBuyNow
    ? [{ productId: product.id, quantity, price: product.price }]
    : cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

  try {
    await loadRazorpayScript();

    const orderRes = await fetch("/api/auth/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const orderData = await orderRes.json();

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_4qcMk3FdOe1seg",
      amount: orderData.amount,
      currency: "INR",
      name: "Your Brand",
      description: isBuyNow ? "Buy Now Payment" : "Cart Payment",
      order_id: orderData.id,
      handler: async (response: RazorpayResponse) => {
        const verifyRes = await fetch("/api/auth/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.verified) {
          // Save order to DB
          await fetch("/api/auth/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              totalAmount: total,
              products: payload,
            }),
          });

          dispatch(
            saveOrderToRedux({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              total,
              cartItems: isBuyNow ? [buyNowItem] : cartItems,
            })
          );

          if (!isBuyNow) {
            dispatch(replaceCart([]));

            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user?.email) {
              localStorage.removeItem(`cart_${user.email}`);
            }
          }

          router.push("/order-success");
        } else {
          alert("Payment verification failed. Please contact support.");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay!(options);
    razorpay.open();
  } catch (err) {
    console.error("Payment failed:", err);
    alert("Payment failed. Please try again.");
  }
};

