/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const result = await AuthService.login(email, password);

      useAuthStore.setState({
        user: result.user,
        accessToken: result.access_token,
      });

      if (!result.user.profile_completed) {
        router.replace("/complete-profile");
        return;
      }

      switch (result.user.role) {
        case "STUDENT":
          router.replace("/student");
          break;

        case "SUPER_ADMIN":
          router.replace("/admin");
          break;

        case "SCHOOL_ADMIN":
          router.replace("/school-admin");
          break;

        case "TEACHER":
          router.replace("/teacher");
          break;

        case "PARENT":
          router.replace("/parent");
          break;

        default:
          router.replace("/");
      }
    } catch (error: any) {
      if (!error?.response) {
        setError("Server unavailable. Please try again later.");
        return;
      }

      setError(error?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted/30">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>

            <p className="text-muted-foreground">
              Sign in to continue to LERNA
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>

            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-brand-blue hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            onClick={submit}
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
