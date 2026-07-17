"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  Pencil,
  Eye,
  Plus,
  BookOpen,
  Users,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import {
  teacherService,
  ResultStatusResponse,
} from "@/app/services/teacher.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardClass = {
  id: string;
  name: string;
  level?: string;
  students_count?: number;
  subjects_count?: number;
  result?: ResultStatusResponse;
};

export default function ResultsDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<DashboardClass[]>([]);

  const [sessionName, setSessionName] = useState("");

  const [termName, setTermName] = useState("");

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboard = await teacherService.getDashboard();

      setSessionName(dashboard.active_session?.name ?? "No Active Session");

      setTermName(dashboard.active_term?.name ?? "No Active Term");

      const enriched = await Promise.all(
        dashboard.classes.map(async (cls: DashboardClass) => {
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
    void Promise.resolve().then(() => loadDashboard());
  }, []);

  // ==========================================================
  // DASHBOARD STATS
  // ==========================================================

  const stats = useMemo(() => {
    return {
      total: classes.length,

      submitted: classes.filter((cls) => cls.result?.status === "SUBMITTED")
        .length,

      approved: classes.filter(
        (cls) =>
          cls.result?.status === "APPROVED" ||
          cls.result?.status === "PUBLISHED",
      ).length,

      rejected: classes.filter((cls) => cls.result?.status === "REJECTED")
        .length,

      pending: classes.filter(
        (cls) => !cls.result?.exists || cls.result?.status === "DRAFT",
      ).length,
    };
  }, [classes]);

  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  function badge(status?: string) {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            <Clock3 className="h-3.5 w-3.5" />
            Draft
          </span>
        );

      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Submitted
          </span>
        );

      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Approved
          </span>
        );

      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Published
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            Not Started
          </span>
        );
    }
  }

  // ==========================================================
  // ACTION BUTTON
  // ==========================================================

  function action(item: DashboardClass) {
    const status = item.result?.status;

    if (!item.result?.exists || status === "DRAFT") {
      return (
        <Link href={`/teacher/results/${item.id}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Start Results
          </Button>
        </Link>
      );
    }

    if (status === "REJECTED") {
      return (
        <Link href={`/teacher/results/${item.id}`}>
          <Button variant="destructive">
            <Pencil className="mr-2 h-4 w-4" />
            Review & Edit
          </Button>
        </Link>
      );
    }

    return (
      <Link href={`/teacher/results/${item.id}`}>
        <Button variant="secondary">
          <Eye className="mr-2 h-4 w-4" />
          View Results
        </Button>
      </Link>
    );
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />

          <div className="text-center">
            <p className="font-semibold">Loading Results Dashboard...</p>

            <p className="text-sm text-muted-foreground">
              Fetching your assigned classes.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* ==========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Results Management
            </h1>

            <p className="mt-2 text-muted-foreground">
              Create, update and monitor result submissions for all your
              assigned classes.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="rounded-xl border bg-muted/40 px-5 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Active Session
              </p>

              <p className="font-semibold">
                {sessionName} • {termName}
              </p>
            </div>

            <Button variant="outline" onClick={loadDashboard} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          STATISTICS
      ========================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Assigned Classes"
          value={stats.total}
          icon={<GraduationCap className="h-7 w-7 text-primary" />}
          border="border-l-primary"
        />

        <StatCard
          title="Pending Results"
          value={stats.pending}
          icon={<BookOpen className="h-7 w-7 text-yellow-600" />}
          border="border-l-yellow-500"
        />

        <StatCard
          title="Submitted"
          value={stats.submitted}
          icon={<ClipboardCheck className="h-7 w-7 text-blue-600" />}
          border="border-l-blue-500"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle2 className="h-7 w-7 text-green-600" />}
          border="border-l-green-500"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<AlertTriangle className="h-7 w-7 text-red-600" />}
          border="border-l-red-500"
        />
      </div>

      {/* ==========================================================
          CLASS LIST
      ========================================================== */}

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Assigned Classes</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Select a class to enter, edit or review student results.
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {classes.length} Classes
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
          {classes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <GraduationCap className="mb-5 h-14 w-14 text-muted-foreground" />

              <h3 className="text-xl font-semibold">No Assigned Classes</h3>

              <p className="mt-2 max-w-md text-muted-foreground">
                You currently don&apos;t have any assigned classes. Once classes
                are assigned to you, they&apos;ll appear here.
              </p>
            </div>
          ) : (
            classes.map((cls) => (
              <Card
                key={cls.id}
                className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{cls.name}</h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {cls.level ?? "Class"}
                      </p>
                    </div>

                    {badge(cls.result?.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-muted/40 p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />

                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Students
                          </p>

                          <p className="text-xl font-bold">
                            {cls.students_count ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-muted/40 p-4">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-primary" />

                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Subjects
                          </p>

                          <p className="text-xl font-bold">
                            {cls.subjects_count ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">{action(cls)}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   STAT CARD
========================================================== */

function StatCard({
  icon,
  title,
  value,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  border: string;
}) {
  return (
    <Card
      className={`border-l-4 ${border} transition-all duration-200 hover:shadow-md`}
    >
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">{value}</h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
