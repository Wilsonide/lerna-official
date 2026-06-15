/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { School } from "@/app/types/school";
import { AdminService } from "@/app/services/admin.service";

import SchoolForm from "@/components/admin/school-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function loadSchools() {
    try {
      setLoading(true);
      const res = await AdminService.getSchools();
      setSchools(res.schools ?? res);
    } catch {
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadSchools());
  }, []);

  async function createSchool(data: any) {
    try {
      setCreating(true);

      await AdminService.createSchool(data);

      toast.success("School created successfully");

      await loadSchools();
    } catch {
      toast.error("Failed to create school");
    } finally {
      setCreating(false);
    }
  }

  async function deleteSchool(id: string) {
    try {
      await AdminService.deleteSchool(id);

      toast.success("School deleted");

      await loadSchools();
    } catch {
      toast.error("Failed to delete school");
    }
  }

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schools</h1>
          <p className="text-muted-foreground">
            Manage schools on the platform
          </p>
        </div>

        {/* MODAL */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create School</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New School</DialogTitle>
            </DialogHeader>

            <SchoolForm onSubmit={createSchool} loading={creating} />
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Schools</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading schools...</div>
          ) : schools.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No schools found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>

                    <TableCell>{school.code}</TableCell>

                    <TableCell>{school.email}</TableCell>

                    <TableCell>
                      {school.is_active ? "Active" : "Inactive"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSchool(school.id)}
                      >
                        Delete
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
