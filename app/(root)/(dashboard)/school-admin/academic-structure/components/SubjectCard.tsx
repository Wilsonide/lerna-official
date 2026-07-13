"use client";

import { BookOpen, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface SubjectCardItem {
  id: string;

  name: string;

  code?: string | null;

  enabled: boolean;

  is_custom: boolean;
}

interface SubjectCardProps {
  subject: SubjectCardItem;

  saving?: boolean;

  onEdit: (subject: SubjectCardItem) => void;

  onDelete: (subject: SubjectCardItem) => void;
}

export function SubjectCard({
  subject,
  saving = false,
  onEdit,
  onDelete,
}: SubjectCardProps) {
  return (
    <Card
      className={`transition ${
        !subject.enabled ? "opacity-50" : "hover:border-primary"
      }`}
    >
      <CardContent className="flex items-start justify-between p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />

            <span className="font-medium">{subject.name}</span>

            {subject.is_custom && <Badge variant="secondary">Custom</Badge>}
          </div>

          {subject.code && (
            <p className="text-sm text-muted-foreground">{subject.code}</p>
          )}

          {!subject.enabled && <Badge variant="destructive">Disabled</Badge>}
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            disabled={saving}
            onClick={() => onEdit(subject)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            disabled={saving}
            onClick={() => onDelete(subject)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
