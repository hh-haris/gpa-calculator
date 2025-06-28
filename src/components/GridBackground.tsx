import React from "react";

export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
      {/* ✅ Proper Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.07, // subtle but visible
          backgroundSize: "20px 20px",
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
          `,
        }}
      />
      {/* ✅ Radial Center Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/30" />
    </div>
  );
}
