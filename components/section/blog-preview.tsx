"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const initialPosts = [
  {
    id: 1,
    title:
      "5 Strategies High-Performing Schools Use to Improve Learning Outcomes",
    excerpt:
      "Discover practical approaches successful schools implement to strengthen teaching quality, student engagement, and academic performance.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    date: "June 2026",
  },
  {
    id: 2,
    title:
      "Why Teacher Development Remains the Greatest Investment in Education",
    excerpt:
      "Explore how continuous professional development empowers teachers and directly influences student achievement.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    date: "May 2026",
  },
  {
    id: 3,
    title: "Building a Modern School: Systems Every Institution Needs",
    excerpt:
      "From administration to curriculum delivery, learn how structured systems help schools operate more efficiently and sustainably.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    date: "May 2026",
  },
];

export default function BlogPreview() {
  const [posts, setPosts] = useState(initialPosts);

  // Simulated DB polling every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // 🔥 simulate a new post coming from DB
      const newPost = {
        id: Date.now(),
        title: "New Educational Insight Just Published",
        excerpt:
          "A fresh update from our education research team exploring modern school transformation strategies.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
        date: "Just now",
      };

      setPosts((prev) => {
        const updated = [newPost, ...prev];

        // keep UI clean (max 6 posts in slider)
        return updated.slice(0, 6);
      });
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
              Blogs & Articles
            </p>

            <h2 className="mt-5 text-4xl md:text-5xl font-bold text-brand-black leading-tight">
              Educational Insights for School Leaders
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/60">
              Explore practical insights, leadership strategies, and
              professional guidance designed to help schools strengthen learning
              outcomes and institutional performance.
            </p>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 font-semibold text-brand-blue hover:gap-3 transition-all"
          >
            View All Blogs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* SLIDING WINDOW CAROUSEL */}
        <div className="relative">
          <div className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="min-w-[85%] md:min-w-[45%] lg:min-w-[32%] snap-start group overflow-hidden rounded-[32px] bg-white border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <span className="rounded-full bg-white/90 backdrop-blur px-4 py-2 text-xs font-semibold text-brand-blue">
                      Education Insight
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-sm text-black/50 font-medium">
                    {post.date}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold leading-tight text-brand-black group-hover:text-brand-blue transition-colors">
                    {post.title}
                  </h3>

                  <p className="mt-4 text-black/60 leading-7">{post.excerpt}</p>

                  <Link
                    href={`/blogs/${post.id}`}
                    className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-blue"
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* subtle fade edges (premium UX feel) */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#f8fafc] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#f8fafc] to-transparent" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-black/60 text-lg">
            Stay updated with insights that improve teaching, leadership, and
            school growth.
          </p>

          <Link
            href="/blogs"
            className="inline-flex items-center mt-8 rounded-full border border-brand-blue/20 px-8 py-4 font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-300"
          >
            Explore All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
