
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Target, Award, MessageSquare, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    gpa: number;
    grade: string;
    remarks: string;
  };
  onExport: () => void;
}

const GlassResultModal = ({ isOpen, onClose, result, onExport }: GlassResultModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleExportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onExport();
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
        {/* Enhanced Backdrop with heavy blur */}
        <motion.div 
          className="absolute inset-0 bg-black/30 backdrop-blur-xl"
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(20px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          onClick={handleBackdropClick}
        />
        
        {/* Glass Modal Content */}
        <motion.div
          className="glass-container glass-container--large relative max-w-md w-full mx-4 overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ 
            duration: 0.4, 
            type: "spring", 
            stiffness: 300,
            damping: 25
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Glass Layers */}
          <div className="glass-filter"></div>
          <div className="glass-overlay"></div>
          <div className="glass-specular"></div>

          {/* Modal Content */}
          <div className="glass-content glass-content--modal relative z-10 p-6">
            {/* Close Button */}
            <Button
              onClick={handleCloseClick}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white/70 hover:text-white z-[10000] h-8 w-8 p-0 hover:bg-white/10 rounded-full transition-all duration-200"
              style={{ pointerEvents: 'auto' }}
              type="button"
            >
              <X size={20} />
            </Button>

            {/* Header */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-white font-jakarta">
                GPA Results
              </h2>
            </motion.div>

            {/* Results Cards */}
            <div className="space-y-4 mb-6">
              <motion.div
                className="glass-result-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass-result-filter"></div>
                <div className="glass-result-overlay"></div>
                <div className="glass-result-specular"></div>
                <div className="glass-result-content">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="text-white mr-2" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-white font-jakarta">
                    {result.gpa.toFixed(2)}
                  </div>
                  <div className="text-white/70 font-inter text-sm">GPA</div>
                </div>
              </motion.div>
              
              <motion.div
                className="glass-result-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="glass-result-filter"></div>
                <div className="glass-result-overlay"></div>
                <div className="glass-result-specular"></div>
                <div className="glass-result-content">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="text-white mr-2" size={20} />
                  </div>
                  <div className="text-2xl font-bold text-white font-jakarta">
                    {result.grade}
                  </div>
                  <div className="text-white/70 font-inter text-sm">Grade</div>
                </div>
              </motion.div>
              
              <motion.div
                className="glass-result-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="glass-result-filter"></div>
                <div className="glass-result-overlay"></div>
                <div className="glass-result-specular"></div>
                <div className="glass-result-content">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="text-white mr-2" size={20} />
                  </div>
                  <div className="text-lg font-bold text-white font-jakarta">
                    {result.remarks}
                  </div>
                  <div className="text-white/70 font-inter text-sm">Remarks</div>
                </div>
              </motion.div>
            </div>
            
            {/* Export Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={handleExportClick}
                className="glass-export-button w-full"
                type="button"
                style={{ pointerEvents: 'auto' }}
              >
                <div className="glass-export-filter"></div>
                <div className="glass-export-overlay"></div>
                <div className="glass-export-specular"></div>
                <div className="glass-export-content">
                  <Download size={16} className="mr-2" />
                  Export as PDF
                </div>
              </button>
            </motion.div>
          </div>

          {/* SVG Filter */}
          <svg style={{ display: 'none' }}>
            <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
              <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
              <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
        </motion.div>

        {/* Glass CSS Styles */}
        <style jsx>{`
          .glass-container {
            position: relative;
            display: flex;
            color: white;
            font-weight: 600;
            background: transparent;
            border-radius: 2rem;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2),
                        0 0 20px rgba(0, 0, 0, 0.1);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
            min-width: 28rem;
            cursor: default;
          }

          .glass-filter {
            position: absolute;
            inset: 0;
            z-index: 0;
            backdrop-filter: blur(0px);
            filter: url(#lg-dist);
            isolation: isolate;
          }

          .glass-overlay {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: rgba(255, 255, 255, 0.15);
          }

          .glass-specular {
            position: absolute;
            inset: 0;
            z-index: 2;
            border-radius: inherit;
            overflow: hidden;
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 0 5px rgba(255, 255, 255, 0.3);
          }

          .glass-content--modal {
            position: relative;
            z-index: 3;
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .glass-result-card {
            position: relative;
            background: transparent;
            border-radius: 1rem;
            overflow: hidden;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
          }

          .glass-result-card:hover {
            transform: translateY(-2px);
          }

          .glass-result-filter {
            position: absolute;
            inset: 0;
            z-index: 0;
            backdrop-filter: blur(0px);
            filter: url(#lg-dist);
            isolation: isolate;
          }

          .glass-result-overlay {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: rgba(255, 255, 255, 0.1);
          }

          .glass-result-specular {
            position: absolute;
            inset: 0;
            z-index: 2;
            border-radius: inherit;
            overflow: hidden;
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 0 3px rgba(255, 255, 255, 0.2);
          }

          .glass-result-content {
            position: relative;
            z-index: 3;
            padding: 1rem;
            text-align: center;
          }

          .glass-export-button {
            position: relative;
            background: transparent;
            border: none;
            border-radius: 0.75rem;
            overflow: hidden;
            color: white;
            font-weight: 600;
            font-family: Inter, sans-serif;
            padding: 0;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3rem;
          }

          .glass-export-button:hover {
            transform: translateY(-1px);
          }

          .glass-export-filter {
            position: absolute;
            inset: 0;
            z-index: 0;
            backdrop-filter: blur(0px);
            filter: url(#lg-dist);
            isolation: isolate;
          }

          .glass-export-overlay {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: rgba(0, 136, 204, 0.3);
          }

          .glass-export-specular {
            position: absolute;
            inset: 0;
            z-index: 2;
            border-radius: inherit;
            overflow: hidden;
            box-shadow:
              inset 1px 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 0 4px rgba(255, 255, 255, 0.2);
          }

          .glass-export-content {
            position: relative;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }

          @media (max-width: 640px) {
            .glass-container {
              min-width: auto;
              width: 100%;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlassResultModal;
