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

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setIsLoggedIn(!!user?.email);
  }, [router.asPath]);

  const guestNavbarRoutes = ["/", "/login", "/signup"];
  const hideNavbarRoutes = ["/order-success"];

  const shouldShowGuestNavbar = guestNavbarRoutes.includes(router.pathname);
  const shouldHideNavbar = hideNavbarRoutes.includes(router.pathname);

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
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

export default MyApp;
