"use client";

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { Pencil, Search } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Teacher {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;

  qualification?: string | null;

  is_active?: boolean;
  profile_completed?: boolean;

  created_at?: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");

  const loadTeachers = async () => {
    try {
      const response = await SchoolAdminService.getSchoolTeachers();

      setTeachers(
        Array.isArray(response?.teachers)
          ? response.teachers
          : Array.isArray(response)
            ? response
            : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadTeachers());
  }, []);

  const filteredTeachers = useMemo(() => {
    const term = search.toLowerCase();

    return teachers.filter((teacher) => {
      const firstName = teacher.first_name ?? "";
      const lastName = teacher.last_name ?? "";

      const fullName = `${firstName} ${lastName}`.trim();

      return (
        fullName.toLowerCase().includes(term) ||
        teacher.email?.toLowerCase().includes(term)
      );
    });
  }, [teachers, search]);

  const openEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);

    setFirstName(teacher.first_name ?? "");
    setLastName(teacher.last_name ?? "");
    setEmail(teacher.email ?? "");
    setQualification(teacher.qualification ?? "");
    setEditOpen(true);
  };

  const saveTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      await SchoolAdminService.updateTeacher(selectedTeacher.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        qualification: qualification || null,
      });

      toast.success("Teacher updated");

      await loadTeachers();

      setSelectedTeacher(null);
      setEditOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update teacher");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Teachers</h1>

        <p className="text-muted-foreground">
          Manage all teachers in your school
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Directory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />

            <Input
              value={search}
              placeholder="Search teachers..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading teachers...</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No teachers found
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Qualification</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeachers.map((teacher) => {
                    const fullName =
                      `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim() ||
                      "No Name";

                    return (
                      <tr key={teacher.id} className="border-t">
                        <td className="p-3">{fullName}</td>

                        <td className="p-3">{teacher.email}</td>

                        <td className="p-3">{teacher.qualification || "-"}</td>

                        <td className="p-3">
                          {teacher.is_active ? (
                            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEdit(teacher)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Teacher</DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4">
                                <Input
                                  value={firstName}
                                  placeholder="First Name"
                                  onChange={(e) => setFirstName(e.target.value)}
                                />

                                <Input
                                  value={lastName}
                                  placeholder="Last Name"
                                  onChange={(e) => setLastName(e.target.value)}
                                />

                                <Input
                                  value={email}
                                  placeholder="Email"
                                  onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                  value={qualification}
                                  placeholder="Qualification"
                                  onChange={(e) =>
                                    setQualification(e.target.value)
                                  }
                                />

                                <Button
                                  className="w-full"
                                  onClick={saveTeacher}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
