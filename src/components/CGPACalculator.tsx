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
import jsPDF from 'jspdf';

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
    
    try {
      const doc = new jsPDF();
      
      // Set font
      doc.setFont('helvetica');
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 136, 204); // #0088CC
      doc.text('UoH CGPA Calculator Results', 20, 30);
      
      // Horizontal line
      doc.setDrawColor(238, 238, 238); // #EEEEEE
      doc.line(20, 35, 190, 35);
      
      // Results section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Results:', 20, 50);
      
      doc.setFontSize(12);
      doc.text(`CGPA: ${result.gpa.toFixed(2)}`, 30, 65);
      doc.text(`Grade: ${result.grade}`, 30, 75);
      doc.text(`Remarks: ${result.remarks}`, 30, 85);
      
      // Semester details section
      doc.setFontSize(14);
      doc.text('Semester Details:', 20, 105);
      
      doc.setFontSize(10);
      let yPosition = 120;
      semesters.forEach((semester, index) => {
        if (yPosition > 270) { // Check if we need a new page
          doc.addPage();
          yPosition = 20;
        }
        doc.text(
          `${index + 1}. ${semester.name}: GPA ${semester.gpa.toFixed(2)} (${semester.totalCreditHours} credit hours)`,
          30,
          yPosition
        );
        yPosition += 10;
      });
      
      // Footer
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(8);
      doc.setTextColor(151, 151, 151); // #979797
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 20);
      doc.text('Prepared by students of Batch 2024 – AI Section A & B', 20, yPosition + 30);
      
      // Save the PDF
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