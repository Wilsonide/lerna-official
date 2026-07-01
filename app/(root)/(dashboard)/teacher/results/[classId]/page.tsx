"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Pencil,
  AlertTriangle,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  teacherService,
  ClassResultResponse,
} from "@/app/services/teacher.service";

import { Button } from "@/components/ui/button";

type ActiveAcademic = {
  session?: { id: string; name: string } | null;
  term?: { id: string; name: string } | null;
};

export default function ResultViewPage() {
  const { classId } = useParams();
  const searchParams = useSearchParams();

  const urlSessionId = searchParams.get("sessionId") ?? undefined;
  const urlTermId = searchParams.get("termId") ?? undefined;

  const [loading, setLoading] = useState(true);
  const [academicLoading, setAcademicLoading] = useState(true);

  const [data, setData] = useState<ClassResultResponse | null>(null);
  const [academic, setAcademic] = useState<ActiveAcademic | null>(null);

  const [openStudent, setOpenStudent] = useState<string | null>(null);

  // ----------------------------
  // FETCH ACTIVE ACADEMIC
  // ----------------------------
  async function loadAcademic() {
    try {
      setAcademicLoading(true);

      const res = await teacherService.getActiveAcademic();
      setAcademic(res);
    } catch (err: any) {
      toast.error("Unable to load academic session");
    } finally {
      setAcademicLoading(false);
    }
  }

  // ----------------------------
  // FETCH RESULTS
  // ----------------------------
  async function load() {
    try {
      setLoading(true);

      const sessionId = urlSessionId ?? academic?.session?.id;
      const termId = urlTermId ?? academic?.term?.id;

      const result = await teacherService.getClassResults({
        classId: classId as string,
        sessionId,
        termId,
      });

      setData(result);

      if (result.students.length > 0) {
        setOpenStudent(result.students[0].student_id);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ?? "Unable to load class results",
      );
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------
  // INIT FLOW (IMPORTANT ORDER)
  // ----------------------------
  useEffect(() => {
    if (!classId) return;

    (async () => {
      await loadAcademic();
    })();
  }, [classId]);

  useEffect(() => {
    if (!classId) return;
    if (academicLoading) return;

    void Promise.resolve().then(() => load());
  }, [classId, academicLoading, urlSessionId, urlTermId]);

  function badgeClass(status?: string) {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-700";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  if (loading || academicLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        No result batch found.
      </div>
    );
  }

  const isRejected = data.status === "REJECTED";

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Class Results</h1>

            <p className="mt-2 text-muted-foreground">
              Session: {academic?.session?.name ?? "—"} | Term:{" "}
              {academic?.term?.name ?? "—"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={load}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            {isRejected && (
              <Link href={`/teacher/results/edit/${classId}`}>
                <Button>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Batch
                </Button>
              </Link>
            )}

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${badgeClass(
                data.status,
              )}`}
            >
              {data.status}
            </span>
          </div>
        </div>

        {isRejected && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />

              <div>
                <h3 className="font-semibold text-red-700">
                  Result Batch Rejected
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  This batch was rejected. Please edit and resubmit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STUDENTS */}
      {data.students.map((student) => (
        <div
          key={student.student_id}
          className="overflow-hidden rounded-xl border bg-white shadow-sm"
        >
          <button
            onClick={() =>
              setOpenStudent((prev) =>
                prev === student.student_id ? null : student.student_id,
              )
            }
            className="flex w-full items-center justify-between p-5 hover:bg-gray-50"
          >
            <div className="text-left">
              <h2 className="text-lg font-semibold">{student.student_name}</h2>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>🏆 #{student.position}</span>
                <span>Total: {student.total_score}</span>
                <span>Avg: {student.average_score}</span>
                <span>Pass: {student.passed_subjects}</span>
                <span>Fail: {student.failed_subjects}</span>
              </div>
            </div>

            {openStudent === student.student_id ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </button>

          {openStudent === student.student_id && (
            <div className="overflow-x-auto border-t">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-center">CA</th>
                    <th className="px-4 py-3 text-center">Exam</th>
                    <th className="px-4 py-3 text-center">Total</th>
                    <th className="px-4 py-3 text-center">Grade</th>
                    <th className="px-4 py-3 text-center">Remark</th>
                    <th className="px-4 py-3 text-left">Comment</th>
                  </tr>
                </thead>

                <tbody>
                  {student.subjects.map((subject) => (
                    <tr
                      key={subject.record_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {subject.subject_name}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {subject.ca_score}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {subject.exam_score}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold">
                        {subject.total_score}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                          {subject.grade}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {subject.remark}
                      </td>

                      <td className="px-4 py-3">
                        {subject.teacher_comment || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
