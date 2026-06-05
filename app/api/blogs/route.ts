import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { calculateReadingTime } from "@/lib/reading-time";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const blog = await prisma.blogPost.create({
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

        authorId: admin.id,
      },
    });

    return Response.json(blog);
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  const blogs = await prisma.blogPost.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(blogs);
}
