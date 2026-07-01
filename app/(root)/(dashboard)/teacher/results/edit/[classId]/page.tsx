"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import {
  Loader2,
  Save,
  RefreshCcw,
  Send,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";

import {
  teacherService,
  EditableResultResponse,
} from "@/app/services/teacher.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EditableRecord = {
  ca_score: number | "";
  exam_score: number | "";
  teacher_comment: string;
  saving: boolean;
  dirty: boolean;
};

function computeTotal(ca: number | "", exam: number | "") {
  const caNum = ca === "" ? 0 : Number(ca);
  const exNum = exam === "" ? 0 : Number(exam);
  return caNum + exNum;
}

function computeGrade(total: number) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

export default function EditResultsPage() {
  const { classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);

  const [batch, setBatch] = useState<EditableResultResponse | null>(null);
  const [openStudent, setOpenStudent] = useState<string | null>(null);

  const [records, setRecords] = useState<Record<string, EditableRecord>>({});

  async function load() {
    try {
      setLoading(true);

      const data = await teacherService.getEditableResults(classId as string);

      setBatch(data);

      const state: Record<string, EditableRecord> = {};

      data.students.forEach((student) => {
        student.subjects.forEach((subject: any) => {
          state[subject.record_id] = {
            ca_score: subject.ca_score ?? "",
            exam_score: subject.exam_score ?? "",
            teacher_comment: subject.teacher_comment ?? "",
            saving: false,
            dirty: false,
          };
        });
      });

      setRecords(state);

      if (data.students.length && !openStudent) {
        setOpenStudent(data.students[0].student_id);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to load batch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!classId) return;
    void Promise.resolve().then(() => load());
  }, [classId]);

  function updateField(
    recordId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: any,
  ) {
    setRecords((prev) => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        [field]: value,
        dirty: true,
      },
    }));
  }

  async function saveRecord(recordId: string) {
    const record = records[recordId];
    if (!record) return;

    setRecords((prev) => ({
      ...prev,
      [recordId]: { ...prev[recordId], saving: true },
    }));

    try {
      await teacherService.updateResultRecord(recordId, {
        ca_score: record.ca_score === "" ? 0 : Number(record.ca_score),
        exam_score: record.exam_score === "" ? 0 : Number(record.exam_score),
        teacher_comment: record.teacher_comment,
      });

      setRecords((prev) => ({
        ...prev,
        [recordId]: {
          ...prev[recordId],
          saving: false,
          dirty: false,
        },
      }));

      toast.success("Saved");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to save record");

      setRecords((prev) => ({
        ...prev,
        [recordId]: { ...prev[recordId], saving: false },
      }));
    }
  }

  async function saveAll() {
    const dirty = Object.entries(records).filter(([, v]) => v.dirty);

    if (!dirty.length) return toast.info("Nothing to save");

    setSavingAll(true);

    try {
      await Promise.all(dirty.map(([id]) => saveRecord(id)));
      toast.success("All changes saved");
    } finally {
      setSavingAll(false);
    }
  }

  async function resubmit() {
    if (!batch) return;

    const unsaved = Object.values(records).filter((r) => r.dirty);

    if (unsaved.length) {
      return toast.error("Save all changes before resubmitting.");
    }

    try {
      setResubmitting(true);

      await teacherService.resubmitResults(batch.batch_id);

      toast.success("Resubmitted successfully");

      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Unable to resubmit");
    } finally {
      setResubmitting(false);
    }
  }

  const dirtyCount = useMemo(
    () => Object.values(records).filter((x) => x.dirty).length,
    [records],
  );

  function badgeColor() {
    switch (batch?.status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-700";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        No editable batch found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="rounded-xl border bg-white shadow-sm p-6">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/teacher/results/${classId}`}
              className="text-sm text-muted-foreground"
            >
              <ArrowLeft className="inline h-4 w-4 mr-1" />
              Back
            </Link>

            <h1 className="text-2xl font-bold">Edit Result Batch</h1>
          </div>

          <div className="flex gap-2">
            <Button onClick={load}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button onClick={saveAll} disabled={savingAll || dirtyCount === 0}>
              <Save className="h-4 w-4 mr-2" />
              Save ({dirtyCount})
            </Button>

            <Button
              onClick={resubmit}
              disabled={resubmitting || dirtyCount > 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Resubmit
            </Button>

            <span className={`px-3 py-1 rounded ${badgeColor()}`}>
              {batch.status}
            </span>
          </div>
        </div>
      </div>

      {/* STUDENTS */}
      {batch.students.map((student) => (
        <div key={student.student_id} className="border rounded-xl bg-white">
          <button
            className="w-full flex justify-between p-4"
            onClick={() =>
              setOpenStudent((prev) =>
                prev === student.student_id ? null : student.student_id,
              )
            }
          >
            <div>
              <h2 className="font-semibold">{student.student_name}</h2>

              <p className="text-sm text-muted-foreground">
                {student.subjects?.length ?? 0} subjects
              </p>
            </div>

            {openStudent === student.student_id ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </button>

          {openStudent === student.student_id && (
            <div className="border-t overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Subject</th>
                    <th className="p-2">CA</th>
                    <th className="p-2">Exam</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Grade</th>
                    <th className="p-2">Comment</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {student.subjects.map((s: any) => {
                    const r = records[s.record_id];

                    const total = computeTotal(
                      r?.ca_score ?? "",
                      r?.exam_score ?? "",
                    );

                    const grade = computeGrade(total);

                    return (
                      <tr key={s.record_id} className="border-t">
                        <td className="p-2 font-medium">{s.subject_name}</td>

                        <td className="p-2">
                          <Input
                            value={r?.ca_score ?? ""}
                            onChange={(e) =>
                              updateField(
                                s.record_id,
                                "ca_score",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td className="p-2">
                          <Input
                            value={r?.exam_score ?? ""}
                            onChange={(e) =>
                              updateField(
                                s.record_id,
                                "exam_score",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td className="p-2 text-center font-semibold">
                          {total}
                        </td>

                        <td className="p-2 text-center font-bold">{grade}</td>

                        <td className="p-2">
                          <Input
                            value={r?.teacher_comment ?? ""}
                            onChange={(e) =>
                              updateField(
                                s.record_id,
                                "teacher_comment",
                                e.target.value,
                              )
                            }
                          />
                        </td>

                        <td className="p-2">
                          <Button
                            size="sm"
                            onClick={() => saveRecord(s.record_id)}
                            disabled={r?.saving}
                          >
                            {r?.saving ? "Saving..." : "Save"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
