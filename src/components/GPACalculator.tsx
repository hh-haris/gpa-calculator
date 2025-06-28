import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, BookOpen, Hash, Award } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Subject, calculateGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';
import ResultModal from './ResultModal';
import ShimmerCard from './ShimmerCard';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

const subjectOptions = [
  { value: 4, label: "4 Subjects" },
  { value: 5, label: "5 Subjects" },
  { value: 6, label: "6 Subjects" },
  { value: 7, label: "7 Subjects" },
  { value: 8, label: "8 Subjects" },
];

interface GPACalculatorProps {
  onCalculate?: (gpa?: number, subjectsCount?: number) => void;
}

const GPACalculator = ({ onCalculate }: GPACalculatorProps) => {
  const [open, setOpen] = useState(false);
  const [subjectCount, setSubjectCount] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [result, setResult] = useState<null | {
    gpa: number;
    grade: string;
    remarks: string;
  }>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (subjectCount) {
      const newSubjects = Array.from({ length: subjectCount }, (_, index) => ({
        id: (index + 1).toString(),
        name: '',
        marks: '', // Changed to empty string instead of 0
        creditHours: 1
      }));
      setSubjects(newSubjects);
    } else {
      setSubjects([]);
    }
  }, [subjectCount]);

  const triggerConfetti = (gpa: number) => {
    if (gpa >= 3) {
      // Create a temporary canvas with higher z-index for confetti
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999'; // Higher than modal
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);

      // Colorful confetti with reduced density and shorter duration
      const duration = 1000; // 1 second
      const end = Date.now() + duration;
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });

      const frame = () => {
        if (Date.now() > end) {
          // Remove the canvas after confetti is done
          document.body.removeChild(canvas);
          return;
        }

        // Left side confetti
        myConfetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors,
          gravity: 0.8,
          scalar: 0.8,
        });

        // Right side confetti
        myConfetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors,
          gravity: 0.8,
          scalar: 0.8,
        });

        // Center confetti
        myConfetti({
          particleCount: 2,
          angle: 90,
          spread: 45,
          origin: { x: 0.5, y: 0.6 },
          colors: colors,
          gravity: 0.8,
          scalar: 0.8,
        });

        requestAnimationFrame(frame);
      };
      frame();
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const calculateResult = () => {
    // Convert marks to numbers and validate
    const validSubjects = subjects.filter(subject => {
      const marks = typeof subject.marks === 'string' ? parseFloat(subject.marks) : subject.marks;
      return subject.name.trim() !== '' && !isNaN(marks) && marks >= 0 && marks <= 100;
    }).map(subject => ({
      ...subject,
      marks: typeof subject.marks === 'string' ? parseFloat(subject.marks) : subject.marks
    }));

    if (validSubjects.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all subject details with marks between 0-100.",
        variant: "destructive"
      });
      return;
    }

    if (validSubjects.length !== subjectCount) {
      toast({
        title: "Incomplete Data",
        description: "Please fill in all subjects before calculating.",
        variant: "destructive"
      });
      return;
    }

    const gpa = calculateGPA(validSubjects);
    const percentage = getGPAPercentage(gpa);
    const grade = getLetterGrade(percentage);
    const remarks = getRemarks(percentage);

    setResult({ gpa, grade, remarks });
    setShowModal(true);
    
    // Call the onCalculate prop if provided
    if (onCalculate) {
      onCalculate(gpa, validSubjects.length);
    }
    
    // Trigger confetti after a short delay
    setTimeout(() => triggerConfetti(gpa), 500);
  };

  const exportToPDF = () => {
    if (!result) return;
    
    try {
      const doc = new jsPDF();
      
      // Set font
      doc.setFont('helvetica');
      
      // Header with improved design
      doc.setFontSize(24);
      doc.setTextColor(0, 136, 204); // #0088CC
      doc.text('UoH GPA Calculator', 105, 25, { align: 'center' });
      
      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('University of Haripur', 105, 35, { align: 'center' });
      
      // Decorative line
      doc.setDrawColor(0, 136, 204);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // Results section with better formatting
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Academic Results', 20, 60);
      
      // Results box
      doc.setDrawColor(238, 238, 238);
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(20, 70, 170, 40, 3, 3, 'FD');
      
      // GPA Result
      doc.setFontSize(14);
      doc.setTextColor(0, 136, 204);
      doc.text('GPA:', 30, 85);
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(result.gpa.toFixed(2), 60, 85);
      
      // Grade
      doc.setFontSize(14);
      doc.setTextColor(0, 136, 204);
      doc.text('Grade:', 30, 95);
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(result.grade, 70, 95);
      
      // Remarks
      doc.setFontSize(14);
      doc.setTextColor(0, 136, 204);
      doc.text('Remarks:', 30, 105);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(result.remarks, 80, 105);
      
      // Subject details section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Subject Details', 20, 130);
      
      // Table header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No.', 25, 145);
      doc.text('Subject Name', 40, 145);
      doc.text('Marks', 120, 145);
      doc.text('Credit Hours', 150, 145);
      
      // Table line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 148, 190, 148);
      
      let yPosition = 160;
      subjects.forEach((subject, index) => {
        if (yPosition > 270) { // Check if we need a new page
          doc.addPage();
          yPosition = 30;
        }
        
        const marks = typeof subject.marks === 'string' ? parseFloat(subject.marks) : subject.marks;
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}.`, 25, yPosition);
        doc.text(subject.name, 40, yPosition);
        doc.text(`${marks}/100`, 120, yPosition);
        doc.text(subject.creditHours.toString(), 160, yPosition);
        
        yPosition += 12;
      });
      
      // Footer with improved design
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Footer line
      doc.setDrawColor(0, 136, 204);
      doc.line(20, yPosition + 20, 190, yPosition + 20);
      
      // Footer text
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 35);
      
      // Creator credit
      doc.setFontSize(12);
      doc.setTextColor(0, 136, 204);
      doc.text('Created with by Haris H', 105, yPosition + 50, { align: 'center' });
      
      // Website credit
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('UoH GPA Calculator', 105, yPosition + 60, { align: 'center' });
      
      // Save the PDF
      doc.save(`GPA_Results_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export Complete",
        description: "Your GPA results have been downloaded as a PDF file.",
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Export Error",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Subject Count Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShimmerCard>
          <Card className="border-2 border-[#EEEEEE]">
            <CardHeader className="bg-[#EEEEEE] p-4 sm:p-6">
              <CardTitle className="font-jakarta font-semibold text-[#000000] text-lg sm:text-xl">
                Number of Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between border-[#979797] focus:border-[#0088CC] h-12 text-base"
                  >
                    {subjectCount
                      ? subjectOptions.find((option) => option.value === subjectCount)?.label
                      : "Select number of subjects..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No subjects found.</CommandEmpty>
                      <CommandGroup>
                        {subjectOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value.toString()}
                            onSelect={() => {
                              setSubjectCount(option.value === subjectCount ? null : option.value);
                              setOpen(false);
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                subjectCount === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </ShimmerCard>
      </motion.div>

      {/* Subjects Input - Only show when subject count is selected */}
      {subjectCount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ShimmerCard>
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader className="bg-[#EEEEEE] p-4 sm:p-6">
                <CardTitle className="font-jakarta font-semibold text-[#000000] text-lg sm:text-xl flex items-center">
                  <BookOpen size={20} className="mr-2 text-[#0088CC]" />
                  Subject Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6">
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0088CC]/5 via-transparent to-[#0088CC]/5 rounded-lg"></div>
                      <div className="relative bg-white p-4 rounded-lg border border-[#EEEEEE] space-y-4">
                        <div className="text-sm font-medium text-[#0088CC] font-jakarta">
                          Subject {index + 1}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label className="font-inter text-[#000000] text-sm flex items-center mb-2">
                              <BookOpen size={16} className="mr-1 text-[#979797]" />
                              Subject Name
                            </Label>
                            <Input
                              value={subject.name}
                              onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                              placeholder="Enter subject name"
                              className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="font-inter text-[#000000] text-sm flex items-center mb-2">
                              <Hash size={16} className="mr-1 text-[#979797]" />
                              Marks (out of 100)
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={subject.marks}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty string or valid numbers between 0-100
                                if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                                  updateSubject(subject.id, 'marks', value);
                                }
                              }}
                              placeholder="Enter marks"
                              className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="font-inter text-[#000000] text-sm flex items-center mb-2">
                              <Award size={16} className="mr-1 text-[#979797]" />
                              Credit Hours
                            </Label>
                            <select
                              value={subject.creditHours}
                              onChange={(e) => updateSubject(subject.id, 'creditHours', Number(e.target.value))}
                              className="w-full h-10 px-3 border border-[#979797] rounded-md focus:border-[#0088CC] focus:outline-none text-sm sm:text-base"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="pt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={calculateResult}
                    className="bg-[#000000] hover:bg-[#333333] text-white font-inter w-full h-12 text-base transition-all duration-200"
                  >
                    Calculate GPA
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </ShimmerCard>
        </motion.div>
      )}

      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result || { gpa: 0, grade: '', remarks: '' }}
        onExport={exportToPDF}
      />
    </div>
  );
};

export default GPACalculator;