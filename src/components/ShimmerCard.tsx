
import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerCardProps {
  children: React.ReactNode;
  className?: string;
}

const ShimmerCard = ({ children, className = '' }: ShimmerCardProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0088CC]/20 to-transparent animate-pulse rounded-lg"></div>
        <div className="absolute inset-[1px] bg-white dark:bg-gray-800 rounded-lg"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ShimmerCard;
