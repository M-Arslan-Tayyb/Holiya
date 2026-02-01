// components/custom/HoliyaLogo.tsx
"use client";

import Image from "next/image";

interface HoliyaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xs";
  isSimple?: boolean;
}

const sizes = {
  xs: "w-16 h-16",
  sm: "w-40 h-40",
  md: "w-48 h-48 md:w-64 md:h-64",
  lg: "w-60 h-60 md:w-72 md:h-72",
  xl: "w-72 h-72 md:w-96 md:h-96",
};

export function HoliyaLogo({
  className = "",
  size = "md",
  isSimple = false,
}: HoliyaLogoProps) {
  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Left Half White Shadow */}
      <div
        className="absolute top-0 left-0 w-[30%] h-full z-30 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 40%, transparent 100%)",
          filter: "blur(18px)",
          borderTopLeftRadius: "100% 50%",
          borderBottomLeftRadius: "100% 50%",
        }}
      />

      {/* Right Half Primary Shadow - Only for simple/login version */}
      {isSimple && (
        <div
          className="absolute top-0 right-0 w-[30%] h-full z-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(202,146,95,0.6) 0%, rgba(202,146,95,0.3) 40%, transparent 100%)",
            filter: "blur(30px)",
            borderTopRightRadius: "100% 50%",
            borderBottomRightRadius: "100% 50%",
          }}
        />
      )}

      {/* Layer 2: Color (Middle) - With rounded corners */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-[119%] h-[100%] -m-[15%]">
          <Image
            src={
              isSimple
                ? "/holiya-logo-other2/colors-base.svg"
                : "/holiya-logo-other2/color-base-full.svg"
            }
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Layer 3: H Logo (Top) */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-[65%] h-[65%]">
          <Image
            src={
              isSimple
                ? "/holiya-logo-other2/H-logo-primary.svg"
                : "/holiya-logo-other2/H-logo-simple.svg"
            }
            alt="Holiya Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
