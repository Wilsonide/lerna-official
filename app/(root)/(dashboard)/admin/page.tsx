"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = {
  schools: number;
  users: number;
  admins: number;
};

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    schools: 0,
    users: 0,
    admins: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        // You should implement this backend endpoint:
        // GET /admin/stats
        const res = await api.get("/admin/stats");

        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-10 space-y-6 bg-muted/30 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Super Admin Control Center
        </h1>

        <p className="text-muted-foreground">
          Manage schools, users, and platform-wide settings.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SCHOOLS */}
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Schools</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {loading ? "..." : stats.schools}
          </CardContent>
        </Card>

        {/* USERS */}
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {loading ? "..." : stats.users}
          </CardContent>
        </Card>

        {/* ADMINS */}
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>School Admins</CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold">
            {loading ? "..." : stats.admins}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
