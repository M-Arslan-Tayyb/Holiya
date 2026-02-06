"use client";

import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { useSignupMutation } from "@/services/features/auth/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import * as z from "zod";

// 1. Define the Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phone_no: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  invitation_code: z.string().min(1, {
    message: "Invitation code is required.",
  }),
});

// Infer the type of the form values
type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [signupMutation, { isLoading }] = useSignupMutation();
  const [showPassword, setShowPassword] = useState(false);

  // 2. Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_no: "",
      invitation_code: "",
    },
  });

  // 3. Handle Form Submission
  const onSubmit = async (data: FormValues) => {
    try {
      // Call the signup API
      const result = await signupMutation(data).unwrap();

      if (result.succeeded) {
        toast.success("Account created successfully!", {
          description: "Redirecting to login page...",
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
          duration: 3000,
        });

        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        // Handle API returned success: false
        toast.error("Signup failed", {
          description:
            result.message || "Please check your information and try again.",
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          duration: 5000,
        });
      }
    } catch (error: any) {
      // Handle network or server errors
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      const errorDetails = error?.data?.errors
        ? Object.values(error?.data?.errors).flat().join(", ")
        : null;

      toast.error("Signup failed", {
        description: errorDetails || errorMessage,
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        duration: 5000,
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 md:py-20">
      {/* Main Container - Added vertical padding and max-height handling */}
      <div className="w-full max-w-[380px] space-y-6 text-center my-auto">
        {/* --- Logos Section --- */}
        <div className="flex flex-col items-center space-y-2">
          <HoliyaLogo size="sm" isSimple={true} />
          <img
            src="/holiya-text-logo.svg"
            alt="Holiya Text"
            className="h-16 w-36 object-contain md:h-20 md:w-40"
          />
        </div>

        {/* --- Header Text --- */}
        <div className="space-y-1">
          <h1 className="text-[32px] md:text-[40px] text-text-gray font-sans leading-tight">
            Create Account
          </h1>
          <p className="text-xs text-text-gray/80 font-sans font-normal">
            Sign up to start your health journey
          </p>
        </div>

        {/* --- Form Section --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-4">
          {/* Name Input */}
          <div className="space-y-1">
            <label className="block text-text-gray text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-text-gray text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1">
            <label className="block text-text-gray text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phone_no")}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
            />
            {errors.phone_no && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.phone_no.message}
              </p>
            )}
          </div>

          {/* Invitation Code Input - NOW REQUIRED */}
          <div className="space-y-1">
            <label className="block text-text-gray text-sm font-medium">
              Invitation Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Invitation Code"
              {...register("invitation_code")}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
            />
            {errors.invitation_code && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.invitation_code.message}
              </p>
            )}
          </div>

          {/* Password Input with Eye Icon */}
          <div className="space-y-1">
            <label className="block text-text-gray text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-button text-sm font-bold text-text-gray shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </div>

          {/* --- Footer / Sign In Text --- */}
          <div className="pt-2 text-center">
            <p className="text-sm font-sans text-text-gray">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-text-gray hover:text-primary underline-offset-2 hover:underline transition-all"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
