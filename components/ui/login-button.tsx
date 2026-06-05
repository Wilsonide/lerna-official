"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function LoginButton({ children, redirectTo = "/login" }: Props) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLoginRedirect = async () => {
    setLoading(true);

    try {
      // optional: refresh auth before redirect
      await refresh();
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={handleLoginRedirect} className="cursor-pointer">
      <div className={loading ? "opacity-60 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
