"use client";

import SubjectScoreCell from "./subject-score-cell";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
};

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
  students: Student[];
  subjects: Subject[];
  scores: Record<string, Record<string, ScoreState>>;

  onChange: (
    studentId: string,
    subjectId: string,
    field: keyof ScoreState,
    value: number | string,
  ) => void;
};

export default function StudentResultTable({
  students,
  subjects,
  scores,
  onChange,
}: Props) {
  if (!students.length) {
    return (
      <div className="rounded-xl border bg-white py-20 text-center">
        <p className="text-gray-500">No students found.</p>
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="rounded-xl border bg-yellow-50 py-20 text-center">
        <h3 className="font-semibold">No subjects assigned</h3>

        <p className="mt-2 text-sm text-gray-500">
          Assign subjects to this class before entering results.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky left-0 z-20 border-b bg-gray-50 px-4 py-3 text-left">
              Student
            </th>

            {subjects.map((subject) => (
              <th
                key={subject.id}
                className="min-w-[330px] border-b px-4 py-3 text-left"
              >
                {subject.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b align-top">
              <td className="sticky left-0 bg-white px-4 py-5">
                <div className="font-semibold">
                  {student.first_name} {student.last_name}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  {student.admission_number}
                </div>
              </td>

              {subjects.map((subject) => (
                <td key={subject.id} className="border-l p-4">
                  <SubjectScoreCell
                    value={scores[student.id][subject.id]}
                    onChange={(
                      field: keyof ScoreState,
                      value: string | number,
                    ) => onChange(student.id, subject.id, field, value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
