// src/app/profile/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import "../src/styles/globals.css";
import HeroSection from "../src/components/HeroSection";
import NewsletterSection from "../src/components/NewsletterSection";
import ProductSection from "../src/components/product/ProductSection";
import { products } from "../src/data/products";
import { useAuthRedirect } from "../src/hooks/useAuthRedirect";
import { useDispatch } from "react-redux";
import { replaceCart } from "../src/store/cartSlice";

export default function ProfilePage() {
  const [userName, setUserName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products); // 🔍 Filtered product state
  const fetchedRef = useRef(false); // 🧠 Prevent double fetch
  const dispatch = useDispatch();

  useAuthRedirect(true); // 🔐 Redirect to login if not authenticated

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // ✅ Include token cookie
          cache: "no-store", // 🔄 Prevent caching
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.fullName || data.email || "");

          // Restore cart from localStorage if present
          const savedCart = localStorage.getItem(`cart_${data.email}`);
          if (savedCart) {
            dispatch(replaceCart(JSON.parse(savedCart))); // ✅ Set cart in Redux
          }
        } else {
          const errorText = await res.text(); // Handle HTML errors gracefully
          console.warn("Failed to fetch user:", errorText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  // 🔍 Handle product search
  const handleSearch = (searchTerm: string) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <HeroSection />

      <section>
        <h2 className="text-3xl font-bold text-center my-8">Featured Cosmetics</h2>
        <ProductSection products={filteredProducts} />
      </section>

      <NewsletterSection />
    </>
  );
}
