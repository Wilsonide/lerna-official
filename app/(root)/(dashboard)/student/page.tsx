/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { StudentService } from "@/app/services/student.service";
import { AcademicService } from "@/app/services/academic.service";
import { useAuthStore } from "@/app/store/auth-store";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { AttendanceOverview } from "@/components/dashboard/attendance-overview";
import { StatCard } from "@/components/dashboard/stats-card";

export default function StudentDashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [academic, setAcademic] = useState<any>(null);

  const loading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (loading) return;

    // user not authenticated
    if (!user || !token) return;

    async function loadData() {
      try {
        const [dashboardData, academicData] = await Promise.all([
          StudentService.getDashboard(),
          AcademicService.getActive(),
        ]);

        setDashboard(dashboardData);
        setAcademic(academicData);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      }
    }

    loadData();
  }, [loading, user, token]);

  // show skeleton while auth is initializing
  if (loading) {
    return <DashboardSkeleton />;
  }

  // show skeleton while data loads
  if (!dashboard || !academic) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <DashboardHeader title={`Welcome, ${dashboard.student_name}`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Average Score" value={dashboard.average_score ?? 0} />

        <StatCard title="Class Position" value={dashboard.position ?? "-"} />

        <StatCard
          title="Attendance Rate"
          value={`${dashboard.attendance?.attendance_rate ?? 0}%`}
        />

        <StatCard title="Current Class" value={dashboard.class_name ?? "-"} />
      </div>

      <AttendanceOverview
        present={dashboard.attendance?.present ?? 0}
        absent={dashboard.attendance?.absent ?? 0}
        late={dashboard.attendance?.late ?? 0}
        rate={dashboard.attendance?.attendance_rate ?? 0}
      />
    </div>
  );
}
