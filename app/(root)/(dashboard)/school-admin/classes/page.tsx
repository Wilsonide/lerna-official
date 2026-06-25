"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/modal/delete-confirm-dialog";

interface SchoolClass {
  id: string;
  name: string;
  level?: string | null;

  students_count?: number;
  teachers_count?: number;
  subjects_count?: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  const loadClasses = async () => {
    try {
      const response = await SchoolAdminService.getClasses();

      setClasses(
        Array.isArray(response?.classes)
          ? response.classes
          : Array.isArray(response)
            ? response
            : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadClasses());
  }, []);

  const createClass = async () => {
    try {
      await SchoolAdminService.createClass({
        name,
        level,
      });

      toast.success("Class created");

      setCreateOpen(false);

      setName("");
      setLevel("");

      await loadClasses();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create class");
    }
  };

  const openEdit = (schoolClass: SchoolClass) => {
    setSelectedClass(schoolClass);

    setName(schoolClass.name);
    setLevel(schoolClass.level || "");

    setEditOpen(true);
  };

  const updateClass = async () => {
    if (!selectedClass) return;

    try {
      await SchoolAdminService.updateClass(selectedClass.id, {
        name,
        level,
      });

      toast.success("Class updated");

      setEditOpen(false);

      await loadClasses();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update class");
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      await SchoolAdminService.deleteClass(classId);

      toast.success("Class deleted");

      await loadClasses();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete class");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>

          <p className="text-muted-foreground">Manage school classes</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Class</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Class Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                placeholder="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />

              <Button className="w-full" onClick={createClass}>
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-10 text-center">Loading classes...</div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            No classes found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((schoolClass) => (
            <Card key={schoolClass.id}>
              <CardHeader>
                <CardTitle>{schoolClass.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p>Students: {schoolClass.students_count ?? 0}</p>

                  <p>Teachers: {schoolClass.teachers_count ?? 0}</p>

                  <p>Subjects: {schoolClass.subjects_count ?? 0}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/school-admin/classes/${schoolClass.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(schoolClass)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <DeleteConfirmDialog
                    title="Delete Subject"
                    description={`Are you sure you want to delete "${schoolClass.name}"?`}
                    onConfirm={() => deleteClass(schoolClass.id)}
                    trigger={
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Class Name"
            />

            <Input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Level"
            />

            <Button className="w-full" onClick={updateClass}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
