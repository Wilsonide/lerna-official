"use client";

import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type WorkspaceMode = "create" | "edit" | "view";

type BatchStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

interface ResultToolbarProps {
  mode: WorkspaceMode;

  status?: BatchStatus;

  progress: number;

  entered: number;

  expected: number;

  savingDraft: boolean;

  submitting: boolean;

  onSaveDraft: () => void;

  onSubmit: () => void;

  onReload: () => void;
}

export default function ResultToolbar({
  mode,
  status,
  progress,
  entered,
  expected,
  savingDraft,
  submitting,
  onSaveDraft,
  onSubmit,
  onReload,
}: ResultToolbarProps) {
  const completed = expected > 0 && entered === expected;

  function renderBadge() {
    switch (status) {
      case "DRAFT":
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            <Clock3 className="h-4 w-4" />
            Draft
          </div>
        );

      case "REJECTED":
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            <FileCheck2 className="h-4 w-4" />
            Rejected
          </div>
        );

      case "SUBMITTED":
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            <Clock3 className="h-4 w-4" />
            Awaiting Approval
          </div>
        );

      case "APPROVED":
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Approved
          </div>
        );

      case "PUBLISHED":
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Published
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="sticky top-0 z-50 rounded-xl border bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">Student Result Workspace</h1>

            {renderBadge()}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "create" && "Enter results for each student."}

            {mode === "edit" &&
              "Modify the rejected or draft result batch before resubmitting."}

            {mode === "view" && "This result batch is read-only."}
          </p>

          <div className="mt-5">
            <Progress value={progress} />

            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>
                {entered} / {expected} completed
              </span>

              <span>{progress}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={onReload}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          {mode === "create" && (
            <>
              <Button
                variant="secondary"
                onClick={onSaveDraft}
                disabled={savingDraft}
              >
                <Save className="mr-2 h-4 w-4" />

                {savingDraft ? "Saving..." : "Save Draft"}
              </Button>

              <Button disabled={submitting || !completed} onClick={onSubmit}>
                <Send className="mr-2 h-4 w-4" />

                {submitting ? "Submitting..." : "Submit Results"}
              </Button>
            </>
          )}

          {mode === "edit" && (
            <>
              <Button
                variant="secondary"
                onClick={onSaveDraft}
                disabled={savingDraft}
              >
                <Save className="mr-2 h-4 w-4" />

                {savingDraft ? "Updating..." : "Update Draft"}
              </Button>

              <Button disabled={submitting || !completed} onClick={onSubmit}>
                <Send className="mr-2 h-4 w-4" />

                {submitting ? "Resubmitting..." : "Resubmit"}
              </Button>
            </>
          )}

          {mode === "view" && (
            <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              Viewing result batch
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
