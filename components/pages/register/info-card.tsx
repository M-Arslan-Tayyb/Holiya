"use client";

import { cn } from "@/lib/utils";
import { CircularBadge } from "@/components/custom/CircularBadge";

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function InfoCard({
  title,
  description,
  icon = "i",
  className,
}: InfoCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl md:rounded-3xl p-3 md:p-4",
        // Gradient: transparent → whitish on top-right
        "bg-gradient-to-tr from-transparent via-transparent to-white/60",
        className,
      )}
    >
      <div className="flex items-start gap-4 md:gap-6">
        {/* 
          Single border WITH mask (same style as stepper active state)
          Pass masked={true} to see the left-side fade
        */}
        <CircularBadge
          variant="single"
          size="sm"
          masked={true}
          className="flex-shrink-0"
        >
          <span className="italic font-serif">{icon}</span>
        </CircularBadge>

        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-text-gray">
            {title}
          </h3>
          <p className="text-gray-600 text-base leading-tight">{description}</p>
        </div>
      </div>
    </div>
  );
}
