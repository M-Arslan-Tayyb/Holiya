"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Stepper } from "@/components/pages/register/stepper";
import { InfoCard } from "@/components/pages/register/info-card";
import { ConsentSection } from "@/components/pages/register/ConsentSestion";
import { cn } from "@/lib/utils";
import { CustomRadio } from "@/components/custom/CustomRadio";
import { IndustrySelect } from "@/components/pages/register/IndustrySelect";
import { useRouter } from "next/navigation";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCompleteProfileMutation } from "@/services/features/auth/api";
import { QuestionnaireRequest } from "@/services/features/auth/types";

const TOTAL_STEPS = 3;
const INDUSTRIES_DATA = [
  {
    id: "corporate",
    name: "Finance / Corporate",
    conditions: [
      "PMS (Premenstrual Syndrome)",
      "PMDD (Premenstrual Dysphoric Disorder)",
      "Endometriosis",
      "Dysmenorrhea (Painful Periods)",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare / Medical",
    conditions: [
      "Heavy Menstrual Bleeding",
      "Fibroids",
      "Thyroid Disorders",
      "Menopause Symptoms",
    ],
  },
  {
    id: "education",
    name: "Education / Teaching",
    conditions: [
      "PCOS (Polycystic Ovary Syndrome)",
      "Irregular Periods",
      "Chronic Fatigue",
    ],
  },
];

// Beautiful Loading Component
function ProfileSetupLoader({ isLoading }: { isLoading: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate dots
      gsap.to(dotsRef.current, {
        y: -10,
        duration: 0.4,
        stagger: {
          each: 0.15,
          yoyo: true,
          repeat: -1,
        },
        ease: "power2.inOut",
      });

      // Pulse the container
      gsap.to(containerRef.current, {
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Fade text in/out
      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0.6,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white shadow-2xl border border-[#DAB18C]/20"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) dotsRef.current[i] = el;
              }}
              className="w-4 h-4 rounded-full bg-gradient-to-br from-[#DAB18C] to-[#CA925F]"
            />
          ))}
        </div>

        <div ref={textRef} className="text-center space-y-2">
          <h3 className="text-xl font-sans font-medium text-text-gray">
            Setting up your profile
          </h3>
          <p className="text-sm text-text-gray/70 font-medium">
            Personalizing your health journey...
          </p>
        </div>

        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#DAB18C] to-[#CA925F] animate-[shimmer_2s_infinite]"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSetupLoader, setShowSetupLoader] = useState(false);

  const router = useRouter();
  const [completeProfile] = useCompleteProfileMutation();
  const { data: session, status, update } = useSession();

  const contentRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const conditionsRef = useRef<HTMLDivElement>(null);

  // Header refs for Step 1 animation only
  const logoRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Redirect if already authenticated and profile is completed
  useEffect(() => {
    if (session?.user?.userProfileCompletion) {
      router.push("/home");
    }
  }, [session, router]);

  const canContinue = useMemo(() => {
    if (currentStep === 1) return gdprConsent && dataConsent;
    if (currentStep === 2)
      return selectedIndustry.length > 0 && selectedConditions.length > 0;
    return true;
  }, [
    currentStep,
    gdprConsent,
    dataConsent,
    selectedIndustry,
    selectedConditions,
  ]);

  // Animate header elements only when on Step 1
  useEffect(() => {
    if (currentStep === 1) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        if (logoRef.current) {
          tl.fromTo(
            logoRef.current,
            { opacity: 0, scale: 0.8, y: -20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
            },
            0,
          );
        }

        if (mainTitleRef.current) {
          tl.fromTo(
            mainTitleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            0.2,
          );
        }

        if (subtitleRef.current) {
          tl.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            0.4,
          );
        }
      });

      return () => ctx.revert();
    }
  }, [currentStep]);

  // Animate step content transitions
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );

      if (currentStep === 1 && step1Ref.current) {
        gsap.fromTo(
          step1Ref.current.querySelectorAll(".animate-item"),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.6,
          },
        );
      } else if (currentStep === 2 && step2Ref.current) {
        gsap.fromTo(
          step2Ref.current.querySelectorAll(".animate-item"),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      } else if (currentStep === 3 && step3Ref.current) {
        gsap.fromTo(
          step3Ref.current.querySelectorAll(".animate-item"),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    });

    return () => ctx.revert();
  }, [currentStep]);

  // Animate conditions when industry changes
  useEffect(() => {
    if (selectedIndustry && conditionsRef.current && currentStep === 2) {
      gsap.fromTo(
        conditionsRef.current.querySelectorAll(".condition-item"),
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, ease: "power2.out" },
      );
    }
  }, [selectedIndustry, currentStep]);

  const handleNext = async () => {
    if (!canContinue) return;

    if (currentStep < TOTAL_STEPS) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => setCurrentStep((prev) => prev + 1),
      });
    }

    // If this is the last step, submit the questionnaire
    if (currentStep === TOTAL_STEPS) {
      await submitQuestionnaire();
    }
  };

  const submitQuestionnaire = async () => {
    if (!session?.accessToken) {
      toast.error("You must be logged in to complete your profile");
      return;
    }

    setIsSubmitting(true);
    setShowSetupLoader(true);

    try {
      // Prepare the questionnaire data
      const questionnaireData: QuestionnaireRequest = {
        user_id: Number(session.user.id),
        questioner: {
          profile: "Completed",
        },
      };

      console.log(
        "📤 [Register] Submitting profile completion:",
        questionnaireData,
      );

      // Call the API using RTK Query
      const result = await completeProfile(questionnaireData).unwrap();

      console.log("✅ [Register] Profile completion response:", result);

      if (!result.succeeded) {
        throw new Error(result.message || "Failed to complete profile");
      }

      // Show success state briefly before redirect
      toast.success("Profile completed successfully!");

      // Update the session to reflect profile completion
      // This triggers the session update in NextAuth
      await update({
        ...session,
        user: {
          ...session.user,
          userProfileCompletion: true,
        },
      });

      console.log("🔄 [Register] Session updated, redirecting to home...");

      // Small delay to show success state
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error: any) {
      console.error("❌ [Register] Profile completion failed:", error);
      toast.error(
        error.message || "Failed to complete profile. Please try again.",
      );
      setShowSetupLoader(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => setCurrentStep((prev) => prev - 1),
      });
    }
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  };

  const availableConditions =
    INDUSTRIES_DATA.find((ind) => ind.id === selectedIndustry)?.conditions ||
    [];

  return (
    <>
      <ProfileSetupLoader isLoading={showSetupLoader} />

      <div className="flex flex-col">
        {/* Header with Logo */}
        <div className="pt-2 md:pt-8">
          <Image
            src="/holiya-text-logo-with-des.svg"
            alt="Holiya Text"
            width={160}
            height={40}
            className="h-8 md:h-12 lg:h-14 w-auto object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          {/* Decorative Circle - Animated only on Step 1 */}
          <div ref={logoRef}>
            <HoliyaLogo size="sm" isSimple={true} />
          </div>

          {/* Title Section - Animated only on Step 1 */}
          <div className="text-center mb-2 md:mb-3">
            <div ref={mainTitleRef}>
              <h1 className="text-xl md:text-3xl font-sans text-text-gray font-medium">
                Let&apos;s Get{" "}
                <span className="italic font-normal font-serif ">Started</span>
              </h1>
            </div>
            <p
              ref={subtitleRef}
              className="text-xs md:text-sm text-text-gray leading-tight font-medium"
            >
              Just a few steps to personalize
              <br />
              your health journey
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6 md:mb-8">
            <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>

          {/* Content Container */}
          <div ref={contentRef} className="w-full flex flex-col items-center">
            {/* STEP 1 CONTENT */}
            {currentStep === 1 && (
              <div ref={step1Ref} className="w-[80%] space-y-6 md:space-y-8">
                <div className="text-center animate-item">
                  <h2 className="text-lg md:text-2xl font-sans text-text-gray">
                    YOUR PRIVACY{" "}
                    <span className="italic font-serif text-xl md:text-3xl">
                      Matters
                    </span>
                  </h2>
                  <p className="text-xs md:text-sm text-text-gray leading-tight font-medium">
                    We&apos;re committed to protecting
                    <br />
                    your personal health information
                  </p>
                </div>
                <div className="animate-item">
                  <InfoCard
                    title="GDPR Compliance & Data Protection"
                    description="Holiya is fully GDPR compliant. Your health data is encrypted, stored securely, and never shared without your explicit consent. You have the right to access, modify, or delete your data at any time."
                    icon={<span className="italic font-serif text-2xl">i</span>}
                    className="mt-8 max-w-2xl"
                  />
                </div>

                <div className="animate-item">
                  <ConsentSection
                    dataConsent={dataConsent}
                    setDataConsent={setDataConsent}
                    gdprConsent={gdprConsent}
                    setGdprConsent={setGdprConsent}
                  />
                </div>
              </div>
            )}

            {/* STEP 2 CONTENT */}
            {currentStep === 2 && (
              <div ref={step2Ref} className="w-full max-w-md space-y-6">
                <div className="text-center animate-item">
                  <h2 className="text-lg md:text-2xl font-medium font-sans text-text-gray">
                    TELL US{" "}
                    <span className="italic font-serif font-light text-xl md:text-3xl">
                      About You
                    </span>
                  </h2>
                  <p className="text-xs md:text-sm text-text-gray leading-tight font-medium">
                    Help us personalize your care plan to your unique needs
                  </p>
                </div>
                <div className="animate-item rounded-2xl px-6 py-4 md:px-12 md:py-6 mb-8 bg-gradient-to-b from-white/70 via-white/30 to-transparent space-y-6">
                  <IndustrySelect
                    value={selectedIndustry}
                    onChange={(val) => {
                      setSelectedIndustry(val);
                      setSelectedConditions([]);
                    }}
                    options={INDUSTRIES_DATA.map((i) => ({
                      id: i.id,
                      name: i.name,
                    }))}
                  />

                  {selectedIndustry && (
                    <div ref={conditionsRef} className="space-y-3 pt-2">
                      <h3 className="text-lg font-medium text-text-gray">
                        Conditions (select all that apply)
                      </h3>

                      <div className="space-y-4">
                        {availableConditions.map((condition) => {
                          return (
                            <div key={condition} className="condition-item">
                              <CustomRadio
                                checked={selectedConditions.includes(condition)}
                                onChange={() => toggleCondition(condition)}
                                label={condition}
                                className={cn(
                                  "bg-gradient-to-r from-transparent via-white/30 to-white/50",
                                  "border border-white rounded-lg",
                                  "py-2 md:py-1 px-2",
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 CONTENT */}
            {currentStep === 3 && (
              <div
                ref={step3Ref}
                className="w-full max-w-md space-y-6 font-sans"
              >
                <div className="text-center animate-item">
                  <h2 className="text-lg md:text-2xl font-medium font-sans text-text-gray">
                    TELL US{" "}
                    <span className="italic font-serif font-light text-xl md:text-3xl">
                      About You
                    </span>
                  </h2>
                  <p className="text-xs md:text-sm text-text-gray leading-tight font-medium">
                    Help us personalize your care plan to your unique needs
                  </p>
                </div>

                <div className="animate-item rounded-2xl px-6 py-6 md:px-10 md:py-8 bg-gradient-to-b from-white/70 via-white/30 to-transparent space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-md md:text-lg font-semibold font-sans text-text-gray uppercase tracking-wide leading-tight">
                      WELCOME TO YOUR PERSONALIZED HEALTH COMPANION
                    </h3>

                    <p className="text-text-gray text-sm font-medium leading-tight tracking-tight">
                      Based on your profile, I&apos;ll provide evidence-based
                      recommendations tailored to your unique needs. Together,
                      we&apos;ll track your symptoms, identify triggers, and
                      build strategies that work for you.
                    </p>

                    <p className="text-secondary font-bold text-sm py-2">
                      Ready to start? Share your symptoms or ask me anything
                      about your health.
                    </p>

                    <div className="border-t border-1 border-secondary my-4" />

                    <p className="text-secondary py-2 text-sm leading-relaxed font-medium text-center">
                      <span className="font-bold text-sm text-left">
                        Important:
                      </span>{" "}
                      Holiya provides informational support only and is not a
                      substitute for professional medical advice. If you
                      experience severe symptoms or have urgent concerns, please
                      contact NHS 111 or your healthcare provider.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-3 md:gap-4 pt-2 md:pt-6 justify-around w-full mb-8 mt-6">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-3 md:px-5 py-1.5 rounded border-2 border-primary text-text-gray font-medium hover:bg-white/40 transition-colors text-sm md:text-base disabled:opacity-50"
                >
                  Back
                </button>
              )}

              {currentStep === 1 && <div className="px-3 md:px-5" />}

              <button
                disabled={!canContinue || isSubmitting}
                onClick={handleNext}
                className="px-3 md:px-5 py-1.5 rounded bg-[#DAB18C] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#CA925F] transition-colors text-sm md:text-base min-w-[120px]"
              >
                {isSubmitting
                  ? "Setting up..."
                  : currentStep === TOTAL_STEPS
                    ? "Complete"
                    : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
