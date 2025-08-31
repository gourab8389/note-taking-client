"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthApi } from "@/lib/api";
import { SignupFormData, OTPFormData, ApiResponse } from "@/types/objects";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function SignupPage() {
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await AuthApi.post("/signup", data);
      return response.data as ApiResponse;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail(signupForm.getValues("email"));
      setStep("otp");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Signup failed";
      toast.error(errorMessage);
    },
  });

  const otpMutation = useMutation({
    mutationFn: async (data: OTPFormData) => {
      const response = await AuthApi.post("/verify-otp", { ...data, email });
      return response.data as ApiResponse;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      if (data.user && data.token) {
        login(data.user, data.token);
        router.push("/");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: async () => {
      const response = await AuthApi.post("/resend-otp", { email });
      return response.data as ApiResponse;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
    },
  });

  const onSignupSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  const onOTPSubmit = (data: OTPFormData) => {
    otpMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
    }/auth/google`;
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Verify Your Email
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit OTP to {email}
            </CardDescription>
          </CardHeader>
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-red-600">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={otpMutation.isPending}
              >
                {otpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => resendOTPMutation.mutate()}
                  disabled={resendOTPMutation.isPending}
                  className="text-sm"
                >
                  {resendOTPMutation.isPending ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to start taking notes</CardDescription>
        </CardHeader>
        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  className="pl-10"
                  {...signupForm.register("name")}
                />
              </div>
              {signupForm.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {signupForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  className="pl-10"
                  {...signupForm.register("email")}
                />
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...signupForm.register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </CardContent>
        </form>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
