"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { toast } from "sonner";

import { Plus, Trash2, GraduationCap } from "lucide-react";

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

export default function ClassTeachersPage() {
  const params = useParams();
  const [open, setOpen] = useState(false);

  const classId = params.id as string;

  const [teachers, setTeachers] = useState<any[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [assignedRes, schoolTeachersRes] = await Promise.all([
        SchoolAdminService.getClassTeachers(classId),
        SchoolAdminService.getSchoolTeachers(),
      ]);

      const assignedTeachers = Array.isArray(assignedRes?.teachers)
        ? assignedRes.teachers
        : [];

      const schoolTeachers = Array.isArray(schoolTeachersRes?.teachers)
        ? schoolTeachersRes.teachers
        : [];

      setTeachers(assignedTeachers);

      const assignedIds = new Set(
        assignedTeachers.map((teacher: any) => teacher.id),
      );

      setAvailableTeachers(
        schoolTeachers.filter((teacher: any) => !assignedIds.has(teacher.id)),
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load class teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => loadData());
    }
  }, [classId]);

  const assignTeacher = async (teacherId: string) => {
    try {
      await SchoolAdminService.assignTeacherToClass(classId, teacherId);

      toast.success("Teacher assigned successfully");

      await loadData();
      setOpen(false); // close modal
    } catch (error) {
      console.error(error);

      toast.error("Failed to assign teacher");
    }
  };

  const removeTeacher = async (teacherId: string) => {
    try {
      await SchoolAdminService.removeTeacherFromClass(classId, teacherId);

      toast.success("Teacher removed successfully");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to remove teacher");
    }
  };

  if (loading) {
    return <div className="p-8">Loading teachers...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Teachers</h1>

          <p className="text-muted-foreground">Manage assigned teachers</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Available Teachers</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {availableTeachers.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No teachers available
                </p>
              ) : (
                availableTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {teacher.first_name ?? ""} {teacher.last_name ?? ""}
                      </p>

                      <p className="text-muted-foreground text-sm">
                        {teacher.email}
                      </p>
                    </div>

                    <Button size="sm" onClick={() => assignTeacher(teacher.id)}>
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
            <GraduationCap className="h-5 w-5" />
            Assigned Teachers
          </CardTitle>
        </CardHeader>

        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No teachers assigned
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
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-t">
                      <td className="p-3">
                        {(teacher.first_name ?? "") +
                          " " +
                          (teacher.last_name ?? "")}
                      </td>

                      <td className="p-3">{teacher.email}</td>

                      <td className="p-3">
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                          Assigned
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeTeacher(teacher.id)}
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
