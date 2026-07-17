// ==========================================
// GRADE HELPERS
// ==========================================

export function calculateTotal(
  ca: number | string,
  exam: number | string,
): number {
  const caScore = Number(ca || 0);
  const examScore = Number(exam || 0);

  return caScore + examScore;
}

export function getGrade(total: number): string {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";

  return "F";
}

export function getRemark(total: number): string {
  if (total >= 70) return "Excellent";
  if (total >= 60) return "Very Good";
  if (total >= 50) return "Good";
  if (total >= 45) return "Fair";
  if (total >= 40) return "Pass";

  return "Fail";
}

// ==========================================
// VALIDATION
// ==========================================

export function validateCAScore(value: number): boolean {
  return value >= 0 && value <= 40;
}

export function validateExamScore(value: number): boolean {
  return value >= 0 && value <= 60;
}

export function validateTotal(total: number): boolean {
  return total >= 0 && total <= 100;
}

export function clampCAScore(value: number): number {
  if (value < 0) return 0;
  if (value > 40) return 40;

  return value;
}

export function clampExamScore(value: number): number {
  if (value < 0) return 0;
  if (value > 60) return 60;

  return value;
}

// ==========================================
// DISPLAY
// ==========================================

export function gradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "text-green-600";

    case "B":
      return "text-blue-600";

    case "C":
      return "text-yellow-600";

    case "D":
      return "text-orange-600";

    case "E":
      return "text-purple-600";

    default:
      return "text-red-600";
  }
}

export function gradeBadgeClass(grade: string): string {
  switch (grade) {
    case "A":
      return "bg-green-100 text-green-700";

    case "B":
      return "bg-blue-100 text-blue-700";

    case "C":
      return "bg-yellow-100 text-yellow-700";

    case "D":
      return "bg-orange-100 text-orange-700";

    case "E":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-red-100 text-red-700";
  }
}

// ==========================================
// SCORE HELPERS
// ==========================================

export function isPassing(total: number): boolean {
  return total >= 40;
}

export function emptyScore(value: string | number): number {
  if (value === "") return 0;

  return Number(value);
}

export function formatScore(score: number): string {
  return Number(score).toFixed(0);
}
