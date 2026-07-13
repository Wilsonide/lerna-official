/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  SchoolSubject,
} from "@/app/services/academicSetup.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditSubjectDialogProps {
  open: boolean;

  subject: SchoolSubject | null;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => Promise<void>;
}

interface SubjectForm {
  name: string;

  code?: string | null;
}

function createInitialForm(): SubjectForm {
  return {
    name: "",
    code: "",
  };
}

export function EditSubjectDialog({
  open,
  subject,
  onOpenChange,
  onSuccess,
}: EditSubjectDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SubjectForm>(createInitialForm());

  useEffect(() => {
    // Avoid setting state synchronously inside the effect to prevent
    // cascading renders. Schedule the update asynchronously.
    const timer = setTimeout(() => {
      if (!subject) {
        setForm(createInitialForm());

        return;
      }

      setForm({
        name: subject.name,

        code: subject.code ?? "",
      });
    });

    return () => clearTimeout(timer);
  }, [subject]);

  async function handleSubmit() {
    if (!subject) {
      return;
    }

    const name = form.name.trim();

    if (!name) {
      toast.error("Subject name is required.");

      return;
    }

    try {
      setLoading(true);

      await AcademicSetupService.updateSubject(subject.id, {
        name,

        code: form.code?.trim() || null,
      });

      toast.success("Subject updated successfully.");

      await onSuccess();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Unable to update subject.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>

          <DialogDescription>Update subject information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-subject-name">Subject Name</Label>

            <Input
              id="edit-subject-name"
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,

                  name: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-subject-code">Subject Code</Label>

            <Input
              id="edit-subject-code"
              value={form.code ?? ""}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,

                  code: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
