//pages/cart.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileNavbar from "../src/components/ProfileNavbar";
import { useCartSync } from "../src/hooks/useCartSync";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // ✅ Refresh cart on storage change (login sync or manual updates)
  useEffect(() => {
    const loadCartFromStorage = () => {
      const local = localStorage.getItem("profileCart");
      setCartItems(local ? JSON.parse(local) : []);
    };

    window.addEventListener("storage", loadCartFromStorage);
    loadCartFromStorage(); // call once on mount
    return () => window.removeEventListener("storage", loadCartFromStorage);
  }, []);

  useCartSync(cartItems, setCartItems);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(parseFloat(newTotal.toFixed(2)));
  }, [cartItems]);

  const updateCartStorage = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("profileCart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartStorage(updatedCart);
  };

  const decreaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    updateCartStorage(updatedCart);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateCartStorage(updatedCart);
  };

  return (
    <>
      <ProfileNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Bag</h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty 🛒</p>
            <Link href="/" className="text-pink-600 font-medium hover:underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* LEFT: Product List */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 object-contain rounded-xl"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-md text-gray-700 font-semibold">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center space-x-2 border px-2 py-1 rounded">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="cursor-pointer text-lg px-1"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="cursor-pointer text-lg px-1"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-pink-500 font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Summary Panel */}
            <div className="bg-white rounded-2xl shadow-md p-6 h-fit space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Calculated Shipping</h2>
                <div className="flex flex-col gap-2">
                  <select className="border px-2 py-1 rounded">
                    <option>Country</option>
                    <option>India</option>
                  </select>
                  <div className="flex gap-2">
                    <select className="border px-2 py-1 rounded w-1/2">
                      <option>State / City</option>
                    </select>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      className="border px-2 py-1 rounded w-1/2"
                    />
                  </div>
                  <button className="bg-black text-white py-2 rounded">Update</button>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-lg">Cart Total</h3>
                <div className="flex justify-between text-sm">
                  <span>Cart Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span className="text-red-500">-₹4.00</span>
                </div>
                <div className="flex justify-between font-semibold text-md">
                  <span>Cart Total</span>
                  <span>₹{Math.max(0, total - 4).toFixed(2)}</span>
                </div>
                <button className="bg-black text-white w-full py-2 mt-3 rounded">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
