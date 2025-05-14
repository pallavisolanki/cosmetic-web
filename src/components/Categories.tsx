// Categories.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
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

const Categories = ({
  className = "",
  onSelectCategory,
}: {
  className?: string;
  onSelectCategory?: (category: string) => void;
}) => {
  const [isScroll, setIsScroll] = useState(false);
  const [selected, setSelected] = useState("All");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    setIsScroll(window.scrollY > 200);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (name: string) => {
    setSelected(name);
    onSelectCategory?.(name);
  };

  return (
    <div className={`w-full md:w-[260px] ${className}`}>
      <h2 className="text-lg font-semibold mb-2 text-center md:text-left">
        Top Categories
      </h2>
      <div
        ref={scrollRef}
        className="flex md:flex-col overflow-x-auto md:overflow-x-hidden space-x-4 md:space-x-0 md:space-y-4 scrollbar-thin scrollbar-thumb-pink-500"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex-shrink-0 md:min-w-0 md:w-full text-center cursor-pointer group transition-all duration-200 ${
              selected === category.name
                ? "font-semibold text-pink-600"
                : ""
            }`}
            onClick={() => handleClick(category.name)}
          >
            <div
              className={`relative w-20 h-20 mx-auto md:mx-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selected === category.name
                  ? "border-pink-500"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={category.img}
                alt={category.name}
                width={80}
                height={80}
                className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                style={{ willChange: "transform", transformOrigin: "center" }}
              />
            </div>
            <p className="mt-1 text-sm">{category.name}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Categories;
