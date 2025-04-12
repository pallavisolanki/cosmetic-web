"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/globals.css";

const categories = [
  { name: "All", img: "/images/all.png" },
  { name: "Face", img: "/images/face.png" },
  { name: "Lips", img: "/images/lips.png" },
  { name: "Eyes", img: "/images/eyes.png" },
  { name: "Nails", img: "/images/nails.png" },
  { name: "Brush & Tools", img: "/images/brush.png" },
  { name: "Gifts", img: "/images/gifts.png" },
];

const imageWidth = 180; // Width of an image in pixels
const gap = 24; // Gap between images in pixels
const scrollAmount = imageWidth + gap; // Amount to scroll in one button click

const Categories = () => {
  const [isScroll, setIsScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll event to change background and image size when scrolled
  const handleScroll = () => {
    const scrolled = window.scrollY;
    setIsScroll(scrolled > 200);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
<div className="flex items-center justify-center min-h-[50vh]">
  <div className="relative w-full max-w-6xl px-6">
    <h2 className="text-xl font-semibold text-center mb-2">Top Categories</h2>

    <div className="relative flex items-center">
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-300 scrollbar-rounded-md w-full"
      >
        {categories.map((category, index) => (
          <div key={index} className="min-w-[180px] flex-shrink-0">
            <div className="relative w-44 h-44 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={category.img}
                alt={category.name}
                width={176}
                height={176}
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-center mt-1">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default Categories;
