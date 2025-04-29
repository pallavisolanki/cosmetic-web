// pages/order-success.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { saveOrderToRedux } from "@/store/orderSlice";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const OrderSuccessPage = () => {
  const order = useSelector((state: RootState) => state.order.lastOrder);
  const dispatch = useDispatch();
  const router = useRouter();

  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

  useEffect(() => {
    if (user?.email && order) {
      localStorage.setItem(`order_${user.email}`, JSON.stringify(order));
      dispatch(saveOrderToRedux(order));
    }
  }, [order, dispatch]);

  if (!order) {
    return <div className="p-6 text-center text-gray-500">No order found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold text-pink-600 cursor-pointer" onClick={() => router.push("/")}>
          <img
            src="/images/logo.png"
            alt="Cosmetics Store Logo"
            className="h-18 w-23 cursor-pointer"
          />
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="h-10 w-10 bg-pink-500 text-white flex items-center justify-center rounded-full font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </nav>

      {/* Order Success Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">🎉 Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your payment was successful. Below are the details of your order.
          </p>

          {/* Order Details */}
        <div className="space-y-4 text-left">
          {order.cartItems?.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
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
                <p className="text-sm font-bold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 text-right font-bold text-lg">
          Total Paid: ₹{order.total?.toFixed(2)}
        </div>
      </div>
          

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/profile")}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition font-medium"
            >
              Go to Profile
            </button>
          </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
