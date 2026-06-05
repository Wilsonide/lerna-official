"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "./image-upload";
import { toast } from "sonner";

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
  // IMAGE UPLOAD (SONNER ADDED)
  // =========================
  const handleImageUpload = async (file: File) => {
    const toastId = toast.loading("Uploading image...");

    try {
      setUploading(true);

      const result = await uploadImage(file);

      setCoverImage(result.url);
      setCoverImageId(result.public_id);

      toast.success("Image uploaded successfully", {
        id: toastId,
      });
    } catch (err) {
      console.error("Upload failed:", err);

      toast.error("Image upload failed", {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // SUBMIT BLOG (SONNER ADDED)
  // =========================
  async function handleSubmit() {
    const toastId = toast.loading("Saving blog...");

    setLoading(true);

    const endpoint = blog ? `/api/blogs/${blog.id}` : "/api/blogs";
    const method = blog ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
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

      if (!res.ok) {
        throw new Error("Failed to save blog");
      }

      toast.success("Blog saved successfully", {
        id: toastId,
      });

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      console.error(err);

      toast.error("Failed to save blog", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
        className="w-full border rounded-xl p-4"
      />

      {/* COVER IMAGE */}
      <div className="space-y-3">
        <label className="block font-medium">Cover Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            await handleImageUpload(file);
          }}
          className="w-full border rounded-xl p-4"
        />

        {uploading && (
          <p className="text-sm text-blue-500">Uploading image...</p>
        )}

        {coverImage && (
          <div className="relative w-52">
            <Image
              src={coverImage}
              alt="cover"
              width={208}
              height={140}
              className="rounded-xl border object-cover"
            />

            <button
              type="button"
              onClick={() => {
                setCoverImage("");
                setCoverImageId("");
              }}
              className="absolute right-2 top-2 rounded-full bg-black p-1 text-white"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* EXCERPT */}
      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Short excerpt for blog preview..."
        className="w-full border rounded-xl p-4 h-32"
      />

      {/* CONTENT */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your blog content here..."
        className="w-full border rounded-xl p-4 h-72"
      />

      {/* SEO */}
      <input
        value={seoTitle}
        onChange={(e) => setSeoTitle(e.target.value)}
        placeholder="SEO Title"
        className="w-full border rounded-xl p-4"
      />

      <textarea
        value={seoDescription}
        onChange={(e) => setSeoDescription(e.target.value)}
        placeholder="SEO Description"
        className="w-full border rounded-xl p-4 h-28"
      />

      {/* OPTIONS */}
      <div className="flex gap-8">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured Post
        </label>
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-brand-blue text-white px-6 py-3 rounded-xl"
      >
        {loading ? "Saving..." : "Save Blog"}
      </button>
    </div>
  );
}
