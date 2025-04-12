//pages/login.tsx

"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ use next/navigation for app directory
import Link from 'next/link';
import { useAuthRedirect } from "../src/hooks/useAuthRedirect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../src/styles/globals.css'; // ✅ fixed import path

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useAuthRedirect(false); // 🔄 Redirect if already authenticated

  // ✅ Function to sync local cart to MongoDB after login
  const syncCartWithServer = async () => {
    const localCart = JSON.parse(localStorage.getItem("profileCart") || "[]");
  
    if (localCart.length > 0) {
      try {
        const response = await fetch("/api/auth/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cartItems: localCart, savedItems: [] }),
        });
  
        if (response.ok) {
          console.log("Cart synced with server!");
          localStorage.removeItem("profileCart");
        } else {
          console.error("Failed to sync cart:", await response.json());
        }
      } catch (err) {
        console.error("Sync failed:", err);
      }
    }
  
    // ✅ Fetch latest cart from server
    try {
      const res = await fetch("/api/auth/cart", { credentials: "include" });
      const data = await res.json();
      if (data?.cartItems) {
        localStorage.setItem("profileCart", JSON.stringify(data.cartItems));
      }
    } catch (err) {
      console.error("Fetching server cart failed:", err);
    }
  };
  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      alert('Please provide email and password');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ❌ Don't store token in localStorage if using HTTP-only cookies
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("profileCart", JSON.stringify(data.cartItems || []));
        window.dispatchEvent(new Event("cartUpdated"));

        // Sync cart after login if it exists in localStorage
        await syncCartWithServer();
        router.push("/profile");
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full p-2 border border-gray-300 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
