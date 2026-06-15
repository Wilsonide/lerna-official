/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterFormProps = {
  inviteCode: string;
};

export default function RegisterForm({ inviteCode }: RegisterFormProps) {
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inviteCode) {
      toast.error(
        "Ask your school administrator for an invite code to register",
      );
    }
  }, [inviteCode]);

  async function submit() {
    try {
      if (!inviteCode) return;

      setLoading(true);
      setError("");

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
          router.push("/school-admin");
          break;

        case "SUPER_ADMIN":
          router.push("/admin");
          break;

        default:
          router.push("/");
      }
    } catch (error: any) {
      console.error(error);

      if (!error?.response) {
        setError("Server unavailable. Please try again later.");
        return;
      }

      setError(error?.response?.data?.detail || "Failed to create account");
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

          {!inviteCode && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
              Registration requires a valid invite code from your school
              administrator.
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.com"
            />
          </div>

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
