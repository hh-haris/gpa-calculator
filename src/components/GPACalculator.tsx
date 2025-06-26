
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Download } from 'lucide-react';
import { Subject, calculateGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';

const GPACalculator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', marks: 0, creditHours: 1 }
  ]);
  const [result, setResult] = useState<null | {
    gpa: number;
    grade: string;
    remarks: string;
  }>(null);
  const { toast } = useToast();

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      marks: 0,
      creditHours: 1
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
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
        description: "Please add at least one valid subject with marks between 0-100.",
        variant: "destructive"
      });
      return;
    }

    const gpa = calculateGPA(validSubjects);
    const percentage = getGPAPercentage(gpa);
    const grade = getLetterGrade(percentage);
    const remarks = getRemarks(percentage);

    setResult({ gpa, grade, remarks });
  };

  const exportToPDF = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality will be implemented soon!",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#EEEEEE]">
        <CardHeader className="bg-[#EEEEEE]">
          <CardTitle className="font-jakarta font-semibold text-[#000000]">
            Add Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-[#EEEEEE] rounded-lg">
              <div>
                <Label className="font-inter text-[#000000]">Subject Name</Label>
                <Input
                  value={subject.name}
                  onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                  placeholder="Enter subject name"
                  className="border-[#979797] focus:border-[#0088CC]"
                />
              </div>
              <div>
                <Label className="font-inter text-[#000000]">Marks (out of 100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.marks}
                  onChange={(e) => updateSubject(subject.id, 'marks', Number(e.target.value))}
                  className="border-[#979797] focus:border-[#0088CC]"
                />
              </div>
              <div>
                <Label className="font-inter text-[#000000]">Credit Hours</Label>
                <select
                  value={subject.creditHours}
                  onChange={(e) => updateSubject(subject.id, 'creditHours', Number(e.target.value))}
                  className="w-full h-10 px-3 border border-[#979797] rounded-md focus:border-[#0088CC] focus:outline-none"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubject(subject.id)}
                  disabled={subjects.length === 1}
                  className="border-[#979797] text-[#979797] hover:bg-[#EEEEEE]"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex gap-4">
            <Button
              onClick={addSubject}
              className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter"
            >
              <Plus size={16} className="mr-2" />
              Add Subject
            </Button>
            <Button
              onClick={calculateResult}
              className="bg-[#000000] hover:bg-[#333333] text-white font-inter"
            >
              Calculate GPA
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-[#0088CC] bg-gradient-to-br from-white to-[#EEEEEE]">
          <CardHeader className="bg-[#0088CC] text-white">
            <CardTitle className="font-jakarta font-semibold">
              📊 GPA Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white p-4 rounded-lg border border-[#EEEEEE]">
                  <div className="text-2xl font-bold text-[#0088CC] font-jakarta">
                    🎯 {result.gpa.toFixed(2)}
                  </div>
                  <div className="text-[#979797] font-inter">GPA</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#EEEEEE]">
                  <div className="text-2xl font-bold text-[#000000] font-jakarta">
                    🅰️ {result.grade}
                  </div>
                  <div className="text-[#979797] font-inter">Grade</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#EEEEEE]">
                  <div className="text-lg font-bold text-[#000000] font-jakarta">
                    🗣️ {result.remarks}
                  </div>
                  <div className="text-[#979797] font-inter">Remarks</div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button
                  onClick={exportToPDF}
                  className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter"
                >
                  <Download size={16} className="mr-2" />
                  ⬇ Export as PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GPACalculator;
