"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useClassContext } from "@/components/sidebar/ClassContext";

export default function ClassDashboardPage() {
  const params = useParams();

  const router = useRouter();

  const classId = params.id as string;

  const { setClass } = useClassContext();

  const [dashboard, setDashboard] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassDashboard(classId);

      setDashboard(data);

      setClass({
        id: data.id,
        name: data.name,
        level: data.level,
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class dashboard");
    } finally {
      setLoading(false);
    }
  }, [classId, setClass]);

  useEffect(() => {
    if (!classId) return;

    void Promise.resolve().then(() => loadDashboard());
  }, [classId, loadDashboard]);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8">Class not found</div>;
  }

  return (
    <div className="space-y-8 p-8">
      {/* HEADER */}

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {dashboard.name}
            </h1>

            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {dashboard.level}
              </span>

              <span className="text-muted-foreground">Class Dashboard</span>
            </div>

            <p className="mt-3 text-muted-foreground">
              Overview, attendance, performance and recent activity.
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Students</p>

              <h2 className="text-3xl font-bold">
                {dashboard.students_count ?? 0}
              </h2>
            </div>

            <Users className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Teachers</p>

              <h2 className="text-3xl font-bold">
                {dashboard.teachers_count ?? 0}
              </h2>
            </div>

            <GraduationCap className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>

              <h2 className="text-3xl font-bold">
                {dashboard.subjects_count ?? 0}
              </h2>
            </div>

            <BookOpen className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Attendance</p>

              <h2 className="text-3xl font-bold">
                {dashboard.attendance_rate ?? 0}%
              </h2>
            </div>

            <ClipboardCheck className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {(dashboard.recent_students ?? []).map((student: any) => (
                <div
                  key={student.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {student.first_name} {student.last_name}
                  </span>

                  <span className="text-sm text-muted-foreground">
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
              {(dashboard.recent_teachers ?? []).map((teacher: any) => (
                <div
                  key={teacher.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {teacher.first_name} {teacher.last_name}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {teacher.email}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PERFORMANCE */}

      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <FileBarChart className="h-7 w-7 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Class Average</p>

              <h2 className="text-3xl font-bold">
                {dashboard.average_score ?? 0}%
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
