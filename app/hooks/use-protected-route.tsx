"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../store/auth-store";

export function useProtectedRoute(role?: string) {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    // BLOCK UNTIL AUTH IS READY (VERY IMPORTANT)
    if (!hydrated || isLoading) return;

    //  not logged in → redirect immediately
    if (!user) {
      router.replace("/login");
      return;
    }

    // role mismatch → redirect
    if (role && user.role !== role) {
      router.replace("/");
      return;
    }
  }, [hydrated, isLoading, user, role, router]);
}
