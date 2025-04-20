// src/app/layout.tsx or RootLayout.tsx
"use client";

import { Provider } from "react-redux";  // Import the Provider from react-redux
import store from "../store/store";  // Import the configured Redux store
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>  {/* Wrap your app in the Redux Provider */}
      <html lang="en">
        <head>
          <title>Cosky Cosmo</title>
          <meta 
            name="description" 
            content="Shop premium cosmetic products online at amazing prices. Find skincare, makeup, and beauty essentials." 
          />
          <meta 
            httpEquiv="Content-Security-Policy" 
            content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';" 
          />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-white font-sans">
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </Provider>
  );
}
