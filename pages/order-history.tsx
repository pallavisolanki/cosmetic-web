//pages\order-history.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  loadOrderHistoryFromLocalStorage,
  deleteOrderFromHistory,
  clearOrderHistory,
} from "@/store/orderSlice";
import { Trash2, Trash } from "lucide-react";
import Link from "next/link";
import "../src/styles/globals.css";
import { ShoppingBag } from "lucide-react";
import Image from "next/image"; 

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.history);
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  useEffect(() => {
    if (user?.email) {
      dispatch(loadOrderHistoryFromLocalStorage(user.email));
    }
  }, [dispatch, user?.email]);

  const handleDeleteOrder = (orderId: string) => {
    if (
      user?.email &&
      confirm("Are you sure you want to delete this order?")
    ) {
      dispatch(deleteOrderFromHistory({ email: user.email, orderId }));
    }
  };

  const handleClearAll = () => {
    if (
      user?.email &&
      confirm("This will delete your entire order history. Continue?")
    ) {
      dispatch(clearOrderHistory(user.email));
    }
  };

  const uniqueOrders = useMemo(() => {
    const seen = new Set<string>();
    return orders.filter((order) => {
      if (seen.has(order.razorpay_order_id)) {
        return false;
      }
      seen.add(order.razorpay_order_id);
      return true;
    });
  }, [orders]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h1 className="text-4xl font-extrabold text-gray-800 text-center sm:text-left w-full">
              Order History
            </h1>

            {uniqueOrders.length > 0 && (
              <button
                onClick={handleClearAll}
                className="self-center sm:self-auto flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 font-medium text-sm border border-red-500 px-6 py-1 rounded-full transition-all duration-300 whitespace-nowrap"
              >
                <Trash size={18} />
                Clear All
              </button>
            )}
          </div>

          {(!uniqueOrders || uniqueOrders.length === 0) ? (
            <div className="text-center text-gray-600 mt-20">
              <div className="flex flex-col items-center justify-center py-24 px-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
                <ShoppingBag size={48} className="text-pink-500 mb-6" />
                <h2 className="text-2xl font-bold mb-3 text-gray-700">No Orders Yet</h2>
                <p className="mb-6 text-gray-500 text-sm">Looks like you haven’t placed any orders yet. Shop now!</p>
                <Link
                  href="/"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {uniqueOrders.map((order) => (
                <div
                  key={order.razorpay_order_id}
                  className="bg-white p-8 rounded-2xl shadow-xl relative group hover:shadow-2xl transition-all duration-300"
                >
                  <button
                    onClick={() => handleDeleteOrder(order.razorpay_order_id)}
                    className="absolute top-6 right-6 text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-full transition"
                    title="Delete this order"
                  >
                    <Trash2 size={18} />
                  </button>

                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    Order ID: <span className="text-pink-500">{order.razorpay_order_id}</span>
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">
                    Payment ID: {order.razorpay_payment_id}
                  </p>
                  <p className="text-lg font-semibold text-gray-700 mb-4">
                    Total Paid: ₹{order.total}
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">Items</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-white border relative">
                          <Image
                            src={item.image || "/default-product.png"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;
