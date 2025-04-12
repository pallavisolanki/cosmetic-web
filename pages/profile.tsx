import { useEffect, useState, useRef } from "react";
import ProfileNavbar from "../src/components/ProfileNavbar";
import Footer from "../src/components/layout/footer";
import '../src/styles/globals.css';
import Categories from "../src/components/Categories";
import HeroSection from "../src/components/HeroSection";
import NewsletterSection from "../src/components/NewsletterSection";
import ProductList from "../src/components/product/ProductList";
import { useAuthRedirect } from "../src/hooks/useAuthRedirect";

export default function ProfilePage() {
  const [userName, setUserName] = useState("");
  const fetchedRef = useRef(false); // 🧠 Prevent double fetch

  useAuthRedirect(true); // 🔐 Redirect to login if not authenticated

  useEffect(() => {
    if (fetchedRef.current) return; // 👀 Already fetched
    fetchedRef.current = true;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // ✅ Send cookie (token)
          cache: "no-store", // 👈 Force bypass browser cache
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.fullName || data.email || "");
        } else {
          console.warn("Not authenticated or error in fetching user.");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <ProfileNavbar/>
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section>
        <div>
          <Categories />
        </div>

        <div>
          <div className="product-container">
            <h2 className="text-3xl font-bold text-center my-8">Featured Cosmetics</h2>
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
              <ProductList />
            </div>
          </div>
        </div>
      </section>

      <div>
        <NewsletterSection />
      </div>

      <Footer />
    </>
  );
}
