// src/app/layout.tsx 
"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import store from "../store/store";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { replaceCart } from "../store/cartSlice";

// Client-only wrapper to hydrate cart from localStorage
function CartInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.email) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      if (savedCart) {
        dispatch(replaceCart(JSON.parse(savedCart)));
      }
    }
  }, [dispatch]);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          <title>Cosky Cosmo</title>
          <meta 
            name="description" 
            content="Shop premium cosmetic products online at amazing prices. Find skincare, makeup, and beauty essentials." 
          />
          <meta 
            httpEquiv="Content-Security-Policy"
            content="
              default-src 'self'; 
              script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; 
              style-src 'self' 'unsafe-inline'; 
              frame-src https://*.razorpay.com; 
              connect-src 'self' https://api.razorpay.com; 
              img-src 'self' data:;
            "
          />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-white font-sans">
          <Toaster position="top-center" reverseOrder={false} />
          <CartInitializer />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </Provider>
  );
}

