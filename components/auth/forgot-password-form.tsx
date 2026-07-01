"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";

import AuthLayout from "./auth-layout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setError("");

      if (!email) {
        setError("Please enter your email address.");
        return;
      }

      setLoading(true);

      await AuthService.forgotPassword(email);

      setSent(true);

      toast.success("Password reset link sent successfully.");
    } catch {
      setError("Unable to send reset link. Please try again.");

      toast.error("Something went wrong");
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
              Forgot Password
            </h1>

            <p className="mt-2 text-slate-500">
              Enter your email address and we&apos;ll send you a password reset
              link.
            </p>
          </div>

          {/* Success */}
          {sent && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Password reset instructions have been sent to your email. Please
              check your inbox.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@school.com"
                className="h-12 rounded-xl"
              />
            </div>

            {/* Button */}
            <Button
              onClick={submit}
              disabled={loading || !email}
              className="mt-2 h-12 w-full rounded-xl bg-brand-blue text-base font-semibold hover:bg-brand-blue/90"
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
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
