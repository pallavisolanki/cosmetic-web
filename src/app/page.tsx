import Categories from '../components/Categories';
import HeroSection from '../components/HeroSection';
import NewsletterSection from '../components/NewsletterSection';
import ProductList from "../components/product/ProductList";


export default function Home() {
  return (
    <main className="">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section className="">
        {/* Filters Section */}
        <div className="">
          <Categories />
        </div>

        {/* Product Section */}
        <div className="">
          <div className="product-container">
            <h2 className="text-3xl font-bold text-center my-8">Featured Cosmetics</h2>
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
              <ProductList />
            </div>
          </div>
        </div>

      </section>

      {/* Newsletter Section */}
      <div className="">
        <NewsletterSection />
      </div>
    </main>
  );
}
