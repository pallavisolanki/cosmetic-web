"use client";

import Image from "next/image";
import { Product } from "../../types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addToCart } from "../../store/cartSlice"; // Ensure this import is correct

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

      const isAlreadyInCart = cartItems.some(item => item.id === product.id);

      if (isAlreadyInCart) {
        toast(`${product.name} is already in the cart`, { icon: "ℹ️" });
        return;
      }

      // Convert Product to CartItem with quantity
      const cartItem = {
        ...product,
        quantity: 1,
      };

      dispatch(addToCart(cartItem)); // ✅ Now valid
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      router.push("/login");
    }
  };
  

  return (
    <div className="w-full p-3 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-pink-400 transition-all duration-300 transform hover:scale-105">
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={160}
          className="object-contain w-full h-47 rounded-xl"
        />
      </div>

      <div className="mt-3 text-center space-y-1">
        <h3 className="text-base font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-pink-600 font-medium">₹{product.price}</p>

        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-pink-500 text-white text-sm py-2 rounded-md hover:bg-pink-700 transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
