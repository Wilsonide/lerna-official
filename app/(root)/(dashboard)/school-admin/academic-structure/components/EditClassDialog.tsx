/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  CLASS_LEVELS,
  ClassLevel,
  SchoolClass,
  UpdateClassRequest,
  formatLevel,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditClassDialogProps {
  open: boolean;

  schoolClass: SchoolClass | null;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => Promise<void>;
}

function createInitialForm(): UpdateClassRequest {
  return {
    name: "",
    level: "PRIMARY",
    sort_order: 1,
  };
}

export function EditClassDialog({
  open,
  schoolClass,
  onOpenChange,
  onSuccess,
}: EditClassDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<UpdateClassRequest>(createInitialForm());

  useEffect(() => {
    // Defer state updates to avoid synchronous setState inside effect which can
    // cause cascading renders. Using a microtask ensures the state update runs
    // after the current render.
    const id = setTimeout(() => {
      if (!schoolClass) {
        setForm(createInitialForm());
        return;
      }

      setForm({
        name: schoolClass.name,
        level: schoolClass.level as ClassLevel,
        sort_order: schoolClass.sort_order,
      });
    }, 0);

    return () => clearTimeout(id);
  }, [schoolClass]);

  async function handleSubmit() {
    if (!schoolClass) return;

    const name = (form.name ?? "").trim();

    if (!name) {
      toast.error("Class name is required.");
      return;
    }

    try {
      setLoading(true);

      await AcademicSetupService.updateClass(schoolClass.id, {
        ...form,
        name,
      });

      toast.success("Class updated successfully.");

      await onSuccess();

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Unable to update class.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>

          <DialogDescription>Update this class information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-class-name">Class Name</Label>

            <Input
              id="edit-class-name"
              value={form.name}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Class Level</Label>

            <Select
              value={form.level}
              onValueChange={(value) =>
                setForm((previous) => ({
                  ...previous,
                  level: value as ClassLevel,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class level" />
              </SelectTrigger>

              <SelectContent>
                {CLASS_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {formatLevel(level)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
