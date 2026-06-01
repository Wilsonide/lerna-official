export default function Resources() {
  return (
    <section className="relative overflow-hidden py-28 bg-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-brand-blue text-sm font-semibold mb-4">
            Books & Resources
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight text-brand-black">
            Educational Resources That Inspire Learning
          </h2>

          <p className="mt-8 text-lg leading-8 text-black/60">
            Discover carefully selected books, literacy materials, classroom
            resources, STEM activity books, children&apos;s novels, picture
            books, and curriculum support materials designed to help learners
            thrive.
          </p>
        </div>

        {/* Feature Card */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-[40px] border border-black/5 bg-gradient-to-br from-brand-blue to-brand-blue/90 p-10 md:p-14 text-white shadow-[0_25px_80px_rgba(59,113,232,0.2)]">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <p className="uppercase tracking-[0.25em] text-white/70 text-sm font-semibold">
                Lerna Bookstore
              </p>

              <h3 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                Everything Your Learners Need In One Place
              </h3>

              <p className="mt-6 text-white/80 text-lg leading-8 max-w-2xl">
                From early readers and phonics resources to reference books,
                children&apos;s literature, STEM resources, and complete library
                solutions, our bookstore provides quality educational materials
                for schools, teachers, parents, and learners.
              </p>

              <div className="mt-10">
                <a
                  href="https://lernabookshop.bumpa.shop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-brand-blue transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Visit Our Bookstore
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
