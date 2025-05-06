// utils/addToCart.ts
import { Product } from "../src/types";
import toast from "react-hot-toast";
import { replaceCart } from "../src/store/cartSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { NextRouter } from "next/router";

export const addToCart = async (
  product: Product,
  dispatch: Dispatch,
  router: NextRouter,
  quantity: number = 1 // default quantity is 1
) => {
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
      existingCart[existingItemIndex].quantity += quantity;
      updatedCart = [...existingCart];
      toast(`${product.name} quantity increased by ${quantity}`, { icon: "➕" });
    } else {
      const cartItem = { ...product, quantity };
      updatedCart = [...existingCart, cartItem];
      toast.success(`${product.name} added to cart (x${quantity})`);
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    localStorage.setItem("profileCart", JSON.stringify(updatedCart));
    dispatch(replaceCart(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (err) {
    toast.error("Please login to add items to your cart.");
    router.push("/login");
  }
};
