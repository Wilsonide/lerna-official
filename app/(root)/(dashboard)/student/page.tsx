"use client";

import { useAuthStore } from "@/app/store/auth-store";

export default function Page() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      <p>Welcome {user?.email}</p>
    </div>
  );
}
