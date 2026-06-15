"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import StudentsTab from "./students-tab";
import TeachersTab from "./teachers-tab";
import TimetableTab from "./timetable-tab";

type TabType = "students" | "teachers" | "subjects" | "timetable";

export default function ClassDashboard() {
  const params = useParams();

  const classId = params.classId as string;

  const [tab, setTab] = useState<TabType>("students");

  const tabs = [
    { key: "students", label: "Students" },
    { key: "teachers", label: "Teachers" },
    { key: "timetable", label: "Timetable" },
  ] as const;

  return (
    <div className="space-y-6 p-10">
      <div>
        <h1 className="text-2xl font-bold">Class Dashboard</h1>

        <p className="text-muted-foreground">
          Manage class data, assignments and timetable
        </p>
      </div>

      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-t-md text-sm whitespace-nowrap transition ${
              tab === t.key
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "students" && <StudentsTab classId={classId} />}

      {tab === "teachers" && <TeachersTab classId={classId} />}

      {tab === "timetable" && <TimetableTab classId={classId} />}
    </div>
  );
}
