export type WorkspaceMode = "create" | "edit" | "view";

export type BatchStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

export interface Student {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface ScoreRecord {
  ca_score: number | "";
  exam_score: number | "";
  teacher_comment: string;
}

export type ScoreState = Record<string, Record<string, ScoreRecord>>;
