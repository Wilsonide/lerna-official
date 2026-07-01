"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Loader2,
  Eye,
  Pencil,
  FilePlus2,
} from "lucide-react";

import {
  teacherService,
  ResultStatusResponse,
} from "@/app/services/teacher.service";

type ClassItem = {
  id: string;
  name: string;
};

type DashboardClass = ClassItem & {
  result?: ResultStatusResponse;
};

export default function ResultsDashboardPage() {
  const [classes, setClasses] = useState<DashboardClass[]>([]);
  const [loading, setLoading] = useState(true);

  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboard = await teacherService.getDashboard();

      setSessionId(dashboard.active_session?.id ?? "");
      setTermId(dashboard.active_term?.id ?? "");

      const assignedClasses: ClassItem[] = dashboard.classes ?? [];

      const enriched = await Promise.all(
        assignedClasses.map(async (cls) => {
          try {
            const result = await teacherService.getResultStatus({
              classId: cls.id,
            });

            return {
              ...cls,
              result,
            };
          } catch {
            return {
              ...cls,
              result: {
                exists: false,
              },
            };
          }
        }),
      );

      setClasses(enriched);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadDashboard);
  }, []);

  function badge(status?: string) {
    switch (status) {
      case "APPROVED":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Approved
          </span>
        );

      case "SUBMITTED":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Submitted
          </span>
        );

      case "REJECTED":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Rejected
          </span>
        );

      case "PUBLISHED":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Published
          </span>
        );

      case "DRAFT":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Draft
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            No Submission
          </span>
        );
    }
  }

  function actionButton(item: DashboardClass) {
    const status = item.result?.status;

    if (!item.result?.exists || status === "DRAFT") {
      return (
        <Link
          href={`/teacher/results/create/${item.id}`}
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <FilePlus2 className="mr-2 h-4 w-4" />
          Enter Results
        </Link>
      );
    }

    if (status === "REJECTED") {
      return (
        <Link
          href={`/teacher/results/edit/${item.id}?sessionId=${sessionId}&termId=${termId}`}
          className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Batch
        </Link>
      );
    }

    return (
      <Link
        href={`/teacher/results/${item.id}?sessionId=${sessionId}&termId=${termId}`}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        <Eye className="mr-2 h-4 w-4" />
        View Results
      </Link>
    );
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Results Management</h1>

        <p className="mt-2 text-muted-foreground">
          Manage class result submissions and approval workflow.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-medium">Assigned Classes</span>
          </div>

          <h2 className="mt-5 text-4xl font-bold">{classes.length}</h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-green-600" />
            <span className="font-medium">Academic Session</span>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Active Session & Term loaded automatically.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="font-medium">Workflow</span>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Enter → Submit → Approve → Publish → Reject → Edit → Resubmit
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold">Assigned Classes</h2>
        </div>

        <div className="divide-y">
          {classes.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <div className="mt-3">{badge(item.result?.status)}</div>
              </div>

              <div>{actionButton(item)}</div>
            </div>
          ))}

          {classes.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              No assigned classes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
