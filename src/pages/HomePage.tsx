import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import TopNavbar from '../components/TopNavbar';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import AboutSection from '../components/AboutSection';
import ReviewsSection from '../components/ReviewsSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const [activeCategory, setactiveCategory] = React.useState<string>('All');
  useEffect(() => {
    // Parallax effects
    gsap.utils.toArray('.parallax').forEach((element: any) => {
      gsap.to(element, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }, []);

  return (
    <div className="bg-[#E4C7D1] min-h-screen">
      <TopNavbar />
      <Navbar  setactiveCategory={setactiveCategory} activeCategory={activeCategory}/>
      <Cart />
      <HeroSection />
      <ProductGrid activeCategory={activeCategory} />
      <AboutSection />
      <ReviewsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;