
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, GraduationCap } from "lucide-react";

const tabs = [
  {
    id: "gpa",
    label: "GPA Calculator",
    icon: <Calculator size={18} />,
  },
  {
    id: "cgpa",
    label: "CGPA Calculator",
    icon: <GraduationCap size={18} />,
  },
];

interface FluidTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function FluidTabs({ activeTab, onTabChange }: FluidTabsProps) {
  const [touchedTab, setTouchedTab] = useState<string | null>(null);
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleTabClick = (tabId: string) => {
    setPrevActiveTab(activeTab);
    onTabChange(tabId);
    setTouchedTab(tabId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setTouchedTab(null);
    }, 300);
  };

  const getTabIndex = (tabId: string) => tabs.findIndex((tab) => tab.id === tabId);

  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative flex w-full max-w-md space-x-2 overflow-hidden rounded-full bg-[#f5f1eb] dark:bg-gray-800 p-1 shadow-lg">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeTab}
            className="absolute inset-y-0 my-1 rounded-full bg-white dark:bg-gray-700"
            initial={{ x: `${getTabIndex(prevActiveTab) * 100}%` }}
            animate={{ x: `${getTabIndex(activeTab) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${100 / tabs.length}%` }}
          />
        </AnimatePresence>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`relative z-10 flex w-full items-center justify-center gap-1.5 px-5 py-3 text-sm font-bold transition-colors duration-300 ${
              activeTab === tab.id ? "font-bold text-black dark:text-white" : "text-gray-500"
            } ${touchedTab === tab.id ? "blur-sm" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
