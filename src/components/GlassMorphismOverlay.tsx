
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassMorphismOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const GlassMorphismOverlay = ({ isVisible, onClose }: GlassMorphismOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Glass morphism backdrop */}
          <motion.div 
            className="absolute inset-0 bg-white/10 backdrop-blur-md"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(12px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
          />
          
          {/* Loading content */}
          <motion.div
            className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl p-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[#0088CC] font-jakarta text-lg font-bold mb-4">
              Calculating GPA...
            </div>
            <div className="w-8 h-8 border-2 border-[#0088CC] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassMorphismOverlay;
