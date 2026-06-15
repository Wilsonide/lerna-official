/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogService } from "@/app/services/blog.services";

export default function BlogPostClient() {
  const params = useParams();
  const id = params?.id as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await BlogService.getBlog(id);
        console.log("data ========", data);
        setBlog(data);

        // optional SEO in client
        if (data?.title) {
          document.title = data.seoTitle || data.title;
        }
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Blog not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold">{blog.title}</h1>

        <p className="mt-5 text-lg text-gray-600">{blog.excerpt}</p>

        <div className="flex gap-4 mt-6 text-sm text-gray-500">
          <span>{blog.readingTime} min read</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>

          {blog.author && (
            <span className="font-medium text-gray-700">
              By {blog.author.name}
            </span>
          )}
        </div>
      </header>

      {blog.cover_image && (
        <div className="max-w-5xl mx-auto px-6">
          <img
            src={blog?.cover_image}
            className="w-full h-[420px] object-cover rounded-3xl"
            alt={blog.title}
          />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-14">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      <div className="h-20" />
    </main>
  );
}
