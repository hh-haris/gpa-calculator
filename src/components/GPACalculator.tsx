import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import ResultModal from '@/components/ResultModal';
import ShimmerCard from '@/components/ShimmerCard';
import confetti from 'canvas-confetti';

interface Subject {
  name: string;
  marks: number;
  credits: number;
}

const GPACalculator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([{ name: '', marks: 0, credits: 3 }]);
  const [gpa, setGPA] = useState<number | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectCount, setSelectedSubjectCount] = useState<number>(5);

  useEffect(() => {
    // Load saved subjects from local storage on component mount
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  useEffect(() => {
    // Save subjects to local storage whenever it changes
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const triggerConfetti = (gpa: number) => {
    if (gpa >= 3) {
      // Success confetti with lower density
      const end = Date.now() + 2 * 1000; // Reduced to 2 seconds
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 1, // Reduced from 2
          angle: 60,
          spread: 45, // Reduced spread
          startVelocity: 45, // Reduced velocity
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 1, // Reduced from 2
          angle: 120,
          spread: 45, // Reduced spread
          startVelocity: 45, // Reduced velocity
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    }
    // Removed warning emoji confetti for GPA < 2
  };

  const handleCalculate = () => {
    if (subjects.some(s => !s.name || s.marks === 0)) {
      alert('Please fill in all subject details.');
      return;
    }

    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const weightedSum = subjects.reduce((sum, subject) => {
      let gradePoint;
      if (subject.marks >= 85) {
        gradePoint = 4.0;
      } else if (subject.marks >= 80) {
        gradePoint = 3.7;
      } else if (subject.marks >= 75) {
        gradePoint = 3.3;
      } else if (subject.marks >= 70) {
        gradePoint = 3.0;
      } else if (subject.marks >= 65) {
        gradePoint = 2.7;
      } else if (subject.marks >= 60) {
        gradePoint = 2.3;
      } else if (subject.marks >= 55) {
        gradePoint = 2.0;
      } else if (subject.marks >= 50) {
        gradePoint = 1.7;
      } else if (subject.marks >= 45) {
        gradePoint = 1.3;
      } else if (subject.marks >= 40) {
        gradePoint = 1.0;
      } else {
        gradePoint = 0.0;
      }
      return sum + (gradePoint * subject.credits);
    }, 0);

    const calculatedGPA = totalCredits === 0 ? 0 : weightedSum / totalCredits;
    setGPA(calculatedGPA);
    triggerConfetti(calculatedGPA);

    let calculatedGrade;
    let calculatedRemarks;

    if (calculatedGPA >= 3.5) {
      calculatedGrade = 'A+';
      calculatedRemarks = 'Excellent';
    } else if (calculatedGPA >= 3.0) {
      calculatedGrade = 'A';
      calculatedRemarks = 'Very Good';
    } else if (calculatedGPA >= 2.5) {
      calculatedGrade = 'B';
      calculatedRemarks = 'Good';
    } else if (calculatedGPA >= 2.0) {
      calculatedGrade = 'C';
      calculatedRemarks = 'Average';
    } else if (calculatedGPA >= 1.0) {
      calculatedGrade = 'D';
      calculatedRemarks = 'Pass';
    } else {
      calculatedGrade = 'F';
      calculatedRemarks = 'Fail';
    }

    setGrade(calculatedGrade);
    setRemarks(calculatedRemarks);
    setIsModalOpen(true);
  };

  const addSubject = () => {
    if (subjects.length < selectedSubjectCount) {
      setSubjects([...subjects, { name: '', marks: 0, credits: 3 }]);
    } else {
      alert(`You can only add up to ${selectedSubjectCount} subjects.`);
    }
  };

  const removeSubject = (index: number) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const calculateGPA = () => {
    handleCalculate();
  };

  return (
    <ShimmerCard className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 rounded-xl p-6 shadow-lg">
      {/* Subject Count Selection */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Label htmlFor="subject-count" className="block text-sm font-medium text-[#979797] dark:text-gray-400 mb-2">
          Number of Subjects:
        </Label>
        <Select value={selectedSubjectCount.toString()} onValueChange={(value) => setSelectedSubjectCount(parseInt(value))}>
          <SelectTrigger className="w-full text-sm bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-[#0088CC] focus:ring-[#0088CC]/20">
            <SelectValue placeholder="Select subject count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 Subjects</SelectItem>
            <SelectItem value="4">4 Subjects</SelectItem>
            <SelectItem value="5">5 Subjects</SelectItem>
            <SelectItem value="6">6 Subjects</SelectItem>
            <SelectItem value="7">7 Subjects</SelectItem>
            <SelectItem value="8">8 Subjects</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Subject Details */}
      {selectedSubjectCount > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-[#000000] dark:text-white font-jakarta mb-4">
            Subject Details
          </h3>
          
          <div className="grid gap-4">
            {subjects.map((subject, index) => (
              <ShimmerCard key={index} className="p-4">
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#000000] dark:text-white font-jakarta text-sm">
                      Subject {index + 1}
                    </h4>
                    {subjects.length > 1 && (
                      <Button
                        onClick={() => removeSubject(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`subject-${index}`} className="text-xs font-medium text-[#979797] dark:text-gray-400">
                        Subject Name
                      </Label>
                      <Input
                        id={`subject-${index}`}
                        placeholder="Enter subject name"
                        value={subject.name}
                        onChange={(e) => {
                          const newSubjects = [...subjects];
                          newSubjects[index].name = e.target.value;
                          setSubjects(newSubjects);
                        }}
                        className="text-sm bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-[#0088CC] focus:ring-[#0088CC]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`marks-${index}`} className="text-xs font-medium text-[#979797] dark:text-gray-400">
                        Marks (out of 100)
                      </Label>
                      <Input
                        id={`marks-${index}`}
                        type="number"
                        placeholder="0-100"
                        min="0"
                        max="100"
                        value={subject.marks}
                        onChange={(e) => {
                          const newSubjects = [...subjects];
                          newSubjects[index].marks = parseInt(e.target.value) || 0;
                          setSubjects(newSubjects);
                        }}
                        className="text-sm bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-[#0088CC] focus:ring-[#0088CC]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`credits-${index}`} className="text-xs font-medium text-[#979797] dark:text-gray-400">
                        Credit Hours
                      </Label>
                      <Select 
                        value={subject.credits.toString()} 
                        onValueChange={(value) => {
                          const newSubjects = [...subjects];
                          newSubjects[index].credits = parseInt(value);
                          setSubjects(newSubjects);
                        }}
                      >
                        <SelectTrigger className="text-sm bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-[#0088CC] focus:ring-[#0088CC]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Credit</SelectItem>
                          <SelectItem value="2">2 Credits</SelectItem>
                          <SelectItem value="3">3 Credits</SelectItem>
                          <SelectItem value="4">4 Credits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              </ShimmerCard>
            ))}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={addSubject}
              disabled={subjects.length >= selectedSubjectCount}
              variant="outline"
              className="flex-1 border-[#0088CC] text-[#0088CC] hover:bg-[#0088CC] hover:text-white transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Subject
            </Button>
            
            <Button
              onClick={handleCalculate}
              disabled={subjects.some(s => !s.name || s.marks === 0)}
              className="flex-1 bg-[#0088CC] hover:bg-[#0077BB] text-white font-medium transition-colors"
            >
              <Calculator size={16} className="mr-2" />
              Calculate GPA
            </Button>
          </div>
        </motion.div>
      )}

      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={{
          gpa: gpa || 0,
          grade: grade,
          remarks: remarks,
        }}
        onExport={() => { }}
      />
    </ShimmerCard>
  );
};

export default GPACalculator;
