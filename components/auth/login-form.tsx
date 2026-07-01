"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "STUDENT" | "TEACHER" | "PARENT" | "ADMIN";

export default function LoginForm() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("STUDENT");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const result = await AuthService.login(identifier, password);

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

        case "TEACHER":
          router.replace("/teacher");
          break;

        case "PARENT":
          router.replace("/parent");
          break;

        case "SCHOOL_ADMIN":
          router.replace("/school-admin");
          break;

        default:
          router.replace("/admin");
      }
    } catch (error: any) {
      if (!error?.response) {
        setError("Server unavailable. Please try again later.");
        return;
      }

      setError(error?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = role === "ADMIN";

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl lg:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-slate-500">
              Sign in to your school portal.
            </p>
          </div>

          {/* Role */}
          <div className="mb-6 space-y-2">
            <Label>Login As</Label>

            <Select
              value={role}
              onValueChange={(value) => setRole(value as Role)}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="PARENT">Parent</SelectItem>
                <SelectItem value="ADMIN">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Username Hint */}
          {!isAdmin && (
            <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">
                Username Format
              </p>

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
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username / Email */}
            <div className="space-y-2">
              <Label htmlFor="identifier">
                {isAdmin ? "Email Address" : "Username"}
              </Label>

              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  isAdmin ? "admin@school.com" : "schoolslug_username"
                }
                className="h-12 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-brand-blue hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

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

            {/* Login Button */}
            <Button
              onClick={submit}
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-brand-blue text-base font-semibold hover:bg-brand-blue/90"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-sm text-slate-600">Dont have an account?</p>

            <a
              href="https://forms.gle/zGFNu9539FcPUcWB6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-xl bg-brand-blue px-6 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
            >
              Register
            </a>

            <p className="mt-3 text-xs text-slate-500">
              Complete the application form and our team will create your
              school&apos;s portal and send your administrator login details.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
