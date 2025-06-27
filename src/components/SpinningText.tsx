
import React from 'react';
import { motion } from 'framer-motion';

function SpinningText() {
  const text = "Created by Haris H. • Created by Haris H. • ";
  const letters = text.split('');
  const total = letters.length;

  return (
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
        width: 'min(70vw, 200px)',
        height: 'min(70vw, 200px)',
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="absolute text-[0.7rem] sm:text-[0.8rem] font-medium text-[#979797] font-inter"
          style={{
            left: '50%',
            top: '50%',
            transform: `
              rotate(${(360 / total) * index}deg)
              translateY(-4.5em)
            `,
            transformOrigin: 'center',
          }}
        >
          {letter}
        </span>
      ))}
    </motion.div>
  );
}

export default SpinningText;
