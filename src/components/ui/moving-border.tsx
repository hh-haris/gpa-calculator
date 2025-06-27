
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  borderRadius?: string;
  className?: string;
  containerClassName?: string;
}

export const MovingBorder = ({
  children,
  duration = 2000,
  borderRadius = "1.75rem",
  className,
  containerClassName,
}: MovingBorderProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-transparent p-[1px]",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
    >
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          background: `conic-gradient(from 0deg, #0088CC, #0077BB, #00AADD, #0088CC)`,
          borderRadius: borderRadius,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className={cn(
          "relative z-[2] bg-white dark:bg-slate-900",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Button = MovingBorder;
