"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      if (!token) {
        toast.error("Invalid reset link");
        return;
      }

      setLoading(true);

      await AuthService.resetPassword(token, password);

      toast.success("Password reset successful");

      router.push("/login");
    } catch {
      toast.error("Invalid or expired token");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-brand-blue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={loading || !token}
            className="w-full rounded-lg bg-brand-blue p-3 text-white transition hover:bg-brand-blue/90 disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
