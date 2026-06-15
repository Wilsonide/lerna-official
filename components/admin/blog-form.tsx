/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { uploadImage } from "./image-upload";
import RichEditor from "./rich-editor";
import { BlogService } from "@/app/services/blog.services";

type Props = {
  blog?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    cover_image_id?: string | null;
    published: boolean;
    featured: boolean;
    seo_title: string | null;
    seo_description: string | null;
  };
};

export default function BlogForm({ blog }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(blog?.title ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [content, setContent] = useState(blog?.content ?? "");

  const [coverImage, setCoverImage] = useState(blog?.cover_image ?? "");
  const [coverImageId, setCoverImageId] = useState(blog?.cover_image_id ?? "");

  const [published, setPublished] = useState(blog?.published ?? false);
  const [featured, setFeatured] = useState(blog?.featured ?? false);

  const [seoTitle, setSeoTitle] = useState(blog?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    blog?.seo_description ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    const toastId = toast.loading("Uploading image...");

    try {
      setUploading(true);

      const result = await uploadImage(file);

      setCoverImage(result.url);
      setCoverImageId(result.public_id);

      toast.success("Image uploaded", { id: toastId });
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  async function handleSubmit() {
    const toastId = toast.loading("Publishing blog...");
    setLoading(true);

    try {
      const payload = {
        title,
        excerpt,
        content,
        coverImage,
        coverImageId,
        published,
        featured,
        seoTitle,
        seoDescription,
      };

      if (blog) {
        await BlogService.updateBlog(blog.id, payload);
      } else {
        await BlogService.createBlog(payload);
      }

      toast.success("Blog saved", { id: toastId });

      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save blog", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-10">
      {/* HEADER */}
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled blog..."
          className="w-full text-4xl md:text-5xl font-bold outline-none bg-transparent placeholder:text-gray-300 tracking-tight"
        />

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Write a short summary..."
          className="w-full text-lg text-gray-500 outline-none resize-none bg-transparent placeholder:text-gray-300"
        />
      </div>

      {/* COVER IMAGE */}
      <div className="space-y-4 p-5 border rounded-2xl bg-white shadow-sm">
        <label className="text-sm font-semibold text-gray-600">
          Cover Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await handleImageUpload(file);
          }}
          className="w-full text-sm border border-dashed rounded-xl p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        />

        {uploading && (
          <p className="text-sm text-blue-500 animate-pulse">
            Uploading image...
          </p>
        )}

        {coverImage && (
          <div className="relative w-full max-w-md group">
            <Image
              src={coverImage}
              alt="cover"
              width={600}
              height={350}
              className="rounded-2xl object-cover border shadow-sm"
            />

            <button
              onClick={() => {
                setCoverImage("");
                setCoverImageId("");
              }}
              className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="space-y-3 p-5 border rounded-2xl bg-white shadow-sm">
        <label className="text-sm font-semibold text-gray-600">Content</label>

        <div className="rounded-xl border bg-gray-50 p-3 focus-within:ring-2 focus-within:ring-black/10">
          <RichEditor value={content} onChange={setContent} />
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-4 border-t pt-8">
        <h3 className="text-sm font-semibold text-gray-600 tracking-wide">
          SEO Settings
        </h3>

        <div className="space-y-3">
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO Title"
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black/10 transition"
          />

          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="SEO Description"
            className="w-full border rounded-xl p-3 h-28 outline-none focus:ring-2 focus:ring-black/10 transition"
          />
        </div>
      </div>

      {/* OPTIONS */}
      <div className="flex flex-wrap gap-6 text-sm p-4 border rounded-xl bg-gray-50">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="accent-black"
          />
          <span className="text-gray-700">Publish</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-black"
          />
          <span className="text-gray-700">Featured</span>
        </label>
      </div>

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full md:w-auto px-8 py-3 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition active:scale-[0.99] disabled:opacity-60"
      >
        {loading ? "Publishing..." : "Publish Blog"}
      </button>
    </div>
  );
}
