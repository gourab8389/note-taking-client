"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ApiInstance } from "@/lib/api";
import { toast } from "sonner";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Fetch user profile with the token
      const fetchUserProfile = async () => {
        try {
          // Set token temporarily for this request
          const response = await ApiInstance.get("/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.data.success && response.data.user) {
            login(response.data.user, token);
            toast.success("Google login successful!");
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Authentication failed");
          router.push("/auth/login");
        }
      };

      fetchUserProfile();
    } else {
      toast.error("No authentication token received");
      router.push("/auth/login");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Processing Google authentication...</p>
      </div>
    </div>
  );
}