"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, UserX, Clock3, TrendingUp, CalendarDays } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AttendanceDashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getAttendanceDashboard(date);

      setDashboard(response);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load attendance dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadDashboard());
  }, []);

  const present = dashboard?.present ?? 0;
  const absent = dashboard?.absent ?? 0;
  const late = dashboard?.late ?? 0;

  const totalStudents = dashboard?.total_students ?? 0;

  const attendanceRate = dashboard?.attendance_rate ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Dashboard</h1>

          <p className="mt-1 text-muted-foreground">
            School attendance overview
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button onClick={loadDashboard}>Load</Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
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
                  <p className="text-sm text-muted-foreground">Students</p>

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

                <Users className="h-8 w-8 text-green-600" />
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
                  <p className="text-sm text-muted-foreground">Attendance</p>

                  <h2 className="mt-2 text-3xl font-bold">{attendanceRate}%</h2>
                </div>

                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </CardContent>
            </Card>
          </div>

          {/* CLASS RANKINGS */}

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CalendarDays className="h-5 w-5" />

              <CardTitle>Class Attendance Ranking</CardTitle>
            </CardHeader>

            <CardContent>
              {dashboard?.class_rankings?.length ? (
                <div className="overflow-hidden rounded-xl border">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="px-4 py-3">#</th>

                        <th className="px-4 py-3">Class</th>

                        <th className="px-4 py-3 text-center">Present</th>

                        <th className="px-4 py-3 text-center">Absent</th>

                        <th className="px-4 py-3 text-center">Late</th>

                        <th className="px-4 py-3 text-center">%</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboard.class_rankings.map(
                        (row: any, index: number) => (
                          <tr
                            key={row.class_id}
                            className="border-t hover:bg-muted/40"
                          >
                            <td className="px-4 py-3 font-semibold">
                              {index + 1}
                            </td>

                            <td className="px-4 py-3">{row.class_name}</td>

                            <td className="px-4 py-3 text-center">
                              {row.present}
                            </td>

                            <td className="px-4 py-3 text-center">
                              {row.absent}
                            </td>

                            <td className="px-4 py-3 text-center">
                              {row.late}
                            </td>

                            <td className="px-4 py-3 text-center font-semibold">
                              {row.attendance_percentage}%
                            </td>
                          </tr>
                        ),
                      )}
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
