import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="bg-[#B56F76] text-white text-center py-2 text-sm font-medium fixed top-0 w-full z-40"
        >
          Welcome to our store ✨ Free shipping on orders over $50!
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopNavbar;