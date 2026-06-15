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

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  already_assigned?: boolean;
};

export default function AssignStudentModal({
  classId,
  onSuccess,
}: {
  classId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getStudents(classId);
      console.log("students=======", data);

      setStudents(data.students || []);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) void Promise.resolve().then(() => load());
  }, [open]);

  async function assign(studentId: string) {
    try {
      await SchoolAdminService.assignStudentToClass(classId, studentId);

      toast.success("Student assigned");

      setOpen(false);

      onSuccess();
    } catch {
      toast.error("Failed to assign student");
    }
  }

  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Student to Class</DialogTitle>
        </DialogHeader>

        {/* SEARCH */}
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading students...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && students.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No students found in this school
          </div>
        )}

        {/* LIST */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border rounded-lg p-2 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {s.first_name} {s.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </div>

                <Button size="sm" onClick={() => assign(s.id)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* NO MATCH */}
        {!loading && filtered.length === 0 && students.length > 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No matching students found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
