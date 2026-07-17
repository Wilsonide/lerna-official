"use client";

import { useEffect, useState } from "react";

import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  UserRound,
  ClipboardCheck,
  FileClock,
} from "lucide-react";

import {
  SchoolAdminDashboard,
  SchoolAdminService,
} from "@/app/services/school-admin.service";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { StatCard } from "@/components/dashboard/stats-card";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SchoolAdminDashboardPage() {
  const [dashboard, setDashboard] = useState<SchoolAdminDashboard | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await SchoolAdminService.getDashboard();

        setDashboard(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboard) {
    return <div className="p-10">Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <DashboardHeader
        title={dashboard.school_name}
        subtitle={`${dashboard.active_session?.name ?? "No Session"} • ${
          dashboard.active_term?.name ?? "No Term"
        }`}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Students"
          value={dashboard.overview.students}
          icon={Users}
        />

        <StatCard
          title="Teachers"
          value={dashboard.overview.teachers}
          icon={GraduationCap}
        />

        <StatCard
          title="Classes"
          value={dashboard.overview.classes}
          icon={School}
        />

        <StatCard
          title="Subjects"
          value={dashboard.overview.subjects}
          icon={BookOpen}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Parents"
          value={dashboard.overview.parents}
          icon={UserRound}
        />

        <StatCard
          title="Present Today"
          value={dashboard.attendance.present}
          icon={ClipboardCheck}
        />

        <StatCard
          title="Pending Results"
          value={dashboard.results.pending_batches}
          icon={FileClock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Present</span>
              <span>{dashboard.attendance.present}</span>
            </div>

            <div className="flex justify-between">
              <span>Absent</span>
              <span>{dashboard.attendance.absent}</span>
            </div>

            <div className="flex justify-between">
              <span>Late</span>
              <span>{dashboard.attendance.late}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results Overview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Batches</span>
              <span>{dashboard.results.total_batches}</span>
            </div>

            <div className="flex justify-between">
              <span>Approved</span>
              <span>{dashboard.results.approved_batches}</span>
            </div>

            <div className="flex justify-between">
              <span>Pending</span>
              <span>{dashboard.results.pending_batches}</span>
            </div>

            <div className="flex justify-between">
              <span>Published</span>
              <span>{dashboard.results.published_batches}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {dashboard.recent_students.map((student) => (
                <div
                  key={student.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>{student.name}</span>

                  <span className="text-muted-foreground text-sm">
                    {student.email}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Teachers</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {dashboard.recent_teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>{teacher.name}</span>

                  <span className="text-muted-foreground text-sm">
                    {teacher.email}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
