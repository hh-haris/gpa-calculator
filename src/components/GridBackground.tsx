
import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px] sm:[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(228,228,231,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,228,231,0.2)_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for faded look */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
