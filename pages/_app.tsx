// pages/_app.tsx
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "../src/store/store";
import "../src/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { replaceCart } from "../src/store/cartSlice";
import Navbar from "../src/components/layout/navbar";
import Footer from "../src/components/layout/footer";
import dynamic from "next/dynamic";

// Lazy load ProfileNavbar to prevent SSR issues
const ProfileNavbar = dynamic(() => import("../src/components/ProfileNavbar"), { ssr: false });
// Lazy load ProfileSidebar to prevent SSR issues
const ProfileSidebar = dynamic(() => import("../src/components/ProfileSidebar"), { ssr: false });

function AppInitializer() {
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

interface User {
  email: string;
  role: "user" | "admin";
}


function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setIsLoggedIn(!!user?.email);
    setCurrentUser(user); // Set the user data in state
  }, [router.asPath]);  // Make sure this useEffect listens to route changes


  const isAdmin = currentUser?.role === "admin";

  const guestNavbarRoutes = ["/", "/login", "/signup"];
  const hideNavbarRoutes = ["/order-success"];

  const adminHideNavbarRoutes = ["/admin"]; // Add more admin-specific routes here

  const shouldShowGuestNavbar = guestNavbarRoutes.includes(router.pathname);
  const shouldHideNavbar =
    hideNavbarRoutes.includes(router.pathname) ||
    (isAdmin && adminHideNavbarRoutes.includes(router.pathname));


  // Open/close sidebar
  const handleSidebarClose = () => setSidebarIsOpen(false);
  const handleSidebarOpen = () => setSidebarIsOpen(true);

  const handleLogout = async () => {
    console.log("Logging out...");

    // Clear localStorage
    localStorage.removeItem("user");
    if (currentUser?.email) {
      localStorage.removeItem(`cart_${currentUser.email}`);
    }

    // Clear states
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSidebarIsOpen(false);

    // Optional: Call an API to clear server cookie
    await fetch("/api/auth/logout", { method: "POST" });

    // Force refresh to clear lingering state
    router.push("/login").then(() => {
      window.location.reload(); // Ensures full state reset
    });
  };




  return (
    <Provider store={store}>
      <AppInitializer />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col">
        {!shouldHideNavbar && (
          shouldShowGuestNavbar || !isLoggedIn ? (
            <Navbar />
          ) : (
            <ProfileNavbar onSearch={() => {}} />
          )
        )}

        {/* Profile Sidebar with User Data */}
        {isLoggedIn && (
          <ProfileSidebar
            isOpen={sidebarIsOpen}
            onClose={handleSidebarClose}
            user={currentUser}
            handleLogout={handleLogout}
          />
        )}

        {/* Button to open Sidebar */}
        {isAdmin && router.pathname === "/admin" && (
          <button
            onClick={handleSidebarOpen}
            className="fixed top-5 right-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out flex items-center gap-2 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
            Sidebar
          </button>
        )}


        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

export default MyApp;
