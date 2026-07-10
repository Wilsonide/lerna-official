"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { Pencil, Search, Copy, KeyRound } from "lucide-react";

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

  username: string;
  password: string;

  is_active?: boolean;
  profile_completed?: boolean;
  created_at?: string;
}

type Props = {
  onSuccess: (username: string, password: string) => void;
};

export default function TeachersPage({ onSuccess }: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");

  async function loadTeachers() {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getSchoolTeachers();

      setTeachers(Array.isArray(response?.teachers) ? response.teachers : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadTeachers());
  }, []);

  const filteredTeachers = useMemo(() => {
    const term = search.toLowerCase();

    return teachers.filter((teacher) => {
      const fullName = `${teacher.first_name ?? ""} ${
        teacher.last_name ?? ""
      }`.toLowerCase();

      return (
        fullName.includes(term) ||
        teacher.email.toLowerCase().includes(term) ||
        teacher.username.toLowerCase().includes(term)
      );
    });
  }, [teachers, search]);

  function openEdit(teacher: Teacher) {
    setSelectedTeacher(teacher);

    setFirstName(teacher.first_name ?? "");
    setLastName(teacher.last_name ?? "");
    setEmail(teacher.email ?? "");
    setQualification(teacher.qualification ?? "");

    setEditOpen(true);
  }

  async function saveTeacher() {
    if (!selectedTeacher) return;

    try {
      await SchoolAdminService.updateTeacher(selectedTeacher.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        qualification: qualification || null,
      });

      toast.success("Teacher updated.");

      await loadTeachers();

      setEditOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update teacher.");
    }
  }

  async function copyCredentials(teacher: Teacher) {
    await navigator.clipboard.writeText(
      `Username: ${teacher.username}\nPassword: ${teacher.password}`,
    );

    toast.success("Credentials copied.");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Teachers</h1>

        <p className="text-muted-foreground">
          Manage teachers and access their login credentials.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Directory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-10"
              placeholder="Search by name, email or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading teachers...</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No teachers found.
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Name</th>

                    <th className="p-3 text-left">Email</th>

                    <th className="p-3 text-left">Username</th>

                    <th className="p-3 text-left">Password</th>

                    <th className="p-3 text-left">Qualification</th>

                    <th className="p-3 text-left">Status</th>

                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTeachers.map((teacher) => {
                    const fullName =
                      `${teacher.first_name ?? ""} ${
                        teacher.last_name ?? ""
                      }`.trim() || "No Name";

                    return (
                      <tr key={teacher.id} className="border-t">
                        <td className="p-3 font-medium">{fullName}</td>

                        <td className="p-3">{teacher.email}</td>

                        <td className="p-3 font-mono">{teacher.username}</td>

                        <td className="p-3 font-mono">
                          <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                            {teacher.password}
                          </div>
                        </td>

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
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyCredentials(teacher)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </Button>

                            <Dialog
                              open={
                                editOpen && selectedTeacher?.id === teacher.id
                              }
                              onOpenChange={(open) => {
                                setEditOpen(open);

                                if (!open) {
                                  setSelectedTeacher(null);
                                }
                              }}
                            >
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

                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Teacher</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-5">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                      placeholder="First Name"
                                      value={firstName}
                                      onChange={(e) =>
                                        setFirstName(e.target.value)
                                      }
                                    />

                                    <Input
                                      placeholder="Last Name"
                                      value={lastName}
                                      onChange={(e) =>
                                        setLastName(e.target.value)
                                      }
                                    />
                                  </div>

                                  <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />

                                  <Input
                                    placeholder="Qualification"
                                    value={qualification}
                                    onChange={(e) =>
                                      setQualification(e.target.value)
                                    }
                                  />

                                  <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                                    <h4 className="font-medium">
                                      Login Credentials
                                    </h4>

                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Username
                                      </p>

                                      <p className="font-mono font-semibold">
                                        {selectedTeacher?.username}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Password
                                      </p>

                                      <p className="font-mono font-semibold">
                                        {selectedTeacher?.password}
                                      </p>
                                    </div>

                                    <Button
                                      className="w-full"
                                      variant="secondary"
                                      onClick={() => {
                                        if (selectedTeacher) {
                                          copyCredentials(selectedTeacher);
                                        }
                                      }}
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Login Credentials
                                    </Button>
                                  </div>

                                  <Button
                                    className="w-full"
                                    onClick={saveTeacher}
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
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
