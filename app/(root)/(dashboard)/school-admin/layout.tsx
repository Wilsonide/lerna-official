"use client";

import { useProtectedRoute } from "@/app/hooks/use-protected-route";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrated } = useProtectedRoute("SCHOOL_ADMIN");

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
