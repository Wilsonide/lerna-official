"use client";

import { Menu, X } from "lucide-react";

interface SidebarMobileToggleProps {
  mobileOpen: boolean;

  toggleMobile: () => void;
}

export default function SidebarMobileToggle({
  mobileOpen,
  toggleMobile,
}: SidebarMobileToggleProps) {
  return (
    <div className="fixed left-4 top-[88px] z-40 md:hidden">
      <button
        onClick={toggleMobile}
        className="
        rounded-xl
        border
        bg-white
        p-2.5
        shadow-lg
        transition
        hover:bg-gray-100
      "
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </div>
  );
}
