"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Teacher = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  profile_completed: boolean;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTeachers() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getSchoolTeachers();

      setTeachers(data.teachers ?? data);
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadTeachers());
  }, []);

  const filtered = teachers.filter(
    (t) =>
      `${t.first_name} ${t.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Teachers</h1>
        <p className="text-muted-foreground">
          Manage all teachers in your school
        </p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading teachers...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No teachers found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      {teacher.first_name} {teacher.last_name}
                    </TableCell>

                    <TableCell>{teacher.email}</TableCell>

                    <TableCell>
                      {teacher.is_active ? "Active" : "Inactive"}
                    </TableCell>

                    <TableCell>
                      {teacher.profile_completed ? "Completed" : "Pending"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
