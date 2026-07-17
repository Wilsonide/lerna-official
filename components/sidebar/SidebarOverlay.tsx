"use client";

interface SidebarOverlayProps {
  mobileOpen: boolean;

  closeMobile: () => void;
}

export default function SidebarOverlay({
  mobileOpen,
  closeMobile,
}: SidebarOverlayProps) {
  if (!mobileOpen) return null;

  return (
    <div
      onClick={closeMobile}
      className="
      fixed
      inset-0
      z-30
      bg-black/40
      backdrop-blur-[2px]
      md:hidden
    "
    />
  );
}
