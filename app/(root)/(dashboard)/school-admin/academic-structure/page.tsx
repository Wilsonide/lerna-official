/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Save, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAcademicSetup } from "@/app/hooks/useAcademicSetup";
import { AcademicSummary } from "./components/AcademicSummary";
import { TemplateSelector } from "./components/TemplateSelector";
import { ClassAccordion } from "./components/ClassAccordion";
import { AddClassDialog } from "./components/AddClassDialog";
import { EditClassDialog } from "./components/EditClassDialog";
import { DeleteSubjectDialog } from "./components/DeleteSubjectDialog";
import { EditSubjectDialog } from "./components/EditSubjectDialog";
import { AddSubjectDialog } from "./components/AddSubjectDialog";
import { DeleteClassDialog } from "./components/DeleteClassDialog";

export default function AcademicSetupPage() {
  const academic = useAcademicSetup();

  const classCount = academic.classes.length;

  const subjectCount = academic.classes.reduce(
    (total, cls) => total + cls.subjects.length,
    0,
  );

  const selectedClass = academic.dialog.classId
    ? academic.classes.find((cls) => cls.id === academic.dialog.classId)
    : null;

  const selectedSubject =
    selectedClass && academic.dialog.subjectId
      ? selectedClass.subjects.find(
          (subject) => subject.id === academic.dialog.subjectId,
        )
      : null;

  if (academic.loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Academic Setup</h1>

          <p className="text-muted-foreground">
            Configure your school&apos;s classes and subjects.
          </p>
        </div>

        <div className="flex gap-3">
          {academic.setup?.configured && (
            <Button
              variant="outline"
              onClick={academic.openAddClass}
              disabled={academic.saving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          )}

          {!academic.setup?.configured && (
            <Button
              onClick={academic.saveSetup}
              disabled={academic.saving || !academic.classes.length}
            >
              {academic.saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Configure School
            </Button>
          )}
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <AcademicSummary
        configured={academic.setup?.configured ?? false}
        classCount={classCount}
        subjectCount={subjectCount}
      />

      {/* =====================================================
          TEMPLATE PICKER
      ===================================================== */}

      <TemplateSelector
        templates={academic.templates}
        selectedTemplateId={academic.selectedTemplateId}
        configured={academic.setup?.configured ?? false}
        onSelect={academic.selectTemplate}
      />

      {/* =====================================================
          CLASSES
      ===================================================== */}

      <ClassAccordion
        classes={academic.classes}
        saving={academic.saving}
        onEditClass={academic.openEditClass}
        onDeleteClass={academic.openDeleteClass}
        onAddSubject={academic.openAddSubject}
        onEditSubject={academic.openEditSubject}
        onDeleteSubject={academic.openDeleteSubject}
      />

      {/* =====================================================
          DIALOGS
      ===================================================== */}

      <AddClassDialog
        open={academic.dialog.type === "ADD_CLASS"}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
        defaultSortOrder={academic.classes.length + 1}
      />

      <EditClassDialog
        open={academic.dialog.type === "EDIT_CLASS"}
        schoolClass={selectedClass as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <DeleteClassDialog
        open={academic.dialog.type === "DELETE_CLASS"}
        schoolClass={selectedClass as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <AddSubjectDialog
        open={academic.dialog.type === "ADD_SUBJECT"}
        schoolClass={selectedClass as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <EditSubjectDialog
        open={academic.dialog.type === "EDIT_SUBJECT"}
        subject={selectedSubject as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />

      <DeleteSubjectDialog
        open={academic.dialog.type === "DELETE_SUBJECT"}
        subject={selectedSubject as any}
        onOpenChange={(open) => {
          if (!open) {
            academic.closeDialog();
          }
        }}
        onSuccess={academic.refresh}
      />
    </div>
  );
}
