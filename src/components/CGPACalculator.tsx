
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Download } from 'lucide-react';
import { Semester, calculateCGPA, getGPAPercentage, getLetterGrade, getRemarks } from '@/utils/gradeCalculations';
import { useToast } from '@/hooks/use-toast';

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'Semester 1', gpa: 0, totalCreditHours: 0 }
  ]);
  const [result, setResult] = useState<null | {
    cgpa: number;
    grade: string;
    remarks: string;
  }>(null);
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

    setResult({ cgpa, grade, remarks });
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
            Add Semesters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {semesters.map((semester, index) => (
            <div key={semester.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-[#EEEEEE] rounded-lg">
              <div>
                <Label className="font-inter text-[#000000]">Semester Name</Label>
                <Input
                  value={semester.name}
                  onChange={(e) => updateSemester(semester.id, 'name', e.target.value)}
                  placeholder="Enter semester name"
                  className="border-[#979797] focus:border-[#0088CC]"
                />
              </div>
              <div>
                <Label className="font-inter text-[#000000]">GPA (0-4)</Label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={semester.gpa}
                  onChange={(e) => updateSemester(semester.id, 'gpa', Number(e.target.value))}
                  className="border-[#979797] focus:border-[#0088CC]"
                />
              </div>
              <div>
                <Label className="font-inter text-[#000000]">Total Credit Hours</Label>
                <Input
                  type="number"
                  min="1"
                  value={semester.totalCreditHours}
                  onChange={(e) => updateSemester(semester.id, 'totalCreditHours', Number(e.target.value))}
                  className="border-[#979797] focus:border-[#0088CC]"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSemester(semester.id)}
                  disabled={semesters.length === 1}
                  className="border-[#979797] text-[#979797] hover:bg-[#EEEEEE]"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex gap-4">
            <Button
              onClick={addSemester}
              className="bg-[#0088CC] hover:bg-[#0077BB] text-white font-inter"
            >
              <Plus size={16} className="mr-2" />
              Add Semester
            </Button>
            <Button
              onClick={calculateResult}
              className="bg-[#000000] hover:bg-[#333333] text-white font-inter"
            >
              Calculate CGPA
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-[#0088CC] bg-gradient-to-br from-white to-[#EEEEEE]">
          <CardHeader className="bg-[#0088CC] text-white">
            <CardTitle className="font-jakarta font-semibold">
              📊 CGPA Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white p-4 rounded-lg border border-[#EEEEEE]">
                  <div className="text-2xl font-bold text-[#0088CC] font-jakarta">
                    🎯 {result.cgpa.toFixed(2)}
                  </div>
                  <div className="text-[#979797] font-inter">CGPA</div>
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

export default CGPACalculator;
