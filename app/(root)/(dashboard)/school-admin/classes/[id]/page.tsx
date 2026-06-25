"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
} from "lucide-react";

import { toast } from "sonner";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function ClassDashboardPage() {
  const params = useParams();

  const classId = params.id as string;

  const [dashboard, setDashboard] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await SchoolAdminService.getClassDashboard(classId);

      setDashboard(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadDashboard());
    }
  }, [classId]);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8">Class not found</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">{dashboard.name}</h1>

        <p className="text-muted-foreground">{dashboard.level}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Students</p>

              <h2 className="text-3xl font-bold">
                {dashboard.students_count ?? 0}
              </h2>
            </div>

            <Users className="h-8 w-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Teachers</p>

              <h2 className="text-3xl font-bold">
                {dashboard.teachers_count ?? 0}
              </h2>
            </div>

            <GraduationCap className="h-8 w-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Subjects</p>

              <h2 className="text-3xl font-bold">
                {dashboard.subjects_count ?? 0}
              </h2>
            </div>

            <BookOpen className="h-8 w-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Attendance</p>

              <h2 className="text-3xl font-bold">
                {dashboard.attendance_rate ?? 0}%
              </h2>
            </div>

            <ClipboardCheck className="h-8 w-8" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Button asChild>
          <Link href={`/school-admin/classes/${classId}/students`}>
            <Users className="mr-2 h-4 w-4" />
            Students
          </Link>
        </Button>

        <Button asChild>
          <Link href={`/school-admin/classes/${classId}/teachers`}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Teachers
          </Link>
        </Button>

        <Button asChild>
          <Link href={`/school-admin/classes/${classId}/subjects`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Subjects
          </Link>
        </Button>
      </div>

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
              {(dashboard.recent_teachers ?? []).map((teacher: any) => (
                <div
                  key={teacher.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {teacher.first_name} {teacher.last_name}
                  </span>

                  <span className="text-muted-foreground text-sm">
                    {teacher.email}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <FileBarChart className="h-10 w-10" />

            <div>
              <p className="text-muted-foreground">Class Average</p>

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
