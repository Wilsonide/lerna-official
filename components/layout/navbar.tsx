"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-bold text-2xl tracking-wide text-brand-black">
            LERNA
          </span>

          <span className="text-xs tracking-[0.3em] text-black/50 uppercase">
            Educational Hub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="#services"
            className="text-sm text-black/70 hover:text-brand-blue transition"
          >
            Services
          </Link>

          <Link
            href="#packages"
            className="text-sm text-black/70 hover:text-brand-blue transition"
          >
            Packages
          </Link>

          <Link
            href="#about"
            className="text-sm text-black/70 hover:text-brand-blue transition"
          >
            About
          </Link>

          <Link
            href="#contact"
            className="text-sm text-black/70 hover:text-brand-blue transition"
          >
            Contact
          </Link>
        </nav>

        <a
          href="https://wa.me/2348068698329"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          WhatsApp Us
        </a>

        <button className="md:hidden">
          <Menu />
        </button>
      </div>
    </header>
  );
}
