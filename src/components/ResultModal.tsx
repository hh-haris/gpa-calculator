import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Target, Award, MessageSquare, Download, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackAnalytics } from '@/utils/analytics';

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
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleExportClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onExport();
    
    // Track PDF download
    await trackAnalytics({
      pdfDownloaded: true
    });
  };

  const handleWhatsAppShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = `🎓 My GPA Results from UoH Calculator:
    
📊 GPA: ${result.gpa.toFixed(2)}
🏆 Grade: ${result.grade}
💬 Remarks: ${result.remarks}

Calculated using UoH GPA Calculator ✨
Created by Haris H`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Track WhatsApp share
    await trackAnalytics({
      whatsappShared: true
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleBackdropClick}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Backdrop with blur */}
        <motion.div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(8px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          onClick={handleBackdropClick}
        />
        
        {/* Modal Content - Made smaller and centered */}
        <motion.div
          className="relative bg-white/90 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl max-w-sm w-full mx-4 p-4 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0088CC]/10 to-transparent animate-pulse"></div>
          
          {/* Close Button */}
          <Button
            onClick={handleCloseClick}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-[#979797] hover:text-[#000000] z-[10000] h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-all duration-200"
            style={{ pointerEvents: 'auto' }}
            type="button"
          >
            <X size={16} />
          </Button>

          {/* Header */}
          <motion.div
            className="text-center mb-4 relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-bold text-[#0088CC] font-jakarta">
              GPA Results
            </h2>
          </motion.div>

          {/* Results */}
          <div className="space-y-3 mb-4 relative z-10">
            <motion.div
              className="bg-white/50 p-3 rounded-lg border border-white/20 text-center relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0088CC]/5 to-transparent"></div>
              <div className="flex items-center justify-center mb-1 relative z-10">
                <Target className="text-[#0088CC] mr-2" size={16} />
              </div>
              <div className="text-xl font-bold text-[#0088CC] font-jakarta relative z-10">
                {result.gpa.toFixed(2)}
              </div>
              <div className="text-[#979797] font-inter text-xs relative z-10">GPA</div>
            </motion.div>
            
            <motion.div
              className="bg-white/50 p-3 rounded-lg border border-white/20 text-center relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/5 to-transparent"></div>
              <div className="flex items-center justify-center mb-1 relative z-10">
                <Award className="text-[#000000] mr-2" size={16} />
              </div>
              <div className="text-xl font-bold text-[#000000] font-jakarta relative z-10">
                {result.grade}
              </div>
              <div className="text-[#979797] font-inter text-xs relative z-10">Grade</div>
            </motion.div>
            
            <motion.div
              className="bg-white/50 p-3 rounded-lg border border-white/20 text-center relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#979797]/5 to-transparent"></div>
              <div className="flex items-center justify-center mb-1 relative z-10">
                <MessageSquare className="text-[#000000] mr-2" size={16} />
              </div>
              <div className="text-sm font-bold text-[#000000] font-jakarta relative z-10">
                {result.remarks}
              </div>
              <div className="text-[#979797] font-inter text-xs relative z-10">Remarks</div>
            </motion.div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleExportClick}
                className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full transition-all duration-200 text-sm h-10"
                type="button"
                style={{ pointerEvents: 'auto' }}
              >
                <Download size={14} className="mr-2" />
                Export as PDF
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleWhatsAppShare}
                className="bg-green-500 hover:bg-green-600 text-white font-inter w-full transition-all duration-200 text-sm h-10"
                type="button"
                style={{ pointerEvents: 'auto' }}
              >
                <Share size={14} className="mr-2" />
                Share on WhatsApp
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultModal;