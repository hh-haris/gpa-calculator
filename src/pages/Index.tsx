
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';
import DarkModeToggle from '@/components/DarkModeToggle';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-inter transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#000000] dark:text-white font-jakarta">
                UoH GPA Calculator
              </h1>
              <p className="text-[#979797] font-inter text-xs mt-1">
                Prepared by students of Batch 2024 – AI Section A & B
              </p>
            </div>
            <DarkModeToggle />
          </div>
          
          {/* Warning Banner - Smaller */}
          <Alert className="bg-[#FAE6B4] border-[#FAE6B4] mb-6 max-w-3xl mx-auto py-3">
            <AlertDescription className="text-[#979797] font-inter text-xs sm:text-sm text-center">
              While this calculator is designed with care and accuracy in mind, any unexpected errors or incorrect results are beyond our responsibility.
            </AlertDescription>
          </Alert>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-[#EEEEEE] dark:bg-gray-700 p-1 rounded-lg inline-flex w-full max-w-md">
            <Button
              onClick={() => setActiveTab('gpa')}
              className={`flex-1 py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base ${
                activeTab === 'gpa'
                  ? 'bg-[#0088CC] text-white shadow-md'
                  : 'bg-transparent text-[#979797] hover:text-[#000000] dark:hover:text-white'
              }`}
              variant="ghost"
            >
              GPA Calculator
            </Button>
            <Button
              onClick={() => setActiveTab('cgpa')}
              className={`flex-1 py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base ${
                activeTab === 'cgpa'
                  ? 'bg-[#0088CC] text-white shadow-md'
                  : 'bg-transparent text-[#979797] hover:text-[#000000] dark:hover:text-white'
              }`}
              variant="ghost"
            >
              CGPA Calculator
            </Button>
          </div>
        </div>

        {/* Calculator Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'gpa' ? <GPACalculator /> : <CGPACalculator />}
        </div>
      </div>
    </div>
  );
};

export default Index;
