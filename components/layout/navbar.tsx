"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { UserButton } from "../auth/userbutton";
import { useAuthStore } from "@/app/store/auth-store";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      pathname === path ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-orange border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* ================= LOGO ================= */}
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

        {/* ================= DESKTOP NAV ================= */}
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
          <Link
            href="/schools"
            onClick={closeMenu}
            className={linkClass("/schools")}
          >
            Register School
          </Link>
          {/* ================= ADMIN ACCESS ================= */}

          {user?.role === "SUPER_ADMIN" && (
            <Link
              href="/admin"
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition 
      bg-white text-brand-orange shadow-md hover:scale-105
      after:content-[''] after:absolute after:-right-1 after:-top-1 
      after:w-2 after:h-2 after:bg-green-400 after:rounded-full after:animate-pulse
    `}
            >
              🛠 Super Admin
              <span className="ml-2 text-xs opacity-70">Manage System</span>
            </Link>
          )}
          {user?.role === "SCHOOL_ADMIN" && (
            <Link
              href="/school-admin"
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition 
      bg-white/10 text-white border border-white/20
      hover:bg-white hover:text-brand-orange hover:scale-105
      after:content-[''] after:absolute after:-right-1 after:-top-1 
      after:w-2 after:h-2 after:bg-blue-400 after:rounded-full after:animate-pulse
    `}
            >
              🎓 School Admin
              <span className="ml-2 text-xs opacity-70">Manage School</span>
            </Link>
          )}
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <UserButton />
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden flex items-center gap-3">
          <UserButton />

          <button
            className="text-white"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
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
            <Link
              href="/schools"
              onClick={closeMenu}
              className={linkClass("/schools")}
            >
              Register School
            </Link>

            {user?.role === "SUPER_ADMIN" && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="px-4 py-2 rounded-lg bg-white text-brand-orange font-semibold flex items-center gap-2"
              >
                🛠 Super Admin{" "}
                <span className="text-xs opacity-60">Manage System</span>
              </Link>
            )}

            {user?.role === "SCHOOL_ADMIN" && (
              <Link
                href="/school-admin"
                onClick={closeMenu}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 flex items-center gap-2"
              >
                🎓 School Admin{" "}
                <span className="text-xs opacity-60">Manage School</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
