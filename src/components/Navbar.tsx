import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, ShoppingBag, X, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';

const Navbar: React.FC = ({setactiveCategory}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems, toggleCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`fixed top-8 w-full z-30 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Menu */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-[#E4C7D1] transition-colors"
            >
              <Menu size={24} className="text-[#B56F76]" />
            </motion.button>

            {/* Center - Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Heart size={28} className="text-[#B56F76]" fill="currentColor" />
              <h1 className="text-2xl font-bold text-[#B56F76] font-serif">
                LNCC Organics
              </h1>
            </motion.div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[#E4C7D1] transition-colors"
              >
                <Search size={24} className="text-[#B56F76]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAuthOpen(true)}
                className="p-2 rounded-full hover:bg-[#E4C7D1] transition-colors"
              >
                <User size={24} className="text-[#B56F76]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-[#E4C7D1] transition-colors"
              >
                <ShoppingBag size={24} className="text-[#B56F76]" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[#B56F76] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} setactiveCategory={setactiveCategory} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;