import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
      {/* Subtle grid */}
      <div
        className={cn(
          "absolute inset-0 opacity-10", // much softer now
          "[background-size:16px_16px] sm:[background-size:32px_32px]",
          "[background-image:linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_1px)]"
        )}
      />

      {/* Radial center glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/40" />
    </div>
  );
}
