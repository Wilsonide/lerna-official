"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "./image-upload";
import { toast } from "sonner";
import RichEditor from "./rich-editor";

type Props = {
  blog?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    coverImageId?: string | null;
    published: boolean;
    featured: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
  };
};

export default function BlogForm({ blog }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(blog?.title ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [content, setContent] = useState(blog?.content ?? "");

  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? "");
  const [coverImageId, setCoverImageId] = useState(blog?.coverImageId ?? "");

  const [published, setPublished] = useState(blog?.published ?? false);
  const [featured, setFeatured] = useState(blog?.featured ?? false);

  const [seoTitle, setSeoTitle] = useState(blog?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    blog?.seoDescription ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleImageUpload = async (file: File) => {
    const toastId = toast.loading("Uploading image...");

    try {
      setUploading(true);

      const result = await uploadImage(file);

      setCoverImage(result.url);
      setCoverImageId(result.public_id);

      toast.success("Image uploaded", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  async function handleSubmit() {
    const toastId = toast.loading("Publishing blog...");

    setLoading(true);

    const endpoint = blog ? `/api/blogs/${blog.id}` : "/api/blogs";
    const method = blog ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage,
          coverImageId,
          published,
          featured,
          seoTitle,
          seoDescription,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Blog published", { id: toastId });

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled blog..."
          className="w-full text-4xl font-bold outline-none bg-transparent"
        />

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Write a short summary..."
          className="w-full text-lg text-gray-500 outline-none resize-none"
        />
      </div>

      {/* COVER IMAGE */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-600">Cover Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await handleImageUpload(file);
          }}
          className="w-full border rounded-xl p-3"
        />

        {uploading && <p className="text-sm text-blue-500">Uploading...</p>}

        {coverImage && (
          <div className="relative w-full max-w-md">
            <Image
              src={coverImage}
              alt="cover"
              width={600}
              height={350}
              className="rounded-2xl object-cover border"
            />

            <button
              onClick={() => {
                setCoverImage("");
                setCoverImageId("");
              }}
              className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs"
            >
              remove
            </button>
          </div>
        )}
      </div>

      {/* CONTENT (NOTION STYLE BLOCK) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Content</label>

        <div className="rounded-2xl border bg-white p-2">
          <RichEditor value={content} onChange={setContent} />
        </div>
      </div>

      {/* SEO (COLLAPSIBLE FEEL SECTION) */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600">SEO Settings</h3>

        <input
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder="SEO Title"
          className="w-full border rounded-xl p-3"
        />

        <textarea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          placeholder="SEO Description"
          className="w-full border rounded-xl p-3 h-24"
        />
      </div>

      {/* OPTIONS */}
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publish
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured
        </label>
      </div>

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-black/90 transition"
      >
        {loading ? "Publishing..." : "Publish Blog"}
      </button>
    </div>
  );
}
