
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

  // Initialize subjects based on count
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
                className="w-full justify-between border-[#979797] focus:border-[#0088CC] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

      {/* Subjects Input - Only show when subject count is selected */}
      {subjectCount && (
        <Card className="border-2 border-[#EEEEEE] dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="bg-[#EEEEEE] dark:bg-gray-700 p-4 sm:p-6">
            <CardTitle className="font-jakarta font-semibold text-[#000000] dark:text-white text-lg sm:text-xl flex items-center">
              <BookOpen size={20} className="mr-2 text-[#0088CC]" />
              Subject Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 p-3 sm:p-4 border border-[#EEEEEE] dark:border-gray-600 rounded-lg dark:bg-gray-700">
                <div>
                  <Label className="font-inter text-[#000000] dark:text-white text-sm flex items-center mb-2">
                    <BookOpen size={16} className="mr-1 text-[#979797]" />
                    Subject {index + 1} Name
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
            ))}
            
            <div className="pt-4">
              <Button
                onClick={calculateResult}
                className="bg-[#000000] hover:bg-[#333333] text-white font-inter w-full h-12 text-base dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                Calculate GPA
              </Button>
            </div>
          </CardContent>
        </Card>
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
