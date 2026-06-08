"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Heading2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] focus:outline-none px-2 py-3 text-gray-900 leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-2 rounded-md border transition ${
      active ? "bg-black text-white" : "bg-white hover:bg-gray-100"
    }`;

  return (
    <div className="border rounded-2xl bg-white overflow-hidden shadow-sm">
      {/* TOOLBAR */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          <ListOrdered size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          <Quote size={16} />
        </button>
      </div>

      {/* EDITOR */}
      <div className="p-4">
        <EditorContent
          editor={editor}
          className="prose max-w-none prose-p:leading-relaxed prose-li:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:text-gray-600"
        />
      </div>
    </div>
  );
}
