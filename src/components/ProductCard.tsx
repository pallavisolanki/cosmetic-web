"use client";

import Image from "next/image";
import { useCart } from "./CartContext";
import { Product } from "../types"; // Import the Product type


export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log("Adding product to cart:", product);
    addToCart({ ...product, quantity: product.quantity ?? 1 }); // Ensure quantity exists
  };

  return (
    <div className="w-80 p-5 bg-white shadow-2xl rounded-2xl border border-gray-200 hover:shadow-pink-400 transition-all duration-300 transform hover:scale-105">
      <div className="relative w-full h-70 rounded-xl overflow-hidden">
        <Image src={product.image} alt={product.name} width={300} height={260} className="rounded-xl transition-transform duration-300" />
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
        <p className="text-lg text-pink-600 font-semibold">₹{product.price}</p>

        <button onClick={handleAddToCart} className="mt-4 w-full bg-pink-500 text-white font-medium py-3 rounded-lg hover:bg-pink-700 transition-all duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
}