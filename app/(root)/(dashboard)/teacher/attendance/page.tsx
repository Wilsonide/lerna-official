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
  Search,
  CheckCheck,
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
  // ============================================================
  // STATE
  // ============================================================

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedClass, setSelectedClass] = useState("");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [attendanceExists, setAttendanceExists] = useState(false);

  const [statuses, setStatuses] = useState<
    Record<string, AttendanceStatus | undefined>
  >({});

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // LOAD CLASSES
  // ============================================================

  async function loadClasses() {
    try {
      setLoading(true);

      const response = await teacherService.getClasses();

      const classList: ClassItem[] = response ?? [];

      setClasses(classList);

      if (classList.length) {
        setSelectedClass(classList[0].id);
      }
    } catch {
      toast.error("Unable to load your assigned classes.");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // LOAD STUDENTS
  // ============================================================

  async function loadStudents(classId: string) {
    try {
      const response = await teacherService.getStudents(classId);

      const list: Student[] = response ?? [];

      setStudents(list);

      await loadAttendance(classId, attendanceDate, list);
    } catch {
      toast.error("Unable to load students.");
    }
  }

  // ============================================================
  // LOAD ATTENDANCE
  // ============================================================

  async function loadAttendance(
    classId: string,
    date: string,
    studentList: Student[],
  ) {
    // Nothing selected initially
    const initial: Record<string, AttendanceStatus | undefined> = {};

    studentList.forEach((student) => {
      initial[student.id] = undefined;
    });

    try {
      const data = await teacherService.getClassAttendance(classId, date);

      if (data.sheet_id && data.records.length > 0) {
        data.records.forEach((record: any) => {
          initial[record.student_id] = record.status;
        });

        setAttendanceExists(true);
      } else {
        setAttendanceExists(false);
      }

      setStatuses(initial);
    } catch (err: any) {
      console.log(err);
      toast.error("Unable to load attendance.");
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    Promise.resolve().then(() => loadClasses());
  }, []);

  // ============================================================
  // RELOAD WHEN CLASS OR DATE CHANGES
  // ============================================================

  useEffect(() => {
    if (!selectedClass) return;
    Promise.resolve().then(() => loadStudents(selectedClass));
  }, [selectedClass, attendanceDate]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  function updateStatus(studentId: string, status: AttendanceStatus) {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  }

  // ============================================================
  // BULK ACTION
  // ============================================================

  function markAll(status: AttendanceStatus) {
    const next: Record<string, AttendanceStatus> = {};

    students.forEach((student) => {
      next[student.id] = status;
    });

    setStatuses(next);
  }

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      `${student.first_name} ${student.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [students, search]);

  // ============================================================
  // STATISTICS
  // ============================================================

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

  const completed = useMemo(
    () =>
      students.length > 0 && students.every((student) => statuses[student.id]),
    [students, statuses],
  );

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${attendanceDate}T00:00:00`));

  // ============================================================
  // SUBMIT
  // ============================================================

  async function submitAttendance() {
    if (!selectedClass) {
      toast.error("Please select a class.");

      return;
    }

    try {
      setSubmitting(true);

      const existed = attendanceExists;

      const response = await teacherService.submitAttendance({
        class_id: selectedClass,
        attendance_date: attendanceDate,
        students: students.map((student) => ({
          student_id: student.id,
          status: statuses[student.id] ?? "PRESENT",
        })),
      });

      toast.success(
        existed
          ? `Attendance updated • ${response.present_count} Present, ${response.absent_count} Absent, ${response.late_count} Late`
          : `Attendance recorded • ${response.present_count} Present, ${response.absent_count} Absent, ${response.late_count} Late`,
      );

      await loadAttendance(selectedClass, attendanceDate, students);
    } catch (err: any) {
      toast.error(err.response?.data?.detail ?? "Unable to save attendance.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Attendance Workspace
          </h1>

          <p className="mt-2 text-muted-foreground">
            Record and manage daily attendance for your assigned class.
          </p>
        </div>

        {attendanceExists ? (
          <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
            Attendance already recorded for this date
          </div>
        ) : (
          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Ready to take attendance
          </div>
        )}
      </div>

      {/* ============================================================
          SETUP
      ============================================================ */}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Setup</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Assigned Class
              </label>

              <select
                className="w-full rounded-lg border bg-background px-3 py-2"
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

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />

            {formattedDate}
          </div>
        </CardContent>
      </Card>

      {/* ============================================================
          SUMMARY CARDS
      ============================================================ */}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Users className="h-9 w-9 text-blue-600" />

            <div>
              <p className="text-sm text-muted-foreground">Students</p>

              <p className="text-3xl font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <CheckCircle2 className="h-9 w-9 text-green-600" />

            <div>
              <p className="text-sm text-muted-foreground">Present</p>

              <p className="text-3xl font-bold text-green-600">
                {presentCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <XCircle className="h-9 w-9 text-red-600" />

            <div>
              <p className="text-sm text-muted-foreground">Absent</p>

              <p className="text-3xl font-bold text-red-600">{absentCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Clock3 className="h-9 w-9 text-amber-600" />

            <div>
              <p className="text-sm text-muted-foreground">Late</p>

              <p className="text-3xl font-bold text-amber-600">{lateCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================================
          SEARCH & BULK ACTIONS
      ============================================================ */}

      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-10"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => markAll("PRESENT")}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Present
            </Button>

            <Button variant="outline" onClick={() => markAll("ABSENT")}>
              Mark All Absent
            </Button>

            <Button variant="outline" onClick={() => markAll("LATE")}>
              Mark All Late
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================
          ATTENDANCE REGISTER
      ============================================================ */}

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Student Attendance Register</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-4 h-10 w-10 text-muted-foreground" />

              <h3 className="text-lg font-semibold">No students found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing the search or select another class.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="w-20 px-5 py-4 text-left">#</th>

                    <th className="px-5 py-4 text-left">Student</th>

                    <th className="w-[360px] px-5 py-4 text-center">
                      Attendance Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-t hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium">{index + 1}</td>

                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {student.first_name} {student.last_name}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant={
                              statuses[student.id] === "PRESENT"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => updateStatus(student.id, "PRESENT")}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Present
                          </Button>

                          <Button
                            size="sm"
                            variant={
                              statuses[student.id] === "ABSENT"
                                ? "destructive"
                                : "outline"
                            }
                            onClick={() => updateStatus(student.id, "ABSENT")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Absent
                          </Button>

                          <Button
                            size="sm"
                            variant={
                              statuses[student.id] === "LATE"
                                ? "secondary"
                                : "outline"
                            }
                            onClick={() => updateStatus(student.id, "LATE")}
                          >
                            <Clock3 className="mr-2 h-4 w-4" />
                            Late
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============================================================
          STICKY ACTION BAR
      ============================================================ */}

      {students.length > 0 && (
        <div className="sticky bottom-4 z-30">
          <div className="flex items-center justify-between rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div>
              <p className="font-semibold">
                {attendanceExists
                  ? "Attendance already exists"
                  : "Ready to submit"}
              </p>

              <p className="text-sm text-muted-foreground">
                Present {presentCount} • Absent {absentCount} • Late {lateCount}
              </p>
            </div>

            <Button
              size="lg"
              disabled={!completed || submitting}
              onClick={submitAttendance}
            >
              {submitting
                ? attendanceExists
                  ? "Updating..."
                  : "Saving..."
                : attendanceExists
                  ? "Update Attendance"
                  : "Save Attendance"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
