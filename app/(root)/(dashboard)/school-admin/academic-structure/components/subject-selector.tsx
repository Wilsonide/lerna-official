"use client";

import { useMemo, useState } from "react";

import { Check, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Subject {
  id: string;
  name: string;
}

interface Props {
  subjects: Subject[];

  selected: string[];

  onChange: (ids: string[]) => void;
}

export default function SubjectSelector({
  subjects,
  selected,
  onChange,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return subjects.filter((subject) =>
      subject.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [subjects, search]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-lg">Subjects</h3>

        <p className="text-sm text-muted-foreground">
          Select the subjects available for this class.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-60 rounded-lg border">
        <div className="divide-y">
          {filtered.map((subject) => {
            const checked = selected.includes(subject.id);

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => toggle(subject.id)}
                className="flex w-full items-center justify-between p-3 transition hover:bg-muted"
              >
                <span>{subject.name}</span>

                {checked && <Check className="h-5 w-5 text-green-600" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex flex-wrap gap-2">
        {selected.map((id) => {
          const subject = subjects.find((x) => x.id === id);

          if (!subject) return null;

          return (
            <Badge key={id} className="flex items-center gap-2">
              {subject.name}

              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggle(id)}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
