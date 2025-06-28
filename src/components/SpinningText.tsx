import React from 'react';
import { motion } from 'framer-motion';

function SpinningText() {
  const text = "Created by Haris H. • Created by Haris H. • ";
  const letters = text.split('');
  const total = letters.length;

  return (
    <div className="relative flex items-center justify-center w-[min(90vw,300px)] h-[min(90vw,300px)] rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
      {/* Spinning Letters */}
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className="absolute text-[0.9rem] sm:text-[1rem] font-medium text-gray-800"
            style={{
              left: '50%',
              top: '50%',
              transform: `
                rotate(${(360 / total) * index}deg)
                translateY(-6.2em)
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

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
      <SpinningText />
    </div>
  );
}

export default App;
