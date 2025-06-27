
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Trophy, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
    disabled?: boolean;
  };
  className?: string;
  onClick?: () => void;
}

const SidebarLink = ({ link, className, onClick }: SidebarLinkProps) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    if (link.disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick();
    }
    
    if (link.href.startsWith('/')) {
      navigate(link.href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md transition-colors w-full text-left",
        link.disabled 
          ? "text-gray-400 cursor-not-allowed" 
          : "hover:bg-[#EEEEEE] text-[#000000]",
        className
      )}
    >
      {link.icon}
      <motion.span
        animate={{
          display: "inline-block",
          opacity: 1,
        }}
        className={cn(
          "text-sm font-medium transition duration-150 whitespace-pre",
          link.disabled 
            ? "text-gray-400" 
            : "group-hover/sidebar:translate-x-1"
        )}
      >
        {link.label}
      </motion.span>
    </button>
  );
};

interface AppSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AppSidebar({ open, setOpen }: AppSidebarProps) {
  const links = [
    {
      label: "GPA Wall",
      href: "/gpa-wall",
      icon: <Trophy className="h-5 w-5 shrink-0 text-[#0088CC]" />,
    },
    {
      label: "Suggest",
      href: "/suggest",
      icon: <MessageSquare className="h-5 w-5 shrink-0 text-[#0088CC]" />,
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
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-[#EEEEEE] transition-colors"
              >
                <X className="h-5 w-5 text-[#979797]" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto px-4">
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink 
                    key={idx} 
                    link={link} 
                    onClick={() => setOpen(false)}
                  />
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
        "fixed left-4 top-4 z-30 p-2 rounded-md hover:bg-[#EEEEEE] transition-colors",
        className
      )}
    >
      <Menu className="h-5 w-5 text-[#0088CC]" />
    </button>
  );
}
