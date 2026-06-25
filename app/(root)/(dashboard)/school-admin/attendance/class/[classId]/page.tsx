"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { toast } from "sonner";

import { Users, UserX, Clock3, CalendarDays } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Session {
  id: string;
  name: string;
}

interface Term {
  id: string;
  name: string;
}

export default function ClassAttendancePage() {
  const params = useParams();

  const classId = params.classId as string;

  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(true);

  const [sessions, setSessions] = useState<Session[]>([]);

  const [terms, setTerms] = useState<Term[]>([]);

  const [sessionId, setSessionId] = useState("");

  const [termId, setTermId] = useState("");

  const [attendanceDate, setAttendanceDate] = useState(today);

  const [attendance, setAttendance] = useState<any>(null);

  const loadFilters = async () => {
    try {
      const [sessionsRes, termsRes] = await Promise.all([
        SchoolAdminService.getSessions(),
        SchoolAdminService.getTerms(),
      ]);

      const sessionsData = sessionsRes?.sessions || [];

      const termsData = termsRes?.terms || [];

      setSessions(sessionsData);
      setTerms(termsData);

      if (sessionsData.length > 0) {
        setSessionId(sessionsData[0].id);
      }

      if (termsData.length > 0) {
        setTermId(termsData[0].id);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to load filters");
    }
  };

  const loadAttendance = async () => {
    if (!classId || !sessionId || !termId) return;

    try {
      setLoading(true);

      const response = await SchoolAdminService.getClassAttendance(
        classId,
        sessionId,
        termId,
        attendanceDate,
      );

      setAttendance(response);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  useEffect(() => {
    if (classId && sessionId && termId) {
      void Promise.resolve().then(() => loadAttendance());
    }
  }, [classId, sessionId, termId, attendanceDate]);

  const records =
    attendance?.records || attendance?.students || attendance?.attendance || [];

  const presentCount = records.filter(
    (r: any) => r.status === "PRESENT",
  ).length;

  const absentCount = records.filter((r: any) => r.status === "ABSENT").length;

  const lateCount = records.filter((r: any) => r.status === "LATE").length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Class Attendance</h1>

        <p className="text-muted-foreground">
          Daily attendance for class students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Filters</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-4">
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger>
              <SelectValue placeholder="Session" />
            </SelectTrigger>

            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={termId} onValueChange={setTermId}>
            <SelectTrigger>
              <SelectValue placeholder="Term" />
            </SelectTrigger>

            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            Loading attendance...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Present</p>

                  <h2 className="mt-2 text-3xl font-bold">{presentCount}</h2>
                </div>

                <Users className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Absent</p>

                  <h2 className="mt-2 text-3xl font-bold">{absentCount}</h2>
                </div>

                <UserX className="h-8 w-8 text-red-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Late</p>

                  <h2 className="mt-2 text-3xl font-bold">{lateCount}</h2>
                </div>

                <Clock3 className="h-8 w-8 text-yellow-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Date</p>

                  <h2 className="mt-2 text-sm font-semibold">
                    {attendanceDate}
                  </h2>
                </div>

                <CalendarDays className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Attendance</CardTitle>
            </CardHeader>

            <CardContent>
              {records.length === 0 ? (
                <div className="text-muted-foreground py-10 text-center">
                  No attendance records found
                </div>
              ) : (
                <div className="overflow-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left">Student</th>

                        <th className="p-3 text-left">Status</th>

                        <th className="p-3 text-left">Note</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((student: any, index: number) => (
                        <tr key={student.id || index} className="border-t">
                          <td className="p-3">
                            {student.student_name ||
                              student.name ||
                              `${student.first_name || ""} ${student.last_name || ""}`}
                          </td>

                          <td className="p-3">
                            <span
                              className={`rounded px-2 py-1 text-xs ${
                                student.status === "PRESENT"
                                  ? "bg-green-100 text-green-700"
                                  : student.status === "ABSENT"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>

                          <td className="p-3">{student.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
