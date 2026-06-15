"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, UserX } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Button } from "@/components/ui/button";
import AssignStudentModal from "@/components/modal/assign-student-modal";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default function StudentsTab({ classId }: { classId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassStudents(classId);

      setStudents(data.students || []);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [classId]);

  async function remove(studentId: string) {
    try {
      await SchoolAdminService.removeStudentFromClass(classId, studentId);

      toast.success("Student removed");

      load();
    } catch {
      toast.error("Failed to remove student");
    }
  }

  return (
    <div className="space-y-4">
      {/* HEADER ACTION */}
      <div className="flex justify-end">
        <AssignStudentModal classId={classId} onSuccess={load} />
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-500">
          Loading students...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && students.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-gray-50">
          <Users className="h-10 w-10 text-gray-400 mb-3" />

          <h3 className="text-lg font-semibold text-gray-700">
            No students assigned
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            This class doesn’t have any students yet.
          </p>

          <div className="mt-4">
            <AssignStudentModal classId={classId} onSuccess={load} />
          </div>
        </div>
      )}

      {/* STUDENTS LIST */}
      {!loading && students.length > 0 && (
        <div className="space-y-2">
          {students.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition"
            >
              {/* STUDENT INFO */}
              <div>
                <p className="font-medium">
                  {s.first_name} {s.last_name}
                </p>
                <p className="text-sm text-gray-500">{s.email}</p>
              </div>

              {/* ACTION */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => remove(s.id)}
              >
                <UserX className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
