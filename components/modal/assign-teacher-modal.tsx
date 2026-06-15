/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

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

type Teacher = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  already_assigned?: boolean;
};

export default function AssignTeacherModal({
  classId,
  onSuccess,
}: {
  classId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getTeachers(classId);

      // backend should ideally return only unassigned teachers
      setTeachers(data.teachers ?? []);
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) void Promise.resolve().then(() => load());
  }, [open]);

  async function assign(teacherId: string) {
    try {
      await SchoolAdminService.assignTeacherToClass(classId, teacherId);

      toast.success("Teacher assigned");

      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to assign teacher");
    }
  }

  const filtered = teachers.filter((t) =>
    `${t.first_name} ${t.last_name} ${t.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Teacher to Class</DialogTitle>
        </DialogHeader>

        {/* SEARCH */}
        <Input
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading teachers...
          </div>
        )}

        {/* EMPTY */}
        {!loading && teachers.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No teachers found in this school
          </div>
        )}

        {/* LIST */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border rounded-lg p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {t.first_name} {t.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{t.email}</p>
                </div>

                <Button size="sm" onClick={() => assign(t.id)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* NO MATCH */}
        {!loading && filtered.length === 0 && teachers.length > 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No matching teachers found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
