import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Star, Quote } from 'lucide-react';

const ReviewsSection: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely love the Rose Petal Soap! My skin has never felt softer. The natural ingredients really make a difference.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      id: 2,
      name: 'Emma Wilson',
      rating: 5,
      comment: 'The Lavender Dreams Shampoo is amazing! It smells divine and leaves my hair so silky and manageable.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    },
    {
      id: 3,
      name: 'Jessica Martinez',
      rating: 5,
      comment: 'I\'ve been using the Argan Beauty Oil for months now, and it\'s transformed my skin. Highly recommend!',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg'
    },
    {
      id: 4,
      name: 'Ashley Brown',
      rating: 5,
      comment: 'LNCC Organics has become my go-to brand for all natural beauty products. Quality is exceptional!',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    },
    {
      id: 5,
      name: 'Rachel Davis',
      rating: 5,
      comment: 'The Honey Oat Soap is perfect for my sensitive skin. No irritation and it moisturizes beautifully.',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg'
    }
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Infinite scroll animation
    const scrollWidth = carousel.scrollWidth;
    const itemWidth = carousel.children[0]?.clientWidth || 300;
    
    gsap.to(carousel, {
      x: -scrollWidth / 2,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      gsap.globalTimeline.pause();
    });

    carousel.addEventListener('mouseleave', () => {
      gsap.globalTimeline.resume();
    });
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-white to-[#E4C7D1]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-[#B56F76] mb-4 font-serif">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join thousands of happy customers who have transformed their beauty routine with our organic products
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="flex space-x-6" ref={carouselRef}>
            {/* Duplicate reviews for seamless loop */}
            {[...reviews, ...reviews].map((review, index) => (
              <motion.div
                key={`${review.id}-${index}`}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6 border border-[#E4C7D1]/20"
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#E4C7D1] rounded-full flex items-center justify-center">
                    <Quote size={24} className="text-[#B56F76]" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center space-x-1 mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-center mb-6 leading-relaxed italic">
                  "{review.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center justify-center space-x-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold text-[#B56F76]">{review.name}</h4>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-[#B56F76] mb-4">Ready to Join Them?</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#B56F76] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B56F76]/90 transition-colors shadow-lg hover:shadow-xl"
          >
            Shop Now & Save 20%
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;