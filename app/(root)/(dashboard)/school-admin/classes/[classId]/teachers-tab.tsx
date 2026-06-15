/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Button } from "@/components/ui/button";
import AssignTeacherModal from "@/components/modal/assign-teacher-modal";

export default function TeachersTab({ classId }: { classId: string }) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassTeachers(classId);
      setTeachers(data.teachers ?? []);
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [classId]);

  async function remove(teacherId: string) {
    try {
      await SchoolAdminService.removeTeacherFromClass(classId, teacherId);

      toast.success("Teacher removed");

      load();
    } catch {
      toast.error("Failed to remove teacher");
    }
  }

  return (
    <div className="space-y-4">
      {/* HEADER ACTION */}
      <div className="flex justify-between items-center">
        <AssignTeacherModal classId={classId} onSuccess={load} />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading teachers...
        </div>
      ) : teachers.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          No teachers assigned to this class yet
        </div>
      ) : (
        <div className="space-y-2">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="flex justify-between border p-3 rounded-lg hover:bg-muted/40 transition"
            >
              <div>
                <p className="font-medium">
                  {t.first_name} {t.last_name}
                </p>
                <p className="text-sm text-gray-500">{t.email}</p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => remove(t.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
