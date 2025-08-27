"use client";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex space-x-2">
        <span className="text-6xl text-primary animate-pulse" style={{ animationDelay: "0ms" }}>
          ⟐
        </span>
        <span className="text-6xl text-primary animate-pulse" style={{ animationDelay: "200ms" }}>
          ⧚
        </span>
        <span className="text-6xl text-primary animate-pulse" style={{ animationDelay: "400ms" }}>
          ∅
        </span>
      </div>
    </div>
  );
}