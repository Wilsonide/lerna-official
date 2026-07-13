"use client";

import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatLevel } from "@/app/services/academicSetup.service";

import { SubjectCard } from "./SubjectCard";
import { ClassUI, SubjectUI } from "./types";

export type SubjectCardItem = SubjectUI;

export type AcademicClass = ClassUI;

interface ClassAccordionProps {
  classes: AcademicClass[];

  saving?: boolean;

  onEditClass: (schoolClass: AcademicClass) => void;

  onDeleteClass: (schoolClass: AcademicClass) => void;

  onAddSubject: (schoolClass: AcademicClass) => void;

  onEditSubject: (schoolClass: AcademicClass, subject: SubjectCardItem) => void;

  onDeleteSubject: (
    schoolClass: AcademicClass,
    subject: SubjectCardItem,
  ) => void;
}

export function ClassAccordion({
  classes,
  saving,

  onEditClass,

  onDeleteClass,

  onAddSubject,

  onEditSubject,

  onDeleteSubject,
}: ClassAccordionProps) {
  if (!classes.length) {
    return null;
  }

  return (
    <Accordion type="multiple" className="space-y-4">
      {classes.map((schoolClass) => (
        <AccordionItem
          key={schoolClass.id}
          value={schoolClass.id}
          className="rounded-xl border"
        >
          <AccordionTrigger className="px-5">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{schoolClass.name}</h3>

                  <Badge>{formatLevel(schoolClass.level)}</Badge>

                  {schoolClass.is_custom && (
                    <Badge variant="secondary">Custom</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />

                  {schoolClass.subjects.length}
                  {" Subjects"}
                </div>
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => onAddSubject(schoolClass)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Subject
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  disabled={saving}
                  onClick={() => onEditClass(schoolClass)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  disabled={saving}
                  onClick={() => onDeleteClass(schoolClass)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3">
              {schoolClass.subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  saving={saving}
                  onEdit={() => onEditSubject(schoolClass, subject)}
                  onDelete={() => onDeleteSubject(schoolClass, subject)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
