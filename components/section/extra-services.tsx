"use client";

import { motion } from "framer-motion";
import ServicePreviewCard from "../ui/service-preview-card";
import { extraServices } from "@/lib/data";

export default function ExtraServices() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">
            Specialist Services
          </p>

          <h2 className="text-5xl font-bold md:text-6xl">
            More Ways We Support Schools
          </h2>

          <p className="mt-6 text-lg leading-8 text-black/60">
            Additional services designed to strengthen your operations,
            visibility, governance, and growth.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {extraServices.map((service) => (
            <ServicePreviewCard
              key={service.id}
              title={service.title}
              image={service.image}
              href={`/offers#${service.id}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
