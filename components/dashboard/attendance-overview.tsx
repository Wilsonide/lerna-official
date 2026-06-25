"use client";

import { Progress } from "@/components/ui/progress";

interface Props {
  present: number;
  absent: number;
  late: number;
  rate: number;
}

export function AttendanceOverview({ present, absent, late, rate }: Props) {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="font-semibold mb-5">Attendance Overview</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Present</span>
          <span>{present}</span>
        </div>

        <div className="flex justify-between">
          <span>Absent</span>
          <span>{absent}</span>
        </div>

        <div className="flex justify-between">
          <span>Late</span>
          <span>{late}</span>
        </div>

        <div className="pt-3">
          <div className="flex justify-between mb-2">
            <span>Attendance Rate</span>
            <span>{rate}%</span>
          </div>

          <Progress value={rate} />
        </div>
      </div>
    </div>
  );
}
