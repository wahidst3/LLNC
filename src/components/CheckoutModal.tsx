
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addOrder as addFirebaseOrder } from '../services/firebaseService';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import emailjs from "@emailjs/browser";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `order-${timestamp}-${randomStr}`;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, firebaseUser, addOrder } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [easyPaisaNumber, setEasyPaisaNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = generateOrderId();
    
    const order = {
      id: orderId,
      userId: firebaseUser?.uid,
      items: cartItems,
      total: cartTotal + 200,
      status: 'pending' as const,
      paymentMethod: paymentMethod,
      ...(paymentMethod === 'easypaisa' && { easyPaisaNumber }),
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}`
      },
      createdAt: new Date().toISOString(),
    };

    try {
      if (user && firebaseUser) {
       await addOrder(order,orderId);
        await setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            orders: firebaseUser.orders
              ? [...firebaseUser.orders, order]
              : [order],
          },
          { merge: true }
        );
      }

      clearCart();

      await emailjs.send(
        "service_amunl5e",
        "template_gwbxeec",
        {
          email: order.customerInfo.email,
          orderid: order.id,
          orderstatus: "pending",
        },
        "Di7YqJtjoZ6VOO4EU"
      );

      alert("Order placed successfully! You will receive a confirmation email shortly.");
      onClose();

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B56F76] to-[#E4C7D1] p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Checkout</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#B56F76] mb-4">Order Summary</h3>
                <div className="bg-[#E4C7D1]/20 rounded-xl p-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-[#B56F76]">{item.name} x {item.quantity}</span>
                      <span className="font-semibold text-[#B56F76]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#B56F76]/20 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#B56F76]">Subtotal</span>
                      <span className="font-semibold text-[#B56F76]">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#B56F76]">Delivery Charges</span>
                      <span className="font-semibold text-[#B56F76]">₹200</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-[#B56F76]">
                      <span>Total</span>
                      <span>${(cartTotal + 200).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#B56F76]">Delivery Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#B56F76] mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B56F76] mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B56F76] mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B56F76] mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-3 top-3 text-[#B56F76]/60" />
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B56F76] mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Enter your complete address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B56F76] mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.postalCode}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#B56F76]">Payment Method</h3>
                  
                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border border-[#E4C7D1] rounded-lg cursor-pointer hover:bg-[#E4C7D1]/10 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-[#B56F76] focus:ring-[#B56F76]"
                      />
                      <div className="ml-3 flex items-center">
                        <CreditCard size={20} className="text-[#B56F76] mr-2" />
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                    </label>

                    {/* EasyPaisa/JazzCash */}
                    <label className="flex items-center p-4 border border-[#E4C7D1] rounded-lg cursor-pointer hover:bg-[#E4C7D1]/10 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="easypaisa"
                        checked={paymentMethod === 'easypaisa'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-[#B56F76] focus:ring-[#B56F76]"
                      />
                      <div className="ml-3 flex items-center">
                        <Wallet size={20} className="text-[#B56F76] mr-2" />
                        <span className="font-medium">EasyPaisa/JazzCash</span>
                      </div>
                    </label>

                    {/* EasyPaisa Number Input (only shown when selected) */}
                    {paymentMethod === 'easypaisa' && (
                      <div className="ml-7 mt-3 p-4 bg-[#E4C7D1]/10 rounded-lg border border-[#E4C7D1]">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-[#B56F76] mb-2">
                              Your EasyPaisa/JazzCash Number *
                            </label>
                            <input
                              type="tel"
                              value={easyPaisaNumber}
                              onChange={(e) => setEasyPaisaNumber(e.target.value)}
                              className="w-full px-4 py-2 border border-[#E4C7D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B56F76] focus:border-transparent"
                              placeholder="03XX-XXXXXXX"
                              required
                            />
                          </div>
                          
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <p className="text-sm text-yellow-700">
                              <strong>Payment Instructions:</strong> Please send the payment of <span className="font-bold">${(cartTotal + 200).toFixed(2)}</span> to our 
                              EasyPaisa/JazzCash number: <span className="font-bold">0323-2379368</span>
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                              After sending payment, please take a screenshot and send it to us at <span className="font-bold">0323-2379368</span> via WhatsApp or SMS.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#B56F76] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#B56F76]/90 transition-colors"
                >
                  Place Order
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;