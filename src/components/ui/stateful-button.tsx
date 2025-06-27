
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  loadingText?: string;
}

export function Button({ 
  onClick, 
  children, 
  className, 
  disabled, 
  loadingText = "Loading...",
  ...props 
}: StatefulButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      setIsLoading(true);
      try {
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
