import Categories from '../components/Categories';
import HeroSection from '../components/HeroSection';
import NewsletterSection from '../components/NewsletterSection';
import ProductSection from "../components/product/ProductSection";
import { products } from '../data/products';

export default function Home() {
  return (
    <main className="">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section className="">

        <ProductSection products={products}/>

      </section>

      {/* Newsletter Section */}
      <div className="">
        <NewsletterSection />
      </div>
    </main>
  );
}
