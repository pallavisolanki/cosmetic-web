import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

export default function ProfileSidebar({ isOpen, onClose, user, handleLogout }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-30" />
      <div
        ref={sidebarRef}
        className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-pink-600">Profile</h2>
            <IoClose
              size={24}
              className="cursor-pointer text-gray-600"
              onClick={onClose}
            />
          </div>

          <div className="flex flex-col items-center mt-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-400 text-white flex items-center justify-center text-2xl font-semibold">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{user?.fullName}</h3>
            <p className="text-sm text-gray-600">{user?.email || "Not Available"}</p>
          </div>

          {/* Cart icon for mobile/tablet view */}
          <div className="mt-6 md:hidden flex justify-center">
            <Link href="/cart" className="text-pink-600 hover:text-pink-700 text-xl">
              <FaShoppingCart size={26} />
            </Link>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
