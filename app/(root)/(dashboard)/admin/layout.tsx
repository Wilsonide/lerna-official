"use client";

import { useProtectedRoute } from "@/app/hooks/use-protected-route";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useProtectedRoute("SUPER_ADMIN");
  return <>{children}</>;
}
