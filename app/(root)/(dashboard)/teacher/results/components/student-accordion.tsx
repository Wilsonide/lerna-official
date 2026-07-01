"use client";

import { useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import StudentSubjectTable from "./student-subject-table";

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
  student: Student;
  subjects: Subject[];

  isOpen: boolean;
  onToggle: () => void;

  scores: Record<string, ScoreState>;

  onChange: (
    studentId: string,
    subjectId: string,
    field: keyof ScoreState,
    value: number | string,
  ) => void;
};

export default function StudentAccordion({
  student,
  subjects,
  isOpen,
  onToggle,
  scores,
  onChange,
}: Props) {
  const stats = useMemo(() => {
    let completed = 0;

    subjects.forEach((subject) => {
      const s = scores?.[subject.id];

      if (!s) return;

      if (s.ca_score > 0 || s.exam_score > 0) {
        completed++;
      }
    });

    const total = subjects.length;

    return {
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [scores, subjects]);

  return (
    <div className="rounded-xl border bg-white">
      {/* HEADER */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <h3 className="font-semibold">
            {student.first_name} {student.last_name}
          </h3>

          <p className="text-xs text-gray-500">{student.admission_number}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="text-right text-xs">
            <p className="text-gray-500">
              {stats.completed}/{stats.total}
            </p>

            <p className="font-medium">{stats.percent}%</p>
          </div>

          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* BODY */}
      {isOpen && (
        <div className="border-t p-4">
          <StudentSubjectTable
            studentId={student.id}
            subjects={subjects}
            scores={scores}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}
