"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  image: string;
  href: string;
};

export default function ServicePreviewCard({ title, image, href }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {
          opacity: 0,
          y: 60,
          scale: 0.94,
          filter: "blur(6px)",
        },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      <Link href={href} className="group block">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
          {/* IMAGE */}
          <div className="relative h-[340px] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={false}
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* TITLE */}
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-3xl font-bold leading-tight text-white">
                {title}
              </h3>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-semibold text-brand-blue">Learn More</span>

            <ArrowRight className="h-5 w-5 text-brand-blue transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
