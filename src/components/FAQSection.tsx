import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Are all your products 100% organic?',
      answer: 'Yes, all our products are made with certified organic ingredients. We source our materials from trusted organic farms and ensure every product meets strict organic standards.'
    },
    {
      question: 'How long do your products last?',
      answer: 'Our products have a shelf life of 12-18 months when stored properly. We recommend using them within 6 months of opening for best results. Each product has an expiration date printed on the packaging.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within the country with free shipping on orders over $50. We are working on expanding our international shipping options and will update customers when available.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your purchase, you can return it for a full refund. Products must be unused and in original packaging.'
    },
    {
      question: 'Are your products suitable for sensitive skin?',
      answer: 'Our products are formulated with gentle, natural ingredients that are generally suitable for sensitive skin. However, we recommend patch testing before full use. Consult with a dermatologist if you have specific skin concerns.'
    },
    {
      question: 'How should I store the products?',
      answer: 'Store products in a cool, dry place away from direct sunlight. Avoid storing in humid areas like bathrooms. Some products may need refrigeration - check individual product instructions.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-[#B56F76] mb-4 font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Find answers to common questions about our organic beauty products
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#E4C7D1]/10 rounded-2xl overflow-hidden border border-[#E4C7D1]/20"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#E4C7D1]/20 transition-colors"
                whileHover={{ backgroundColor: 'rgba(228, 199, 209, 0.2)' }}
              >
                <h3 className="text-lg font-semibold text-[#B56F76] pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openFAQ === index ? (
                    <Minus size={24} className="text-[#B56F76]" />
                  ) : (
                    <Plus size={24} className="text-[#B56F76]" />
                  )}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-[#B56F76] to-[#E4C7D1] rounded-2xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="mb-6 opacity-90">
            Our customer service team is here to help you with any questions about our products
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#B56F76] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;