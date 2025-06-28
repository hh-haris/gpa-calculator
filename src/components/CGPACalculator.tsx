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

interface CGPACalculatorProps {
  onCalculate?: (cgpa?: number, semestersCount?: number) => void;
}

const CGPACalculator = ({ onCalculate }: CGPACalculatorProps) => {
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
    if (semesters.length >= 8) {
      toast({
        title: "Maximum Limit Reached",
        description: "You can add maximum 8 semesters only.",
        variant: "destructive"
      });
      return;
    }
    
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
    
    // Call the onCalculate prop if provided
    if (onCalculate) {
      onCalculate(cgpa, validSemesters.length);
    }
    
    // Trigger confetti after a short delay
    setTimeout(() => triggerConfetti(cgpa), 500);
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
      doc.text('CGPA Results', 20, 60);
      
      // Results box
      doc.setDrawColor(238, 238, 238);
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(20, 70, 170, 40, 3, 3, 'FD');
      
      // CGPA Result
      doc.setFontSize(14);
      doc.setTextColor(0, 136, 204);
      doc.text('CGPA:', 30, 85);
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(result.gpa.toFixed(2), 70, 85);
      
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
      
      // Semester details section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Semester Details', 20, 130);
      
      // Table header
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No.', 25, 145);
      doc.text('Semester', 40, 145);
      doc.text('GPA', 120, 145);
      doc.text('Credit Hours', 150, 145);
      
      // Table line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 148, 190, 148);
      
      let yPosition = 160;
      semesters.forEach((semester, index) => {
        if (yPosition > 270) { // Check if we need a new page
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}.`, 25, yPosition);
        doc.text(semester.name, 40, yPosition);
        doc.text(semester.gpa.toFixed(2), 120, yPosition);
        doc.text(semester.totalCreditHours.toString(), 160, yPosition);
        
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
      doc.text('Created with ❤️ by Haris H', 105, yPosition + 50, { align: 'center' });
      
      // Website credit
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('UoH GPA Calculator - Your Academic Companion', 105, yPosition + 60, { align: 'center' });
      
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
                Add Semesters (Max 8)
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
                            value={semester.gpa || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numValue = value === '' ? 0 : Number(value);
                              if (numValue >= 0 && numValue <= 4) {
                                updateSemester(semester.id, 'gpa', numValue);
                              }
                            }}
                            placeholder="Enter GPA"
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
                            value={semester.totalCreditHours || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numValue = value === '' ? 0 : Number(value);
                              if (numValue >= 0) {
                                updateSemester(semester.id, 'totalCreditHours', numValue);
                              }
                            }}
                            placeholder="Enter credit hours"
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
                    disabled={semesters.length >= 8}
                    className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter w-full h-12 disabled:opacity-50"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Semester ({semesters.length}/8)
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