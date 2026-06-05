import BlogForm from "@/components/admin/blog-form";
import { notFound } from "next/navigation";

async function getBlog(id: string) {
  const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

      <BlogForm blog={blog} />
    </div>
  );
}
