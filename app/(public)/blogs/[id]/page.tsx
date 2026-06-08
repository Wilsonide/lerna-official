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
  const blog = await prisma.blogPost.findFirst({
    where: {
      id: params.id,
      published: true,
    },
    include: {
      author: true,
    },
  });

  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          {blog.title}
        </h1>

        <p className="mt-5 text-lg text-gray-600 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* META */}
        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500">
          <span>{blog.readingTime} min read</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>

          {blog.author && (
            <>
              <span>•</span>
              <span className="font-medium text-gray-700">
                By {blog.author.name}
              </span>
            </>
          )}
        </div>
      </header>

      {/* COVER IMAGE */}
      {blog.coverImage && (
        <div className="max-w-5xl mx-auto px-6">
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <article className="max-w-3xl mx-auto px-6 py-14">
        <div
          className="prose prose-lg prose-gray max-w-none
          prose-headings:font-bold
          prose-h2:text-2xl
          prose-h3:text-xl
          prose-p:leading-7
          prose-p:text-gray-700
          prose-blockquote:border-l-4
          prose-blockquote:border-gray-300
          prose-blockquote:pl-4
          prose-blockquote:italic
          prose-a:text-blue-600"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </article>

      {/* FOOTER SPACING */}
      <div className="h-20" />
    </main>
  );
}
