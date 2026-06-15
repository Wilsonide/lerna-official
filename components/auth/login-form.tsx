"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

      const r = result.user.role;

      if (!result.user.profile_completed) {
        router.replace("/complete-profile");
        return;
      }

      if (r === "STUDENT") router.replace("/student");
      else if (r === "TEACHER") router.replace("/teacher");
      else if (r === "PARENT") router.replace("/parent");
      else if (r === "SCHOOL_ADMIN") router.replace("/school-admin");
      else router.replace("/admin");
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
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted/30">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8 space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue to LERNA
            </p>
          </div>

          {/* ROLE SELECT (SHADCN STYLE) */}
          <div className="space-y-2">
            <Label>Login as</Label>

            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="PARENT">Parent</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* IDENTIFIER */}
          <div className="space-y-2">
            <Label>{isAdmin ? "Email" : "Username"}</Label>

            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                isAdmin
                  ? "admin@school.com"
                  : "schoolslug_username (e.g lerna_john)"
              }
            />

            {/* ONLY FOR NON-ADMINS */}
            {!isAdmin && (
              <p className="text-xs text-muted-foreground">
                Format: <span className="font-medium">schoolslug_username</span>
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <Button
            onClick={submit}
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* FOOTER */}
          <div className="flex justify-between text-sm">
            <Link href="/forgot-password" className="text-brand-blue">
              Forgot Password?
            </Link>

            <Link href="/register" className="text-muted-foreground">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
