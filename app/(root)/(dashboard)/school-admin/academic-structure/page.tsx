"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Loader2,
  Save,
  Plus,
  Trash2,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import {
  AcademicSetupService,
  AcademicTemplateResponse,
  ConfigureAcademicSetupRequest,
  ConfigureClassRequest,
  ConfigureSubjectRequest,
} from "@/app/services/academicSetup.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ===========================================================
   LOCAL TYPES
=========================================================== */

interface EditableSubject {
  id?: string;

  template_subject_id?: string | null;

  name: string;

  code?: string | null;

  enabled: boolean;

  is_custom: boolean;
}

interface EditableClass {
  id?: string;

  template_class_id?: string | null;

  name: string;

  level: string;

  sort_order: number;

  enabled: boolean;

  is_custom: boolean;

  subjects: EditableSubject[];
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function AcademicSetupPage() {
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [templates, setTemplates] = useState<AcademicTemplateResponse[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >();

  const [classes, setClasses] = useState<EditableClass[]>([]);

  const [configured, setConfigured] = useState(false);

  /* =======================================================
      LOAD INITIAL DATA
  ======================================================= */

  useEffect(() => {
    void loadPage();
  }, []);

  async function loadPage() {
    try {
      setLoading(true);

      const [templateResponse, schoolSetup] = await Promise.all([
        AcademicSetupService.getTemplates(),
        AcademicSetupService.getSchoolSetup(),
      ]);

      setTemplates(templateResponse);

      if (schoolSetup.configured) {
        setConfigured(true);

        setClasses(
          schoolSetup.classes.map((cls) => ({
            id: cls.id,

            /*
              IMPORTANT:
              keep template ids.
              Backend uses these for diff matching.
            */
            template_class_id: cls.template_class_id ?? null,

            name: cls.name,

            level: cls.level,

            sort_order: cls.sort_order,

            enabled: true,

            is_custom: cls.template_class_id === null,

            subjects: cls.subjects.map((subject) => ({
              id: subject.id,

              template_subject_id: subject.template_subject_id ?? null,

              name: subject.name,

              code: subject.code,

              enabled: true,

              is_custom: subject.template_subject_id === null,
            })),
          })),
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ?? "Unable to load academic setup.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
      TEMPLATE SELECT
  ======================================================= */

  const selectedTemplate = useMemo(() => {
    return templates.find((item) => item.id === selectedTemplateId) ?? null;
  }, [templates, selectedTemplateId]);

  function selectTemplate(template: AcademicTemplateResponse) {
    if (configured) {
      toast.info("Setup already exists. Edit the existing classes.");

      return;
    }

    setSelectedTemplateId(template.id);

    const mapped: EditableClass[] = template.classes.map((cls) => ({
      template_class_id: cls.id,

      name: cls.name,

      level: cls.level,

      sort_order: cls.sort_order,

      enabled: true,

      is_custom: false,

      subjects: cls.subjects.map((subject) => ({
        template_subject_id: subject.id,

        name: subject.name,

        code: subject.code,

        enabled: true,

        is_custom: false,
      })),
    }));

    setClasses(mapped);
  }
  /* =======================================================
      CLASS HANDLERS
  ======================================================= */

  function updateClass(index: number, updates: Partial<EditableClass>) {
    setClasses((previous) =>
      previous.map((item, i) =>
        i === index
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  }

  function toggleClass(index: number, checked: boolean) {
    setClasses((previous) =>
      previous.map((item, i) => {
        if (i !== index) return item;

        return {
          ...item,

          enabled: checked,

          /*
            Keep subjects in sync.
            Backend diff update reads enabled flag.
          */
          subjects: item.subjects.map((subject) => ({
            ...subject,

            enabled: checked,
          })),
        };
      }),
    );
  }

  function addClass() {
    setClasses((previous) => [
      ...previous,

      {
        id: undefined,

        template_class_id: null,

        name: "",

        level: "PRIMARY",

        sort_order: previous.length + 1,

        enabled: true,

        is_custom: true,

        subjects: [],
      },
    ]);
  }

  function removeClass(index: number) {
    /*
      Do not remove existing classes.
      Disable them so backend can delete.
    */

    setClasses((previous) =>
      previous.map((item, i) => {
        if (i !== index) return item;

        return {
          ...item,

          enabled: false,

          subjects: item.subjects.map((subject) => ({
            ...subject,

            enabled: false,
          })),
        };
      }),
    );
  }

  /* =======================================================
      SUBJECT HANDLERS
  ======================================================= */

  function updateSubject(
    classIndex: number,
    subjectIndex: number,
    updates: Partial<EditableSubject>,
  ) {
    setClasses((previous) =>
      previous.map((schoolClass, i) => {
        if (i !== classIndex) return schoolClass;

        return {
          ...schoolClass,

          subjects: schoolClass.subjects.map((subject, j) =>
            j === subjectIndex
              ? {
                  ...subject,
                  ...updates,
                }
              : subject,
          ),
        };
      }),
    );
  }

  function toggleSubject(
    classIndex: number,
    subjectIndex: number,
    checked: boolean,
  ) {
    setClasses((previous) =>
      previous.map((schoolClass, i) => {
        if (i !== classIndex) return schoolClass;

        const subjects = schoolClass.subjects.map((subject, j) =>
          j === subjectIndex
            ? {
                ...subject,
                enabled: checked,
              }
            : subject,
        );

        return {
          ...schoolClass,

          enabled: subjects.some((subject) => subject.enabled),

          subjects,
        };
      }),
    );
  }

  function addSubject(classIndex: number) {
    setClasses((previous) =>
      previous.map((schoolClass, i) => {
        if (i !== classIndex) return schoolClass;

        return {
          ...schoolClass,

          subjects: [
            ...schoolClass.subjects,

            {
              id: undefined,

              template_subject_id: null,

              name: "",

              code: "",

              enabled: true,

              is_custom: true,
            },
          ],
        };
      }),
    );
  }

  function removeSubject(classIndex: number, subjectIndex: number) {
    setClasses((previous) =>
      previous.map((schoolClass, i) => {
        if (i !== classIndex) return schoolClass;

        return {
          ...schoolClass,

          subjects: schoolClass.subjects.map((subject, j) =>
            j === subjectIndex
              ? {
                  ...subject,

                  enabled: false,
                }
              : subject,
          ),
        };
      }),
    );
  }

  /* =======================================================
      SUMMARY
  ======================================================= */

  const classCount = useMemo(
    () => classes.filter((item) => item.enabled).length,

    [classes],
  );

  const subjectCount = useMemo(
    () =>
      classes.reduce(
        (total, item) =>
          total + item.subjects.filter((subject) => subject.enabled).length,

        0,
      ),

    [classes],
  );

  /* =======================================================
      BUILD DIFF PAYLOAD
  ======================================================= */

  function buildPayload(): ConfigureAcademicSetupRequest {
    if (!selectedTemplateId && !configured) {
      throw new Error("Please select an academic template.");
    }

    return {
      academic_template_id: selectedTemplateId ?? "",

      classes: classes.map<ConfigureClassRequest>((schoolClass) => ({
        template_class_id: schoolClass.template_class_id ?? null,

        name: schoolClass.name.trim(),

        level: schoolClass.level,

        sort_order: schoolClass.sort_order,

        enabled: schoolClass.enabled,

        is_custom: schoolClass.is_custom,

        subjects: schoolClass.subjects.map<ConfigureSubjectRequest>(
          (subject) => ({
            template_subject_id: subject.template_subject_id ?? null,

            name: subject.name.trim(),

            code: subject.code?.trim() ? subject.code.trim() : null,

            enabled: subject.enabled,

            is_custom: subject.is_custom,
          }),
        ),
      })),
    };
  }

  /* =======================================================
      SAVE
  ======================================================= */

  async function handleSave() {
    try {
      setSaving(true);

      const payload = buildPayload();

      const response = configured
        ? await AcademicSetupService.updateSetup(payload)
        : await AcademicSetupService.configure(payload);

      toast.success(response.message);

      await loadPage();
    } catch (error: any) {
      console.error(error?.response?.data?.detail);

      toast.error(
        error?.response?.data?.detail ?? "Unable to save academic setup.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
      LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Setup</h1>

          <p className="mt-2 text-muted-foreground">
            Configure your school classes and subjects.
          </p>
        </div>

        <div className="flex gap-3">
          {!configured && (
            <Button variant="outline" onClick={addClass}>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Class
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={saving || (!configured && !selectedTemplateId)}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Setup
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Academic Template</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />

              <span className="font-semibold">
                {configured
                  ? "Configured"
                  : (selectedTemplate?.name ?? "None Selected")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{classCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{subjectCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* ==================================================
          TEMPLATE SELECTION
      ================================================== */}

      {!configured && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Curriculum Template</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const active = template.id === selectedTemplateId;

                return (
                  <Card
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`cursor-pointer transition-all ${
                      active
                        ? "border-2 border-primary"
                        : "hover:border-primary"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {template.description ?? "Academic curriculum template"}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4" />

                        {template.classes.length}

                        {" Classes"}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      {/* ==================================================
          CLASSES
      ================================================== */}

      <Accordion type="multiple" className="space-y-4">
        {classes.map((schoolClass, classIndex) => (
          <AccordionItem
            key={
              schoolClass.id ?? `${schoolClass.template_class_id}-${classIndex}`
            }
            value={`class-${classIndex}`}
            className="rounded-lg border"
          >
            <AccordionTrigger className="px-4">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={schoolClass.enabled}
                    onCheckedChange={(checked) =>
                      toggleClass(classIndex, checked === true)
                    }
                    onClick={(event) => event.stopPropagation()}
                  />

                  <div className="flex flex-col text-left">
                    <Input
                      value={schoolClass.name}
                      disabled={saving}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        updateClass(classIndex, {
                          name: event.target.value,
                        })
                      }
                      className="w-56"
                    />

                    <span className="mt-1 text-xs text-muted-foreground">
                      {schoolClass.level}

                      {schoolClass.is_custom && " • Custom"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {
                      schoolClass.subjects.filter((subject) => subject.enabled)
                        .length
                    }

                    {" / "}

                    {schoolClass.subjects.length}

                    {" Subjects"}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();

                      addSubject(classIndex);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Subject
                  </Button>

                  {schoolClass.is_custom && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={(event) => {
                        event.stopPropagation();

                        removeClass(classIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-3">
                {schoolClass.subjects.map((subject, subjectIndex) => (
                  <Card
                    key={
                      subject.id ??
                      `${subject.template_subject_id}-${subjectIndex}`
                    }
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Checkbox
                            checked={subject.enabled}
                            onCheckedChange={(checked) =>
                              toggleSubject(
                                classIndex,

                                subjectIndex,

                                checked === true,
                              )
                            }
                          />

                          {subject.is_custom && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                removeSubject(
                                  classIndex,

                                  subjectIndex,
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <Label>Subject Name</Label>

                          <Input
                            value={subject.name}
                            onChange={(event) =>
                              updateSubject(
                                classIndex,

                                subjectIndex,

                                {
                                  name: event.target.value,
                                },
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Code</Label>

                          <Input
                            placeholder="Optional"
                            value={subject.code ?? ""}
                            onChange={(event) =>
                              updateSubject(
                                classIndex,

                                subjectIndex,

                                {
                                  code: event.target.value,
                                },
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {classes.length === 0 && (
        <Card>
          <CardContent className="flex h-48 flex-col items-center justify-center gap-4">
            <BookOpen className="h-10 w-10 text-muted-foreground" />

            <div className="text-center">
              <h3 className="text-lg font-semibold">No Classes Available</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {configured
                  ? "Your school has no classes configured."
                  : "Select a template or create a custom class."}
              </p>
            </div>

            {!configured && (
              <Button onClick={addClass}>
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Class
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
