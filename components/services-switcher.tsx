"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  schoolServices,
  schoolExtraServices,
  individualServices,
  individualExtraServices,
} from "@/lib/data";

import ServicePreviewCard from "./ui/service-preview-card";

type Mode = "schools" | "individuals";

export default function ServicesSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "schools";

    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode");

    return urlMode === "individuals" ? "individuals" : "schools";
  });

  const services = mode === "schools" ? schoolServices : individualServices;

  const extraServices =
    mode === "schools" ? schoolExtraServices : individualExtraServices;

  function switchMode(newMode: Mode) {
    setMode(newMode);

    const params = new URLSearchParams(window.location.search);
    params.set("mode", newMode);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <>
      {/* ================= CORE SERVICES ================= */}
      <section className="bg-[#f8fafc] py-28">
        <div className="mx-auto max-w-7xl px-6">
          {/* HEADER */}
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">
              Core Services
            </p>

            <h2 className="text-5xl font-bold leading-tight md:text-6xl">
              {mode === "schools" ? (
                <>
                  Everything Your{" "}
                  <span className="text-brand-blue">School</span> Needs To Grow
                </>
              ) : (
                <>
                  Everything You Need To{" "}
                  <span className="text-brand-blue">Learn & Grow</span>
                </>
              )}
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/60">
              {mode === "schools"
                ? "Structured systems, staff development, digital visibility, and operational support designed for schools."
                : "Mentorship, career support, scholarships, and skill development designed for individuals."}
            </p>
          </div>

          {/* ================= TOGGLE ================= */}
          <div className="w-full flex justify-center lg:justify-start mt-14">
            <div className="w-full max-w-md lg:max-w-sm">
              <div className="relative grid grid-cols-2 rounded-full bg-slate-100 p-1 shadow-md border border-slate-200">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-brand-blue shadow-lg ${
                    mode === "schools" ? "left-1" : "left-1/2"
                  }`}
                />

                <button
                  onClick={() => switchMode("schools")}
                  className={`relative z-10 py-3 text-sm font-semibold transition ${
                    mode === "schools" ? "text-white" : "text-slate-600"
                  }`}
                >
                  Schools
                </button>

                <button
                  onClick={() => switchMode("individuals")}
                  className={`relative z-10 py-3 text-sm font-semibold transition ${
                    mode === "individuals" ? "text-white" : "text-slate-600"
                  }`}
                >
                  Individuals
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-3 md:hidden">
                Tap to switch services
              </p>
            </div>
          </div>

          {/* ================= CARDS ================= */}
          {mode === "schools" ? (
            <motion.div
              key="schools-core"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16"
            >
              {schoolServices.map((service) => (
                <ServicePreviewCard
                  key={service.id}
                  title={service.title}
                  image={service.image}
                  href={`/${service.id}`}
                />
              ))}
            </motion.div>
          ) : (
            <div className="mt-16 flex flex-col items-center justify-center text-center py-20">
              <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-5 py-2 text-sm font-semibold text-brand-blue">
                Coming Soon
              </div>

              <p className="mt-4 text-black/60 max-w-xl">
                This section will be available soon
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= EXTRA SERVICES ================= */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">
              Specialist Services
            </p>

            <h2 className="text-5xl font-bold md:text-6xl">
              {mode === "schools"
                ? "More Ways We Support Schools"
                : "More Ways We Support Individuals"}
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/60">
              {mode === "schools"
                ? "Advanced solutions to strengthen school operations and growth."
                : "Additional programs designed to accelerate personal and career growth."}
            </p>
          </div>

          {/* ================= EXTRA CARDS ================= */}
          {mode === "schools" ? (
            <motion.div
              key="schools-extra"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-14"
            >
              {schoolExtraServices.map((service) => (
                <ServicePreviewCard
                  key={service.id}
                  title={service.title}
                  image={service.image}
                  href={`/offers?mode=${mode}#${service.id}`}
                />
              ))}
            </motion.div>
          ) : (
            <div className="mt-14 flex flex-col items-center justify-center text-center py-20 border border-black/5 rounded-3xl bg-slate-50">
              <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-5 py-2 text-sm font-semibold text-brand-blue">
                Coming Soon
              </div>

              <p className="mt-3 text-black/60 max-w-lg">
                This section will be available soon
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
