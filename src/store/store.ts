// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice";  
import searchReducer from './searchSlice';

const getCartKey = () => {
  try {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    return user?.email ? `cart_${user.email}` : null;
  } catch {
    return null;
  }
};

const loadCartFromLocalStorage = () => {
  try {
    const cartKey = getCartKey();
    if (!cartKey) return [];
    const serializedState = localStorage.getItem(cartKey);
    return serializedState ? JSON.parse(serializedState) : [];
  } catch {
    return [];
  }
};

const saveCartToLocalStorage = (cartItems: any[]) => {
  try {
    const cartKey = getCartKey();
    if (!cartKey) return;
    const serializedState = JSON.stringify(cartItems);
    localStorage.setItem(cartKey, serializedState);
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
};

// Redux store configuration with cart, user, and order slices
const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer, 
    order: orderReducer, 
    search: searchReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveCartToLocalStorage(state.cart.items);
});

export const clearCart = () => {
  const cartKey = getCartKey();
  if (cartKey) localStorage.removeItem(cartKey);
};

export default store;
export type RootState = ReturnType<typeof store.getState>; // RootState now knows about user
export type AppDispatch = typeof store.dispatch;
