"use client";

import { cn } from "@/lib/utils";

interface CircularBadgeProps {
  children: React.ReactNode;
  variant?: "single" | "double";
  size?: "sm" | "md";
  masked?: boolean;
  className?: string;
}

export function CircularBadge({
  children,
  variant = "single",
  size = "md",
  masked = false,
  className,
}: CircularBadgeProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 md:w-20 md:h-20 text-lg md:text-xl",
  };

  // Mask style for left-side fade (0% = transparent/left, 100% = visible/right)
  const maskStyle = {
    maskImage: "linear-gradient(to right, transparent 0%, black 100%)",
    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 100%)",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full font-bold text-text-gray",
        sizeClasses[size],
        className,
      )}
    >
      {/* Outer Border - Apply mask when masked=true */}
      <div
        className="absolute inset-2 rounded-full border-2 border-white/70"
        style={masked ? maskStyle : undefined}
      />

      {/* Inner Border - Same styling, just smaller */}
      {variant === "double" && (
        <div
          className={cn(
            "absolute rounded-full border-2 border-white/70",
            size === "sm" ? "inset-1.5" : "inset-[15px] md:inset-[22px]",
          )}
          style={masked ? maskStyle : undefined}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </div>
  );
}
