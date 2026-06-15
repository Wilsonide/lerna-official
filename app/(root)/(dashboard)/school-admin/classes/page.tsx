"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SchoolClass = {
  id: string;
  name: string;
  level?: string;
};

export default function ClassesPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    level: "",
  });

  async function load() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getClasses();
      setClasses(data.classes ?? data);
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);

  async function createClass() {
    try {
      await SchoolAdminService.createClass(form);

      toast.success("Class created");

      setForm({ name: "", level: "" });

      load();
    } catch {
      toast.error("Failed to create class");
    }
  }

  async function removeClass(id: string) {
    try {
      await SchoolAdminService.deleteClass(id);

      toast.success("Class deleted");

      load();
    } catch {
      toast.error("Failed to delete class");
    }
  }

  function openClass(id: string) {
    router.push(`/school-admin/classes/${id}`);
  }

  return (
    <div className="space-y-6 p-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Classes</h1>
        <p className="text-muted-foreground">Manage school classes</p>
      </div>

      {/* CREATE */}
      <Card>
        <CardHeader>
          <CardTitle>Create Class</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Class name (e.g. JSS1 A)"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <Input
            placeholder="Level (optional)"
            value={form.level}
            onChange={(e) =>
              setForm({
                ...form,
                level: e.target.value,
              })
            }
          />

          <Button onClick={createClass} className="w-full">
            Create Class
          </Button>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : classes.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No classes created yet
            </div>
          ) : (
            <div className="space-y-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition"
                >
                  {/* FULL CLICKABLE ROW */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => openClass(cls.id)}
                  >
                    <p className="font-medium hover:underline">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.level || "No level"}
                    </p>
                  </div>

                  {/* ACTION BUTTON (STOP PROPAGATION) */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeClass(cls.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
