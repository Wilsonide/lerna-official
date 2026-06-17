export default function AccessToSystemsPage() {
  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="bg-[#f8fafc] py-28">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            School Systems
          </p>

          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
            Access to Systems
          </h1>

          <p className="mt-6 text-lg text-black/60 max-w-3xl leading-8">
            We design and implement structured academic and administrative
            systems that help schools operate efficiently, improve teaching
            quality, and maintain consistent performance across all levels.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="rounded-3xl border p-10 md:p-14 shadow-sm">
            <h2 className="text-3xl font-bold">What This Includes</h2>

            <ul className="mt-8 grid md:grid-cols-2 gap-4 text-black/70">
              <li>✓ ALF teaching framework implementation</li>
              <li>✓ Lesson planning structure & systems</li>
              <li>✓ Academic tracking and reporting tools</li>
              <li>✓ Staff performance monitoring systems</li>
              <li>✓ School-wide operational workflows</li>
              <li>✓ Continuous assessment frameworks</li>
            </ul>
          </div>

          <div className="rounded-3xl border p-10 md:p-14 bg-slate-50">
            <h2 className="text-3xl font-bold">Impact</h2>

            <p className="mt-5 text-black/60 leading-8">
              Schools benefit from improved coordination, reduced
              inefficiencies, and a more structured learning environment that
              supports both staff and students.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
