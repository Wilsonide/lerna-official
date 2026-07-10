/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  AcademicSetupService,
  AcademicTemplateResponse,
  ConfigureAcademicSetupRequest,
} from "@/app/services/academicSetup.service";

interface Props {
  templates: AcademicTemplateResponse[];
  onConfigured: () => Promise<void>;
}

export default function AcademicSetupWizard({
  templates,
  onConfigured,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");

  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId],
  );

  const [classes, setClasses] = useState<any[]>(() =>
    (templates[0]?.classes ?? []).map((cls) => ({
      template_class_id: cls.id,

      name: cls.name,

      level: cls.level,

      sort_order: cls.sort_order,

      enabled: true,

      subjects: cls.subjects.map((subject) => ({
        template_subject_id: subject.id,

        name: subject.name,

        code: subject.code,

        enabled: true,
      })),
    })),
  );

  function changeTemplate(id: string) {
    setTemplateId(id);

    const selected = templates.find((t) => t.id === id);

    if (!selected) return;

    setClasses(
      selected.classes.map((cls) => ({
        template_class_id: cls.id,

        name: cls.name,

        level: cls.level,

        sort_order: cls.sort_order,

        enabled: true,

        subjects: cls.subjects.map((subject) => ({
          template_subject_id: subject.id,

          name: subject.name,

          code: subject.code,

          enabled: true,
        })),
      })),
    );
  }

  function toggleClass(index: number) {
    setClasses((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  }

  function toggleSubject(classIndex: number, subjectIndex: number) {
    setClasses((prev) =>
      prev.map((cls, i) => {
        if (i !== classIndex) return cls;

        return {
          ...cls,

          subjects: cls.subjects.map((subject: any, sIndex: number) =>
            sIndex === subjectIndex
              ? {
                  ...subject,
                  enabled: !subject.enabled,
                }
              : subject,
          ),
        };
      }),
    );
  }

  async function save() {
    try {
      setSaving(true);

      const payload: ConfigureAcademicSetupRequest = {
        academic_template_id: templateId,

        classes,
      };

      await AcademicSetupService.configure(payload);

      toast.success("Academic setup completed.");

      await onConfigured();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ?? "Unable to configure school.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!template) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold text-lg">Academic Template</h2>

        <select
          className="mt-4 w-full rounded-lg border p-3"
          value={templateId}
          onChange={(e) => changeTemplate(e.target.value)}
        >
          {templates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {classes.map((schoolClass, classIndex) => (
          <div
            key={schoolClass.template_class_id}
            className="rounded-xl border bg-card"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold">{schoolClass.name}</h3>

                <p className="text-sm text-muted-foreground">
                  {schoolClass.level}
                </p>
              </div>

              <button
                onClick={() => toggleClass(classIndex)}
                className={`rounded-lg px-4 py-2 text-sm ${
                  schoolClass.enabled ? "bg-green-600 text-white" : "bg-muted"
                }`}
              >
                {schoolClass.enabled ? (
                  <Check className="h-4 w-4" />
                ) : (
                  "Disabled"
                )}
              </button>
            </div>

            <div className="grid gap-2 p-4 md:grid-cols-2">
              {schoolClass.subjects.map(
                (subject: any, subjectIndex: number) => (
                  <label
                    key={subject.template_subject_id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span>{subject.name}</span>

                    <input
                      type="checkbox"
                      checked={subject.enabled}
                      onChange={() => toggleSubject(classIndex, subjectIndex)}
                    />
                  </label>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={saving}
        onClick={save}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Configure School
      </button>
    </div>
  );
}
