
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { GridBackground } from '@/components/GridBackground';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { AppSidebar, SidebarTrigger } from '@/components/AppSidebar';

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("semester");

  // Sample GPA distribution data
  const gpaDistributionData = [
    { range: "0.0-0.5", count: 2 },
    { range: "0.5-1.0", count: 5 },
    { range: "1.0-1.5", count: 12 },
    { range: "1.5-2.0", count: 28 },
    { range: "2.0-2.5", count: 45 },
    { range: "2.5-3.0", count: 78 },
    { range: "3.0-3.5", count: 95 },
    { range: "3.5-4.0", count: 42 },
  ];

  // Sample semester trends data
  const semesterTrendsData = [
    { semester: "Fall 2023", avgGPA: 2.8, students: 280 },
    { semester: "Spring 2024", avgGPA: 3.1, students: 295 },
    { semester: "Summer 2024", avgGPA: 3.0, students: 150 },
    { semester: "Fall 2024", avgGPA: 3.2, students: 310 },
  ];

  const chartConfig = {
    count: {
      label: "Students",
      color: "var(--color-primary)",
    },
    avgGPA: {
      label: "Average GPA",
      color: "#0088CC",
    },
    students: {
      label: "Total Students",
      color: "#979797",
    },
  } satisfies ChartConfig;

  // User's percentile calculation (example)
  const userGPA = 3.4;
  const totalStudents = 307;
  const studentsBelow = 245;
  const percentile = Math.round((studentsBelow / totalStudents) * 100);

  return (
    <div className="min-h-screen bg-white font-inter relative">
      <GridBackground />
      
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <SidebarTrigger onClick={() => setSidebarOpen(true)} />
      
      <StickyBanner className="bg-gradient-to-r from-[#0088CC] to-[#0077BB]">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md font-inter text-xs sm:text-sm">
          Track academic performance trends and insights 📊
        </p>
      </StickyBanner>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-[#000000] font-jakarta mb-2 flex items-center justify-center gap-2">
            <BarChart3 className="text-[#0088CC]" size={24} />
            Smart Analytics
          </h1>
          <p className="text-[#979797] font-inter text-sm">
            Comprehensive GPA insights and performance analytics
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-inter text-[#979797] flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#0088CC]" />
                  Your Percentile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-[#0088CC] font-jakarta">
                  {percentile}%
                </div>
                <p className="text-xs text-[#979797] font-inter">
                  You scored higher than {percentile}% of students
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-inter text-[#979797] flex items-center gap-2">
                  <Users size={16} className="text-[#0088CC]" />
                  Average GPA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-[#000000] font-jakarta">
                  3.12
                </div>
                <p className="text-xs text-[#979797] font-inter">
                  Across university
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-inter text-[#979797] flex items-center gap-2">
                  <Award size={16} className="text-[#0088CC]" />
                  Top GPA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-[#000000] font-jakarta">
                  3.98
                </div>
                <p className="text-xs text-[#979797] font-inter">
                  Highest this semester
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-inter text-[#979797] flex items-center gap-2">
                  <Users size={16} className="text-[#0088CC]" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-[#000000] font-jakarta">
                  {totalStudents}
                </div>
                <p className="text-xs text-[#979797] font-inter">
                  Active this semester
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="border-2 border-[#0088CC] bg-gradient-to-r from-[#0088CC]/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0088CC] font-jakarta mb-2">
                    Your Performance Insight
                  </h3>
                  <p className="text-[#000000] font-inter">
                    With a GPA of <strong>{userGPA}</strong>, you're performing better than <strong>{percentile}%</strong> of your peers.
                  </p>
                </div>
                <Badge className="bg-[#0088CC] text-white">
                  Top {100 - percentile}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GPA Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader>
                <CardTitle className="font-jakarta text-[#000000]">
                  GPA Distribution
                </CardTitle>
                <CardDescription className="font-inter text-[#979797]">
                  Student distribution across GPA ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <BarChart data={gpaDistributionData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="range"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="count"
                      fill="#0088CC"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Semester Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-2 border-[#EEEEEE]">
              <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                  <CardTitle className="font-jakarta text-[#000000]">
                    Semester Trends
                  </CardTitle>
                  <CardDescription className="font-inter text-[#979797]">
                    Average GPA trends over time
                  </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger
                    className="w-[140px] rounded-lg border-[#979797]"
                    aria-label="Select time range"
                  >
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="semester" className="rounded-lg">
                      By Semester
                    </SelectItem>
                    <SelectItem value="year" className="rounded-lg">
                      By Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[250px] w-full"
                >
                  <AreaChart data={semesterTrendsData}>
                    <defs>
                      <linearGradient id="fillGPA" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#0088CC"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0088CC"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="semester"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Area
                      dataKey="avgGPA"
                      type="natural"
                      fill="url(#fillGPA)"
                      stroke="#0088CC"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
