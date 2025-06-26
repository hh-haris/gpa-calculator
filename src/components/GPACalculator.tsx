
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
        marks: 0,
        creditHours: 1
      }));
      setSubjects(newSubjects);
    } else {
      setSubjects([]);
    }
  }, [subjectCount]);

  const triggerConfetti = (gpa: number) => {
    if (gpa >= 3) {
      // Success confetti
      const end = Date.now() + 2000;
      const colors = ["#0088CC", "#00AA88", "#0066CC", "#4CAF50"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };
      frame();
    } else if (gpa < 2) {
      // Warning emoji confetti
      const scalar = 2;
      const handEmoji = confetti.shapeFromText({ text: "✋", scalar });

      const defaults = {
        spread: 360,
        ticks: 60,
        gravity: 0,
        decay: 0.96,
        startVelocity: 20,
        shapes: [handEmoji],
        scalar,
      };

      const shoot = () => {
        confetti({
          ...defaults,
          particleCount: 15,
        });

        confetti({
          ...defaults,
          particleCount: 3,
        });

        confetti({
          ...defaults,
          particleCount: 8,
          scalar: scalar / 2,
          shapes: ["circle"],
        });
      };

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const calculateResult = () => {
    const validSubjects = subjects.filter(subject => 
      subject.name.trim() !== '' && subject.marks >= 0 && subject.marks <= 100
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

    const gpa = calculateGPA(validSubjects);
    const percentage = getGPAPercentage(gpa);
    const grade = getLetterGrade(percentage);
    const remarks = getRemarks(percentage);

    setResult({ gpa, grade, remarks });
    setShowModal(true);
    
    // Trigger confetti after a short delay
    setTimeout(() => triggerConfetti(gpa), 500);
  };

  const exportToPDF = () => {
    if (!result) return;
    
    // Create PDF content
    const pdfContent = `
UoH GPA Calculator Results
========================

GPA: ${result.gpa.toFixed(2)}
Grade: ${result.grade}
Remarks: ${result.remarks}

Subject Details:
${subjects.map((subject, index) => 
  `${index + 1}. ${subject.name}: ${subject.marks}/100 (${subject.creditHours} credit hours)`
).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
Prepared by students of Batch 2024 – AI Section A & B
    `;

    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPA_Results_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your GPA results have been downloaded as a text file.",
    });
    setShowModal(false);
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
          <Card className="border-2 border-[#EEEEEE] dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="bg-[#EEEEEE] dark:bg-gray-700 p-4 sm:p-6">
              <CardTitle className="font-jakarta font-semibold text-[#000000] dark:text-white text-lg sm:text-xl">
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
                    className="w-full justify-between border-[#979797] focus:border-[#0088CC] dark:border-gray-600 dark:bg-gray-700 dark:text-white h-12 text-base"
                  >
                    {subjectCount
                      ? subjectOptions.find((option) => option.value === subjectCount)?.label
                      : "Select number of subjects..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 dark:bg-gray-800 dark:border-gray-600">
                  <Command className="dark:bg-gray-800">
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
                            className="dark:hover:bg-gray-700 dark:text-white"
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
            <Card className="border-2 border-[#EEEEEE] dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="bg-[#EEEEEE] dark:bg-gray-700 p-4 sm:p-6">
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
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0088CC]/5 via-transparent to-[#0088CC]/5 rounded-lg"></div>
                      <div className="relative bg-white dark:bg-gray-700 p-4 rounded-lg border border-[#EEEEEE] dark:border-gray-600 space-y-4">
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
                              className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                              onChange={(e) => updateSubject(subject.id, 'marks', Number(e.target.value))}
                              className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                              className="w-full h-10 px-3 border border-[#979797] rounded-md focus:border-[#0088CC] focus:outline-none text-sm sm:text-base dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                    className="bg-[#000000] hover:bg-[#333333] text-white font-inter w-full h-12 text-base dark:bg-gray-900 dark:hover:bg-gray-800 transition-all duration-200"
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
