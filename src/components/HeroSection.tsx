// import React, { useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { gsap } from 'gsap';
// import { ArrowDown, Sparkles } from 'lucide-react';

// const HeroSection: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // GSAP animations for text
//     const tl = gsap.timeline({ delay: 1 });
    
//     tl.from('.hero-title', {
//       y: 100,
//       opacity: 0,
//       duration: 1,
//       stagger: 0.3,
//       ease: 'power3.out'
//     })
//     .from('.hero-subtitle', {
//       y: 50,
//       opacity: 0,
//       duration: 0.8,
//       ease: 'power2.out'
//     }, '-=0.5')
//     .from('.hero-cta', {
//       y: 30,
//       opacity: 0,
//       duration: 0.6,
//       ease: 'power2.out'
//     }, '-=0.3');

//     // Floating animation for sparkles
//     gsap.to('.floating', {
//       y: -20,
//       duration: 2,
//       repeat: -1,
//       yoyo: true,
//       ease: 'power2.inOut',
//       stagger: 0.5
//     });
//   }, []);

//   return (
//     <section className="relative h-screen overflow-hidden">
//       {/* Background Video */}
//       <div className="absolute inset-0">
//         <video
//           ref={videoRef}
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="w-full h-full object-cover"
//         >
//           <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9ce3ce8&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
//         </video>
//         <div className="absolute inset-0 bg-gradient-to-r from-[#B56F76]/70 to-[#E4C7D1]/70" />
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <Sparkles className="floating absolute top-1/4 left-1/4 text-white/30" size={24} />
//         <Sparkles className="floating absolute top-1/3 right-1/4 text-white/40" size={32} />
//         <Sparkles className="floating absolute bottom-1/3 left-1/3 text-white/20" size={28} />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 h-full flex items-center justify-center text-center">
//         <div ref={textRef} className="max-w-4xl mx-auto px-4">
//           <motion.h1 
//             className="hero-title text-6xl md:text-8xl font-bold text-white mb-6 font-serif"
//             style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
//           >
//             Natural
//           </motion.h1>
//           <motion.h1 
//             className="hero-title text-6xl md:text-8xl font-bold text-white mb-6 font-serif"
//             style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
//           >
//             Beauty
//           </motion.h1>
//           <motion.p 
//             className="hero-subtitle text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
//             style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
//           >
//             Discover our premium collection of organic soaps, shampoos, and oils crafted with love for your natural glow
//           </motion.p>
//           <motion.button
//             className="hero-cta bg-white text-[#B56F76] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#E4C7D1] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Shop Now
//           </motion.button>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//         animate={{ y: [0, 10, 0] }}
//         transition={{ duration: 2, repeat: Infinity }}
//       >
//         <ArrowDown className="text-white" size={32} />
//       </motion.div>
//     </section>
//   );
// };

// export default HeroSection;
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowDown, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations for text
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from('.hero-title', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.4,
      ease: 'power3.out'
    })
    .from('.hero-subtitle', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.6')
    .from('.hero-cta', {
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4');

    // Floating animation for sparkles
    gsap.to('.floating', {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3
    });
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9ce3ce8&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#B56F76]/60 via-[#B56F76]/40 to-[#E4C7D1]/70" />
      </div>

   
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div ref={textRef} className="max-w-4xl mx-auto mt-20">
          <motion.div 
            className="hero-title text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-4 font-serif leading-tight"
          >
            <div className="inline-block bg-gradient-to-r from-white to-[#E4C7D1] bg-clip-text text-transparent">
              Natural
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-title text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-6 font-serif leading-tight"
          >
            <div className="inline-block bg-gradient-to-r from-white to-[#E4C7D1] bg-clip-text text-transparent">
              Beauty
            </div>
          </motion.div>
          
          <motion.p 
            className="hero-subtitle text-lg md:text-xl lg:text-4xl text-white bg-clip-text mb-8 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Discover our premium collection of organic soaps, shampoos, and oils crafted with love for your natural glow
          </motion.p>
          
          <motion.button
            className="hero-cta bg-white text-[#B56F76] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#E4C7D1] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2 font-light">Scroll down</span>
          <ArrowDown className="text-white/80" size={24} />
        </div>
      </motion.div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;