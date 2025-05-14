// src/store/orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types"; // Import CartItem type

interface Order {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  total: number;
  cartItems: CartItem[];
}

interface OrderState {
  lastOrder: Order | null;
  history: Order[];
}

const initialState: OrderState = {
  lastOrder: null,
  history: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveOrderToRedux: (state, action: PayloadAction<Order>) => {
      state.lastOrder = action.payload;
      state.history.push(action.payload);

      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.email) {
        localStorage.setItem(`order_${user.email}`, JSON.stringify(action.payload));

        const existingHistoryString = localStorage.getItem(`order_history_${user.email}`);
        const existingHistory: Order[] = existingHistoryString ? JSON.parse(existingHistoryString) : [];
        existingHistory.push(action.payload);
        localStorage.setItem(`order_history_${user.email}`, JSON.stringify(existingHistory));
      }
    },
    loadOrderHistoryFromLocalStorage: (state, action: PayloadAction<string>) => {
      const email = action.payload;
      const historyString = localStorage.getItem(`order_history_${email}`);
      state.history = historyString ? JSON.parse(historyString) : [];
    },
    deleteOrderFromHistory: (state, action: PayloadAction<{ email: string; orderId: string }>) => {
      const { email, orderId } = action.payload;
      const existingHistoryString = localStorage.getItem(`order_history_${email}`);
      const existingHistory: Order[] = existingHistoryString ? JSON.parse(existingHistoryString) : [];

      const updatedHistory = existingHistory.filter(
        (order) => order.razorpay_order_id !== orderId
      );

      localStorage.setItem(`order_history_${email}`, JSON.stringify(updatedHistory));
      state.history = updatedHistory;
    },
    clearOrderHistory: (state, action: PayloadAction<string>) => {
      const email = action.payload;
      localStorage.removeItem(`order_history_${email}`);
      state.history = [];
    },
  },
});

export const {
  saveOrderToRedux,
  loadOrderHistoryFromLocalStorage,
  deleteOrderFromHistory,
  clearOrderHistory,
} = orderSlice.actions;
export default orderSlice.reducer;
