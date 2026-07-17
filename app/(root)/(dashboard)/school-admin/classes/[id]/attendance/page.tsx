"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  TrendingUp,
  Loader2,
} from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClassAttendancePage() {
  const params = useParams();

  const classId = params.id as string;

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  async function loadAttendance() {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getClassAttendance(
        classId,
        date,
      );

      setDashboard(response);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class attendance.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadAttendance());
    }
  }, [classId]);
  const totalStudents = dashboard?.total_students ?? 0;

  const present = dashboard?.present_count ?? 0;

  const absent = dashboard?.absent_count ?? 0;

  const late = dashboard?.late_count ?? 0;

  const attendanceRate =
    totalStudents > 0
      ? (((present + late) / totalStudents) * 100).toFixed(1)
      : "0";

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {dashboard?.class_name ?? "Class Attendance"}
          </h1>

          <p className="mt-1 text-muted-foreground">
            Daily attendance summary for this class
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button onClick={loadAttendance}>Load</Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading attendance...
          </CardContent>
        </Card>
      ) : (
        <>
          {/* SUMMARY */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">{totalStudents}</h2>
                </div>

                <Users className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>

                  <h2 className="mt-2 text-3xl font-bold">{present}</h2>
                </div>

                <UserCheck className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>

                  <h2 className="mt-2 text-3xl font-bold">{absent}</h2>
                </div>

                <UserX className="h-8 w-8 text-red-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>

                  <h2 className="mt-2 text-3xl font-bold">{late}</h2>
                </div>

                <Clock3 className="h-8 w-8 text-yellow-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Attendance Rate
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">{attendanceRate}%</h2>
                </div>

                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </CardContent>
            </Card>
          </div>
          {/* STUDENT ATTENDANCE */}

          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
            </CardHeader>

            <CardContent>
              {dashboard?.records?.length ? (
                <div className="overflow-hidden rounded-xl border">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="px-4 py-3">Student</th>

                        <th className="px-4 py-3 text-center">Status</th>

                        <th className="px-4 py-3">Note</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboard.records.map((record: any) => (
                        <tr
                          key={record.student_id}
                          className="border-t hover:bg-muted/40"
                        >
                          <td className="px-4 py-3 font-medium">
                            {record.student_name}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                record.status === "PRESENT"
                                  ? "bg-green-100 text-green-700"
                                  : record.status === "LATE"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>

                          <td className="px-4 py-3">{record.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  No attendance records found for this date.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
