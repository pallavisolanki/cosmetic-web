"use client";
import { useCart } from "../../components/CartContext"; // Ensure correct path
import Image from "next/image";
import { Product } from "../../types"; // Ensure correct path

export default function Cart() {
  const { cart = [] } = useCart(); // Prevent undefined cart

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cart.map((product: Product) => (
            <div key={product.id} className="p-4 bg-white shadow-md rounded-xl">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-black font-bold">₹{product.price}</p>
                <p className="text-gray-600">Quantity: {product.quantity ?? 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
