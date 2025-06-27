
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { GridBackground } from '@/components/GridBackground';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { AppSidebar, SidebarTrigger } from '@/components/AppSidebar';
import SuggestionForm from '@/components/SuggestionForm';

const Suggest = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const handleAgree = () => {
    if (agreedToTerms) {
      setShowSuggestionForm(true);
    }
  };

  if (showSuggestionForm) {
    return <SuggestionForm />;
  }

  return (
    <div className="min-h-screen bg-white font-inter relative">
      <GridBackground />
      
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <SidebarTrigger onClick={() => setSidebarOpen(true)} />
      
      <StickyBanner className="bg-gradient-to-r from-[#0088CC] to-[#0077BB]">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md font-inter text-xs sm:text-sm">
          Help us make your academic experience better! 💡
        </p>
      </StickyBanner>

      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[#000000] font-jakarta mb-2 flex items-center justify-center gap-2">
            <MessageSquare className="text-[#0088CC]" size={24} />
            Suggest Features
          </h1>
          <p className="text-[#979797] font-inter text-sm">
            Share your ideas to improve our platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-[#FAE6B4] p-6 rounded-xl border border-[#FAE6B4]">
            <p className="text-[#979797] font-inter text-sm text-center mb-4">
              <strong>Suggest Feature</strong> is only available for 2024 Batch AI Students of Section A and B
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border-2 border-[#EEEEEE] shadow-lg"
        >
          <h2 className="text-lg font-bold text-[#000000] font-jakarta mb-4">
            Student Verification
          </h2>
          
          <p className="text-[#979797] font-inter text-sm mb-6">
            Before proceeding to the suggestion form, please confirm that you are a student of the specified batch and section.
          </p>

          <div className="flex items-start space-x-3 mb-6">
            <Checkbox
              id="student-verification"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="student-verification" className="text-sm font-inter text-[#000000] leading-relaxed">
              Yes, I am a student of <strong>2024 Batch AI Section A or B</strong> and I understand that this feature is exclusively available for students from these sections.
            </label>
          </div>

          <Button
            onClick={handleAgree}
            disabled={!agreedToTerms}
            className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Suggestion Form
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Suggest;
