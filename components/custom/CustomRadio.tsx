"use client";

import { cn } from "@/lib/utils";

interface CustomRadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export function CustomRadio({
  checked,
  onChange,
  label,
  description,
  className,
}: CustomRadioProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-4 cursor-pointer p-5 rounded-2xl transition-all duration-300",
        className,
      )}
    >
      {/* Hidden Native Input */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {/* Custom Radio - Fixed size, visible inactive state */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            checked
              ? "bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              : "bg-transparent border-white hover:border-text-gray/50",
          )}
        >
          {checked && <div className="w-2 h-2 bg-primary rounded-full" />}
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <div className="font-semibold text-text-gray text-sm md:text-base leading-tight">
          {label}
        </div>
        {description && (
          <p className="text-text-gray text-xs md:text-sm mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
