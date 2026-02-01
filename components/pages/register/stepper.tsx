"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CircularBadge } from "@/components/custom/CircularBadge";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevStep = useRef(currentStep);

  useEffect(() => {
    // Animate when step changes
    if (currentStep !== prevStep.current) {
      const direction = currentStep > prevStep.current ? 1 : -1;

      // Animate the new active step
      const activeRef = stepRefs.current[currentStep - 1];
      if (activeRef) {
        gsap.fromTo(
          activeRef,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
        );
      }

      // Animate completed step if moving forward
      if (direction > 0 && prevStep.current > 0) {
        const completedRef = stepRefs.current[prevStep.current - 1];
        if (completedRef) {
          gsap.fromTo(
            completedRef,
            { scale: 1.2 },
            { scale: 1, duration: 0.3, ease: "power2.out" },
          );
        }
      }

      prevStep.current = currentStep;
    }
  }, [currentStep]);

  return (
    <div className="flex items-center justify-between w-full">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div
            key={index}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20"
          >
            {isCompleted ? (
              <div className="relative w-6 h-6 md:w-6 md:h-6 rounded-4xl bg-primary shadow-[0_0_10px_6px_rgba(255,255,255,0.4)]">
                <div
                  className="absolute inset-[-10] rounded-full border-1 border-white/70"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 50%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 50%)",
                  }}
                />
              </div>
            ) : isActive ? (
              <CircularBadge variant="double" size="md" masked={true}>
                {stepNumber}
              </CircularBadge>
            ) : (
              <span className="text-lg md:text-xl font-bold text-text-gray">
                {stepNumber}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
