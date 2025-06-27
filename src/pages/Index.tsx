
import React, { useState, useEffect } from 'react';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import { motion } from 'framer-motion';
import { GridBackground } from '@/components/ui/grid-background';
import FluidTabs from '@/components/ui/fluid-tabs';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { SpinningText } from '@/components/ui/spinning-text';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <GridBackground>
      {/* Sticky Banner */}
      <StickyBanner className="bg-gradient-to-r from-blue-500 to-blue-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          Welcome to UoH GPA Calculator - Calculate your GPA and CGPA with ease.{" "}
          <a href="#" className="transition duration-200 hover:underline">
            Learn more
          </a>
        </p>
      </StickyBanner>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
        {/* Dark Mode Toggle */}
        <motion.div
          className="flex justify-end mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </motion.div>

        {/* Header with Spinning Text */}
        <motion.div 
          className="text-center mb-6 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center mb-4 relative">
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
            
            {/* Spinning Text */}
            <div className="absolute -right-16 top-0">
              <SpinningText
                radius={3}
                fontSize={0.6}
                className="font-medium leading-none text-[#0088CC] dark:text-blue-400"
              >
                {`Created by Haris H AI Student • `}
              </SpinningText>
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

        {/* Fluid Tab Switcher */}
        <motion.div 
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FluidTabs 
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'gpa' | 'cgpa')}
          />
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
    </GridBackground>
  );
};

export default Index;
