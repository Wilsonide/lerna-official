"use client";

import { memo, KeyboardEvent } from "react";
import clsx from "clsx";

interface ResultCellProps {
  value: number | "";
  field: "ca_score" | "exam_score";

  studentIndex: number;
  subjectIndex: number;

  onChange: (value: string) => void;
}

function ResultCell({
  value,
  field,
  studentIndex,
  subjectIndex,
  onChange,
}: ResultCellProps) {
  const max = field === "ca_score" ? 40 : 60;

  function move(row: number, col: number) {
    const next = document.querySelector<HTMLInputElement>(
      `[data-row="${row}"][data-col="${col}"]`,
    );

    next?.focus();
    next?.select();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        move(studentIndex, subjectIndex + 1);
        break;

      case "ArrowRight":
        e.preventDefault();
        move(studentIndex, subjectIndex + 1);
        break;

      case "ArrowLeft":
        e.preventDefault();
        move(studentIndex, subjectIndex - 1);
        break;

      case "ArrowDown":
        e.preventDefault();
        move(studentIndex + 1, subjectIndex);
        break;

      case "ArrowUp":
        e.preventDefault();
        move(studentIndex - 1, subjectIndex);
        break;
    }
  }

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
      onChange={(e) => {
        const v = e.target.value;

        if (v === "") {
          onChange("");
          return;
        }

        const num = Number(v);

        if (Number.isNaN(num)) return;

        if (num > max) return;

        if (num < 0) return;

        onChange(v);
      }}
      className={clsx(
        "h-10 w-20 rounded-md border text-center text-sm font-medium outline-none transition",

        value === "" ? "border-slate-300" : "border-green-500 bg-green-50",

        Number(value) > max && "border-red-500 bg-red-50",

        "focus:ring-2 focus:ring-blue-500",
      )}
    />
  );
}

export default memo(ResultCell);
