"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  // Debug: Log session status changes
  useEffect(() => {
    console.log("🔍 [LoginPage] Session status:", status);
    console.log("🔍 [LoginPage] Session data:", session);

    if (status === "authenticated" && session?.user) {
      console.log(
        "✅ [LoginPage] User authenticated, checking profile completion...",
      );
      console.log(
        "📋 [LoginPage] userProfileCompletion:",
        session.user.userProfileCompletion,
      );
      console.log("📋 [LoginPage] userName:", session.user.userName);
      console.log("📋 [LoginPage] userEmail:", session.user.userEmail);

      // Check if profile is incomplete
      if (session.user.userProfileCompletion === false) {
        console.log(
          "⚠️ [LoginPage] Profile incomplete, redirecting to /register",
        );
        setShouldRedirect("/register");
      } else {
        console.log("✅ [LoginPage] Profile complete, redirecting to /home");
        setShouldRedirect("/home");
      }
    }
  }, [session, status]);

  // Handle redirect after state update
  useEffect(() => {
    if (shouldRedirect) {
      console.log("🚀 [LoginPage] Executing redirect to:", shouldRedirect);
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("📝 [LoginPage] Form submitted with email:", data.email);
    setIsLoading(true);
    try {
      const authResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Handle redirect manually
      });

      console.log("🔐 [LoginPage] Auth result:", authResult);

      if (authResult?.error) {
        console.error("❌ [LoginPage] Auth error:", authResult.error);
        toast.error(authResult.error);
      } else {
        console.log(
          "✅ [LoginPage] Login successful, waiting for session update...",
        );
        toast.success("Login successful! Redirecting...");
        // Session will update via useSession hook, which triggers the useEffect above
      }
    } catch (error: any) {
      console.error("❌ [LoginPage] Exception during login:", error);
      const errorMessage = error?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[380px] space-y-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <HoliyaLogo size="sm" isSimple={true} />
          <img
            src="/holiya-text-logo.svg"
            alt="Holiya Text"
            className="h-20 w-40 object-contain"
          />
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <h1 className="text-[40px] text-text-gray font-sans leading-tight">
              Welcome
            </h1>
            <p className="text-xs text-text-gray font-sans font-normal">
              Sign in to continue your health journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="text-left">
            <div className="space-y-1 mb-2">
              <label className="block text-text-gray text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
              {errors.email && (
                <p className="text-xs text-red-500 pl-1 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center">
                <label className="block text-text-gray text-sm font-medium mb-1">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
              {errors.password && (
                <p className="text-xs text-red-500 pl-1 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-2 rounded-sm bg-button text-sm font-bold text-text-gray shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-sm font-sans text-text-gray">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="font-bold text-text-gray hover:text-primary"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
