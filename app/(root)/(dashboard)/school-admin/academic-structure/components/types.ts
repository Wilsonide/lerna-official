import type { ClassLevel } from "@/app/services/academicSetup.service";

/* ===========================================================
 * DIALOG TYPES
 * =========================================================== */

export type AcademicDialogType =
  | "ADD_CLASS"
  | "EDIT_CLASS"
  | "DELETE_CLASS"
  | "ADD_SUBJECT"
  | "EDIT_SUBJECT"
  | "DELETE_SUBJECT"
  | null;

export interface DialogState {
  type: AcademicDialogType;

  classId?: string;

  subjectId?: string;
}

/* ===========================================================
 * LOCAL UI TYPES
 * =========================================================== */

export interface SubjectUI {
  id: string;

  name: string;

  code?: string | null;

  enabled: boolean;

  is_custom: boolean;
}

export interface ClassUI {
  id: string;

  name: string;

  level: ClassLevel;

  sort_order: number;

  is_custom: boolean;

  subjects: SubjectUI[];
}
