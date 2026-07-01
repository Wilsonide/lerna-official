export interface SchoolClass {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface ScoreEntry {
  ca_score: number;
  exam_score: number;
  teacher_comment: string;
}

export type ScoresState = Record<string, Record<string, ScoreEntry>>;
