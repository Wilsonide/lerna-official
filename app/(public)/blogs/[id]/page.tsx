import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const blog = await prisma.blogPost.findFirst({
    where: {
      id: params.id,
      published: true,
    },
  });

  if (!blog) return {};

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,

    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const blog = await prisma.blogPost.findUnique({
    where: {
      id: params.id,
      published: true, // 🔥 IMPORTANT: hide drafts
    },
    include: {
      author: true,
    },
  });

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold">{blog.title}</h1>

        <div className="flex gap-6 mt-6 text-black/50 text-sm">
          <span>{blog.readingTime} min read</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-[500px] object-cover rounded-3xl"
        />
      )}

      <div
        className="prose prose-lg max-w-none mt-12"
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />
    </main>
  );
}
