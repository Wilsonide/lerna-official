"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
};

export default function SchoolStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  async function loadStudents() {
    try {
      const data = await SchoolAdminService.getSchoolStudents();

      setStudents(data?.students ?? []); // 🔥 FIX HERE
    } catch {
      toast.error("Failed to load students");
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadStudents());
  }, []);

  const filtered = students.filter(
    (s) =>
      `${s.first_name} ${s.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          Manage all students in your school
        </p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.first_name} {s.last_name}
                  </TableCell>

                  <TableCell>{s.email}</TableCell>

                  <TableCell>{s.is_verified ? "Active" : "Pending"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
