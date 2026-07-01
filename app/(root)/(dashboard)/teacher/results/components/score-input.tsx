"use client";

type Props = {
  value: number;
  max: number;
  invalid?: boolean;

  onChange: (value: number) => void;
};

export default function ScoreInput({ value, max, invalid, onChange }: Props) {
  return (
    <input
      type="number"
      value={value}
      min={0}
      max={max}
      onChange={(e) => {
        const val = Number(e.target.value);

        // hard clamp to prevent invalid values
        const safeValue = Math.max(0, Math.min(max, val));

        onChange(safeValue);
      }}
      className={`w-20 rounded border px-2 py-1 text-sm outline-none transition
        ${
          invalid
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:border-black"
        }`}
    />
  );
}
