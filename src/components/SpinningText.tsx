import React from 'react';
import { motion } from 'framer-motion';

function SpinningText() {
  const text = 'Created by Haris H. • Created by Haris H. • ';
  const letters = text.split('');
  const total = letters.length;

  return (
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
            className="absolute text-[10px] text-black font-medium"
            style={{
              left: '50%',
              top: '50%',
              transform: `
                rotate(${(360 / total) * i}deg)
                translateY(-52px)
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
