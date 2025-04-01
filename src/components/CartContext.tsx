"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types";  // Ensure you're importing the correct Product type

// CartContext Type
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  cartCount: number; // Total number of products in the cart
  totalPrice: number; // Total price of all products in the cart
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Add to Cart Function (updated to check for existing product)
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        // If product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity! += 1;  // Ensure quantity is updated
        return updatedCart;
      } else {
        // Otherwise, add new product with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    console.log("Product added to cart:", product); // Debugging
  };

  // Calculate the total number of products in the cart
  const cartCount = cart.reduce((total, product) => total + (product.quantity || 0), 0);

  // Calculate the total price of all products in the cart
  const totalPrice = cart.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// useCart Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
