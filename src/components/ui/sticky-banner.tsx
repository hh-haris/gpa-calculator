
import { cn } from "@/lib/utils";
import React from "react";

interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyBanner({ children, className }: StickyBannerProps) {
  return (
    <div className={cn("sticky top-0 z-50 w-full", className)}>
      <div className="relative overflow-hidden">
        <div className="animate-scroll whitespace-nowrap py-2 px-4">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
