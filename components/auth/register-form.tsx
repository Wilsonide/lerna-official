"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Join your school on LERNA</p>
          </div>

          {/* INFO */}
          <div className="rounded-lg border bg-blue-50 border-blue-200 p-3 text-sm text-blue-700">
            Username format:{" "}
            <span className="font-semibold">schoolSlug_username</span>
            <br />
            Example: <span className="font-mono">lerna_john</span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* USERNAME */}
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="lerna_john"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@school.com"
            />
          </div>

          {/* PASSWORD WITH TOGGLE */}
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <Button
            onClick={submit}
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
