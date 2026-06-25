import { BookOpen } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-xl border bg-white py-20 text-center">
      <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

      <h3 className="font-semibold">{title}</h3>

      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
