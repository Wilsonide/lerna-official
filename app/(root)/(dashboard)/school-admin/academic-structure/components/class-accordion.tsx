"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Switch } from "@/components/ui/switch";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import { ConfigureClass } from "@/app/services/school-admin.service";

import SubjectSelector from "./subject-selector";

import TeacherSelector from "./teacher-selector";

interface Subject {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Props {
  value: ConfigureClass;

  subjects: Subject[];

  teachers: Teacher[];

  onChange: (value: ConfigureClass) => void;
}

export default function ClassAccordion({
  value,
  subjects,
  teachers,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const configured =
    value.subject_ids.length > 0 && value.teacher_ids.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader onClick={() => setOpen(!open)} className="cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {open ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}

            <div>
              <h3 className="font-semibold text-lg">{value.name}</h3>

              <p className="text-sm text-muted-foreground">{value.level}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={configured ? "default" : "secondary"}>
              {configured ? "Configured" : "Incomplete"}
            </Badge>

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2"
            >
              <Label>Enable</Label>

              <Switch
                checked={value.enabled}
                onCheckedChange={(checked) =>
                  onChange({
                    ...value,
                    enabled: checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-6">
          <Separator />

          <SubjectSelector
            subjects={subjects}
            selected={value.subject_ids}
            onChange={(ids) =>
              onChange({
                ...value,
                subject_ids: ids,
              })
            }
          />

          <TeacherSelector
            teachers={teachers}
            selected={value.teacher_ids}
            onChange={(ids) =>
              onChange({
                ...value,
                teacher_ids: ids,
              })
            }
          />

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Subjects</p>

                <h2 className="text-3xl font-bold">
                  {value.subject_ids.length}
                </h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Teachers</p>

                <h2 className="text-3xl font-bold">
                  {value.teacher_ids.length}
                </h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Status</p>

                <h2 className="font-semibold">
                  {configured ? "Ready" : "Needs Setup"}
                </h2>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
