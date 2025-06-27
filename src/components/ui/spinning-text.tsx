
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpinningTextProps {
  children: string;
  radius?: number;
  fontSize?: number;
  duration?: number;
  className?: string;
  transition?: any;
  variants?: any;
}

export function SpinningText({
  children,
  radius = 5,
  fontSize = 1.2,
  duration = 8,
  className,
  transition,
  variants,
}: SpinningTextProps) {
  const chars = children.split("");
  const angleStep = 360 / chars.length;

  const defaultVariants = {
    container: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        rotate: 360,
        transition: {
          type: "spring",
          bounce: 0,
          duration: duration,
          repeat: Infinity,
          staggerChildren: 0.03,
        },
      },
    },
    item: {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
  };

  const motionVariants = variants || defaultVariants;

  return (
    <motion.div
      className={cn("relative", className)}
      variants={motionVariants.container}
      initial="hidden"
      animate="visible"
      style={{
        width: `${radius * 2}rem`,
        height: `${radius * 2}rem`,
      }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="absolute"
          variants={motionVariants.item}
          style={{
            left: "50%",
            top: "50%",
            fontSize: `${fontSize}rem`,
            transform: `translate(-50%, -50%) rotate(${i * angleStep}deg) translateY(-${radius}rem) rotate(-${i * angleStep}deg)`,
            transformOrigin: "center",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
