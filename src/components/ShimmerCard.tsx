
import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerCardProps {
  children: React.ReactNode;
  className?: string;
}

const ShimmerCard = ({ children, className = '' }: ShimmerCardProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Colorful shimmer effect on edges */}
      <div className="absolute inset-0 rounded-lg p-[2px]">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 animate-pulse"></div>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-bounce"></div>
        <div className="absolute inset-[2px] bg-white dark:bg-gray-800 rounded-lg"></div>
      </div>
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg">
        <div 
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)',
            backgroundSize: '400% 400%',
            animation: 'gradient-shift 4s ease infinite'
          }}
        ></div>
        <div className="absolute inset-[1px] bg-white dark:bg-gray-800 rounded-lg"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ShimmerCard;
