"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";

import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setError("");

      if (!token) {
        setError("Invalid password reset link.");
        return;
      }

      if (!password) {
        setError("Please enter a new password.");
        return;
      }

      setLoading(true);

      await AuthService.resetPassword(token, password);

      toast.success("Password reset successfully");

      router.replace("/login");
    } catch {
      setError("Invalid or expired password reset link.");
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
              Reset Password
            </h1>

            <p className="mt-2 text-slate-500">
              Enter a new password for your account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Submit */}
            <Button
              onClick={submit}
              disabled={loading || !token}
              className="mt-2 h-12 w-full rounded-xl bg-brand-blue text-base font-semibold hover:bg-brand-blue/90"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t pt-6 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-blue transition hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
