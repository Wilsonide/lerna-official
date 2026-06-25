"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";
import { Search, Pencil } from "lucide-react";

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

  const loadStudents = async () => {
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
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadStudents());
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();

    return students.filter((student) => {
      const fullName =
        `${student.first_name ?? ""} ${student.last_name ?? ""}`.toLowerCase();

      const email = (student.email ?? "").toLowerCase();

      return fullName.includes(term) || email.includes(term);
    });
  }, [students, search]);

  const openEdit = (student: Student) => {
    setSelectedStudent(student);

    setFirstName(student.first_name ?? "");
    setLastName(student.last_name ?? "");
    setEmail(student.email ?? "");
  };

  const saveStudent = async () => {
    if (!selectedStudent) return;

    try {
      await SchoolAdminService.updateStudent(selectedStudent.id, {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      toast.success("Student updated");

      await loadStudents();

      setSelectedStudent(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update student");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>

        <p className="text-muted-foreground">
          Manage all students in your school
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />

            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No students found
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Profile</th>
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
                        <td className="p-3">{fullName}</td>

                        <td className="p-3">{student.email}</td>

                        <td className="p-3">
                          {student.is_active === undefined ? (
                            <span className="text-muted-foreground text-xs">
                              N/A
                            </span>
                          ) : student.is_active ? (
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
                          {student.profile_completed === undefined ? (
                            <span className="text-muted-foreground text-xs">
                              N/A
                            </span>
                          ) : student.profile_completed ? (
                            <span className="text-green-600">Complete</span>
                          ) : (
                            <span className="text-red-600">Incomplete</span>
                          )}
                        </td>

                        <td className="p-3">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="p-3 text-right">
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

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Student</DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4">
                                <Input
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  placeholder="First Name"
                                />

                                <Input
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  placeholder="Last Name"
                                />

                                <Input
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Email"
                                />

                                <Button
                                  className="w-full"
                                  onClick={saveStudent}
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
