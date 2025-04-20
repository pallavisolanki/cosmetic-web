import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

export default function ProfileSidebar({ isOpen, onClose, user, handleLogout }) {
  const sidebarRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

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

  useEffect(() => {
    const getCartCount = (email) => {
      try {
        if (!email) return;
        const cartKey = `cart_${email}`;
        const cartString = localStorage.getItem(cartKey);
        const cart = cartString ? JSON.parse(cartString) : [];
        setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
      } catch (err) {
        console.error("Error reading cart", err);
      }
    };

    if (user?.email) {
      getCartCount(user.email);
    }

    const handleCartUpdate = () => {
      if (user?.email) {
        getCartCount(user.email);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  const handleCartClick = () => {
    onClose(); // optional: close sidebar before navigating
    router.push("/cart");
  };

  // Extract initials from email (before the '@' symbol)
  const getEmailInitials = (email) => {
    if (!email) return "U";
    const namePart = email.split("@")[0]; // Get part before '@'
    return namePart.charAt(0).toUpperCase(); // Get the first letter of the part before '@'
  };

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
              {getEmailInitials(user?.email)}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{user?.email}</h3>
          </div>

          {/* Cart icon for mobile/tablet view */}
          <div
            className="mt-6 md:hidden flex justify-center relative cursor-pointer"
            onClick={handleCartClick}
          >
            <div className="text-pink-600 hover:text-pink-700 text-xl relative">
              <FaShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white rounded-full text-xs px-1.5">
                  {cartCount}
                </span>
              )}
            </div>
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
