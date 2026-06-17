export default function AccessToResourcesPage() {
  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="bg-[#f8fafc] py-28">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            School Resources
          </p>

          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
            Access to Resources
          </h1>

          <p className="mt-6 text-lg text-black/60 max-w-3xl leading-8">
            We provide structured educational resources that strengthen
            teaching, improve learning outcomes, and support academic excellence
            across classrooms.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="rounded-3xl border p-10 md:p-14 shadow-sm">
            <h2 className="text-3xl font-bold">What You Get</h2>

            <ul className="mt-8 grid md:grid-cols-2 gap-4 text-black/70">
              <li>✓ Curriculum-aligned textbooks</li>
              <li>✓ Classroom learning materials</li>
              <li>✓ STEM kits and practical science tools</li>
              <li>✓ Literacy development resources</li>
              <li>✓ Library enhancement support</li>
              <li>✓ Digital learning materials</li>
              <li>✓ STEM innovation kits</li>
              <li>✓ Extracurricular activity resources</li>
              <li>✓ Indoor educational games</li>
              <li>✓ Mind teasers & brain development activities</li>
              <li>✓ Critical thinking enrichment tools</li>
              <li>✓ Creative learning support materials</li>
            </ul>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="https://lernabookshop.bumpa.shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-brand-blue px-6 py-3 text-white font-semibold hover:opacity-90 transition"
              >
                Visit Lerna Bookshop
              </a>
            </div>
          </div>

          <div className="rounded-3xl border p-10 md:p-14 bg-slate-50">
            <h2 className="text-3xl font-bold">Impact</h2>

            <p className="mt-5 text-black/60 leading-8">
              Schools gain access to structured, engaging, and practical
              learning resources that improve classroom delivery, strengthen
              student engagement, and promote deeper cognitive development
              across all learning stages.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
