"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { Search, Pencil, Copy, KeyRound } from "lucide-react";

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

interface Student {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;

  username: string;
  password: string;

  is_active?: boolean;
  profile_completed?: boolean;
  created_at?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function loadStudents() {
    try {
      setLoading(true);

      const response = await SchoolAdminService.getSchoolStudents();

      setStudents(Array.isArray(response?.students) ? response.students : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadStudents());
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();

    return students.filter((student) => {
      const fullName = `${student.first_name ?? ""} ${
        student.last_name ?? ""
      }`.toLowerCase();

      return (
        fullName.includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.username.toLowerCase().includes(term)
      );
    });
  }, [students, search]);

  function openEdit(student: Student) {
    setSelectedStudent(student);

    setFirstName(student.first_name ?? "");
    setLastName(student.last_name ?? "");
    setEmail(student.email ?? "");
  }

  async function saveStudent() {
    if (!selectedStudent) return;

    try {
      await SchoolAdminService.updateStudent(selectedStudent.id, {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      toast.success("Student updated.");

      await loadStudents();

      setSelectedStudent(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update student.");
    }
  }

  async function copyCredentials(student: Student) {
    await navigator.clipboard.writeText(
      `Username: ${student.username}\nPassword: ${student.password}`,
    );

    toast.success("Credentials copied.");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>

        <p className="text-muted-foreground">
          Manage students and access their login credentials.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
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
            <div className="py-10 text-center">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No students found.
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

                    <th className="p-3 text-left">Status</th>

                    <th className="p-3 text-left">Created</th>

                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => {
                    const fullName =
                      `${student.first_name ?? ""} ${
                        student.last_name ?? ""
                      }`.trim() || "No Name";

                    return (
                      <tr key={student.id} className="border-t">
                        <td className="p-3 font-medium">{fullName}</td>

                        <td className="p-3">{student.email}</td>

                        <td className="p-3 font-mono">{student.username}</td>

                        <td className="p-3 font-mono">
                          <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-muted-foreground" />

                            {student.password}
                          </div>
                        </td>

                        <td className="p-3">
                          {student.is_active ? (
                            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyCredentials(student)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </Button>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEdit(student)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Student</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-5">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        First Name
                                      </label>

                                      <Input
                                        value={firstName}
                                        onChange={(e) =>
                                          setFirstName(e.target.value)
                                        }
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Last Name
                                      </label>

                                      <Input
                                        value={lastName}
                                        onChange={(e) =>
                                          setLastName(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Email
                                    </label>

                                    <Input
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                    />
                                  </div>

                                  <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                                    <h4 className="font-medium">
                                      Login Credentials
                                    </h4>

                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Username
                                      </p>

                                      <p className="font-mono font-semibold">
                                        {selectedStudent?.username}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Password
                                      </p>

                                      <p className="font-mono font-semibold">
                                        {selectedStudent?.password}
                                      </p>
                                    </div>

                                    <Button
                                      variant="secondary"
                                      className="w-full"
                                      onClick={() => {
                                        if (selectedStudent) {
                                          copyCredentials(selectedStudent);
                                        }
                                      }}
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Login Credentials
                                    </Button>
                                  </div>

                                  <Button
                                    className="w-full"
                                    onClick={saveStudent}
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
