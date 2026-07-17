"use client";

import { memo } from "react";

import ResultCell from "./ResultCell";

interface Student {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
}

interface Subject {
  id: string;
  name: string;
}

export interface ScoreRecord {
  ca_score: number | "";
  exam_score: number | "";
  teacher_comment: string;
}

interface Props {
  student: Student;

  studentIndex: number;

  subjects: Subject[];

  records: Record<string, ScoreRecord>;

  onChange: (
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) => void;
}

function ResultRow({
  student,
  studentIndex,
  subjects,
  records,
  onChange,
}: Props) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="sticky left-0 z-10 border bg-white px-4 py-3 whitespace-nowrap">
        <div className="font-medium">
          {student.first_name} {student.last_name}
        </div>

        <div className="text-xs text-slate-500">{student.admission_number}</div>
      </td>

      {subjects.map((subject, index) => {
        const record = records?.[subject.id];

        return (
          <>
            <td key={`${subject.id}-ca`} className="border p-1 text-center">
              <ResultCell
                field="ca_score"
                value={record?.ca_score ?? ""}
                studentIndex={studentIndex}
                subjectIndex={index * 2}
                onChange={(value) =>
                  onChange(student.id, subject.id, "ca_score", value)
                }
              />
            </td>

            <td key={`${subject.id}-exam`} className="border p-1 text-center">
              <ResultCell
                field="exam_score"
                value={record?.exam_score ?? ""}
                studentIndex={studentIndex}
                subjectIndex={index * 2 + 1}
                onChange={(value) =>
                  onChange(student.id, subject.id, "exam_score", value)
                }
              />
            </td>
          </>
        );
      })}
    </tr>
  );
}

export default memo(ResultRow);
