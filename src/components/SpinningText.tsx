
import React from 'react';
import { motion } from 'framer-motion';

function SpinningText() {
  const text = "Created by Haris H. • Created by Haris H. • ";
  const letters = text.split('');
  const total = letters.length;

  return (
    <div className="fixed top-4 right-4 z-50">
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
          width: 'min(30vw, 120px)',
          height: 'min(30vw, 120px)',
        }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className="absolute text-[0.5rem] sm:text-[0.6rem] font-medium text-[#979797] font-inter"
            style={{
              left: '50%',
              top: '50%',
              transform: `
                rotate(${(360 / total) * index}deg)
                translateY(-2.8em)
              `,
              transformOrigin: 'center',
            }}
          >
            {letter}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default SpinningText;
