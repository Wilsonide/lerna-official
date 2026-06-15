"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";

export default function ResetPasswordForm() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
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
      <div className="w-full max-w-md space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="border p-3 w-full rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-brand-blue text-white w-full p-3 rounded-md"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
