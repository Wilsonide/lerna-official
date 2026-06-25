import EmptyState from "@/components/teacher/empty-state";
import { useAcademicPeriod } from "../hooks/use-academic-period";

export function AcademicPeriodGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, term, loading } = useAcademicPeriod();

  if (loading) return null;

  if (!session) {
    return (
      <EmptyState
        title="No Active Session"
        description="Create and activate an academic session first."
      />
    );
  }

  if (!term) {
    return (
      <EmptyState
        title="No Active Term"
        description="Create and activate a term first."
      />
    );
  }

  return <>{children}</>;
}
