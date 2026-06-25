"use client";

interface Props {
  url: string;
  title: string;
}

export function LessonPdfViewer({ url, title }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <iframe
        src={`${url}#toolbar=1`}
        title={title}
        className="w-full h-[800px]"
      />
    </div>
  );
}
