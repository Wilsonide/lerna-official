type Props = {
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
};

export default function ResultStatusBadge({ status }: Props) {
  const styles = {
    DRAFT: "bg-gray-100 text-gray-700",

    SUBMITTED: "bg-yellow-100 text-yellow-700",

    APPROVED: "bg-green-100 text-green-700",

    REJECTED: "bg-red-100 text-red-700",

    PUBLISHED: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
