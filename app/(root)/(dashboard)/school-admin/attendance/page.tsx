"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { Users, UserX, Clock3, TrendingUp, BarChart3 } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

export default function AttendanceDashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getAttendanceDashboard(date);

      setDashboard(response);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load attendance dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadDashboard());
  }, []);

  const present = dashboard?.present ?? dashboard?.attendance?.present ?? 0;

  const absent = dashboard?.absent ?? dashboard?.attendance?.absent ?? 0;

  const late = dashboard?.late ?? dashboard?.attendance?.late ?? 0;

  const total = present + absent + late;

  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Dashboard</h1>

          <p className="text-muted-foreground">Daily attendance overview</p>
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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Present</p>

                  <h2 className="mt-2 text-3xl font-bold">{present}</h2>
                </div>

                <Users className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Absent</p>

                  <h2 className="mt-2 text-3xl font-bold">{absent}</h2>
                </div>

                <UserX className="h-8 w-8 text-red-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Late</p>

                  <h2 className="mt-2 text-3xl font-bold">{late}</h2>
                </div>

                <Clock3 className="h-8 w-8 text-yellow-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Attendance %</p>

                  <h2 className="mt-2 text-3xl font-bold">{percentage}%</h2>
                </div>

                <TrendingUp className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Class Attendance Ranking</CardTitle>
              </CardHeader>

              <CardContent>
                {dashboard?.class_rankings?.length ? (
                  <div className="overflow-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left">Class</th>

                          <th className="p-3 text-left">Present</th>

                          <th className="p-3 text-left">Absent</th>

                          <th className="p-3 text-left">%</th>
                        </tr>
                      </thead>

                      <tbody>
                        {dashboard.class_rankings.map(
                          (row: any, index: number) => (
                            <tr
                              key={row.class_id || index}
                              className="border-t"
                            >
                              <td className="p-3">{row.class_name}</td>

                              <td className="p-3">{row.present}</td>

                              <td className="p-3">{row.absent}</td>

                              <td className="p-3">
                                {row.attendance_percentage}%
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted-foreground py-10 text-center">
                    No ranking data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Link href="/school-admin/attendance/analytics">
                  <Button className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Attendance Analytics
                  </Button>
                </Link>

                <Link href="/school-admin/classes">
                  <Button variant="outline" className="w-full justify-start">
                    Class Attendance
                  </Button>
                </Link>

                <Link href="/school-admin/students">
                  <Button variant="outline" className="w-full justify-start">
                    Student Attendance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
