// components/custom/CustomDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react"; // or use any icon library

interface Option {
  id: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  className?: string;
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select option",
  label,
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {label && (
        <label className="block font-sans text-xl font-medium text-text-gray tracking-wide mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-1 rounded-lg",
          "bg-transparent border-2 border-primary",
          "text-text-gray text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200",
          isOpen && "ring-2 ring-primary/20",
        )}
      >
        <span className={cn(!selectedOption && "text-text-gray")}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-gray transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-2 py-1",
            "bg-white border border-primary/30 rounded-lg",
            "shadow-lg shadow-black/5",
            "max-h-60 overflow-auto",
          )}
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-left text-sm text-text-gray",
                "hover:bg-primary/10 transition-colors duration-150",
                "first:rounded-t-lg last:rounded-b-lg",
                value === option.id && "bg-primary/5 font-medium text-primary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
