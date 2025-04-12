"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";
import { Product } from "../../types";

export default function ProductList() {
  return (
    <div className="flex justify-center px-4 w-full overflow-x-auto scrollbar-hide scroll-smooth">
      <div className="flex gap-4 p-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl">
        {products.map((product: Product) => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
