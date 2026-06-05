/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import DeleteBlogButton from "@/components/admin/delete-blog-button";

async function getBlogs() {
  const res = await fetch("http://localhost:3000/api/blogs", {
    cache: "no-store",
  });

  return res.json();
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your published content
          </p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-black/90 transition"
        >
          + Create Blog
        </Link>
      </div>

      {/* EMPTY STATE */}
      {blogs.length === 0 ? (
        <div className="border rounded-2xl p-12 text-center bg-gray-50">
          <div className="text-5xl">📝</div>
          <h2 className="mt-4 text-xl font-semibold">No blogs found</h2>
          <p className="text-gray-500 mt-2">
            Start creating blog post to see it here.
          </p>
        </div>
      ) : (
        /* BLOG LIST */
        <div className="space-y-3">
          {blogs.map((blog: any) => (
            <div
              key={blog.id}
              className="group flex items-center justify-between border rounded-xl p-5 bg-white hover:shadow-sm transition"
            >
              {/* LEFT CONTENT */}
              <Link href={`/admin/blogs/${blog.id}`} className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-lg group-hover:text-black/70 transition">
                    {blog.title}
                  </h2>

                  {/* STATUS BADGE */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      blog.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {blog.excerpt}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </Link>

              {/* ACTIONS */}
              <div className="flex items-center gap-4 ml-6">
                <Link
                  href={`/admin/blogs/${blog.id}`}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  Edit
                </Link>

                <DeleteBlogButton id={blog.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
