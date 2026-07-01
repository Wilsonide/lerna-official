"use client";

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
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Student Management",
    icon: Users,
  },
  {
    title: "Attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Results & Report Cards",
    icon: BarChart3,
  },
  {
    title: "Finance",
    icon: CreditCard,
  },
  {
    title: "Subjects & Classes",
    icon: BookOpen,
  },
  {
    title: "Secure Portal",
    icon: ShieldCheck,
  },
];

export default function AuthShowcase() {
  return (
    <div className="relative flex h-full overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue to-sky-700 p-10 text-white">
      {/* Background Glow */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
            <GraduationCap size={32} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">LERNA</h2>

            <p className="text-sm text-white/80">School Management System</p>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h1 className="text-5xl font-extrabold leading-tight">
            Everything Your School Needs
            <span className="block text-cyan-200">In One Dashboard</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
            Manage students, teachers, attendance, results, finance, report
            cards, CBT examinations, parent communication and more from one
            secure platform.
          </p>

          <Button className="mt-8 rounded-xl bg-white px-6 py-6 text-brand-blue hover:bg-slate-100">
            Learn More
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-2 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition hover:bg-white/20"
              >
                <div className="rounded-xl bg-white/20 p-2">
                  <Icon size={18} />
                </div>

                <span className="text-sm font-medium">{feature.title}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-auto"
        >
          <div className="rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Dashboard Overview</h3>

              <Bell className="text-slate-500" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatCard value="2,500+" label="Students" />

              <StatCard value="180" label="Teachers" />

              <StatCard value="98%" label="Attendance" />

              <StatCard value="24" label="Classes" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-4">
      <h4 className="text-2xl font-bold text-brand-blue">{value}</h4>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
