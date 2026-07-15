import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProductsSection from "../components/ProductsSection";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
