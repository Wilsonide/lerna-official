"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthService } from "@/app/services/auth.service";
import { useAuthStore } from "@/app/store/auth-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function LoginForm() {
  const router = useRouter();

  const [loginType, setLoginType] = useState<"ADMIN" | "SCHOOL_USER">("ADMIN");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

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
        case "SUPER_ADMIN":
          router.replace("/admin");
          break;
        default:
          router.replace("/");
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

  const placeholder =
    loginType === "ADMIN"
      ? "admin@school.com"
      : "schoolslug_username (e.g lerna_john)";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted/30">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8 space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to continue to LERNA
            </p>
          </div>

          {/* LOGIN TYPE SWITCH */}
          <Tabs
            value={loginType}
            onValueChange={(v) => setLoginType(v as "ADMIN" | "SCHOOL_USER")}
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="ADMIN">Admin</TabsTrigger>
              <TabsTrigger value="SCHOOL_USER">School User</TabsTrigger>
            </TabsList>

            <TabsContent value="ADMIN" />
            <TabsContent value="SCHOOL_USER" />
          </Tabs>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* IDENTIFIER */}
          <div className="space-y-2">
            <Label>{loginType === "ADMIN" ? "Email" : "Username"}</Label>

            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={placeholder}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>Password</Label>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* FORMAT HINT */}
          {loginType === "SCHOOL_USER" && (
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              Format: <b>schoolslug_username</b> <br />
              Example: <span className="font-mono">lerna_john</span>
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

          {/* LINKS */}
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
