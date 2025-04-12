export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity?: number; // Optional since it may not exist initially
  }
  