"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
  variant?: "ghost" | "default";
};

export function LogoutButton({ children, redirectTo = "/" }: Props) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      await refresh();
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={handleLogout} className="cursor-pointer">
      <div className={loading ? "opacity-60 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
