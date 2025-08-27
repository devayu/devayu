"use client";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

interface CVButtonProps {
  variant?: "ghost" | "outline";
  size?: "sm" | "default";
  className?: string;
  showText?: boolean;
}

export const CVButton = ({
  variant = "outline",
  size = "sm",
  className = "",
  showText = true,
}: CVButtonProps) => {
  const handleCVClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Google Drive file ID
    const fileId = "1y329yo76Ns09W9BTz951ax5GT2shXNUl";
    // Try multiple approaches
    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    // Method 1: Try window.open with proper parameters
    const newWindow = window.open(viewUrl, "_blank", "noopener,noreferrer");

    // If window was blocked, try alternative
    if (!newWindow) {
      // Fallback: Create a temporary link and click it
      const link = document.createElement("a");
      link.href = viewUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCVClick}
      type="button"
    >
      <File className="w-4 h-4" />
      {showText && " CV"}
    </Button>
  );
};
