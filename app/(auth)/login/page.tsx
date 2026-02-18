"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // Importing icons

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
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect logic based on session state
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if profile is incomplete
      if (session.user.userProfileCompletion === false) {
        setShouldRedirect("/register");
      } else {
        setShouldRedirect("/dashboard");
      }
    }
  }, [session, status]);

  // Handle redirect after state update
  useEffect(() => {
    if (shouldRedirect) {
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
    setIsLoading(true);
    try {
      const authResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Important: Handle redirect manually to prevent page reloads
      });

      // Check for specific errors
      if (authResult?.error) {
        // Mapping technical error codes to user-friendly messages
        const errorMap: Record<string, string> = {
          CredentialsSignin: "Invalid email or password.",
          default: authResult.error,
        };

        const message =
          errorMap[authResult.error] ||
          "Login failed. Invalid email or password.";
        toast.error(message);
      } else if (authResult?.ok) {
        toast.success("Login successful! Redirecting...");
        // Session will update via useSession hook, which triggers the useEffect above
      } else {
        // Handle case where authResult is returned but no explicit ok/error
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      // This block catches network errors or issues with the signIn call itself
      console.error("Login exception:", error);
      toast.error("Connection failed. Please check your network.");
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-text-gray text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Relative wrapper for the input and icon */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  // Added pr-10 to prevent text from going under the icon
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                />

                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary focus:outline-none"
                  tabIndex={-1} // Prevent focusing this button when tabbing through form
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

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
