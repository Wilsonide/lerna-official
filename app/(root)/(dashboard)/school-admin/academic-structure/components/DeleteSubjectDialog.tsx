/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  SchoolSubject,
} from "@/app/services/academicSetup.service";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSubjectDialogProps {
  open: boolean;

  subject: SchoolSubject | null;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => Promise<void>;
}

export function DeleteSubjectDialog({
  open,
  subject,
  onOpenChange,
  onSuccess,
}: DeleteSubjectDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!subject) {
      return;
    }

    try {
      setLoading(true);

      await AcademicSetupService.deleteSubject(subject.id);

      toast.success("Subject deleted successfully.");

      await onSuccess();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Unable to delete subject.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{subject?.name}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(event) => {
              event.preventDefault();

              handleDelete();
            }}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
