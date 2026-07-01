"use client";

import { calculateGrade } from "@/lib/result-grade";
import ScoreInput from "./score-input";

type Subject = {
  id: string;
  name: string;
};

type ScoreState = {
  ca_score: number;
  exam_score: number;
  teacher_comment: string;
};

type Props = {
  studentId: string;
  subjects: Subject[];

  scores: Record<string, ScoreState>;

  onChange: (
    studentId: string,
    subjectId: string,
    field: keyof ScoreState,
    value: number | string,
  ) => void;
};

export default function StudentSubjectTable({
  studentId,
  subjects,
  scores,
  onChange,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {/* HEADER */}
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="p-2">Subject</th>
            <th className="p-2">CA (40)</th>
            <th className="p-2">Exam (60)</th>
            <th className="p-2">Total</th>
            <th className="p-2">Grade</th>
            <th className="p-2">Remark</th>
            <th className="p-2">Comment</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {subjects.map((subject) => {
            const value = scores?.[subject.id] ?? {
              ca_score: 0,
              exam_score: 0,
              teacher_comment: "",
            };

            const total =
              Number(value.ca_score || 0) + Number(value.exam_score || 0);

            const { grade, remark } = calculateGrade(total);

            const caInvalid = value.ca_score > 40;
            const examInvalid = value.exam_score > 60;

            return (
              <tr key={subject.id} className="border-b">
                {/* SUBJECT NAME */}
                <td className="p-2 font-medium">{subject.name}</td>

                {/* CA */}
                <td className="p-2">
                  <ScoreInput
                    value={value.ca_score}
                    max={40}
                    invalid={caInvalid}
                    onChange={(val: string | number) =>
                      onChange(studentId, subject.id, "ca_score", val)
                    }
                  />
                </td>

                {/* EXAM */}
                <td className="p-2">
                  <ScoreInput
                    value={value.exam_score}
                    max={60}
                    invalid={examInvalid}
                    onChange={(val: string | number) =>
                      onChange(studentId, subject.id, "exam_score", val)
                    }
                  />
                </td>

                {/* TOTAL */}
                <td className="p-2 font-semibold">{total}</td>

                {/* GRADE */}
                <td className="p-2 font-bold">{grade}</td>

                {/* REMARK */}
                <td className="p-2 text-xs">{remark}</td>

                {/* COMMENT */}
                <td className="p-2">
                  <textarea
                    value={value.teacher_comment}
                    onChange={(e) =>
                      onChange(
                        studentId,
                        subject.id,
                        "teacher_comment",
                        e.target.value,
                      )
                    }
                    className="w-40 rounded border p-1 text-xs"
                    placeholder="Comment"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
