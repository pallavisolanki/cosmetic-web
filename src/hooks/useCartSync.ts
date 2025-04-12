//src/hooks/useCartSync.ts
"use client";

import { useEffect } from "react";

export const useCartSync = (profileCart: any[], setProfileCart?: (items: any[]) => void) => {
  useEffect(() => {
    const syncToMongo = async () => {
      if (profileCart.length === 0) return;
      try {
        await fetch("/api/auth/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cartItems: profileCart }),
        });
      } catch (err) {
        console.error("Cart sync error:", err);
      }
    };

    const fetchCartFromMongo = async () => {
      try {
        const res = await fetch("/api/auth/cart", { credentials: "include" });
        const data = await res.json();
        if (data.cartItems && setProfileCart) {
          localStorage.setItem("profileCart", JSON.stringify(data.cartItems));
          setProfileCart(data.cartItems);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    const token = localStorage.getItem("token");

    if (token) {
      syncToMongo();
      if (setProfileCart) fetchCartFromMongo();
    }
  }, [profileCart]);
};
