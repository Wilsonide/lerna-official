import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5),

  excerpt: z.string().min(10),

  content: z.string().min(20),

  coverImage: z.string().optional(),

  published: z.boolean().default(false),
});
