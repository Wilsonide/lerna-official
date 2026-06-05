"use client";

import { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />

      {/* MODAL BOX */}
      <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {children}
      </div>
    </div>
  );
}
