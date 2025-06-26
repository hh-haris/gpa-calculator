
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookOpen, Hash, Award } from 'lucide-react';
import { Subject, calculateGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';
import ResultModal from './ResultModal';

const GPACalculator = () => {
  const [subjectCount, setSubjectCount] = useState<number>(4);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [result, setResult] = useState<null | {
    gpa: number;
    grade: string;
    remarks: string;
  }>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  // Initialize subjects based on count
  useEffect(() => {
    const newSubjects = Array.from({ length: subjectCount }, (_, index) => ({
      id: (index + 1).toString(),
      name: '',
      marks: 0,
      creditHours: 1
    }));
    setSubjects(newSubjects);
  }, [subjectCount]);

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
  };

  const exportToPDF = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality will be implemented soon!",
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Subject Count Selection */}
      <Card className="border-2 border-[#EEEEEE]">
        <CardHeader className="bg-[#EEEEEE] p-4 sm:p-6">
          <CardTitle className="font-jakarta font-semibold text-[#000000] text-lg sm:text-xl">
            Number of Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[4, 5, 6, 7, 8].map((count) => (
              <Button
                key={count}
                onClick={() => setSubjectCount(count)}
                className={`h-12 sm:h-14 text-sm sm:text-base font-inter ${
                  subjectCount === count
                    ? 'bg-[#0088CC] text-white'
                    : 'bg-[#EEEEEE] text-[#979797] hover:bg-[#0088CC] hover:text-white'
                }`}
                variant="ghost"
              >
                {count}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subjects Input */}
      <Card className="border-2 border-[#EEEEEE]">
        <CardHeader className="bg-[#EEEEEE] p-4 sm:p-6">
          <CardTitle className="font-jakarta font-semibold text-[#000000] text-lg sm:text-xl flex items-center">
            <BookOpen size={20} className="mr-2 text-[#0088CC]" />
            Subject Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 p-3 sm:p-4 border border-[#EEEEEE] rounded-lg">
              <div>
                <Label className="font-inter text-[#000000] text-sm flex items-center mb-2">
                  <BookOpen size={16} className="mr-1 text-[#979797]" />
                  Subject {index + 1} Name
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
                  onChange={(e) => updateSubject(subject.id, 'marks', Number(e.target.value))}
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
          ))}
          
          <div className="pt-4">
            <Button
              onClick={calculateResult}
              className="bg-[#000000] hover:bg-[#333333] text-white font-inter w-full h-12 text-base"
            >
              Calculate GPA
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

export default GPACalculator;
