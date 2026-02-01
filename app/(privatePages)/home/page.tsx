"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function HomePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // Initialize with default AI message
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hello! I'm Eva, your health companion. How can I help you today?",
    },
  ]);

  const step1TextRef = useRef<HTMLDivElement>(null);
  const step2TextRef = useRef<HTMLDivElement>(null);
  const step3ContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Step 1 to Step 2 transition
  useEffect(() => {
    if (step !== 1 || isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setStep(2);
          setIsAnimating(false);
        },
      });

      tl.to(step1TextRef.current, {
        opacity: 0,
        filter: "blur(8px)",
        y: -30,
        duration: 0.6,
        ease: "power2.inOut",
      });

      tl.fromTo(
        avatarRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      );

      tl.to(
        logoRef.current,
        {
          scale: 0.5,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.4",
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [step, isAnimating]);

  // Step 2 to Step 3 transition
  useEffect(() => {
    if (step !== 2 || isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setStep(3);
          setIsAnimating(false);
        },
      });

      tl.to(step2TextRef.current, {
        opacity: 0,
        filter: "blur(8px)",
        y: -20,
        duration: 0.6,
        ease: "power2.inOut",
      });

      tl.to(
        logoRef.current,
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "-=0.3",
      );
    }, 4000);

    return () => clearTimeout(timer);
  }, [step, isAnimating]);

  // Animate Step 2 text when it renders
  useLayoutEffect(() => {
    if (step !== 2 || !step2TextRef.current) return;

    gsap.fromTo(
      step2TextRef.current,
      {
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      },
    );
  }, [step]);

  // Animate Step 3 elements
  useLayoutEffect(() => {
    if (step !== 3 || !step3ContainerRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      step3ContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
    );

    tl.fromTo(
      ".chat-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.3",
    );

    tl.fromTo(
      ".input-section",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2",
    );
  }, [step]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      {/* Header - Show in ALL steps */}
      <div className="pt-4 md:pt-8 px-4 md:px-8 z-50">
        <Image
          src="/holiya-text-logo-with-des.svg"
          alt="Holiya"
          width={160}
          height={40}
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>

      {/* Avatar - Shows in Step 2 and Step 3 */}
      {(step === 2 || step === 3) && (
        <div
          ref={avatarRef}
          className="px-4 md:px-8 pt-4 flex items-center gap-3 ml-6 md:ml-36 mt-4"
          style={{ opacity: step === 2 || step === 3 ? 1 : 0 }}
        >
          <Avatar className="md:w-12 md:h-12 h-10 w-10">
            <AvatarImage src="/holiya-doctor-image.jpg" alt="Eva" />
            <AvatarFallback className="bg-primary text-white text-xs">
              EV
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-sans text-text-gray font-medium leading-tight">
              Hello!
            </span>
            <span className="text-sm italic font-serif text-text-gray/80">
              Eva
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full px-4 relative overflow-hidden">
        {/* STEP 1: Initial Hello */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center flex-1 w-full">
            <div ref={logoRef}>
              <HoliyaLogo size="md" />
            </div>
            <div ref={step1TextRef} className="mt-6 text-center">
              <h1 className="text-3xl md:text-4xl font-sans text-text-gray font-medium">
                Hello!
              </h1>
              <p className="text-sm md:text-base text-text-gray font-medium mt-2">
                I'm here to support your{" "}
                <span className="italic font-serif">health journey</span>.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Text + Small Logo */}
        {step === 2 && (
          <div
            ref={step2TextRef}
            className="flex flex-col items-center w-full flex-1 justify-center opacity-0"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-sans text-text-gray leading-tight">
                How are you
                <br />
                feeling today?
              </h2>
              <p className="text-xs md:text-sm text-text-gray font-medium leading-relaxed mt-2">
                You can share your symptoms, ask questions,
                <br />
                or tell me what's{" "}
                <span className="italic font-serif">on your mind</span>.
              </p>
            </div>

            <div ref={logoRef}>
              <HoliyaLogo size="sm" />
            </div>
          </div>
        )}

        {/* STEP 3: Chat Interface */}
        {step === 3 && (
          <div
            ref={step3ContainerRef}
            className="flex flex-col w-full flex-1 pt-6 opacity-0 relative"
          >
            {/* Chat Messages Area - Scrollable with padding for fixed input */}
            <div className="chat-container flex-1 overflow-y-auto space-y-4 px-2 pb-32 flex flex-col min-h-0">
              {messages.map((msg, idx) =>
                msg.role === "user" ? (
                  <div
                    key={idx}
                    className="self-end bg-white/60 rounded-2xl p-4 max-w-[70%] md:max-w-[60%] text-sm text-text-gray border border-text-gray/20 "
                  >
                    {msg.content}
                  </div>
                ) : (
                  // AI Message - No avatar, just message bubble aligned left
                  <div
                    key={idx}
                    className="self-start bg-white/60 rounded-2xl p-4 border border-text-gray/20 max-w-[70%] md:max-w-[60%] text-sm text-text-gray"
                  >
                    {msg.content}
                  </div>
                ),
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Bottom: XS Logo + Input */}
            <div className="input-section fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-[#fdf6f0] via-[#fdf6f0] to-transparent pb-6 pt-8 px-4 flex flex-col items-center gap-3 z-40">
              <div className="max-w-md w-full flex flex-col items-center gap-3">
                <HoliyaLogo size="xs" />
                <div className="w-full">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Share your symptoms or ask a question..."
                    className="w-full px-4 py-3 rounded-md bg-white text-text-gray text-sm placeholder:text-text-gray focus:outline-none border border-text-gray/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
