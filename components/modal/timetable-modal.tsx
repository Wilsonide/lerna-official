/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

export default function TimetableModal({
  classId,
  onSuccess,
}: {
  classId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [subjects, setSubjects] = useState<any[]>([]);

  const [teachers, setTeachers] = useState<any[]>([]);

  const [form, setForm] = useState({
    subject_id: "",
    teacher_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    if (open) {
      SchoolAdminService.getClassSubjects(classId).then((d) =>
        setSubjects(d.subjects || []),
      );

      SchoolAdminService.getClassTeachers(classId).then((d) =>
        setTeachers(d.teachers || []),
      );
    }
  }, [classId, open]);

  async function submit() {
    await SchoolAdminService.createTimetable({
      class_id: classId,
      ...form,
    });

    setOpen(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Timetable</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Timetable Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                subject_id: e.target.value,
              })
            }
          >
            <option>Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                teacher_id: e.target.value,
              })
            }
          >
            <option>Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.first_name} {t.last_name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Day (e.g Monday)"
            onChange={(e) =>
              setForm({
                ...form,
                day_of_week: e.target.value,
              })
            }
          />

          <Input
            placeholder="Start Time (08:00)"
            onChange={(e) =>
              setForm({
                ...form,
                start_time: e.target.value,
              })
            }
          />

          <Input
            placeholder="End Time (09:00)"
            onChange={(e) =>
              setForm({
                ...form,
                end_time: e.target.value,
              })
            }
          />

          <Button className="w-full" onClick={submit}>
            Save Timetable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
