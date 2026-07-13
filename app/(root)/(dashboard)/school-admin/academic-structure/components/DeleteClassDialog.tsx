/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  SchoolClass,
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

interface DeleteClassDialogProps {
  open: boolean;

  schoolClass: SchoolClass | null;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => Promise<void>;
}

export function DeleteClassDialog({
  open,
  schoolClass,
  onOpenChange,
  onSuccess,
}: DeleteClassDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!schoolClass) {
      return;
    }

    try {
      setLoading(true);

      await AcademicSetupService.deleteClass(schoolClass.id);

      toast.success("Class deleted successfully.");

      await onSuccess();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Unable to delete class.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Class</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{schoolClass?.name}</span>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!loading && <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
