/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import { teacherService } from "@/app/services/teacher.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClassItem {
  id: string;
  name: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedClass, setSelectedClass] = useState("");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [statuses, setStatuses] = useState<
    Record<string, "PRESENT" | "ABSENT" | "LATE">
  >({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadClasses = async () => {
    try {
      const data = await teacherService.getClasses();

      setClasses(data.classes || []);
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classId: string) => {
    try {
      const data = await teacherService.getStudents(classId);

      const list = data.students || [];

      setStudents(list);

      const defaultStatus: Record<string, "PRESENT" | "ABSENT" | "LATE"> = {};

      list.forEach((student: Student) => {
        defaultStatus[student.id] = "PRESENT";
      });

      setStatuses(defaultStatus);
    } catch {
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadClasses());
  }, []);

  useEffect(() => {
    if (selectedClass) {
      void Promise.resolve().then(() => loadStudents(selectedClass));
    }
  }, [selectedClass]);

  const updateStatus = (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE",
  ) => {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const presentCount = useMemo(
    () =>
      Object.values(statuses).filter((status) => status === "PRESENT").length,
    [statuses],
  );

  const absentCount = useMemo(
    () =>
      Object.values(statuses).filter((status) => status === "ABSENT").length,
    [statuses],
  );

  const lateCount = useMemo(
    () => Object.values(statuses).filter((status) => status === "LATE").length,
    [statuses],
  );

  const formattedDate = new Date(attendanceDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const submitAttendance = async () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    try {
      setSubmitting(true);

      const response = await teacherService.submitAttendance({
        class_id: selectedClass,
        attendance_date: attendanceDate,
        students: students.map((student) => ({
          student_id: student.id,
          status: statuses[student.id] || "present",
        })),
      });

      toast.success(
        `${response.present_count} Present • ${response.absent_count} Absent • ${response.late_count} Late`,
      );
    } catch (err: any) {
      console.log(err.response?.data);
      toast.error("Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Class Attendance</h1>

        <p className="text-muted-foreground mt-1">
          Record and manage daily student attendance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Setup</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Assigned Class
              </label>

              <select
                className="border-input bg-background w-full rounded-md border px-3 py-2"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>

                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Attendance Date
              </label>

              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {formattedDate}
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Users className="h-8 w-8" />
              <div>
                <p className="text-muted-foreground text-sm">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-muted-foreground text-sm">Present</p>
                <p className="text-2xl font-bold">{presentCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-muted-foreground text-sm">Absent</p>
                <p className="text-2xl font-bold">{absentCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Clock3 className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-muted-foreground text-sm">Late</p>
                <p className="text-2xl font-bold">{lateCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Student Register</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              Select a class to begin attendance marking.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-4 text-left">Student</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Attendance Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-t hover:bg-muted/30"
                      >
                        <td className="p-4 font-medium">
                          {student.first_name} {student.last_name}
                        </td>

                        <td className="p-4 text-muted-foreground">
                          {student.email}
                        </td>

                        <td className="p-4">
                          <select
                            value={statuses[student.id]}
                            onChange={(e) =>
                              updateStatus(
                                student.id,
                                e.target.value as "PRESENT" | "ABSENT" | "LATE",
                              )
                            }
                            className="border-input bg-background rounded-md border px-3 py-2"
                          >
                            <option value="present">✅ Present</option>

                            <option value="absent">❌ Absent</option>

                            <option value="late">⏰ Late</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sticky bottom-0 mt-6 flex justify-end bg-background pt-4">
                <Button
                  size="lg"
                  disabled={submitting}
                  onClick={submitAttendance}
                >
                  {submitting
                    ? "Submitting Attendance..."
                    : "Submit Attendance"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
