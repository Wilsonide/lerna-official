"use client";

import { memo } from "react";

import ResultCell from "./ResultCell";
import { calculateTotal, getGrade, getRemark } from "@/lib/result-grade";

import { Student, Subject, ScoreRecord } from "../components/types";

interface Props {
  editable: boolean;

  index: number;

  student: Student;

  subject: Subject;

  record: ScoreRecord;

  updateCell: (
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) => void;
}

function ResultRow({
  editable,
  index,
  student,
  subject,
  record,
  updateCell,
}: Props) {
  const ca = record?.ca_score === "" ? 0 : Number(record?.ca_score ?? 0);

  const exam = record?.exam_score === "" ? 0 : Number(record?.exam_score ?? 0);

  const total = calculateTotal(ca, exam);

  const grade = getGrade(total);

  const remark = getRemark(total);

  return (
    <tr className="border-b hover:bg-slate-50">
      {/* Serial */}
      <td className="border px-3 py-2 text-center font-medium">{index + 1}</td>

      {/* Student */}
      <td className="border px-4 py-2">
        <div className="font-medium">
          {student.first_name} {student.last_name}
        </div>

        <div className="text-xs text-muted-foreground">
          {student.admission_number}
        </div>
      </td>

      {/* CA */}
      <td className="border text-center">
        <ResultCell
          editable={editable}
          field="ca_score"
          value={record.ca_score}
          studentIndex={index}
          subjectIndex={0}
          onChange={(value) =>
            updateCell(student.id, subject.id, "ca_score", value)
          }
        />
      </td>

      {/* Exam */}
      <td className="border text-center">
        <ResultCell
          editable={editable}
          field="exam_score"
          value={record.exam_score}
          studentIndex={index}
          subjectIndex={1}
          onChange={(value) =>
            updateCell(student.id, subject.id, "exam_score", value)
          }
        />
      </td>

      {/* Total */}
      <td className="border text-center font-semibold">{total}</td>

      {/* Grade */}
      <td className="border text-center">
        <span className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-bold">
          {grade}
        </span>
      </td>

      {/* Remark */}
      <td className="border text-center text-sm text-muted-foreground">
        {remark}
      </td>

      {/* Teacher Comment */}
      <td className="border px-2 py-2">
        {editable ? (
          <input
            value={record.teacher_comment}
            onChange={(e) =>
              updateCell(
                student.id,
                subject.id,
                "teacher_comment",
                e.target.value,
              )
            }
            placeholder="Optional..."
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {record.teacher_comment || "-"}
          </div>
        )}
      </td>
    </tr>
  );
}

export default memo(ResultRow);
