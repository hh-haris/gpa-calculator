import React, { useState } from 'react';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import FluidTabs from '@/components/FluidTabs';
import { GridBackground } from '@/components/GridBackground';
import { motion } from 'framer-motion';
import { trackAnalytics } from '@/utils/analytics';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  const tabs = [
    { id: 'gpa', label: 'GPA Calculator' },
    { id: 'cgpa', label: 'CGPA Calculator' }
  ];

  const handleCalculateGPA = async (gpa?: number, subjectsCount?: number) => {
    // Track analytics when GPA is calculated
    if (gpa !== undefined) {
      await trackAnalytics({
        gpaCalculated: gpa,
        subjectsCount: subjectsCount
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter transition-all duration-300 relative">
      {/* Grid Background */}
      <GridBackground />

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-6 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center mb-4">
            <div className="flex-1 flex flex-col items-center">
              <motion.h1 
                className="text-lg sm:text-xl md:text-2xl font-bold text-[#000000] font-jakarta mb-2 relative z-20"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                UoH GPA Calculator
              </motion.h1>
            </div>
          </div>
          
          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-[#FAE6B4] p-4 max-w-2xl mx-auto rounded-xl">
              <div className="text-[#979797] font-inter text-xs sm:text-sm text-center">
                While this calculator is designed with care and accuracy in mind, any unexpected errors or incorrect results are beyond our responsibility.
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Tab Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FluidTabs 
            activeTab={activeTab} 
            onTabChange={(tab) => setActiveTab(tab as 'gpa' | 'cgpa')} 
            tabs={tabs}
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
          {activeTab === 'gpa' ? (
            <GPACalculator onCalculate={handleCalculateGPA} />
          ) : (
            <CGPACalculator onCalculate={handleCalculateGPA} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;