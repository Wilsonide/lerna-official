"use client";

import { CheckCircle2, Clock3, ShieldCheck, XCircle } from "lucide-react";

import { BatchStatus } from "./types";

interface Props {
  status?: BatchStatus;
}

export default function StatusBadge({ status }: Props) {
  if (!status) return null;

  switch (status) {
    case "DRAFT":
      return (
        <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 flex items-center gap-2">
          <Clock3 size={16} />
          Draft
        </div>
      );

    case "SUBMITTED":
      return (
        <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 flex items-center gap-2">
          <Clock3 size={16} />
          Submitted
        </div>
      );

    case "APPROVED":
      return (
        <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 flex items-center gap-2">
          <ShieldCheck size={16} />
          Approved
        </div>
      );

    case "REJECTED":
      return (
        <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 flex items-center gap-2">
          <XCircle size={16} />
          Rejected
        </div>
      );

    case "PUBLISHED":
      return (
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={16} />
          Published
        </div>
      );
  }
}
