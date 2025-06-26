
import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerCardProps {
  children: React.ReactNode;
  className?: string;
}

const ShimmerCard = ({ children, className = '' }: ShimmerCardProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Colorful shimmer effect */}
      <div className="absolute inset-0 rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse rounded-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-green-500/20 via-yellow-500/20 to-red-500/20 animate-pulse rounded-lg opacity-50"></div>
        <div className="absolute inset-[1px] bg-white dark:bg-gray-800 rounded-lg"></div>
      </div>
      
      {/* Enhanced border shimmer */}
      <div className="absolute inset-0 rounded-lg">
        <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 via-red-400 via-yellow-400 to-green-400 rounded-lg opacity-30 animate-pulse"></div>
        <div className="absolute inset-[2px] bg-white dark:bg-gray-800 rounded-lg"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ShimmerCard;
