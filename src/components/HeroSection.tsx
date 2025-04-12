"use client";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="hero-section relative flex items-center justify-center h-screen">
      {/* Content Centered using Flex and Absolute Positioning */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-6xl font-bold">Discover Your Beauty</h1>
        <p className="mt-6 text-xl">Shop the best cosmetic products at amazing prices</p>
        <Link
          href="/login"
          className="mt-8 px-8 py-4 bg-pink-500 rounded-full font-semibold hover:bg-pink-600 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
