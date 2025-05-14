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

// types.ts
export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// User Type
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  lastLogin: string | null; 
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

// Order Type
export interface Order {
  _id: string;
  user: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
  status?: OrderStatus; 
  createdAt: string;
}