
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GraduationCap, Target, BookOpen } from 'lucide-react';
import { Semester, calculateCGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';
import ResultModal from './ResultModal';

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
      <Card className="border-2 border-[#EEEEEE] dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="bg-[#EEEEEE] dark:bg-gray-700 p-4 sm:p-6">
          <CardTitle className="font-jakarta font-semibold text-[#000000] dark:text-white text-lg sm:text-xl flex items-center">
            <GraduationCap size={20} className="mr-2 text-[#0088CC]" />
            Add Semesters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {semesters.map((semester, index) => (
            <div key={semester.id} className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-4 p-3 sm:p-4 border border-[#EEEEEE] dark:border-gray-600 rounded-lg dark:bg-gray-700">
              <div>
                <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                  <BookOpen size={16} className="mr-1 text-[#979797]" />
                  Semester Name
                </Label>
                <Input
                  value={semester.name}
                  onChange={(e) => updateSemester(semester.id, 'name', e.target.value)}
                  placeholder="Enter semester name"
                  className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                  onChange={(e) => updateSemester(semester.id, 'gpa', Number(e.target.value))}
                  className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                  onChange={(e) => updateSemester(semester.id, 'totalCreditHours', Number(e.target.value))}
                  className="border-[#979797] focus:border-[#0088CC] text-sm sm:text-base dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSemester(semester.id)}
                  disabled={semesters.length === 1}
                  className="border-[#979797] text-[#979797] hover:bg-[#EEEEEE] dark:border-gray-500 dark:text-gray-400 dark:hover:bg-gray-600 w-full sm:w-auto"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              onClick={addSemester}
              className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter flex-1 h-12"
            >
              <Plus size={16} className="mr-2" />
              Add Semester
            </Button>
            <Button
              onClick={calculateResult}
              className="bg-[#000000] hover:bg-[#333333] text-white font-inter flex-1 h-12 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              Calculate CGPA
            </Button>
          </div>
        </CardContent>
      </Card>

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
