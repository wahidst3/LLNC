import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Grid, Info, MessageCircle, HelpCircle, Instagram, Facebook, Twitter } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose ,setactiveCategory}) => {

  const [categories, setCategories] = useState<string[]>([]);
  const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: Grid, label: 'Categories', href: '#categories', hasSubmenu: true },
    { icon: Info, label: 'About Us', href: '#about' },
    { icon: MessageCircle, label: 'Reviews', href: '#reviews' },
    { icon: HelpCircle, label: 'FAQs', href: '#faqs' }
  ];
 
  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categoriesData = querySnapshot.docs.map(doc => doc.data().name);
    setCategories(categoriesData);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  

 
  const socialLinks = [
    { icon: Instagram, href: '#', color: 'text-pink-500' },
    { icon: Facebook, href: '#', color: 'text-blue-500' },
    { icon: Twitter, href: '#', color: 'text-blue-400' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#B56F76] font-serif">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#E4C7D1] transition-colors"
                >
                  <X size={24} className="text-[#B56F76]" />
                </motion.button>
              </div>

              {/* Navigation */}
              <nav className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#E4C7D1] transition-colors group"
                      onClick={onClose}
                    >
                      <item.icon size={20} className="text-[#B56F76] group-hover:scale-110 transition-transform" />
                      <span className="text-[#B56F76] font-medium">{item.label}</span>
                    </a>

                    {/* Categories Submenu */}
                    {item.hasSubmenu && (
                      <div className="ml-8 mt-2 space-y-2">
                           <a
                            key="All"
                            // href={`#${category.toLowerCase()}`}
                            className="block p-2 text-sm text-[#B56F76]/70 hover:text-[#B56F76] hover:bg-[#E4C7D1]/50 rounded transition-colors"
                            onClick={()=>{
                              setactiveCategory("All")
                              onClose();
                            }}
                          

                          >
                            All
                          </a>
                        {categories.map((category) => (
                          <a
                            key={category}
                            // href={`#${category.toLowerCase()}`}
                            className="block p-2 text-sm text-[#B56F76]/70 hover:text-[#B56F76] hover:bg-[#E4C7D1]/50 rounded transition-colors"
                            onClick={()=>{
                              setactiveCategory(category)
                              onClose();
                            }}
                          

                          >
                            {category}
                          </a>

                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-[#B56F76] mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-full bg-[#E4C7D1] hover:bg-[#B56F76] hover:text-white transition-colors ${social.color}`}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;