
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublishGPAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: {
    name?: string;
    class: string;
    section: string;
    semester: string;
    message?: string;
    gpa: number;
    type: 'GPA' | 'CGPA';
  }) => void;
}

const PublishGPAModal = ({ isOpen, onClose, onPublish }: PublishGPAModalProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    semester: '',
    message: '',
    gpa: '',
    type: 'GPA' as 'GPA' | 'CGPA'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.class || !formData.section || !formData.semester || !formData.gpa) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmPublish = () => {
    onPublish({
      name: formData.name || undefined,
      class: formData.class,
      section: formData.section,
      semester: formData.semester,
      message: formData.message || undefined,
      gpa: parseFloat(formData.gpa),
      type: formData.type
    });

    setFormData({
      name: '',
      class: '',
      section: '',
      semester: '',
      message: '',
      gpa: '',
      type: 'GPA'
    });
    setShowConfirmation(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />
        
        <motion.div
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-[#979797] hover:text-[#000000] h-8 w-8 p-0"
          >
            <X size={20} />
          </Button>

          {!showConfirmation ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0088CC] font-jakarta">
                  Publish Your GPA
                </h2>
                <p className="text-sm text-[#979797] font-inter">
                  Share your academic achievement with your classmates
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-inter text-[#000000]">
                    Name (Optional)
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="border-[#979797] focus:border-[#0088CC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      Class *
                    </Label>
                    <Input
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      placeholder="e.g., AI"
                      required
                      className="border-[#979797] focus:border-[#0088CC]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      Section *
                    </Label>
                    <Input
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      placeholder="e.g., A"
                      required
                      className="border-[#979797] focus:border-[#0088CC]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-inter text-[#000000]">
                    Semester *
                  </Label>
                  <Input
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    placeholder="e.g., 3rd"
                    required
                    className="border-[#979797] focus:border-[#0088CC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      Type *
                    </Label>
                    <Select value={formData.type} onValueChange={(value: 'GPA' | 'CGPA') => setFormData({...formData, type: value})}>
                      <SelectTrigger className="border-[#979797] focus:border-[#0088CC]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GPA">GPA</SelectItem>
                        <SelectItem value="CGPA">CGPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-inter text-[#000000]">
                      {formData.type} *
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                      placeholder="e.g., 3.8"
                      required
                      className="border-[#979797] focus:border-[#0088CC]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-inter text-[#000000]">
                    Message (Optional)
                  </Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Share your thoughts or experience..."
                    className="border-[#979797] focus:border-[#0088CC] h-20"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full"
                >
                  Publish
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0088CC] font-jakarta mb-4">
                Are you sure?
              </h2>
              <p className="text-sm text-[#979797] font-inter mb-6">
                Are you sure you want to publish your GPA to the wall? This will be visible to all users.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmPublish}
                  className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter flex-1"
                >
                  Yes, Publish
                </Button>
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="border-[#979797] text-[#979797] hover:bg-[#EEEEEE] flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PublishGPAModal;
