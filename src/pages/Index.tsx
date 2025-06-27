
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import DarkModeToggle from '@/components/DarkModeToggle';
import { motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-inter transition-all duration-300">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
        {/* Dark Mode Toggle */}
        <motion.div
          className="flex justify-end mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center mb-4">
            <div className="flex-1 flex flex-col items-center">
              <motion.h1 
                className="text-lg sm:text-xl md:text-2xl font-bold text-[#000000] dark:text-white font-jakarta mb-2 text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                UoH GPA Calculator
              </motion.h1>
              <motion.p 
                className="text-[#979797] dark:text-gray-400 font-inter text-xs sm:text-sm text-center px-2 max-w-sm mx-auto leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Prepared by students of Batch 2024 – AI Section A & B
              </motion.p>
            </div>
          </div>
          
          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Alert className="bg-[#FAE6B4] dark:bg-yellow-900/30 border-[#FAE6B4] dark:border-yellow-700 mb-6 max-w-2xl mx-auto py-2 px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              <AlertDescription className="text-[#979797] dark:text-yellow-200 font-inter text-xs sm:text-sm text-center relative z-10">
                While this calculator is designed with care and accuracy in mind, any unexpected errors or incorrect results are beyond our responsibility.
              </AlertDescription>
            </Alert>
          </motion.div>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div 
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-[#EEEEEE] dark:bg-gray-800 p-1 rounded-lg inline-flex w-full max-w-md relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0088CC]/5 via-[#0088CC]/10 to-[#0088CC]/5 animate-pulse"></div>
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setActiveTab('gpa')}
                className={`w-full py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base relative z-10 ${
                  activeTab === 'gpa'
                    ? 'bg-[#0088CC] text-white shadow-lg transform scale-105'
                    : 'bg-transparent text-[#979797] dark:text-gray-400 hover:text-[#000000] dark:hover:text-white hover:scale-102'
                }`}
                variant="ghost"
              >
                GPA Calculator
              </Button>
            </motion.div>
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => setActiveTab('cgpa')}
                className={`w-full py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base relative z-10 ${
                  activeTab === 'cgpa'
                    ? 'bg-[#0088CC] text-white shadow-lg transform scale-105'
                    : 'bg-transparent text-[#979797] dark:text-gray-400 hover:text-[#000000] dark:hover:text-white hover:scale-102'
                }`}
                variant="ghost"
              >
                CGPA Calculator
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Calculator Content */}
        <motion.div 
          className="max-w-4xl mx-auto"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'gpa' ? <GPACalculator /> : <CGPACalculator />}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
