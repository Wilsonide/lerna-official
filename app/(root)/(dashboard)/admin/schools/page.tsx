/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Power, PowerOff } from "lucide-react";

import { School } from "@/app/types/school";
import {
  AdminService,
  CreateSchoolPayload,
} from "@/app/services/admin.service";

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
import { Badge } from "@/components/ui/badge";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const [openCredentials, setOpenCredentials] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // ==========================================
  // LOAD SCHOOLS
  // ==========================================

  async function loadSchools() {
    try {
      setLoading(true);

      const res = await AdminService.getSchools();

      setSchools(res.schools ?? res);
      console.log("Schools loaded", res.schools ?? res);
    } catch {
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadSchools());
  }, []);

  // ==========================================
  // CREATE SCHOOL
  // ==========================================

  // ==========================================
  // CREATE SCHOOL
  // ==========================================

  async function createSchool(payload: CreateSchoolPayload) {
    try {
      setCreating(true);

      const res = await AdminService.createSchool(payload);

      toast.success(res.message ?? "School created successfully");

      if (res.credentials) {
        setCredentials({
          username: res.credentials.username,
          password: res.credentials.password,
        });

        setOpenCredentials(true);
      }

      setOpenCreate(false);

      await loadSchools();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ??
          err?.response?.data?.message ??
          "Unable to create school.",
      );
    } finally {
      setCreating(false);
    }
  }

  // ==========================================
  // ENABLE / DISABLE
  // ==========================================

  async function toggleSchool(school: School) {
    try {
      if (school.is_active) {
        await AdminService.disableSchool(school.id);

        toast.success("School disabled");
      } else {
        await AdminService.enableSchool(school.id);

        toast.success("School enabled");
      }

      await loadSchools();
    } catch {
      toast.error("Operation failed.");
    }
  }

  // ==========================================
  // COPY TO CLIPBOARD
  // ==========================================

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);

    toast.success(`${label} copied`);
  }

  return (
    <>
      <div className="space-y-6 p-8">
        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schools</h1>

            <p className="text-muted-foreground">
              Create schools, manage their administrators and enable or disable
              access.
            </p>
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>Create School</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New School</DialogTitle>
              </DialogHeader>

              <SchoolForm onSubmit={createSchool} loading={creating} />
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE CARD */}

        <Card>
          <CardHeader>
            <CardTitle>Registered Schools</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                Loading schools...
              </div>
            ) : schools.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                No schools have been created.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{school.name}</p>

                            <p className="text-xs text-muted-foreground">
                              {school.slug}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p>
                              {school.admin?.first_name}{" "}
                              {school.admin?.last_name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {school.admin?.email}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-sm">
                              {school.admin?.username ?? "-"}
                            </span>

                            {school.admin?.username && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  copy(school.admin!.username!, "Username")
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-sm">
                              {school.admin?.password ?? "-"}
                            </span>

                            {school.admin?.password && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  copy(school.admin!.password!, "Password")
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              school.is_active ? "default" : "destructive"
                            }
                          >
                            {school.is_active ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={
                              school.is_active ? "destructive" : "default"
                            }
                            onClick={() => toggleSchool(school)}
                          >
                            {school.is_active ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Enable
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ====================================== */}
      {/* SCHOOL ADMIN CREDENTIALS */}
      {/* ====================================== */}

      <Dialog open={openCredentials} onOpenChange={setOpenCredentials}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>School Created Successfully</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-xl border bg-green-50 p-4">
              <h3 className="font-semibold text-green-700">
                School Administrator Login
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Save these credentials. They will be used by the School
                Administrator to sign into the system.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>

                <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                  <span className="font-mono">{credentials.username}</span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copy(credentials.username, "Username")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>

                <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                  <span className="font-mono">{credentials.password}</span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copy(credentials.password, "Password")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => setOpenCredentials(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
