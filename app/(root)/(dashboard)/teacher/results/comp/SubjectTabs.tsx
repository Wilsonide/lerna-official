"use client";

import clsx from "clsx";

import { Subject } from "../components/types";

interface Props {
  subjects: Subject[];

  activeIndex: number;

  progressBySubject: Record<string, number>;

  onChange: (index: number) => void;
}

export default function SubjectTabs({
  subjects,
  activeIndex,
  progressBySubject,
  onChange,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <div className="flex min-w-max gap-2 p-3">
        {subjects.map((subject, index) => {
          const progress = progressBySubject[subject.id] ?? 0;

          return (
            <button
              key={subject.id}
              onClick={() => onChange(index)}
              className={clsx(
                "min-w-[170px] rounded-lg border px-4 py-3 text-left transition",

                activeIndex === index
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              )}
            >
              <div className="font-semibold">{subject.name}</div>

              <div
                className={clsx(
                  "mt-2 text-xs",
                  activeIndex === index
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {progress}% Complete
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-200">
                <div
                  className={clsx(
                    "h-full transition-all",
                    activeIndex === index
                      ? "bg-white"
                      : progress === 100
                        ? "bg-green-500"
                        : "bg-primary",
                  )}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
