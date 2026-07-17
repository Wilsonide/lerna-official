"use client";

import ResultRow from "./ResultRow";
import type { Student, Subject, ScoreRecord } from "@/app/hooks/useResultGrid";

interface Props {
  students: Student[];
  subjects: Subject[];

  records: Record<string, Record<string, ScoreRecord>>;

  updateCell: (
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) => void;
}

export default function ResultGrid({
  students,
  subjects,
  records,
  updateCell,
}: Props) {
  return (
    <div className="overflow-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-max border-collapse">
        <thead className="sticky top-0 z-20 bg-slate-100">
          <tr>
            <th
              rowSpan={2}
              className="sticky left-0 z-30 border bg-slate-100 px-5 py-3 text-left"
            >
              Student
            </th>

            {subjects.map((subject) => (
              <th
                key={subject.id}
                colSpan={2}
                className="border px-4 py-2 text-center text-sm font-semibold"
              >
                {subject.name}
              </th>
            ))}
          </tr>

          <tr>
            {subjects.flatMap((subject) => [
              <th
                key={`${subject.id}-ca`}
                className="border bg-slate-50 px-2 py-2 text-center text-xs"
              >
                CA
              </th>,

              <th
                key={`${subject.id}-exam`}
                className="border bg-slate-50 px-2 py-2 text-center text-xs"
              >
                Exam
              </th>,
            ])}
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <ResultRow
              key={student.id}
              student={student}
              studentIndex={index}
              subjects={subjects}
              records={records[student.id]}
              onChange={updateCell}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
