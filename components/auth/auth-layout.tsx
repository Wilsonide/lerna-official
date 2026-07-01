"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

import AuthShowcase from "./auth-showcase";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue text-white shadow">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">LERNA</h1>

              <p className="text-sm text-muted-foreground">
                School Management System
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-lg border px-5 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* BODY */}
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-10">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
          {/* LEFT */}
          <div className="hidden lg:block">
            <AuthShowcase />
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-center p-8 md:p-14">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
