"use client";

import { useMemo, useState } from "react";

import { Check, Search, X, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Props {
  teachers: Teacher[];

  selected: string[];

  onChange: (ids: string[]) => void;
}

export default function TeacherSelector({
  teachers,
  selected,
  onChange,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredTeachers = useMemo(() => {
    const query = search.toLowerCase();

    return teachers.filter((teacher) => {
      const fullName =
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase();

      return (
        fullName.includes(query) || teacher.email.toLowerCase().includes(query)
      );
    });
  }, [teachers, search]);

  const toggle = (teacherId: string) => {
    if (selected.includes(teacherId)) {
      onChange(selected.filter((id) => id !== teacherId));
    } else {
      onChange([...selected, teacherId]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Teachers</h3>

        <p className="text-sm text-muted-foreground">
          Select teachers that belong to this class.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-72 rounded-lg border">
        <div className="divide-y">
          {filteredTeachers.map((teacher) => {
            const checked = selected.includes(teacher.id);

            return (
              <button
                type="button"
                key={teacher.id}
                onClick={() => toggle(teacher.id)}
                className="flex w-full items-center justify-between p-3 transition hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <User className="h-4 w-4" />
                  </div>

                  <div className="text-left">
                    <p className="font-medium">
                      {teacher.first_name} {teacher.last_name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {teacher.email}
                    </p>
                  </div>
                </div>

                {checked && <Check className="h-5 w-5 text-green-600" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div>
        <p className="mb-2 text-sm font-medium">
          Selected Teachers ({selected.length})
        </p>

        <div className="flex flex-wrap gap-2">
          {selected.map((id) => {
            const teacher = teachers.find((t) => t.id === id);

            if (!teacher) return null;

            return (
              <Badge key={id} className="flex items-center gap-2">
                {teacher.first_name} {teacher.last_name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggle(id)}
                />
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
