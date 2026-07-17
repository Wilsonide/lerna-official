"use client";

import { Subject, Student, ScoreState } from "../components/types";
import ResultRow from "./ResultRow";

interface Props {
  editable: boolean;

  students: Student[];

  subject: Subject;

  records: ScoreState;

  updateCell: (
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) => void;
}

export default function ResultGrid({
  editable,
  students,
  subject,
  records,
  updateCell,
}: Props) {
  if (!students.length) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-muted-foreground">
        No students found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="w-20 border px-3 py-3 text-left">S/N</th>

            <th className="border px-3 py-3 text-left">Student</th>

            <th className="w-24 border px-3 py-3 text-center">CA</th>

            <th className="w-24 border px-3 py-3 text-center">Exam</th>

            <th className="w-24 border px-3 py-3 text-center">Total</th>

            <th className="w-20 border px-3 py-3 text-center">Grade</th>

            <th className="w-36 border px-3 py-3 text-center">Remark</th>

            <th className="border px-3 py-3">Teacher Comment</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => {
            const record = records?.[student.id]?.[subject.id] ?? {
              ca_score: "",
              exam_score: "",
              teacher_comment: "",
            };

            return (
              <ResultRow
                key={student.id}
                editable={editable}
                index={index}
                student={student}
                subject={subject}
                record={record}
                updateCell={updateCell}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
