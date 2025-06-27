import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, BookOpen, Hash, Award } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Subject, calculateGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';
import GlassResultModal from './GlassResultModal';
import ShimmerCard from './ShimmerCard';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { LiquidButton } from '@/components/ui/liquid-button';
import { Button } from '@/components/ui/stateful-button';

const subjectOptions = [
  { value: 4, label: "4 Subjects" },
  { value: 5, label: "5 Subjects" },
  { value: 6, label: "6 Subjects" },
  { value: 7, label: "7 Subjects" },
  { value: 8, label: "8 Subjects" },
];

const GPACalculator = () => {
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
        marks: '', // Remove default 0
        creditHours: 1
      }));
      setSubjects(newSubjects);
    } else {
      setSubjects([]);
    }
  }, [subjectCount]);

  const triggerConfetti = (gpa: number) => {
    if (gpa >= 3) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);

      const duration = 600; // Reduced duration
      const end = Date.now() + duration;
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });

      const frame = () => {
        if (Date.now() > end) {
          document.body.removeChild(canvas);
          return;
        }

        // Reduced particle count for lower density
        myConfetti({
          particleCount: 1, // Reduced from 2
          angle: 60,
          spread: 45, // Reduced spread
          origin: { x: 0, y: 0.6 },
          colors: colors,
          gravity: 0.9,
          scalar: 0.7, // Reduced size
        });

        myConfetti({
          particleCount: 1, // Reduced from 2
          angle: 120,
          spread: 45, // Reduced spread
          origin: { x: 1, y: 0.6 },
          colors: colors,
          gravity: 0.9,
          scalar: 0.7, // Reduced size
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

  const calculateResult = async () => {
    const validSubjects = subjects.filter(subject => 
      subject.name.trim() !== '' && subject.marks !== '' && Number(subject.marks) >= 0 && Number(subject.marks) <= 100
    );

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

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const processedSubjects = validSubjects.map(subject => ({
      ...subject,
      marks: Number(subject.marks)
    }));

    const gpa = calculateGPA(processedSubjects);
    const percentage = getGPAPercentage(gpa);
    const grade = getLetterGrade(percentage);
    const remarks = getRemarks(percentage);

    setResult({ gpa, grade, remarks });
    setShowModal(true);
    
    setTimeout(() => triggerConfetti(gpa), 500);
  };

  const exportToPDF = () => {
    if (!result) return;
    
    try {
      const doc = new jsPDF();
      
      doc.setFont('helvetica');
      
      doc.setFontSize(20);
      doc.setTextColor(0, 136, 204);
      doc.text('UoH GPA Calculator Results', 20, 30);
      
      doc.setDrawColor(238, 238, 238);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Results:', 20, 50);
      
      doc.setFontSize(12);
      doc.text(`GPA: ${result.gpa.toFixed(2)}`, 30, 65);
      doc.text(`Grade: ${result.grade}`, 30, 75);
      doc.text(`Remarks: ${result.remarks}`, 30, 85);
      
      doc.setFontSize(14);
      doc.text('Subject Details:', 20, 105);
      
      doc.setFontSize(10);
      let yPosition = 120;
      subjects.forEach((subject, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(
          `${index + 1}. ${subject.name}: ${subject.marks}/100 (${subject.creditHours} credit hours)`,
          30,
          yPosition
        );
        yPosition += 10;
      });
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(8);
      doc.setTextColor(151, 151, 151);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 20);
      doc.text('Prepared by students of Batch 2024 – AI Section A & B', 20, yPosition + 30);
      
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
          <Card className="border-2 border-[#EEEEEE] dark:border-gray-700">
            <CardHeader className="bg-[#EEEEEE] dark:bg-gray-800 p-4 sm:p-6">
              <CardTitle className="font-jakarta font-semibold text-[#000000] dark:text-white text-lg sm:text-xl">
                Number of Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <LiquidButton
                    variant="default"
                    size="xxl"
                    className="w-full justify-between border-[#979797] dark:border-gray-600 focus:border-[#0088CC] h-12 text-base"
                  >
                    {subjectCount
                      ? subjectOptions.find((option) => option.value === subjectCount)?.label
                      : "Select number of subjects..."}
                    <ChevronsUpDown className="opacity-50" />
                  </LiquidButton>
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

      {/* Subjects Input */}
      {subjectCount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ShimmerCard>
            <Card className="border-2 border-[#EEEEEE] dark:border-gray-700">
              <CardHeader className="bg-[#EEEEEE] dark:bg-gray-800 p-4 sm:p-6">
                <CardTitle className="font-jakarta font-semibold text-[#000000] dark:text-white text-lg sm:text-xl flex items-center">
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
                      <ShimmerCard>
                        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#EEEEEE] dark:border-gray-600 space-y-4">
                          <div className="text-sm font-medium text-[#0088CC] font-jakarta">
                            Subject {index + 1}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                                <BookOpen size={16} className="mr-1 text-[#979797]" />
                                Subject Name
                              </Label>
                              <Input
                                value={subject.name}
                                onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                                placeholder="Enter subject name"
                                className="border-[#979797] dark:border-gray-600 focus:border-[#0088CC] text-sm sm:text-base"
                              />
                            </div>
                            <div>
                              <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                                <Hash size={16} className="mr-1 text-[#979797]" />
                                Marks (out of 100)
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={subject.marks}
                                onChange={(e) => updateSubject(subject.id, 'marks', e.target.value)}
                                placeholder="Enter marks"
                                className="border-[#979797] dark:border-gray-600 focus:border-[#0088CC] text-sm sm:text-base"
                              />
                            </div>
                            <div>
                              <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                                <Award size={16} className="mr-1 text-[#979797]" />
                                Credit Hours
                              </Label>
                              <select
                                value={subject.creditHours}
                                onChange={(e) => updateSubject(subject.id, 'creditHours', Number(e.target.value))}
                                className="w-full h-10 px-3 border border-[#979797] dark:border-gray-600 rounded-md focus:border-[#0088CC] focus:outline-none text-sm sm:text-base bg-white dark:bg-gray-800 text-black dark:text-white"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </ShimmerCard>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="pt-6 flex justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={calculateResult}
                    className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter px-8 py-3 text-lg transition-all duration-300"
                    loadingText="Calculating..."
                  >
                    Calculate GPA
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </ShimmerCard>
        </motion.div>
      )}

      <GlassResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result || { gpa: 0, grade: '', remarks: '' }}
        onExport={exportToPDF}
      />

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default GPACalculator;
