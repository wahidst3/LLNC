import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Heart, Award, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Parallax effect for background elements
    gsap.to('.about-bg', {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Stats counter animation
    gsap.fromTo('.stat-number', 
      { textContent: 0 },
      {
        textContent: (i, target) => target.getAttribute('data-count'),
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 80%',
        }
      }
    );
  }, []);

  const features = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'All our products are made with organic, sustainably sourced ingredients'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Handcrafted in small batches with attention to every detail'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Certified organic ingredients and rigorous quality standards'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Supporting local farmers and sustainable beauty practices'
    }
  ];

  const stats = [
    { number: 5000, label: 'Happy Customers', suffix: '+' },
    { number: 50, label: 'Organic Products', suffix: '+' },
    { number: 3, label: 'Years Experience', suffix: '' },
    { number: 99, label: 'Customer Satisfaction', suffix: '%' }
  ];

  return (
    <section ref={sectionRef} id="about" className="relative py-20 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="about-bg absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#E4C7D1] rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#B56F76] rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#E4C7D1] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-[#B56F76] mb-6 font-serif">
            About LNCC Organics
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We believe that true beauty comes from nature's finest ingredients. Our journey began with a simple mission: 
            to create premium organic beauty products that nurture your skin while respecting our planet.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="text-center group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#E4C7D1] to-[#B56F76] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#B56F76] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="stats-grid bg-gradient-to-r from-[#B56F76] to-[#E4C7D1] rounded-3xl p-12 text-white"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={stat.label} className="group">
                <motion.div
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <span 
                    className="stat-number"
                    data-count={stat.number}
                  >
                    0
                  </span>
                  <span>{stat.suffix}</span>
                </motion.div>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="parallax"
          >
            <img
              src="https://images.pexels.com/photos/4465659/pexels-photo-4465659.jpeg"
              alt="Organic skincare products"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-[#B56F76] font-serif">Our Story</h3>
            <p className="text-gray-700 leading-relaxed">
              Founded by passionate advocates of natural beauty, LNCC Organics was born from a desire 
              to create products that are as kind to your skin as they are to the environment. 
            </p>
            <p className="text-gray-700 leading-relaxed">
              Every product in our collection is carefully formulated using time-honored traditions 
              combined with modern organic chemistry, ensuring that you receive the purest, 
              most effective natural beauty solutions.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#B56F76] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B56F76]/90 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;