"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Subject } from "./types";

interface Props {
  subjects: Subject[];

  activeIndex: number;

  progressBySubject: Record<string, number>;

  onChange: (index: number) => void;
}

export default function SubjectNavigator({
  subjects,
  activeIndex,
  progressBySubject,
  onChange,
}: Props) {
  if (!subjects.length) return null;

  const active = subjects[activeIndex];

  const percent = progressBySubject[active.id] ?? 0;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      {/* Top */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={activeIndex === 0}
          onClick={() => onChange(activeIndex - 1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Current Subject
          </p>

          <h2 className="text-2xl font-bold">{active.name}</h2>

          <p className="text-sm text-muted-foreground">
            {activeIndex + 1} of {subjects.length}
          </p>
        </div>

        <Button
          variant="outline"
          disabled={activeIndex === subjects.length - 1}
          onClick={() => onChange(activeIndex + 1)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <Progress value={percent} />

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Completion</span>

          <span>{percent}%</span>
        </div>
      </div>

      {/* Subject pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {subjects.map((subject, index) => {
          const completed = progressBySubject[subject.id] ?? 0;

          return (
            <button
              key={subject.id}
              onClick={() => onChange(index)}
              className={[
                "rounded-lg border px-3 py-2 text-sm transition",
                index === activeIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : completed === 100
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-300 bg-white hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="font-medium">{subject.name}</div>

              <div className="text-xs opacity-80">{completed}%</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
