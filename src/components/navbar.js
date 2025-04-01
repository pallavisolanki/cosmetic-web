"use client";

import Link from "next/link";
import { useState } from "react";
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import "../app/globals.css";
import { useCart } from "./CartContext";

const Navbar = ({ products = [] }) => { // Default to empty array if products is undefined
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const { cartCount, cart } = useCart(); // Get cart count and cart items from context

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const categories = ["Makeup", "Skin", "Hair", "Fragrance", "Offers"];

  // Calculate the total quantity of items in the cart
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <nav className="bg-white shadow-md p-5 flex justify-between items-center sticky top-0 z-10">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img
          src="/images/logo.png"
          alt="Cosmetics Store Logo"
          className="h-18 w-23 cursor-pointer"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-6">
        {categories.map((category) => (
          <Link
            href={`/${category.toLowerCase()}`}
            key={category}
            className="text-gray-700 font-medium text-lg transition duration-200 hover:text-pink-500 hover:scale-105"
          >
            {category}
          </Link>
        ))}
      </div>

      {/* Search, Cart, and Authentication Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch} // Update search term on input change
            placeholder="Search products"
            className="border rounded-lg p-2 pl-10 form-control mx-2 w-64 focus:outline-none"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Cart */}
        <Link href="/cart" className="text-gray-700 relative">
          <FaShoppingCart size={24} />
          <div>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 text-[13px] bg-red-600 h-[18px] w-[18px] rounded-full grid place-items-center text-white">
                {totalQuantity} {/* Display total quantity of items */}
              </span>
            )}
          </div>
        </Link>

        {/* Authentication Buttons */}
        <Link
          href="/login"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-gray-700"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col items-center md:hidden z-50">
          {categories.map((category) => (
            <Link
              href={`/${category.toLowerCase()}`}
              key={category}
              className="text-gray-700 hover:text-pink-500 py-2"
              onClick={toggleMobileMenu}
            >
              {category}
            </Link>
          ))}
          <Link
            href="/cart"
            className="text-gray-700 py-2 relative"
            onClick={toggleMobileMenu}
          >
            Cart
            {totalQuantity > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalQuantity} {/* Display total quantity of items in mobile menu */}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-4"
            onClick={toggleMobileMenu}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-4"
            onClick={toggleMobileMenu}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
