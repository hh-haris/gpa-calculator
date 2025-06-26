import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import { motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  return (
    <div className="min-h-screen bg-white font-inter transition-all duration-300">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
        {/* Header - Better Centered */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-start mb-4">
            <div className="flex-1 flex flex-col items-center">
              <motion.h1 
                className="text-lg sm:text-xl md:text-2xl font-bold text-[#000000] font-jakarta mb-2"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                UoH GPA Calculator
              </motion.h1>
              <motion.p 
                className="text-[#979797] font-inter text-xs sm:text-sm text-center px-2 whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Prepared by students of Batch 2024 – AI Section A & B
              </motion.p>
            </div>
          </div>
          
          {/* Warning Banner - Smaller and Better Styled */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Alert className="bg-[#FAE6B4] border-[#FAE6B4] mb-6 max-w-2xl mx-auto py-2 px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              <AlertDescription className="text-[#979797] font-inter text-xs sm:text-sm text-center relative z-10">
                While this calculator is designed with care and accuracy in mind, any unexpected errors or incorrect results are beyond our responsibility.
              </AlertDescription>
            </Alert>
          </motion.div>
        </motion.div>

        {/* Tab Switcher with Animation */}
        <motion.div 
          className="flex justify-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-[#EEEEEE] p-1 rounded-lg inline-flex w-full max-w-md relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0088CC]/5 via-[#0088CC]/10 to-[#0088CC]/5 animate-pulse"></div>
            <Button
              onClick={() => setActiveTab('gpa')}
              className={`flex-1 py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base relative z-10 ${
                activeTab === 'gpa'
                  ? 'bg-[#0088CC] text-white shadow-lg transform scale-105'
                  : 'bg-transparent text-[#979797] hover:text-[#000000] hover:scale-102'
              }`}
              variant="ghost"
            >
              GPA Calculator
            </Button>
            <Button
              onClick={() => setActiveTab('cgpa')}
              className={`flex-1 py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base relative z-10 ${
                activeTab === 'cgpa'
                  ? 'bg-[#0088CC] text-white shadow-lg transform scale-105'
                  : 'bg-transparent text-[#979797] hover:text-[#000000] hover:scale-102'
              }`}
              variant="ghost"
            >
              CGPA Calculator
            </Button>
          </div>
        </motion.div>

        {/* Calculator Content with Animation */}
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