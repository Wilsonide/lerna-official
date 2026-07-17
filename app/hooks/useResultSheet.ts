/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  teacherService,
  ResultBatchCreate,
  StudentResultInput,
  SubjectScoreInput,
} from "@/app/services/teacher.service";
import {
  calculateTotal,
  validateCAScore,
  validateExamScore,
} from "@/lib/result-grade";

// =======================================
// TYPES
// =======================================

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

export interface ScoreCell {
  ca_score: number | "";
  exam_score: number | "";
  teacher_comment: string;
}

export type ResultState = Record<string, Record<string, ScoreCell>>;

interface UseResultSheetProps {
  classId: string;
  mode: "create" | "edit";
  batchId?: string;
}

// =======================================
// HOOK
// =======================================

export function useResultSheet({
  classId,
  mode,
  batchId,
}: UseResultSheetProps) {
  const [loading, setLoading] = useState(true);

  const [savingDraft, setSavingDraft] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [scores, setScores] = useState<ResultState>({});

  // =======================================
  // INITIAL SCORE MATRIX
  // =======================================

  const createMatrix = useCallback(
    (studentRows: Student[], subjectRows: Subject[]) => {
      const matrix: ResultState = {};

      studentRows.forEach((student) => {
        matrix[student.id] = {};

        subjectRows.forEach((subject) => {
          matrix[student.id][subject.id] = {
            ca_score: "",
            exam_score: "",
            teacher_comment: "",
          };
        });
      });

      return matrix;
    },
    [],
  );

  // =======================================
  // LOAD STUDENTS + SUBJECTS
  // =======================================

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [studentList, subjectList] = await Promise.all([
        teacherService.getStudents(classId),
        teacherService.getSubjects(classId),
      ]);

      setStudents(studentList);
      setSubjects(subjectList);

      setScores(createMatrix(studentList, subjectList));
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ?? "Unable to load students and subjects.",
      );
    } finally {
      setLoading(false);
    }
  }, [classId, createMatrix]);

  useEffect(() => {
    if (!classId) return;

    void Promise.resolve().then(() => load());
  }, [classId, load]);
  // =======================================
  // UPDATE SCORE
  // =======================================

  const updateScore = useCallback(
    (
      studentId: string,
      subjectId: string,
      field: keyof ScoreCell,
      value: string,
    ) => {
      setScores((prev) => ({
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
    },
    [],
  );

  // =======================================
  // TOTAL
  // =======================================

  const getTotal = useCallback(
    (studentId: string, subjectId: string) => {
      const record = scores[studentId]?.[subjectId];

      if (!record) return 0;

      return calculateTotal(record.ca_score, record.exam_score);
    },
    [scores],
  );
  // =======================================
  // VALIDATION
  // =======================================

  const validate = useCallback(() => {
    for (const student of students) {
      for (const subject of subjects) {
        const score = scores[student.id][subject.id];

        if (score.ca_score !== "" && !validateCAScore(Number(score.ca_score))) {
          toast.error(
            `${student.first_name} - ${subject.name} CA must be between 0 and 40.`,
          );

          return false;
        }

        if (
          score.exam_score !== "" &&
          !validateExamScore(Number(score.exam_score))
        ) {
          toast.error(
            `${student.first_name} - ${subject.name} Exam must be between 0 and 60.`,
          );

          return false;
        }
      }
    }

    return true;
  }, [scores, students, subjects]);
  // =======================================
  // BUILD PAYLOAD
  // =======================================

  const buildPayload = useCallback((): ResultBatchCreate => {
    const studentsPayload: StudentResultInput[] = students.map((student) => {
      const subjectScores: SubjectScoreInput[] = subjects.map((subject) => {
        const score = scores[student.id][subject.id];

        return {
          subject_id: subject.id,
          ca_score: score.ca_score === "" ? 0 : Number(score.ca_score),

          exam_score: score.exam_score === "" ? 0 : Number(score.exam_score),

          teacher_comment: score.teacher_comment.trim() || undefined,
        };
      });

      return {
        student_id: student.id,
        scores: subjectScores,
      };
    });

    return {
      class_id: classId,
      students: studentsPayload,
    };
  }, [classId, students, subjects, scores]);
  // =======================================
  // SAVE DRAFT
  // =======================================

  const saveDraft = useCallback(async () => {
    if (!validate()) return;

    try {
      setSavingDraft(true);

      const payload = buildPayload();

      if (mode === "edit" && batchId) {
        await teacherService.updateBatch(batchId, payload);
      } else {
        await teacherService.saveDraft(payload);
      }

      toast.success("Draft saved successfully.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to save draft.");
    } finally {
      setSavingDraft(false);
    }
  }, [validate, buildPayload, mode, batchId]);
  // =======================================
  // SUBMIT RESULTS
  // =======================================

  const submit = useCallback(async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = buildPayload();

      if (mode === "edit" && batchId) {
        await teacherService.updateBatch(batchId, payload);

        await teacherService.resubmitResults(batchId);
      } else {
        await teacherService.submitResults(payload);
      }

      toast.success("Results submitted.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to submit results.");
    } finally {
      setSubmitting(false);
    }
  }, [validate, buildPayload, mode, batchId]);
  // =======================================
  // RESET
  // =======================================

  const resetSheet = useCallback(() => {
    setScores(createMatrix(students, subjects));
  }, [createMatrix, students, subjects]);
  // =======================================
  // STATISTICS
  // =======================================

  const statistics = useMemo(() => {
    let entered = 0;

    const expected = students.length * subjects.length;

    students.forEach((student) => {
      subjects.forEach((subject) => {
        const score = scores[student.id]?.[subject.id];

        if (score && score.ca_score !== "" && score.exam_score !== "") {
          entered++;
        }
      });
    });

    return {
      entered,
      expected,
      progress: expected === 0 ? 0 : Math.round((entered / expected) * 100),
    };
  }, [scores, students, subjects]);
  // =======================================
  // RETURN
  // =======================================

  return {
    loading,

    students,

    subjects,

    scores,

    savingDraft,

    submitting,

    statistics,

    updateScore,

    getTotal,

    saveDraft,

    submit,

    resetSheet,

    reload: load,
  };
}
