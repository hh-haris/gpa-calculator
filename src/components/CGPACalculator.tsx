import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GraduationCap, Target, BookOpen } from 'lucide-react';
import { Semester, calculateCGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';
import GlassResultModal from './GlassResultModal';
import ShimmerCard from './ShimmerCard';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { LiquidButton } from '@/components/ui/liquid-button';
import { Button } from '@/components/ui/stateful-button';

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'Semester 1', gpa: '', totalCreditHours: '' }
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

  const addSemester = () => {
    const semesterNumber = semesters.length + 1;
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesterNumber}`,
      gpa: '',
      totalCreditHours: ''
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

  const calculateResult = async () => {
    const validSemesters = semesters.filter(semester => 
      semester.gpa !== '' && semester.totalCreditHours !== '' &&
      Number(semester.gpa) >= 0 && Number(semester.gpa) <= 4 && Number(semester.totalCreditHours) > 0
    );

    if (validSemesters.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please add at least one valid semester with GPA (0-4) and credit hours.",
        variant: "destructive"
      });
      return;
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const processedSemesters = validSemesters.map(semester => ({
      ...semester,
      gpa: Number(semester.gpa),
      totalCreditHours: Number(semester.totalCreditHours)
    }));

    const cgpa = calculateCGPA(processedSemesters);
    const percentage = getGPAPercentage(cgpa);
    const grade = getLetterGrade(percentage);
    const remarks = getRemarks(percentage);

    setResult({ gpa: cgpa, grade, remarks });
    setShowModal(true);
    
    setTimeout(() => triggerConfetti(cgpa), 500);
  };

  const exportToPDF = () => {
    if (!result) return;
    
    try {
      const doc = new jsPDF();
      
      doc.setFont('helvetica');
      
      doc.setFontSize(20);
      doc.setTextColor(0, 136, 204);
      doc.text('UoH CGPA Calculator Results', 20, 30);
      
      doc.setDrawColor(238, 238, 238);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Results:', 20, 50);
      
      doc.setFontSize(12);
      doc.text(`CGPA: ${result.gpa.toFixed(2)}`, 30, 65);
      doc.text(`Grade: ${result.grade}`, 30, 75);
      doc.text(`Remarks: ${result.remarks}`, 30, 85);
      
      doc.setFontSize(14);
      doc.text('Semester Details:', 20, 105);
      
      doc.setFontSize(10);
      let yPosition = 120;
      semesters.forEach((semester, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(
          `${index + 1}. ${semester.name}: GPA ${semester.gpa} (${semester.totalCreditHours} credit hours)`,
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
      
      doc.save(`CGPA_Results_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export Complete",
        description: "Your CGPA results have been downloaded as a PDF file.",
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShimmerCard>
          <Card className="border-2 border-[#EEEEEE] dark:border-gray-700">
            <CardHeader className="bg-[#EEEEEE] dark:bg-gray-800 p-4 sm:p-6">
              <CardTitle className="font-jakarta font-semibold text-[#000000] dark:text-white text-lg sm:text-xl flex items-center">
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
                    <ShimmerCard>
                      <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#EEEEEE] dark:border-gray-600">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                              <BookOpen size={16} className="mr-1 text-[#979797]" />
                              Semester Name
                            </Label>
                            <Input
                              value={semester.name}
                              onChange={(e) => updateSemester(semester.id, 'name', e.target.value)}
                              placeholder="Enter semester name"
                              className="border-[#979797] dark:border-gray-600 focus:border-[#0088CC] text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                              <Target size={16} className="mr-1 text-[#979797]" />
                              GPA (0-4)
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="4"
                              step="0.01"
                              value={semester.gpa}
                              onChange={(e) => updateSemester(semester.id, 'gpa', e.target.value)}
                              placeholder="Enter GPA"
                              className="border-[#979797] dark:border-gray-600 focus:border-[#0088CC] text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="font-inter text-[#000000] dark:text-white text-sm mb-2 block">
                              Total Credit Hours
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={semester.totalCreditHours}
                              onChange={(e) => updateSemester(semester.id, 'totalCreditHours', e.target.value)}
                              placeholder="Enter credit hours"
                              className="border-[#979797] dark:border-gray-600 focus:border-[#0088CC] text-sm sm:text-base"
                            />
                          </div>
                          <div className="flex items-end">
                            <LiquidButton
                              variant="default"
                              size="default"
                              onClick={() => removeSemester(semester.id)}
                              disabled={semesters.length === 1}
                              className="border-[#979797] dark:border-gray-600 text-[#979797] hover:bg-[#EEEEEE] dark:hover:bg-gray-700 w-full sm:w-auto"
                            >
                              <Trash2 size={16} />
                            </LiquidButton>
                          </div>
                        </div>
                      </div>
                    </ShimmerCard>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LiquidButton
                    onClick={addSemester}
                    className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full h-12 transition-all duration-300"
                    size="xxl"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Semester
                  </LiquidButton>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={calculateResult}
                    className="bg-[#000000] hover:bg-[#333333] text-white font-inter w-full h-12 transition-all duration-300"
                    loadingText="Calculating..."
                  >
                    Calculate CGPA
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </ShimmerCard>
      </motion.div>

      <GlassResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result || { gpa: 0, grade: '', remarks: '' }}
        onExport={exportToPDF}
      />
    </div>
  );
};

export default CGPACalculator;
