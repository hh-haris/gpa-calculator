import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
      <div
        className={cn(
          "absolute inset-0 opacity-30",
          "[background-size:20px_20px] sm:[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(0,0,0,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.4)_1px,transparent_1px)]",
        )}
      />
      {/* Subtle radial gradient for center focus */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20"></div>
    </div>
  );
}