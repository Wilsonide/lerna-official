"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { AcademicService } from "@/app/services/academic.service";
import { StudentService } from "@/app/services/student.service";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/app/store/auth-store";

type AttendanceRecord = {
  attendance_date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  note?: string | null;
};

export default function StudentAttendancePage() {
  const isLoadingAuth = useAuthStore((s) => s.isLoading);

  const accessToken = useAuthStore((s) => s.accessToken);
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);

        const active = await AcademicService.getActive();

        if (!active?.session || !active?.term) {
          setRecords([]);
          return;
        }

        const [attendanceData, summaryData] = await Promise.all([
          StudentService.getAttendance(active.session.id, active.term.id),

          StudentService.getAttendanceSummary(
            active.session.id,
            active.term.id,
          ),
        ]);

        console.log("Student attendance response:", attendanceData);

        // Handle all possible response shapes
        let attendanceRecords: AttendanceRecord[] = [];

        if (Array.isArray(attendanceData)) {
          attendanceRecords = attendanceData;
        } else if (attendanceData && Array.isArray(attendanceData.records)) {
          attendanceRecords = attendanceData.records;
        } else if (attendanceData && Array.isArray(attendanceData.data)) {
          attendanceRecords = attendanceData.data;
        }

        setRecords(attendanceRecords);
        setSummary(summaryData || {});
      } catch (error) {
        console.error("Failed to load attendance:", error);

        setRecords([]);
        setSummary({});
      } finally {
        setLoading(false);
      }
    }

    if (isLoadingAuth) return;

    if (!accessToken) return;

    loadAttendance();
  }, [isLoadingAuth, accessToken]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <DashboardHeader title="Attendance" />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Present</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{summary?.present ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Absent</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{summary?.absent ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Late</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{summary?.late ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {summary?.attendance_rate ?? 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!Array.isArray(records) || records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {record?.attendance_date
                        ? new Date(record.attendance_date).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          record.status === "PRESENT"
                            ? "default"
                            : record.status === "LATE"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>

                    <TableCell>{record.note || "-"}</TableCell>
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
