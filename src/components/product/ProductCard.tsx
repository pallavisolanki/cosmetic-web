//src\components\product\ProductCard.tsx
"use client";

import Image from "next/image";
import { Product } from "../../types";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {slugify} from '../../../utils/slugify';
import { addToCart } from "../../../utils/addToCart";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleProductClick = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not logged in");
      const productSlug = slugify(product.name);
      router.push(`/product/${productSlug}`);
    } catch (err) {
      toast.error("Please login to view product details.");
      router.push("/login");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-pink-400 transition-all duration-300 transform hover:scale-105 h-[320px] flex flex-col justify-between">
      <div onClick={handleProductClick} className="cursor-pointer">
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
        onClick={() => addToCart(product, dispatch, router)}
        className="mt-2 w-full bg-pink-500 text-white text-sm py-2 rounded-md hover:bg-pink-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}