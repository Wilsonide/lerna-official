"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { teacherService } from "@/app/services/teacher.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface Subject {
  id: string;
  name: string;
}

export default function TeacherClassDashboardPage() {
  const params = useParams();

  const classId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const loadData = async () => {
    try {
      const [studentsResponse, subjectsResponse] = await Promise.all([
        teacherService.getStudents(classId),
        teacherService.getSubjects(classId),
      ]);

      setStudents(studentsResponse ?? []);

      setSubjects(subjectsResponse ?? []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadData());
    }
  }, [classId]);

  if (loading) {
    return <div className="p-8">Loading class dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Class Dashboard</h1>

        <p className="text-muted-foreground">
          Manage students, attendance, results and subjects.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Students</p>

              <h2 className="mt-2 text-3xl font-bold">{students.length}</h2>
            </div>

            <Users className="h-8 w-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Subjects</p>

              <h2 className="mt-2 text-3xl font-bold">{subjects.length}</h2>
            </div>

            <BookOpen className="h-8 w-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Attendance</p>

              <h2 className="mt-2 text-lg font-bold">Manage</h2>
            </div>

            <ClipboardCheck className="h-8 w-8" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-muted-foreground text-sm">Results</p>

              <h2 className="mt-2 text-lg font-bold">Manage</h2>
            </div>

            <GraduationCap className="h-8 w-8" />
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Mark and review attendance records.
            </p>

            <Button asChild>
              <Link href={`/teacher/attendance?classId=${classId}`}>
                Open Attendance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Submit and review class results.
            </p>

            <Button asChild>
              <Link href={`/teacher/results?classId=${classId}`}>
                Open Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SUBJECTS */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Subjects</CardTitle>
        </CardHeader>

        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-muted-foreground text-center">
              No subjects assigned.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="rounded-lg border px-4 py-2">
                  {subject.name}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* STUDENTS */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <div className="text-muted-foreground text-center">
              No students found.
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Name</th>

                    <th className="p-3 text-left">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t">
                      <td className="p-3">
                        {`${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ||
                          "N/A"}
                      </td>

                      <td className="p-3">{student.email ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
