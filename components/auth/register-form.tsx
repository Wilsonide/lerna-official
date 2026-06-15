/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();

  const inviteCode = params.get("invite");

  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // 🚨 BLOCK ACCESS WITHOUT INVITE CODE
  useEffect(() => {
    if (!inviteCode) {
      toast.error(
        "Ask your school administrator for an invite code to register",
      );
    }
  }, [inviteCode, router]);

  async function submit() {
    try {
      if (!inviteCode) return;

      setLoading(true);

      const result = await AuthService.register(email, password, inviteCode);

      setUser(result.user);
      setAccessToken(result.access_token);

      toast.success("Account created successfully");

      if (!result.user.profile_completed) {
        router.push("/complete-profile");
        return;
      }

      switch (result.user.role) {
        case "STUDENT":
          router.push("/student");
          break;

        case "TEACHER":
          router.push("/teacher");
          break;

        case "PARENT":
          router.push("/parent");
          break;

        case "SCHOOL_ADMIN":
          router.push("/admin");
          break;

        case "SUPER_ADMIN":
          router.push("/super-admin");
          break;

        default:
          router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      // 🧠 CASE 1: No server / network error
      if (!error?.response) {
        setError("Server unavailable. Please try again later.");
        return;
      }

      // 🧠 CASE 2: Backend responded with error (401, 400, etc.)
      setError(error?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Join your school on LERNA</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            onClick={submit}
            disabled={loading || !inviteCode}
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
