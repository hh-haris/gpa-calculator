
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Calculator, GraduationCap, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
  className?: string;
}

const SidebarLink = ({ link, className }: SidebarLinkProps) => {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md hover:bg-[#EEEEEE] transition-colors",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          display: "inline-block",
          opacity: 1,
        }}
        className="text-sm font-medium text-[#000000] group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
      >
        {link.label}
      </motion.span>
    </a>
  );
};

interface AppSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AppSidebar({ open, setOpen }: AppSidebarProps) {
  const links = [
    {
      label: "GPA Calculator",
      href: "#gpa",
      icon: <Calculator className="h-5 w-5 shrink-0 text-[#0088CC]" />,
    },
    {
      label: "CGPA Calculator",
      href: "#cgpa",
      icon: <GraduationCap className="h-5 w-5 shrink-0 text-[#0088CC]" />,
    },
    {
      label: "Grade Guide",
      href: "#guide",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-[#0088CC]" />,
    },
    {
      label: "Tips & Tricks",
      href: "#tips",
      icon: <Target className="h-5 w-5 shrink-0 text-[#0088CC]" />,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col border-r border-[#EEEEEE]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#EEEEEE]">
              <h2 className="text-lg font-bold text-[#000000] font-jakarta">
                UoH Calculator
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-[#EEEEEE] transition-colors"
              >
                <X className="h-5 w-5 text-[#979797]" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#EEEEEE]">
              <p className="text-xs text-[#979797] text-center font-inter">
                Made with ❤️ by Haris H.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SidebarTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SidebarTrigger({ onClick, className }: SidebarTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed left-4 top-16 z-30 p-2 rounded-md bg-white shadow-lg border border-[#EEEEEE] hover:bg-[#EEEEEE] transition-colors",
        className
      )}
    >
      <Menu className="h-5 w-5 text-[#0088CC]" />
    </button>
  );
}
