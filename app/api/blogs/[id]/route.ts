import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { v2 as cloudinary } from "cloudinary";
import { calculateReadingTime } from "@/lib/reading-time";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* =========================
   GET SINGLE BLOG
========================= */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing ID" }, { status: 400 });
  }

  const blog = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!blog) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(blog);
}

/* =========================
   UPDATE BLOG
========================= */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();

  const { id } = await params;
  const body = await request.json();

  const blog = await prisma.blogPost.update({
    where: { id },

    data: {
      title: body.title,

      slug: slugify(body.title, {
        lower: true,
        strict: true,
      }),

      excerpt: body.excerpt,
      content: body.content,

      coverImage: body.coverImage,
      coverImageId: body.coverImageId,

      published: body.published,
      featured: body.featured,

      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,

      readingTime: calculateReadingTime(body.content),
    },
  });

  return Response.json(blog);
}

/* =========================
   DELETE BLOG
========================= */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();

  const { id } = await params;

  const blog = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!blog) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (blog.coverImageId) {
    await cloudinary.uploader.destroy(blog.coverImageId);
  }

  await prisma.blogPost.delete({
    where: { id },
  });

  return Response.json({ success: true });
}
