// pages/checkout.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { replaceCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { handlePayment } from "../utils/paymentHandler"; 


const CheckoutPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [total, setTotal] = useState(0);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [loading] = useState(false);

  const retryLoadScript = () => {
    const scriptId = "razorpay-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement;

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded (retried)");
      setIsRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error("Still failed to load Razorpay script.");
      alert("Still failed to load Razorpay. Please try again later.");
      setIsRazorpayLoaded(false);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.email) {
      const localCart = localStorage.getItem(`cart_${user.email}`);
      if (localCart) {
        dispatch(replaceCart(JSON.parse(localCart)));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discountedTotal = Math.max(0, totalAmount - 4);
    setTotal(discountedTotal);
  }, [cartItems]);

  useEffect(() => {
    const scriptId = "razorpay-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement;

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay script loaded");
        setIsRazorpayLoaded(true);
      };

      script.onerror = () => {
        console.error("Initial load failed. Retrying...");
        retryLoadScript();
      };

      document.body.appendChild(script);
    } else {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
      } else {
        setIsRazorpayLoaded(true); 
      }
    }
  }, []);

  const proceedToPayment = () => {
    if (!isRazorpayLoaded) {
      retryLoadScript();
      return;
    }
  
    handlePayment({
      total,
      cartItems,
      dispatch,
      router,
      isBuyNow: false, 
    });
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl p-4 shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={proceedToPayment}
              className={`mt-6 w-full bg-black text-white py-2 rounded-xl hover:bg-pink-600 transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || !isRazorpayLoaded}
            >
              {loading ? "Processing Payment..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
