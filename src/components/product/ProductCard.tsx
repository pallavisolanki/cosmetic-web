"use client";

import Image from "next/image";
import { Product } from "../../types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addToCart, replaceCart } from "../../store/cartSlice";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not logged in");

      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user?.email) throw new Error("User not found in localStorage");

      const cartKey = `cart_${user.email}`;
      const existingCart: any[] = JSON.parse(localStorage.getItem(cartKey) || "[]");

      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);

      let updatedCart;

      if (existingItemIndex !== -1) {
        // ✅ Product exists → increase quantity
        existingCart[existingItemIndex].quantity += 1;
        updatedCart = [...existingCart];
        toast(`${product.name} quantity increased`, { icon: "➕" });
      } else {
        // ✅ Product doesn't exist → add new item
        const cartItem = { ...product, quantity: 1 };
        updatedCart = [...existingCart, cartItem];
        toast.success(`${product.name} added to cart`);
      }

      // ✅ Update localStorage & Redux
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      localStorage.setItem("profileCart", JSON.stringify(updatedCart));
      dispatch(replaceCart(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      router.push("/login");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-pink-400 transition-all duration-300 transform hover:scale-105 h-[320px] flex flex-col justify-between">
      <div>
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={160}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="mt-3 text-center space-y-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-pink-600 font-medium">₹{product.price}</p>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-2 w-full bg-pink-500 text-white text-sm py-2 rounded-md hover:bg-pink-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
