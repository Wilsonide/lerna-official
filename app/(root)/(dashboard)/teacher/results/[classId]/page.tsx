"use client";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import { useResultWorkspace } from "@/app/hooks/useResultWorkspace";

import ResultToolbar from "../comp/ResultToolbar";
import ResultGrid from "../comp/ResultGrid";
import { BatchStatus } from "../components/types";

export default function ResultWorkspacePage() {
  const params = useParams();

  const classId = params.classId as string;

  const workspace = useResultWorkspace({
    classId,
  });

  if (workspace.loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-10 md:p-6">
      <ResultToolbar
        mode={workspace.mode}
        status={workspace.status as BatchStatus | undefined}
        progress={workspace.progress}
        entered={workspace.entered}
        expected={workspace.expected}
        savingDraft={workspace.savingDraft}
        submitting={workspace.submitting}
        onSaveDraft={
          workspace.mode === "create"
            ? workspace.saveDraft
            : workspace.updateDraft
        }
        onSubmit={workspace.submit}
        onReload={workspace.reload}
        subjects={workspace.subjects}
        activeIndex={workspace.activeSubjectIndex}
        progressBySubject={workspace.progressBySubject}
        onSubjectChange={workspace.setActiveSubjectIndex}
      />

      <ResultGrid
        editable={workspace.mode !== "view"}
        students={workspace.students}
        subject={workspace.activeSubject}
        records={workspace.records}
        updateCell={workspace.updateCell}
      />
    </div>
  );
}
