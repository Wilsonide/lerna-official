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

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceExists, setAttendanceExists] = useState(false);

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    {},
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadClasses = async () => {
    try {
      setLoading(true);

      const data = await teacherService.getClasses();

      const classList: ClassItem[] = data.classes ?? [];

      setClasses(classList);

      if (classList.length > 0) {
        setSelectedClass(classList[0].id);

        // Immediately load the first class
        await loadStudents(classList[0].id);
      } else {
        setStudents([]);
      }
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async (
    classId: string,
    date: string,
    studentList: Student[],
  ) => {
    const defaults: Record<string, AttendanceStatus> = {};

    studentList.forEach((student) => {
      defaults[student.id] = "PRESENT";
    });

    try {
      const data = await teacherService.getClassAttendance(classId, date);

      data.records.forEach((record: any) => {
        defaults[record.student_id] = record.status;
      });

      setStatuses(defaults);
      setAttendanceExists(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setStatuses(defaults);
        setAttendanceExists(false);
        return;
      }

      toast.error("Failed to load attendance.");
    }
  };

  const loadStudents = async (classId: string) => {
    try {
      const data = await teacherService.getStudents(classId);

      const list: Student[] = data.students ?? [];

      setStudents(list);

      await loadAttendance(classId, attendanceDate, list);
    } catch {
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadClasses());
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    if (students.length === 0) return;

    void Promise.resolve().then(() => loadStudents(selectedClass));
  }, [attendanceDate]);

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const presentCount = useMemo(
    () => Object.values(statuses).filter((x) => x === "PRESENT").length,
    [statuses],
  );

  const absentCount = useMemo(
    () => Object.values(statuses).filter((x) => x === "ABSENT").length,
    [statuses],
  );

  const lateCount = useMemo(
    () => Object.values(statuses).filter((x) => x === "LATE").length,
    [statuses],
  );

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${attendanceDate}T00:00:00`));

  const submitAttendance = async () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    try {
      setSubmitting(true);
      const wasExistingAttendance = attendanceExists;

      const response = await teacherService.submitAttendance({
        class_id: selectedClass,
        attendance_date: attendanceDate,
        students: students.map((student) => ({
          student_id: student.id,
          status: statuses[student.id] ?? "PRESENT",
        })),
      });

      toast.success(
        wasExistingAttendance
          ? `Attendance updated • ${response.present_count} Present, ${response.absent_count} Absent, ${response.late_count} Late`
          : `Attendance recorded • ${response.present_count} Present, ${response.absent_count} Absent, ${response.late_count} Late`,
      );

      await loadAttendance(selectedClass, attendanceDate, students);
    } catch (err: any) {
      console.log(err.response?.data);

      toast.error(err.response?.data?.detail ?? "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Class Attendance</h1>

        {attendanceExists ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Attendance already marked for today
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Mark today attendance
          </span>
        )}
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

          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {formattedDate}
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Users className="h-8 w-8 text-blue-600" />

              <div>
                <p className="text-muted-foreground text-sm">Students</p>

                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-8 w-8 text-green-600" />

              <div>
                <p className="text-muted-foreground text-sm">Present</p>

                <p className="text-2xl font-bold text-green-600">
                  {presentCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <XCircle className="h-8 w-8 text-red-600" />

              <div>
                <p className="text-muted-foreground text-sm">Absent</p>

                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Clock3 className="h-8 w-8 text-amber-600" />

              <div>
                <p className="text-muted-foreground text-sm">Late</p>

                <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Register</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              Select a class to begin.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-4 text-left">Student</th>

                      <th className="p-4 text-left">Email</th>

                      <th className="p-4 text-center">Attendance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`border-t ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-medium">
                            {student.first_name} {student.last_name}
                          </div>
                        </td>

                        <td className="p-4 text-muted-foreground">
                          {student.email}
                        </td>

                        <td className="p-4 text-center">
                          <select
                            value={statuses[student.id]}
                            onChange={(e) =>
                              updateStatus(
                                student.id,
                                e.target.value as AttendanceStatus,
                              )
                            }
                            className={`rounded-md border px-3 py-2 font-medium ${
                              statuses[student.id] === "PRESENT"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : statuses[student.id] === "ABSENT"
                                  ? "border-red-300 bg-red-50 text-red-700"
                                  : "border-amber-300 bg-amber-50 text-amber-700"
                            }`}
                          >
                            <option value="PRESENT">✅ Present</option>

                            <option value="ABSENT">❌ Absent</option>

                            <option value="LATE">⏰ Late</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sticky bottom-0 mt-6 flex justify-end border-t bg-background pt-5">
                <Button
                  size="lg"
                  disabled={submitting}
                  onClick={submitAttendance}
                >
                  {submitting
                    ? attendanceExists
                      ? "Updating Attendance..."
                      : "Recording Attendance..."
                    : attendanceExists
                      ? "Update Attendance"
                      : "Mark Attendance"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
