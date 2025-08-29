import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, ShoppingBag } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useAdmin();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4C7D1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B56F76]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#E4C7D1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#B56F76] mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#B56F76] text-white px-6 py-3 rounded-full hover:bg-[#B56F76]/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4C7D1] pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ x: -5 }}
          className="flex items-center space-x-2 text-[#B56F76] mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <span className="text-sm text-[#B56F76]/70 uppercase tracking-wide font-semibold">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-[#B56F76] mt-2 font-serif">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-[#B56F76]/70">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#B56F76]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.onSale && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sale
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-[#B56F76] mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock */}
            <div>
              <span className="text-[#B56F76] font-medium">
                In Stock: {product.stock} items
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product)}
                className="flex-1 bg-[#B56F76] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#B56F76]/90 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 border-2 border-[#B56F76] text-[#B56F76] rounded-full hover:bg-[#B56F76] hover:text-white transition-colors"
              >
                <Heart size={20} />
              </motion.button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 mt-8">
              <h3 className="text-xl font-semibold text-[#B56F76] mb-4">Product Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 100% Organic ingredients</li>
                <li>• Cruelty-free and vegan</li>
                <li>• Sustainable packaging</li>
                <li>• Handcrafted in small batches</li>
                <li>• Free from harsh chemicals</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;