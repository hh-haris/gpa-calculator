import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SpinningText() {
  const [isVisible, setIsVisible] = useState(true);
  const text = 'Created by Haris H. • Created by Haris H. • ';
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
          <div className="relative w-[110px] h-[110px] flex items-center justify-center">
            {/* ✅ Glassmorphic Circular Background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/30 shadow-lg" />

            {/* ✅ Spinning Text Circle */}
            <motion.div
              className="absolute inset-0"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] text-[#979797] font-medium font-mono"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `
                      rotate(${(360 / total) * i}deg)
                      translateY(-35px)
                    `,
                    transformOrigin: 'center',
                  }}
                >
                  {letter}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpinningText;