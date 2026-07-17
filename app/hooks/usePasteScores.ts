"use client";

interface Props {
  updateCell: (
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score",
    value: string,
  ) => void;

  students: {
    id: string;
  }[];

  subjects: {
    id: string;
  }[];
}

export function usePasteScores({ updateCell, students, subjects }: Props) {
  function handlePaste(
    e: React.ClipboardEvent<HTMLInputElement>,
    startStudent: number,
    startSubject: number,
    field: "ca_score" | "exam_score",
  ) {
    e.preventDefault();

    const text = e.clipboardData.getData("text");

    const rows = text
      .trim()
      .split("\n")
      .map((r) => r.split("\t"));

    rows.forEach((cols, rowIndex) => {
      cols.forEach((value, colIndex) => {
        const student = students[startStudent + rowIndex];

        const subject = subjects[startSubject + Math.floor(colIndex / 2)];

        if (!student || !subject) return;

        const currentField = colIndex % 2 === 0 ? "ca_score" : "exam_score";

        updateCell(student.id, subject.id, currentField, value);
      });
    });
  }

  return {
    handlePaste,
  };
}
