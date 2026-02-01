"use client";
import { CustomRadio } from "@/components/custom/CustomRadio";

interface ConsentSectionProps {
  dataConsent: boolean;
  setDataConsent: (v: boolean) => void;
  gdprConsent: boolean;
  setGdprConsent: (v: boolean) => void;
}

export function ConsentSection({
  dataConsent,
  setDataConsent,
  gdprConsent,
  setGdprConsent,
}: ConsentSectionProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      {/* Card 1: Whitish on Top-Left (to-br = from top-left to bottom-right) */}
      <CustomRadio
        checked={dataConsent}
        onChange={setDataConsent}
        label="I consent to the collection and processing of my health data"
        description="This includes symptoms, cycle information, and lifestyle data to provide personalized care plans."
        className="bg-gradient-to-br from-white/60 via-transparent to-transparent"
      />

      {/* Card 2: Whitish on Top-Right (to-bl = from top-right to bottom-left) */}
      <CustomRadio
        checked={gdprConsent}
        onChange={setGdprConsent}
        label="I understand my data rights and deletion options"
        description="You can request data export, modification, or complete deletion at any time from your account settings."
        className="bg-gradient-to-tr from-transparent via-transparent to-white/60"
      />
    </div>
  );
}
