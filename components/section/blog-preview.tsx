/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { BlogService } from "@/app/services/blog.services";

export default async function FeaturedPosts() {
  const posts = await BlogService.getFeaturedBlogs();

  if (!posts?.length) return null;

  return (
    <section className="py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="uppercase tracking-[0.3em] text-brand-blue text-sm font-semibold mb-4">
          Featured Articles
        </p>

        <h2 className="text-5xl font-bold">Insights For School Leaders</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blogs/${post.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-black/5 hover:shadow-xl transition"
            >
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-64 w-full object-cover"
                />
              )}

              <div className="p-6">
                <p className="text-sm text-brand-blue mb-3">
                  {post.reading_time} min read
                </p>

                <h3 className="text-2xl font-bold">{post.title}</h3>

                <p className="mt-4 text-black/60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
