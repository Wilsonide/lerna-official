import { CalendarDays } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function DashboardHeader({ title, subtitle, badge }: Props) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-gradient-to-r from-background to-muted/30 p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

          {badge && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 shadow-sm">
        <CalendarDays className="h-5 w-5 text-primary" />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Today
          </p>

          <p className="font-medium">{today}</p>
        </div>
      </div>
    </div>
  );
}
