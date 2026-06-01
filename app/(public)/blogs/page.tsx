import Link from "next/link";

const posts = [
  {
    title: "How Schools Can Improve Academic Performance in 2026",
    excerpt:
      "A practical guide to improving teaching quality, student outcomes, and academic tracking systems.",
    slug: "improving-academic-performance",
  },
  {
    title: "Why School Management Systems Are No Longer Optional",
    excerpt:
      "Discover how digital systems are transforming modern education administration.",
    slug: "importance-of-school-management-systems",
  },
  {
    title: "Building a Strong School Brand Online",
    excerpt:
      "Learn how schools can attract more parents and students through digital presence.",
    slug: "school-branding-online",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="bg-[#f8fafc] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            Blog & Insights
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
            Insights, strategies, and ideas for modern school improvement.
          </h1>

          <p className="mt-8 max-w-3xl text-lg text-black/60 leading-8">
            Explore practical articles on school management, teaching
            strategies, digital transformation, and educational leadership.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-8 rounded-3xl border border-black/5 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 mb-5" />

              <h2 className="text-xl font-semibold group-hover:text-brand-blue transition">
                {post.title}
              </h2>

              <p className="mt-4 text-black/60 leading-7">{post.excerpt}</p>

              <span className="inline-flex mt-6 text-sm font-medium text-brand-blue">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
