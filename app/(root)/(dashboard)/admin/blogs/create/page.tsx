import BlogForm from "@/components/admin/blog-form";

export default function CreateBlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Create Blog
          </h1>
          <p className="text-sm text-gray-500">
            Write and publish a new article
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white border rounded-2xl shadow-sm">
          <div className="p-6 md:p-8">
            <BlogForm />
          </div>
        </div>
      </div>
    </div>
  );
}
