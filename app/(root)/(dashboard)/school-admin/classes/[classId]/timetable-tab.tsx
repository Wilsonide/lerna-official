/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TimetableEntry = {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject?: string;
  teacher?: string;
};

export default function TimetableTab({ classId }: { classId: string }) {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassTimetable(classId);

      const list = data?.entries ?? (Array.isArray(data) ? data : []) ?? [];

      setEntries(list);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load timetable");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [classId]);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Class Timetable
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* LOADING */}
        {loading && (
          <div className="py-10 text-center text-muted-foreground">
            Loading timetable...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && entries.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            No timetable has been created for this class yet.
          </div>
        )}

        {/* LIST */}
        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/40 transition"
              >
                {/* LEFT SIDE */}
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {entry.subject || "General Class"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {entry.day_of_week}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.start_time} - {entry.end_time}
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE (optional future actions) */}
                <div className="text-xs text-muted-foreground">
                  {entry.teacher ? `👨‍🏫 ${entry.teacher}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
