import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SpinningText() {
  const [isVisible, setIsVisible] = useState(true);
  const text = "Created by Haris H ";
  const letters = text.split('');
  const total = letters.length;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glass morphic circle background */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg"></div>
          
          <motion.div
            className="relative"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              width: '110px',
              height: '110px',
            }}
          >
            {letters.map((letter, index) => (
              <span
                key={index}
                className="absolute text-[0.2rem] font-medium text-[#979797] font-inter"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `
                    rotate(${(360 / total) * index}deg)
                    translateY(-3.5em)
                  `,
                  transformOrigin: 'center',
                }}
              >
                {letter}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpinningText;