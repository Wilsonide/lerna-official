import { LucideIcon, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: string;

  color?: "blue" | "green" | "purple" | "amber" | "red" | "indigo" | "emerald";
}

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    ring: "ring-blue-200",
    progress: "bg-blue-500",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    ring: "ring-green-200",
    progress: "bg-green-500",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    ring: "ring-emerald-200",
    progress: "bg-emerald-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    ring: "ring-purple-200",
    progress: "bg-purple-500",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    ring: "ring-indigo-200",
    progress: "bg-indigo-500",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    ring: "ring-amber-200",
    progress: "bg-amber-500",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    ring: "ring-red-200",
    progress: "bg-red-500",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "blue",
}: Props) {
  const styles = colorMap[color];

  return (
    <Card className="group relative overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Accent Bar */}
      <div className={`absolute left-0 top-0 h-1 w-full ${styles.progress}`} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">{value}</h2>

            {description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}

            {trend && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                <TrendingUp className="h-3.5 w-3.5" />
                {trend}
              </div>
            )}
          </div>

          {Icon && (
            <div
              className={`
                ${styles.bg}
                ${styles.ring}
                flex h-16 w-16 items-center justify-center
                rounded-2xl ring-1
                transition-all duration-300
                group-hover:scale-110
                group-hover:rotate-6
              `}
            >
              <Icon className={`h-8 w-8 ${styles.text}`} />
            </div>
          )}
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`${styles.progress} h-full w-2/3 rounded-full transition-all duration-500 group-hover:w-full`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
