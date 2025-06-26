import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GraduationCap, Target, BookOpen } from 'lucide-react';
import { Semester, calculateCGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';
import ResultModal from './ResultModal';
import ShimmerCard from './ShimmerCard';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'Semester 1', gpa: 0, totalCreditHours: 0 }
  ]);
  const [result, setResult] = useState<null | {
    gpa: number;
    grade: string;
    remarks: string;
  }>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const triggerConfetti = (cgpa: number) => {
    if (cgpa >= 3) {
      // Success confetti with reduced density
      const end = Date.now() + 1500;
      const colors = ["#0088CC", "#00AA88", "#0066CC", "#4CAF50"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 1,
          angle: 60,
          spread: 45,
          startVelocity: 45,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 1,
          angle: 120,
          spread: 45,
          startVelocity: 45,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };
      frame();
    }
  };

  const addSemester = () => {
    const semesterNumber = semesters.length + 1;
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesterNumber}`,
      gpa: 0,
      totalCreditHours: 0
    };
    setSemesters([...semesters, newSemester]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(semester => semester.id !== id));
    }
  };

  const updateSemester = (id: string, field: keyof Semester, value: string | number) => {
    setSemesters(semesters.map(semester => 
      semester.id === id ? { ...semester, [field]: value } : semester
    ));
  };

  const calculateResult = () => {
    const validSemesters = semesters.filter(semester => 
      semester.gpa >= 0 && semester.gpa <= 4 && semester.totalCreditHours > 0
    );

    if (validSemesters.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please add at least one valid semester with GPA (0-4) and credit hours.",
        variant: "destructive"
      });
      return;
    }

    const cgpa = calculateCGPA(validSemesters);
    const percentage = getGPAPercentage(cgpa);
    const grade = getLetterGrade(percentage);
    const remarks = getRemarks(percentage);

    setResult({ gpa: cgpa, grade, remarks });
    setShowModal(true);
    
    // Trigger confetti after a short delay
    setTimeout(() => triggerConfetti(cgpa), 500);
  };

  const exportToPDF = () => {
    if (!result) return;
    
    // Create PDF content
    const pdfContent = `
UoH CGPA Calculator Results
==========================

CGPA: ${result.gpa.toFixed(2)}
Grade: ${result.grade}
Remarks: ${result.remarks}

Semester Details:
${semesters.map((semester, index) => 
  `${index + 1}. ${semester.name}: GPA ${semester.gpa.toFixed(2)} (${semester.totalCreditHours} credit hours)`
).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
Prepared by students of Batch 2024 – AI Section A & B
    `;

    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CGPA_Results_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your CGPA results have been downloaded as a text file.",
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShimmerCard>
          <Card className="border-2 border-[#EEEEEE]">
            <CardHeader className="bg-[#EEEEEE] p-4 sm:p-6">
              <CardTitle className="font-jakarta font-semibold text-[#000000] text-lg sm:text-xl flex items-center">
                <GraduationCap size={20} className="mr-2 text-[#0088CC]" />
                Add Semesters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {semesters.map((semester, index) => (
                  <motion.div
                    key={semester.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0088CC]/5 via-transparent to-[#0088CC]/5 rounded-lg"></div>
                    <div className="relative bg-white p-4 rounded-lg border border-[#EEEEEE]">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <Label className="font-inter text-[#000000] text-sm flex items-center mb-2">
                            <BookOpen size={16} className="mr-1 text-[#979797]" />
                            Semester Name
                          </Label>
                          <Input
                            value={semester.name}
                            onChange={(e) => updateSemester(semester.id, 'name', e.target.value)}
                            placeholder="Enter semester name"
                            className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label className="font-inter text-[#000000] text-sm flex items-center mb-2">
                            <Target size={16} className="mr-1 text-[#979797]" />
                            GPA (0-4)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="4"
                            step="0.01"
                            value={semester.gpa}
                            onChange={(e) => updateSemester(semester.id, 'gpa', Number(e.target.value))}
                            className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label className="font-inter text-[#000000] text-sm mb-2 block">
                            Total Credit Hours
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={semester.totalCreditHours}
                            onChange={(e) => updateSemester(semester.id, 'totalCreditHours', Number(e.target.value))}
                            className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSemester(semester.id)}
                            disabled={semesters.length === 1}
                            className="border-[#979797] text-[#979797] hover:bg-[#EEEEEE] w-full sm:w-auto"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={addSemester}
                    className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full h-12"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Semester
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={calculateResult}
                    className="bg-[#000000] hover:bg-[#333333] text-white font-inter w-full h-12"
                  >
                    Calculate CGPA
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </ShimmerCard>
      </motion.div>

      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result || { gpa: 0, grade: '', remarks: '' }}
        onExport={exportToPDF}
      />
    </div>
  );
};

export default CGPACalculator;