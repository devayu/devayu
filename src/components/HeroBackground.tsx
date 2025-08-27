"use client";

import * as React from "react";

export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Column grid */}
      <div
        className="absolute inset-0 opacity-18"
        style={{
          background:
            "repeating-linear-gradient(to right, color-mix(in oklch, var(--border) 42%, transparent) 0 1px, transparent 1px 40px)",
        }}
      />

      {/* Concentric dashed rings (polar grid) */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 40%, transparent 0 24px, color-mix(in oklch, var(--border) 35%, transparent) 24px 25px)",
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 40%, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
