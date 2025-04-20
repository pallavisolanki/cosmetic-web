"use client";

import Categories from "../Categories";
import ProductCard from "./ProductCard";
import { Product } from "../../types";
import "../../styles/globals.css";
import { useState } from "react";

export default function ProductSection({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto">
      {/* Left Side: Products */}
      <div className="order-1 flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>

      {/* Right Side: Categories (Sidebar) */}
      <div className="order-2 md:order-1 w-full md:w-1/4">
        <Categories
          className="sticky top-4"
          onSelectCategory={(category: string) => setSelectedCategory(category)}
        />
      </div>
    </div>
  );
}
