"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { toast } from "sonner";

import { CalendarCheck, CalendarX, Clock3, TrendingUp } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function StudentAttendancePage() {
  const params = useParams();

  const studentId = params.studentId as string;

  const [loading, setLoading] = useState(true);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);

  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

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
    if (!studentId || !sessionId || !termId) return;

    try {
      setLoading(true);

      const response = await SchoolAdminService.getStudentAttendance(
        studentId,
        sessionId,
        termId,
      );

      setAttendance(response);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  useEffect(() => {
    if (studentId && sessionId && termId) {
      void Promise.resolve().then(() => loadAttendance());
    }
  }, [studentId, sessionId, termId]);

  const present = attendance?.present_days ?? attendance?.present ?? 0;

  const absent = attendance?.absent_days ?? attendance?.absent ?? 0;

  const late = attendance?.late_days ?? attendance?.late ?? 0;

  const percentage =
    attendance?.attendance_percentage ?? attendance?.percentage ?? 0;

  const records = attendance?.records ?? attendance?.attendance ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Student Attendance</h1>

        <p className="text-muted-foreground">
          Attendance history and analytics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Session" />
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
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>

            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Present Days</p>

                  <h2 className="mt-2 text-3xl font-bold">{present}</h2>
                </div>

                <CalendarCheck className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Absent Days</p>

                  <h2 className="mt-2 text-3xl font-bold">{absent}</h2>
                </div>

                <CalendarX className="h-8 w-8 text-red-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Late Days</p>

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

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
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
                        <th className="p-3 text-left">Date</th>

                        <th className="p-3 text-left">Status</th>

                        <th className="p-3 text-left">Note</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record: any, index: number) => (
                        <tr key={record.id || index} className="border-t">
                          <td className="p-3">
                            {record.date || record.attendance_date}
                          </td>

                          <td className="p-3">
                            <span
                              className={`rounded px-2 py-1 text-xs ${
                                record.status === "PRESENT"
                                  ? "bg-green-100 text-green-700"
                                  : record.status === "ABSENT"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>

                          <td className="p-3">{record.note || "-"}</td>
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
