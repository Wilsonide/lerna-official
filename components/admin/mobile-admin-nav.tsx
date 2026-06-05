"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, FileText, PlusCircle } from "lucide-react";

export default function MobileAdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      href: "/admin/blogs",
      label: "Blogs",
      icon: <FileText size={18} />,
    },
    {
      href: "/admin/blogs/create",
      label: "Create Blog",
      icon: <PlusCircle size={18} />,
    },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b px-4 h-16 flex items-center justify-between">
        <h1 className="font-semibold">Admin Panel</h1>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Admin Panel</h2>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)} // ← auto collapse
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  active
                    ? "bg-brand-blue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
