"use client";

import { CustomDropdown } from "@/components/custom/CustomDropdown";

interface Industry {
  id: string;
  name: string;
}

interface IndustrySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Industry[];
}

export function IndustrySelect({
  value,
  onChange,
  options,
}: IndustrySelectProps) {
  const dropdownOptions = options.map((ind) => ({
    id: ind.id,
    label: ind.name,
  }));

  return (
    <CustomDropdown
      label="INDUSTRY"
      value={value}
      onChange={onChange}
      options={dropdownOptions}
      placeholder="Select your industry"
    />
  );
}
