/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AcademicSetupService,
  CLASS_LEVELS,
  ClassLevel,
  CreateClassRequest,
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

interface AddClassDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => Promise<void>;

  defaultSortOrder?: number;
}

function createInitialForm(sortOrder: number): CreateClassRequest {
  return {
    name: "",
    level: "PRIMARY",
    sort_order: sortOrder,
  };
}

export function AddClassDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultSortOrder = 1,
}: AddClassDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateClassRequest>(
    createInitialForm(defaultSortOrder),
  );

  function handleDialogOpenChange(value: boolean) {
    if (!value) {
      setForm(createInitialForm(defaultSortOrder));
    }

    onOpenChange(value);
  }

  async function handleSubmit() {
    const name = form.name.trim();

    if (!name) {
      toast.error("Class name is required.");
      return;
    }

    try {
      setLoading(true);

      await AcademicSetupService.createClass({
        ...form,
        name,
      });

      toast.success("Class created successfully.");

      await onSuccess();

      handleDialogOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? "Unable to create class.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Custom Class</DialogTitle>

          <DialogDescription>
            Create a new custom class for your school.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="class-name">Class Name</Label>

            <Input
              id="class-name"
              placeholder="Primary 4"
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
            onClick={() => handleDialogOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
