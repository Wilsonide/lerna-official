"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "Student Management",
    icon: Users,
  },
  {
    title: "Attendance Tracking",
    icon: ClipboardCheck,
  },
  {
    title: "Results & Report Cards",
    icon: BarChart3,
  },
  {
    title: "School Finance",
    icon: CreditCard,
  },
  {
    title: "Classes & Subjects",
    icon: BookOpen,
  },
  {
    title: "Secure Cloud Portal",
    icon: ShieldCheck,
  },
];

export default function AuthShowcase() {
  return (
    <div className="relative flex h-full min-h-[650px] overflow-hidden bg-gradient-to-br from-brand-blue via-sky-700 to-cyan-700 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10 flex h-full w-full flex-col p-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <GraduationCap className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">LERNA</h2>

            <p className="text-white/80">Smart School Management Platform</p>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-14"
        >
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            Trusted by Modern Schools
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight">
            Run Your Entire
            <br />
            School Digitally.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
            Simplify admissions, attendance, report cards, finance, CBT
            examinations, communication, staff management and much more from one
            secure cloud platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-brand-blue transition hover:scale-105"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-12 grid grid-cols-2 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition duration-300 hover:scale-[1.03] hover:bg-white/20"
              >
                <div className="rounded-xl bg-white/15 p-3">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-sm font-medium">{feature.title}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-auto"
        >
          <div className="rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Live Dashboard</h3>

                <p className="text-sm text-slate-500">School Performance</p>
              </div>

              <Bell className="text-slate-400" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatCard value="2,500+" label="Students" />

              <StatCard value="180" label="Teachers" />

              <StatCard value="24" label="Classes" />

              <StatCard value="98%" label="Attendance" />
            </div>

            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />

                <span className="font-semibold">System Status</span>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                All services are operational and securely synchronized across
                your school.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4">
      <h4 className="text-2xl font-bold text-brand-blue">{value}</h4>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
