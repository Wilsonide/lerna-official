/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  teacherService,
  StudentResultInput,
} from "@/app/services/teacher.service";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface ScoreRecord {
  ca_score: number | "";
  exam_score: number | "";
  teacher_comment: string;
}

type ScoreState = Record<string, Record<string, ScoreRecord>>;

interface Props {
  classId: string;
}

export function useResultGrid({ classId }: Props) {
  const [loading, setLoading] = useState(true);

  const [savingDraft, setSavingDraft] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [records, setRecords] = useState<ScoreState>({});

  // ------------------------------------
  // LOAD
  // ------------------------------------

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [studentRes, subjectRes] = await Promise.all([
        teacherService.getStudents(classId),
        teacherService.getSubjects(classId),
      ]);

      setStudents(studentRes);

      setSubjects(subjectRes);

      const initial: ScoreState = {};

      studentRes.forEach((student: Student) => {
        initial[student.id] = {};

        subjectRes.forEach((subject: Subject) => {
          initial[student.id][subject.id] = {
            ca_score: "",
            exam_score: "",
            teacher_comment: "",
          };
        });
      });

      setRecords(initial);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to load students.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      Promise.resolve().then(() => load());
    }
  }, [load, classId]);

  // ------------------------------------
  // UPDATE CELL
  // ------------------------------------

  function updateCell(
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) {
    setRecords((prev) => ({
      ...prev,

      [studentId]: {
        ...prev[studentId],

        [subjectId]: {
          ...prev[studentId][subjectId],

          [field]:
            field === "teacher_comment"
              ? value
              : value === ""
                ? ""
                : Number(value),
        },
      },
    }));
  }

  // ------------------------------------
  // PROGRESS
  // ------------------------------------

  const expected = students.length * subjects.length;

  const entered = useMemo(() => {
    let total = 0;

    Object.values(records).forEach((student) => {
      Object.values(student).forEach((record) => {
        if (record.ca_score !== "" && record.exam_score !== "") {
          total++;
        }
      });
    });

    return total;
  }, [records]);

  const progress = expected ? Math.round((entered / expected) * 100) : 0;

  // ------------------------------------
  // PAYLOAD
  // ------------------------------------

  const payload = useMemo<StudentResultInput[]>(() => {
    return students.map((student) => ({
      student_id: student.id,

      scores: subjects.map((subject) => {
        const score = records[student.id][subject.id];

        return {
          subject_id: subject.id,

          ca_score: score.ca_score === "" ? 0 : score.ca_score,

          exam_score: score.exam_score === "" ? 0 : score.exam_score,

          teacher_comment: score.teacher_comment,
        };
      }),
    }));
  }, [students, subjects, records]);

  // ------------------------------------
  // SAVE
  // ------------------------------------

  async function saveDraft() {
    try {
      setSavingDraft(true);

      await teacherService.saveDraft({
        class_id: classId,
        students: payload,
      });

      toast.success("Draft saved.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to save.");
    } finally {
      setSavingDraft(false);
    }
  }

  // ------------------------------------
  // SUBMIT
  // ------------------------------------

  async function submit() {
    if (entered !== expected) {
      toast.error("Please complete all scores.");

      return;
    }

    try {
      setSubmitting(true);

      await teacherService.submitResults({
        class_id: classId,
        students: payload,
      });

      toast.success("Results submitted.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    loading,

    students,

    subjects,

    records,

    progress,

    entered,

    expected,

    savingDraft,

    submitting,

    updateCell,

    saveDraft,

    submit,

    reload: load,
  };
}
