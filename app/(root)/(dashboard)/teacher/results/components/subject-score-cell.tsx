"use client";

import { calculateGrade } from "@/lib/result-grade";

type ScoreState = {
  ca_score: number;
  exam_score: number;
  teacher_comment: string;
};

type Props = {
  value: ScoreState;
  onChange: (field: keyof ScoreState, value: number | string) => void;
};

export default function SubjectScoreCell({ value, onChange }: Props) {
  const total = Number(value.ca_score || 0) + Number(value.exam_score || 0);

  const { grade, remark } = calculateGrade(total);

  return (
    <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
      {/* CA & Exam */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            CA (40)
          </label>

          <input
            type="number"
            min={0}
            max={40}
            value={value.ca_score}
            onChange={(e) =>
              onChange(
                "ca_score",
                Math.min(40, Math.max(0, Number(e.target.value))),
              )
            }
            className="w-full rounded-md border px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Exam (60)
          </label>

          <input
            type="number"
            min={0}
            max={60}
            value={value.exam_score}
            onChange={(e) =>
              onChange(
                "exam_score",
                Math.min(60, Math.max(0, Number(e.target.value))),
              )
            }
            className="w-full rounded-md border px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md bg-white p-2 text-center">
          <p className="text-[11px] uppercase text-gray-500">Total</p>

          <p className="text-lg font-bold">{total}</p>
        </div>

        <div className="rounded-md bg-white p-2 text-center">
          <p className="text-[11px] uppercase text-gray-500">Grade</p>

          <p
            className={`text-lg font-bold ${
              grade === "A"
                ? "text-green-600"
                : grade === "B"
                  ? "text-blue-600"
                  : grade === "C"
                    ? "text-yellow-600"
                    : grade === "D"
                      ? "text-orange-600"
                      : grade === "E"
                        ? "text-purple-600"
                        : "text-red-600"
            }`}
          >
            {grade}
          </p>
        </div>

        <div className="rounded-md bg-white p-2 text-center">
          <p className="text-[11px] uppercase text-gray-500">Remark</p>

          <p className="text-xs font-semibold">{remark}</p>
        </div>
      </div>

      {/* Teacher Comment */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Teacher Comment
        </label>

        <textarea
          rows={2}
          value={value.teacher_comment}
          onChange={(e) => onChange("teacher_comment", e.target.value)}
          placeholder="Optional comment..."
          className="w-full resize-none rounded-md border px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>
    </div>
  );
}
