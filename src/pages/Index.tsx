
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GPACalculator from '@/components/GPACalculator';
import CGPACalculator from '@/components/CGPACalculator';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#000000] font-jakarta mb-2">
            UoH GPA Calculator
          </h1>
          <p className="text-[#979797] font-inter">
            University of Hyderabad Academic Performance Calculator
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#EEEEEE] p-1 rounded-lg inline-flex">
            <Button
              onClick={() => setActiveTab('gpa')}
              className={`px-6 py-2 rounded-md font-inter transition-all ${
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
              className={`px-6 py-2 rounded-md font-inter transition-all ${
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
        <div className="text-center mt-12 pt-8 border-t border-[#EEEEEE]">
          <p className="text-[#979797] font-inter text-sm">
            Prepared by students of Batch 2024 – AI Section A & B
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
