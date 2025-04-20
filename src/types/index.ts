// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity?: number; // Optional since it may not exist initially
}

// CartItem inherits Product, but with quantity as required
export interface CartItem extends Product {
  quantity: number; 
}
