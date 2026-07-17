/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  teacherService,
  StudentResultInput,
  EditableResultResponse,
  ClassResultResponse,
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
  record_id?: string;

  ca_score: number | "";

  exam_score: number | "";

  teacher_comment: string;

  grade?: string;

  remark?: string;

  total_score?: number;
}

export type ScoreState = Record<string, Record<string, ScoreRecord>>;

export type WorkspaceMode = "create" | "edit" | "view";

interface Props {
  classId: string;
}

export function useResultWorkspace({ classId }: Props) {
  const [loading, setLoading] = useState(true);

  const [savingDraft, setSavingDraft] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [mode, setMode] = useState<WorkspaceMode>("create");

  const [batchId, setBatchId] = useState<string>();

  const [status, setStatus] = useState<string>();

  const [students, setStudents] = useState<Student[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [records, setRecords] = useState<ScoreState>({});
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);

  const progressBySubject = useMemo(() => {
    const result: Record<string, number> = {};

    subjects.forEach((subject) => {
      let completed = 0;

      students.forEach((student) => {
        const record = records[student.id]?.[subject.id];

        if (record && record.ca_score !== "" && record.exam_score !== "") {
          completed++;
        }
      });

      result[subject.id] =
        students.length === 0
          ? 0
          : Math.round((completed / students.length) * 100);
    });

    return result;
  }, [students, subjects, records]);

  // =====================================
  // BUILD EMPTY GRID
  // =====================================

  function createEmptyGrid(
    students: Student[],
    subjects: Subject[],
  ): ScoreState {
    const grid: ScoreState = {};

    students.forEach((student) => {
      grid[student.id] = {};

      subjects.forEach((subject) => {
        grid[student.id][subject.id] = {
          ca_score: "",
          exam_score: "",
          teacher_comment: "",
        };
      });
    });

    return grid;
  }

  // =====================================
  // LOAD CREATE MODE
  // =====================================

  const loadCreate = useCallback(async () => {
    const [studentRes, subjectRes] = await Promise.all([
      teacherService.getStudents(classId),
      teacherService.getSubjects(classId),
    ]);

    const students = studentRes ?? [];

    const subjects = subjectRes ?? [];

    setStudents(students);

    setSubjects(subjects);

    setRecords(createEmptyGrid(students, subjects));

    setMode("create");
  }, [classId]);

  // =====================================
  // LOAD EDIT MODE
  // =====================================

  const loadEditable = useCallback(async () => {
    const batch: EditableResultResponse =
      await teacherService.getEditableResults(classId);
    console.log(batch);

    const grid: ScoreState = {};

    const subjectMap = new Map<string, Subject>();

    const studentList: Student[] = [];

    batch.students.forEach((student) => {
      studentList.push({
        id: student.student_id,
        first_name: student.student_name.split(" ")[0],
        last_name: student.student_name.split(" ").slice(1).join(" "),
        admission_number: "",
      });

      grid[student.student_id] = {};

      student.subjects.forEach((record) => {
        subjectMap.set(record.subject_id, {
          id: record.subject_id,
          name: record.subject_name,
        });

        grid[student.student_id][record.subject_id] = {
          record_id: record.record_id,

          ca_score: record.ca_score,

          exam_score: record.exam_score,

          teacher_comment: record.teacher_comment ?? "",

          total_score: record.total_score,
        };
      });
    });

    setStudents(studentList);

    setSubjects(Array.from(subjectMap.values()));

    setRecords(grid);

    setBatchId(batch.batch_id);

    setStatus(batch.status);

    setMode("edit");
  }, []); // =====================================
  // LOAD VIEW MODE
  // =====================================

  const loadView = useCallback(async (batchId: string) => {
    const batch: ClassResultResponse = await teacherService.viewBatch(batchId);

    const grid: ScoreState = {};

    const studentList: Student[] = [];

    const subjectList: Subject[] = (batch.subjects ?? []).map((subject) => ({
      id: subject.subject_id,
      name: subject.subject_name,
    }));

    batch.students.forEach((student) => {
      studentList.push({
        id: student.student_id,
        first_name: student.student_name.split(" ")[0],
        last_name: student.student_name.split(" ").slice(1).join(" "),
        admission_number: "",
      });

      grid[student.student_id] = {};

      student.subjects.forEach((record) => {
        grid[student.student_id][record.subject_id] = {
          record_id: record.record_id,

          ca_score: record.ca_score,

          exam_score: record.exam_score,

          teacher_comment: record.teacher_comment ?? "",

          grade: record.grade,

          remark: record.remark,

          total_score: record.total_score,
        };
      });
    });

    setStudents(studentList);

    setSubjects(subjectList);

    setRecords(grid);

    setBatchId(batch.batch_id);

    setStatus(batch.status);

    setMode("view");
  }, []);

  // =====================================
  // INITIAL LOAD
  // =====================================

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const result = await teacherService.getResultStatus({
        classId,
      });

      if (!result.exists) {
        await loadCreate();
      } else if (result.status === "DRAFT" || result.status === "REJECTED") {
        await loadEditable();
      } else {
        await loadView(result.batch_id!);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ?? "Unable to load result workspace.",
      );
    } finally {
      setLoading(false);
    }
  }, [classId, loadCreate, loadEditable, loadView]);

  useEffect(() => {
    if (classId) {
      void Promise.resolve().then(() => load());
    }
  }, [classId, load]);

  // =====================================
  // UPDATE CELL
  // =====================================

  function updateCell(
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) {
    if (mode === "view") return;

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

  // =====================================
  // PROGRESS
  // =====================================

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

  // =====================================
  // PAYLOAD
  // =====================================

  const payload = useMemo<StudentResultInput[]>(() => {
    return students.map((student) => ({
      student_id: student.id,

      scores: subjects.map((subject) => {
        const score = records[student.id]?.[subject.id];

        return {
          subject_id: subject.id,

          ca_score: score?.ca_score === "" ? 0 : (score?.ca_score ?? 0),

          exam_score: score?.exam_score === "" ? 0 : (score?.exam_score ?? 0),

          teacher_comment: score?.teacher_comment ?? "",
        };
      }),
    }));
  }, [students, subjects, records]);

  // =====================================
  // ACTIONS
  // =====================================

  async function saveDraft() {
    try {
      setSavingDraft(true);

      await teacherService.saveDraft({
        class_id: classId,
        students: payload,
      });

      toast.success("Draft saved.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to save draft.");
    } finally {
      setSavingDraft(false);
    }
  }

  async function updateDraft() {
    if (!batchId) return;

    try {
      setSavingDraft(true);

      await teacherService.updateBatch(batchId, {
        class_id: classId,
        students: payload,
      });

      toast.success("Draft updated.");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to update draft.");
    } finally {
      setSavingDraft(false);
    }
  }

  async function submit() {
    try {
      setSubmitting(true);

      if (mode === "create") {
        await teacherService.submitResults({
          class_id: classId,
          students: payload,
        });
      } else {
        await teacherService.resubmitResults(batchId!);
      }

      toast.success("Results submitted.");

      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to submit results.");
    } finally {
      setSubmitting(false);
    }
  }

  // =====================================
  // RETURN
  // =====================================

  return {
    loading,

    mode,

    status,

    batchId,

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

    updateDraft,

    submit,

    reload: load,
    activeSubjectIndex,
    setActiveSubjectIndex,
    progressBySubject,
    activeSubject: subjects[activeSubjectIndex],
  };
}
