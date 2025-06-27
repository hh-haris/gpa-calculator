
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StickyBanner } from '@/components/ui/sticky-banner';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import FluidTabs from '@/components/FluidTabs';
import SpinningText from '@/components/SpinningText';
import { GridBackground } from '@/components/GridBackground';
import GlassMorphismOverlay from '@/components/GlassMorphismOverlay';
import { motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');
  const [showOverlay, setShowOverlay] = useState(false);

  const tabs = [
    { id: 'gpa', label: 'GPA Calculator' },
    { id: 'cgpa', label: 'CGPA Calculator' }
  ];

  const handleCalculateGPA = () => {
    setShowOverlay(true);
    // Simulate calculation time
    setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-inter transition-all duration-300 relative">
      {/* Grid Background */}
      <GridBackground />
      
      {/* Glass Morphism Overlay */}
      <GlassMorphismOverlay 
        isVisible={showOverlay} 
        onClose={() => setShowOverlay(false)} 
      />
      
      {/* Sticky Banner */}
      <StickyBanner className="bg-gradient-to-r from-[#0088CC] to-[#0077BB]">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md font-inter text-xs sm:text-sm">
          Welcome to UoH GPA Calculator - Your academic companion.{" "}
          <a href="#" className="transition duration-200 hover:underline font-medium">
            Learn more
          </a>
        </p>
      </StickyBanner>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl relative z-10">
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
                className="text-lg sm:text-xl md:text-2xl font-bold text-[#000000] font-jakarta mb-2"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                UoH GPA Calculator
              </motion.h1>
              
              {/* Spinning Text */}
              <motion.div
                className="flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SpinningText />
              </motion.div>
            </div>
          </div>
          
          {/* Warning Banner */}
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
