
export interface Subject {
  id: string;
  name: string;
  marks: number;
  creditHours: number;
}

export interface Semester {
  id: string;
  name: string;
  gpa: number;
  totalCreditHours: number;
}

export const getPercentage = (marks: number): number => {
  return Math.round((marks / 100) * 100);
};

export const getNumericalGrade = (percentage: number): number => {
  if (percentage < 50) return 0.00;
  if (percentage === 50) return 1.00;
  if (percentage === 51) return 1.08;
  if (percentage === 52) return 1.17;
  if (percentage === 53) return 1.25;
  if (percentage === 54) return 1.33;
  if (percentage === 55) return 1.42;
  if (percentage === 56) return 1.50;
  if (percentage === 57) return 1.58;
  if (percentage === 58) return 1.67;
  if (percentage === 59) return 1.75;
  if (percentage === 60) return 1.83;
  if (percentage === 61) return 1.92;
  if (percentage === 62) return 2.00;
  if (percentage === 63) return 2.08;
  if (percentage === 64) return 2.17;
  if (percentage === 65) return 2.25;
  if (percentage === 66) return 2.33;
  if (percentage === 67) return 2.42;
  if (percentage === 68) return 2.50;
  if (percentage === 69) return 2.58;
  if (percentage === 70) return 2.67;
  if (percentage === 71) return 2.75;
  if (percentage === 72) return 2.83;
  if (percentage === 73) return 2.92;
  if (percentage === 74) return 3.00;
  if (percentage === 75) return 3.08;
  if (percentage === 76) return 3.17;
  if (percentage === 77) return 3.25;
  if (percentage === 78) return 3.33;
  if (percentage === 79) return 3.42;
  if (percentage === 80) return 3.50;
  if (percentage === 81) return 3.60;
  if (percentage === 82) return 3.70;
  if (percentage === 83) return 3.80;
  if (percentage === 84) return 3.90;
  if (percentage >= 85) return 4.00;
  return 0.00;
};

export const getLetterGrade = (percentage: number): string => {
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A−";
  if (percentage >= 75) return "B+";
  if (percentage >= 71) return "B";
  if (percentage >= 68) return "B−";
  if (percentage >= 64) return "C+";
  if (percentage >= 61) return "C";
  if (percentage >= 58) return "C−";
  if (percentage >= 54) return "D+";
  if (percentage >= 50) return "D";
  return "F";
};

export const getRemarks = (percentage: number): string => {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 80) return "Excellent";
  if (percentage >= 75) return "Good";
  if (percentage >= 71) return "Good";
  if (percentage >= 68) return "Good";
  if (percentage >= 64) return "Adequate";
  if (percentage >= 61) return "Adequate";
  if (percentage >= 58) return "Adequate";
  if (percentage >= 54) return "Minimum acceptable";
  if (percentage >= 50) return "Minimum acceptable";
  return "Fail";
};

export const calculateGPA = (subjects: Subject[]): number => {
  let totalGradePoints = 0;
  let totalCreditHours = 0;

  subjects.forEach(subject => {
    const percentage = getPercentage(subject.marks);
    const numericalGrade = getNumericalGrade(percentage);
    const gradePoints = numericalGrade * subject.creditHours;
    totalGradePoints += gradePoints;
    totalCreditHours += subject.creditHours;
  });

  if (totalCreditHours === 0) return 0;
  return totalGradePoints / totalCreditHours;
};

export const calculateCGPA = (semesters: Semester[]): number => {
  let totalWeightedGPA = 0;
  let totalCreditHours = 0;

  semesters.forEach(semester => {
    totalWeightedGPA += semester.gpa * semester.totalCreditHours;
    totalCreditHours += semester.totalCreditHours;
  });

  if (totalCreditHours === 0) return 0;
  return totalWeightedGPA / totalCreditHours;
};

export const getGPAPercentage = (gpa: number): number => {
  // Convert GPA back to percentage for grade calculation
  if (gpa === 0) return 0;
  if (gpa === 1.00) return 50;
  if (gpa === 1.08) return 51;
  if (gpa === 1.17) return 52;
  if (gpa === 1.25) return 53;
  if (gpa === 1.33) return 54;
  if (gpa === 1.42) return 55;
  if (gpa === 1.50) return 56;
  if (gpa === 1.58) return 57;
  if (gpa === 1.67) return 58;
  if (gpa === 1.75) return 59;
  if (gpa === 1.83) return 60;
  if (gpa === 1.92) return 61;
  if (gpa === 2.00) return 62;
  if (gpa === 2.08) return 63;
  if (gpa === 2.17) return 64;
  if (gpa === 2.25) return 65;
  if (gpa === 2.33) return 66;
  if (gpa === 2.42) return 67;
  if (gpa === 2.50) return 68;
  if (gpa === 2.58) return 69;
  if (gpa === 2.67) return 70;
  if (gpa === 2.75) return 71;
  if (gpa === 2.83) return 72;
  if (gpa === 2.92) return 73;
  if (gpa === 3.00) return 74;
  if (gpa === 3.08) return 75;
  if (gpa === 3.17) return 76;
  if (gpa === 3.25) return 77;
  if (gpa === 3.33) return 78;
  if (gpa === 3.42) return 79;
  if (gpa === 3.50) return 80;
  if (gpa === 3.60) return 81;
  if (gpa === 3.70) return 82;
  if (gpa === 3.80) return 83;
  if (gpa === 3.90) return 84;
  if (gpa === 4.00) return 85;
  
  // For values in between, find the closest match
  return Math.round((gpa / 4.0) * 100);
};
