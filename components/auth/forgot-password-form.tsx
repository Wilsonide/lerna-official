"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AuthService } from "@/app/services/auth.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    try {
      setLoading(true);

      await AuthService.forgotPassword(email);

      setSent(true);

      toast.success("Reset link sent to email");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive reset link
            </p>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.com"
            />
          </div>

          <Button
            onClick={submit}
            disabled={loading || !email}
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {sent && (
            <p className="text-sm text-center text-green-600">
              Check your email for the reset link
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
