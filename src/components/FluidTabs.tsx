
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Calculator } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FluidTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: { id: string; label: string }[];
}

const tabIcons = {
  gpa: <GraduationCap size={18} />,
  cgpa: <Calculator size={18} />
};

export default function FluidTabs({ activeTab, onTabChange, tabs }: FluidTabsProps) {
  const [touchedTab, setTouchedTab] = useState<string | null>(null);
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const handleTabClick = (tabId: string) => {
    setPrevActiveTab(activeTab);
    onTabChange(tabId);
    setTouchedTab(tabId);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTouchedTab(null), 300);
  };

  const getTabIndex = (tabId: string) =>
    tabs.findIndex((tab) => tab.id === tabId);

  return (
    <div className="flex justify-center mb-6 sm:mb-8 px-4">
      <div className="relative w-full max-w-xs bg-[#f5f1eb] rounded-full p-2 shadow-md overflow-hidden">
        <div className="relative flex items-center justify-between">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeTab}
              className="absolute top-0 left-0 h-full rounded-full bg-white"
              initial={{ x: `${getTabIndex(prevActiveTab) * 100}%` }}
              animate={{ x: `${getTabIndex(activeTab) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                width: "50%",
              }}
            />
          </AnimatePresence>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative z-10 flex w-1/2 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === tab.id ? "text-black" : "text-gray-500"
              } ${touchedTab === tab.id ? "blur-sm" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
