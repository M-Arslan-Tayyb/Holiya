"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { useRouter } from "next/navigation";

// 1. Define the Zod Schema for validation
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Infer the type of the form values
type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  // 2. Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Handle Form Submission
  const onSubmit = async (data: FormValues) => {
    console.log("Login Data:", data);
    // TODO: Add your actual login logic here (API call, etc.)
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      {/* Main Container */}
      <div className="w-full max-w-[380px] space-y-8 text-center">
        {/* --- Logos Section --- */}
        <div className="flex flex-col items-center space-y-2">
          {/* Logo H - Using standard img tag for perfect scaling */}
          <HoliyaLogo size="sm" isSimple={true} />

          {/* Text Logo */}
          <img
            src="/holiya-text-logo.svg"
            alt="Holiya Text"
            className="h-20 w-40 object-contain"
          />
        </div>

        {/* --- Header Text --- */}
        <div className="space-y-2">
          <div className="space-y-1">
            {/* Welcome Text - Fixed 40px */}
            <h1 className="text-[40px] text-text-gray font-sans leading-tight">
              Welcome
            </h1>
            <p className="text-xs text-text-gray font-sans font-normal">
              Sign in to continue your health journey
            </p>
          </div>

          {/* --- Form Section --- */}
          <form onSubmit={handleSubmit(onSubmit)} className="text-left">
            {/* Email Input */}
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

            {/* Forgot Password Link (As per your request, placed here) */}

            {/* Password Input */}
            <div className=" mb-6">
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

            {/* Sign In Button - Centered and Auto Width */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={(e: any) => {
                  router.push("/home");
                }}
                className="px-10 py-2 rounded-sm bg-button text-sm font-bold text-text-gray shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {/* --- Footer / Sign Up Text --- */}
            <div className="pt-2 text-center">
              <p className="text-sm font-sans text-text-gray">
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
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
