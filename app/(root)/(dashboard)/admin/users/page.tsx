"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminService } from "@/app/services/admin.service";

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

type User = {
  id: string;

  first_name: string;
  last_name: string;

  email: string;

  role: string;

  school_name?: string;

  is_verified: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await AdminService.getUsers();

      setUsers(data.users ?? data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadUsers());
  }, []);

  async function deleteUser(userId: string) {
    try {
      await AdminService.deleteUser(userId);

      toast.success("User deleted");

      loadUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  }

  const filtered = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage platform users</p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((user) => {
                  const isSuperAdmin = user.role === "SUPER_ADMIN";

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>{user.role}</TableCell>

                      <TableCell>{user.school_name ?? "-"}</TableCell>

                      <TableCell>
                        {user.is_verified ? "Verified" : "Pending"}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isSuperAdmin}
                          title={
                            isSuperAdmin
                              ? "Super Admin cannot be deleted"
                              : "Delete user"
                          }
                          onClick={() => deleteUser(user.id)}
                        >
                          {isSuperAdmin ? "Not Allowed" : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
