"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function LoginButton({ children, redirectTo = "/login" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLoginRedirect = () => {
    setLoading(true);

    router.push(redirectTo);

    setLoading(false);
  };

  return (
    <div onClick={handleLoginRedirect} className="cursor-pointer">
      <div className={loading ? "opacity-60 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
