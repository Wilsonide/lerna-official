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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg shadow-brand-blue/20">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                LERNA
              </h1>

              <p className="text-xs text-slate-500">School Management System</p>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-4 py-6 sm:min-h-[calc(100vh-80px)] sm:px-6 sm:py-10 lg:px-8">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="grid min-h-[720px] lg:grid-cols-[1.15fr_0.85fr]">
            {/* DESKTOP SHOWCASE */}
            <div className="hidden lg:block">
              <AuthShowcase />
            </div>

            {/* MOBILE HERO */}
            <div className="border-b bg-gradient-to-br from-brand-blue via-brand-blue to-sky-700 px-8 py-10 text-white lg:hidden">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                  <GraduationCap size={34} />
                </div>

                <h2 className="text-3xl font-bold">Welcome to LERNA</h2>

                <p className="mt-4 text-sm leading-7 text-white/80">
                  One platform to manage admissions, attendance, examinations,
                  results, finance, teachers, parents and every aspect of your
                  school administration.
                </p>
              </div>
            </div>

            {/* AUTH CONTENT */}
            <div className="flex items-center justify-center bg-white px-5 py-10 sm:px-10 md:px-14 lg:px-12 xl:px-16">
              <div className="w-full max-w-md">{children}</div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} LERNA School Management System.</p>

          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-brand-blue">
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-brand-blue">
              Terms
            </Link>

            <Link href="/contact" className="transition hover:text-brand-blue">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
