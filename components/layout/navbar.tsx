"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/context/authcontext";
import { UserButton } from "../ui/userbutton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      pathname === path ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-orange border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0 pr-8">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Lerna Logo"
              width={52}
              height={52}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-wide text-white">
              LERNA
            </span>
            <span className="text-[10px] tracking-[0.25em] text-white/60 uppercase mt-1">
              Educational Hub
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/pricing" className={linkClass("/pricing")}>
            Packages
          </Link>
          <Link href="/offers" className={linkClass("/offers")}>
            Services
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            About Us
          </Link>
          <Link href="/blogs" className={linkClass("/blogs")}>
            Blogs
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}
        </nav>

        {/* RIGHT SIDE ACTIONS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* CTA */}
          <a
            href="https://wa.me/2348068698329"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-brand-orange text-sm font-semibold hover:bg-white/90 transition shadow-sm"
          >
            Book Consultation
          </a>

          {/* USER BUTTON */}
          <UserButton />
        </div>

        {/* MOBILE RIGHT SIDE */}
        <div className="md:hidden flex items-center gap-3">
          {/* USER BUTTON (VISIBLE ON MOBILE TOO) */}
          <UserButton />

          {/* HAMBURGER */}
          <button
            className="text-white"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-brand-orange">
          <div className="px-6 py-6 flex flex-col gap-6">
            <Link href="/" onClick={closeMenu} className={linkClass("/")}>
              Home
            </Link>
            <Link
              href="/pricing"
              onClick={closeMenu}
              className={linkClass("/pricing")}
            >
              Packages
            </Link>
            <Link
              href="/offers"
              onClick={closeMenu}
              className={linkClass("/offers")}
            >
              Services
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className={linkClass("/about")}
            >
              About Us
            </Link>
            <Link
              href="/blogs"
              onClick={closeMenu}
              className={linkClass("/blogs")}
            >
              Blogs
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className={linkClass("/admin")}
              >
                Admin Panel
              </Link>
            )}

            {/* CTA (mobile) */}
            <a
              href="https://wa.me/2348068698329"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-brand-orange px-6 py-3 rounded-full text-sm font-semibold text-center hover:opacity-90 transition"
            >
              Book Consultation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
