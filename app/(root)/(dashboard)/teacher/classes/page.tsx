"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Search, School, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { teacherService } from "@/app/services/teacher.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

interface TeacherClass {
  id: string;
  name: string;
  level?: string;

  students_count?: number;
  subjects_count?: number;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadClasses = async () => {
    try {
      const response = await teacherService.getClasses();

      const classList = response?.classes || response?.data || response || [];

      setClasses(Array.isArray(classList) ? classList : []);
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

  const filteredClasses = useMemo(() => {
    const term = search.toLowerCase();

    return classes.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.level?.toLowerCase().includes(term),
    );
  }, [classes, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">My Classes</h1>

        <p className="text-muted-foreground">Classes assigned to you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Classes</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />

            <Input
              placeholder="Search classes..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading classes...</div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No classes assigned
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredClasses.map((item) => (
                <Card key={item.id} className="transition hover:shadow-md">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <School className="text-primary h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="text-muted-foreground text-sm">
                          {item.level || "Class"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />

                          <span className="text-sm">Students</span>
                        </div>

                        <p className="mt-2 text-xl font-bold">
                          {item.students_count ?? 0}
                        </p>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />

                          <span className="text-sm">Subjects</span>
                        </div>

                        <p className="mt-2 text-xl font-bold">
                          {item.subjects_count ?? 0}
                        </p>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/teacher/classes/${item.id}`}>
                        Open Class
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
