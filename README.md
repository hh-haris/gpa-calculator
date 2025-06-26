# UoH GPA Calculator

A modern, responsive GPA and CGPA calculator designed specifically for University of Hyderabad students.

## Features

- **GPA Calculator**: Calculate semester GPA based on subject marks and credit hours
- **CGPA Calculator**: Calculate cumulative GPA across multiple semesters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Export Results**: Download calculation results as text files

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uoh-gpa-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Usage

### GPA Calculator
1. Select the number of subjects (4-8)
2. Enter subject names, marks (0-100), and credit hours
3. Click "Calculate GPA" to see your results

### CGPA Calculator
1. Add semesters with their respective GPA and credit hours
2. Click "Calculate CGPA" to see your cumulative results

## Grading System

The calculator uses the University of Hyderabad grading system:

- **A (85-100%)**: Excellent (4.00 GPA)
- **A- (80-84%)**: Excellent (3.50-3.90 GPA)
- **B+ (75-79%)**: Good (3.08-3.42 GPA)
- **B (71-74%)**: Good (2.75-3.00 GPA)
- **B- (68-70%)**: Good (2.50-2.67 GPA)
- **C+ (64-67%)**: Adequate (2.17-2.42 GPA)
- **C (61-63%)**: Adequate (1.92-2.08 GPA)
- **C- (58-60%)**: Adequate (1.67-1.83 GPA)
- **D+ (54-57%)**: Minimum Acceptable (1.33-1.58 GPA)
- **D (50-53%)**: Minimum Acceptable (1.00-1.25 GPA)
- **F (<50%)**: Fail (0.00 GPA)

## Contributing

This project was created by students of Batch 2024 – AI Section A & B. Contributions and improvements are welcome!

## Disclaimer

While this calculator is designed with care and accuracy in mind, any unexpected errors or incorrect results are beyond our responsibility. Please verify important calculations with official university resources.

## License

This project is open source and available under the MIT License.