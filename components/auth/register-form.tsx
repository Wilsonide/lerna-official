"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      if (!username || !email || !password) {
        setError("All fields are required");
        return;
      }

      const result = await AuthService.register(email, password, username);

      setUser(result.user);
      setAccessToken(result.access_token);

      toast.success("Account created successfully");

      if (!result.user.profile_completed) {
        router.replace("/complete-profile");
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

      setError(error?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl lg:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-slate-500">
              Create your school portal account to continue.
            </p>
          </div>

          {/* Username Hint */}
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-700">Username Format</p>

            <p className="mt-1 font-semibold text-blue-900">
              schoolSlug_username
            </p>

            <p className="mt-2 text-sm text-blue-600">
              Example:
              <span className="ml-1 rounded bg-white px-2 py-1 font-mono">
                lerna_john
              </span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="lerna_john"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <Button
              onClick={submit}
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-brand-blue text-base font-semibold hover:bg-brand-blue/90"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t pt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-blue transition hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
