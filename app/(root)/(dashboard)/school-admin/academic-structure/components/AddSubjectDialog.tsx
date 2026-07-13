/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  CreateSubjectRequest,
  SchoolClass,
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

interface AddSubjectDialogProps {
  open: boolean;

  schoolClass: SchoolClass | null;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => Promise<void>;
}

function initialForm(): CreateSubjectRequest {
  return {
    name: "",
    code: "",
  };
}

export function AddSubjectDialog({
  open,
  schoolClass,
  onOpenChange,
  onSuccess,
}: AddSubjectDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateSubjectRequest>(initialForm());

  function handleOpenChange(value: boolean) {
    if (!value) {
      setForm(initialForm());
    }

    onOpenChange(value);
  }

  async function handleSubmit() {
    const name = form.name.trim();

    if (!name) {
      toast.error("Subject name is required.");

      return;
    }

    if (!schoolClass) {
      toast.error("No class selected.");

      return;
    }

    try {
      setLoading(true);

      /*
        1. Create subject
      */

      const createdSubject = await AcademicSetupService.createSubject({
        name,

        code: form.code?.trim() || null,
      });

      /*
        2. Attach subject to selected class
      */

      await AcademicSetupService.assignSubjects(schoolClass.id, {
        subject_ids: [
          ...schoolClass.subjects.map((subject) => subject.id),

          createdSubject.id,
        ],
      });

      toast.success("Subject added successfully.");

      await onSuccess();

      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Unable to add subject.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>

          <DialogDescription>
            Add a new subject to{" "}
            <span className="font-semibold">{schoolClass?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>

            <Input
              id="subject-name"
              placeholder="Mathematics"
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
            <Label htmlFor="subject-code">Subject Code</Label>

            <Input
              id="subject-code"
              placeholder="MATH"
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
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
