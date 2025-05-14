//pages\index.tsx
import HeroSection from "../src/components/HeroSection";
import NewsletterSection from "../src/components/NewsletterSection";
import ProductSection from "../src/components/product/ProductSection";
import { products } from "../src/data/products";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Product Section */}
      <section>
        <ProductSection products={products} />
      </section>

      {/* Newsletter Section */}
      <div>
        <NewsletterSection />
      </div>
    </main>
  );
}
