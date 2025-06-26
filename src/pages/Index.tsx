
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] font-jakarta mb-4">
            UoH GPA Calculator
          </h1>
          
          {/* Warning Banner */}
          <Alert className="bg-[#FAE6B4] border-[#FAE6B4] mb-6 max-w-4xl mx-auto">
            <AlertDescription className="text-[#000000] font-inter text-sm sm:text-base text-center">
              While this calculator is designed with care and accuracy in mind, any unexpected errors or incorrect results are beyond our responsibility.
            </AlertDescription>
          </Alert>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-[#EEEEEE] p-1 rounded-lg inline-flex w-full max-w-md">
            <Button
              onClick={() => setActiveTab('gpa')}
              className={`flex-1 py-2 px-4 rounded-md font-inter transition-all text-sm sm:text-base ${
                activeTab === 'gpa'
                  ? 'bg-[#0088CC] text-white shadow-md'
                  : 'bg-transparent text-[#979797] hover:text-[#000000]'
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
                  : 'bg-transparent text-[#979797] hover:text-[#000000]'
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

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#EEEEEE]">
          <p className="text-[#979797] font-inter text-xs sm:text-sm">
            Prepared by students of Batch 2024 – AI Section A & B
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
