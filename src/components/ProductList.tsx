"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { Product } from "../types"; // Import the Product type

export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-5">
      {products.map((product: Product) => ( // Explicitly type `product`
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
