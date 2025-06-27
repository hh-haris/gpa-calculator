
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const DarkModeToggle = ({ isDark, onToggle }: DarkModeToggleProps) => {
  return (
    <motion.div
      className="flex items-center bg-[#EEEEEE] dark:bg-gray-800 p-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={onToggle}
        className={`relative flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ${
          !isDark 
            ? 'bg-white text-[#0088CC] shadow-md' 
            : 'text-gray-400 hover:text-gray-300'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sun size={16} className="mr-2" />
        <span className="text-sm font-medium">Light</span>
      </motion.button>
      
      <motion.button
        onClick={onToggle}
        className={`relative flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ${
          isDark 
            ? 'bg-gray-700 text-white shadow-md' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Moon size={16} className="mr-2" />
        <span className="text-sm font-medium">Dark</span>
      </motion.button>
    </motion.div>
  );
};

export default DarkModeToggle;
