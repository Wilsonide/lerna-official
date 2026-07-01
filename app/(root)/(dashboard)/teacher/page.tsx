"use client";

import { useEffect, useState } from "react";

import { teacherService } from "@/app/services/teacher.service";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { StatCard } from "@/components/dashboard/stats-card";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeacherClass {
  id: string;
  name: string;
  level: string;
  students_count: number;
  subjects_count: number;
}

interface SubjectAssignment {
  class_name: string;
  subject_name: string;
}

interface TeacherDashboard {
  teacher_name: string;

  assigned_classes: number;
  assigned_subjects: number;

  attendance_submissions: number;
  results_submitted: number;
  lessons_created: number;

  active_session: {
    id: string;
    name: string;
  };

  active_term: {
    id: string;
    name: string;
  };

  classes: TeacherClass[];
  subject_assignments: SubjectAssignment[];
}

export default function TeacherDashboardPage() {
  const [dashboard, setDashboard] = useState<TeacherDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(dashboard);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await teacherService.getDashboard();

      setDashboard(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadDashboard());
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unable to load dashboard</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>

            <button
              onClick={loadDashboard}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6 p-6 md:p-8">
      <DashboardHeader title={`Welcome, ${dashboard.teacher_name}`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assigned Classes" value={dashboard.assigned_classes} />

        <StatCard
          title="Assigned Subjects"
          value={dashboard.assigned_subjects}
        />

        <StatCard
          title="Attendance Submitted"
          value={dashboard.attendance_submissions}
        />

        <StatCard
          title="Results Submitted"
          value={dashboard.results_submitted}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Assignments</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dashboard?.subject_assignments?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No teaching assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                dashboard.subject_assignments.map((assignment, index) => (
                  <TableRow
                    key={`${assignment.class_name}-${assignment.subject_name}-${index}`}
                  >
                    <TableCell>{assignment.class_name}</TableCell>
                    <TableCell>{assignment.subject_name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
