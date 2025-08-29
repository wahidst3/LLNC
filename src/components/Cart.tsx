import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

const Cart: React.FC = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#B56F76] flex items-center">
                    <ShoppingBag size={24} className="mr-2" />
                    Cart ({cartItems.length})
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleCart}
                    className="p-2 rounded-full hover:bg-[#E4C7D1] transition-colors"
                  >
                    <X size={24} className="text-[#B56F76]" />
                  </motion.button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add some products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#E4C7D1]/20 rounded-xl p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#B56F76]">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            <p className="font-bold text-[#B56F76]">${item.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full bg-[#B56F76] text-white hover:bg-[#B56F76]/80 transition-colors"
                            >
                              <Minus size={16} />
                            </motion.button>
                            <span className="font-semibold text-[#B56F76] min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full bg-[#B56F76] text-white hover:bg-[#B56F76]/80 transition-colors"
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-[#B56F76]">Total:</span>
                    <span className="text-2xl font-bold text-[#B56F76]">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-[#B56F76] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#B56F76]/90 transition-colors"
                  >
                    Proceed to Checkout
                  </motion.button>
                  
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Cash on Delivery + ₹200 delivery charges
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};

export default Cart;