"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminService } from "@/app/services/admin.service";
import { AdminUser } from "@/app/types/admin";

import CreateSchoolAdminModal from "@/components/admin/create-school-admin-modal";

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

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAdmins() {
    try {
      setLoading(true);

      const data = await AdminService.getAdmins();

      // safety fallback (prevents undefined crash)
      setAdmins(Array.isArray(data) ? data : (data?.admins ?? []));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadAdmins());
  }, []);

  async function revokeAdmin(userId: string) {
    try {
      await AdminService.revokeSchoolAdmin(userId);
      toast.success("Admin revoked");
      loadAdmins();
    } catch {
      toast.error("Failed to revoke admin");
    }
  }

  async function deleteAdmin(userId: string) {
    try {
      await AdminService.deleteAdmin(userId);
      toast.success("Admin deleted");
      loadAdmins();
    } catch {
      toast.error("Failed to delete admin");
    }
  }

  const filtered = admins.filter((admin) => {
    const fullName = `${admin.first_name ?? ""} ${admin.last_name ?? ""}`
      .trim()
      .toLowerCase();

    const email = (admin.email ?? "").toLowerCase();
    const query = search.toLowerCase();

    return email.includes(query) || fullName.includes(query);
  });

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administrators</h1>
          <p className="text-muted-foreground">
            Manage school and system administrators
          </p>
        </div>

        <CreateSchoolAdminModal onSuccess={loadAdmins} />
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search admin by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Accounts</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              Loading administrators...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        {admin.first_name ?? "—"} {admin.last_name ?? ""}
                      </TableCell>

                      <TableCell>{admin.email ?? "—"}</TableCell>

                      <TableCell>{admin.school_name ?? "Platform"}</TableCell>

                      <TableCell>{admin.role}</TableCell>

                      <TableCell className="flex justify-end gap-2">
                        {admin.role !== "SUPER_ADMIN" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => revokeAdmin(admin.id)}
                            >
                              Revoke
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteAdmin(admin.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
