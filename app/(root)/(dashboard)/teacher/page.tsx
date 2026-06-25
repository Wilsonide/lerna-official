/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function TeacherDashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    teacherService.getDashboard().then(setDashboard).catch(console.error);
  }, []);

  if (!dashboard) {
    return <DashboardSkeleton />;
  }

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
              {dashboard.assignments?.length ? (
                dashboard.assignments.map((assignment: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{assignment.class_name}</TableCell>

                    <TableCell>{assignment.subject_name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No assignments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
