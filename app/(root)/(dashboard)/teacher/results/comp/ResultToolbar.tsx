"use client";

import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  BookOpen,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import SubjectTabs from "./SubjectTabs";
import { Subject } from "../components/types";

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

  subjects: Subject[];

  activeIndex: number;

  progressBySubject: Record<string, number>;

  onSubjectChange: (index: number) => void;
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

  subjects,
  activeIndex,
  progressBySubject,
  onSubjectChange,
}: ResultToolbarProps) {
  const completed = expected > 0 && entered === expected;

  function renderBadge() {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            <Clock3 className="h-4 w-4" />
            Draft
          </span>
        );

      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            <Clock3 className="h-4 w-4" />
            Awaiting Approval
          </span>
        );

      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            <FileCheck2 className="h-4 w-4" />
            Rejected
          </span>
        );

      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Approved
          </span>
        );

      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Published
          </span>
        );

      default:
        return null;
    }
  }

  return (
    <div className="sticky top-4 z-40 overflow-hidden rounded-2xl border bg-card shadow-sm backdrop-blur">
      <div className="space-y-6 p-5 md:p-6">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Result Workspace
              </h1>

              {renderBadge()}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "create" &&
                "Enter Continuous Assessment and Examination scores for each student."}

              {mode === "edit" &&
                "Update this draft or rejected result batch before resubmitting."}

              {mode === "view" &&
                "Viewing submitted or published student results."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            <Button variant="outline" onClick={onReload}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            {mode !== "view" && (
              <>
                <Button
                  variant="secondary"
                  disabled={savingDraft}
                  onClick={onSaveDraft}
                >
                  <Save className="mr-2 h-4 w-4" />

                  {savingDraft
                    ? mode === "edit"
                      ? "Updating..."
                      : "Saving..."
                    : mode === "edit"
                      ? "Update Draft"
                      : "Save Draft"}
                </Button>

                <Button disabled={!completed || submitting} onClick={onSubmit}>
                  <Send className="mr-2 h-4 w-4" />

                  {submitting
                    ? mode === "edit"
                      ? "Resubmitting..."
                      : "Submitting..."
                    : mode === "edit"
                      ? "Resubmit"
                      : "Submit Results"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Records Completed
                </p>

                <p className="text-2xl font-bold">
                  {entered}/{expected}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />

              <div className="w-full">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Completion Progress
                </p>

                <Progress value={progress} className="mt-2" />

                <p className="mt-2 text-sm font-medium">{progress}% Complete</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Workspace Status
                </p>

                <p className="text-lg font-semibold">
                  {completed ? "Ready for Submission" : "Work in Progress"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBJECT NAVIGATOR */}
        <div className="border-t pt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Subjects</h2>

              <p className="text-xs text-muted-foreground">
                Select a subject to enter or review results.
              </p>
            </div>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {subjects.length} Subject
              {subjects.length !== 1 && "s"}
            </span>
          </div>

          <SubjectTabs
            subjects={subjects}
            activeIndex={activeIndex}
            progressBySubject={progressBySubject}
            onChange={onSubjectChange}
          />
        </div>
      </div>
    </div>
  );
}
