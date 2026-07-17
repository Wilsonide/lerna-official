"use client";

import { memo, KeyboardEvent } from "react";
import clsx from "clsx";

interface ResultCellProps {
  editable: boolean;

  value: number | "";

  field: "ca_score" | "exam_score";

  studentIndex: number;

  subjectIndex: number;

  onChange: (value: string) => void;
}

function ResultCell({
  editable,
  value,
  field,
  studentIndex,
  subjectIndex,
  onChange,
}: ResultCellProps) {
  const max = field === "ca_score" ? 40 : 60;

  // -----------------------------
  // READ ONLY
  // -----------------------------

  if (!editable) {
    return (
      <div
        className={clsx(
          "flex h-11 w-24 items-center justify-center rounded-md border text-sm font-semibold",

          value === "" ? "bg-slate-50 text-slate-400" : "bg-slate-100",
        )}
      >
        {value === "" ? "-" : value}
      </div>
    );
  }

  // -----------------------------
  // KEYBOARD NAVIGATION
  // -----------------------------

  function move(row: number, col: number) {
    const next = document.querySelector<HTMLInputElement>(
      `[data-row="${row}"][data-col="${col}"]`,
    );

    if (!next) return;

    next.focus();

    next.select();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();

        move(studentIndex + 1, subjectIndex);

        break;

      case "ArrowDown":
        e.preventDefault();

        move(studentIndex + 1, subjectIndex);

        break;

      case "ArrowUp":
        e.preventDefault();

        move(studentIndex - 1, subjectIndex);

        break;

      case "ArrowLeft":
        e.preventDefault();

        move(studentIndex, subjectIndex - 1);

        break;

      case "ArrowRight":
        e.preventDefault();

        move(studentIndex, subjectIndex + 1);

        break;
    }
  }

  // -----------------------------
  // CHANGE
  // -----------------------------

  function handleChange(value: string) {
    if (value === "") {
      onChange("");

      return;
    }

    const num = Number(value);

    if (Number.isNaN(num)) return;

    if (num < 0) return;

    if (num > max) return;

    onChange(value);
  }

  const invalid = value !== "" && Number(value) > max;

  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      min={0}
      max={max}
      data-row={studentIndex}
      data-col={subjectIndex}
      onFocus={(e) => e.target.select()}
      onKeyDown={handleKeyDown}
      onChange={(e) => handleChange(e.target.value)}
      className={clsx(
        "h-11 w-24 rounded-md border text-center text-sm font-semibold outline-none transition",

        invalid && "border-red-500 bg-red-50 text-red-700",

        !invalid && value !== "" && "border-green-500 bg-green-50",

        value === "" && "border-slate-300 bg-white",

        "focus:border-primary focus:ring-2 focus:ring-primary/30",
      )}
    />
  );
}

export default memo(ResultCell);
