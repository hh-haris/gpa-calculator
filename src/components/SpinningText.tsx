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
        width: 'min(90vw, 300px)',
        height: 'min(90vw, 300px)',
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
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <SpinningText />
    </div>
  );
}

export default App;
