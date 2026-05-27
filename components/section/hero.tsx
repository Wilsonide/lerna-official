"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="uppercase tracking-[0.3em] text-sm text-brand-blue font-semibold mb-6">
            Keeping Learners Learning
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-brand-black">
            Helping Schools
            <span className="text-brand-blue"> Grow, Lead </span>& Never Look
            Back.
          </h1>

          <p className="mt-8 text-lg text-black/60 leading-8 max-w-xl">
            Modern educational systems, staff development, branding, and
            academic support designed for schools that want sustainable growth.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* Primary CTA */}
            <button className="relative inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-brand-blue bg-white shadow-sm border border-black/5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95">
              Explore Services
              {/* subtle glow */}
              <span className="absolute inset-0 bg-brand-blue/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Secondary CTA (Bookstore) */}
            <a
              href="https://bookstore.lerna.education"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-white bg-brand-blue shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Visit our Bookstore
              </span>

              {/* hover sheen effect */}
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-brand-blue text-white rounded-3xl p-6">
                <p className="text-sm opacity-80">Schools Supported</p>

                <h3 className="text-4xl font-bold mt-4">120+</h3>
              </div>

              <div className="bg-brand-orange text-white rounded-3xl p-6">
                <p className="text-sm opacity-80">Teachers Trained</p>

                <h3 className="text-4xl font-bold mt-4">500+</h3>
              </div>

              <div className="col-span-2 border border-black/5 rounded-3xl p-8">
                <p className="text-black/50 text-sm mb-4">
                  Academic Excellence
                </p>

                <div className="w-full h-4 bg-black/5 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-brand-blue rounded-full" />
                </div>

                <p className="mt-4 text-black/60 leading-7">
                  Structured systems that improve school operations, teaching
                  consistency, and parent confidence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
