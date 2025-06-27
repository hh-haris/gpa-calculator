
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
}

interface FluidTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
}

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
      <div className="relative w-full max-w-md bg-[#EEEEEE] rounded-lg p-1 shadow-lg overflow-hidden">
        <div className="relative flex items-center justify-between">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeTab}
              className="absolute top-0 left-0 h-full rounded-md bg-[#0088CC] shadow-lg"
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
              className={`relative z-10 flex w-1/2 items-center justify-center rounded-md px-4 py-2 sm:py-3 text-sm sm:text-base font-medium font-inter transition-all duration-300 ${
                activeTab === tab.id ? "text-white transform scale-105" : "text-[#979797] hover:text-[#000000]"
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
