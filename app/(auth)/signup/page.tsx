"use client";

import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { useSignupMutation } from "@/services/features/auth/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  invitation_code: z.string().optional(),
});

// Infer the type of the form values
type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [signupMutation, { isLoading }] = useSignupMutation();

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
        toast.success("Account created successfully! Redirecting to login...");
        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Signup failed";
      toast.error(errorMessage);
    }
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
              Create Account
            </h1>
            <p className="text-xs text-text-gray font-sans font-normal">
              Sign up to start your health journey
            </p>
          </div>

          {/* --- Form Section --- */}
          <form onSubmit={handleSubmit(onSubmit)} className="text-left">
            {/* Name Input */}
            <div className="space-y-1 mb-2">
              <label className="block text-text-gray text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
              {errors.name && (
                <p className="text-xs text-red-500 pl-1 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            {/* Phone Number Input */}
            <div className="space-y-1 mb-2">
              <label className="block text-text-gray text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone_no")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
              {errors.phone_no && (
                <p className="text-xs text-red-500 pl-1 mt-1">
                  {errors.phone_no.message}
                </p>
              )}
            </div>

            {/* Invitation Code Input */}
            <div className="space-y-1 mb-2">
              <label className="block text-text-gray text-sm font-medium mb-1">
                Invitation Code
              </label>
              <input
                type="text"
                placeholder="Invitation Code"
                {...register("invitation_code")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-text-gray text-sm font-medium mb-1">
                Password
              </label>
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

            {/* Sign Up Button - Centered and Auto Width */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 py-2 rounded-sm bg-button text-sm font-bold text-text-gray shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </div>

            {/* --- Footer / Sign In Text --- */}
            <div className="pt-2 text-center">
              <p className="text-sm font-sans text-text-gray">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold text-text-gray hover:text-primary"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
