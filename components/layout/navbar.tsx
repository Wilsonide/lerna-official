"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `text-sm transition ${
      pathname === path
        ? "text-brand-blue font-medium"
        : "text-black/70 hover:text-brand-blue"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Logo Image */}
          <div className="flex items-center justify-center w-14 h-14 shrink-0">
            <Image
              src="/logo.png"
              alt="Lerna Logo"
              width={76}
              height={76}
              className="object-contain"
              priority
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col justify-center leading-none">
            <span className="font-bold text-2xl tracking-wide text-brand-black">
              LERNA
            </span>

            <span className="mt-1 text-[10px] tracking-[0.28em] text-black/50 uppercase">
              Educational Hub
            </span>
          </div>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/pricing" className={linkClass("/pricing")}>
            Packages
          </Link>

          <Link href="#contact" className={linkClass("#contact")}>
            Contact Us
          </Link>
        </nav>

        {/* WhatsApp */}
        <a
          href="https://wa.me/2348068698329"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          Contact Us
        </a>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="px-6 py-6 flex flex-col gap-6">
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className={linkClass("/pricing")}
            >
              Packages
            </Link>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={linkClass("/")}
            >
              Home
            </Link>

            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className={linkClass("#contact")}
            >
              Contact Us
            </Link>

            <a
              href="https://wa.me/2348068698329"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium text-center hover:opacity-90 transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
