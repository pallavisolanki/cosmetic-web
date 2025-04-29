//src\components\HeroSection.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../styles/globals.css';

const HeroSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    setIsLoggedIn(!!user); 
  }, []);

  const handleShopNow = () => {
    if (isLoggedIn) {
      const productSection = document.getElementById("product-section");
      if (productSection) {
        const yOffset = window.innerWidth < 768 ? 3000 : -150; 
        const y = productSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      router.push("/login");
    }
  };
  
  

  return (
    <section className="hero-section relative flex items-center justify-center h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-6xl font-bold">Discover Your Beauty</h1>
        <p className="mt-6 text-xl">Shop the best cosmetic products at amazing prices</p>
        <button
          onClick={handleShopNow}
          className="mt-8 px-8 py-4 bg-pink-500 rounded-full font-semibold hover:bg-pink-600 transition"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

