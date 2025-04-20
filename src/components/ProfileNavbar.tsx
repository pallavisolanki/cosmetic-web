"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import ProfileSidebar from "./ProfileSidebar";
import { useRouter } from "next/navigation";

const ProfileNavbar = () => {
  const router = useRouter();
  const [searchTerm] = useState("");
  const [fullName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [profileCartCount, setProfileCartCount] = useState(0);

  useEffect(() => {
    const getUser = () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserName(user?.fullName || "");
          setUserEmail(user?.email || "");
          getCartCount(user?.email); // ← get cart count right away
        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    };
  
    const getCartCount = (email: string) => {
      try {
        if (!email) return;
        const cartKey = `cart_${email}`;
        const cartString = localStorage.getItem(cartKey);
        const cart = cartString ? JSON.parse(cartString) : [];
        setProfileCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0)); // Show total quantity
      } catch (err) {
        console.error("Error reading cart", err);
      }
    };
  
    getUser();
  
    const handleCartUpdate = () => {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (user?.email) getCartCount(user.email);
    };
  
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);
  

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profileCart");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const user = {
    fullName,
    email: userEmail,
  };

  return (
    <>
      <nav className="bg-white shadow-md px-3 py-1 flex justify-between items-center sticky top-0 z-10">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Cosmetics Store Logo"
            className="h-18 w-23 cursor-pointer"
          />
        </Link>

        <div className="hidden md:flex space-x-6">
          {["Makeup", "Skin", "Hair", "Fragrance", "Offers"].map((cat) => (
            <Link
              key={cat}
              href={`/${cat.toLowerCase()}`}
              className="text-gray-700 font-medium text-lg hover:text-pink-500 transition"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              placeholder="Search products"
              className="border rounded-lg p-2 pl-10 w-64"
              readOnly
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          <Link href="/cart" className="relative text-gray-700 hover:text-pink-500">
            <FaShoppingCart size={24} />
            {profileCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs px-1.5">
                {profileCartCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2">
            {fullName && (
              <span className="text-gray-700 font-semibold">{fullName}</span>
            )}
            <FaUserCircle
              size={30}
              className="text-gray-700 cursor-pointer hover:text-pink-500 transition"
              title="Profile"
              onClick={() => setShowSidebar(true)}
            />
          </div>
        </div>

        <div className="flex md:hidden items-center gap-2 ml-auto px-4 mt-4 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              placeholder="Search products"
              className="border rounded-lg p-2 pl-10 w-full"
              readOnly
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          <FaUserCircle
            size={26}
            className="text-gray-700 cursor-pointer hover:text-pink-500 transition ml-2"
            onClick={() => setShowSidebar(true)}
          />
        </div>
      </nav>

      <ProfileSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default ProfileNavbar;
