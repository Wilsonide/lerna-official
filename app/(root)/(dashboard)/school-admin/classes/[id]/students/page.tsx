"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { toast } from "sonner";

import { Plus, Trash2, Users } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ClassStudentsPage() {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const classId = params.id as string;

  const [students, setStudents] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [studentsRes, availableRes] = await Promise.all([
        SchoolAdminService.getClassStudents(classId),
        SchoolAdminService.getAvailableStudents(classId),
      ]);

      setStudents(
        Array.isArray(studentsRes?.students) ? studentsRes.students : [],
      );

      setAvailableStudents(
        Array.isArray(availableRes?.students) ? availableRes.students : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadData());
    }
  }, [classId]);

  const assignStudent = async (studentId: string) => {
    try {
      await SchoolAdminService.assignStudentToClass(classId, studentId);

      toast.success("Student assigned successfully");

      await loadData();
      setOpen(false); // close modal
    } catch (error) {
      console.error(error);

      toast.error("Failed to assign student");
    }
  };

  const removeStudent = async (studentId: string) => {
    try {
      await SchoolAdminService.removeStudentFromClass(classId, studentId);

      toast.success("Student removed successfully");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to remove student");
    }
  };

  if (loading) {
    return <div className="p-8">Loading students...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Students</h1>

          <p className="text-muted-foreground">Manage enrolled students</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Available Students</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {availableStudents.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No students available
                </p>
              ) : (
                availableStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {student.first_name ?? ""} {student.last_name ?? ""}
                      </p>

                      <p className="text-muted-foreground text-sm">
                        {student.email}
                      </p>
                    </div>

                    <Button size="sm" onClick={() => assignStudent(student.id)}>
                      Assign
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrolled Students
          </CardTitle>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No students assigned
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Name</th>

                    <th className="p-3 text-left">Email</th>

                    <th className="p-3 text-left">Status</th>

                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t">
                      <td className="p-3">
                        {(student.first_name ?? "") +
                          " " +
                          (student.last_name ?? "")}
                      </td>

                      <td className="p-3">{student.email}</td>

                      <td className="p-3">
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                          Assigned
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeStudent(student.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </td>
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
