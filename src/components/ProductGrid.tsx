// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { Heart, ShoppingBag, Eye } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { useAdmin } from '../context/AdminContext';

// gsap.registerPlugin(ScrollTrigger);

// const ProductGrid: React.FC = ({ activeCategory }) => {
//   const { addToCart } = useCart();
//   const { products, loading } = useAdmin();
//   const [favorites, setFavorites] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     // Stagger animation for product cards
//     gsap.fromTo('.product-card', 
//       {
//         y: 100,
//         opacity: 0,
//         scale: 0.8
//       },
//       {
//         y: 0,
//         opacity: 1,
//         scale: 1,
//         duration: 0.8,
//         stagger: 0.2,
//         ease: 'power3.out',
//         scrollTrigger: {
//           trigger: '.products-section',
//           start: 'top 80%',
//           end: 'bottom 20%',
//         }
//       }
//     );
//   }, []);

//   const toggleFavorite = (productId: string) => {
//     const newFavorites = new Set(favorites);
//     if (newFavorites.has(productId)) {
//       newFavorites.delete(productId);
//     } else {
//       newFavorites.add(productId);
//     }
//     setFavorites(newFavorites);
//   };

//   return (
//     <section className="products-section py-20 px-4 bg-gradient-to-b from-[#E4C7D1] to-white">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           whileInView={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-5xl font-bold text-[#B56F76] mb-4 font-serif">
//             Our Products
//           </h2>
//           <p className="text-lg text-[#B56F76]/80 max-w-2xl mx-auto">
//             Handcrafted with the finest organic ingredients for your natural beauty routine
//           </p>
//         </motion.div>

//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B56F76]"></div>
//           </div>
//         ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map((product) => (
//             <motion.div
//               key={product.id}
//               className="product-card group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
//               whileHover={{ y: -10 }}
//             >
//               <div className="relative overflow-hidden">
//                 <motion.img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
//                 />
                
//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="absolute bottom-4 left-4 right-4 flex justify-between">
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => toggleFavorite(product.id)}
//                       className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                     >
//                       <Heart 
//                         size={20} 
//                         className={`${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-[#B56F76]'}`} 
//                       />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                     >
//                       <Eye size={20} className="text-[#B56F76]" />
//                     </motion.button>
//                   </div>
//                 </div>

//                 {/* Sale Badge */}
//                 {product.onSale && (
//                   <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                     Sale
//                   </div>
//                 )}
//               </div>

//               <div className="p-6">
//                 <div className="mb-2">
//                   <span className="text-xs text-[#B56F76]/60 uppercase tracking-wide font-semibold">
//                     {product.category}
//                   </span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-[#B56F76] mb-2 group-hover:text-[#B56F76]/80 transition-colors">
//                   {product.name}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                   {product.description}
//                 </p>
                
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     {product.originalPrice && (
//                       <span className="text-gray-400 line-through text-sm">
//                         ${product.originalPrice}
//                       </span>
//                     )}
//                     <span className="text-2xl font-bold text-[#B56F76]">
//                       ${product.price}
//                     </span>
//                   </div>
                  
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => addToCart(product)}
//                     className="bg-[#B56F76] text-white p-3 rounded-full hover:bg-[#B56F76]/90 transition-colors shadow-lg hover:shadow-xl"
//                   >
//                     <ShoppingBag size={20} />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ProductGrid;
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

gsap.registerPlugin(ScrollTrigger);

const ProductGrid: React.FC = ({ activeCategory }) => {
  const { addToCart } = useCart();
  const { products, loading } = useAdmin();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter products based on active category
  const filteredProducts = useMemo(() => {
    if (!activeCategory || activeCategory === 'All' || activeCategory === '') {
      return products;
    }
    return products.filter(product => 
      product.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [products, activeCategory]);

  useEffect(() => {
    // Stagger animation for product cards
    gsap.fromTo('.product-card', 
      {
        y: 100,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.products-section',
          start: 'top 80%',
          end: 'bottom 20%',
        }
      }
    );
  }, [filteredProducts]); // Re-run animation when filtered products change

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Get display category name
  const displayCategory = !activeCategory || activeCategory === 'All' || activeCategory === '' 
    ? 'All Products' 
    : activeCategory;

  return (
    <section className="products-section py-20 px-4 bg-gradient-to-b from-[#E4C7D1] to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-[#B56F76] mb-4 font-serif">
            Our Products
          </h2>
          <p className="text-lg text-[#B56F76]/80 max-w-2xl mx-auto">
            Handcrafted with the finest organic ingredients for your natural beauty routine
          </p>
        </motion.div>

        {/* Category Header */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-semibold text-[#B56F76] mb-2">
            {displayCategory}
          </h3>
          <div className="w-16 h-1 bg-[#B56F76] rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B56F76]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-[#B56F76] mb-2">
              No products found
            </h3>
            <p className="text-[#B56F76]/60">
              {activeCategory && activeCategory !== 'All' 
                ? `No products available in "${activeCategory}" category.`
                : 'No products available at the moment.'
              }
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="product-card group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -10 }}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(product.id)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        size={20} 
                        className={`${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-[#B56F76]'}`} 
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Eye size={20} className="text-[#B56F76]" />
                    </motion.button>
                  </div>
                </div>

                {/* Sale Badge */}
                {product.onSale && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sale
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-[#B56F76]/60 uppercase tracking-wide font-semibold">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#B56F76] mb-2 group-hover:text-[#B56F76]/80 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-[#B56F76]">
                      ${product.price}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="bg-[#B56F76] text-white p-3 rounded-full hover:bg-[#B56F76]/90 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;