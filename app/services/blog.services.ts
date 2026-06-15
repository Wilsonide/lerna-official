/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export const BlogService = {
  // 📌 Create blog
  createBlog: async (data: any) => {
    const { data: res } = await api.post("/blogs", data);
    return res;
  },

  // 📌 Get all blogs
  getBlogs: async () => {
    const { data } = await api.get("/blogs");
    return data;
  },

  // 📌 Get featured blogs
  getFeaturedBlogs: async () => {
    const { data } = await api.get("/blogs/featured");
    return data;
  },

  // 📌 Get single blog
  getBlog: async (id: string) => {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
  },

  // 📌 Update blog
  updateBlog: async (id: string, data: any) => {
    const { data: res } = await api.patch(`/blogs/${id}`, data);
    return res;
  },

  // 📌 Delete blog
  deleteBlog: async (id: string) => {
    const { data: res } = await api.delete(`/blogs/${id}`);
    return res;
  },
};
