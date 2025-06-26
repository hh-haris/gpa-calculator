
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Target, Award, MessageSquare, Download } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    gpa: number;
    grade: string;
    remarks: string;
  };
  onExport: () => void;
}

const ResultModal = ({ isOpen, onClose, result, onExport }: ResultModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-[#979797] hover:text-[#000000]"
        >
          <X size={20} />
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#0088CC] font-jakarta">
            GPA Results
          </h2>
        </div>

        {/* Results */}
        <div className="space-y-4 mb-6">
          <div className="bg-white/50 p-4 rounded-lg border border-white/20 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="text-[#0088CC] mr-2" size={20} />
            </div>
            <div className="text-2xl font-bold text-[#0088CC] font-jakarta">
              {result.gpa.toFixed(2)}
            </div>
            <div className="text-[#979797] font-inter text-sm">GPA</div>
          </div>
          
          <div className="bg-white/50 p-4 rounded-lg border border-white/20 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="text-[#000000] mr-2" size={20} />
            </div>
            <div className="text-2xl font-bold text-[#000000] font-jakarta">
              {result.grade}
            </div>
            <div className="text-[#979797] font-inter text-sm">Grade</div>
          </div>
          
          <div className="bg-white/50 p-4 rounded-lg border border-white/20 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="text-[#000000] mr-2" size={20} />
            </div>
            <div className="text-lg font-bold text-[#000000] font-jakarta">
              {result.remarks}
            </div>
            <div className="text-[#979797] font-inter text-sm">Remarks</div>
          </div>
        </div>
        
        {/* Export Button */}
        <div className="text-center">
          <Button
            onClick={onExport}
            className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full"
          >
            <Download size={16} className="mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
